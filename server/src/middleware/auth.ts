import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import type { AuthenticatedUser, JwtPayload, UserRole } from '../types/auth.types';

function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (secret) {
        return secret;
    }

    if (process.env.NODE_ENV === 'production') {
        throw new Error('JWT_SECRET is required in production');
    }

    return 'dev-jwt-secret';
}

function isValidRole(value: string): value is UserRole {
    return value === 'user' || value === 'admin';
}

function decodeToken(token: string): AuthenticatedUser {
    try {
        const payload = jwt.verify(token, getJwtSecret()) as JwtPayload;
        if (!payload.sub || !payload.email || !payload.role || !isValidRole(payload.role)) {
            throw new AppError(401, 'Invalid token payload');
        }

        return {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
        };
    } catch {
        throw new AppError(401, 'Invalid or expired token');
    }
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        next(new AppError(401, 'Authorization token is required'));
        return;
    }

    const token = header.replace('Bearer ', '').trim();
    if (!token) {
        next(new AppError(401, 'Authorization token is required'));
        return;
    }

    try {
        req.user = decodeToken(token);
        next();
    } catch (error) {
        next(error);
    }
}

export function requireRole(...roles: UserRole[]) {
    return (req: Request, _res: Response, next: NextFunction): void => {
        if (!req.user) {
            next(new AppError(401, 'Authorization token is required'));
            return;
        }

        if (!roles.includes(req.user.role)) {
            next(new AppError(403, 'Insufficient role to perform this action'));
            return;
        }

        next();
    };
}

export function requireOwnershipOrAdmin(user: AuthenticatedUser, ownerId: string): void {
    if (user.role === 'admin') {
        return;
    }

    if (user.id !== ownerId) {
        throw new AppError(403, 'You do not have permission for this resource');
    }
}
