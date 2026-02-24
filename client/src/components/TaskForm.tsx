/**
 * TaskForm — modal for creating or editing a task.
 * Controlled form with React state and client-side Zod validation.
 */
import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import type { Task, CreateTaskInput } from '../types/task.types';
import { toDateInputValue } from '../utils/formatters';

// ── Validation schema (mirrors the server-side schema) ─────────────────────
const taskFormSchema = z.object({
    title: z.string().trim().min(1, 'Title is required').max(200, 'Title is too long'),
    description: z.string().trim().max(2000, 'Description is too long').optional(),
    status: z.enum(['todo', 'doing', 'done']),
    priority: z.enum(['low', 'medium', 'high']),
    dueDate: z.string().optional(),
});

type FormErrors = Partial<Record<keyof z.infer<typeof taskFormSchema>, string>>;

interface TaskFormProps {
    /** When provided the form operates in edit mode */
    task?: Task | null;
    onSubmit: (data: CreateTaskInput) => void;
    onCancel: () => void;
    isPending: boolean;
}

export function TaskForm({ task, onSubmit, onCancel, isPending }: TaskFormProps) {
    const [title, setTitle] = useState(task?.title ?? '');
    const [description, setDescription] = useState(task?.description ?? '');
    const [status, setStatus] = useState(task?.status ?? 'todo');
    const [priority, setPriority] = useState(task?.priority ?? 'medium');
    const [dueDate, setDueDate] = useState(toDateInputValue(task?.dueDate));
    const [errors, setErrors] = useState<FormErrors>({});

    const titleRef = useRef<HTMLInputElement>(null);
    const isEdit = !!task;

    useEffect(() => {
        setTitle(task?.title ?? '');
        setDescription(task?.description ?? '');
        setStatus(task?.status ?? 'todo');
        setPriority(task?.priority ?? 'medium');
        setDueDate(toDateInputValue(task?.dueDate));
        setErrors({});
    }, [task]);

    // Auto-focus title on open
    useEffect(() => {
        setTimeout(() => titleRef.current?.focus(), 50);
    }, []);

    // Close on Escape
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onCancel]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const raw = { title, description: description || undefined, status, priority, dueDate: dueDate || undefined };
        const result = taskFormSchema.safeParse(raw);

        if (!result.success) {
            const fieldErrors: FormErrors = {};
            for (const issue of result.error.issues) {
                const field = issue.path[0] as keyof FormErrors;
                if (!fieldErrors[field]) fieldErrors[field] = issue.message;
            }
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        const data: CreateTaskInput = {
            title: result.data.title,
            description: result.data.description ?? null,
            status: result.data.status,
            priority: result.data.priority,
            dueDate: result.data.dueDate ? new Date(result.data.dueDate).toISOString() : null,
        };
        onSubmit(data);
    }

    return (
        <div
            className="modal-backdrop"
            onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-form-title"
        >
            <div className="modal">
                {/* ── Header ─────────────────────────────────── */}
                <div className="modal__header">
                    <h2 className="modal__title" id="task-form-title">
                        {isEdit ? '✏️ Edit Task' : '+ New Task'}
                    </h2>
                    <button type="button" className="btn btn-icon" onClick={onCancel} aria-label="Close">
                        ✕
                    </button>
                </div>

                {/* ── Form ───────────────────────────────────── */}
                <form className="modal__form" onSubmit={handleSubmit} noValidate>

                    {/* Title */}
                    <div className="form-group">
                        <label htmlFor="task-title">
                            Title <span style={{ color: 'var(--color-danger)' }}>*</span>
                        </label>
                        <input
                            ref={titleRef}
                            id="task-title"
                            type="text"
                            placeholder="What needs to be done?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={200}
                        />
                        {errors.title && <span className="field-error">{errors.title}</span>}
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label htmlFor="task-description">Description</label>
                        <textarea
                            id="task-description"
                            placeholder="Optional details…"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                        {errors.description && <span className="field-error">{errors.description}</span>}
                    </div>

                    {/* Status + Priority */}
                    <div className="modal__form-row">
                        <div className="form-group">
                            <label htmlFor="task-status">Status</label>
                            <select
                                id="task-status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as typeof status)}
                            >
                                <option value="todo">To Do</option>
                                <option value="doing">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="task-priority">Priority</label>
                            <select
                                id="task-priority"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as typeof priority)}
                            >
                                <option value="high">🔴 High</option>
                                <option value="medium">🟡 Medium</option>
                                <option value="low">🟢 Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Due date */}
                    <div className="form-group">
                        <label htmlFor="task-due">Due date (optional)</label>
                        <input
                            id="task-due"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </div>

                    {/* Footer */}
                    <div className="modal__footer">
                        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={isPending}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={isPending}>
                            {isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
