import type { ReactNode } from 'react';

type BadgeTone = 'neutral' | 'todo' | 'doing' | 'done' | 'low' | 'medium' | 'high';

interface BadgeProps {
    tone?: BadgeTone;
    children: ReactNode;
}

export function Badge({ tone = 'neutral', children }: BadgeProps) {
    return <span className={`ui-badge ui-badge--${tone}`}>{children}</span>;
}
