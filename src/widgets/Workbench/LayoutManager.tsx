import 'rc-dock/dist/rc-dock.css';
import DockLayout, { type LayoutBase, type PanelData, type TabData } from 'rc-dock';
import { useEffect, useRef, useState } from 'react';
import { loadJSON, saveJSON } from '../../shared/lib/storage';
import { createPanelTab, resolvePanel, type PanelType, type PanelParams } from './PanelManager';

const STORAGE_KEY = 'workbench.layout.v1'; // новый ключ — игнорируем старые «битые» сохранения

// сопоставление типов вкладок и читаемых заголовков (на случай отсутствия title в сохранённом табе)
const defaultTitles: Record<PanelType, string> = {
    'table.services': 'Услуги',
    'table.employees': 'Сотрудники',
    'table.stock': 'Склад',
    'table.cases': 'Госпитализации',
    'table.finance': 'Финансы',
};

const defaultLayout: LayoutBase = {
    dockbox: {
        mode: 'horizontal',
        children: [
            {
                tabs: [
                    createPanelTab('table.employees', { title: 'Сотрудники' }),
                    createPanelTab('table.services', { title: 'Услуги' }),
                ],
            },
        ],
    },
};

export function LayoutManager() {
    const layoutRef = useRef<DockLayout>(null);
    const [layout, setLayout] = useState<LayoutBase>(() => loadJSON(STORAGE_KEY, defaultLayout));

    const onLayoutChange = (l: LayoutBase) => { setLayout(l); saveJSON(STORAGE_KEY, l); };

    // ВАЖНО: при восстановлении таба подставляем и content, и человекочитаемый title
    function loadTab(tab: TabData): TabData {
        const type: PanelType | undefined =
            (tab.data as any)?.type ?? (tab.id?.split(':')[0] as PanelType | undefined);
        const params: PanelParams | undefined = (tab.data as any)?.params;

        if (!type) return tab; // ничего не знаем о табе — отдадим как есть

        const title = (tab.title as string | undefined) ?? params?.title ?? defaultTitles[type];
        return {
            ...tab,
            title,
            content: resolvePanel(type, params),
            data: { type, params },
            cached: true,
            closable: tab.closable ?? true,
        };
    }

    useEffect(() => {
        (window as any).openPanel = (type: PanelType, params?: PanelParams) => {
            const tab = createPanelTab(type, params);
            layoutRef.current?.dockMove(tab, null, 'middle');
        };
    }, []);

    return (
        <DockLayout
            ref={layoutRef}
            defaultLayout={layout}
            onLayoutChange={onLayoutChange}
            style={{ height: '100%', width: '100%' }}
            loadTab={loadTab}
            loadPanel={(p: PanelData) => p}
        />
    );
}
