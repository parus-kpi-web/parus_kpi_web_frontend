import 'rc-dock/dist/rc-dock.css';
import DockLayout, { type LayoutBase, type PanelData, type TabData } from 'rc-dock';
import { useEffect, useRef, useState } from 'react';
import { loadJSON, saveJSON } from '../../shared/lib/storage';
import { createPanelTab } from './PanelManager';

// измени ключ, чтобы не подхватывалась старая раскладка
const STORAGE_KEY = 'workbench.layout.v2';

// ОДНА панель со вкладками (внутри tabs: [...]) вместо двух колонок
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

    const onLayoutChange = (l: LayoutBase) => {
        setLayout(l);
        saveJSON(STORAGE_KEY, l);
    };

    // простое API для открытия панели
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
