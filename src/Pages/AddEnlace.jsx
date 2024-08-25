import React, { useState, useEffect } from 'react';
import { Input, Button, Form, Row, Col, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import Dropdown from '../components/Dropdown';
import axios from 'axios';
import Cookies from 'js-cookie'; // Importar js-cookie para manejar cookies
import { jwtDecode } from 'jwt-decode'; // Importar jwtDecode correctamente

const AddEnlace = () => {
    const [dependenciaOptions, setDependenciaOptions] = useState([]);
    const [direccionOptions, setDireccionOptions] = useState([]);
    const [departamentoOptions, setDepartamentoOptions] = useState([]);
    const [cargoOptions, setCargoOptions] = useState([]);
    const [formData, setFormData] = useState({});

    const [selectedDependencia, setSelectedDependencia] = useState(null);
    const [selectedDireccion, setSelectedDireccion] = useState(null);
    const [selectedDepartamento, setSelectedDepartamento] = useState(null);
    const [selectedCargo, setSelectedCargo] = useState(null);

    const navigate = useNavigate();
    const token = Cookies.get('token'); // Obtener el token desde las cookies

    useEffect(() => {
        getDependencias();
        getCargos();
    }, []);

    const getDependencias = async () => {
        try {
            const dependenciasRes = await axios.get(`${process.env.REACT_APP_BACKEND_URI}dependencias/`, {
                headers: {
                    Authorization: `Bearer ${token}` // Agregar el token en los headers
                }
            });
            const dependencias = dependenciasRes.data.dependencias;
            const dependenciasMapped = dependencias.map(dep => ({
                value: dep.id,
                label: dep.nombre
            }));
            setDependenciaOptions(dependenciasMapped);
        } catch (error) {
            console.error("Error al obtener dependencias:", error);
        }
    };

    const getCargos = async () => {
        try {
            const cargosRes = await axios.get(`${process.env.REACT_APP_BACKEND_URI}cargos/`, {
                headers: {
                    Authorization: `Bearer ${token}` // Agregar el token en los headers
                }
            });
            const cargos = cargosRes.data.cargos;
            const cargosMapped = cargos.map(cargo => ({
                value: cargo.id,
                label: cargo.nombre
            }));
            setCargoOptions(cargosMapped);
        } catch (error) {
            console.error("Error al obtener los cargos:", error);
        }
    };

    const getDepartamentos = async (direccionId) => {
        try {
            const departamentosRes = await axios.get(`${process.env.REACT_APP_BACKEND_URI}departamentos/direcciones/${direccionId}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Agregar el token en los headers
                }
            });
            const departamentos = departamentosRes.data.departamentos;
            const departamentosMapped = departamentos.map(dep => ({
                value: dep.id,
                label: dep.nombre
            }));
            setDepartamentoOptions(departamentosMapped);
        } catch (error) {
            console.error("Error al obtener departamentos:", error);
        }
    };

    const getDirecciones = async (dependenciaId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}direcciones/dependencias/${dependenciaId}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Agregar el token en los headers
                }
            });
            const direcciones = response.data.direcciones;
            const direccionesMapped = direcciones.map(dir => ({
                value: dir.id,
                label: dir.nombre
            }));
            setDireccionOptions(direccionesMapped);
        } catch (error) {
            console.error("Error al obtener las direcciones:", error);
        }
    };

    const handleDependenciaChange = async (selectedValue) => {
        setSelectedDependencia(selectedValue);
        setSelectedDireccion(null);
        setSelectedDepartamento(null);

        try {
            await getDirecciones(selectedValue);
            setFormData((prevData) => ({
                ...prevData,
                dependencia: selectedValue,
                idDependencia: selectedValue
            }));
        } catch (error) {
            console.error("Error al obtener las direcciones:", error);
        }
    };

    const handleDireccionChange = async (selectedValue) => {
        setSelectedDireccion(selectedValue);
        setSelectedDepartamento(null);

        try {
            await getDepartamentos(selectedValue);
            setFormData((prevData) => ({
                ...prevData,
                direccion: selectedValue,
                idDireccion: selectedValue
            }));
        } catch (error) {
            console.error("Error al obtener los departamentos:", error);
        }
    };

    const handleDepartamentoChange = (selectedValue) => {
        setSelectedDepartamento(selectedValue);
        setFormData((prevData) => ({
            ...prevData,
            departamento: selectedValue,
            idDepartamento: selectedValue
        }));
    };

    const handleCargoChange = (selectedValue) => {
        setSelectedCargo(selectedValue);
        setFormData((prevData) => ({
            ...prevData,
            cargo: selectedValue,
            idCargo: selectedValue
        }));
    };

    const handleSubmit = async () => {
        let userId = null;

        if (token) {
            try {
                // Decodificar el token para obtener el ID del usuario
                const decodedToken = jwtDecode(token);
                userId = decodedToken.id; // Ajusta el nombre del campo según tu token
            } catch (error) {
                console.error('Error decodificando el token JWT:', error);
            }
        }

        const enlaceData = {
            nombre: formData.nombre,
            apellidoP: formData.apellidoPaterno,
            apellidoM: formData.apellidoMaterno,
            correo: formData.correo,
            telefono: formData.telefono,
            estatus: 1, // Valor provisional
            adscripcion_id: selectedDepartamento, // ID del departamento seleccionado
            cargo_id: selectedCargo, // ID del cargo seleccionado
            auth_user_id: userId, // ID del usuario obtenido del token
            tipoPersona_id: 1, // Valor provisional
            direccion_id: selectedDireccion, // ID de la dirección seleccionada
        };

        console.log('enlaceData:', enlaceData);

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URI}enlaces`, enlaceData, {
                headers: {
                    Authorization: `Bearer ${token}` // Agregar el token en los headers
                }
            });

            if (response.status !== 201) {
                message.error('Hubo un error al agregar el enlace');
                throw new Error('Error al agregar el enlace');
            }

            message.success('Enlace agregado exitosamente');
            navigate('/enlaces');
        } catch (error) {
            console.error('Error al agregar el enlace:', error);
            message.error('Hubo un error al agregar el enlace');
        }
    };

    const handleCancel = () => {
        navigate('/enlaces');
    };

    return (
        <Form layout="vertical" onFinish={handleSubmit}>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="Dependencia">
                        <Dropdown
                            value={selectedDependencia}
                            onChange={handleDependenciaChange}
                            options={dependenciaOptions}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Dirección">
                        <Dropdown
                            id="direccion"
                            value={selectedDireccion}
                            onChange={handleDireccionChange}
                            options={direccionOptions}
                            disabled={!selectedDependencia}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="Departamento">
                        <Dropdown
                            id="departamento"
                            value={selectedDepartamento}
                            onChange={handleDepartamentoChange}
                            options={departamentoOptions}
                            disabled={!selectedDireccion}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Nombre">
                        <Input onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="Apellido Paterno">
                        <Input onChange={(e) => setFormData({ ...formData, apellidoPaterno: e.target.value })} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Apellido Materno">
                        <Input onChange={(e) => setFormData({ ...formData, apellidoMaterno: e.target.value })} />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="Correo">
                        <Input onChange={(e) => setFormData({ ...formData, correo: e.target.value })} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Teléfono">
                        <Input
                            onChange={(e) => setFormData({ ...formData, telefono: e.target.value.replace(/\D/g, '') })}
                            maxLength={10}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="Cargo">
                        <Dropdown
                            id="cargo"
                            value={selectedCargo}
                            onChange={handleCargoChange}
                            options={cargoOptions}
                        />
                    </Form.Item>
                </Col>

                <Col span={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Button type="primary" style={{ flex: 1, marginRight: 8 }} onClick={handleSubmit}>
                        Agregar Enlace
                    </Button>
                    <Button danger type="text" onClick={handleCancel} style={{ flex: 1 }}>
                        Cancelar
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default AddEnlace;
