import { LayoutManager } from '../../widgets/Workbench/LayoutManager';

export function WorkbenchPage() {
    return (
        <div className="app-shell">
            <header className="app-header">
                <div className="app-header__title">Записи в журнале</div>
            </header>

            <div className="top-strip">KPI</div>
            <div className="top-strip">КСГ</div>

            <div className="workbench-area">
                <LayoutManager />
            </div>
        </div>
    );
}
