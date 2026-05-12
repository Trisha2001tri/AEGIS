import express from 'express';
import messageRoutes from './routes/message.routes.js';

const app = express();

// middleware
app.use(express.json());

app.use('/v1/messages', messageRoutes);


app.get('/health', async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

export default app;