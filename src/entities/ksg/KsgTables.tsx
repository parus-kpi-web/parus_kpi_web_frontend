import { DataGrid } from '../../shared/ui/organisms/DataGrid/DataGrid';
import type { GridColumn } from '../../shared/ui/organisms/DataGrid/types';
import type { ListRequest, ListResponse } from '../../shared/lib/types';

type Ksg = { date: string; ksg: string; code: string; name: string; sum: number; unit: string };

const cols: GridColumn<Ksg>[] = [
    { field: 'date', headerName: 'Период', width: 120 },
    { field: 'ksg', headerName: 'КСГ', width: 120 },
    { field: 'code', headerName: 'Код', width: 120 },
    { field: 'name', headerName: 'Наименование', width: 340 },
    { field: 'sum', headerName: 'Сумма КСГ', width: 140,
        valueFormatter: (v) => new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB'}).format(Number(v)),
        // @ts-ignore
        valueParser: (v: string) => Number(String(v).replace(/[^\d.,-]/g,'').replace(',', '.')) },
    { field: 'unit', headerName: 'Подразделение', width: 240 },
];

async function ds(_: ListRequest): Promise<ListResponse<Ksg>> {
    const items: Ksg[] = [
        { date: '01.01.2025', ksg: 'KSG12.001', code: 'st02.003', name: 'Патологический отдел', sum: 23480.00, unit: 'ОСМ' },
        { date: '01.02.2025', ksg: 'KSG12.004', code: 'st02.023', name: 'Субарахноидальное кровоизлияние', sum: 9890.50, unit: 'ОСМ' },
        { date: '01.03.2025', ksg: 'KSG13.010', code: 'st02.008', name: 'Расслабляющий массаж', sum: 15400.00, unit: 'ОСМ' },
    ];
    return { items, total: items.length };
}

export function KsgMainTable() {
    return <div style={{ height: '100%' }}>
        <DataGrid<Ksg> storageKey="ksg.main" columns={cols} dataSource={ds} pageSize={100} />
    </div>;
}

type Sum = { days: number; sumKsg: number; expenses: number; result: number }
const sumCols: GridColumn<Sum>[] = [
    { field: 'days', headerName: 'Койко-дн', width: 120 },
    { field: 'sumKsg', headerName: 'Сумма КСГ', width: 140,
        valueFormatter: (v) => new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB'}).format(Number(v)) },
    { field: 'expenses', headerName: 'Расход общий', width: 150,
        valueFormatter: (v) => new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB'}).format(Number(v)) },
    { field: 'result', headerName: 'Фин. результат', width: 160,
        valueFormatter: (v) => new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB'}).format(Number(v)) },
];
async function sumDs(): Promise<ListResponse<Sum>> {
    return { items: [{ days: 1001, sumKsg: 39970940.06, expenses: 28256251.62, result: 1248268.14 }], total: 1 };
}
export function KsgSummaryRow() {
    return (
        <div style={{ height: '100%' }}>
            <DataGrid<Sum> storageKey="ksg.summary" columns={sumCols} dataSource={sumDs as any} pageSize={1} hideHeader className="compact" />
        </div>
    );
}