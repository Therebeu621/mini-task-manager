/**
 * React Query hooks for all task operations.
 * Abstracts TanStack Query mutations and queries behind a clean API.
 */
import {
    useQuery,
    useMutation,
    useQueryClient,
    type QueryKey,
} from '@tanstack/react-query';
import { tasksApi } from '../api/tasks.api';
import type { CreateTaskInput, UpdateTaskInput, TaskFilters } from '../types/task.types';

// ─── Query keys ───────────────────────────────────────────

export const TASK_KEYS = {
    all: ['tasks'] as QueryKey,
    list: (filters: TaskFilters) => ['tasks', 'list', filters] as QueryKey,
    detail: (id: string) => ['tasks', 'detail', id] as QueryKey,
};

// ─── Queries ──────────────────────────────────────────────

/**
 * Fetch the full task list, re-fetching whenever filters change.
 */
export function useTasksQuery(filters: TaskFilters) {
    return useQuery({
        queryKey: TASK_KEYS.list(filters),
        queryFn: () => tasksApi.list(filters),
        staleTime: 10_000, // 10 seconds
    });
}

// ─── Mutations ────────────────────────────────────────────

/**
 * Create a new task and invalidate the list cache.
 */
export function useCreateTask() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (input: CreateTaskInput) => tasksApi.create(input),
        onSuccess: () => qc.invalidateQueries({ queryKey: TASK_KEYS.all }),
    });
}

/**
 * Update an existing task and invalidate both list and detail cache.
 */
export function useUpdateTask() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: UpdateTaskInput }) =>
            tasksApi.update(id, input),
        onSuccess: (_data, { id }) => {
            qc.invalidateQueries({ queryKey: TASK_KEYS.all });
            qc.invalidateQueries({ queryKey: TASK_KEYS.detail(id) });
        },
    });
}

/**
 * Delete a task and invalidate the list cache.
 */
export function useDeleteTask() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => tasksApi.remove(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: TASK_KEYS.all }),
    });
}
