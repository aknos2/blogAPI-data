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

// Define allowed origins
const allowedOrigins = [
  'https://doggo-blog.vercel.app',
  'https://doggo-blog-data.vercel.app',
  'http://localhost:4173',
  'http://localhost:5173',
  'http://localhost:3000'
];

// Add FRONTEND_URL from environment if it exists
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

// EXPLICIT CORS MIDDLEWARE - Set headers manually
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Always set these headers for all requests
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Set Access-Control-Allow-Origin based on request origin
  if (!origin) {
    // For requests without origin (like Postman, curl, or same-origin)
    res.header('Access-Control-Allow-Origin', '*');
  } else if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    console.log('🚫 Origin not allowed:', origin);
    // Don't set the header for disallowed origins
  }
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Also use the cors package as backup
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(compression());

// Initialize Passport
app.use(passport.initialize());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    allowedOrigins: allowedOrigins,
    requestOrigin: req.headers.origin
  });
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
    console.log('Allowed origins:', allowedOrigins);
  });
}

export default app;