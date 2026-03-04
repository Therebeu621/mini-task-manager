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
        <section className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <Input
                id="task-search"
                label="Search"
                placeholder="Search by title or description"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                aria-label="Search tasks"
                className="sm:min-w-[320px]"
            />

            <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={onOpenFilters} className="lg:hidden">
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
