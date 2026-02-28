import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient,
    type QueryClient,
    type QueryKey,
} from '@tanstack/react-query';
import { useEffect } from 'react';
import { tasksApi } from '../api/tasks.api';
import type {
    CreateTaskInput,
    PaginatedTasksResponse,
    SortOrder,
    Task,
    TaskPriority,
    TaskQueryParams,
    TaskStatus,
    UpdateTaskInput,
} from '../types/task.types';

type TaskListSnapshot = Array<[QueryKey, PaginatedTasksResponse | undefined]>;

export const TASK_KEYS = {
    all: ['tasks'] as const,
    lists: () => ['tasks', 'list'] as const,
    list: (params: TaskQueryParams) => ['tasks', 'list', params] as const,
    detail: (id: string) => ['tasks', 'detail', id] as const,
};

function getListParams(queryKey: QueryKey): TaskQueryParams | null {
    if (!Array.isArray(queryKey) || queryKey.length < 3) {
        return null;
    }
    if (queryKey[0] !== 'tasks' || queryKey[1] !== 'list') {
        return null;
    }

    const params = queryKey[2];
    if (typeof params === 'object' && params !== null) {
        return params as TaskQueryParams;
    }

    return null;
}

function mapStatusValue(status: TaskStatus): number {
    return { todo: 1, doing: 2, done: 3 }[status];
}

function mapPriorityValue(priority: TaskPriority): number {
    return { low: 1, medium: 2, high: 3 }[priority];
}

function compareDates(
    left: string | null,
    right: string | null,
    sortOrder: SortOrder,
    nullValue: number,
): number {
    const leftDate = left ? new Date(left).getTime() : nullValue;
    const rightDate = right ? new Date(right).getTime() : nullValue;
    return sortOrder === 'asc' ? leftDate - rightDate : rightDate - leftDate;
}

function compareTask(left: Task, right: Task, params: TaskQueryParams): number {
    const sortBy = params.sortBy ?? 'createdAt';
    const sortOrder = params.sortOrder ?? 'desc';
    const direction = sortOrder === 'asc' ? 1 : -1;

    let result = 0;
    if (sortBy === 'title') {
        result = left.title.localeCompare(right.title) * direction;
    } else if (sortBy === 'dueDate') {
        result = compareDates(
            left.dueDate,
            right.dueDate,
            sortOrder,
            sortOrder === 'asc' ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY,
        );
    } else if (sortBy === 'priority') {
        result = (mapPriorityValue(left.priority) - mapPriorityValue(right.priority)) * direction;
    } else if (sortBy === 'status') {
        result = (mapStatusValue(left.status) - mapStatusValue(right.status)) * direction;
    } else {
        result = compareDates(left.createdAt, right.createdAt, sortOrder, 0);
    }

    if (result !== 0) {
        return result;
    }

    // Stable fallback ordering
    const createdAtFallback = compareDates(left.createdAt, right.createdAt, 'desc', 0);
    if (createdAtFallback !== 0) {
        return createdAtFallback;
    }

    return left.id.localeCompare(right.id);
}

function sortTasks(tasks: Task[], params: TaskQueryParams): Task[] {
    return [...tasks].sort((left, right) => compareTask(left, right, params));
}

function matchesFilters(task: Task, params: TaskQueryParams): boolean {
    const status = params.status;
    if (status && task.status !== status) {
        return false;
    }

    const priority = params.priority;
    if (priority && task.priority !== priority) {
        return false;
    }

    const includeDeleted = params.includeDeleted ?? false;
    if (!includeDeleted && task.deletedAt) {
        return false;
    }

    const search = params.search?.trim().toLowerCase();
    if (search) {
        const haystack = `${task.title} ${task.description ?? ''}`.toLowerCase();
        if (!haystack.includes(search)) {
            return false;
        }
    }

    return true;
}

function updateMeta(meta: PaginatedTasksResponse['meta'], total: number) {
    const nextTotal = Math.max(total, 0);
    const totalPages = nextTotal === 0 ? 1 : Math.ceil(nextTotal / meta.limit);
    const page = Math.min(meta.page, totalPages);
    return {
        ...meta,
        page,
        total: nextTotal,
        totalPages,
    };
}

function updateAllTaskLists(
    queryClient: QueryClient,
    updater: (current: PaginatedTasksResponse, params: TaskQueryParams) => PaginatedTasksResponse,
) {
    const cachedLists = queryClient.getQueriesData<PaginatedTasksResponse>({
        queryKey: TASK_KEYS.lists(),
    });

    for (const [key, value] of cachedLists) {
        if (!value) {
            continue;
        }

        const params = getListParams(key) ?? {};
        queryClient.setQueryData<PaginatedTasksResponse>(key, updater(value, params));
    }
}

function restoreTaskSnapshots(queryClient: QueryClient, snapshots: TaskListSnapshot | undefined) {
    if (!snapshots) {
        return;
    }
    for (const [key, value] of snapshots) {
        queryClient.setQueryData(key, value);
    }
}

export function useTasksQuery(params: TaskQueryParams, options?: { enabled?: boolean }) {
    const queryClient = useQueryClient();
    const query = useQuery({
        queryKey: TASK_KEYS.list(params),
        queryFn: () => tasksApi.list(params),
        placeholderData: keepPreviousData,
        staleTime: 10_000,
        enabled: options?.enabled ?? true,
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

export function useCreateTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: CreateTaskInput) => tasksApi.create(input),
        onMutate: async (input) => {
            await queryClient.cancelQueries({ queryKey: TASK_KEYS.lists() });
            const previousLists = queryClient.getQueriesData<PaginatedTasksResponse>({
                queryKey: TASK_KEYS.lists(),
            });

            const now = new Date().toISOString();
            const optimisticTask: Task = {
                id: `temp-${Date.now()}`,
                title: input.title,
                description: input.description ?? null,
                status: input.status ?? 'todo',
                priority: input.priority ?? 'medium',
                dueDate: input.dueDate ?? null,
                ownerId: 'current-user',
                createdById: 'current-user',
                updatedById: 'current-user',
                deletedAt: null,
                deletedById: null,
                createdAt: now,
                updatedAt: now,
            };

            updateAllTaskLists(queryClient, (current, params) => {
                if (!matchesFilters(optimisticTask, params)) {
                    return current;
                }

                let data = current.data;
                const nextTotal = current.meta.total + 1;
                const isFirstPage = (params.page ?? 1) === 1;

                if (isFirstPage) {
                    data = sortTasks([...current.data, optimisticTask], params).slice(0, current.meta.limit);
                }

                return {
                    data,
                    meta: updateMeta(current.meta, nextTotal),
                };
            });

            return { previousLists, optimisticId: optimisticTask.id };
        },
        onError: (_error, _input, context) => {
            restoreTaskSnapshots(queryClient, context?.previousLists);
        },
        onSuccess: (createdTask, _input, context) => {
            queryClient.setQueryData(TASK_KEYS.detail(createdTask.id), createdTask);

            updateAllTaskLists(queryClient, (current, params) => {
                const replaced = current.data.map((task) =>
                    task.id === context?.optimisticId ? createdTask : task,
                );
                return {
                    ...current,
                    data: sortTasks(replaced, params),
                };
            });
        },
        onSettled: () => {
            void queryClient.invalidateQueries({ queryKey: TASK_KEYS.lists() });
        },
    });
}

export function useUpdateTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: UpdateTaskInput }) => tasksApi.update(id, input),
        onMutate: async ({ id, input }) => {
            await queryClient.cancelQueries({ queryKey: TASK_KEYS.lists() });
            const previousLists = queryClient.getQueriesData<PaginatedTasksResponse>({
                queryKey: TASK_KEYS.lists(),
            });

            updateAllTaskLists(queryClient, (current, params) => {
                const existingIndex = current.data.findIndex((task) => task.id === id);
                if (existingIndex === -1) {
                    return current;
                }

                const existing = current.data[existingIndex];
                const optimisticTask: Task = {
                    ...existing,
                    ...input,
                    dueDate: input.dueDate !== undefined ? (input.dueDate ?? null) : existing.dueDate,
                    updatedAt: new Date().toISOString(),
                };

                let nextData = current.data.map((task) => (task.id === id ? optimisticTask : task));
                let nextTotal = current.meta.total;

                if (!matchesFilters(optimisticTask, params)) {
                    nextData = nextData.filter((task) => task.id !== id);
                    nextTotal -= 1;
                } else {
                    nextData = sortTasks(nextData, params);
                }

                return {
                    data: nextData,
                    meta: updateMeta(current.meta, nextTotal),
                };
            });

            return { previousLists };
        },
        onError: (_error, _variables, context) => {
            restoreTaskSnapshots(queryClient, context?.previousLists);
        },
        onSuccess: (updatedTask) => {
            queryClient.setQueryData(TASK_KEYS.detail(updatedTask.id), updatedTask);
            updateAllTaskLists(queryClient, (current, params) => {
                const hasTask = current.data.some((task) => task.id === updatedTask.id);
                if (!hasTask) {
                    return current;
                }

                const nextData = current.data.map((task) =>
                    task.id === updatedTask.id ? updatedTask : task,
                );

                return {
                    ...current,
                    data: sortTasks(nextData, params),
                };
            });
        },
        onSettled: (_data, _error, { id }) => {
            void queryClient.invalidateQueries({ queryKey: TASK_KEYS.lists() });
            void queryClient.invalidateQueries({ queryKey: TASK_KEYS.detail(id) });
        },
    });
}

export function useDeleteTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => tasksApi.remove(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: TASK_KEYS.lists() });
            const previousLists = queryClient.getQueriesData<PaginatedTasksResponse>({
                queryKey: TASK_KEYS.lists(),
            });

            updateAllTaskLists(queryClient, (current, params) => {
                const existing = current.data.find((task) => task.id === id);
                if (!existing) {
                    return current;
                }

                const includeDeleted = params.includeDeleted ?? false;
                if (includeDeleted) {
                    const deletedTask: Task = {
                        ...existing,
                        deletedAt: new Date().toISOString(),
                    };
                    const nextData = current.data.map((task) => (task.id === id ? deletedTask : task));
                    return {
                        ...current,
                        data: sortTasks(nextData, params),
                    };
                }

                return {
                    data: current.data.filter((task) => task.id !== id),
                    meta: updateMeta(current.meta, current.meta.total - 1),
                };
            });

            return { previousLists };
        },
        onError: (_error, _id, context) => {
            restoreTaskSnapshots(queryClient, context?.previousLists);
        },
        onSuccess: (deletedTask) => {
            queryClient.setQueryData(TASK_KEYS.detail(deletedTask.id), deletedTask);
        },
        onSettled: () => {
            void queryClient.invalidateQueries({ queryKey: TASK_KEYS.lists() });
        },
    });
}

export function useRestoreTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => tasksApi.restore(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: TASK_KEYS.lists() });
            const previousLists = queryClient.getQueriesData<PaginatedTasksResponse>({
                queryKey: TASK_KEYS.lists(),
            });

            updateAllTaskLists(queryClient, (current, params) => {
                const existing = current.data.find((task) => task.id === id);
                if (!existing) {
                    return current;
                }

                const restoredTask: Task = {
                    ...existing,
                    deletedAt: null,
                    deletedById: null,
                    updatedAt: new Date().toISOString(),
                };

                if (!matchesFilters(restoredTask, params)) {
                    return {
                        data: current.data.filter((task) => task.id !== id),
                        meta: updateMeta(current.meta, current.meta.total - 1),
                    };
                }

                const nextData = current.data.map((task) => (task.id === id ? restoredTask : task));
                return {
                    ...current,
                    data: sortTasks(nextData, params),
                };
            });

            return { previousLists };
        },
        onError: (_error, _id, context) => {
            restoreTaskSnapshots(queryClient, context?.previousLists);
        },
        onSuccess: (restoredTask) => {
            queryClient.setQueryData(TASK_KEYS.detail(restoredTask.id), restoredTask);
        },
        onSettled: () => {
            void queryClient.invalidateQueries({ queryKey: TASK_KEYS.lists() });
        },
    });
}
