import { useState, ReactNode } from 'react';

export type Tab = { id: string; title: string; content: ReactNode };

export function Tabs({
                         items, initialId,
                     }: { items: Tab[]; initialId?: string }) {
    const [active, setActive] = useState(initialId ?? items[0]?.id);
    const activeItem = items.find(i => i.id === active) ?? items[0];

    return (
        <div className="tabs">
            <div className="tab-bar">
                {items.map(i => (
                    <button
                        key={i.id}
                        className={`tab-btn ${active === i.id ? 'active' : ''}`}
                        onClick={() => setActive(i.id)}
                        type="button"
                    >
                        {i.title}
                    </button>
                ))}
            </div>
            <div className="tab-content">
                {activeItem?.content}
            </div>
        </div>
    );
}