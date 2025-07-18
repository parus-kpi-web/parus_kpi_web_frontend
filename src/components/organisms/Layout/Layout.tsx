import React from 'react';
import {Layout as AntLayout} from 'antd';
import 'antd/dist/reset.css';
import { Header, SidebarMenu } from '../../../components';

const {Sider, Content} = AntLayout;

interface AppLayoutProps {
    children: React.ReactNode;
    collapsed: boolean;
    toggle: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({children, collapsed, toggle}) => {
    return (
        <AntLayout style={{minHeight: '100vh'}}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <SidebarMenu collapsed={collapsed}/>
            </Sider>
            <AntLayout className="site-layout">
                <Header collapsed={collapsed} toggle={toggle}/>
                <Content style={{margin: '16px', padding: 24, background: '#fff', overflow: 'auto'}}>
                    {children}
                </Content>
            </AntLayout>
        </AntLayout>
    );
};

export default AppLayout;