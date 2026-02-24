/**
 * Shared TypeScript types for the Task domain (client-side).
 * Keeps front and back in sync without sharing actual code.
 */

export type TaskStatus = 'todo' | 'doing' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

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
    sortBy?: 'createdAt' | 'updatedAt' | 'dueDate' | 'priority' | 'title';
    sortOrder?: 'asc' | 'desc';
}

/** Standard API response envelope from the backend */
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    errors?: Record<string, string[]>;
}
