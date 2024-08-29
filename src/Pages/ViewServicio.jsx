import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, Select, DatePicker, TimePicker, Radio, message } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import LoadingSpinner from "../components/LoadingSpinner";

const { TextArea } = Input;

const ViewServicio = () => {
    const { id } = useParams();
    const [diagnosticoTipo, setDiagnosticoTipo] = useState(null);
    const [servicioTipo, setServicioTipo] = useState(null);
    const [estadoServicio, setEstadoServicio] = useState(null);
    const [dependenciaOptions, setDependenciaOptions] = useState([]);
    const [direccionOptions, setDireccionOptions] = useState([]);
    const [cargoOptions, setCargoOptions] = useState([]);
    const [tipoDiagnosticoOptions, setTipoDiagnosticoOptions] = useState([]);
    const [tipoServicioOptions, setTipoServicioOptions] = useState([]);
    const [estadoServicioOptions, setEstadoServicioOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchServicio = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}servicios/detallados/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const servicio = response.data.servicio;
                form.setFieldsValue({
                    solicitante: servicio.nombreSolicitante,
                    receptor: servicio.nombreReceptor,
                    fechaInicio: moment(servicio.fechaInicio),
                    fechaTermino: moment(servicio.fechaTermino),
                    horaInicio: moment(servicio.horaInicio, 'HH:mm:ss'),
                    horaTermino: moment(servicio.horaTermino, 'HH:mm:ss'),
                    descripcionFalla: servicio.descripcionFalla,
                    actividadRealizada: servicio.descripccionActividad,
                    nivel: servicio.nivel,
                    observaciones: servicio.observaciones,
                    envio: servicio.tipoEnvio,
                    tipoDiagnostico: servicio.tipoServicio,
                    tipoServicio: servicio.tipoActividad,
                    estadoServicio: servicio.estadoServicio,
                    direccion: servicio.direccion,
                    cargo: servicio.cargo,
                    dependencia: servicio.dependencia,
                });
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener el servicio:', error);
                message.error('Error al cargar el servicio. Por favor, inténtelo de nuevo.');
                setLoading(false);
            }
        };

        fetchServicio();
        getDependencias();
        getCargos();
        getTipoDiagnostico();
        getTipoServicio();
        getEstadoServicio();
    }, [id, form, token]);

    const getTipoDiagnostico = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}servicios/tipos/servicio`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTipoDiagnosticoOptions(response.data.tipos);
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
            setTipoServicioOptions(response.data.tipos);
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
            setEstadoServicioOptions(response.data.estados);
        } catch (error) {
            console.error("Error al obtener los estados de servicio:", error);
        }
    };

    const getDependencias = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}dependencias/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const dependencias = response.data.dependencias.map(dep => ({
                value: dep.id,
                label: dep.nombre
            }));
            setDependenciaOptions(dependencias);
        } catch (error) {
            console.error("Error al obtener dependencias:", error);
        }
    };

    const getCargos = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}cargos/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const cargos = response.data.cargos.map(cargo => ({
                value: cargo.id,
                label: cargo.nombre
            }));
            setCargoOptions(cargos);
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
            const direcciones = response.data.direcciones.map(dir => ({
                value: dir.id,
                label: dir.nombre
            }));
            setDireccionOptions(direcciones);
        } catch (error) {
            console.error("Error al obtener las direcciones:", error);
        }
    };

    const onDependenciaChange = (value) => {
        getDirecciones(value);
    };

    const handleUpdate = async (values) => {
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
            fotos: 1,
            observaciones: values.observaciones || '',
            tipoEnvio: values.envio,
            estatus: 1,
            tipoServicioId: tipoDiagnosticoOptions.find(option => option.nombre === values.tipoDiagnostico)?.id,
            tipoActividadId: tipoServicioOptions.find(option => option.nombre === values.tipoServicio)?.id,
            estadoServicioId: estadoServicioOptions.find(option => option.nombre === values.estadoServicio)?.id,
            direccionId: values.direccion,
            cargoId: values.cargo,
        };

        try {
            await axios.patch(`${process.env.REACT_APP_BACKEND_URI}servicios/detallados/${id}`, formattedValues, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            message.success('Servicio actualizado exitosamente');
            setEditMode(false);
        } catch (error) {
            console.error('Error al actualizar el servicio:', error);
            message.error('Error al actualizar el servicio. Por favor, inténtelo de nuevo.');
        }
    };

    const handleCancel = () => {
        navigate('/servicios');
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdate}
        >
            <h2>Reporte de Servicio</h2>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="solicitante"
                        label="Solicitante"
                        rules={[{ required: true, message: 'Por favor ingresa el nombre del solicitante' }]}
                    >
                        <Input disabled={!editMode} />
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
                            disabled={!editMode}
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
                            disabled={!editMode}
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
                            disabled={!editMode}
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
                        <DatePicker style={{ width: '100%' }} disabled={!editMode} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Fecha de Término"
                        name="fechaTermino"
                        rules={[{ required: true, message: 'Por favor, seleccione una fecha de término' }]}
                    >
                        <DatePicker style={{ width: '100%' }} disabled={!editMode} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="horaInicio"
                        label="Hora de Inicio"
                        rules={[{ required: true, message: 'Por favor selecciona la hora de inicio' }]}
                    >
                        <TimePicker style={{ width: '100%' }} format="HH:mm" disabled={!editMode} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="horaTermino"
                        label="Hora de Término"
                        rules={[{ required: true, message: 'Por favor selecciona la hora de término' }]}
                    >
                        <TimePicker style={{ width: '100%' }} format="HH:mm" disabled={!editMode} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="envio"
                        label="Envío"
                        rules={[{ required: true, message: 'Por favor ingresa el método de envío' }]}
                    >
                        <Input placeholder="Método de envío" disabled={!editMode} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="nivel"
                        label="Nivel"
                        rules={[{ required: true, message: 'Por favor ingresa el nivel' }]}
                    >
                        <Input placeholder="Nivel de servicio" disabled={!editMode} />
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
                        <Radio.Group disabled={!editMode} className="radio-grid">
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
                        <TextArea rows={4} placeholder="Descripción detallada de la falla o problema" disabled={!editMode} />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="tipoServicio"
                        label="Tipo de Servicio"
                        rules={[{ required: true, message: 'Por favor selecciona un tipo de servicio' }]}
                    >
                        <Radio.Group disabled={!editMode} className="radio-grid">
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
                        <TextArea rows={4} placeholder="Descripción detallada de la actividad realizada" disabled={!editMode} />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="estadoServicio"
                        label="Estado de Servicio"
                        rules={[{ required: true, message: 'Por favor selecciona un estado de servicio' }]}
                    >
                        <Radio.Group disabled={!editMode} className="radio-grid">
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
                        <TextArea rows={4} placeholder="Descripción detallada de las observaciones" disabled={!editMode} />
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
                        <Input placeholder="Nombre del receptor" disabled={!editMode} />
                    </Form.Item>
                </Col>
                <Col span={12} style={{ display: 'flex', marginTop: "30px", justifyContent: 'space-between' }}>
                    <Form.Item shouldUpdate style={{ width: '50%', marginRight: '8px' }}>
                        <Button type="primary" onClick={() => setEditMode(!editMode)} style={{ width: '100%' }}>
                            {editMode ? 'Guardar' : 'Actualizar'}
                        </Button>
                    </Form.Item>
                    <Button danger type="text" onClick={handleCancel} style={{ width: '50%' }}>
                        Cancelar
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default ViewServicio;
