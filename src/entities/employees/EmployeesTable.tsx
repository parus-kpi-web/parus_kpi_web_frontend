import { DataGrid } from '../../shared/ui/organisms/DataGrid/DataGrid';
import type { GridColumn } from '../../shared/ui/organisms/DataGrid/types';
import type { ListRequest, ListResponse } from '../../shared/lib/types';

export type Employee = {
    fio: string;
    lastName: string;
    firstName: string;
    middleName?: string;
    staffType: string;
    position: string;
    unitName: string;
    unitCode: string;
    employmentType?: string;
};

const columns: GridColumn<Employee>[] = [
    { field: 'fio', headerName: 'ФИО', width: 240 },
    { field: 'position', headerName: 'Должность', width: 220 },
    { field: 'staffType', headerName: 'Тип персонала', width: 180 },
    { field: 'unitName', headerName: 'Подразделение', width: 260 },
    { field: 'employmentType', headerName: 'Тип исполнения', width: 180 },
];

async function mockDataSource(_: ListRequest): Promise<ListResponse<Employee>> {
    const items: Employee[] = Array.from({ length: 60 }).map((_, i) => ({
        fio: 'Анисимов Арсентий Валерьевич',
        lastName: 'Анисимов',
        firstName: 'Арсентий',
        middleName: 'Валерьевич',
        staffType: 'врачи',
        position: 'врач-терапевт',
        unitName: 'Терапевтическое отделение стационара',
        unitCode: '1020',
        employmentType: i % 3 ? 'основной работник' : 'внутренний совместитель',
    }));
    return { items, total: items.length };
}

export function EmployeesTable({ storageKey = 'panel.employees' }: { storageKey?: string }) {
    return (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ padding: 8, borderBottom: '1px solid var(--border)' }}>
                <strong>Сотрудники</strong>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
                <DataGrid<Employee> storageKey={storageKey} columns={columns} dataSource={mockDataSource} />
            </div>
        </div>
    );
}