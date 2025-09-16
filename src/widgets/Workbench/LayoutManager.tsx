import 'rc-dock/dist/rc-dock.css';
import DockLayout, { type LayoutBase, type PanelData, type TabData } from 'rc-dock';
import { useRef, useState } from 'react';
import { createTab, resolvePanel, defaultTitles, type PanelType, isKnownPanelType } from './PanelManager';
import { loadJSON, saveJSON } from '../../shared/lib/storage';

const STORAGE_KEY = 'workbench.full.rcdock.v2';

/** Верх полностью на rc-dock (две группы по два блока), низ — две панели с вкладками */
const defaultLayout: LayoutBase = {
    dockbox: {
        mode: 'vertical',
        children: [
            { size: 1.4, tabs: [ createTab('group.kpi') ] },
            { size: 1.2, tabs: [ createTab('group.ksg') ] },

            // Нижняя половина: две панели с вкладками (каждая — вложенный DockLayout)
            {
                size: 2,
                panelLock: { panelStyle: 'main' },
                tabs: [
                    {
                        id: 'tabs.upper',
                        title: 'Пребывание / Карты',
                        content: (
                            <DockLayout
                                defaultLayout={{
                                    dockbox: {
                                        mode: 'horizontal',
                                        children: [
                                            { tabs: [ createTab('tab.stay') ] },
                                            { tabs: [ createTab('tab.cards') ] },
                                        ],
                                    },
                                }}
                                style={{ height: '100%', width: '100%' }}
                            />
                        ),
                        closable: false,
                    },
                ],
            },
            {
                size: 2,
                panelLock: { panelStyle: 'main' },
                tabs: [
                    {
                        id: 'tabs.lower',
                        title: 'Услуги / Материалы',
                        content: (
                            <DockLayout
                                defaultLayout={{
                                    dockbox: {
                                        mode: 'horizontal',
                                        children: [
                                            { tabs: [ createTab('tab.services') ] },
                                            { tabs: [ createTab('tab.materials') ] },
                                        ],
                                    },
                                }}
                                style={{ height: '100%', width: '100%' }}
                            />
                        ),
                        closable: false,
                    },
                ],
            },
        ],
    },
};

export function LayoutManager() {
    const ref = useRef<DockLayout>(null);
    const [layout, setLayout] = useState<LayoutBase>(() => loadJSON(STORAGE_KEY, defaultLayout));

    const onLayoutChange = (l: LayoutBase) => { setLayout(l); saveJSON(STORAGE_KEY, l); };

    /** ВАЖНО: восстанавливаем ТОЛЬКО известные типы. Остальные табы (служебные) возвращаем как есть */
    function loadTab(tab: TabData): TabData {
        const idPrefix = tab.id?.split(':')[0];
        const typeFromData = (tab.data as any)?.type as string | undefined;
        const t: PanelType | undefined =
            (isKnownPanelType(typeFromData) ? typeFromData : undefined) ??
            (isKnownPanelType(idPrefix) ? (idPrefix as PanelType) : undefined);

        if (!t) return tab; // это не наша «контентная» панель (например, tabs.upper) — оставить как есть

        const title = (tab.title as string | undefined) ?? defaultTitles[t];
        return { ...tab, title, content: resolvePanel(t), data: { type: t }, cached: true, closable: false };
    }

    return (
        <DockLayout
            ref={ref}
            defaultLayout={layout}
            onLayoutChange={onLayoutChange}
            style={{ height: '100%', width: '100%' }}
            loadTab={loadTab}
            loadPanel={(p: PanelData) => p}
        />
    );
}