import { Button } from './Button';
import { Select } from './Select';

type PageToken = number | 'ellipsis-left' | 'ellipsis-right';

interface PaginationProps {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    isFetching?: boolean;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
}

function buildPageTokens(current: number, totalPages: number): PageToken[] {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (current <= 4) {
        return [1, 2, 3, 4, 5, 'ellipsis-right', totalPages];
    }

    if (current >= totalPages - 3) {
        return [
            1,
            'ellipsis-left',
            totalPages - 4,
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages,
        ];
    }

    return [1, 'ellipsis-left', current - 1, current, current + 1, 'ellipsis-right', totalPages];
}

export function Pagination({
    page,
    limit,
    total,
    totalPages,
    isFetching = false,
    onPageChange,
    onLimitChange,
}: PaginationProps) {
    const safeTotalPages = Math.max(totalPages, 1);
    const start = total === 0 ? 0 : (page - 1) * limit + 1;
    const end = total === 0 ? 0 : Math.min(page * limit, total);
    const tokens = buildPageTokens(page, safeTotalPages);

    return (
        <section
            className="mt-6 space-y-3 rounded-lg border border-app-border bg-app-surface p-4 shadow-xs"
            aria-label="Pagination"
        >
            <div className="flex items-center gap-2 text-sm text-app-muted">
                <span>
                    Showing <strong className="font-semibold text-app-text">{start}&ndash;{end}</strong> of{' '}
                    <strong className="font-semibold text-app-text">{total}</strong>
                </span>
                {isFetching && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-app-accent">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-app-accent" />
                        Updating
                    </span>
                )}
            </div>

            <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
                <Select
                    aria-label="Page size"
                    label="Rows"
                    value={String(limit)}
                    onChange={(event) => onLimitChange(Number(event.target.value))}
                    options={[
                        { value: '10', label: '10' },
                        { value: '20', label: '20' },
                        { value: '50', label: '50' },
                    ]}
                    className="!w-20"
                />

                <div className="flex flex-wrap items-center gap-1.5">
                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => onPageChange(1)}
                        aria-label="Go to first page"
                    >
                        First
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => onPageChange(page - 1)}
                        aria-label="Go to previous page"
                    >
                        Prev
                    </Button>

                    {tokens.map((token) =>
                        typeof token === 'number' ? (
                            <Button
                                key={token}
                                variant={token === page ? 'primary' : 'ghost'}
                                size="sm"
                                onClick={() => onPageChange(token)}
                                aria-label={`Go to page ${token}`}
                                aria-current={token === page ? 'page' : undefined}
                                className={token === page ? 'pointer-events-none' : ''}
                            >
                                {token}
                            </Button>
                        ) : (
                            <span
                                key={token}
                                className="px-1 text-sm text-app-muted/60"
                                aria-hidden="true"
                            >
                                &hellip;
                            </span>
                        ),
                    )}

                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={page >= safeTotalPages}
                        onClick={() => onPageChange(page + 1)}
                        aria-label="Go to next page"
                    >
                        Next
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={page >= safeTotalPages}
                        onClick={() => onPageChange(safeTotalPages)}
                        aria-label="Go to last page"
                    >
                        Last
                    </Button>
                </div>
            </div>
        </section>
    );
}
