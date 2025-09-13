import { useMemo, useState } from 'react';
import { DataGrid } from '../../shared/ui/organisms/DataGrid/DataGrid';
import type { GridColumn } from '../../shared/ui/organisms/DataGrid/types';
import type { ListRequest, ListResponse } from '../../shared/lib/types';

type FinanceMode = 'byDepartment' | 'byKSG' | 'byDischarge';
type FinanceMetric = 'income' | 'expense' | 'kz' | 'profit';

type RowDept = { periodStart: string; periodEnd: string; unitName: string; bedDays?: number; income?: number; expense?: number; profit?: number; kz?: number; };
type RowKsg  = { ksgCode: string; ksgName: string; bedDays?: number; income?: number; expense?: number; profit?: number; kz?: number; };
type RowDis  = { patientId: string; card: string; dischargeDate: string; ksgCode?: string; ksgName?: string; income?: number; expense?: number; profit?: number; kz?: number; };

const currency = (v?: number) =>
    v == null ? '' : new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(Number(v));

function buildColumns(mode: FinanceMode, metric: FinanceMetric): GridColumn<any>[] {
    const metricCol =
        metric === 'income'  ? { field: 'income',  headerName: 'Доход', valueFormatter: (v: unknown)=>currency(Number(v)), width: 140 } :
            metric === 'expense' ? { field: 'expense', headerName: 'Расход', valueFormatter: (v: unknown)=>currency(Number(v)), width: 140 } :
                metric === 'profit'  ? { field: 'profit',  headerName: 'Фин. результат', valueFormatter: (v: unknown)=>currency(Number(v)), width: 160 } :
                    { field: 'kz',      headerName: 'КЗ', width: 100 };

    if (mode === 'byDepartment') {
        return [
            { field: 'periodStart', headerName: 'Период с', width: 120 },
            { field: 'periodEnd', headerName: 'Период по', width: 120 },
            { field: 'unitName', headerName: 'Подразделение', width: 280 },
            { field: 'bedDays', headerName: 'К-дн', width: 90 },
            metricCol,
        ];
    }
    if (mode === 'byKSG') {
        return [
            { field: 'ksgCode', headerName: 'Код КСГ', width: 120 },
            { field: 'ksgName', headerName: 'Наименование КСГ', width: 320 },
            { field: 'bedDays', headerName: 'К-дн', width: 90 },
            metricCol,
        ];
    }
    return [
        { field: 'patientId', headerName: 'ИНП', width: 140 },
        { field: 'card', headerName: 'Карта', width: 120 },
        { field: 'dischargeDate', headerName: 'Дата выписки', width: 140 },
        { field: 'ksgCode', headerName: 'Код КСГ', width: 120 },
        { field: 'ksgName', headerName: 'Наименование КСГ', width: 260 },
        metricCol,
    ];
}

async function mockDept(_: ListRequest): Promise<ListResponse<RowDept>> {
    const items: RowDept[] = Array.from({ length: 20 }).map((_, i) => ({
        periodStart: '2025-01-01',
        periodEnd: '2025-06-30',
        unitName: i % 2 ? 'Урологическое отделение' : 'Гинекологическое отделение',
        bedDays: 500 + i * 10,
        income: 2_000_000 + i * 10_000,
        expense: 2_500_000 + i * 12_000,
        profit: -300_000 - i * 2_000,
        kz: i % 2 ? 1.12 : 0.96,
    }));
    return { items, total: items.length };
}
async function mockKsg(_: ListRequest): Promise<ListResponse<RowKsg>> {
    const items: RowKsg[] = Array.from({ length: 15 }).map((_, i) => ({
        ksgCode: i % 2 ? 'st15.007' : 'st15.017',
        ksgName: i % 2 ? 'Расстройства периферической НС' : 'Цереброваскулярные болезни',
        bedDays: 300 + i * 5,
        income: 1_500_000 + i * 12_000,
        expense: 2_100_000 + i * 15_000,
        profit: -600_000 - i * 3_000,
        kz: 1.3,
    }));
    return { items, total: items.length };
}
async function mockDis(_: ListRequest): Promise<ListResponse<RowDis>> {
    const items: RowDis[] = Array.from({ length: 25 }).map((_, i) => ({
        patientId: `MK${640000 + i}`,
        card: `H2025-${4000 + i}`,
        dischargeDate: `2025-05-${String((i % 28) + 1).padStart(2, '0')} 15:32:00`,
        ksgCode: i % 2 ? 'st15.003' : 'st15.004',
        ksgName: i % 2 ? 'Дегенеративные болезни НС' : 'Демиелинизирующие болезни НС',
        income: 31_105 + i * 120,
        expense: 45_000 + i * 300,
        profit: -13_895 - i * 180,
        kz: i % 2 ? 0.84 : 1.33,
    }));
    return { items, total: items.length };
}

export function FinanceTable({
                                 mode = 'byDepartment',
                                 metric: initialMetric = 'profit',
                                 storageKey = `panel.finance.${mode}`,
                             }: { mode?: FinanceMode; metric?: FinanceMetric; storageKey?: string }) {
    const [metric] = useState<FinanceMetric>(initialMetric);
    const columns = useMemo(() => buildColumns(mode, metric), [mode, metric]);

    const dataSource = (q: ListRequest) => (
        mode === 'byKSG' ? mockKsg(q) : mode === 'byDischarge' ? mockDis(q) : mockDept(q)
    );

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: 8, borderBottom: '1px solid var(--border)' }}>
                <strong>Финансы — {mode}</strong>
            </div>
            <div style={{ flex: 1 }}>
                <DataGrid<any> storageKey={storageKey} columns={columns} dataSource={dataSource} />
            </div>
        </div>
    );
}
export default FinanceTable;
