interface SpinnerProps {
    label?: string;
}

export function Spinner({ label = 'Loading' }: SpinnerProps) {
    return (
        <div className="grid place-items-center p-8" role="status" aria-live="polite" aria-label={label}>
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-app-accent" />
        </div>
    );
}
