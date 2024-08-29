import React from 'react';
import { Layout, Menu, Button, Avatar } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { LogoutOutlined } from '@ant-design/icons';
import '../Styles/header.css';
import logo from '../assets/logo.png';
import Cookies from 'js-cookie'; // Para manejar las cookies
import { jwtDecode } from 'jwt-decode'; // Importar jwtDecode correctamente

const { Header } = Layout;

const AppHeader = () => {
    const location = useLocation();

    // Obtener el token JWT desde las cookies
    const token = Cookies.get('token'); // Ajusta el nombre del token según lo que esté en tu backend

    let userName = 'Usuario';
    let userInitial = 'U';

    if (token) {
        try {
            // Decodificar el token para obtener la información del usuario
            const decodedToken = jwtDecode(token);
            userName = decodedToken.username || 'Usuario';
            userInitial = userName.charAt(0).toUpperCase();
        } catch (error) {
            console.error('Error decodificando el token JWT:', error);
        }
    }

    const handleLogout = () => {
        // Eliminar la cookie que contiene el token al cerrar sesión
        Cookies.remove('token');
        window.location.href = "/login";
    };

    return (
        <Header className="header">
            <div className="logo-container">
                <img src={logo} alt="Logo" className="logo" />
            </div>
            <Menu theme="dark" mode="horizontal" selectedKeys={[location.pathname]} style={{ flex: 1 }}>
                <Menu.Item key="/home">
                    <Link to="/home">Home</Link>
                </Menu.Item>
                <Menu.Item key="/usuarios">
                    <Link to="/usuarios">Usuarios</Link>
                </Menu.Item>
                <Menu.Item key="/register">
                    <Link to="/register">Registrar</Link>
                </Menu.Item>
            </Menu>
            <div className="user-info">
                <Avatar style={{ backgroundColor: '#87d068', marginRight: 16 }}>{userInitial}</Avatar>
                <span style={{ color: '#fff', marginRight: 16 }}>{userName}</span>
                <Button
                    type="primary"
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                >
                    Cerrar Sesión
                </Button>
            </div>
        </Header>
    );
};

export default AppHeader;
