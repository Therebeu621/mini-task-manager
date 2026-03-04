import type { Task } from '../../types/task.types';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { TaskCard } from './TaskCard';

interface TaskListProps {
    tasks: Task[];
    isLoading: boolean;
    isError: boolean;
    errorMessage: string;
    hasFilters: boolean;
    canRestoreDeleted: boolean;
    onCreateTask: () => void;
    onResetFilters: () => void;
    onEditTask: (task: Task) => void;
    onDeleteTask: (task: Task) => void;
    onRestoreTask: (task: Task) => void;
}

export function TaskList({
    tasks,
    isLoading,
    isError,
    errorMessage,
    hasFilters,
    canRestoreDeleted,
    onCreateTask,
    onResetFilters,
    onEditTask,
    onDeleteTask,
    onRestoreTask,
}: TaskListProps) {
    if (isLoading) {
        return <Spinner label="Loading tasks" />;
    }

    if (isError) {
        return (
            <div className="rounded-lg border border-rose-200 bg-rose-50/60 p-8 text-center shadow-xs">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-rose-100">
                    <svg className="h-5 w-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>
                <h2 className="text-base font-bold text-rose-700">Unable to load tasks</h2>
                <p className="mt-1 text-sm text-rose-600/80">{errorMessage}</p>
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="rounded-lg border border-dashed border-app-border bg-app-surface p-10 text-center shadow-xs">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-app-surface-muted">
                    <svg className="h-6 w-6 text-app-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <h2 className="text-base font-bold text-app-text">
                    {hasFilters ? 'No tasks match current filters' : 'No tasks yet'}
                </h2>
                <p className="mt-1 text-sm text-app-muted">
                    {hasFilters
                        ? 'Try adjusting filters or search terms.'
                        : 'Create your first task to start tracking work.'}
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                    {hasFilters && (
                        <Button variant="ghost" onClick={onResetFilters}>
                            Reset filters
                        </Button>
                    )}
                    <Button onClick={onCreateTask}>Create task</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    canRestore={canRestoreDeleted}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                    onRestore={onRestoreTask}
                />
            ))}
        </div>
    );
}
