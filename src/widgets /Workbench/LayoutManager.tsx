import 'rc-dock/dist/rc-dock.css';
import DockLayout, {type LayoutBase, type PanelData, type TabData } from 'rc-dock';
import { useEffect, useRef, useState } from 'react';
import { loadJSON, saveJSON } from '../../shared/lib/storage';
import { createPanelTab } from './PanelManager';

const STORAGE_KEY = 'workbench.layout.v1';

const defaultLayout: LayoutBase = {
    dockbox: {
        mode: 'horizontal',
        children: [
            { size: 0.35, tabs: [createPanelTab('table.employees', { title: 'Сотрудники' })] },
            { size: 0.65, tabs: [createPanelTab('table.services', { title: 'Услуги' })] },
        ],
    },
};

export function LayoutManager() {
    const layoutRef = useRef<DockLayout>(null);
    const [layout, setLayout] = useState<LayoutBase>(() => loadJSON(STORAGE_KEY, defaultLayout));

    const onLayoutChange = (l: LayoutBase) => {
        setLayout(l);
        saveJSON(STORAGE_KEY, l);
    };

    // простейшее API открытия панели глобально (можно заменить на контекст)
    useEffect(() => {
        (window as any).openPanel = (type: string, params?: any) => {
            const tab: TabData = createPanelTab(type as any, params);
            layoutRef.current?.dockMove(tab, null, 'middle');
        };
    }, []);

    return (
        <DockLayout
            ref={layoutRef}
            defaultLayout={layout}
            onLayoutChange={onLayoutChange}
            style={{ position: 'absolute', inset: 0 }}
            loadTab={(t) => t}
            loadPanel={(p: PanelData) => p}
        />
    );
}