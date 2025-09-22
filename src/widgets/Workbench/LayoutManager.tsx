import 'rc-dock/dist/rc-dock.css';
import DockLayout, { type LayoutBase, type PanelData, type TabData } from 'rc-dock';
import { useRef, useState } from 'react';
import { createTab, resolvePanel, defaultTitles, type PanelType, isKnownPanelType } from './PanelManager';
import { loadJSON, saveJSON } from '../../shared/lib/storage';

const STORAGE_KEY = 'workbench.layout.target.v2';

/** Вспомогательные сборщики вложенного контента (tabs внутри одной панели) */
function buildStayCardsTabs() {
    // одна панель с ДВУМЯ вкладками: Пребывание / Карты
    const inner: LayoutBase = {
        dockbox: {
            mode: 'horizontal',
            children: [
                { tabs: [ createTab('tab.stay'), createTab('tab.cards') ] }, // <— одна панель, 2 таба
            ],
        },
    };
    return <DockLayout defaultLayout={inner} style={{ height: '100%', width: '100%' }} />;
}

function buildSvcMatTabs() {
    // одна панель с ДВУМЯ вкладками: Услуги / Материалы
    const inner: LayoutBase = {
        dockbox: {
            mode: 'horizontal',
            children: [
                { tabs: [ createTab('tab.services'), createTab('tab.materials') ] },
            ],
        },
    };
    return <DockLayout defaultLayout={inner} style={{ height: '100%', width: '100%' }} />;
}

/** Весь экран — один вертикальный док из 4 блоков, как на макете */
const defaultLayout: LayoutBase = {
    dockbox: {
        mode: 'vertical',
        children: [
            { size: 1.4, tabs: [ createTab('group.kpi') ] },
            { size: 1.2, tabs: [ createTab('group.ksg') ] },

            // вкладки "Пребывание / Карты" на всю ширину (одна панель = две вкладки)
            {
                size: 1.8,
                panelLock: { panelStyle: 'main' },
                tabs: [
                    {
                        id: 'tabs.staycards',
                        title: 'Ключевые показатели эффективности (пребывание / карты)',
                        content: buildStayCardsTabs(),
                        closable: false,
                    },
                ],
            },

            // нижняя панель: вкладки "Услуги / Материалы" на всю ширину (одна панель = две вкладки)
            {
                size: 2.2,
                panelLock: { panelStyle: 'main' },
                tabs: [
                    {
                        id: 'tabs.svcmat',
                        title: 'Ключевые показатели эффективности (услуги / материалы)',
                        content: buildSvcMatTabs(),
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

    /** ВОССТАНОВЛЕНИЕ: 1) служебные панели-вкладки; 2) наши «контентные» панели по типовому ключу */
    function loadTab(tab: TabData): TabData {
        const idPrefix = tab.id?.split(':')[0];

        // 1) служебные — воссоздаём DockLayout с вкладками
        if (idPrefix === 'tabs.staycards') {
            return { ...tab, title: tab.title ?? 'Ключевые показатели эффективности (пребывание / карты)', content: buildStayCardsTabs(), closable: false };
        }
        if (idPrefix === 'tabs.svcmat') {
            return { ...tab, title: tab.title ?? 'Ключевые показатели эффективности (услуги / материалы)', content: buildSvcMatTabs(), closable: false };
        }

        // 2) обычные панели нашего реестра
        const tFromData = (tab.data as any)?.type as string | undefined;
        const t: PanelType | undefined =
            (isKnownPanelType(tFromData) ? tFromData : undefined) ??
            (isKnownPanelType(idPrefix) ? (idPrefix as PanelType) : undefined);

        if (!t) return tab;

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