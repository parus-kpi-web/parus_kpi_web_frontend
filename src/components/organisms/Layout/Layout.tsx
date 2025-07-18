import React from 'react';
import {Layout as AntLayout} from 'antd';
import 'antd/dist/reset.css';
import AppHeader from './Header.tsx';
import SidebarMenu from '../SidebarMenu/SidebarMenu';

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
                {/*<div className="logo" style={{height: 32, margin: 16, background: 'rgba(255,255,255,0.3)'}}/>*/}
                <SidebarMenu collapsed={collapsed}/>
            </Sider>
            <AntLayout className="site-layout">
                <AppHeader collapsed={collapsed} toggle={toggle}/>
                <Content style={{margin: '16px', padding: 24, background: '#fff', overflow: 'auto'}}>
                    {children}
                </Content>
            </AntLayout>
        </AntLayout>
    );
};

export default AppLayout;