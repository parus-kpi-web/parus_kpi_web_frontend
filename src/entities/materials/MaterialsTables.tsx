import { DataGrid } from '../../shared/ui/organisms/DataGrid/DataGrid';
import type { GridColumn } from '../../shared/ui/organisms/DataGrid/types';
import type { ListRequest, ListResponse } from '../../shared/lib/types';

type Row = { date: string; item: string; unit: string; qty: number; cost: number };

const cols: GridColumn<Row>[] = [
    { field: 'date', headerName: 'Дата', width: 120 },
    { field: 'item', headerName: 'Материал', width: 300 },
    { field: 'unit', headerName: 'Подразделение', width: 260 },
    { field: 'qty', headerName: 'Кол-во', width: 100,
        // @ts-ignore
        valueParser: (v: string) => Number(String(v).replace(',', '.')) },
    { field: 'cost', headerName: 'Стоимость', width: 140,
        valueFormatter: (v) => new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB'}).format(Number(v)),
        // @ts-ignore
        valueParser: (v: string) => Number(String(v).replace(/[^\d.,-]/g,'').replace(',', '.')) },
];

async function ds(_: ListRequest): Promise<ListResponse<Row>> {
    const items: Row[] = Array.from({length: 35}).map((_,i)=>({
        date: `2025-08-${String((i%28)+1).padStart(2,'0')}`,
        item: i%2?'Шприц одноразовый 10мл':'Перчатки латексные',
        unit: 'Склад №1',
        qty: 5 + (i%3),
        cost: 500 + i*7,
    }));
    return { items, total: items.length };
}

export function MaterialsMainTable() {
    return <div style={{ height: '100%' }}>
        <DataGrid<Row> storageKey="materials.main" columns={cols} dataSource={ds} pageSize={100} />
    </div>;
}

type Sum = { materials: number; oms: number; budget: number; }
const sumCols: GridColumn<Sum>[] = [
    { field: 'materials', headerName: 'Расход материалов', width: 170,
        valueFormatter: (v) => new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB'}).format(Number(v)) },
    { field: 'oms', headerName: 'Расход ОМС', width: 130,
        valueFormatter: (v) => new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB'}).format(Number(v)) },
    { field: 'budget', headerName: 'Расход бюджет', width: 140,
        valueFormatter: (v) => new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB'}).format(Number(v)) },
];
async function sumDs(): Promise<ListResponse<Sum>> {
    return { items: [{ materials: 4719685.12, oms: 132600.18, budget: 941179.20 }], total: 1 };
}
export function MaterialsSummaryRow() {
    return (
        <div style={{ height: '100%' }}>
            <DataGrid<Sum> storageKey="materials.summary" columns={sumCols} dataSource={sumDs as any} pageSize={1} hideHeader className="compact" />
        </div>
    );
}