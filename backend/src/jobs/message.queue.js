import { Queue } from 'bullmq';
import redisConnection from '../config/redis.js';

const messageQueue = new Queue('message-queue', {
  connection: redisConnection,
});

export default messageQueue;