import { useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
// гарантированно подключаем стили темы
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
};

export function DataGrid<T extends object>({
                                               storageKey,
                                               columns,
                                               dataSource,
                                               pageSize = 25,
                                               defaultFilters,
                                           }: DataGridProps<T>) {
    const [rows, setRows] = useState<T[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<Record<string, unknown>>(
        () => loadJSON(storageKey + ':filters', defaultFilters ?? {})
    );

    const colDefs = useMemo(
        () =>
            columns.map((c) => ({
                field: String(c.field),
                headerName: c.headerName,
                width: c.width,
                editable: c.editable,
                valueFormatter: c.valueFormatter
                    ? (p: any) => c.valueFormatter?.(p.value, p.data)
                    : undefined,
            })),
        [columns]
    );

    useEffect(() => {
        saveJSON(storageKey + ':filters', filters);
    }, [filters, storageKey]);

    async function load() {
        const q: ListRequest = { page, pageSize, filters };
        const res = await dataSource(q);
        setRows(res.items);
        setTotal(res.total);
    }

    useEffect(() => {
        load();
    }, [page, pageSize, JSON.stringify(filters)]);

    return (
        <div className="ag-theme-alpine" style={{ height: '100%', width: '100%', minHeight: 0 }}>
            <AgGridReact rowData={rows} columnDefs={colDefs as any} suppressCellFocus={true} />
        </div>
    );
}
