import type { TabData } from 'rc-dock';
import React from 'react';
import { SectionPanel, SummaryPanel } from '../../shared/ui/layout/SectionPanel';
import { TwoRowDock } from './TwoRowDock';

import { KpiMainTable, KpiSummaryRow } from '../../entities/kpi/KpiTables';
import { KsgMainTable, KsgSummaryRow } from '../../entities/ksg/KsgTables';

import { StayMainTable, StaySummaryRow } from '../../entities/stay/StayTables';
import { CardsMainTable, CardsSummaryRow } from '../../entities/cards/CardsTables';
import { ServicesMainTable, ServicesSummaryRow } from '../../entities/services/ServicesTables';
import { MaterialsMainTable, MaterialsSummaryRow } from '../../entities/materials/MaterialsTables';

/** Типы наших контентных панелей */
export type PanelType =
    | 'group.kpi'
    | 'group.ksg'
    | 'tab.stay'
    | 'tab.cards'
    | 'tab.services'
    | 'tab.materials';

export type PanelParams = { title?: string };

function twoRow(title: string, Main: React.ComponentType, Summary: React.ComponentType) {
    return (
        <TwoRowDock
            main={<SectionPanel title={title}><Main /></SectionPanel>}
            summary={<SummaryPanel><Summary /></SummaryPanel>}
        />
    );
}

export const defaultTitles: Record<PanelType, string> = {
    'group.kpi': 'Ключевые показатели эффективности',
    'group.ksg': 'Ключевые показатели эффективности (КСГ)',
    'tab.stay': 'Ключевые показатели эффективности (пребывание в стационаре)',
    'tab.cards': 'Ключевые показатели эффективности (карты)',
    'tab.services': 'Ключевые показатели эффективности (услуги)',
    'tab.materials': 'Ключевые показатели эффективности (материалы)',
};

const registry: Record<PanelType, () => React.ReactNode> = {
    'group.kpi': () => twoRow(defaultTitles['group.kpi'], KpiMainTable, KpiSummaryRow),
    'group.ksg': () => twoRow(defaultTitles['group.ksg'], KsgMainTable, KsgSummaryRow),

    'tab.stay': () => twoRow(defaultTitles['tab.stay'], StayMainTable, StaySummaryRow),
    'tab.cards': () => twoRow(defaultTitles['tab.cards'], CardsMainTable, CardsSummaryRow),
    'tab.services': () => twoRow(defaultTitles['tab.services'], ServicesMainTable, ServicesSummaryRow),
    'tab.materials': () => twoRow(defaultTitles['tab.materials'], MaterialsMainTable, MaterialsSummaryRow),
};

/** Хелпер: это один из наших типов панели? */
export function isKnownPanelType(x: unknown): x is PanelType {
    return typeof x === 'string' && Object.prototype.hasOwnProperty.call(defaultTitles, x);
}

export function resolvePanel(type: PanelType) {
    return registry[type]();
}

export function createTab(type: PanelType, params?: PanelParams): TabData {
    return {
        id: `${type}:${crypto.randomUUID()}`,
        title: params?.title ?? defaultTitles[type],
        content: resolvePanel(type),
        cached: true,
        closable: false,
        data: { type },
    } as TabData;
}