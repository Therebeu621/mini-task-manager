import type { SelectHTMLAttributes } from 'react';

export interface SelectOption {
    label: string;
    value: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: SelectOption[];
}

export function Select({ label, options, className = '', id, ...props }: SelectProps) {
    return (
        <label className="flex w-full flex-col gap-1.5" htmlFor={id}>
            {label && (
                <span className="text-xs font-semibold uppercase tracking-wide text-app-muted">
                    {label}
                </span>
            )}
            <select
                id={id}
                className={`h-10 w-full cursor-pointer rounded-md border border-app-border bg-white px-3 text-sm text-app-text transition-all duration-150 hover:border-app-border-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent/25 focus-visible:border-app-accent ${className}`.trim()}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
}
