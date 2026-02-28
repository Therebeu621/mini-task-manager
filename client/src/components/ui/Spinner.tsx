interface SpinnerProps {
    label?: string;
}

export function Spinner({ label = 'Loading' }: SpinnerProps) {
    return (
        <div className="ui-spinner-wrap" role="status" aria-live="polite" aria-label={label}>
            <div className="ui-spinner" />
        </div>
    );
}
