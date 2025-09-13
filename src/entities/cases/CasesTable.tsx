import { DataGrid } from '../../shared/ui/organisms/DataGrid/DataGrid';
import type { GridColumn } from '../../shared/ui/organisms/DataGrid/types';
import type { ListRequest, ListResponse } from '../../shared/lib/types';

export type CaseItem = {
    card: string;           // Номер карты
    start: string;          // Дата начала
    end?: string;           // Дата окончания
    patientId: string;      // ИНП
    diagCode: string;       // Код диагноза
    diagName: string;       // Диагноз
    bedDays?: number;
    unitName: string;       // Подразделение
    doctorName?: string;    // Врач
    funding?: string;       // Финансирование
    cost?: number;          // Стоимость (если есть)
};

const columns: GridColumn<CaseItem>[] = [
    { field: 'card', headerName: 'Карта', width: 120 },
    { field: 'start', headerName: 'Начало', width: 140 },
    { field: 'end', headerName: 'Окончание', width: 140 },
    { field: 'diagCode', headerName: 'Диагноз', width: 110 },
    { field: 'diagName', headerName: 'Наименование диагноза', width: 320 },
    { field: 'bedDays', headerName: 'К-дн', width: 90 },
    { field: 'unitName', headerName: 'Подразделение', width: 240 },
    { field: 'doctorName', headerName: 'Врач', width: 220 },
    { field: 'funding', headerName: 'Финансирование', width: 160 },
];

async function mockDataSource(_: ListRequest): Promise<ListResponse<CaseItem>> {
    const items: CaseItem[] = Array.from({ length: 40 }).map((_, i) => ({
        card: `H2025-${1000 + i}`,
        start: `2025-04-${String((i % 28) + 1).padStart(2, '0')} 11:14:00`,
        end: `2025-04-${String((i % 28) + 2).padStart(2, '0')} 13:14:00`,
        patientId: `MK${600000 + i}`,
        diagCode: i % 2 ? 'I25.2' : 'K26.0',
        diagName: i % 2 ? 'Инфаркт миокарда в анамнезе' : 'Острая с кровотечением',
        bedDays: (i % 7) + 1,
        unitName: 'Терапевтическое отделение стационара',
        doctorName: i % 2 ? 'Дьякова О.Н.' : 'Якунина Е.В.',
        funding: i % 3 ? '1 ОМС' : '2 ДМС',
    }));
    return { items, total: items.length };
}

export function CasesTable({ storageKey = 'panel.cases' }: { storageKey?: string }) {
    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: 8, borderBottom: '1px solid var(--border)' }}>
                <strong>Госпитализации</strong>
            </div>
            <div style={{ flex: 1 }}>
                <DataGrid<CaseItem> storageKey={storageKey} columns={columns} dataSource={mockDataSource} />
            </div>
        </div>
    );
}
export default CasesTable;
