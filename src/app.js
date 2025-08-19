import express from 'express';
import path from 'path';
import passport from 'passport';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import initializePassport from '../lib/passport.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';

import authRoutes from '../routes/authRouter.js'
import postRoutes from '../routes/postRoutes.js'
import commentRoutes from '../routes/commentRouter.js'
import userRoutes from '../routes/userRouter.js';

dotenv.config();

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const app = express();
initializePassport();

// CORS configuration for production and development
const corsOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.FRONTEND_URL || 'https://doggo-blog.vercel.app']
  : ['http://localhost:4173', 'http://localhost:5173'];

// Middleware
app.use(cors({
  origin: corsOrigins,
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser()); // Keep for optional refresh token cookies
app.use(compression());

// Initialize Passport (but no sessions)
app.use(passport.initialize());
// REMOVED: app.use(passport.session()); - Not needed for JWT

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/user', userRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  const status = Number(err.statusCode) || 500;
  res.status(status).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : err.message
  });
});

const PORT = process.env.PORT || 3000;

// For Vercel, we don't need to call app.listen()
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

export default app;