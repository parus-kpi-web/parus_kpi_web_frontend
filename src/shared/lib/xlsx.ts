// Заглушка экспорта. Подключим SheetJS позже при необходимости.
// Сейчас просто готовим CSV и скачиваем.
export function exportToCsv(filename: string, rows: any[], columns: { headerName: string; field: string }[]) {
    const header = columns.map(c => c.headerName).join(';');
    const body = rows.map(r => columns.map(c => String((r as any)[c.field] ?? '')).join(';')).join('\n');
    const csv = header + '\n' + body;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}
