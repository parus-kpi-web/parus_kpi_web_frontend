import { DataGrid } from '../../shared/ui/organisms/DataGrid/DataGrid';
import type { GridColumn } from '../../shared/ui/organisms/DataGrid/types';
import type { ListRequest, ListResponse } from '../../shared/lib/types';

type Kpi = {
    period: string;
    unit: string;
    days: number;
    revenue: number;
    expenses: number;
    result: number;
};

const kpiCols: GridColumn<Kpi>[] = [
    { field: 'period', headerName: 'Период', width: 120 },
    { field: 'unit', headerName: 'Подразделение', width: 260 },
    { field: 'days', headerName: 'Койко-дн', width: 120,
        // @ts-expect-error
        valueParser: (v: string) => Number(String(v).replace(',', '.')) },
    { field: 'revenue', headerName: 'Доход общий', width: 150,
        valueFormatter: (v) => v != null ? new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB'}).format(Number(v)) : '',
        // @ts-expect-error
        valueParser: (v: string) => Number(String(v).replace(/[^\d.,-]/g,'').replace(',', '.')) },
    { field: 'expenses', headerName: 'Расход общий', width: 150,
        valueFormatter: (v) => v != null ? new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB'}).format(Number(v)) : '',
        // @ts-expect-error
        valueParser: (v: string) => Number(String(v).replace(/[^\d.,-]/g,'').replace(',', '.')) },
    { field: 'result', headerName: 'Фин. результат', width: 160,
        valueFormatter: (v) => v != null ? new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB'}).format(Number(v)) : '',
        // @ts-ignore
        valueParser: (v: string) => Number(String(v).replace(/[^\d.,-]/g,'').replace(',', '.')) },
];

async function kpiDs(_: ListRequest): Promise<ListResponse<Kpi>> {
    const items: Kpi[] = [
        { period: '01.01.2025–31.01.2025', unit: 'Отделение терапии', days: 857, revenue: 18529101.17, expenses: 2105989.91, result: -2768888.74 },
        { period: '01.02.2025–28.02.2025', unit: 'Отделение сосудистое', days: 1200, revenue: 32559453.02, expenses: 18892772.36, result: 6366778.72 },
        { period: '01.03.2025–31.03.2025', unit: 'Гинекологическое отделение', days: 613, revenue: 11256000.00, expenses: 9426853.27, result: 1962500.00 },
    ];
    return { items, total: items.length };
}

export function KpiMainTable() {
    return (
        <div style={{ height: '100%' }}>
            <DataGrid<Kpi> storageKey="kpi.main" columns={kpiCols} dataSource={kpiDs} pageSize={100} />
        </div>
    );
}

/** Сводная строка без заголовка */
type KpiSum = {
    days: number; revenue: number; expenses: number; result: number;
}
const kpiSumCols: GridColumn<KpiSum>[] = [
    { field: 'days', headerName: 'Койко-дн', width: 120 },
    { field: 'revenue', headerName: 'Доход общий', width: 150,
        valueFormatter: (v) => new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB'}).format(Number(v)) },
    { field: 'expenses', headerName: 'Расход общий', width: 150,
        valueFormatter: (v) => new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB'}).format(Number(v)) },
    { field: 'result', headerName: 'Фин. результат', width: 160,
        valueFormatter: (v) => new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB'}).format(Number(v)) },
];
async function kpiSumDs(): Promise<ListResponse<KpiSum>> {
    return { items: [{ days: 3910, revenue: 192357210.53, expenses: 15243240.26, result: 19835751.00 }], total: 1 };
}
export function KpiSummaryRow() {
    return (
        <div style={{ height: '100%' }}>
            <DataGrid<KpiSum>
                storageKey="kpi.summary"
                columns={kpiSumCols}
                dataSource={kpiSumDs as any}
                pageSize={1}
                hideHeader
                className="compact"
                rowHeight={28}
            />
        </div>
    );
}