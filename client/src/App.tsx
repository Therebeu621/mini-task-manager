import { useEffect, useMemo, useState } from 'react';
import { ApiError } from './api/http';
import { Button } from './components/ui/Button';
import { Drawer } from './components/ui/Drawer';
import { Pagination } from './components/ui/Pagination';
import { Spinner } from './components/ui/Spinner';
import { ToastContainer } from './components/ui/Toast';
import { AuthPage } from './features/auth/AuthPage';
import { TaskFilters } from './features/tasks/TaskFilters';
import { TaskForm } from './features/tasks/TaskForm';
import { TaskList } from './features/tasks/TaskList';
import { TaskToolbar } from './features/tasks/TaskToolbar';
import { useAuth } from './hooks/useAuth';
import { useDebouncedValue } from './hooks/useDebouncedValue';
import { useToast } from './hooks/useToast';
import {
    useCreateTask,
    useDeleteTask,
    useRestoreTask,
    useTasksQuery,
    useUpdateTask,
} from './hooks/useTasks';
import type {
    CreateTaskInput,
    SortOrder,
    Task,
    TaskPriority,
    TaskQueryParams,
    TaskSortBy,
    TaskStatus,
} from './types/task.types';

const DEFAULT_QUERY: TaskQueryParams = {
    status: '',
    priority: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
    includeDeleted: false,
};

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    return 'Unexpected error';
}

export default function App() {
    const { user, isAuthenticated, isBootstrapping, isSubmitting, authError, login, register, logout } =
        useAuth();
    const { toasts, addToast, dismiss } = useToast();

    const [queryState, setQueryState] = useState<TaskQueryParams>(DEFAULT_QUERY);
    const [searchInput, setSearchInput] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

    const debouncedSearch = useDebouncedValue(searchInput, 300);

    const createMutation = useCreateTask();
    const updateMutation = useUpdateTask();
    const deleteMutation = useDeleteTask();
    const restoreMutation = useRestoreTask();

    const query = useMemo(
        () => ({
            ...queryState,
            search: debouncedSearch.trim() || undefined,
        }),
        [debouncedSearch, queryState],
    );

    const tasksEnabled = isAuthenticated;
    const tasksQuery = useTasksQuery(query, { enabled: tasksEnabled });

    useEffect(() => {
        setQueryState((prev) => (prev.page === 1 ? prev : { ...prev, page: 1 }));
    }, [debouncedSearch]);

    useEffect(() => {
        if (!tasksEnabled || !tasksQuery.error) {
            return;
        }

        if (tasksQuery.error instanceof ApiError && tasksQuery.error.status === 401) {
            addToast('Session expirée. Merci de vous reconnecter.', 'error');
            logout();
        }
    }, [addToast, logout, tasksEnabled, tasksQuery.error]);

    useEffect(() => {
        if (!user || user.role === 'admin') {
            return;
        }

        setQueryState((prev) =>
            prev.includeDeleted ? { ...prev, includeDeleted: false, page: 1 } : prev,
        );
    }, [user]);

    const response = tasksQuery.data ?? {
        data: [],
        meta: {
            page: queryState.page ?? 1,
            limit: queryState.limit ?? 10,
            total: 0,
            totalPages: 1,
        },
    };

    const hasActiveFilters = useMemo(
        () =>
            Boolean(
                queryState.status ||
                    queryState.priority ||
                    debouncedSearch.trim() ||
                    queryState.includeDeleted ||
                    queryState.sortBy !== DEFAULT_QUERY.sortBy ||
                    queryState.sortOrder !== DEFAULT_QUERY.sortOrder,
            ),
        [debouncedSearch, queryState],
    );

    const isFormPending = createMutation.isPending || updateMutation.isPending;
    const isDeletePending = deleteMutation.isPending || restoreMutation.isPending;
    const errorMessage = getErrorMessage(tasksQuery.error);

    const canManageDeleted = user?.role === 'admin';

    function handleMutationError(error: unknown) {
        if (error instanceof ApiError && error.status === 401) {
            addToast('Session expirée. Merci de vous reconnecter.', 'error');
            logout();
            return;
        }

        addToast(getErrorMessage(error), 'error');
    }

    async function handleLogin(payload: { email: string; password: string }) {
        try {
            await login(payload);
            addToast('Connexion réussie', 'success');
        } catch {
            // handled by useAuth.authError
        }
    }

    async function handleRegister(payload: { email: string; password: string }) {
        try {
            await register(payload);
            addToast('Compte créé avec succès', 'success');
        } catch {
            // handled by useAuth.authError
        }
    }

    function openCreateForm() {
        setEditingTask(null);
        setIsFormOpen(true);
    }

    function openEditForm(task: Task) {
        if (task.deletedAt) {
            return;
        }
        setEditingTask(task);
        setIsFormOpen(true);
    }

    function closeForm() {
        if (isFormPending) {
            return;
        }
        setIsFormOpen(false);
        setEditingTask(null);
    }

    async function handleSubmit(input: CreateTaskInput) {
        try {
            if (editingTask) {
                await updateMutation.mutateAsync({ id: editingTask.id, input });
                addToast('Task updated successfully', 'success');
            } else {
                await createMutation.mutateAsync(input);
                addToast('Task created successfully', 'success');
            }
            closeForm();
        } catch (error) {
            handleMutationError(error);
        }
    }

    async function handleDelete(task: Task) {
        if (isDeletePending) {
            return;
        }

        const confirmed = window.confirm(`Delete task "${task.title}"?`);
        if (!confirmed) {
            return;
        }

        try {
            await deleteMutation.mutateAsync(task.id);
            addToast('Task deleted', 'success');
        } catch (error) {
            handleMutationError(error);
        }
    }

    async function handleRestore(task: Task) {
        if (isDeletePending) {
            return;
        }

        try {
            await restoreMutation.mutateAsync(task.id);
            addToast('Task restored', 'success');
        } catch (error) {
            handleMutationError(error);
        }
    }

    function handleResetFilters() {
        setSearchInput('');
        setQueryState(DEFAULT_QUERY);
        setIsFilterDrawerOpen(false);
    }

    function updateFilters(next: Partial<TaskQueryParams>) {
        setQueryState((prev) => ({ ...prev, ...next, page: 1 }));
    }

    function handleStatusChange(status: TaskStatus | '') {
        updateFilters({ status });
    }

    function handlePriorityChange(priority: TaskPriority | '') {
        updateFilters({ priority });
    }

    function handleSortChange(sortBy: TaskSortBy, sortOrder: SortOrder) {
        updateFilters({ sortBy, sortOrder });
    }

    function handleIncludeDeletedChange(includeDeleted: boolean) {
        updateFilters({ includeDeleted });
    }

    function handlePageChange(page: number) {
        const safePage = Math.min(Math.max(page, 1), response.meta.totalPages);
        setQueryState((prev) => ({ ...prev, page: safePage }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function handleLimitChange(limit: number) {
        setQueryState((prev) => ({ ...prev, page: 1, limit }));
    }

    if (isBootstrapping) {
        return (
            <main className="auth-shell">
                <Spinner label="Chargement de la session" />
            </main>
        );
    }

    if (!isAuthenticated || !user) {
        return (
            <>
                <AuthPage
                    isSubmitting={isSubmitting}
                    errorMessage={authError}
                    onLogin={handleLogin}
                    onRegister={handleRegister}
                />
                <ToastContainer toasts={toasts} onDismiss={dismiss} />
            </>
        );
    }

    return (
        <>
            <header className="product-header">
                <div className="product-header__content">
                    <div>
                        <p className="product-header__eyebrow">Task Operations</p>
                        <h1 className="product-header__title">Mini Task Manager</h1>
                    </div>

                    <div className="product-header__stats">
                        <p className="product-header__count">
                            Total tasks: <strong>{response.meta.total}</strong>
                        </p>
                        <div className="product-header__user">
                            <span className="product-header__email">{user.email}</span>
                            <span className={`product-header__role product-header__role--${user.role}`}>
                                {user.role}
                            </span>
                            <Button variant="ghost" size="sm" onClick={logout}>
                                Logout
                            </Button>
                        </div>
                        <Button onClick={openCreateForm} aria-label="Create task">
                            New task
                        </Button>
                    </div>
                </div>
            </header>

            <main className="product-main">
                <div className="product-layout">
                    <div className="product-layout__sidebar">
                        <TaskFilters
                            status={queryState.status ?? ''}
                            priority={queryState.priority ?? ''}
                            sortBy={queryState.sortBy ?? 'createdAt'}
                            sortOrder={queryState.sortOrder ?? 'desc'}
                            includeDeleted={Boolean(queryState.includeDeleted)}
                            canManageDeleted={canManageDeleted}
                            onStatusChange={handleStatusChange}
                            onPriorityChange={handlePriorityChange}
                            onSortChange={handleSortChange}
                            onIncludeDeletedChange={handleIncludeDeletedChange}
                            onReset={handleResetFilters}
                        />
                    </div>

                    <section className="product-layout__content">
                        <TaskToolbar
                            search={searchInput}
                            hasActiveFilters={hasActiveFilters}
                            onSearchChange={setSearchInput}
                            onOpenFilters={() => setIsFilterDrawerOpen(true)}
                            onResetFilters={handleResetFilters}
                        />

                        <TaskList
                            tasks={response.data}
                            isLoading={tasksQuery.isPending && !tasksQuery.data}
                            isError={tasksQuery.isError}
                            errorMessage={errorMessage}
                            hasFilters={hasActiveFilters}
                            canRestoreDeleted={canManageDeleted && Boolean(queryState.includeDeleted)}
                            onCreateTask={openCreateForm}
                            onResetFilters={handleResetFilters}
                            onEditTask={openEditForm}
                            onDeleteTask={handleDelete}
                            onRestoreTask={handleRestore}
                        />

                        <Pagination
                            page={response.meta.page}
                            limit={response.meta.limit}
                            total={response.meta.total}
                            totalPages={response.meta.totalPages}
                            isFetching={tasksQuery.isFetching}
                            onPageChange={handlePageChange}
                            onLimitChange={handleLimitChange}
                        />
                    </section>
                </div>
            </main>

            <Drawer
                open={isFilterDrawerOpen}
                title="Task filters"
                onClose={() => setIsFilterDrawerOpen(false)}
            >
                <TaskFilters
                    status={queryState.status ?? ''}
                    priority={queryState.priority ?? ''}
                    sortBy={queryState.sortBy ?? 'createdAt'}
                    sortOrder={queryState.sortOrder ?? 'desc'}
                    includeDeleted={Boolean(queryState.includeDeleted)}
                    canManageDeleted={canManageDeleted}
                    onStatusChange={handleStatusChange}
                    onPriorityChange={handlePriorityChange}
                    onSortChange={handleSortChange}
                    onIncludeDeletedChange={handleIncludeDeletedChange}
                    onReset={handleResetFilters}
                />
            </Drawer>

            {isFormOpen && (
                <TaskForm
                    task={editingTask}
                    isPending={isFormPending}
                    onCancel={closeForm}
                    onSubmit={handleSubmit}
                />
            )}

            <ToastContainer toasts={toasts} onDismiss={dismiss} />
        </>
    );
}
