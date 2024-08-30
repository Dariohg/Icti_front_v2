import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Row, Col, Select, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../Styles/register.css';
import LoadingSpinner from "../components/LoadingSpinner";

const { Option } = Select;

const Register = () => {
    const navigate = useNavigate();
    const [dependencias, setDependencias] = useState([]);
    const [direcciones, setDirecciones] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [cargos, setCargos] = useState([]);
    const [selectedDependencia, setSelectedDependencia] = useState(null);
    const [selectedDireccion, setSelectedDireccion] = useState(null);
    const [selectedDepartamento, setSelectedDepartamento] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = Cookies.get('token');

    const validatePassword = (_, value) => {
        const lengthRule = value.length >= 8;
        const capitalRule = /[A-Z]/.test(value);
        const numberRule = /\d/.test(value);
        const specialCharRule = /[@$!%*?&#.]/.test(value);

        if (value.length > 0 && !lengthRule) {
            return Promise.reject('La contraseña debe tener al menos 8 caracteres');
        } else if (value.length > 0 && !capitalRule) {
            return Promise.reject('Debe contener al menos una mayúscula');
        } else if (value.length > 0 && (!numberRule || !specialCharRule)) {
            return Promise.reject('Debe contener un número y un carácter especial');
        } else {
            return Promise.resolve();
        }
    };

    const validateConfirmPassword = ({ getFieldValue }) => ({
        validator(_, value) {
            if (value && getFieldValue('password') !== value) {
                return Promise.reject(new Error('¡Las contraseñas no coinciden!'));
            }
            return Promise.resolve();
        },
    });

    useEffect(() => {
        const fetchDependencias = async () => {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URI}dependencias`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const dependenciasMapped = data.dependencias.map(dep => ({
                    value: dep.id,
                    label: dep.nombre
                }));
                setDependencias(dependenciasMapped);
            } catch (error) {
                console.error('Error fetching dependencias:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchCargos = async () => {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URI}cargos`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setCargos(data.cargos || []);
            } catch (error) {
                console.error('Error fetching cargos:', error);
            }
        };

        fetchDependencias();
        fetchCargos();
    }, [token]);

    const getDirecciones = async (dependenciaId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}direcciones/dependencias/${dependenciaId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const direccionesMapped = response.data.direcciones.map(dir => ({
                value: dir.id,
                label: dir.nombre
            }));
            setDirecciones(direccionesMapped);
            setSelectedDireccion(null); // Reset Dirección
            setDepartamentos([]); // Clear Departamentos
        } catch (error) {
            console.error("Error al obtener las direcciones:", error);
        }
    };

    const getDepartamentos = async (direccionId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}departamentos/direcciones/${direccionId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const departamentosMapped = response.data.departamentos.map(dep => ({
                value: dep.id,
                label: dep.nombre
            }));
            setDepartamentos(departamentosMapped);
            setSelectedDepartamento(null); // Reset Departamento
        } catch (error) {
            console.error("Error al obtener departamentos:", error);
        }
    };

    const handleDependenciaChange = async (value) => {
        setSelectedDependencia(value);
        setSelectedDireccion(null);
        setSelectedDepartamento(null);
        setDirecciones([]);
        setDepartamentos([]);
        await getDirecciones(value);
    };

    const handleDireccionChange = async (value) => {
        setSelectedDireccion(value);
        setSelectedDepartamento(null);
        setDepartamentos([]);
        await getDepartamentos(value);
    };

    const handleDepartamentoChange = (value) => {
        setSelectedDepartamento(value);
    };

    const onFinish = async (values) => {
        const dataToSend = {
            nombre: values.nombre,
            apellidoP: values.apellidoPaterno,
            apellidoM: values.apellidoMaterno,
            correo: values.correo,
            telefono: values.telefono,
            cargoAdministrativo: values.cargo,
            departamento: values.departamento,
            password: values.password,
            username: values.username,
            superuser: values.isSuperUser === 'yes' ? 1 : 0,
        };

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URI}usuarios/auth/register`, dataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            message.success('Usuario registrado exitosamente');
            navigate('/home');
        } catch (error) {
            console.error('Error al registrar el usuario:', error);
            message.error('Error al registrar el usuario. Por favor, inténtalo de nuevo.');
        }
    };

    const handleCancel = () => {
        navigate('/home');
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="register-container">
            <div className="register-form-container">
                <Form
                    name="register"
                    className="register-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <h2 className="register-title">Registrar Usuario</h2>
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
                                name="apellidoPaterno"
                                rules={[{ required: true, message: '¡Por favor ingresa tu apellido paterno!' }]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Apellido paterno" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="apellidoMaterno"
                                rules={[{ required: true, message: '¡Por favor ingresa tu apellido materno!' }]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Apellido materno" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="correo"
                                rules={[{ required: true, message: '¡Por favor ingresa tu correo!', type: 'email' }]}
                            >
                                <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Correo electrónico" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="telefono"
                                rules={[{ required: true, message: '¡Por favor ingresa tu número de teléfono!' }]}
                            >
                                <Input prefix={<PhoneOutlined className="site-form-item-icon" />} placeholder="Número de teléfono" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="dependencia"
                                rules={[{ required: true, message: '¡Por favor selecciona tu dependencia!' }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Selecciona una dependencia"
                                    optionFilterProp="children"
                                    onChange={handleDependenciaChange}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                    value={selectedDependencia}
                                >
                                    {Array.isArray(dependencias) && dependencias.map(dep => (
                                        <Option key={dep.value} value={dep.value}>
                                            {dep.label}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="direccion"
                                rules={[{ required: true, message: '¡Por favor selecciona tu dirección!' }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Selecciona una dirección"
                                    optionFilterProp="children"
                                    onChange={handleDireccionChange}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                    disabled={!selectedDependencia}
                                    value={selectedDireccion}
                                >
                                    {Array.isArray(direcciones) && direcciones.map(dir => (
                                        <Option key={dir.value} value={dir.value}>
                                            {dir.label}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="departamento"
                                rules={[{ required: false, message: '¡Por favor selecciona tu departamento!' }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Selecciona un departamento"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                    disabled={!selectedDireccion}
                                    value={selectedDepartamento}
                                    onChange={handleDepartamentoChange}
                                >
                                    {Array.isArray(departamentos) && departamentos.map(dep => (
                                        <Option key={dep.value} value={dep.value}>
                                            {dep.label}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
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
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="username"
                                rules={[{ required: true, message: '¡Por favor ingresa tu nombre de usuario!' }]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Nombre de usuario" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: '¡Por favor ingresa tu contraseña!',
                                    },
                                    {
                                        validator: validatePassword,
                                    },
                                ]}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder="Contraseña"
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
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
                                name="confirmPassword"
                                dependencies={['password']}
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: '¡Por favor confirma tu contraseña!',
                                    },
                                    validateConfirmPassword,
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
