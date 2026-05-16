import asyncHandler from '../utils/asyncHandler.js';
import { createMessage, getMessageStatus } from '../services/message.service.js';

const createMessageHandler = asyncHandler(async (req, res) => {
  // 1. Extract nickname and message from the frontend payload
  const { nickname, message } = req.body;

  // 2. Generate/Identify the persistent user_id
  // using session ID or a fallback to keep history linked even if they change nicknames
  const persistent_user_id = req.sessionID || req.ip || "unknown_session";

  // 3. Pass both the hidden ID and the visible nickname to the service
  const result = await createMessage({
    user_id: persistent_user_id, // For backend analysis and history
    nickname: nickname,         // For dashboard display
    message: message
  });

  return res.status(202).json({
    success: true,
    tracking_id: result.tracking_id,
    status: 'PENDING',
  });
});

export { createMessageHandler };

export const getMessageStatusHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await getMessageStatus(id); 

  res.status(200).json({
    success: true,
    ...result,
  });
});