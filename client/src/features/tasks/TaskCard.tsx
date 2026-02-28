import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import type { Task } from '../../types/task.types';
import { formatDate, isOverdue, PRIORITY_LABELS, STATUS_LABELS } from '../../utils/formatters';

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
    const overdue = isOverdue(task.dueDate) && task.status !== 'done';

    return (
        <article className="task-card-v2">
            <header className="task-card-v2__header">
                <h3 className={`task-card-v2__title${task.status === 'done' ? ' is-done' : ''}`}>
                    {task.title}
                </h3>
                <div className="task-card-v2__actions">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(task)}
                        aria-label={`Edit task ${task.title}`}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onDelete(task)}
                        aria-label={`Delete task ${task.title}`}
                    >
                        Delete
                    </Button>
                </div>
            </header>

            {task.description && <p className="task-card-v2__description">{task.description}</p>}

            <footer className="task-card-v2__meta">
                <Badge tone={task.status}>{STATUS_LABELS[task.status]}</Badge>
                <Badge tone={task.priority}>{PRIORITY_LABELS[task.priority]}</Badge>
                {task.dueDate && (
                    <span className={`task-card-v2__due${overdue ? ' is-overdue' : ''}`}>
                        Due {formatDate(task.dueDate)}
                    </span>
                )}
            </footer>
        </article>
    );
}
