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
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const token = Cookies.get('token');

    const [editMode, setEditMode] = useState(false); // Estado para controlar el modo de edición

    const [servicioData, setServicioData] = useState({
        solicitante: '',
        receptor: '',
        fechaInicio: null,
        fechaTermino: null,
        horaInicio: null,
        horaTermino: null,
        descripcionFalla: '',
        actividadRealizada: '',
        nivel: '',
        observaciones: '',
        envio: '',
        tipoDiagnostico: null,
        tipoServicio: null,
        estadoServicio: null,
        dependencia: null,
        direccion: null,
        cargo: null,
    });

    const [dependenciaOptions, setDependenciaOptions] = useState([]);
    const [direccionOptions, setDireccionOptions] = useState([]);
    const [cargoOptions, setCargoOptions] = useState([]);
    const [tipoDiagnosticoOptions, setTipoDiagnosticoOptions] = useState([]);
    const [tipoServicioOptions, setTipoServicioOptions] = useState([]);
    const [estadoServicioOptions, setEstadoServicioOptions] = useState([]);

    const [form] = Form.useForm();

    useEffect(() => {
        const fetchServicio = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}servicios/detallados/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const servicio = response.data.servicio;

                setServicioData({
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
                    dependencia: servicio.dependencia,
                    direccion: servicio.direccion,
                    cargo: servicio.cargo,
                });

                // Cargar las opciones de dropdowns
                await loadDropdownOptions(servicio.dependenciaId);

                setLoading(false);
            } catch (error) {
                console.error('Error al obtener el servicio:', error);
                message.error('Error al cargar el servicio. Por favor, inténtelo de nuevo.');
                setLoading(false);
            }
        };

        fetchServicio();
        getTipoDiagnostico();
        getTipoServicio();
        getEstadoServicio();
    }, [id, token]);

    const loadDropdownOptions = async (dependenciaId) => {
        try {
            const [dependenciasRes, cargosRes] = await Promise.all([
                axios.get(`${process.env.REACT_APP_BACKEND_URI}dependencias`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${process.env.REACT_APP_BACKEND_URI}cargos`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            setDependenciaOptions(dependenciasRes.data.dependencias);
            setCargoOptions(cargosRes.data.cargos);

            if (dependenciaId) {
                const direccionesRes = await axios.get(`${process.env.REACT_APP_BACKEND_URI}direcciones/dependencias/${dependenciaId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDireccionOptions(direccionesRes.data.direcciones);
            }
        } catch (error) {
            console.error('Error al cargar las opciones de dropdown:', error);
        }
    };

    const getTipoDiagnostico = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}servicios/tipos/servicio`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTipoDiagnosticoOptions(response.data.tipos);
        } catch (error) {
            console.error("Error al obtener los tipos de diagnóstico:", error);
        }
    };

    const getTipoServicio = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}servicios/tipos/actividad`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTipoServicioOptions(response.data.tipos);
        } catch (error) {
            console.error("Error al obtener los tipos de servicio:", error);
        }
    };

    const getEstadoServicio = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}servicios/tipos/estados-servicio`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEstadoServicioOptions(response.data.estados);
        } catch (error) {
            console.error("Error al obtener los estados de servicio:", error);
        }
    };

    const handleDependenciaChange = async (value) => {
        setServicioData(prevState => ({
            ...prevState,
            dependencia: value,
            direccion: null,
        }));

        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}direcciones/dependencias/${value}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDireccionOptions(response.data.direcciones);
        } catch (error) {
            console.error('Error al obtener las direcciones:', error);
        }
    };

    const handleDireccionChange = (value) => {
        setServicioData(prevState => ({
            ...prevState,
            direccion: value,  // value debería ser el ID de la dirección
        }));
    };

    const handleCargoChange = (value) => {
        setServicioData(prevState => ({
            ...prevState,
            cargo: value,  // value debería ser el ID del cargo
        }));
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
            fotos: 0,
            observaciones: values.observaciones || '',
            tipoEnvio: values.envio,
            tipoServicioId: tipoDiagnosticoOptions.find(option => option.nombre === values.tipoDiagnostico)?.id,
            tipoActividadId: tipoServicioOptions.find(option => option.nombre === values.tipoServicio)?.id,
            estadoServicioId: estadoServicioOptions.find(option => option.nombre === values.estadoServicio)?.id,
            direccionId: Number(servicioData.direccion),  // Convertir a número
            cargoId: Number(servicioData.cargo),          // Convertir a número
        };
        console.log(formattedValues);  // Verifica los valores aquí antes de enviarlos

        try {
            await axios.patch(`${process.env.REACT_APP_BACKEND_URI}servicios/${id}`, formattedValues, {
                headers: { Authorization: `Bearer ${token}` }
            });
            message.success('Servicio actualizado exitosamente');
            setEditMode(false);
        } catch (error) {
            console.error('Error al actualizar el servicio:', error.response ? error.response.data : error.message);
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
            initialValues={{
                ...servicioData,
                fechaInicio: servicioData.fechaInicio,
                fechaTermino: servicioData.fechaTermino,
                horaInicio: servicioData.horaInicio,
                horaTermino: servicioData.horaTermino,
            }}
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
                            value={servicioData.dependencia}
                            onChange={handleDependenciaChange}
                            options={dependenciaOptions.map(dep => ({ value: dep.id, label: dep.nombre }))}
                            placeholder="Selecciona una dependencia"
                            disabled={!editMode}
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
                            value={servicioData.direccion}
                            onChange={(value) => setServicioData({ ...servicioData, direccion: value })}  // value es el ID
                            options={direccionOptions.map(dir => ({ value: dir.id, label: dir.nombre }))}
                            placeholder="Selecciona una dirección"
                            disabled={!servicioData.dependencia || !editMode}
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
                            value={servicioData.cargo}
                            onChange={(value) => setServicioData({ ...servicioData, cargo: value })}  // value es el ID
                            options={cargoOptions.map(cargo => ({ value: cargo.id, label: cargo.nombre }))}
                            showSearch
                            placeholder="Selecciona un cargo"
                            optionFilterProp="label"
                            filterOption={(input, option) =>
                                option.label.toLowerCase().includes(input.toLowerCase())
                            }
                            disabled={!editMode}
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
                        <Button
                            type="primary"
                            onClick={() => {
                                if (editMode) {
                                    form.submit(); // Invocar handleUpdate al enviar el formulario
                                } else {
                                    setEditMode(true);
                                }
                            }}
                            style={{ width: '100%' }}
                        >
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
