import { DataGrid } from '../../shared/ui/organisms/DataGrid/DataGrid';
import type { GridColumn } from '../../shared/ui/organisms/DataGrid/types';
import type { ListRequest, ListResponse } from '../../shared/lib/types';

type Row = { card: string; date: string; diag: string; unit: string; result: number };

const cols: GridColumn<Row>[] = [
    { field: 'card', headerName: 'Карта', width: 120 },
    { field: 'date', headerName: 'Дата', width: 120 },
    { field: 'diag', headerName: 'Диагноз', width: 220 },
    { field: 'unit', headerName: 'Подразделение', width: 220 },
    { field: 'result', headerName: 'Фин. результат', width: 150,
        valueFormatter: (v) => new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB'}).format(Number(v)),
        // @ts-ignore
        valueParser: (v: string) => Number(String(v).replace(/[^\d.,-]/g,'').replace(',', '.')) },
];

async function ds(_: ListRequest): Promise<ListResponse<Row>> {
    const items: Row[] = Array.from({length: 50}).map((_,i)=>({
        card: `H2025-${4000+i}`,
        date: `2025-08-${String((i%28)+1).padStart(2,'0')}`,
        diag: i%3===0?'I10':'E11',
        unit: 'Амбулаторное отделение',
        result: (i%5-2)*10000,
    }));
    return { items, total: items.length };
}

export function CardsMainTable() {
    return <div style={{ height: '100%' }}>
        <DataGrid<Row> storageKey="cards.main" columns={cols} dataSource={ds} pageSize={100} />
    </div>;
}

type Sum = { cards: number; result: number; oms: number; budget: number; }
const sumCols: GridColumn<Sum>[] = [
    { field: 'cards', headerName: 'Карты', width: 100 },
    { field: 'result', headerName: 'Фин. результат', width: 150,
        valueFormatter: (v) => new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB'}).format(Number(v)) },
    { field: 'oms', headerName: 'Доход ОМС', width: 130,
        valueFormatter: (v) => new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB'}).format(Number(v)) },
    { field: 'budget', headerName: 'Доход бюджет', width: 140,
        valueFormatter: (v) => new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB'}).format(Number(v)) },
];
async function sumDs(): Promise<ListResponse<Sum>> {
    return { items: [{ cards: 1001, result: 1282768.14, oms: 19835751.00, budget: 947906.06 }], total: 1 };
}
export function CardsSummaryRow() {
    return (
        <div style={{ height: '100%' }}>
            <DataGrid<Sum> storageKey="cards.summary" columns={sumCols} dataSource={sumDs as any} pageSize={1} hideHeader className="compact" />
        </div>
    );
}