import { Router } from 'express';
import { getSystemStats, getRecentConversations, getRiskTrends } from '../controllers/dashboard.controller.js';

const router = Router();

router.get('/stats', getSystemStats);
router.get('/conversations', getRecentConversations);
router.get('/trends', getRiskTrends);

export default router;