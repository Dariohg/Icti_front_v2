import React, { useEffect } from 'react';
import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker, Space, Popconfirm } from 'antd';
import { CloseOutlined, DeleteOutlined, CheckOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

const EditContractDrawer = ({ contrato, visible, onClose, onSave, onDelete }) => {
    const [form] = Form.useForm();

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

    const handleSave = () => {
        form.validateFields()
            .then(values => {
                const updatedValues = {
                    ...values,
                    fechaContrato: values.fechaContrato ? values.fechaContrato.format('YYYY-MM-DD') : null,
                };
                onSave({ ...contrato, ...updatedValues });
                form.resetFields();
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
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
                        onConfirm={onDelete}
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
                            rules={[{ required: true, message: 'Por favor ingresa el tipo de instalación' }]}
                        >
                            <Input placeholder="Tipo de instalación" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="tipoContrato"
                            label="Tipo de contrato"
                            rules={[{ required: true, message: 'Por favor ingresa el tipo de contrato' }]}
                        >
                            <Input placeholder="Tipo de contrato" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="versionContrato"
                            label="Versión del contrato"
                            rules={[{ required: true, message: 'Por favor ingresa la versión del contrato' }]}
                        >
                            <Input placeholder="Versión del contrato" />
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
