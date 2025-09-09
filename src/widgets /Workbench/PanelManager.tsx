import type { TabData } from 'rc-dock';
import React from 'react';
import { ServicesTable } from '../../entities/services/ServicesTable';
import { EmployeesTable } from '../../entities/employees/EmployeesTable';

export type PanelType =
    | 'table.services'
    | 'table.employees'
    | 'table.stock'
    | 'table.cases'
    | 'table.finance';

export type PanelParams = {
    title?: string;
    storageKey?: string;
    initialFilters?: Record<string, unknown>;
    metric?: 'income' | 'expense' | 'kz' | 'profit';
};

const registry: Record<PanelType, (p?: PanelParams) => React.ReactNode> = {
    'table.services': (p) => <ServicesTable storageKey={p?.storageKey ?? 'panel.services'} />,
    'table.employees': (p) => <EmployeesTable storageKey={p?.storageKey ?? 'panel.employees'} />,
    'table.stock': () => <div style={{ padding: 12 }}>StockTable: добавим позже</div>,
    'table.cases': () => <div style={{ padding: 12 }}>CasesTable: добавим позже</div>,
    'table.finance': () => <div style={{ padding: 12 }}>FinanceTable: добавим позже</div>,
};

export function createPanelTab(type: PanelType, params?: PanelParams): TabData {
    return {
        id: `${type}:${params?.title ?? ''}:${crypto.randomUUID()}`,
        title: params?.title ?? type,
        content: registry[type](params),
        cached: true,
        closable: true,
    } as TabData;
}