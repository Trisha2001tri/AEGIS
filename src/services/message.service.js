import Message from '../models/message.model.js';
import { v4 as uuidv4 } from 'uuid';
import ApiError from '../utils/ApiError.js';
import messageQueue from '../jobs/message.queue.js';

export const createMessage = async (data) => {
  try {
    const { user_id, message } = data;

    if (!user_id || !message) {
      throw new ApiError(400, "user_id and message are required");
    }

    const tracking_id = uuidv4();

    const newMessage = await Message.create({
      user_id,
      message,
      tracking_id,
      status: 'PENDING',
    });

    await messageQueue.add('process-message', {
      message_id: newMessage._id.toString(),
      message,
    });
    
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