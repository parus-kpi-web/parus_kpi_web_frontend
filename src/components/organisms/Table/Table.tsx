import React from 'react';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import {ModuleRegistry, AllCommunityModule} from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

export interface TableProps {
    data: any[];
    columns: any[];
}

const Table: React.FC<TableProps> = ({data, columns}) => (
    <div className="ag-theme-alpine" style={{height: '100%', width: '100%'}}>
        <AgGridReact
            rowData={data}
            columnDefs={columns}
            defaultColDef={{
                resizable: true,
                sortable: true,
                editable: true,
                flex: 1,
                minWidth: 100,
            }}
        />
    </div>
);

export default Table;