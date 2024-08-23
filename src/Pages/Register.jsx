import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Row, Col, Select, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Styles/register.css'; // Importar estilos personalizados

const { Option } = Select;

const Register = () => {

    const navigate = useNavigate();
    const [departamentos, setDepartamentos] = useState([]);
    const [cargos, setCargos] = useState([]);

    useEffect(() => {
        const fetchDepartamentos = async () => {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URI}departamentos`);
                setDepartamentos(data.departamentos || []);
            } catch (error) {
                console.error('Error fetching departamentos:', error);
                setDepartamentos([]);
            }
        };

        const fetchCargos = async () => {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URI}cargos`);
                setCargos(data.cargos || []);
            } catch (error) {
                console.error('Error fetching cargos:', error);
                setCargos([]);
            }
        };

        fetchDepartamentos();
        fetchCargos();
    }, []);

    const onFinish = async (values) => {
        // Estructura de los datos que la API espera
        const dataToSend = {
            nombre: values.nombre,
            apellidoP: values.apellidoPaterno,
            apellidoM: values.apellidoMaterno,
            correo: values.correo,
            telefono: values.telefono,
            cargoAdministrativo: values.cargo, // Asumiendo que values.cargo es el ID del cargo
            departamento: values.departamento, // Asumiendo que values.departamento es el ID del departamento
            password: values.password,
            username: values.username,
            superuser: values.isSuperUser === 'yes' ? 1 : 0, // Convertir 'yes' a 1 y 'no' a 0
        };

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URI}usuarios/auth/register`, dataToSend);
            message.success('Usuario registrado exitosamente');
            navigate('/home'); // Redirige a la página de inicio después del registro exitoso
        } catch (error) {
            console.error('Error al registrar el usuario:', error);
            message.error('Error al registrar el usuario. Por favor, inténtalo de nuevo.');
        }
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
                                rules={[{ required: true, message: '¡Por favor selecciona tu cargo!' }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Selecciona un cargo"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {Array.isArray(cargos) && cargos.map(cargo => (
                                        <Option key={cargo.id} value={cargo.id}>
                                            {cargo.nombre}
                                        </Option>
                                    ))}
                                </Select>
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
                                rules={[{ required: true, message: '¡Por favor selecciona tu departamento!' }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Selecciona un departamento"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {Array.isArray(departamentos) && departamentos.map(depto => (
                                        <Option key={depto.id} value={depto.id}>
                                            {depto.nombre}
                                        </Option>
                                    ))}
                                </Select>
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
