import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { LogoutOutlined } from '@ant-design/icons'; // Importa el icono de logout
import '../Styles/header.css'; // Importar estilos personalizados

const { Header } = Layout;

const AppHeader = ({ userName }) => {
    const location = useLocation();

    const handleLogout = () => {
        // Aquí puedes manejar la lógica de cierre de sesión, como limpiar tokens o redirigir a la página de login
        console.log("Logging out...");
    };

    return (
        <Header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="logo" />
            <Menu theme="dark" mode="horizontal" selectedKeys={[location.pathname]} style={{ flex: 1 }}>
                <Menu.Item key="/home">
                    <Link to="/home">Home</Link>
                </Menu.Item>
                <Menu.Item key="/enlaces">
                    <Link to="/enlaces">Enlaces</Link>
                </Menu.Item>
                <Menu.Item key="/about">
                    About
                </Menu.Item>
                <Menu.Item key="/contact">
                    Contact
                </Menu.Item>
            </Menu>
            <div className="user-info" style={{ display: 'flex', alignItems: 'center', marginRight: 20 }}>
                <span style={{ color: '#fff', marginRight: 16 }}>{userName}</span>
                <Button
                    type="primary"
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                    style={{ marginRight: '10px' }}
                >
                    Cerrar Sesión
                </Button>
            </div>
        </Header>
    );
};

export default AppHeader;
