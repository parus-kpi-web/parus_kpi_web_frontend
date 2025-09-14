import 'rc-dock/dist/rc-dock.css';
import DockLayout, { type LayoutBase, type PanelData, type TabData } from 'rc-dock';
import { useEffect, useRef, useState } from 'react';
import { loadJSON, saveJSON } from '../../shared/lib/storage';
import { createPanelTab, resolvePanel, type PanelType, type PanelParams } from './PanelManager';

const STORAGE_KEY = 'workbench.layout.v1';

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

    // Восстанавливаем content для табов из сохранённых метаданных
    function loadTab(tab: TabData): TabData {
        const type: PanelType | undefined =
            (tab.data as any)?.type ?? (tab.id?.split(':')[0] as PanelType | undefined);
        const params: PanelParams | undefined = (tab.data as any)?.params;
        return type ? { ...tab, content: resolvePanel(type, params), data: { type, params } } : tab;
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
            style={{ height: '100%', width: '100%' }}   // достаточно растянуть контейнер
            loadTab={loadTab}
            loadPanel={(p: PanelData) => p}
        />
    );
}
