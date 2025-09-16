import { ReactNode } from 'react';

export function SectionPanel({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div className="section-title">{title}</div>
            <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
        </div>
    );
}

export function SummaryPanel({ children }: { children: ReactNode }) {
    // Однострочная сводная таблица — просто растягиваем ее на 100% предоставленной высоты
    return <div style={{ height: '100%' }}>{children}</div>;
}