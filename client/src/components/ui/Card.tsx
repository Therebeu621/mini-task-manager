import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

export function Card({ className = '', children, ...props }: CardProps) {
    return (
        <div
            className={`rounded-lg border border-app-border bg-app-surface shadow-sm ${className}`.trim()}
            {...props}
        >
            {children}
        </div>
    );
}
