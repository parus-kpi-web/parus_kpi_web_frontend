import { LayoutManager } from '../../widgets/Workbench/LayoutManager';

export function WorkbenchPage() {
    return (
        <div className="app-shell">
            <header className="app-header">
                <div className="app-header__title">Записи в журнале</div>
            </header>

            <div className="workbench-area">
                <div className="workbench-frame">
                    <LayoutManager />
                </div>
            </div>
        </div>
    );
}