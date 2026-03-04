import type { Task } from '../../types/task.types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
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
            <Card className="space-y-2 border-rose-200 bg-rose-50/40 p-8 text-center">
                <h2 className="text-lg font-semibold text-rose-700">Unable to load tasks</h2>
                <p className="text-sm text-rose-700/90">{errorMessage}</p>
            </Card>
        );
    }

    if (tasks.length === 0) {
        return (
            <Card className="space-y-3 p-8 text-center">
                <h2 className="text-lg font-semibold text-app-text">
                    {hasFilters ? 'No tasks match current filters' : 'No tasks yet'}
                </h2>
                <p className="text-sm text-app-muted">
                    {hasFilters
                        ? 'Try adjusting filters or search terms.'
                        : 'Create your first task to start tracking work.'}
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {hasFilters && (
                        <Button variant="ghost" onClick={onResetFilters}>
                            Reset filters
                        </Button>
                    )}
                    <Button onClick={onCreateTask}>Create task</Button>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
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
