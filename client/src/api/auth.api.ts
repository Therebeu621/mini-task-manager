import { apiFetch } from './http';
import type { AuthPayload, AuthUser } from '../types/task.types';

interface AuthInput {
    email: string;
    password: string;
}

export const authApi = {
    async register(input: AuthInput): Promise<AuthPayload> {
        const response = await apiFetch<AuthPayload>('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(input),
            withAuth: false,
        });
        return response.data;
    },

    async login(input: AuthInput): Promise<AuthPayload> {
        const response = await apiFetch<AuthPayload>('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(input),
            withAuth: false,
        });
        return response.data;
    },

    async me(): Promise<AuthUser> {
        const response = await apiFetch<AuthUser>('/api/auth/me');
        return response.data;
    },
};
