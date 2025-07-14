import { Router } from 'express';
import { signupHandler } from '../controller/signController.js';
import { loginHandler } from '../controller/authController.js';

const loginRouter = Router();

loginRouter.post('/signup', signupHandler);
loginRouter.post('/login', loginHandler);

export default loginRouter;