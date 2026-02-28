import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import type { LoginInput, RegisterInput } from '../validators/auth.validator';
import type { JwtPayload, PublicUser, UserRole } from '../types/auth.types';

const prisma = new PrismaClient();

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

function getJwtExpiresIn(): SignOptions['expiresIn'] {
    return (process.env.JWT_EXPIRES_IN ?? '12h') as SignOptions['expiresIn'];
}

function toPublicUser(user: {
    id: string;
    email: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}): PublicUser {
    return {
        id: user.id,
        email: user.email,
        role: user.role as UserRole,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
    };
}

function signToken(payload: JwtPayload): string {
    return jwt.sign(payload, getJwtSecret(), { expiresIn: getJwtExpiresIn() });
}

export const AuthService = {
    async register(input: RegisterInput) {
        const existingUser = await prisma.user.findUnique({
            where: { email: input.email },
            select: { id: true },
        });

        if (existingUser) {
            throw new AppError(409, 'Email is already registered');
        }

        const passwordHash = await bcrypt.hash(input.password, 10);
        const user = await prisma.user.create({
            data: {
                email: input.email,
                passwordHash,
                role: 'user',
            },
        });

        const token = signToken({
            sub: user.id,
            email: user.email,
            role: user.role as UserRole,
        });

        return {
            token,
            user: toPublicUser(user),
        };
    },

    async login(input: LoginInput) {
        const user = await prisma.user.findUnique({
            where: { email: input.email },
        });

        if (!user) {
            throw new AppError(401, 'Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new AppError(401, 'Invalid credentials');
        }

        const token = signToken({
            sub: user.id,
            email: user.email,
            role: user.role as UserRole,
        });

        return {
            token,
            user: toPublicUser(user),
        };
    },

    async me(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new AppError(404, 'User not found');
        }

        return toPublicUser(user);
    },
};
