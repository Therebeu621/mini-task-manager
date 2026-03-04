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
            {label && <span className="text-xs font-semibold text-app-muted">{label}</span>}
            <input
                ref={ref}
                id={id}
                className={`h-10 w-full rounded-sm border px-3 text-sm text-app-text placeholder:text-app-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent/30 ${
                    error ? 'border-rose-300 bg-rose-50/30' : 'border-app-border bg-white'
                } ${className}`.trim()}
                {...props}
            />
            {error && <span className="text-xs font-medium text-rose-700">{error}</span>}
        </label>
    );
});
