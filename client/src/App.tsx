import { useMemo, useState } from 'react';
import type { CreateTaskInput, Task, TaskFilters } from './types/task.types';
import { TaskFiltersBar } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { ToastContainer } from './components/Toast';
import { useToast } from './hooks/useToast';
import {
    useCreateTask,
    useDeleteTask,
    useTasksQuery,
    useUpdateTask,
} from './hooks/useTasks';

const DEFAULT_FILTERS: TaskFilters = {
    sortBy: 'createdAt',
    sortOrder: 'desc',
};

export default function App() {
    const [filters, setFilters] = useState<TaskFilters>(DEFAULT_FILTERS);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const { toasts, addToast, dismiss } = useToast();
    const tasksQuery = useTasksQuery(filters);
    const createMutation = useCreateTask();
    const updateMutation = useUpdateTask();
    const deleteMutation = useDeleteTask();

    const isFiltered = useMemo(() => {
        return Boolean(filters.status || filters.priority || filters.search?.trim());
    }, [filters]);

    const isFormPending = createMutation.isPending || updateMutation.isPending;

    function openCreateForm() {
        setEditingTask(null);
        setIsFormOpen(true);
    }

    function openEditForm(task: Task) {
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
            const message = error instanceof Error ? error.message : 'Unexpected error';
            addToast(message, 'error');
        }
    }

    async function handleDelete(task: Task) {
        const confirmed = window.confirm(`Delete task "${task.title}"?`);
        if (!confirmed) {
            return;
        }

        try {
            await deleteMutation.mutateAsync(task.id);
            addToast('Task deleted', 'success');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unexpected error';
            addToast(message, 'error');
        }
    }

    function handleResetFilters() {
        setFilters(DEFAULT_FILTERS);
    }

    return (
        <>
            <header className="app-header">
                <div className="app-header__inner">
                    <h1 className="app-header__title">Mini Task Manager</h1>
                    <button className="btn btn-primary" onClick={openCreateForm}>
                        New Task
                    </button>
                </div>
            </header>

            <main className="app-main">
                <div className="container">
                    <TaskFiltersBar
                        filters={filters}
                        onChange={setFilters}
                        onReset={handleResetFilters}
                    />

                    <TaskList
                        tasks={tasksQuery.data}
                        isLoading={tasksQuery.isLoading}
                        error={tasksQuery.error}
                        isFiltered={isFiltered}
                        onEdit={openEditForm}
                        onDelete={handleDelete}
                        onNewTask={openCreateForm}
                        onResetFilters={handleResetFilters}
                    />
                </div>
            </main>

            {isFormOpen && (
                <TaskForm
                    task={editingTask}
                    onSubmit={handleSubmit}
                    onCancel={closeForm}
                    isPending={isFormPending}
                />
            )}

            <ToastContainer toasts={toasts} onDismiss={dismiss} />
        </>
    );
}
