/**
 * Toast notification hook.
 * Manages a list of toasts with auto-dismiss after 4 seconds.
 */
import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

export function useToast() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = `toast-${Date.now()}-${Math.random()}`;
        const toast: Toast = { id, message, type };

        setToasts((prev) => [...prev, toast]);

        // Auto-dismiss after 4 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const dismiss = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return { toasts, addToast, dismiss };
}
