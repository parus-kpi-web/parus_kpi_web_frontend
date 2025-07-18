import React from 'react';
import { Menu } from 'antd';
import { PieChartOutlined, DesktopOutlined } from '@ant-design/icons';

export interface SidebarMenuProps {
    collapsed: boolean;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ collapsed }) => (
    <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['1']}
        inlineCollapsed={collapsed}
    >
        <Menu.Item key="1" icon={<PieChartOutlined />}>
            Dashboard
        </Menu.Item>
        <Menu.Item key="2" icon={<DesktopOutlined />}>
            Budgets
        </Menu.Item>
    </Menu>
);

export default SidebarMenu;