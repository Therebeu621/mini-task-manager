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
        <div
            className="fixed inset-0 z-40 flex justify-end bg-slate-950/40 backdrop-blur-[3px] animate-fade-in"
            role="presentation"
            onClick={onClose}
        >
            <aside
                className="flex h-full w-full max-w-sm flex-col border-l border-app-border bg-app-surface shadow-xl animate-slide-in-right"
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onClick={(event) => event.stopPropagation()}
            >
                <header className="flex items-center justify-between border-b border-app-border px-5 py-4">
                    <h2 className="text-base font-bold text-app-text">{title}</h2>
                    <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close filters">
                        Close
                    </Button>
                </header>
                <div className="flex-1 overflow-y-auto p-5">{children}</div>
            </aside>
        </div>
    );
}
