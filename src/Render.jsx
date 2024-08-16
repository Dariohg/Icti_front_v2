import React, { useState } from 'react';
import { Layout } from 'antd';
import { useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AppHeader from './components/Header';
import { FloatButton } from 'antd';
import {
    PlusOutlined,
    SmileOutlined,
    BulbOutlined,
    CloseOutlined,
    CompassOutlined,
} from '@ant-design/icons';

const { Content } = Layout;

function Render({ children }) {
    // Estado inicial como colapsado
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
                {shouldShowFloatButton && (
                    <FloatButton.Group
                        trigger="click"
                        type="primary"
                        style={{ right: 24, bottom: 24 }}
                        icon={<PlusOutlined />}
                    >
                        <FloatButton icon={<SmileOutlined />} />
                        <FloatButton icon={<BulbOutlined />} />
                        <FloatButton icon={<CompassOutlined />} />
                        <FloatButton icon={<CloseOutlined />} />
                    </FloatButton.Group>
                )}
            </Layout>
        </Layout>
    );
}

export default Render;
