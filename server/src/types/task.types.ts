/**
 * Shared TypeScript types for the Task domain.
 * Mirrors the Prisma model so the frontend can import just this file.
 */

export type TaskStatus = 'todo' | 'doing' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string | null; // ISO 8601 string in API responses
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
    sortBy?: 'title' | 'dueDate' | 'createdAt' | 'priority' | 'status';
    sortOrder?: 'asc' | 'desc';
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
