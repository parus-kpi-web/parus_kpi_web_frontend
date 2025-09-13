import { DataGrid } from '../../shared/ui/organisms/DataGrid/DataGrid';
import type { GridColumn } from '../../shared/ui/organisms/DataGrid/types';
import type { ListRequest, ListResponse } from '../../shared/lib/types';

export type StockItem = {
    date: string;
    item: string;       // Номенклатура
    qty: number;
    amount: number;
    warehouse: string;
    unitName: string;
};

const currency = (v?: number) =>
    v == null ? '' : new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(Number(v));

const columns: GridColumn<StockItem>[] = [
    { field: 'date', headerName: 'Дата', width: 140 },
    { field: 'item', headerName: 'Номенклатура', width: 320 },
    { field: 'qty', headerName: 'Кол-во', width: 100 },
    { field: 'amount', headerName: 'Сумма', width: 130, valueFormatter: (v) => currency(Number(v)) },
    { field: 'warehouse', headerName: 'Склад', width: 220 },
    { field: 'unitName', headerName: 'Подразделение', width: 260 },
];

async function mockDataSource(_: ListRequest): Promise<ListResponse<StockItem>> {
    const items: StockItem[] = Array.from({ length: 50 }).map((_, i) => ({
        date: `2025-01-${String((i % 28) + 1).padStart(2, '0')}`,
        item: 'кортексин лиоф.10мг№',
        qty: 1 + (i % 3),
        amount: 154.2 * (1 + (i % 3)),
        warehouse: '401 Неврологическое',
        unitName: 'Неврологическое отделение стационара',
    }));
    return { items, total: items.length };
}

export function StockTable({ storageKey = 'panel.stock' }: { storageKey?: string }) {
    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: 8, borderBottom: '1px solid var(--border)' }}>
                <strong>Склад</strong>
            </div>
            <div style={{ flex: 1 }}>
                <DataGrid<StockItem> storageKey={storageKey} columns={columns} dataSource={mockDataSource} />
            </div>
        </div>
    );
}
export default StockTable;
