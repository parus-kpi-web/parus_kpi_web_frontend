import { useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';

import { ModuleRegistry, AllCommunityModule,
    type CellContextMenuEvent, type GridApi, type ColumnApi } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import type { GridColumn, ServerDataSource } from './types';
import type { ListRequest } from '../../../lib/types';
import { loadJSON, saveJSON } from '../../../lib/storage';

import { CellActionsModal } from '../../../../features/cell-actions/ui/CellActionsModal';
import type { CellActionContext } from '../../../../features/cell-actions/model/types';

export type DataGridProps<T> = {
    storageKey: string;
    columns: GridColumn<T>[];
    dataSource: ServerDataSource<T>;
    pageSize?: number;
    defaultFilters?: Record<string, unknown>;
    className?: string;
    hideHeader?: boolean;
    rowHeight?: number;
    headerHeight?: number;

    /** Пользовательский обработчик для «Функция 1». Если не задан, кнопка просто логирует контекст. */
    onCellFunction1?: (ctx: CellActionContext<T>) => void;
};

export function DataGrid<T extends object>({
                                               storageKey,
                                               columns,
                                               dataSource,
                                               pageSize = 25,
                                               defaultFilters,
                                               className,
                                               hideHeader,
                                               rowHeight = 28,
                                               headerHeight = 32,
                                               onCellFunction1,
                                           }: DataGridProps<T>) {
    const gridRef = useRef<AgGridReact<T>>(null);

    const [rows, setRows] = useState<T[]>([]);
    const [total, setTotal] = useState(0);
    const [page] = useState(1);
    const [filters, setFilters] = useState<Record<string, unknown>>(
        () => loadJSON(storageKey + ':filters', defaultFilters ?? {})
    );

    const [modalOpen, setModalOpen] = useState(false);
    const [ctx, setCtx] = useState<CellActionContext<T> | undefined>(undefined);

    const colDefs = useMemo(
        () =>
            columns.map((c) => ({
                field: String(c.field),
                headerName: c.headerName,
                width: c.width,
                editable: c.editable ?? true,
                valueFormatter: c.valueFormatter ? (p: any) => c.valueFormatter?.(p.value, p.data) : undefined,
                valueParser: (c as any).valueParser ? (p: any) => (c as any).valueParser(p.newValue, p.data) : undefined,
            })),
        [columns]
    );

    useEffect(() => { saveJSON(storageKey + ':filters', filters); }, [filters, storageKey]);

    const load = async () => {
        const q: ListRequest = { page, pageSize, filters };
        const res = await dataSource(q);
        setRows(res.items);
        setTotal(res.total);
    };

    useEffect(() => { load(); /* eslint-disable-next-line */ }, [page, pageSize, JSON.stringify(filters), dataSource]);

    /** ПКМ по ячейке — открываем модальник с действиями */
    const onCellContextMenu = (e: CellContextMenuEvent<T>) => {
        e.event?.preventDefault?.();

        const api = e.api as GridApi<T>;
        const columnApi = e.columnApi as ColumnApi;

        setCtx({
            row: e.data as T,
            rowIndex: e.rowIndex ?? 0,
            colId: e.column?.getColId() ?? '',
            column: e.column ?? undefined,
            columnHeaderName: e.column?.getColDef()?.headerName as string | undefined,
            value: e.value,
            api,
            columnApi,
        });
        setModalOpen(true);
    };

    const handleEdit = (c: CellActionContext<T>) => {
        setModalOpen(false);
        // стартуем редактирование именно по этой ячейке
        c.api.startEditingCell({ rowIndex: c.rowIndex, colKey: c.colId });
    };

    const handleRefresh = async () => {
        setModalOpen(false);
        await load();
    };

    const handleFunction1 = (c: CellActionContext<T>) => {
        if (onCellFunction1) onCellFunction1(c);
        else console.log('Функция 1 (demo):', c);
        setModalOpen(false);
    };

    return (
        <>
            <div
                className={`ag-theme-alpine ${className ?? ''} ${hideHeader ? 'no-header' : ''}`.trim()}
                style={{ height: '100%', width: '100%', minHeight: 0 }}
            >
                <AgGridReact
                    ref={gridRef}
                    theme="legacy"
                    rowData={rows}
                    columnDefs={colDefs as any}
                    defaultColDef={{ resizable: true }}
                    rowHeight={rowHeight}
                    headerHeight={hideHeader ? 0 : headerHeight}
                    stopEditingWhenCellsLoseFocus
                    onCellValueChanged={(e) => {
                        setRows((prev) => {
                            const next = [...prev];
                            const idx = next.indexOf(e.data);
                            if (idx >= 0) next[idx] = { ...(e.data as T) };
                            return next;
                        });
                    }}
                    onCellContextMenu={onCellContextMenu}
                />
            </div>

            <CellActionsModal<T>
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                ctx={ctx}
                onEdit={handleEdit}
                onRefresh={handleRefresh}
                onFunction1={handleFunction1}
            />
        </>
    );
}