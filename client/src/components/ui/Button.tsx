import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
}

const BASE_CLASSES =
    'inline-flex items-center justify-center gap-1.5 rounded-md border border-transparent font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent/30 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer select-none';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
    primary:
        'bg-app-accent text-white shadow-sm hover:bg-app-accent-hover hover:shadow-md active:scale-[0.98]',
    secondary:
        'bg-app-accent-soft text-app-accent border-app-accent-soft hover:bg-emerald-100 active:scale-[0.98]',
    ghost: 'border-app-border bg-transparent text-app-muted hover:bg-app-surface-hover hover:text-app-text hover:border-app-border-hover',
    danger: 'bg-app-danger-soft text-app-danger border-transparent hover:bg-rose-100 active:scale-[0.98]',
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
