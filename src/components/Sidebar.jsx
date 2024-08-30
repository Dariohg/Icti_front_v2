import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
    FileTextOutlined,
    FolderOpenOutlined,
    PlusOutlined,
    UnorderedListOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    LinkOutlined,
    SettingOutlined,
    FileProtectOutlined, ProfileOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import '../Styles/sidebar.css'; // Importar estilos personalizados

const { Sider } = Layout;
const { SubMenu } = Menu;

const Sidebar = ({ onCollapse }) => {
    // Estado inicial colapsado
    const [collapsed, setCollapsed] = useState(true);
    const location = useLocation();

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
        if (onCollapse) {
            onCollapse(!collapsed);
        }
    };

    return (
        <Sider
            collapsible
            collapsed={collapsed}
            collapsedWidth={80}
            className={`sidebar-container ${collapsed ? 'collapsed' : ''}`}
            style={{
                position: 'fixed',
                top: 64,
                left: 0,
                width: collapsed ? 80 : 200,
                height: 'calc(100vh - 64px)',
                overflow: 'hidden',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <div
                className="trigger-button"
                onClick={toggleCollapsed}
                style={{ textAlign: 'center', padding: '10px', cursor: 'pointer' }}
            >
                {collapsed ? (
                    <MenuUnfoldOutlined style={{ color: '#fff', fontSize: '18px' }} />
                ) : (
                    <MenuFoldOutlined style={{ color: '#fff', fontSize: '18px' }} />
                )}
            </div>
            <Menu
                mode="inline"
                inlineCollapsed={collapsed}
                defaultSelectedKeys={[location.pathname]}
                selectedKeys={[location.pathname]}
                style={{ height: '100%', borderRight: 0, transition: 'all 0.2s ease-in-out' }}
            >
                <SubMenu key="enlaces" icon={<LinkOutlined />} title="Enlaces">
                    <Menu.Item key="/enlaces">
                        <Link to="/enlaces">
                            <UnorderedListOutlined />
                            Listar Enlaces
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/addEnlace">
                        <Link to="/addEnlace">
                            <PlusOutlined />
                            Agregar Enlace
                        </Link>
                    </Menu.Item>
                </SubMenu>
                <SubMenu key="contratos" icon={<FileTextOutlined />} title="Contratos">
                    <Menu.Item key="/contratos">
                        <Link to="/contratos">
                            <UnorderedListOutlined />
                            Listar Contratos
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/addContrato">
                        <Link to="/addContrato">
                            <PlusOutlined />
                            Agregar Contrato
                        </Link>
                    </Menu.Item>
                </SubMenu>
                <SubMenu key="servicios" icon={<FolderOpenOutlined />} title="Servicios">
                    <Menu.Item key="/servicios">
                        <Link to="/servicios">
                            <UnorderedListOutlined />
                            Listar Servicios
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/addServicioP1">
                        <Link to="/addServicioP1">
                            <PlusOutlined />
                            Agregar Servicios
                        </Link>
                    </Menu.Item>
                </SubMenu>
                <SubMenu key="avanzados" icon={<SettingOutlined />} title="Gestión">
                    <Menu.Item key="/allEnlaces">
                        <Link to="/allenlaces">
                            <FileTextOutlined />
                            Enlaces
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/allContratos">
                        <Link to="/allContratos">
                            <FileProtectOutlined />
                            Contratos
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="allServicios">
                        <Link to="/allServicios">
                            <ProfileOutlined />
                            Servicios
                        </Link>
                    </Menu.Item>
                </SubMenu>
            </Menu>
        </Sider>
    );
};

export default Sidebar;
