import Message from '../models/message.model.js';
import { v4 as uuidv4 } from 'uuid';
import ApiError from '../utils/ApiError.js';
import messageQueue from '../jobs/message.queue.js';

export const createMessage = async (data) => {
  try {
    const { user_id, nickname, message } = data;

    if (!message) {
      throw new ApiError(400, "message is required");
    }

    const tracking_id = uuidv4();

    const newMessage = await Message.create({
      nickname: nickname || 'anonymous_user',
      user_id,
      message,
      tracking_id,
      status: 'PENDING',
    });

    await messageQueue.add(
    'process-message',
    {
      message_id: newMessage._id.toString(),
      user_id,
      message,
    },
    {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    }
  );
    
    return {
      tracking_id,
      message_id: newMessage._id,
    };

  } catch (error) {
    console.error('Service error:', error);
    throw error;
  }
};

export const getMessageStatus = async (message_id) => {
  const message = await Message.findOne({
    tracking_id: message_id,
  });

  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  return {
    tracking_id: message.tracking_id,
    nickname: message.nickname,
    status: message.status,

    message: message.message,

    sentiment: message.sentiment,
    confidence: message.confidence,

    risk: message.risk,
    risk_trend: message.risk_trend,

    action: message.action,
    decision_reason: message.decision_reason,

  };
};