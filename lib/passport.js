import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import prisma from './prisma.js';
import { createUser, findUsername } from '../services/userServices.js';

function initializePassport() {
  // JWT Strategy
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (payload, done) => {
        try {
          const user = await prisma.user.findUnique({ where: { id: payload.userId } });
          return user ? done(null, user) : done(null, false);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );

  // Local Strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await findUsername(username); 
        if (!user) return done(null, false, { message: 'Incorrect username or password' });

        const match = await bcrypt.compare(password, user.password);
        return match ? done(null, user) : done(null, false, { message: 'Incorrect username or password' });
      } catch (err) {
        return done(err);
      }
    })
  );

  // Signup Strategy
  passport.use(
    'signup',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true, // So we can access req.body
    },
    async (req, username, password, done) => {
      try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await createUser(username, hashedPassword);

        return done(null, newUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);
}

export default initializePassport;
