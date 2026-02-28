/**
 * Shared TypeScript types for the Task domain (client-side).
 * Keeps front and back in sync without sharing actual code.
 */

export type TaskStatus = 'todo' | 'doing' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskSortBy = 'title' | 'dueDate' | 'createdAt' | 'priority' | 'status';
export type SortOrder = 'asc' | 'desc';

export interface Task {
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    /** ISO 8601 date-time string */
    dueDate: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskInput {
    title: string;
    description?: string | null;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string | null;
}

export type UpdateTaskInput = Partial<CreateTaskInput>;

export interface TaskFilters {
    status?: TaskStatus | '';
    priority?: TaskPriority | '';
    search?: string;
    sortBy?: TaskSortBy;
    sortOrder?: SortOrder;
}

export interface TaskQueryParams {
    status?: TaskStatus | '';
    priority?: TaskPriority | '';
    search?: string;
    sortBy?: TaskSortBy;
    sortOrder?: SortOrder;
    page?: number;
    limit?: number;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface PaginatedTasksResponse {
    data: Task[];
    meta: PaginationMeta;
}

/** Standard API response envelope from the backend */
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    meta?: PaginationMeta;
    error?: string;
    errors?: Record<string, string[]>;
}
