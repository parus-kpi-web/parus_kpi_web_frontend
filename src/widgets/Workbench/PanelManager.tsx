import type { TabData } from 'rc-dock';
import React from 'react';
import { ServicesTable } from '../../entities/services/ServicesTable';
import { EmployeesTable } from '../../entities/employees/EmployeesTable';
import { StockTable } from '../../entities/stock/StockTable';
import { CasesTable } from '../../entities/cases/CasesTable';
import { FinanceTable } from '../../entities/finance/FinanceTable';

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
    'table.stock': (p) => <StockTable storageKey={p?.storageKey ?? 'panel.stock'} />,
    'table.cases': (p) => <CasesTable storageKey={p?.storageKey ?? 'panel.cases'} />,
    'table.finance': (p) => <FinanceTable storageKey={p?.storageKey ?? 'panel.finance'} />,
};

const defaultTitles: Record<PanelType, string> = {
    'table.services': 'Услуги',
    'table.employees': 'Сотрудники',
    'table.stock': 'Склад',
    'table.cases': 'Госпитализации',
    'table.finance': 'Финансы',
};

export function resolvePanel(type: PanelType, params?: PanelParams) {
    return registry[type](params);
}

export function createPanelTab(type: PanelType, params?: PanelParams): TabData {
    return {
        id: `${type}:${params?.title ?? ''}:${crypto.randomUUID()}`,
        title: params?.title ?? defaultTitles[type],
        content: resolvePanel(type, params),
        cached: true,
        closable: true,
        data: { type, params },
    } as TabData;
}
