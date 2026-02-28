import { useEffect, type ReactNode } from 'react';
import { Button } from './Button';

interface DrawerProps {
    open: boolean;
    title: string;
    onClose: () => void;
    children: ReactNode;
}

export function Drawer({ open, title, onClose, children }: DrawerProps) {
    useEffect(() => {
        if (!open) {
            return;
        }

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose, open]);

    if (!open) {
        return null;
    }

    return (
        <div className="ui-drawer-backdrop" role="presentation" onClick={onClose}>
            <aside
                className="ui-drawer"
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onClick={(event) => event.stopPropagation()}
            >
                <header className="ui-drawer__header">
                    <h2>{title}</h2>
                    <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close filters">
                        Close
                    </Button>
                </header>
                <div className="ui-drawer__body">{children}</div>
            </aside>
        </div>
    );
}
