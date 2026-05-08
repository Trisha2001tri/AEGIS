import dotenv from 'dotenv';
dotenv.config();
import app from './src/app.js';
import connectDB from './src/config/db.js';
import redisConnection from './src/config/redis.js';
import './src/jobs/message.worker.js';
import './src/jobs/sos.worker.js';


const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Step 1: connect DB
    await connectDB();
    // await connectRedis();

    // Step 2: start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Startup failed:', error);
    process.exit(1);
  }
};

startServer();