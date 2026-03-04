import type { Toast } from '../../hooks/useToast';
import { Button } from './Button';

interface ToastContainerProps {
    toasts: Toast[];
    onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
    if (toasts.length === 0) {
        return null;
    }

    return (
        <div
            className="fixed bottom-6 right-6 z-50 flex max-w-sm flex-col gap-2"
            role="region"
            aria-label="Notifications"
        >
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`toast-enter flex items-center gap-3 rounded-lg border bg-white px-4 py-3 shadow-lg ${
                        toast.type === 'success'
                            ? 'border-emerald-200/80'
                            : 'border-rose-200/80'
                    }`}
                    role="alert"
                >
                    <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                            toast.type === 'success'
                                ? 'bg-emerald-100 text-emerald-600'
                                : 'bg-rose-100 text-rose-600'
                        }`}
                    >
                        {toast.type === 'success' ? '\u2713' : '!'}
                    </span>
                    <span className="flex-1 text-sm font-medium text-app-text">{toast.message}</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 shrink-0 border-0 text-app-muted/60 hover:text-app-text"
                        onClick={() => onDismiss(toast.id)}
                        aria-label="Dismiss notification"
                    >
                        &times;
                    </Button>
                </div>
            ))}
        </div>
    );
}
