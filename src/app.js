import express from 'express';
import path from 'path';
import passport from 'passport';
import dotenv from 'dotenv';
import prisma from '../lib/prisma.js';
import { fileURLToPath } from 'url';
import expressSession from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import initializePassport from '../lib/passport.js';

import authRoutes from '../routes/authRouter.js'
import postRoutes from '../routes/postRoutes.js'
import commentRoutes from '../routes/commentRouter.js'

dotenv.config();

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const app = express();
initializePassport();
app.set('views', path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// PostgreSQL + Prisma
app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000 // ms
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(
      prisma, 
      {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
)

// Passport
app.use(passport.initialize());
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
})

// Global error handler
app.use((err, req, res, next) => {
  console.log(err);

  if (res.headersSent) {
    return next(err); // delegate to default Express error handler
  }

  const status = Number(err.statusCode) || 500;
  res.status(status).send(err.message || 'Something went wrong');
});