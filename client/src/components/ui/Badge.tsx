import type { ReactNode } from 'react';

type BadgeTone = 'neutral' | 'todo' | 'doing' | 'done' | 'low' | 'medium' | 'high';

interface BadgeProps {
    tone?: BadgeTone;
    children: ReactNode;
}

const TONE_CLASSES: Record<BadgeTone, string> = {
    neutral: 'bg-slate-100 text-slate-600',
    todo: 'bg-blue-100 text-blue-700',
    doing: 'bg-violet-100 text-violet-700',
    done: 'bg-emerald-100 text-emerald-700',
    low: 'bg-green-100 text-green-700',
    medium: 'bg-amber-100 text-amber-700',
    high: 'bg-rose-100 text-rose-700',
};

export function Badge({ tone = 'neutral', children }: BadgeProps) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${TONE_CLASSES[tone]}`}>
            {children}
        </span>
    );
}
