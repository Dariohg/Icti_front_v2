import React from 'react';
import { Drawer, Form, Button, Col, Row, Input } from 'antd';

const EditUserDrawer = ({ visible, onClose, usuario, onSave }) => {
    const [form] = Form.useForm();

    const handleSave = () => {
        form.validateFields().then(values => {
            onSave({ ...usuario, ...values });
            onClose();
        });
    };

    return (
        <Drawer
            title="Editar Usuario"
            width={400}
            onClose={onClose}
            visible={visible}
            bodyStyle={{ paddingBottom: 80 }}
            footer={
                <div
                    style={{
                        textAlign: 'right',
                    }}
                >
                    <Button onClick={onClose} style={{ marginRight: 8 }}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} type="primary">
                        Guardar
                    </Button>
                </div>
            }
        >
            <Form layout="vertical" form={form} initialValues={usuario}>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="nombre"
                            label="Nombre"
                            rules={[{ required: true, message: 'Por favor ingresa el nombre del usuario' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="correo"
                            label="Correo Electrónico"
                            rules={[{ required: true, message: 'Por favor ingresa el correo del usuario' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="telefono"
                            label="Teléfono"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="dependencia"
                            label="Dependencia"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="direccion"
                            label="Dirección"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="departamento"
                            label="Departamento"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="cargo"
                            label="Cargo"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="nombreUsuario"
                            label="Nombre de Usuario"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="contraseña"
                            label="Contraseña"
                        >
                            <Input.Password />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Drawer>
    );
};

export default EditUserDrawer;
