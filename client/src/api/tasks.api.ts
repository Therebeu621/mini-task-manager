import { apiFetch } from './http';
import type {
    Task,
    CreateTaskInput,
    UpdateTaskInput,
    TaskQueryParams,
    PaginatedTasksResponse,
    PaginationMeta,
} from '../types/task.types';

const DEFAULT_META: PaginationMeta = { page: 1, limit: 10, total: 0, totalPages: 1 };

function buildQueryString(filters: TaskQueryParams): string {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.priority) params.set('priority', filters.priority);
    if (filters.search?.trim()) params.set('search', filters.search.trim());
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (typeof filters.includeDeleted === 'boolean') {
        params.set('includeDeleted', String(filters.includeDeleted));
    }
    const qs = params.toString();
    return qs ? `?${qs}` : '';
}

export const tasksApi = {
    async list(filters: TaskQueryParams): Promise<PaginatedTasksResponse> {
        const response = await apiFetch<Task[]>(`/api/tasks${buildQueryString(filters)}`);
        return { data: response.data, meta: response.meta ?? DEFAULT_META };
    },

    async getById(id: string): Promise<Task> {
        const response = await apiFetch<Task>(`/api/tasks/${id}`);
        return response.data;
    },

    async create(input: CreateTaskInput): Promise<Task> {
        const response = await apiFetch<Task>('/api/tasks', {
            method: 'POST',
            body: JSON.stringify(input),
        });
        return response.data;
    },

    async update(id: string, input: UpdateTaskInput): Promise<Task> {
        const response = await apiFetch<Task>(`/api/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(input),
        });
        return response.data;
    },

    async remove(id: string): Promise<Task> {
        const response = await apiFetch<Task>(`/api/tasks/${id}`, { method: 'DELETE' });
        return response.data;
    },

    async restore(id: string): Promise<Task> {
        const response = await apiFetch<Task>(`/api/tasks/${id}/restore`, { method: 'PATCH' });
        return response.data;
    },
};
