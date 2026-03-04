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
        <div className="fixed bottom-6 right-6 z-50 flex max-w-sm flex-col gap-3" role="region" aria-label="Notifications">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`flex items-center gap-3 rounded-md border bg-white px-3 py-2 shadow-md ${
                        toast.type === 'success' ? 'border-emerald-100' : 'border-rose-100'
                    }`}
                    role="alert"
                >
                    <span
                        className={`grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold ${
                            toast.type === 'success'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-rose-100 text-rose-700'
                        }`}
                    >
                        {toast.type === 'success' ? 'OK' : '!'}
                    </span>
                    <span className="text-sm text-app-text">{toast.message}</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto"
                        onClick={() => onDismiss(toast.id)}
                        aria-label="Dismiss notification"
                    >
                        Close
                    </Button>
                </div>
            ))}
        </div>
    );
}
