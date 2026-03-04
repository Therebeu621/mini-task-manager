interface SpinnerProps {
    label?: string;
}

export function Spinner({ label = 'Loading' }: SpinnerProps) {
    return (
        <div className="grid place-items-center py-12" role="status" aria-live="polite" aria-label={label}>
            <div className="relative h-9 w-9">
                <div className="absolute inset-0 rounded-full border-[3px] border-app-border" />
                <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-app-accent" />
            </div>
            <span className="mt-3 text-xs font-medium text-app-muted">{label}...</span>
        </div>
    );
}
