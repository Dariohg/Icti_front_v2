import React from 'react';
import { Form, Input, Button, Row, Col, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import '../Styles/register.css'; // Importar estilos personalizados

const { Option } = Select;

const Register = () => {
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };

    const validatePasswords = ({ getFieldValue }) => ({
        validator(_, value) {
            if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
            }
            return Promise.reject(new Error('The two passwords do not match!'));
        },
    });

    return (
        <div className="register-container">
            <div className="register-form-container">
                <Form
                    name="register"
                    className="register-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <h2 className="register-title">Register</h2>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="nombre"
                                rules={[{ required: true, message: 'Please input your First Name!' }]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="First Name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="apellidoMaterno"
                                rules={[{ required: true, message: 'Please input your Middle Name!' }]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Middle Name" />
                            </Form.Item>
                            <Form.Item
                                name="correo"
                                rules={[{ required: true, message: 'Please input your Email!', type: 'email' }]}
                            >
                                <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
                            </Form.Item>
                            <Form.Item
                                name="cargo"
                                rules={[{ required: true, message: 'Please input your Position!' }]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Position" />
                            </Form.Item>
                            <Form.Item
                                name="username"
                                rules={[{ required: true, message: 'Please input your Username!' }]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                            </Form.Item>
                            <Form.Item
                                name="isSuperUser"
                                rules={[{ required: true, message: 'Please select if the user is a super user!' }]}
                            >
                                <Select placeholder="Select if Super User">
                                    <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="apellidoPaterno"
                                rules={[{ required: true, message: 'Please input your Last Name!' }]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Last Name" />
                            </Form.Item>
                            <Form.Item
                                name="telefono"
                                rules={[{ required: true, message: 'Please input your Phone Number!' }]}
                            >
                                <Input prefix={<PhoneOutlined className="site-form-item-icon" />} placeholder="Phone Number" />
                            </Form.Item>
                            <Form.Item
                                name="departamento"
                                rules={[{ required: true, message: 'Please input your Department!' }]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Department" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Please input your Password!' }]}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder="Password"
                                />
                            </Form.Item>
                            <Form.Item
                                name="confirmPassword"
                                dependencies={['password']}
                                hasFeedback
                                rules={[
                                    { required: true, message: 'Please confirm your Password!' },
                                    validatePasswords,
                                ]}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder="Confirm Password"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="register-form-button">
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Register;
