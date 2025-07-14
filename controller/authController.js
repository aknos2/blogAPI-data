import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import prisma from '../lib/prisma.js';

export const loginHandler = asyncHandler(async(req, res, next) => {
  passport.authenticate('local', { session: false }, async (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ success: false, message: info?.message || 'Invalid credentials' });
    }

    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn:`${process.env.REFRESH_TOKEN_EXPIRE_TIME}`});
    const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_SECRET, { expiresIn: `${process.env.TOKEN_EXPIRE_TIME}`});

    // Save the refresh token in DB
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    // Optionally set it as an httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  })(req, res, next);
});

export const refreshTokenHandler = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) return res.sendStatus(401);

  const payload = jwt.verify(token, process.env.REFRESH_SECRET);
  const user = await prisma.user.findUnique({ where: { id: payload.userId }})

  if (!user || user.refreshToken !== token) {
    return res.sendStatus(403);
  }

  // Issue a new access token
  const newAccessToken = jwt.sign({ userId: user.id}, process.env.JWT_SECRET, {
    expiresIn:`${process.env.REFRESH_TOKEN_EXPIRE_TIME}`,
  })

  res.json({ accessToken: newAccessToken });
});

export const logoutHandler = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (token) {
    const payload = jwt.verify(token, process.env.REFRESH_SECRET);

    await prisma.user.update({
      where: { id: payload.userId },
      data: { refreshToken: null },
    });

    res.clearCookie('refreshToken');
  }

  res.sendStatus(204);
});

