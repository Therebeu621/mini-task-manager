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
        <div className="ui-toast-stack" role="region" aria-label="Notifications">
            {toasts.map((toast) => (
                <div key={toast.id} className={`ui-toast ui-toast--${toast.type}`} role="alert">
                    <span className="ui-toast__icon">{toast.type === 'success' ? 'OK' : '!'}</span>
                    <span>{toast.message}</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="ui-toast__close"
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
