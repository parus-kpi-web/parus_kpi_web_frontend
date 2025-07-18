import React from 'react';

export interface TableProps {
    data: never[];
    columns: never[];
}
// пока что заглушка
const Table: React.FC<TableProps> = ({ data, columns }) => {
    return (
        <div>
            <p>Тут будет таблица с {data.length} строками и {columns.length} столбцами</p>
        </div>
    );
};

export default Table;