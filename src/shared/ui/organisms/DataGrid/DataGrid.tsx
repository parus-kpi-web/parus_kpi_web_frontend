import { useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';

/** AG Grid v33+/v34: подключаем Community-модули */
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

/** Используем legacy CSS-темы */
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import type { GridColumn, ServerDataSource } from './types';
import type { ListRequest } from '../../../lib/types';
import { loadJSON, saveJSON } from '../../../lib/storage';

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
                                           }: DataGridProps<T>) {
    const [rows, setRows] = useState<T[]>([]);
    const [total, setTotal] = useState(0);
    const [page] = useState(1);
    const [filters, setFilters] = useState<Record<string, unknown>>(
        () => loadJSON(storageKey + ':filters', defaultFilters ?? {})
    );

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

    async function load() {
        const q: ListRequest = { page, pageSize, filters };
        const res = await dataSource(q);
        setRows(res.items);
        setTotal(res.total);
    }

    useEffect(() => { load(); /* eslint-disable-next-line */ }, [page, pageSize, JSON.stringify(filters), dataSource]);

    return (
        <div
            className={`ag-theme-alpine ${className ?? ''} ${hideHeader ? 'no-header' : ''}`.trim()}
            style={{ height: '100%', width: '100%', minHeight: 0 }}
        >
            <AgGridReact
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
            />
        </div>
    );
}