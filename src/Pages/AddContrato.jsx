import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, DatePicker } from 'antd';
import { useNavigate } from 'react-router-dom';
import Dropdown from '../components/Dropdown'; // Importa tu componente Dropdown

const { TextArea } = Input;

const AddContrato = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [cliente, setCliente] = useState(null);
    const [tipoContrato, setTipoContrato] = useState(null);
    const [versionContrato, setVersionContrato] = useState(null);
    const [tipoInstalacion, setTipoInstalacion] = useState([]);

    const handleSave = () => {
        form.validateFields()
            .then(values => {
                const dataToSave = {
                    ...values,
                    cliente,
                    tipoContrato,
                    versionContrato,
                    tipoInstalacion,
                };
                console.log('Datos guardados:', dataToSave);
                // Aquí puedes agregar la lógica para guardar los datos en el backend
                navigate('/listarContratos'); // Redirigir a la lista de contratos después de guardar
            })
            .catch(info => {
                console.log('Validación fallida:', info);
            });
    };

    const handleCancel = () => {
        navigate('/listarContratos'); // Redirigir a la lista de contratos al cancelar
    };

    const clienteOptions = [
        { value: 'cliente1', label: 'Cliente 1' },
        { value: 'cliente2', label: 'Cliente 2' },
        { value: 'cliente3', label: 'Cliente 3' },
    ];

    const tipoContratoOptions = [
        { value: 'contrato1', label: 'Tipo de Contrato 1' },
        { value: 'contrato2', label: 'Tipo de Contrato 2' },
        { value: 'contrato3', label: 'Tipo de Contrato 3' },
    ];

    const versionContratoOptions = [
        { value: 'v1', label: 'Versión 1' },
        { value: 'v2', label: 'Versión 2' },
        { value: 'v3', label: 'Versión 3' },
    ];

    const tipoInstalacionOptions = [
        { value: 'instalacion1', label: 'Instalación 1' },
        { value: 'instalacion2', label: 'Instalación 2' },
        { value: 'instalacion3', label: 'Instalación 3' },
    ];

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
                            onChange={setTipoContrato}
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
