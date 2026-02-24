/**
 * TaskList — renders the full task list with loading, empty, and error states.
 */
import type { Task } from '../types/task.types';
import { TaskCard } from './TaskCard';
import { LoadingSpinner } from './LoadingSpinner';
import { EmptyState } from './EmptyState';

interface TaskListProps {
    tasks: Task[] | undefined;
    isLoading: boolean;
    error: Error | null;
    isFiltered: boolean;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
    onNewTask: () => void;
    onResetFilters: () => void;
}

export function TaskList({
    tasks,
    isLoading,
    error,
    isFiltered,
    onEdit,
    onDelete,
    onNewTask,
    onResetFilters,
}: TaskListProps) {
    if (isLoading) return <LoadingSpinner />;

    if (error) {
        return (
            <div className="empty-state">
                <span className="empty-state__icon">⚠️</span>
                <h2 className="empty-state__title">Failed to load tasks</h2>
                <p style={{ color: 'var(--color-text-muted)' }}>{error.message}</p>
            </div>
        );
    }

    if (!tasks || tasks.length === 0) {
        return (
            <EmptyState
                filtered={isFiltered}
                onNewTask={onNewTask}
                onReset={onResetFilters}
            />
        );
    }

    return (
        <div className="task-list">
            {tasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </div>
    );
}
