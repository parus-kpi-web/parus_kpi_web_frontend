import React from 'react';
import { Layout, SplitPaneLayout, Table } from '../../components';

const DashboardTemplate: React.FC = () => {
    const [collapsed, setCollapsed] = React.useState(false);

    return (
        <Layout collapsed={collapsed} toggle={() => setCollapsed((c) => !c)}>
            <SplitPaneLayout
                orientation="horizontal"
                left={<Table data={[]} columns={[]}/>}
                right={<Table data={[]} columns={[]}/>}
            />
        </Layout>
    );
};

export default DashboardTemplate;