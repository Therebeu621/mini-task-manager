/**
 * Toast notification display component.
 * Renders all active toasts in a fixed bottom-right stack.
 */
import type { Toast } from '../hooks/useToast';

interface ToastContainerProps {
    toasts: Toast[];
    onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
    if (toasts.length === 0) return null;

    return (
        <div className="toast-container" role="region" aria-label="Notifications">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`toast toast--${toast.type}`}
                    role="alert"
                >
                    <span>{toast.type === 'success' ? '✓' : '✕'}</span>
                    <span style={{ flex: 1 }}>{toast.message}</span>
                    <button
                        className="btn-icon"
                        onClick={() => onDismiss(toast.id)}
                        aria-label="Dismiss"
                        style={{ padding: '2px', fontSize: '12px' }}
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
}
