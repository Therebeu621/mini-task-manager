/**
 * TaskCard — displays a single task with its metadata and action buttons.
 */
import type { Task } from '../types/task.types';
import {
    formatDate,
    isOverdue,
    STATUS_LABELS,
    STATUS_ICONS,
    PRIORITY_LABELS,
    PRIORITY_ICONS,
} from '../utils/formatters';

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
    const overdue = isOverdue(task.dueDate) && task.status !== 'done';

    return (
        <article className="card task-card">
            {/* ── Body ────────────────────────────────── */}
            <div className="task-card__body">
                <h3 className={`task-card__title${task.status === 'done' ? ' task-card__title--done' : ''}`}>
                    {task.title}
                </h3>

                {task.description && (
                    <p className="task-card__description">{task.description}</p>
                )}

                <div className="task-card__meta">
                    {/* Status badge */}
                    <span className={`badge badge--${task.status}`}>
                        {STATUS_ICONS[task.status]} {STATUS_LABELS[task.status]}
                    </span>

                    {/* Priority badge */}
                    <span className={`badge badge--${task.priority}`}>
                        {PRIORITY_ICONS[task.priority]} {PRIORITY_LABELS[task.priority]}
                    </span>

                    {/* Due date */}
                    {task.dueDate && (
                        <span className={`task-card__due${overdue ? ' task-card__due--overdue' : ''}`}>
                            🗓 {overdue ? 'Overdue · ' : ''}{formatDate(task.dueDate)}
                        </span>
                    )}
                </div>
            </div>

            {/* ── Actions ─────────────────────────────── */}
            <div className="task-card__actions">
                <button
                    className="btn btn-icon"
                    onClick={() => onEdit(task)}
                    title="Edit task"
                    aria-label={`Edit "${task.title}"`}
                >
                    ✏️
                </button>
                <button
                    className="btn btn-icon"
                    onClick={() => onDelete(task)}
                    title="Delete task"
                    aria-label={`Delete "${task.title}"`}
                    style={{ color: 'var(--color-danger)' }}
                >
                    🗑
                </button>
            </div>
        </article>
    );
}
