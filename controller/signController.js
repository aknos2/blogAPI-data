import { body, validationResult } from 'express-validator';
import prisma from '../lib/prisma.js';
import asyncHandler from 'express-async-handler';
import passport from 'passport';

export const validateUserRegistration = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .matches(/^(?=.*[A-Za-z])[A-Za-z0-9]+$/)
    .withMessage('Username must contain only letters and numbers, and include at least one letter')
    .isLength({ max: 20 }).withMessage('Username must be 20 characters or fewer')
    .custom(async value => {
      const existing = await prisma.user.findUnique({ where: { username: value } });
      if (existing) throw new Error('Username already in use');
      return true;
    }),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6, max: 30 }).withMessage('Password must be between 6 and 30 characters'),

  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

export const signupHandler = [
  validateUserRegistration,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    passport.authenticate('signup', { session: false }, (err, user, info) => {
      if (err) return next(err);

      res.json({
        message: 'Signed-up successfully! Please log in to post!',
        user: user,
      });
    })(req, res, next);
  })
];
