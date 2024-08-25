import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, Select, DatePicker, TimePicker, Radio } from 'antd';
import axios from 'axios';
import moment from 'moment';
import '../Styles/addServicios.css';  // Importar estilos personalizados

const { Option } = Select;
const { TextArea } = Input;

const AddServicios = () => {
    const [diagnosticoTipo, setDiagnosticoTipo] = useState(null);
    const [servicioTipo, setServicioTipo] = useState(null);
    const [estadoServicio, setEstadoServicio] = useState(null);
    const [dependenciaOptions, setDependenciaOptions] = useState([]);
    const [direccionOptions, setDireccionOptions] = useState([]);
    const [cargoOptions, setCargoOptions] = useState([]);
    const [token, setToken] = useState("tu_token_aqui");  // Suponiendo que el token ya está disponible

    useEffect(() => {
        getDependencias();
        getCargos();
    }, []);

    // Opciones para los selects de Diagnóstico, Tipo de Servicio, y Estado de Servicio
    const diagnosticoOptions = [
        'Asesoría',
        'Auditoría',
        'Mantenimiento Físico',
        'Infraestructura',
        'Servicios Digitales',
        'Mantenimiento de Paneles',
        'Supervisión a Infraestructura',
    ];

    const servicioOptions = ['Instalación', 'Configuración'];

    const estadoOptions = ['Concluido', 'En seguimiento'];

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

    const onDependenciaChange = (value) => {
        getDirecciones(value);
    };

    const onFinish = (values) => {
        const formattedValues = {
            ...values,
            horaInicio: values.horaInicio.format('HH:mm'),
            horaTermino: values.horaTermino.format('HH:mm'),
        };
        console.log('Formulario enviado: ', formattedValues);
    };

    return (
        <Form
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
                            {diagnosticoOptions.map((option) => (
                                <Radio value={option} key={option} className="radio-with-label">
                                    {option}
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
                            {servicioOptions.map((option) => (
                                <Radio value={option} key={option} className="radio-with-label">
                                    {option}
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
                            {estadoOptions.map((option) => (
                                <Radio value={option} key={option} className="radio-with-label">
                                    {option}
                                </Radio>
                            ))}
                        </Radio.Group>
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Enviar
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AddServicios;
