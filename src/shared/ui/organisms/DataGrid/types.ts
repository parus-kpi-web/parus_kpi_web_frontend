import type { ListRequest, ListResponse } from '../../../lib/types';

export type GridColumn<T> = {
    field: keyof T | string;
    headerName: string;
    width?: number;
    editable?: boolean;
    valueFormatter?: (v: unknown, row: T) => string;
};

export type ServerDataSource<T> = (q: ListRequest) => Promise<ListResponse<T>>;