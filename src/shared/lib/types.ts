export type Sort = { field: string; dir: 'asc' | 'desc' };

export type ListRequest = {
    page: number;
    pageSize: number;
    sort?: Sort[];
    filters?: Record<string, unknown>;
};

export type ListResponse<T> = { items: T[]; total: number };