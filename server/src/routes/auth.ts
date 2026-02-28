import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { loginSchema, registerSchema } from '../validators/auth.validator';

export const authRouter = Router();

authRouter.post('/register', validate({ body: registerSchema }), AuthController.register);
authRouter.post('/login', validate({ body: loginSchema }), AuthController.login);
authRouter.get('/me', authMiddleware, AuthController.me);
