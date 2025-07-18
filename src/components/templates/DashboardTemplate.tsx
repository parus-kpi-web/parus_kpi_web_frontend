import React from 'react';
import { Layout } from '../../components';
import SplitPaneLayout from '../organisms/SplitPane/SplitPaneLayout';
import Table from '../organisms/Table';

const DashboardTemplate: React.FC = () => {
    const [collapsed, setCollapsed] = React.useState(false);

    return (
        <Layout collapsed={collapsed} toggle={() => setCollapsed((c) => !c)}>
            <SplitPaneLayout
                orientation="vertical"
                left={<Table data={[]} columns={[]}/>}
                right={<Table data={[]} columns={[]}/>}
            />
        </Layout>
    );
};

export default DashboardTemplate;