import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { LogoutOutlined } from '@ant-design/icons';
import '../Styles/header.css';
import logo from '../assets/logo.png';

const { Header } = Layout;

const AppHeader = ({ userName }) => {
    const location = useLocation();

    const handleLogout = () => {
        console.log("Logging out...");
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
                <Menu.Item key="/enlaces">
                    <Link to="/enlaces">Enlaces</Link>
                </Menu.Item>
            </Menu>
            <div className="user-info">
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
