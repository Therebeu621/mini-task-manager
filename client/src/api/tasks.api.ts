/**
 * API client for the tasks resource.
 * All functions communicate with the backend REST API.
 * The base URL comes from the VITE_API_URL env var (defaults to '' to hit the Vite proxy).
 */
import type {
    Task,
    CreateTaskInput,
    UpdateTaskInput,
    TaskFilters,
    ApiResponse,
} from '../types/task.types';

const BASE_URL = import.meta.env.VITE_API_URL ?? '';

/**
 * Generic fetch wrapper that handles JSON parsing and error surfacing.
 */
async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json', ...init?.headers },
        ...init,
    });

    const json: ApiResponse<T> = await res.json();

    if (!res.ok || !json.success) {
        // Build a human-readable error message from the structured response
        const detail = json.errors
            ? Object.entries(json.errors)
                .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
                .join(' | ')
            : json.error ?? `HTTP ${res.status}`;
        throw new Error(detail);
    }

    return json.data as T;
}

// ─── Tasks API ────────────────────────────────────────────

/**
 * Build query string from TaskFilters, omitting empty / undefined values.
 */
function buildQueryString(filters: TaskFilters): string {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.priority) params.set('priority', filters.priority);
    if (filters.search?.trim()) params.set('search', filters.search.trim());
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);
    const qs = params.toString();
    return qs ? `?${qs}` : '';
}

export const tasksApi = {
    /** GET /api/tasks */
    list(filters: TaskFilters = {}): Promise<Task[]> {
        return apiFetch<Task[]>(`/api/tasks${buildQueryString(filters)}`);
    },

    /** GET /api/tasks/:id */
    getById(id: string): Promise<Task> {
        return apiFetch<Task>(`/api/tasks/${id}`);
    },

    /** POST /api/tasks */
    create(input: CreateTaskInput): Promise<Task> {
        return apiFetch<Task>('/api/tasks', {
            method: 'POST',
            body: JSON.stringify(input),
        });
    },

    /** PUT /api/tasks/:id */
    update(id: string, input: UpdateTaskInput): Promise<Task> {
        return apiFetch<Task>(`/api/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(input),
        });
    },

    /** DELETE /api/tasks/:id */
    remove(id: string): Promise<Task> {
        return apiFetch<Task>(`/api/tasks/${id}`, { method: 'DELETE' });
    },
};
