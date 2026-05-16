import { Queue } from 'bullmq';
import redisConnection from '../config/redis.js';

const sosQueue = new Queue('sos-queue', {
  connection: redisConnection,
});

export default sosQueue;