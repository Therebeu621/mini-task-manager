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
        <label className="ui-field" htmlFor={id}>
            {label && <span className="ui-field__label">{label}</span>}
            <select id={id} className={`ui-select ${className}`.trim()} {...props}>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
}
