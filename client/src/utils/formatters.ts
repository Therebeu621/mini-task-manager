/**
 * Utility helpers for formatting dates and labels.
 */
import type { TaskPriority, TaskStatus } from '../types/task.types';

// ─── Date helpers ─────────────────────────────────────────

/**
 * Format a raw ISO date string to a short human-readable date.
 * e.g. "2026-02-24T15:00:00.000Z" → "Feb 24, 2026"
 */
export function formatDate(iso: string | null | undefined): string {
    if (!iso) return '–';
    return new Date(iso).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Returns true if a dueDate is in the past (overdue).
 */
export function isOverdue(dueDate: string | null | undefined): boolean {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
}

/**
 * Convert a Date object to the value format expected by <input type="date">.
 * Returns "" if date is null.
 */
export function toDateInputValue(iso: string | null | undefined): string {
    if (!iso) return '';
    return new Date(iso).toISOString().slice(0, 10);
}

// ─── Label maps ───────────────────────────────────────────

export const STATUS_LABELS: Record<TaskStatus, string> = {
    todo: 'To Do',
    doing: 'In Progress',
    done: 'Done',
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
};

export const STATUS_ICONS: Record<TaskStatus, string> = {
    todo: '○',
    doing: '◑',
    done: '●',
};

export const PRIORITY_ICONS: Record<TaskPriority, string> = {
    low: '↓',
    medium: '→',
    high: '↑',
};
