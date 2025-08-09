import { Router } from 'express';
import { signupHandler } from '../controller/signController.js';
import { loginHandler, logoutHandler, refreshTokenHandler } from '../controller/authController.js';

const loginRouter = Router();

loginRouter.post('/signup', signupHandler);
loginRouter.post('/login', loginHandler);
loginRouter.post('/logout', logoutHandler);
loginRouter.post('/refresh-token', refreshTokenHandler);

export default loginRouter;