/**
 * React Query hooks for all task operations.
 * Abstracts TanStack Query mutations and queries behind a clean API.
 */
import {
    keepPreviousData,
    useQuery,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import { useEffect } from 'react';
import { tasksApi } from '../api/tasks.api';
import type { CreateTaskInput, UpdateTaskInput, TaskQueryParams } from '../types/task.types';

// ─── Query keys ───────────────────────────────────────────

export const TASK_KEYS = {
    all: ['tasks'] as const,
    list: (params: TaskQueryParams) => ['tasks', 'list', params] as const,
    detail: (id: string) => ['tasks', 'detail', id] as const,
};

// ─── Queries ──────────────────────────────────────────────

/**
 * Fetch the full task list, re-fetching whenever filters change.
 */
export function useTasksQuery(params: TaskQueryParams) {
    const queryClient = useQueryClient();
    const query = useQuery({
        queryKey: TASK_KEYS.list(params),
        queryFn: () => tasksApi.list(params),
        placeholderData: keepPreviousData,
        staleTime: 10_000, // 10 seconds
    });

    useEffect(() => {
        if (!query.data || query.isFetching) {
            return;
        }

        const nextPage = (params.page ?? 1) + 1;
        if (nextPage > query.data.meta.totalPages) {
            return;
        }

        void queryClient.prefetchQuery({
            queryKey: TASK_KEYS.list({ ...params, page: nextPage }),
            queryFn: () => tasksApi.list({ ...params, page: nextPage }),
        });
    }, [params, query.data, query.isFetching, queryClient]);

    return query;
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
