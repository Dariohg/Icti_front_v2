import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, DatePicker, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import Dropdown from '../components/Dropdown';
import axios from 'axios';
import Cookies from 'js-cookie'; // Importar js-cookie para manejar cookies

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

    const token = Cookies.get('token'); // Obtener el token desde las cookies

    useEffect(() => {
        fetchClientes();
        fetchTipoContratos();
        fetchTipoInstalacion(); // Cargar las opciones de tipo de instalación
    }, []);

    const fetchClientes = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}enlaces/estatus/1`, {
                headers: {
                    Authorization: `Bearer ${token}` // Agregar el token en los headers
                }
            });
            const clientes = response.data.enlaces;
            const clientesMapped = clientes.map(cliente => ({
                value: cliente.id,
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
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}contratos/tipos-contrato`, {
                headers: {
                    Authorization: `Bearer ${token}` // Agregar el token en los headers
                }
            });
            const tiposContrato = response.data.tipoContrato;
            const tiposContratoMapped = tiposContrato.map(tipo => ({
                value: tipo.id,
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
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}contratos/versiones/${tipoContratoId}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Agregar el token en los headers
                }
            });
            const versiones = response.data.versiones;
            const versionesMapped = versiones.map(version => ({
                value: version.id,
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
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}contratos/tipos-instalacion`, {
                headers: {
                    Authorization: `Bearer ${token}` // Agregar el token en los headers
                }
            });
            const tipoInstalacion = response.data.tipoInstalacion;
            const tipoInstalacionMapped = tipoInstalacion.map(instalacion => ({
                value: instalacion.id,
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
                    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URI}contratos`, dataToSave, {
                        headers: {
                            Authorization: `Bearer ${token}` // Agregar el token en los headers
                        }
                    });
                    if (response.status !== 201) {
                        message.error('Error al crear el contrato');
                        throw new Error('Error al crear el contrato');
                    } else {
                        message.success('Contrato creado correctamente');
                        navigate('/contratos');
                    }
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
