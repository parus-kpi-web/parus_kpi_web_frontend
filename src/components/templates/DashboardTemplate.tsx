import React from 'react';
import {Layout, SplitPaneLayout, Table} from '../../components';

const demoColumns = [
    {field: 'id', headerName: 'ID'},
    {field: 'name', headerName: 'Название'},
    {field: 'value', headerName: 'Значение'},
];

const demoData = [
    {id: 1, name: 'Пункт A', value: 100},
    {id: 2, name: 'Пункт B', value: 200},
    {id: 3, name: 'Пункт C', value: 300},
];

const DashboardTemplate: React.FC = () => {
    const [collapsed, setCollapsed] = React.useState(false);

    const tables = Array.from({length: 5}, (_, i) => (
        <div key={i} style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            <h3>Таблица {i + 1}</h3>
            <div style={{flex: 1}}>
                <Table data={demoData} columns={demoColumns}/>
            </div>
        </div>
    ));

    return (
        <Layout collapsed={collapsed} toggle={() => setCollapsed(c => !c)}>
            <SplitPaneLayout orientation="horizontal" panes={tables}/>
        </Layout>
    );
};

export default DashboardTemplate;