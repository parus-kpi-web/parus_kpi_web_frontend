import { useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';

/** Регистрация модулей AG Grid v34 (Community) — один раз на бандл */
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

/** Стили темы и базовые стили грида */
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import type { GridColumn, ServerDataSource } from './types';
import type { ListRequest } from '../../../lib/types';
import { loadJSON, saveJSON } from '../../../lib/storage';

export type DataGridProps<T> = {
    storageKey: string;
    columns: GridColumn<T>[];             // columns[i].editable? — опционально
    dataSource: ServerDataSource<T>;      // async (q) => { items, total }
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
    const [page] = useState(1);
    const [filters, setFilters] = useState<Record<string, unknown>>(
        () => loadJSON(storageKey + ':filters', defaultFilters ?? {})
    );

    // маппинг наших колонок в колдефы AG Grid
    const colDefs = useMemo(
        () =>
            columns.map((c) => ({
                field: String(c.field),
                headerName: c.headerName,
                width: c.width,
                // по умолчанию редактируемо; можно выключить на колонке
                editable: c.editable ?? true,
                valueFormatter: c.valueFormatter ? (p: any) => c.valueFormatter?.(p.value, p.data) : undefined,
                // если колонка передала кастомный парсер — пробрасываем (чтобы числа не становились строками)
                // типы оставляем либеральными, чтобы не ломать проект
                valueParser: (c as any).valueParser
                    ? (p: any) => (c as any).valueParser(p.newValue, p.data)
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize, JSON.stringify(filters), dataSource]);

    return (
        <div className="ag-theme-alpine" style={{ height: '100%', width: '100%', minHeight: 0 }}>
            <AgGridReact
                rowData={rows}
                columnDefs={colDefs as any}
                defaultColDef={{ resizable: true }}
                // КРИТИЧЕСКОЕ: не ставим suppressCellFocus — иначе нельзя редактировать
                stopEditingWhenCellsLoseFocus={true}
                onCellValueChanged={(e) => {
                    // фиксируем изменения в React-состоянии (копия массива с отредактированной строкой)
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