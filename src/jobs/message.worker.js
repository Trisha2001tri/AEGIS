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
    //  Update status to PROCESSING
    // ==================================================

    await Message.findByIdAndUpdate(message_id, {
      status: 'PROCESSING',
    });

    // ==================================================
    //  Fetch previous history
    // ==================================================

    const history = await Message.find({
      user_id,
      _id: { $ne: message_id },
    })
      .sort({ createdAt: -1 })
      .limit(5);

    try {
      // ==================================================
      // HARD RISK DETECTION
      // ==================================================

      const hardRiskDetected = detectHardRisk(message);

      if (hardRiskDetected) {
        console.log('🚨 HARD RISK DETECTED');

        // Save directly
        await Message.findByIdAndUpdate(message_id, {
          status: 'PROCESSED',

          sentiment: 'negative',
          confidence: 1,

          risk: 'HIGH',
          risk_trend: 'INCREASING',

          action: 'ESCALATE',
          decision_reason: 'Critical phrase detected',

          result: 'negative',
        });

        // ==================================================
        // TRIGGER SOS QUEUE
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
      //BUILD AI PROMPT
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
      //  SAVE RESULT
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
      });

      console.log('✅ Message processed successfully');

      // ==================================================
      //  AI BASED SOS TRIGGER
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
      // FALLBACK ENGINE
      // ==================================================

      const fallback = fallbackRiskEngine(message, history);

      console.log('🛟 FALLBACK ACTIVATED:', fallback);

      // ==================================================
      // SAVE FALLBACK RESULT
      // ==================================================

      await Message.findByIdAndUpdate(message_id, {
        status: 'PROCESSED',

        sentiment: fallback.sentiment,
        confidence: fallback.confidence,

        risk: fallback.risk,
        risk_trend: fallback.trend,

        action: fallback.action,
        decision_reason: fallback.decision_reason,

        result: fallback.sentiment,
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