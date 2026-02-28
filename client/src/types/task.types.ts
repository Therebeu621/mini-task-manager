/**
 * Shared TypeScript types for the frontend domain.
 */

export type TaskStatus = 'todo' | 'doing' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskSortBy = 'title' | 'dueDate' | 'createdAt' | 'priority' | 'status';
export type SortOrder = 'asc' | 'desc';
export type UserRole = 'user' | 'admin';

export interface AuthUser {
    id: string;
    email: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}

export interface AuthPayload {
    token: string;
    user: AuthUser;
}

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

export interface TaskFilters {
    status?: TaskStatus | '';
    priority?: TaskPriority | '';
    search?: string;
    sortBy?: TaskSortBy;
    sortOrder?: SortOrder;
    includeDeleted?: boolean;
}

export interface TaskQueryParams {
    status?: TaskStatus | '';
    priority?: TaskPriority | '';
    search?: string;
    sortBy?: TaskSortBy;
    sortOrder?: SortOrder;
    page?: number;
    limit?: number;
    includeDeleted?: boolean;
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
