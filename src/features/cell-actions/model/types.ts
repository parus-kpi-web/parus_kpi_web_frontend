import type { GridApi, ColumnApi, Column } from 'ag-grid-community';

export type CellActionContext<T> = {
    row: T;
    rowIndex: number;
    colId: string;
    column?: Column;
    columnHeaderName?: string;
    value: unknown;
    api: GridApi<T>;
    columnApi: ColumnApi;
};