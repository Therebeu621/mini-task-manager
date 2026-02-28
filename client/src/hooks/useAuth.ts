import { useCallback, useEffect, useState } from 'react';
import { authApi } from '../api/auth.api';
import { ApiError, clearAuthToken, getAuthToken, setAuthToken } from '../api/http';
import type { AuthUser } from '../types/task.types';

interface AuthCredentials {
    email: string;
    password: string;
}

export function useAuth() {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isBootstrapping, setIsBootstrapping] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    useEffect(() => {
        async function bootstrap() {
            const token = getAuthToken();
            if (!token) {
                setIsBootstrapping(false);
                return;
            }

            try {
                const currentUser = await authApi.me();
                setUser(currentUser);
                setAuthError(null);
            } catch (error) {
                clearAuthToken();
                setUser(null);
                if (error instanceof ApiError && error.status !== 401) {
                    setAuthError(error.message);
                }
            } finally {
                setIsBootstrapping(false);
            }
        }

        void bootstrap();
    }, []);

    const login = useCallback(async (credentials: AuthCredentials) => {
        setIsSubmitting(true);
        setAuthError(null);
        try {
            const payload = await authApi.login(credentials);
            setAuthToken(payload.token);
            setUser(payload.user);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to login';
            setAuthError(message);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    const register = useCallback(async (credentials: AuthCredentials) => {
        setIsSubmitting(true);
        setAuthError(null);
        try {
            const payload = await authApi.register(credentials);
            setAuthToken(payload.token);
            setUser(payload.user);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to register';
            setAuthError(message);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    const logout = useCallback(() => {
        clearAuthToken();
        setUser(null);
    }, []);

    return {
        user,
        isAuthenticated: Boolean(user),
        isBootstrapping,
        isSubmitting,
        authError,
        login,
        register,
        logout,
    };
}
