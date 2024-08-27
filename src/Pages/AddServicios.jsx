import React, { useState, useEffect } from 'react';
import {Form, Input, Button, Row, Col, Select, DatePicker, TimePicker, Radio, message, Spin} from 'antd';
import axios from 'axios';
import moment from 'moment';
import '../Styles/addServicios.css';
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";

const { Option } = Select;
const { TextArea } = Input;

const AddServicios = () => {
    const [enlaceOptions, setEnlaceOptions] = useState([]);
    const [contratoOptions, setContratoOptions] = useState([]);
    const [selectedEnlaceId, setSelectedEnlaceId] = useState(null);
    const [diagnosticoTipo, setDiagnosticoTipo] = useState(null);
    const [servicioTipo, setServicioTipo] = useState(null);
    const [estadoServicio, setEstadoServicio] = useState(null);
    const [dependenciaOptions, setDependenciaOptions] = useState([]);
    const [direccionOptions, setDireccionOptions] = useState([]);
    const [cargoOptions, setCargoOptions] = useState([]);
    const [tipoDiagnosticoOptions, setTipoDiagnosticoOptions] = useState([]);
    const [tipoServicioOptions, setTipoServicioOptions] = useState([]);
    const [estadoServicioOptions, setEstadoServicioOptions] = useState([]);
    const [form] = Form.useForm(); // Hook para manejar el formulario

    const [loading, setLoading] = useState(true);
    const token = Cookies.get('token'); // Obtener el token desde las cookies


    useEffect(() => {
        getEnlaces();
        getDependencias();
        getCargos();
        getTipoDiagnostico();
        getTipoServicio();
        getEstadoServicio();
    }, []);

    const navigate = useNavigate();

    const getEnlaces = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}enlaces/estatus/1`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const enlaces = response.data.enlaces;
            const enlacesMapped = enlaces.map(enlace => ({
                value: enlace.id,
                label: `${enlace.nombre} ${enlace.apellidoP} ${enlace.apellidoM}`
            }));
            setLoading(false);
            setEnlaceOptions(enlacesMapped);
        } catch (error) {
            console.error("Error al obtener los enlaces:", error);
        }
    };

    const getContratos = async (enlaceId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}contratos/detallados/enlaces/${enlaceId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const contratos = response.data.contrato;
            const contratosMapped = contratos.map(contrato => ({
                value: contrato.id,
                label: contrato.descripcion
            }));
            setContratoOptions(contratosMapped);
        } catch (error) {
            console.error("Error al obtener los contratos:", error);
        }
    };

    const handleEnlaceChange = (value) => {
        setSelectedEnlaceId(value);
        setContratoOptions([]); // Limpiar opciones de contrato
        form.resetFields(['contrato']); // Reiniciar el campo de contrato en el formulario
        getContratos(value); // Cargar nuevos contratos
    };

    const getTipoDiagnostico = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}servicios/tipos/servicio`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const tipos = response.data.tipos;
            setTipoDiagnosticoOptions(tipos);
        } catch (error) {
            console.error("Error al obtener los tipos de diagnóstico:", error);
        }
    };

    const getTipoServicio = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}servicios/tipos/actividad`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const tipos = response.data.tipos;
            setTipoServicioOptions(tipos);
        } catch (error) {
            console.error("Error al obtener los tipos de servicio:", error);
        }
    };

    const getEstadoServicio = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}servicios/tipos/estados-servicio`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const estados = response.data.estados;
            setEstadoServicioOptions(estados);
        } catch (error) {
            console.error("Error al obtener los estados de servicio:", error);
        }
    };

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

    const onDependenciaChange = (value) => {
        getDirecciones(value);
    };

    const onFinish = async (values) => {
        const formattedValues = {
            nombreSolicitante: values.solicitante,
            nombreReceptor: values.receptor,
            fechaInicio: values.fechaInicio.format('YYYY-MM-DD'),
            fechaTermino: values.fechaTermino.format('YYYY-MM-DD'),
            horaInicio: values.horaInicio.format('HH:mm:ss'),
            horaTermino: values.horaTermino.format('HH:mm:ss'),
            descripcionFalla: values.descripcionFalla,
            descripccionActividad: values.actividadRealizada,
            nivel: values.nivel,
            fotos: 1, // Siempre 1
            observaciones: values.observaciones || '',
            tipoEnvio: values.envio,
            estatus: 1, // Siempre 1
            tipoServicioId: tipoServicioOptions.find(option => option.nombre === values.tipoServicio)?.id,
            contratoId: values.contrato,
            tipoActividadId: tipoDiagnosticoOptions.find(option => option.nombre === values.tipoDiagnostico)?.id,
            estadoServicioId: estadoServicioOptions.find(option => option.nombre === values.estadoServicio)?.id,
            direccionId: values.direccion,
            cargoId: values.cargo,
        };

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URI}servicios`, formattedValues, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            message.success('Servicio guardado exitosamente');
            navigate('/servicios');

        } catch (error) {
            console.error('Error al enviar el formulario:', error);
        }
    };
    const handleCancel = () => {
        navigate('/servicios');
    };
    if (loading) {
        return (
            <div className="spin-container">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <Form
            form={form} // Usar el hook del formulario
            name="add_servicios"
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
                fechaInicio: moment(),
                horaInicio: moment(),
                fechaTermino: moment(),
                horaTermino: moment(),
            }}
        >
            <h2>Reporte de Servicio</h2>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="enlace"
                        label="Nombre del Enlace"
                        rules={[{ required: true, message: 'Por favor selecciona un enlace' }]}
                    >
                        <Select
                            placeholder="Selecciona un enlace"
                            showSearch
                            onChange={handleEnlaceChange}
                            options={enlaceOptions}
                            filterOption={(input, option) =>
                                option.label.toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="contrato"
                        label="Contrato"
                        rules={[{ required: true, message: 'Por favor selecciona un contrato' }]}
                    >
                        <Select
                            placeholder="Selecciona un contrato"
                            showSearch
                            options={contratoOptions}
                            filterOption={(input, option) =>
                                option.label.toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="solicitante"
                        label="Solicitante"
                        rules={[{ required: true, message: 'Por favor ingresa el nombre del solicitante' }]}
                    >
                        <Input placeholder="Nombre del solicitante" />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item
                        name="dependencia"
                        label="Dependencia"
                        rules={[{ required: true, message: 'Por favor selecciona una dependencia' }]}
                    >
                        <Select
                            placeholder="Selecciona una dependencia"
                            showSearch
                            onChange={onDependenciaChange}
                            options={dependenciaOptions}
                            filterOption={(input, option) =>
                                option.label.toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="direccion"
                        label="Direccion"
                        rules={[{ required: true, message: 'Por favor selecciona una direccion' }]}
                    >
                        <Select
                            placeholder="Selecciona una direccion"
                            showSearch
                            options={direccionOptions}
                            filterOption={(input, option) =>
                                option.label.toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="cargo"
                        label="Cargo"
                        rules={[{ required: true, message: 'Por favor selecciona un cargo' }]}
                    >
                        <Select
                            placeholder="Selecciona un cargo"
                            showSearch
                            options={cargoOptions}
                            filterOption={(input, option) =>
                                option.label.toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="fechaInicio"
                        label="Fecha de Inicio"
                        rules={[{ required: true, message: 'Por favor selecciona la fecha de inicio' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Fecha de Término"
                        name="fechaTermino"
                        rules={[{ required: true, message: 'Por favor, seleccione una fecha de término' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="horaInicio"
                        label="Hora de Inicio"
                        rules={[{ required: true, message: 'Por favor selecciona la hora de inicio' }]}
                    >
                        <TimePicker style={{ width: '100%' }} format="HH:mm" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="horaTermino"
                        label="Hora de Término"
                        rules={[{ required: true, message: 'Por favor selecciona la hora de término' }]}
                    >
                        <TimePicker style={{ width: '100%' }} format="HH:mm" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="envio"
                        label="Envío"
                        rules={[{ required: true, message: 'Por favor ingresa el método de envío' }]}
                    >
                        <Input placeholder="Método de envío" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="nivel"
                        label="Nivel"
                        rules={[{ required: true, message: 'Por favor ingresa el nivel' }]}
                    >
                        <Input placeholder="Nivel de servicio" />
                    </Form.Item>
                </Col>
            </Row>

            <h2>Diagnóstico</h2>
            <Row>
                <Col span={24}>
                    <Form.Item
                        name="tipoDiagnostico"
                        label="Tipo de Diagnóstico"
                        rules={[{ required: true, message: 'Por favor selecciona un tipo de diagnóstico' }]}
                    >
                        <Radio.Group onChange={(e) => setDiagnosticoTipo(e.target.value)} className="radio-grid">
                            {tipoDiagnosticoOptions.map((option) => (
                                <Radio value={option.nombre} key={option.id} className="radio-with-label">
                                    {option.nombre}
                                </Radio>
                            ))}
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="descripcionFalla"
                        label="Descripción de la Falla o Problema"
                        rules={[{ required: true, message: 'Por favor describe la falla o problema' }]}
                    >
                        <TextArea rows={4} placeholder="Descripción detallada de la falla o problema" />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="tipoServicio"
                        label="Tipo de Servicio"
                        rules={[{ required: true, message: 'Por favor selecciona un tipo de servicio' }]}
                    >
                        <Radio.Group onChange={(e) => setServicioTipo(e.target.value)} className="radio-grid">
                            {tipoServicioOptions.map((option) => (
                                <Radio value={option.nombre} key={option.id} className="radio-with-label">
                                    {option.nombre}
                                </Radio>
                            ))}
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="actividadRealizada"
                        label="Descripción de la Actividad Realizada"
                        rules={[{ required: true, message: 'Por favor describe la actividad realizada' }]}
                    >
                        <TextArea rows={4} placeholder="Descripción detallada de la actividad realizada" />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="estadoServicio"
                        label="Estado de Servicio"
                        rules={[{ required: true, message: 'Por favor selecciona un estado de servicio' }]}
                    >
                        <Radio.Group onChange={(e) => setEstadoServicio(e.target.value)} className="radio-grid">
                            {estadoServicioOptions.map((option) => (
                                <Radio value={option.nombre} key={option.id} className="radio-with-label">
                                    {option.nombre}
                                </Radio>
                            ))}
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="observaciones"
                        label="Observaciones del servicio"
                        rules={[{ required: true, message: 'Por favor ponga una descripción' }]}
                    >
                        <TextArea rows={4} placeholder="Descripción detallada de las observaciones" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="receptor"
                        label="Receptor"
                        rules={[{ required: true, message: 'Por favor ingresa el nombre del receptor' }]}
                    >
                        <Input placeholder="Nombre del receptor" />
                    </Form.Item>
                </Col>
                <Col span={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Button type="primary" style={{ flex: 1, marginRight: 8 }} htmlType="submit">
                        Agregar Contrato
                    </Button>
                    <Button danger type="text" onClick={handleCancel} style={{ flex: 1 }}>
                        Cancelar
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default AddServicios;
