import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import type { LoginInput, RegisterInput } from '../validators/auth.validator';
import { AppError } from '../middleware/errorHandler';

export const AuthController = {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await AuthService.register(req.body as RegisterInput);
            res.status(201).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    },

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await AuthService.login(req.body as LoginInput);
            res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    },

    async me(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new AppError(401, 'Authorization token is required');
            }

            const user = await AuthService.me(req.user.id);
            res.json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    },
};
