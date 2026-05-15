import { Worker } from 'bullmq';
import sosQueue from './sos.queue.js';

import redisConnection from '../config/redis.js';
import Message from '../models/message.model.js';

import { GoogleGenAI } from '@google/genai';

import {
  detectHardRisk,
  buildAIPrompt,
  parseAIResponse,
  validateAIResponse,
 fallbackRiskEngine,
} from '../services/decision.service.js';

console.log('🚀 Message Worker Started');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const worker = new Worker(
  'message-queue',

  async (job) => {

    const { message_id, message, user_id } = job.data;

    console.log('🔥 Processing:', message);

    // ==================================================
    // UPDATE STATUS
    // ==================================================

    await Message.findByIdAndUpdate(message_id, {
      status: 'PROCESSING',
    });

    // ==================================================
    // FETCH HISTORY
    // ==================================================

    const history = await Message.find({
      user_id: user_id,
      _id: { $ne: message_id },
    })
      .sort({ createdAt: -1 })
      .limit(5);

    console.log('📜 Message history fetched:', history.length, 'messages');

    try {

      // ==================================================
      // HARD RISK DETECTION
      // ==================================================

      const hardRiskDetected = detectHardRisk(message);

      if (hardRiskDetected) {

        console.log('🚨 HARD RISK DETECTED');

        await Message.findByIdAndUpdate(message_id, {

          status: 'PROCESSED',

          sentiment: 'negative',
          confidence: 1,

          risk: 'HIGH',
          risk_trend: 'INCREASING',

          action: 'ESCALATE',
          decision_reason: 'Critical phrase detected',

          result: 'negative',

          system_note: 'Hard risk keyword detected instantly.',
        });

        // ==================================================
        // SOS QUEUE
        // ==================================================

        await sosQueue.add('trigger-sos', {
          user_id,
          tracking_id: message_id,
          message,

          risk: 'HIGH',
          action: 'ESCALATE',

          reason: 'Critical phrase detected',
        });

        console.log('🚨 SOS QUEUE TRIGGERED');

        return;
      }

      // ==================================================
      // BUILD PROMPT
      // ==================================================

      const prompt = buildAIPrompt(message, history);

      // ==================================================
      // AI REQUEST
      // ==================================================

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',

        contents: [
          {
            role: 'user',
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      });

      const rawText =
        response.text ||
        response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        '';

      console.log('🧠 RAW AI RESPONSE:\n', rawText);

      // ==================================================
      // PARSE AI RESPONSE
      // ==================================================

      const parsedResponse = parseAIResponse(rawText);

      // ==================================================
      // VALIDATE AI RESPONSE
      // ==================================================

      const isValid = validateAIResponse(parsedResponse);

      if (!isValid) {
        throw new Error('AI response validation failed');
      }

      console.log('✅ Parsed AI Response:', parsedResponse);

      // ==================================================
      // SAVE RESULT
      // ==================================================

      await Message.findByIdAndUpdate(message_id, {

        status: 'PROCESSED',

        sentiment: parsedResponse.sentiment,
        confidence: parsedResponse.confidence,

        risk: parsedResponse.risk,
        risk_trend: parsedResponse.trend,

        action: parsedResponse.action,
        decision_reason: parsedResponse.decision_reason,

        result: parsedResponse.sentiment,

        retry_count: 0,

        system_note: 'AI processed successfully.',

        last_error: null,
      });

      console.log('✅ Message processed successfully');

      // ==================================================
      // AI BASED SOS TRIGGER
      // ==================================================

      if (
        parsedResponse.risk === 'HIGH' ||
        parsedResponse.action === 'ESCALATE'
      ) {

        await sosQueue.add('trigger-sos', {
          user_id,
          tracking_id: message_id,
          message,

          risk: parsedResponse.risk,
          action: parsedResponse.action,

          reason: parsedResponse.decision_reason,
        });

        console.log('🚨 SOS QUEUE TRIGGERED');
      }

    } catch (error) {

      console.error('❌ AI FAILED:', error.message);

      // ==================================================
      // RETRY LOGIC
      // ==================================================

      console.log(`❌ Attempt ${job.attemptsMade + 1} failed`);

      if (job.attemptsMade < job.opts.attempts - 1) {

        await Message.findByIdAndUpdate(message_id, {

          status: 'RETRYING',

          retry_count: job.attemptsMade + 1,

          system_note: `AI request failed. Retry ${
            job.attemptsMade + 1
          } scheduled.`,

          last_error: error.message,
        });

        console.log(
          `🔁 Retrying message (${job.attemptsMade + 1}/${job.opts.attempts})`
        );

        throw error;
      }

      // ==================================================
      // FINAL FAILURE → FALLBACK ENGINE
      // ==================================================
     
      console.log('🛟 FALLBACK ACTIVATED');
      
      const fallback = fallbackRiskEngine(message, history);

      console.log('🛟 FALLBACK RESULT:', fallback);

      // ==================================================
      // SAVE FALLBACK RESULT
      // ==================================================

      await Message.findByIdAndUpdate(message_id, {

        status: 'AI_FAILED_FALLBACK_USED',

        sentiment: fallback.sentiment,
        confidence: fallback.confidence,

        risk: fallback.risk,
        risk_trend: fallback.trend,

        action: fallback.action,
        decision_reason: fallback.decision_reason,

        result: fallback.sentiment,

        retry_count: job.attemptsMade + 1,

        system_note:
          'Primary AI failed after multiple retries. Fallback engine activated.',

        last_error: error.message,
      });

      // ==================================================
      // FALLBACK SOS TRIGGER
      // ==================================================

      if (
        fallback.risk === 'HIGH' ||
        fallback.action === 'ESCALATE'
      ) {

        await sosQueue.add('trigger-sos', {
          user_id,
          tracking_id: message_id,
          message,

          risk: fallback.risk,
          action: fallback.action,

          reason: fallback.decision_reason,
        });

        console.log('🚨 SOS QUEUE TRIGGERED FROM FALLBACK');
      }
    }
  },

  {
    connection: redisConnection,
  }
);

export default worker;