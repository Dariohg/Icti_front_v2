import React, { useState, useEffect } from 'react';
import {Form, Input, Button, Row, Col, DatePicker, message, Select, Typography, Divider, Spin, Popconfirm} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import {ArrowLeftOutlined, DeleteOutlined, ExclamationCircleOutlined} from '@ant-design/icons';
import axios from 'axios';
import Cookies from 'js-cookie';
import moment from 'moment';
import "../Styles/contrato.css"
import EnlaceInfo from '../components/EnlaceInfo';
import LoadingSpinner from "../components/LoadingSpinner";  // Importa el componente

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

const ViewContrato = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [form] = Form.useForm();

    const [isEditing, setIsEditing] = useState(false);
    const [tipoContratoOptions, setTipoContratoOptions] = useState([]);
    const [versionContratoOptions, setVersionContratoOptions] = useState([]);
    const [tipoInstalacionOptions, setTipoInstalacionOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [optionsLoaded, setOptionsLoaded] = useState(false);
    const [enlaceId, setEnlaceId] = useState(null);  // Estado para almacenar el ID del enlace asociado

    const token = Cookies.get('token');

    useEffect(() => {
        const loadData = async () => {
            await fetchTipoContratos();
            await fetchTipoInstalacion();
            setOptionsLoaded(true);
        };

        loadData();
    }, [id]);

    useEffect(() => {
        if (optionsLoaded) {
            fetchContrato();
        }
    }, [optionsLoaded]);

    const fetchContrato = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}contratos/detallados/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const contratoData = response.data.contrato;

            const tipoContrato = tipoContratoOptions.find(option => option.label === contratoData.tipoContrato);

            if (tipoContrato) {
                form.setFieldsValue({
                    cliente: `${contratoData.nombreEnlace} ${contratoData.apellidoPEnlace} ${contratoData.apellidoMEnlace}`,
                    tipoContrato: tipoContrato.value,
                    fechaContrato: moment(contratoData.fechaContrato),
                    versionContrato: contratoData.versionContrato,
                    tipoInstalacion: contratoData.ubicacion,
                    descripcion: contratoData.descripcion,
                });
                fetchVersionesContrato(tipoContrato.value);
                setEnlaceId(contratoData.enlaceId);  // Establecer el ID del enlace
            }

            setLoading(false);
        } catch (error) {
            console.error('Error al obtener el contrato:', error);
            message.error('Hubo un error al obtener el contrato');
        }
    };

    const fetchTipoContratos = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}contratos/tipos-contrato`, {
                headers: {
                    Authorization: `Bearer ${token}`
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
                    Authorization: `Bearer ${token}`
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
                    Authorization: `Bearer ${token}`
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
        form.setFieldsValue({ versionContrato: null });
        fetchVersionesContrato(selectedValue);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            const ubicacionSeleccionada = tipoInstalacionOptions.find(option => option.value === values.tipoInstalacion);
            const ubicacionId = ubicacionSeleccionada ? ubicacionSeleccionada.value : null;

            const dataToSave = {
                descripcion: values.descripcion,
                fechaContrato: values.fechaContrato.format('YYYY-MM-DD'),
                ubicacion: ubicacionId,
                id_tipoContrato: values.tipoContrato,
                id_versionContrato: values.versionContrato,
            };

            const response = await axios.patch(`${process.env.REACT_APP_BACKEND_URI}contratos/${id}`, dataToSave, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                message.success('Contrato actualizado correctamente');
                setIsEditing(false);
            } else {
                message.error('Error al actualizar el contrato');
            }
        } catch (error) {
            console.error('Error al actualizar el contrato:', error);
            if (error.response) {
                console.error('Detalles del error:', error.response.data);
            }
            message.error('Hubo un error al actualizar el contrato. Por favor, inténtalo de nuevo.');
        }
    };



    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URI}contratos/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Agregar el token en los headers
                },
                data: { estatus_id: 3 }
            });
            if (response.status === 200) {
                message.success('Contrato eliminado correctamente');
                navigate('/contratos');
            } else {
                message.error('Error al eliminar el contrato.');
                console.error('Error en la respuesta:', response);
            }
        } catch (error) {
            console.error('Error al eliminar el contrato:', error.response ? error.response.data : error.message);
            message.error('Hubo un error al eliminar el contrato.');
        }
    };


    const handleCancel = () => {
        if (isEditing) {
            setIsEditing(false);
            fetchContrato();
        } else {
            navigate('/contratos');
        }
    };

    if (loading) {
        return (
            <LoadingSpinner/>
        );
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px' }}>
                <Title level={3} style={{ margin: 0 }}>Detalles del contrato</Title>
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/contratos')}
                >
                    Volver
                </Button>
            </div>
            <Divider/>
            <Form
                form={form}
                layout="vertical"
                style={{ padding: '24px' }}
            >
                {/* Formulario de contrato aquí */}
                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item
                            label="Cliente"
                            name="cliente"
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Fecha de contrato"
                            name="fechaContrato"
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                disabled={!isEditing}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Tipo de contrato"
                            name="tipoContrato"
                        >
                            <Select
                                disabled={!isEditing}
                                onChange={handleTipoContratoChange}
                                options={tipoContratoOptions}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            label="Tipo de instalación"
                            name="tipoInstalacion"
                        >
                            <Select
                                disabled={!isEditing}
                                options={tipoInstalacionOptions}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Versión de Contrato"
                            name="versionContrato"
                        >
                            <Select
                                disabled={!isEditing}
                                options={versionContratoOptions}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Descripción"
                            name="descripcion"
                        >
                            <TextArea
                                rows={4}
                                disabled={!isEditing}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {!isEditing ? (
                            <>
                                <Button type="primary" onClick={() => setIsEditing(true)} style={{ flex: 1, marginRight: 8 }}>
                                    Actualizar
                                </Button>
                                <Button danger type="text" onClick={handleCancel} style={{ flex: 1 }}>
                                    Volver
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button type="primary" onClick={handleSave} style={{ flex: 1, marginRight: 8 }}>
                                    Guardar
                                </Button>
                                <Button danger type="text" onClick={handleCancel} style={{ flex: 1 }}>
                                    Cancelar
                                </Button>
                            </>
                        )}
                    </Col>
                </Row>
            </Form>
            <div style={{ padding: '24px' }}>
                {enlaceId && <EnlaceInfo enlaceId={enlaceId} />}
            </div>
            <div style={{ textAlign: 'center' }}>
                <Popconfirm
                    title="¿Estás seguro de que deseas eliminar este Contrato?"
                    icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                    onConfirm={handleDelete}
                    okText="Sí"
                    cancelText="No"
                    okButtonProps={{ danger: true }}
                >
                    <Button danger icon={<DeleteOutlined />}>
                        Eliminar Contrato
                    </Button>
                </Popconfirm>
            </div>
        </>
    );
};

export default ViewContrato;
