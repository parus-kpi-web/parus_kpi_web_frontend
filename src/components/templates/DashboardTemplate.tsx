import React from 'react';
import {Layout, SplitPaneLayout, Table} from '../../components';

const DashboardTemplate: React.FC = () => {
    const [collapsed, setCollapsed] = React.useState(false);

    // пять таблиц-заглушек
    const tables = Array.from({length: 5}, (_, i) => (
        <Table key={i} data={[]} columns={[]}/>
    ));

    return (
        <Layout collapsed={collapsed} toggle={() => setCollapsed(c => !c)}>
            <SplitPaneLayout orientation="horizontal" panes={tables}/>
        </Layout>
    );
};

export default DashboardTemplate;