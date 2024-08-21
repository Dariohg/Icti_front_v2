import React from 'react';
import { Form, Input, Button, Row, Col, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../Styles/register.css'; // Importar estilos personalizados

const { Option } = Select;

const Register = () => {
    const navigate = useNavigate();

    const onFinish = (values) => {
        console.log('Valores recibidos del formulario: ', values);
    };

    const validatePasswords = ({ getFieldValue }) => ({
        validator(_, value) {
            if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
            }
            return Promise.reject(new Error('¡Las dos contraseñas no coinciden!'));
        },
    });

    const handleCancel = () => {
        navigate('/home'); // Redirige a la página de inicio
    };

    return (
        <div className="register-container">
            <div className="register-form-container">
                <Form
                    name="register"
                    className="register-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <h2 className="register-title">Registro</h2>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="nombre"
                                rules={[{ required: true, message: '¡Por favor ingresa tu nombre!' }]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Nombre" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="apellidoMaterno"
                                rules={[{ required: true, message: '¡Por favor ingresa tu apellido materno!' }]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Apellido materno" />
                            </Form.Item>
                            <Form.Item
                                name="correo"
                                rules={[{ required: true, message: '¡Por favor ingresa tu correo!', type: 'email' }]}
                            >
                                <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Correo electrónico" />
                            </Form.Item>
                            <Form.Item
                                name="cargo"
                                rules={[{ required: true, message: '¡Por favor ingresa tu cargo!' }]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Cargo" />
                            </Form.Item>
                            <Form.Item
                                name="username"
                                rules={[{ required: true, message: '¡Por favor ingresa tu nombre de usuario!' }]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Nombre de usuario" />
                            </Form.Item>
                            <Form.Item
                                name="isSuperUser"
                                rules={[{ required: true, message: '¡Por favor selecciona si el usuario es superusuario!' }]}
                            >
                                <Select placeholder="Selecciona si es Superusuario">
                                    <Option value="yes">Sí</Option>
                                    <Option value="no">No</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="apellidoPaterno"
                                rules={[{ required: true, message: '¡Por favor ingresa tu apellido paterno!' }]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Apellido paterno" />
                            </Form.Item>
                            <Form.Item
                                name="telefono"
                                rules={[{ required: true, message: '¡Por favor ingresa tu número de teléfono!' }]}
                            >
                                <Input prefix={<PhoneOutlined className="site-form-item-icon" />} placeholder="Número de teléfono" />
                            </Form.Item>
                            <Form.Item
                                name="departamento"
                                rules={[{ required: true, message: '¡Por favor ingresa tu departamento!' }]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Departamento" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: '¡Por favor ingresa tu contraseña!' }]}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder="Contraseña"
                                />
                            </Form.Item>
                            <Form.Item
                                name="confirmPassword"
                                dependencies={['password']}
                                hasFeedback
                                rules={[
                                    { required: true, message: '¡Por favor confirma tu contraseña!' },
                                    validatePasswords,
                                ]}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder="Confirmar contraseña"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="register-form-button">
                            Registrar
                        </Button>
                        <Button danger type="text" onClick={handleCancel} className="register-form-button" style={{ marginTop: '25px' }}>
                            Cancelar
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Register;
