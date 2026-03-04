import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import type { Task } from '../../types/task.types';
import { formatDate, isOverdue, PRIORITY_LABELS, STATUS_LABELS } from '../../utils/formatters';

interface TaskCardProps {
    task: Task;
    canRestore: boolean;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
    onRestore: (task: Task) => void;
}

export function TaskCard({ task, canRestore, onEdit, onDelete, onRestore }: TaskCardProps) {
    const overdue = isOverdue(task.dueDate) && task.status !== 'done';
    const isDeleted = Boolean(task.deletedAt);

    return (
        <article
            className={`rounded-md border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                isDeleted
                    ? 'border-dashed border-app-border bg-slate-50/60 opacity-90'
                    : 'border-app-border bg-app-surface'
            }`}
        >
            <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <h3
                    className={`text-base font-semibold text-app-text ${
                        task.status === 'done' ? 'text-app-muted line-through' : ''
                    }`}
                >
                    {task.title}
                </h3>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                    {isDeleted ? (
                        canRestore && (
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => onRestore(task)}
                                aria-label={`Restore task ${task.title}`}
                            >
                                Restore
                            </Button>
                        )
                    ) : (
                        <>
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
                        </>
                    )}
                </div>
            </header>

            {task.description && <p className="mt-3 text-sm text-app-muted">{task.description}</p>}

            <footer className="mt-4 flex flex-wrap items-center gap-2">
                <Badge tone={task.status}>{STATUS_LABELS[task.status]}</Badge>
                <Badge tone={task.priority}>{PRIORITY_LABELS[task.priority]}</Badge>
                {task.dueDate && (
                    <span className={`text-xs ${overdue ? 'font-semibold text-rose-700' : 'text-app-muted'}`}>
                        Due {formatDate(task.dueDate)}
                    </span>
                )}
                {isDeleted && task.deletedAt && (
                    <span className="text-xs font-semibold text-rose-700">
                        Deleted on {formatDate(task.deletedAt)}
                    </span>
                )}
            </footer>
        </article>
    );
}
