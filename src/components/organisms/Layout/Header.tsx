import React from 'react';
import {Layout, Menu} from 'antd';
import {MenuUnfoldOutlined, MenuFoldOutlined} from '@ant-design/icons';

const {Header} = Layout;

export interface AppHeaderProps {
    collapsed: boolean;
    toggle: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({collapsed, toggle}) => (
    <Header
        className="site-layout-background"
        style={{
            padding: '0 16px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
        }}
    >
        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: toggle,
        })}
        {/*<span style={{marginLeft: 16, fontSize: 18}}>Парус</span>*/}
        <Menu
            mode="horizontal"
            selectable={false}
            style={{marginLeft: 32, flex: 1}}
        >
            <Menu.Item key="file">Файл</Menu.Item>
            <Menu.Item key="documents">Документы</Menu.Item>
            <Menu.Item key="accounting">Учёт</Menu.Item>
            <Menu.Item key="functions">Функции</Menu.Item>
            <Menu.Item key="reports">Отчёты</Menu.Item>
            <Menu.Item key="dictionaries">Словари</Menu.Item>
            <Menu.Item key="window">Окно</Menu.Item>
            <Menu.Item key="help">Справка</Menu.Item>
        </Menu>
    </Header>
);

export default AppHeader;