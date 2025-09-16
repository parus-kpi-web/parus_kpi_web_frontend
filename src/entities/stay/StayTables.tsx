import { DataGrid } from '../../shared/ui/organisms/DataGrid/DataGrid';
import type { GridColumn } from '../../shared/ui/organisms/DataGrid/types';
import type { ListRequest, ListResponse } from '../../shared/lib/types';

type Row = {
    patient: string; card: string; dateIn: string; dateOut: string;
    ksg: string; unit: string; result: number;
};

const cols: GridColumn<Row>[] = [
    { field: 'patient', headerName: 'Пациент', width: 200 },
    { field: 'card', headerName: 'Карта', width: 120 },
    { field: 'dateIn', headerName: 'Поступил', width: 120 },
    { field: 'dateOut', headerName: 'Выписан', width: 120 },
    { field: 'ksg', headerName: 'КСГ', width: 120 },
    { field: 'unit', headerName: 'Подразделение', width: 220 },
    { field: 'result', headerName: 'Фин. результат', width: 150,
        valueFormatter: (v) => new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB'}).format(Number(v)),
        // @ts-ignore
        valueParser: (v: string) => Number(String(v).replace(/[^\d.,-]/g,'').replace(',', '.')) },
];

async function ds(_: ListRequest): Promise<ListResponse<Row>> {
    const items: Row[] = Array.from({length: 30}).map((_,i)=>({
        patient: `Иванов И.И.${i}`, card: `H2025-${3100+i}`,
        dateIn: `2025-08-${String((i%28)+1).padStart(2,'0')}`,
        dateOut: `2025-09-${String((i%28)+1).padStart(2,'0')}`,
        ksg: 'KSG12.001', unit: 'Стационар', result: i%2? -18917.07: 24500.00,
    }));
    return { items, total: items.length };
}

export function StayMainTable() {
    return <div style={{ height: '100%' }}>
        <DataGrid<Row> storageKey="stay.main" columns={cols} dataSource={ds} pageSize={100} />
    </div>;
}

type Sum = { cases: number; result: number; materials: number; food: number }
const sumCols: GridColumn<Sum>[] = [
    { field: 'cases', headerName: 'Случаи', width: 100 },
    { field: 'result', headerName: 'Фин. результат', width: 140,
        valueFormatter: (v) => new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB'}).format(Number(v)) },
    { field: 'materials', headerName: 'Расход материалов', width: 170,
        valueFormatter: (v) => new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB'}).format(Number(v)) },
    { field: 'food', headerName: 'Расход Питание', width: 150,
        valueFormatter: (v) => new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB'}).format(Number(v)) },
];
async function sumDs(): Promise<ListResponse<Sum>> {
    return { items: [{ cases: 24, result: 912346.55, materials: 48215.66, food: 908317.41 }], total: 1 };
}
export function StaySummaryRow() {
    return (
        <div style={{ height: '100%' }}>
            <DataGrid<Sum> storageKey="stay.summary" columns={sumCols} dataSource={sumDs as any} pageSize={1} hideHeader className="compact" />
        </div>
    );
}