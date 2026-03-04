import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Button as ShadButton } from '../shadcn/button';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
}

const VARIANT_MAP: Record<ButtonVariant, 'default' | 'secondary' | 'ghost' | 'destructive'> = {
    primary: 'default',
    secondary: 'secondary',
    ghost: 'ghost',
    danger: 'destructive',
};

const SIZE_MAP: Record<ButtonSize, 'sm' | 'default'> = {
    sm: 'sm',
    md: 'default',
};

export function Button({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = '',
    ...props
}: ButtonProps) {
    return (
        <ShadButton
            variant={VARIANT_MAP[variant]}
            size={SIZE_MAP[size]}
            className={cn(fullWidth && 'w-full', className)}
            {...props}
        />
    );
}
