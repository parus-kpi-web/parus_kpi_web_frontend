import DockLayout, { type LayoutBase } from 'rc-dock';
import 'rc-dock/dist/rc-dock.css';
import { ReactNode } from 'react';

/** Внутренний док на две вертикальные панели: основная + сводная */
export function TwoRowDock({ main, summary }: { main: ReactNode; summary: ReactNode }) {
    const layout: LayoutBase = {
        dockbox: {
            mode: 'vertical',
            children: [
                {
                    size: 3,
                    tabs: [{ id: 'main', title: '', content: <div style={{height:'100%'}}>{main}</div>, closable: false }],
                },
                {
                    size: 0.9,
                    tabs: [{ id: 'summary', title: '', content: <div style={{height:'100%'}}>{summary}</div>, closable: false }],
                },
            ],
        },
    };

    return (
        <div style={{ position: 'absolute', inset: 0 }}>
            <DockLayout defaultLayout={layout} style={{ height: '100%', width: '100%' }} />
        </div>
    );
}