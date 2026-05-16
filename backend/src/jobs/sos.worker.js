import { Worker } from 'bullmq';
import redisConnection from '../config/redis.js';

console.log('🚨 SOS Worker Started');

const sosWorker = new Worker(
  'sos-queue',

  async (job) => {
    console.log('\n========================');
    console.log('🚨 SOS ALERT TRIGGERED');
    console.log('========================');

    console.log('USER:', job.data.user_id);
    console.log('MESSAGE:', job.data.message);
    console.log('RISK:', job.data.risk);
    console.log('ACTION:', job.data.action);
    console.log('REASON:', job.data.reason);

    console.log('========================\n');

    // future:
    // send slack
    // send email
    // call webhook
  },

  {
    connection: redisConnection,
  }
);

export default sosWorker;