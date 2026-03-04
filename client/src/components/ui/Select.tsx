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
            {label && <span className="text-xs font-semibold text-app-muted">{label}</span>}
            <select
                id={id}
                className={`h-10 w-full rounded-sm border border-app-border bg-white px-3 text-sm text-app-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent/30 ${className}`.trim()}
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
