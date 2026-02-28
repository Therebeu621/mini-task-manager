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
    onCreateTask: () => void;
    onResetFilters: () => void;
    onEditTask: (task: Task) => void;
    onDeleteTask: (task: Task) => void;
}

export function TaskList({
    tasks,
    isLoading,
    isError,
    errorMessage,
    hasFilters,
    onCreateTask,
    onResetFilters,
    onEditTask,
    onDeleteTask,
}: TaskListProps) {
    if (isLoading) {
        return <Spinner label="Loading tasks" />;
    }

    if (isError) {
        return (
            <section className="task-state task-state--error">
                <h2>Unable to load tasks</h2>
                <p>{errorMessage}</p>
            </section>
        );
    }

    if (tasks.length === 0) {
        return (
            <section className="task-state">
                <h2>{hasFilters ? 'No tasks match current filters' : 'No tasks yet'}</h2>
                <p>
                    {hasFilters
                        ? 'Try adjusting filters or search terms.'
                        : 'Create your first task to start tracking work.'}
                </p>
                <div className="task-state__actions">
                    {hasFilters && (
                        <Button variant="ghost" onClick={onResetFilters}>
                            Reset filters
                        </Button>
                    )}
                    <Button onClick={onCreateTask}>Create task</Button>
                </div>
            </section>
        );
    }

    return (
        <div className="task-list-v2">
            {tasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
            ))}
        </div>
    );
}
