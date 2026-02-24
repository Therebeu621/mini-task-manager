/**
 * Filters + sort bar for the task list.
 * Controlled component — all state lives in the parent App.
 */
import type { TaskFilters } from '../types/task.types';

interface TaskFiltersProps {
    filters: TaskFilters;
    onChange: (filters: TaskFilters) => void;
    onReset: () => void;
}

export function TaskFiltersBar({ filters, onChange, onReset }: TaskFiltersProps) {
    const isFiltered =
        !!filters.status || !!filters.priority || !!filters.search?.trim();

    return (
        <div className="filters-bar">
            {/* Search */}
            <div className="filters-bar__group" style={{ flex: '1 1 200px' }}>
                <label htmlFor="filter-search">Search</label>
                <input
                    id="filter-search"
                    type="text"
                    placeholder="Search by title or description…"
                    value={filters.search ?? ''}
                    onChange={(e) => onChange({ ...filters, search: e.target.value })}
                />
            </div>

            {/* Status */}
            <div className="filters-bar__group">
                <label htmlFor="filter-status">Status</label>
                <select
                    id="filter-status"
                    value={filters.status ?? ''}
                    onChange={(e) =>
                        onChange({ ...filters, status: e.target.value as TaskFilters['status'] })
                    }
                >
                    <option value="">All statuses</option>
                    <option value="todo">To Do</option>
                    <option value="doing">In Progress</option>
                    <option value="done">Done</option>
                </select>
            </div>

            {/* Priority */}
            <div className="filters-bar__group">
                <label htmlFor="filter-priority">Priority</label>
                <select
                    id="filter-priority"
                    value={filters.priority ?? ''}
                    onChange={(e) =>
                        onChange({ ...filters, priority: e.target.value as TaskFilters['priority'] })
                    }
                >
                    <option value="">All priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
            </div>

            {/* Sort */}
            <div className="filters-bar__group">
                <label htmlFor="filter-sort">Sort by</label>
                <select
                    id="filter-sort"
                    value={`${filters.sortBy ?? 'createdAt'}:${filters.sortOrder ?? 'desc'}`}
                    onChange={(e) => {
                        const [sortBy, sortOrder] = e.target.value.split(':') as [
                            TaskFilters['sortBy'],
                            TaskFilters['sortOrder'],
                        ];
                        onChange({ ...filters, sortBy, sortOrder });
                    }}
                >
                    <option value="createdAt:desc">Newest first</option>
                    <option value="createdAt:asc">Oldest first</option>
                    <option value="dueDate:asc">Due date (earliest)</option>
                    <option value="dueDate:desc">Due date (latest)</option>
                    <option value="priority:desc">Priority (high → low)</option>
                    <option value="priority:asc">Priority (low → high)</option>
                    <option value="title:asc">Title (A → Z)</option>
                </select>
            </div>

            {/* Reset */}
            {isFiltered && (
                <div className="filters-bar__reset">
                    <button className="btn btn-ghost btn-sm" onClick={onReset} title="Clear all filters">
                        ✕ Clear
                    </button>
                </div>
            )}
        </div>
    );
}
