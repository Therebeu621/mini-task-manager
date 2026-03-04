import { useEffect, useRef, useState, type FormEvent } from 'react';
import { z } from 'zod';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import type { CreateTaskInput, Task } from '../../types/task.types';
import { toDateInputValue } from '../../utils/formatters';

const taskFormSchema = z.object({
    title: z.string().trim().min(1, 'Title is required').max(200, 'Title is too long'),
    description: z.string().trim().max(2000, 'Description is too long').optional(),
    status: z.enum(['todo', 'doing', 'done']),
    priority: z.enum(['low', 'medium', 'high']),
    dueDate: z.string().optional(),
});

type FormValues = z.infer<typeof taskFormSchema>;
type FormErrors = Partial<Record<keyof FormValues, string>>;

interface TaskFormProps {
    task: Task | null;
    isPending: boolean;
    onCancel: () => void;
    onSubmit: (payload: CreateTaskInput) => void;
}

function initialValues(task: Task | null): FormValues {
    return {
        title: task?.title ?? '',
        description: task?.description ?? '',
        status: task?.status ?? 'todo',
        priority: task?.priority ?? 'medium',
        dueDate: toDateInputValue(task?.dueDate),
    };
}

export function TaskForm({ task, isPending, onCancel, onSubmit }: TaskFormProps) {
    const [values, setValues] = useState<FormValues>(() => initialValues(task));
    const [errors, setErrors] = useState<FormErrors>({});
    const titleRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setValues(initialValues(task));
        setErrors({});
    }, [task]);

    useEffect(() => {
        const timer = window.setTimeout(() => titleRef.current?.focus(), 40);
        return () => window.clearTimeout(timer);
    }, []);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onCancel();
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onCancel]);

    const isEditMode = Boolean(task);

    function handleChange<K extends keyof FormValues>(key: K, value: FormValues[K]) {
        setValues((prev) => ({ ...prev, [key]: value }));
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const result = taskFormSchema.safeParse(values);
        if (!result.success) {
            const nextErrors: FormErrors = {};
            for (const issue of result.error.issues) {
                const key = issue.path[0] as keyof FormValues;
                if (!nextErrors[key]) {
                    nextErrors[key] = issue.message;
                }
            }
            setErrors(nextErrors);
            return;
        }

        setErrors({});
        onSubmit({
            title: result.data.title,
            description: result.data.description || null,
            status: result.data.status,
            priority: result.data.priority,
            dueDate: result.data.dueDate ? new Date(result.data.dueDate).toISOString() : null,
        });
    }

    return (
        <div
            className="fixed inset-0 z-40 grid place-items-center bg-slate-950/40 p-4 backdrop-blur-[3px] animate-fade-in"
            role="presentation"
            onClick={onCancel}
        >
            <section
                className="w-full max-w-2xl rounded-xl border border-app-border bg-white shadow-xl animate-scale-in"
                role="dialog"
                aria-modal="true"
                aria-label={isEditMode ? 'Edit task' : 'Create task'}
                onClick={(event) => event.stopPropagation()}
            >
                <header className="flex items-center justify-between border-b border-app-border px-6 py-4">
                    <h2 className="text-lg font-bold text-app-text">
                        {isEditMode ? 'Edit task' : 'Create task'}
                    </h2>
                    <Button variant="ghost" size="sm" onClick={onCancel}>
                        Close
                    </Button>
                </header>

                <form className="space-y-5 p-6" onSubmit={handleSubmit} noValidate>
                    <Input
                        id="task-title"
                        ref={titleRef}
                        label="Title"
                        value={values.title}
                        onChange={(event) => handleChange('title', event.target.value)}
                        maxLength={200}
                        error={errors.title}
                    />

                    <label className="flex flex-col gap-1.5" htmlFor="task-description">
                        <span className="text-xs font-semibold uppercase tracking-wide text-app-muted">
                            Description
                        </span>
                        <textarea
                            id="task-description"
                            className="min-h-24 w-full rounded-md border border-app-border bg-white px-3 py-2.5 text-sm text-app-text transition-all duration-150 placeholder:text-app-muted/50 hover:border-app-border-hover focus-visible:border-app-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent/25"
                            value={values.description}
                            onChange={(event) => handleChange('description', event.target.value)}
                            rows={4}
                        />
                        {errors.description && (
                            <span className="text-xs font-medium text-rose-600">{errors.description}</span>
                        )}
                    </label>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Select
                            id="task-status"
                            label="Status"
                            value={values.status}
                            onChange={(event) =>
                                handleChange('status', event.target.value as FormValues['status'])
                            }
                            options={[
                                { value: 'todo', label: 'To do' },
                                { value: 'doing', label: 'Doing' },
                                { value: 'done', label: 'Done' },
                            ]}
                        />

                        <Select
                            id="task-priority"
                            label="Priority"
                            value={values.priority}
                            onChange={(event) =>
                                handleChange('priority', event.target.value as FormValues['priority'])
                            }
                            options={[
                                { value: 'low', label: 'Low' },
                                { value: 'medium', label: 'Medium' },
                                { value: 'high', label: 'High' },
                            ]}
                        />
                    </div>

                    <Input
                        id="task-due-date"
                        label="Due date"
                        type="date"
                        value={values.dueDate}
                        onChange={(event) => handleChange('dueDate', event.target.value)}
                        error={errors.dueDate}
                    />

                    <footer className="flex justify-end gap-2 border-t border-app-border pt-5">
                        <Button type="button" variant="ghost" onClick={onCancel} disabled={isPending}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Saving...' : isEditMode ? 'Save changes' : 'Create task'}
                        </Button>
                    </footer>
                </form>
            </section>
        </div>
    );
}
