import React, { useEffect, useState } from 'react';
import {Form, Input, Button, Row, Col, Select, message, Tooltip, Spin} from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie'; // Importar js-cookie para manejar cookies
import '../Styles/register.css'; // Importar estilos personalizados

const { Option } = Select;

const Register = () => {
    const navigate = useNavigate();
    const [dependencias, setDependencias] = useState([]);
    const [direcciones, setDirecciones] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [cargos, setCargos] = useState([]);
    const [selectedDependencia, setSelectedDependencia] = useState(null);
    const [selectedDireccion, setSelectedDireccion] = useState(null);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordProgressVisible, setPasswordProgressVisible] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    const [loading, setLoading] = useState(true);
    const token = Cookies.get('token'); // Obtener el token desde las cookies

    const handlePasswordChange = (e) => {
        const value = e.target.value;

        if (!value) {
            setPasswordError(''); // Resetear el error si el campo está vacío
            setPasswordProgressVisible(false);
            return;
        }

        const lengthRule = value.length >= 8;
        const capitalRule = /[A-Z]/.test(value);
        const numberRule = /\d/.test(value);
        const specialCharRule = /[@$!%*?&#]/.test(value);

        let strength = 0;
        if (lengthRule) strength += 25;
        if (capitalRule) strength += 25;
        if (numberRule) strength += 25;
        if (specialCharRule) strength += 25;

        setPasswordStrength(strength);
        setPasswordProgressVisible(value.length > 0);

        if (!lengthRule) {
            setPasswordError('La contraseña debe tener al menos 8 caracteres');
        } else if (!capitalRule || !numberRule || !specialCharRule) {
            setPasswordError('Debe contener al menos una mayúscula, un número y un carácter especial');
        } else {
            setPasswordError('');
        }
    };

    useEffect(() => {
        const fetchDependencias = async () => {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URI}dependencias`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Agregar el token en los headers
                    }
                });
                const dependenciasMapped = data.dependencias.map(dep => ({
                    value: dep.id,
                    label: dep.nombre
                }));
                setLoading(false);
                setDependencias(dependenciasMapped);
            } catch (error) {
                console.error('Error fetching dependencias:', error);
                setDependencias([]);
            }
        };

        const fetchCargos = async () => {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URI}cargos`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Agregar el token en los headers
                    }
                });
                setCargos(data.cargos || []);
            } catch (error) {
                console.error('Error fetching cargos:', error);
                setCargos([]);
            }
        };

        fetchDependencias();
        fetchCargos();
    }, [token]);

    useEffect(() => {
        if (selectedDependencia) {
            getDirecciones(selectedDependencia);
        } else {
            setDirecciones([]);
            setDepartamentos([]);
        }
    }, [selectedDependencia]);

    useEffect(() => {
        if (selectedDireccion) {
            getDepartamentos(selectedDireccion);
        } else {
            setDepartamentos([]);
        }
    }, [selectedDireccion]);

    const getDirecciones = async (dependenciaId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}direcciones/dependencias/${dependenciaId}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Agregar el token en los headers
                }
            });
            const direccionesMapped = response.data.direcciones.map(dir => ({
                value: dir.id,
                label: dir.nombre
            }));
            setDirecciones(direccionesMapped);
        } catch (error) {
            console.error("Error al obtener las direcciones:", error);
            setDirecciones([]);
        }
    };

    const getDepartamentos = async (direccionId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}departamentos/direcciones/${direccionId}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Agregar el token en los headers
                }
            });
            const departamentosMapped = response.data.departamentos.map(dep => ({
                value: dep.id,
                label: dep.nombre
            }));
            setDepartamentos(departamentosMapped);
        } catch (error) {
            console.error("Error al obtener departamentos:", error);
            setDepartamentos([]);
        }
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
                    Authorization: `Bearer ${token}` // Agregar el token en los headers
                }
            });
            message.success('Usuario registrado exitosamente');
            navigate('/home');
        } catch (error) {
            console.error('Error al registrar el usuario:', error);
            message.error('Error al registrar el usuario. Por favor, inténtalo de nuevo.');
        }
    };

    const validatePasswords = ({ getFieldValue }) => ({
        validator(_, value) {
            const lengthRule = value && value.length >= 8;
            const capitalRule = /[A-Z]/.test(value);
            const numberRule = /\d/.test(value);
            const specialCharRule = /[@$!%*?&#.]/.test(value);

            if (lengthRule && capitalRule && numberRule && specialCharRule) {
                return Promise.resolve();
            }

            return Promise.reject();
        }
    });

    const handleCancel = () => {
        navigate('/home');
    };
    if (loading) {
        return (
            <div className="spin-container">
                <Spin size="large" />
            </div>
        );
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
                                    onChange={value => setSelectedDependencia(value)}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().includes(input.toLowerCase())
                                    }
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
                                    onChange={value => setSelectedDireccion(value)}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                    disabled={!selectedDependencia}
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
                                rules={[{ required: true, message: '¡Por favor selecciona tu departamento!' }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Selecciona un departamento"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                    disabled={!selectedDireccion}
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
                                        validator: (_, value) => {
                                            if (!value) {
                                                setPasswordError('');
                                                return Promise.reject('¡Por favor ingresa tu contraseña!');
                                            }
                                            if (passwordError) {
                                                return Promise.reject(passwordError);
                                            }
                                            return Promise.resolve();
                                        },
                                    },
                                ]}
                            >
                                <Tooltip color={"red"} title={passwordError} visible={!!passwordError} placement="rightTop">
                                    <Input
                                        prefix={<LockOutlined className="site-form-item-icon" />}
                                        type="password"
                                        placeholder="Contraseña"
                                        onChange={handlePasswordChange}
                                    />
                                </Tooltip>
                            </Form.Item>
                            {passwordProgressVisible && (
                                <div style={{ marginTop: -12, marginBottom: 8 }}>
                                    <div style={{ height: 2, background: '#e9e9e9', borderRadius: 2 }}>
                                        <div
                                            style={{
                                                width: `${passwordStrength}%`,
                                                background: passwordStrength < 50 ? '#ff4d4f' : passwordStrength < 75 ? '#faad14' : '#52c41a',
                                                height: '100%',
                                                borderRadius: 2,
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="isSuperUser"
                                rules={[{ required: true, message: '¡Por favor selecciona si el usuario es superusuario!' }]}
                            >
                                <Select placeholder="Selecciona si es Superusuario" tabIndex={-1}>
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
