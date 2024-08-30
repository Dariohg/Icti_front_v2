import React, { useState, useEffect } from 'react';
import { Input, Button, Form, Row, Col, message, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import LoadingSpinner from "../components/LoadingSpinner";

const { Option } = Select;

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

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = Cookies.get('token');

    useEffect(() => {
        getDependencias();
        getCargos();
    }, []);

    const getDependencias = async () => {
        try {
            const dependenciasRes = await axios.get(`${process.env.REACT_APP_BACKEND_URI}dependencias/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const dependencias = dependenciasRes.data.dependencias;
            const dependenciasMapped = dependencias.map(dep => ({
                value: dep.id,
                label: dep.nombre
            }));
            setLoading(false);
            setDependenciaOptions(dependenciasMapped);
        } catch (error) {
            console.error("Error al obtener dependencias:", error);
        }
    };

    const getCargos = async () => {
        try {
            const cargosRes = await axios.get(`${process.env.REACT_APP_BACKEND_URI}cargos/`, {
                headers: {
                    Authorization: `Bearer ${token}`
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
                    Authorization: `Bearer ${token}`
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
                    Authorization: `Bearer ${token}`
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
                const decodedToken = jwtDecode(token);
                userId = decodedToken.id;
            } catch (error) {
                console.error('Error decodificando el token JWT:', error);
            }
        }

        const enlaceData = {
            nombre: formData.nombre || null,
            apellidoP: formData.apellidoPaterno || null,
            apellidoM: formData.apellidoMaterno || null,
            correo: formData.correo || null,
            telefono: formData.telefono || null,
            estatus: 1,  // Valor fijo
            adscripcion_id: selectedDepartamento || null,  // Puede ser null si no está definido
            cargo_id: selectedCargo || null,  // Asegúrate de que no sea undefined
            auth_user_id: userId || null,  // Si userId es undefined, se envía como null
            tipoPersona_id: 1,  // Valor fijo, asegúrate de que 1 es el valor correcto
            direccion_id: selectedDireccion || null,  // Verifica que selectedDireccion no sea undefined
            dependencia_id: selectedDependencia || null  // Verifica que selectedDependencia no sea undefined
        };

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URI}enlaces`, enlaceData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status !== 201) {
                message.error('Hubo un error al agregar el enlace');
                throw new Error('Error al agregar el enlace');
            }

            message.success('Enlace agregado exitosamente');
            navigate('/enlaces');
        } catch (error) {
            if (error.response && error.response.status === 435) {
                message.error('Ya hay un enlace para esta dependencia');
            } else {
                console.error('Error al agregar el enlace:', error);
                message.error('Hubo un error al agregar el enlace');
            }
        }
    };



    const handleCancel = () => {
        navigate('/enlaces');
    };

    if (loading) {
        return (
            <LoadingSpinner/>
        );
    }

    return (
        <Form layout="vertical" onFinish={handleSubmit}>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="Dependencia">
                        <Select
                            value={selectedDependencia}
                            onChange={handleDependenciaChange}
                            options={dependenciaOptions}
                            placeholder="Seleccione una dependencia"
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Dirección">
                        <Select
                            value={selectedDireccion}
                            onChange={handleDireccionChange}
                            options={direccionOptions}
                            placeholder="Seleccione una dirección"
                            disabled={!selectedDependencia}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="Departamento">
                        <Select
                            value={selectedDepartamento}
                            onChange={handleDepartamentoChange}
                            options={departamentoOptions}
                            placeholder="Seleccione un departamento"
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
                        <Select
                            value={selectedCargo}
                            onChange={handleCargoChange}
                            options={cargoOptions}
                            placeholder="Seleccione un cargo"
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
