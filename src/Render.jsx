import React, { useState } from 'react';
import { Layout } from 'antd';
import Sidebar from './components/Sidebar';
import AppHeader from './components/Header';

const { Content } = Layout;

function Render({ children }) {
    const [collapsed, setCollapsed] = useState(false);

    const handleCollapse = (newCollapsedState) => {
        setCollapsed(newCollapsedState);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <AppHeader />
            <Sidebar onCollapse={handleCollapse} collapsed={collapsed} />
            <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
                <Content style={{ padding: 26, background: '#fff', transition: 'all 0.2s' }}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}

export default Render;
