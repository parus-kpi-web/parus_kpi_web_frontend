import React from 'react';
import { Layout, MultiSplitPane, Table } from '../../components';

const DashboardTemplate: React.FC = () => {
    const [collapsed, setCollapsed] = React.useState(false);

    return (
        <Layout collapsed={collapsed} toggle={() => setCollapsed((c) => !c)}>
            <MultiSplitPane orientation="horizontal" defaultSizes={[10,20,30,20,20]}>
                <Table data={[]} columns={[]} />
                <Table  data={[]} columns={[]}/>
                <Table  data={[]} columns={[]}/>
                <Table  data={[]} columns={[]}/>
                <Table  data={[]} columns={[]}/>
            </MultiSplitPane>
        </Layout>
    );
};

export default DashboardTemplate;