import express from 'express';
import cors from 'cors';
import messageRoutes from './routes/message.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import session from 'express-session';

const app = express();

// middleware
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);
app.use('/v1/messages', messageRoutes);
app.use('/v1/dashboard', dashboardRoutes);

app.get('/health', async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

export default app;