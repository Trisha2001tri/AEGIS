import asyncHandler from '../utils/asyncHandler.js';
import { createMessage, getMessageStatus } from '../services/message.service.js';

const createMessageHandler = asyncHandler(async (req, res) => {
  const result = await createMessage(req.body);

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