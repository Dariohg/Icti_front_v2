import React, { useState } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import '../Styles/login.css'; // Importar estilos personalizados
import axios from 'axios';

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const handleLogin = async (values) => {
        try {
            const response = await axios.post('http://localhost:8000/auth/login', 
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
        }
    }

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
                    <h2 className="login-title">Login</h2>
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Password"
                            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            onClick={togglePasswordVisibility}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                        <a className="login-form-forgot" href="">
                            Forgot password
                        </a>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                        Or <a href="/register">register now!</a>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;
