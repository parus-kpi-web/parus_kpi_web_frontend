import { useEffect } from 'react';
import { createPortal } from 'react-dom';

type ModalProps = {
    open: boolean;
    onClose: () => void;
    title?: string;
    width?: number | string;
    children: React.ReactNode;
    /** клик по подложке закрывает модалку (по умолчанию true) */
    closeOnBackdrop?: boolean;
};

export function Modal({
                          open,
                          onClose,
                          title,
                          width = 520,
                          children,
                          closeOnBackdrop = true,
                      }: ModalProps) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    if (!open) return null;

    return createPortal(
        <div
            className="modal-overlay"
            onMouseDown={closeOnBackdrop ? onClose : undefined}
            role="presentation"
        >
            <div
                className="modal-content"
                style={{ width }}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onMouseDown={(e) => e.stopPropagation()}
            >
                {title ? <div className="modal-header">{title}</div> : null}
                <div className="modal-body">{children}</div>
            </div>
        </div>,
        document.body
    );
}