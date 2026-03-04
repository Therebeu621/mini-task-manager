import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import type { SortOrder, TaskPriority, TaskSortBy, TaskStatus } from '../../types/task.types';

interface TaskFiltersProps {
    status: TaskStatus | '';
    priority: TaskPriority | '';
    sortBy: TaskSortBy;
    sortOrder: SortOrder;
    includeDeleted: boolean;
    canManageDeleted: boolean;
    onStatusChange: (status: TaskStatus | '') => void;
    onPriorityChange: (priority: TaskPriority | '') => void;
    onSortChange: (sortBy: TaskSortBy, sortOrder: SortOrder) => void;
    onIncludeDeletedChange: (value: boolean) => void;
    onReset: () => void;
}

const STATUS_FILTERS: Array<{ label: string; value: TaskStatus | '' }> = [
    { label: 'All', value: '' },
    { label: 'To do', value: 'todo' },
    { label: 'Doing', value: 'doing' },
    { label: 'Done', value: 'done' },
];

const PRIORITY_FILTERS: Array<{ label: string; value: TaskPriority | '' }> = [
    { label: 'All', value: '' },
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
];

const SORT_OPTIONS = [
    { value: 'createdAt:desc', label: 'Newest first' },
    { value: 'createdAt:asc', label: 'Oldest first' },
    { value: 'dueDate:asc', label: 'Due date (earliest)' },
    { value: 'dueDate:desc', label: 'Due date (latest)' },
    { value: 'priority:desc', label: 'Priority (high to low)' },
    { value: 'priority:asc', label: 'Priority (low to high)' },
    { value: 'status:asc', label: 'Status (A to Z)' },
    { value: 'title:asc', label: 'Title (A to Z)' },
];

export function TaskFilters({
    status,
    priority,
    sortBy,
    sortOrder,
    includeDeleted,
    canManageDeleted,
    onStatusChange,
    onPriorityChange,
    onSortChange,
    onIncludeDeletedChange,
    onReset,
}: TaskFiltersProps) {
    return (
        <aside className="sticky top-[85px] space-y-6 rounded-xl border border-app-border bg-white p-5 shadow-sm">
            <div>
                <h2 className="text-[15px] font-bold text-app-text">Filters</h2>
                <p className="mt-0.5 text-xs text-app-muted">Narrow down the task list.</p>
            </div>

            <hr className="border-app-border" />

            <section>
                <h3 className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-app-muted">
                    Status
                </h3>
                <div className="flex flex-wrap gap-1.5">
                    {STATUS_FILTERS.map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            onClick={() => onStatusChange(item.value)}
                            aria-pressed={status === item.value}
                            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                                status === item.value
                                    ? 'bg-app-accent text-white shadow-sm'
                                    : 'bg-app-surface-muted text-app-muted ring-1 ring-inset ring-app-border hover:bg-app-surface-hover hover:text-app-text'
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </section>

            <section>
                <h3 className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-app-muted">
                    Priority
                </h3>
                <div className="flex flex-wrap gap-1.5">
                    {PRIORITY_FILTERS.map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            onClick={() => onPriorityChange(item.value)}
                            aria-pressed={priority === item.value}
                            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                                priority === item.value
                                    ? 'bg-app-accent text-white shadow-sm'
                                    : 'bg-app-surface-muted text-app-muted ring-1 ring-inset ring-app-border hover:bg-app-surface-hover hover:text-app-text'
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </section>

            <Select
                id="sort-order"
                label="Sort"
                value={`${sortBy}:${sortOrder}`}
                options={SORT_OPTIONS}
                onChange={(event) => {
                    const [nextSortBy, nextSortOrder] = event.target.value.split(':') as [
                        TaskSortBy,
                        SortOrder,
                    ];
                    onSortChange(nextSortBy, nextSortOrder);
                }}
            />

            {canManageDeleted && (
                <label
                    className="flex cursor-pointer items-center gap-2.5 rounded-md bg-app-surface-muted px-3 py-2.5 text-sm text-app-muted ring-1 ring-inset ring-app-border transition-colors hover:bg-app-surface-hover"
                    htmlFor="include-deleted"
                >
                    <input
                        id="include-deleted"
                        type="checkbox"
                        checked={includeDeleted}
                        onChange={(event) => onIncludeDeletedChange(event.target.checked)}
                        className="h-4 w-4 rounded border-app-border accent-app-accent"
                    />
                    <span className="text-xs font-medium">Include soft-deleted tasks</span>
                </label>
            )}

            <Button variant="ghost" size="sm" onClick={onReset} fullWidth>
                Reset filters
            </Button>
        </aside>
    );
}
