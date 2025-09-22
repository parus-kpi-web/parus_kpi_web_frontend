import { Modal } from '../../../shared/ui/atoms/Modal';
import type { CellActionContext } from '../model/types';

type Props<T> = {
    open: boolean;
    onClose: () => void;
    ctx?: CellActionContext<T>;
    onEdit: (ctx: CellActionContext<T>) => void;
    onRefresh: (ctx?: CellActionContext<T>) => void;
    onFunction1?: (ctx: CellActionContext<T>) => void;
};

export function CellActionsModal<T>({
                                        open,
                                        onClose,
                                        ctx,
                                        onEdit,
                                        onRefresh,
                                        onFunction1,
                                    }: Props<T>) {
    return (
        <Modal open={open} onClose={onClose} title="Действия с ячейкой" width={460}>
            <div className="space-y-3">
                {ctx ? (
                    <div className="cell-desc">
                        <div><b>Колонка:</b> {ctx.columnHeaderName ?? ctx.colId}</div>
                        <div><b>Значение:</b> <code style={{ userSelect: 'text' }}>{String(ctx.value ?? '')}</code></div>
                    </div>
                ) : null}

                <div className="modal-actions">
                    <button className="btn btn-primary" onClick={() => ctx && onEdit(ctx)}>Изменить</button>
                    <button className="btn" onClick={() => onRefresh(ctx)}>Обновить</button>
                    <button className="btn" onClick={() => ctx && onFunction1?.(ctx)}>Функция 1</button>
                    <div style={{ flex: 1 }} />
                    <button className="btn btn-ghost" onClick={onClose}>Закрыть</button>
                </div>
            </div>
        </Modal>
    );
}