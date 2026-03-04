import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
    { label, error, className = '', id, ...props },
    ref,
) {
    return (
        <label className="flex w-full flex-col gap-1.5" htmlFor={id}>
            {label && (
                <span className="text-xs font-semibold uppercase tracking-wide text-app-muted">
                    {label}
                </span>
            )}
            <input
                ref={ref}
                id={id}
                className={`h-10 w-full rounded-md border px-3 text-sm text-app-text transition-all duration-150 placeholder:text-app-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent/25 focus-visible:border-app-accent ${
                    error
                        ? 'border-rose-300 bg-rose-50/40 focus-visible:ring-rose-200'
                        : 'border-app-border bg-white hover:border-app-border-hover'
                } ${className}`.trim()}
                {...props}
            />
            {error && <span className="text-xs font-medium text-rose-600">{error}</span>}
        </label>
    );
});
