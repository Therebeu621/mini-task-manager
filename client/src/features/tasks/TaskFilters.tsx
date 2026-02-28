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
        <aside className="task-filters">
            <div>
                <h2 className="task-filters__title">Filters</h2>
                <p className="task-filters__subtitle">Narrow down the task list quickly.</p>
            </div>

            <section className="task-filters__group">
                <h3>Status</h3>
                <div className="task-filters__chips">
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

            <section className="task-filters__group">
                <h3>Priority</h3>
                <div className="task-filters__chips">
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
                <label className="task-filters__toggle" htmlFor="include-deleted">
                    <input
                        id="include-deleted"
                        type="checkbox"
                        checked={includeDeleted}
                        onChange={(event) => onIncludeDeletedChange(event.target.checked)}
                    />
                    <span>Inclure les tâches supprimées</span>
                </label>
            )}

            <Button variant="secondary" onClick={onReset}>
                Reset filters
            </Button>
        </aside>
    );
}
