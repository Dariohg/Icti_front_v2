import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import '../Styles/login.css'; // Importar estilos personalizados
import axios from 'axios';

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleLogin = async (values) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URI}usuarios/auth/login`,
                values,
                {
                    withCredentials: true,
                }
            );
            console.log(response);
            // Redirect to main page
            window.location.href = "/home";
        } catch (error) {
            console.error(error);
            // Mostrar alerta si hay un error (como credenciales incorrectas)
            if (error.response && error.response.status === 401) {
                message.error('Nombre de usuario o contraseña incorrectos.');
            } else {
                message.error('Ocurrió un error al intentar iniciar sesión. Por favor, inténtalo de nuevo.');
            }
        }
    };

    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        handleLogin(values);
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="login-container">
            <div className="login-form-container">
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <h2 className="login-title">Iniciar Sesión</h2>
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: '¡Por favor ingresa tu nombre de usuario!' }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Nombre de usuario" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: '¡Por favor ingresa tu contraseña!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Contraseña"
                            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            onClick={togglePasswordVisibility}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Recuérdame</Checkbox>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Iniciar Sesión
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;
