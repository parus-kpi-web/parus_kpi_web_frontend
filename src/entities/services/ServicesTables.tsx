import { DataGrid } from '../../shared/ui/organisms/DataGrid/DataGrid';
import type { GridColumn } from '../../shared/ui/organisms/DataGrid/types';
import type { ListRequest, ListResponse } from '../../shared/lib/types';

type Row = { date: string; caseId: string; service: string; unit: string; cost: number; qty: number };

const cols: GridColumn<Row>[] = [
    { field: 'date', headerName: 'Дата', width: 120 },
    { field: 'caseId', headerName: 'Случай', width: 120 },
    { field: 'service', headerName: 'Услуга', width: 300 },
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
    const items: Row[] = Array.from({length: 40}).map((_,i)=>({
        date: `2025-08-${String((i%28)+1).padStart(2,'0')}`,
        caseId: `H2025-${4500+i}`,
        service: i%2?'СМТ-форез (1 поле)':'Определение группы крови',
        unit: 'Клиническая диагностика',
        qty: 1,
        cost: 1270 + i*10,
    }));
    return { items, total: items.length };
}

export function ServicesMainTable() {
    return <div style={{ height: '100%' }}>
        <DataGrid<Row> storageKey="services.main" columns={cols} dataSource={ds} pageSize={100} />
    </div>;
}

type Sum = { sum: number; selfcost: number; }
const sumCols: GridColumn<Sum>[] = [
    { field: 'sum', headerName: 'Сумма(стоимость)', width: 160,
        valueFormatter: (v) => new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB'}).format(Number(v)) },
    { field: 'selfcost', headerName: 'Сумма(себестоимость)', width: 180,
        valueFormatter: (v) => new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB'}).format(Number(v)) },
];
async function sumDs(): Promise<ListResponse<Sum>> {
    return { items: [{ sum: 377772.00, selfcost: 238727.00 }], total: 1 };
}
export function ServicesSummaryRow() {
    return (
        <div style={{ height: '100%' }}>
            <DataGrid<Sum> storageKey="services.summary" columns={sumCols} dataSource={sumDs as any} pageSize={1} hideHeader className="compact" />
        </div>
    );
}