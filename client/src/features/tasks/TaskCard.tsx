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
            className={`group relative rounded-lg border bg-app-surface p-5 shadow-xs transition-all duration-200 hover:shadow-md ${
                isDeleted
                    ? 'border-dashed border-app-border/70 bg-slate-50/50 opacity-80'
                    : 'border-app-border hover:border-app-border-hover'
            }`}
        >
            {!isDeleted && (
                <div
                    className={`absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full ${
                        task.status === 'done'
                            ? 'bg-emerald-400'
                            : task.status === 'doing'
                              ? 'bg-violet-400'
                              : 'bg-blue-400'
                    }`}
                />
            )}

            <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <h3
                    className={`text-[15px] font-semibold leading-snug text-app-text ${
                        task.status === 'done' ? 'text-app-muted line-through decoration-app-muted/40' : ''
                    }`}
                >
                    {task.title}
                </h3>
                <div className="flex shrink-0 items-center gap-1.5 self-end sm:self-auto">
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
                                className="opacity-60 group-hover:opacity-100"
                            >
                                Edit
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => onDelete(task)}
                                aria-label={`Delete task ${task.title}`}
                                className="opacity-60 group-hover:opacity-100"
                            >
                                Delete
                            </Button>
                        </>
                    )}
                </div>
            </header>

            {task.description && (
                <p className="mt-2 text-sm leading-relaxed text-app-muted">{task.description}</p>
            )}

            <footer className="mt-3 flex flex-wrap items-center gap-2">
                <Badge tone={task.status}>{STATUS_LABELS[task.status]}</Badge>
                <Badge tone={task.priority}>{PRIORITY_LABELS[task.priority]}</Badge>
                {task.dueDate && (
                    <span
                        className={`inline-flex items-center gap-1 text-xs ${
                            overdue ? 'font-semibold text-rose-600' : 'text-app-muted'
                        }`}
                    >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(task.dueDate)}
                    </span>
                )}
                {isDeleted && task.deletedAt && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Deleted {formatDate(task.deletedAt)}
                    </span>
                )}
            </footer>
        </article>
    );
}
