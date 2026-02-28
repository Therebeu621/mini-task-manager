import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

interface TaskToolbarProps {
    search: string;
    hasActiveFilters: boolean;
    onSearchChange: (value: string) => void;
    onOpenFilters: () => void;
    onResetFilters: () => void;
}

export function TaskToolbar({
    search,
    hasActiveFilters,
    onSearchChange,
    onOpenFilters,
    onResetFilters,
}: TaskToolbarProps) {
    return (
        <section className="task-toolbar">
            <Input
                id="task-search"
                label="Search"
                placeholder="Search by title or description"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                aria-label="Search tasks"
            />

            <div className="task-toolbar__actions">
                <Button variant="secondary" onClick={onOpenFilters} className="task-toolbar__mobile-trigger">
                    Filters
                </Button>
                {hasActiveFilters && (
                    <Button variant="ghost" onClick={onResetFilters}>
                        Reset filters
                    </Button>
                )}
            </div>
        </section>
    );
}
