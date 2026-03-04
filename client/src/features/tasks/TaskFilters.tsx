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
        <aside className="space-y-5 rounded-lg border border-app-border bg-app-surface p-5 shadow-sm">
            <div>
                <h2 className="text-lg font-semibold text-app-text">Filters</h2>
                <p className="mt-1 text-sm text-app-muted">Narrow down the task list quickly.</p>
            </div>

            <section>
                <h3 className="mb-2 text-sm font-semibold text-app-muted">Status</h3>
                <div className="flex flex-wrap gap-2">
                    {STATUS_FILTERS.map((item) => (
                        <Button
                            key={item.label}
                            variant={status === item.value ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => onStatusChange(item.value)}
                            aria-pressed={status === item.value}
                        >
                            {item.label}
                        </Button>
                    ))}
                </div>
            </section>

            <section>
                <h3 className="mb-2 text-sm font-semibold text-app-muted">Priority</h3>
                <div className="flex flex-wrap gap-2">
                    {PRIORITY_FILTERS.map((item) => (
                        <Button
                            key={item.label}
                            variant={priority === item.value ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => onPriorityChange(item.value)}
                            aria-pressed={priority === item.value}
                        >
                            {item.label}
                        </Button>
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
                <label className="inline-flex items-center gap-2 text-sm text-app-muted" htmlFor="include-deleted">
                    <input
                        id="include-deleted"
                        type="checkbox"
                        checked={includeDeleted}
                        onChange={(event) => onIncludeDeletedChange(event.target.checked)}
                        className="h-4 w-4 accent-[var(--accent)]"
                    />
                    <span>Include soft-deleted tasks</span>
                </label>
            )}

            <Button variant="secondary" onClick={onReset}>
                Reset filters
            </Button>
        </aside>
    );
}
