import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, DatePicker, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import Dropdown from '../components/Dropdown';
import axios from 'axios';

const { TextArea } = Input;

const AddContrato = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [clienteOptions, setClienteOptions] = useState([]);
    const [tipoContratoOptions, setTipoContratoOptions] = useState([]);
    const [versionContratoOptions, setVersionContratoOptions] = useState([]);
    const [tipoInstalacionOptions, setTipoInstalacionOptions] = useState([]);

    const [cliente, setCliente] = useState(null);
    const [tipoContrato, setTipoContrato] = useState(null);
    const [versionContrato, setVersionContrato] = useState(null);
    const [tipoInstalacion, setTipoInstalacion] = useState(null);

    useEffect(() => {
        fetchClientes();
        fetchTipoContratos();
        fetchTipoInstalacion(); // Cargar las opciones de tipo de instalación
    }, []);

    const fetchClientes = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}enlace/status?estatus=1`);
            const clientesMapped = response.data.map(cliente => ({
                value: cliente.idPersona,
                label: `${cliente.nombre} ${cliente.apellidoP} ${cliente.apellidoM}`
            }));
            setClienteOptions(clientesMapped);
        } catch (error) {
            console.error('Error al obtener los clientes:', error);
            message.error('Hubo un error al obtener los clientes');
        }
    };

    const fetchTipoContratos = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}tipoContrato/`);
            const tiposContratoMapped = response.data.map(tipo => ({
                value: tipo.idTipoContrato,
                label: tipo.nombre
            }));
            setTipoContratoOptions(tiposContratoMapped);
        } catch (error) {
            console.error('Error al obtener los tipos de contrato:', error);
            message.error('Hubo un error al obtener los tipos de contrato');
        }
    };

    const fetchVersionesContrato = async (tipoContratoId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}versionContrato/tipoContrato/${tipoContratoId}`);
            const versionesMapped = response.data.map(version => ({
                value: version.id_version,
                label: version.descripcion
            }));
            setVersionContratoOptions(versionesMapped);
        } catch (error) {
            console.error('Error al obtener las versiones de contrato:', error);
            message.error('Hubo un error al obtener las versiones de contrato');
        }
    };

    const fetchTipoInstalacion = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}tipoInstalacion/`);
            const tipoInstalacionMapped = response.data.map(instalacion => ({
                value: instalacion.id_tipoInstalacion,
                label: instalacion.nombre
            }));
            setTipoInstalacionOptions(tipoInstalacionMapped);
        } catch (error) {
            console.error('Error al obtener los tipos de instalación:', error);
            message.error('Hubo un error al obtener los tipos de instalación');
        }
    };

    const handleTipoContratoChange = (selectedValue) => {
        setTipoContrato(selectedValue);
        fetchVersionesContrato(selectedValue); // Obtener las versiones de contrato cuando se selecciona un tipo de contrato
    };

    const handleSave = () => {
        form.validateFields()
            .then(async (values) => {
                const dataToSave = {
                    persona_id: cliente,
                    estatus: 1, // Puedes ajustar este valor según sea necesario
                    descripcion: values.descripcion,
                    fechaContrato: values.fechaContrato.format('YYYY-MM-DD'), // Formateando la fecha correctamente
                    id_user: 1, // Ajusta el valor del usuario según sea necesario
                    id_versionContrato: versionContrato,
                    ubicacion: tipoInstalacion, // Ajusta la ubicación según corresponda
                    id_tipoContrato: tipoContrato,
                };

                try {
                    await axios.post(`${process.env.REACT_APP_BACKEND_URI}contrato/createContrato`, dataToSave);
                    message.success('Contrato creado correctamente');
                    navigate('/contratos');
                } catch (error) {
                    console.error('Error al crear el contrato:', error);
                    message.error('Hubo un error al crear el contrato');
                }
            })
            .catch(info => {
                console.log('Validación fallida:', info);
            });
    };


    const handleCancel = () => {
        navigate('/listarContratos');
    };

    return (
        <Form
            form={form}
            layout="vertical"
            style={{ padding: '24px' }}
        >
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item
                        label="Cliente"
                        name="cliente"
                        rules={[{ required: true, message: 'Por favor, seleccione un cliente' }]}
                    >
                        <Dropdown
                            value={cliente}
                            onChange={setCliente}
                            options={clienteOptions}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Tipo de contrato"
                        name="tipoContrato"
                        rules={[{ required: true, message: 'Por favor, seleccione un tipo de contrato' }]}
                    >
                        <Dropdown
                            value={tipoContrato}
                            onChange={handleTipoContratoChange}
                            options={tipoContratoOptions}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item
                        label="Fecha de contrato"
                        name="fechaContrato"
                        rules={[{ required: true, message: 'Por favor, seleccione una fecha de contrato' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Versión de Contrato"
                        name="versionContrato"
                        rules={[{ required: true, message: 'Por favor, seleccione una versión de contrato' }]}
                    >
                        <Dropdown
                            value={versionContrato}
                            onChange={setVersionContrato}
                            options={versionContratoOptions}
                            disabled={!tipoContrato} // Desactivar si no se ha seleccionado un tipo de contrato
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item
                        label="Tipo de instalación"
                        name="tipoInstalacion"
                        rules={[{ required: true, message: 'Por favor, seleccione un tipo de instalación' }]}
                    >
                        <Dropdown
                            value={tipoInstalacion}
                            onChange={setTipoInstalacion}
                            options={tipoInstalacionOptions}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Descripción"
                        name="descripcion"
                        rules={[{ required: true, message: 'Por favor, ingrese una descripción' }]}
                    >
                        <TextArea rows={4} placeholder="Ingrese una descripción del contrato" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24} justify="end">
                <Col>
                    <Button onClick={handleCancel} style={{ marginRight: 8 }}>
                        Cancelar
                    </Button>
                    <Button type="primary" onClick={handleSave}>
                        Guardar
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default AddContrato;
