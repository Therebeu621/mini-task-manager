import type { ReactNode } from 'react';

type BadgeTone = 'neutral' | 'todo' | 'doing' | 'done' | 'low' | 'medium' | 'high';

interface BadgeProps {
    tone?: BadgeTone;
    children: ReactNode;
}

const TONE_CLASSES: Record<BadgeTone, string> = {
    neutral: 'bg-slate-100 text-slate-600 ring-slate-200/60',
    todo: 'bg-blue-50 text-blue-700 ring-blue-200/60',
    doing: 'bg-violet-50 text-violet-700 ring-violet-200/60',
    done: 'bg-emerald-50 text-emerald-700 ring-emerald-200/60',
    low: 'bg-green-50 text-green-700 ring-green-200/60',
    medium: 'bg-amber-50 text-amber-700 ring-amber-200/60',
    high: 'bg-rose-50 text-rose-700 ring-rose-200/60',
};

export function Badge({ tone = 'neutral', children }: BadgeProps) {
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset ${TONE_CLASSES[tone]}`}
        >
            {children}
        </span>
    );
}
