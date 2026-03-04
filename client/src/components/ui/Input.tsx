import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Input as ShadInput } from '../shadcn/input';

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
            <ShadInput
                ref={ref}
                id={id}
                className={cn(
                    error
                        ? 'border-rose-300 bg-rose-50/40 focus-visible:border-rose-400 focus-visible:ring-rose-200'
                        : 'hover:border-app-border-hover',
                    className,
                )}
                {...props}
            />
            {error && <span className="text-xs font-medium text-rose-600">{error}</span>}
        </label>
    );
});
