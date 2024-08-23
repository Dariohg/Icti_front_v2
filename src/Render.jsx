import React, { useState } from 'react';
import { Layout } from 'antd';
import { useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AppHeader from './components/Header';
import FloatButtonGroup from './components/FloatButtonGroup'; // Importación del nuevo componente

const { Content } = Layout;

function Render({ children }) {
    const [collapsed, setCollapsed] = useState(true);
    const location = useLocation();

    const handleCollapse = (newCollapsedState) => {
        setCollapsed(newCollapsedState);
    };

    const shouldShowFloatButton = location.pathname !== '/login' && location.pathname !== '/register';

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <AppHeader />
            <Sidebar onCollapse={handleCollapse} collapsed={collapsed} />
            <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
                <Content style={{ padding: 26, background: '#fff', transition: 'all 0.2s' }}>
                    {children}
                </Content>
                {shouldShowFloatButton && <FloatButtonGroup />}
            </Layout>
        </Layout>
    );
}

export default Render;
