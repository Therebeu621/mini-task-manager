/** Empty state shown when no tasks match the current filters */
interface EmptyStateProps {
    filtered: boolean;
    onNewTask: () => void;
    onReset: () => void;
}

export function EmptyState({ filtered, onNewTask, onReset }: EmptyStateProps) {
    return (
        <div className="empty-state">
            <span className="empty-state__icon">{filtered ? '🔍' : '📋'}</span>
            <h2 className="empty-state__title">
                {filtered ? 'No tasks match your filters' : 'No tasks yet'}
            </h2>
            <p style={{ marginBottom: '24px' }}>
                {filtered
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Create your first task to get started.'}
            </p>
            {filtered ? (
                <button className="btn btn-ghost" onClick={onReset}>
                    Clear filters
                </button>
            ) : (
                <button className="btn btn-primary" onClick={onNewTask}>
                    + New Task
                </button>
            )}
        </div>
    );
}
