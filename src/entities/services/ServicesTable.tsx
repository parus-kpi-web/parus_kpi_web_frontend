import { DataGrid } from '../../shared/ui/organisms/DataGrid/DataGrid';
import type { GridColumn } from '../../shared/ui/organisms/DataGrid/types';
import type { ListRequest, ListResponse } from '../../shared/lib/types';

export type ServiceItem = {
    date: string;
    patientCard: string;
    serviceCode: string;
    serviceName: string;
    unit: string;
    cost?: number;
    uet?: number;
    mainExecutor?: string;
};

const columns: GridColumn<ServiceItem>[] = [
    { field: 'date', headerName: 'Дата', width: 140 },
    { field: 'patientCard', headerName: 'Карта', width: 120 },
    { field: 'serviceCode', headerName: 'Код услуги', width: 120 },
    { field: 'serviceName', headerName: 'Услуга', width: 260 },
    { field: 'unit', headerName: 'Подразделение', width: 260 },
    { field: 'uet', headerName: 'УЕТ', width: 100 },
    {
        field: 'cost',
        headerName: 'Стоимость',
        width: 130,
        valueFormatter: (v) =>
            v != null ? new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(Number(v)) : '',
    },
];

async function mockDataSource(_: ListRequest): Promise<ListResponse<ServiceItem>> {
    const items: ServiceItem[] = Array.from({ length: 100 }).map((_, i) => ({
        date: `2025-04-${String((i % 28) + 1).padStart(2, '0')} 12:17:00`,
        patientCard: `H2025-${3000 + i}`,
        serviceCode: '750018',
        serviceName: 'СМТ-форез (1 поле)',
        unit: 'Амбулаторное отд. мед. реабилитации',
        uet: 2,
        cost: 54.82,
        mainExecutor: 'Егорченкова Е.Н.',
    }));
    return { items, total: items.length };
}

export function ServicesTable({ storageKey = 'panel.services' }: { storageKey?: string }) {
    return (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ padding: 8, borderBottom: '1px solid var(--border)' }}>
                <strong>Услуги</strong>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
                <DataGrid<ServiceItem> storageKey={storageKey} columns={columns} dataSource={mockDataSource} />
            </div>
        </div>
    );
}
