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
            <div className="relative sm:min-w-[320px]">
                <svg
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-app-muted/60"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <Input
                    id="task-search"
                    placeholder="Search by title or description..."
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    aria-label="Search tasks"
                    className="!pl-9"
                />
            </div>

            <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={onOpenFilters} className="lg:hidden">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
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
