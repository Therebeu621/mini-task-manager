export type UserRole = 'user' | 'admin';

export interface AuthenticatedUser {
    id: string;
    email: string;
    role: UserRole;
}

export interface JwtPayload {
    sub: string;
    email: string;
    role: UserRole;
    iat?: number;
    exp?: number;
}

export interface PublicUser {
    id: string;
    email: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}
