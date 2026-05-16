import dotenv from 'dotenv';
dotenv.config(); // ✅ ADD THIS HERE

import IORedis from 'ioredis';

const redisConnection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  tls: {}, // required for Upstash
});

redisConnection.on('connect', () => {
  console.log('✅ Redis connected');
});

redisConnection.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

export default redisConnection;