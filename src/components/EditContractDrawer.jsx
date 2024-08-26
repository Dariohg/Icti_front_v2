import React, { useEffect, useState } from 'react';
import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker, Space, Popconfirm, message } from 'antd';
import { CloseOutlined, DeleteOutlined, CheckOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import axios from 'axios';

const { Option } = Select;

const EditContractDrawer = ({ contrato, visible, onClose, onSave, onDelete }) => {
    const [form] = Form.useForm();
    const [tipoContratoOptions, setTipoContratoOptions] = useState([]);
    const [versionContratoOptions, setVersionContratoOptions] = useState([]);
    const [tipoInstalacionOptions, setTipoInstalacionOptions] = useState([]);

    useEffect(() => {
        if (visible && contrato) {
            form.setFieldsValue({
                fechaContrato: contrato.fechaContrato ? dayjs(contrato.fechaContrato) : null,
                tipoInstalacion: contrato.tipoInstalacion,
                tipoContrato: contrato.tipoContrato,
                versionContrato: contrato.versionContrato,
                estatus: contrato.estatus,
                descripcion: contrato.descripcion,
            });
        }
    }, [visible, contrato, form]);

    const fetchTipoContratos = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}contratos/tipos-contrato`);
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
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}contratos/versiones/${tipoContratoId}`);
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
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}contratos/tipos-instalacion`);
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

    useEffect(() => {
        if (visible) {
            fetchTipoContratos();
            fetchTipoInstalacion();
        }
    }, [visible]);

    const handleTipoContratoChange = (value) => {
        form.setFieldsValue({ versionContrato: null });
        fetchVersionesContrato(value);
    };

    const handlePatch = async (updatedFields) => {
        try {
            const response = await axios.patch(`${process.env.REACT_APP_BACKEND_URI}contratos/${contrato.key}`, updatedFields);
            message.success('Contrato actualizado exitosamente');
            onSave(response.data);
            form.resetFields();
            onClose();
        } catch (error) {
            console.error('Error al actualizar el contrato:', error);
            if (error.response) {
                console.error('Detalles del error:', error.response.data);
            }
            message.error('Error al actualizar el contrato. Por favor, inténtalo de nuevo.');
        }
    };

    const handleSave = () => {
        form.validateFields()
            .then(values => {
                const updatedFields = {};
                if (values.fechaContrato && dayjs(values.fechaContrato).format('YYYY-MM-DD') !== contrato.fechaContrato) {
                    updatedFields.fechaContrato = dayjs(values.fechaContrato).format('YYYY-MM-DD');
                }
                if (values.estatus && values.estatus !== contrato.estatus) {
                    updatedFields.estatus = values.estatus === 'Activo' ? 1 : 2;
                }
                if (values.descripcion && values.descripcion !== contrato.descripcion) {
                    updatedFields.descripcion = values.descripcion;
                }
                if (values.tipoInstalacion && values.tipoInstalacion !== contrato.tipoInstalacion) {
                    updatedFields.ubicacion = values.tipoInstalacion;
                }
                if (values.tipoContrato && values.tipoContrato !== contrato.tipoContrato) {
                    updatedFields.id_tipoContrato = values.tipoContrato;
                }
                if (values.versionContrato && values.versionContrato !== contrato.versionContrato) {
                    updatedFields.id_versionContrato = values.versionContrato;
                }

                handlePatch(updatedFields);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URI}contratos/${contrato.key}`);
            message.success('Contrato eliminado exitosamente');
            onDelete();
            form.resetFields();
            onClose();
        } catch (error) {
            console.error('Error al eliminar el contrato:', error);
            if (error.response) {
                console.error('Detalles del error:', error.response.data);
            }
            message.error('Error al eliminar el contrato. Por favor, inténtalo de nuevo.');
        }
    };

    const handleClose = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Drawer
            title="Editar contrato"
            width={600}
            onClose={handleClose}
            visible={visible}
            bodyStyle={{ paddingBottom: 80 }}
            extra={
                <Space>
                    <Button danger onClick={handleClose} icon={<CloseOutlined />}>Cancelar</Button>
                    <Button onClick={handleSave} type="primary" icon={<CheckOutlined />}>
                        Guardar
                    </Button>
                </Space>
            }
            footer={
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 24px' }}>
                    <Popconfirm
                        title="¿Estás seguro de que deseas eliminar este contrato?"
                        icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                        onConfirm={handleDelete}
                        okText="Sí"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                    >
                        <Button danger icon={<DeleteOutlined />} style={{ width: '225px' }}>
                            Eliminar contrato
                        </Button>
                    </Popconfirm>
                </div>
            }
            footerStyle={{ padding: 0 }}
        >
            <Form layout="vertical" form={form}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="fechaContrato"
                            label="Fecha de contrato"
                            rules={[{ required: true, message: 'Por favor selecciona la fecha del contrato' }]}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="tipoInstalacion"
                            label="Tipo de instalación"
                            rules={[{ required: true, message: 'Por favor selecciona el tipo de instalación' }]}
                        >
                            <Select
                                placeholder="Selecciona un tipo de instalación"
                                options={tipoInstalacionOptions}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="tipoContrato"
                            label="Tipo de contrato"
                            rules={[{ required: true, message: 'Por favor selecciona el tipo de contrato' }]}
                        >
                            <Select
                                placeholder="Selecciona un tipo de contrato"
                                options={tipoContratoOptions}
                                onChange={handleTipoContratoChange}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="versionContrato"
                            label="Versión del contrato"
                            rules={[{ required: true, message: 'Por favor selecciona la versión del contrato' }]}
                        >
                            <Select
                                placeholder="Selecciona una versión de contrato"
                                options={versionContratoOptions}
                                disabled={!form.getFieldValue('tipoContrato')}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="estatus"
                            label="Estatus"
                            rules={[{ required: true, message: 'Por favor selecciona el estatus' }]}
                        >
                            <Select placeholder="Selecciona el estatus">
                                <Option value="Activo">Activo</Option>
                                <Option value="Inactivo">Inactivo</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="descripcion"
                            label="Descripción"
                            rules={[{ required: true, message: 'Por favor ingresa la descripción' }]}
                        >
                            <Input.TextArea rows={4} placeholder="Descripción del contrato" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Drawer>
    );
};

export default EditContractDrawer;
