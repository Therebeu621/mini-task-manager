import type { ApiResponse } from '../types/task.types';

const BASE_URL = import.meta.env.VITE_API_URL ?? '';
export const AUTH_TOKEN_STORAGE_KEY = 'mini-task-manager.auth-token';

export class ApiError extends Error {
    status: number;
    errors?: Record<string, string[]>;

    constructor(message: string, status: number, errors?: Record<string, string[]>) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.errors = errors;
    }
}

export function getAuthToken(): string | null {
    return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function setAuthToken(token: string): void {
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
}

export function clearAuthToken(): void {
    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

interface ApiFetchOptions extends RequestInit {
    withAuth?: boolean;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<ApiResponse<T>> {
    const headers = new Headers(options.headers ?? {});
    const withAuth = options.withAuth ?? true;

    if (withAuth) {
        const token = getAuthToken();
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
    }

    const hasBody = options.body !== undefined && options.body !== null;
    if (hasBody && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers,
    });

    let json: ApiResponse<T> | null = null;
    try {
        json = (await response.json()) as ApiResponse<T>;
    } catch {
        json = null;
    }

    if (!response.ok || !json?.success) {
        const detail = json?.errors
            ? Object.entries(json.errors)
                  .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                  .join(' | ')
            : json?.error ?? `HTTP ${response.status}`;

        throw new ApiError(detail, response.status, json?.errors);
    }

    return json;
}
