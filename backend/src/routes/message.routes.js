import express from 'express';
import { createMessageHandler, getMessageStatusHandler } from '../controllers/message.controller.js';

const router = express.Router();

router.post('/', createMessageHandler);
router.get('/:id', getMessageStatusHandler);

export default router;