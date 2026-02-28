/**
 * API client for the tasks resource.
 * All functions communicate with the backend REST API.
 * The base URL comes from the VITE_API_URL env var (defaults to '' to hit the Vite proxy).
 */
import type {
    Task,
    CreateTaskInput,
    UpdateTaskInput,
    TaskQueryParams,
    ApiResponse,
    PaginatedTasksResponse,
    PaginationMeta,
} from '../types/task.types';

const BASE_URL = import.meta.env.VITE_API_URL ?? '';
const DEFAULT_META: PaginationMeta = { page: 1, limit: 10, total: 0, totalPages: 1 };

/**
 * Generic fetch wrapper that handles JSON parsing and error surfacing.
 */
async function apiFetch<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
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

    return json;
}

// ─── Tasks API ────────────────────────────────────────────

/**
 * Build query string from TaskFilters, omitting empty / undefined values.
 */
function buildQueryString(filters: TaskQueryParams): string {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.priority) params.set('priority', filters.priority);
    if (filters.search?.trim()) params.set('search', filters.search.trim());
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    const qs = params.toString();
    return qs ? `?${qs}` : '';
}

export const tasksApi = {
    /** GET /api/tasks */
    async list(filters: TaskQueryParams): Promise<PaginatedTasksResponse> {
        const response = await apiFetch<Task[]>(`/api/tasks${buildQueryString(filters)}`);
        return { data: response.data, meta: response.meta ?? DEFAULT_META };
    },

    /** GET /api/tasks/:id */
    async getById(id: string): Promise<Task> {
        const response = await apiFetch<Task>(`/api/tasks/${id}`);
        return response.data;
    },

    /** POST /api/tasks */
    async create(input: CreateTaskInput): Promise<Task> {
        const response = await apiFetch<Task>('/api/tasks', {
            method: 'POST',
            body: JSON.stringify(input),
        });
        return response.data;
    },

    /** PUT /api/tasks/:id */
    async update(id: string, input: UpdateTaskInput): Promise<Task> {
        const response = await apiFetch<Task>(`/api/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(input),
        });
        return response.data;
    },

    /** DELETE /api/tasks/:id */
    async remove(id: string): Promise<Task> {
        const response = await apiFetch<Task>(`/api/tasks/${id}`, { method: 'DELETE' });
        return response.data;
    },
};
