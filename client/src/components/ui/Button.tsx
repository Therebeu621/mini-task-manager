import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
}

const BASE_CLASSES =
    'inline-flex items-center justify-center rounded-sm border border-transparent font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent/30 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
    primary: 'bg-app-accent text-white shadow-sm hover:bg-app-accent-hover',
    secondary: 'border-emerald-100 bg-emerald-50 text-emerald-800 hover:bg-emerald-100',
    ghost: 'border-app-border bg-transparent text-app-muted hover:bg-app-surface-muted hover:text-app-text',
    danger: 'border-rose-100 bg-rose-50 text-rose-700 hover:bg-rose-100',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
};

export function Button({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = '',
    ...props
}: ButtonProps) {
    return (
        <button
            className={`${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]}${
                fullWidth ? ' w-full' : ''
            } ${className}`.trim()}
            {...props}
        />
    );
}
