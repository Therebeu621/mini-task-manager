/**
 * Shared TypeScript types for the Task domain.
 * Mirrors API contracts returned by the backend.
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
    dueDate: string | null;
    ownerId: string;
    createdById: string;
    updatedById: string;
    deletedAt: string | null;
    deletedById: string | null;
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

/** Query params for GET /api/tasks */
export interface TaskQuery {
    status?: TaskStatus;
    priority?: TaskPriority;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: TaskSortBy;
    sortOrder?: SortOrder;
    includeDeleted?: boolean;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

/** Standard API response envelope */
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    errors?: Record<string, string[]>;
}
