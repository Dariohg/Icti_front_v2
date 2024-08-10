import React, { useState } from 'react';
import { Input, Button, Form, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import Dropdown from '../components/Dropdown';

const AddEnlace = () => {
    const [dependencia, setDependencia] = useState(null);
    const [direccion, setDireccion] = useState(null);
    const [departamento, setDepartamento] = useState(null);
    const [cargo, setCargo] = useState(null);
    const [nombre, setNombre] = useState('');
    const [apellidoPaterno, setApellidoPaterno] = useState('');
    const [apellidoMaterno, setApellidoMaterno] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');

    const navigate = useNavigate();

    const handleSubmit = () => {
        const enlaceData = {
            dependencia,
            direccion,
            departamento,
            nombre,
            apellidoPaterno,
            apellidoMaterno,
            correo,
            telefono,
            cargo,
        };
        console.log('Enlace Data:', enlaceData);
        // Aquí puedes agregar la lógica para enviar los datos al backend
    };

    const handleCancel = () => {
        navigate('/enlaces');
    };

    const dependenciaOptions = [
        { value: 'dependencia1', label: 'Dependencia 1' },
        { value: 'dependencia2', label: 'Dependencia 2' },
        { value: 'dependencia3', label: 'Dependencia 3' },
        // Agrega más opciones aquí
    ];

    const direccionOptions = [
        { value: 'direccion1', label: 'Dirección 1' },
        { value: 'direccion2', label: 'Dirección 2' },
        { value: 'direccion3', label: 'Dirección 3' },
        // Agrega más opciones aquí
    ];

    const departamentoOptions = [
        { value: 'departamento1', label: 'Departamento 1' },
        { value: 'departamento2', label: 'Departamento 2' },
        { value: 'departamento3', label: 'Departamento 3' },
        // Agrega más opciones aquí
    ];

    const cargoOptions = [
        { value: 'cargo1', label: 'Cargo 1' },
        { value: 'cargo2', label: 'Cargo 2' },
        { value: 'cargo3', label: 'Cargo 3' },
        // Agrega más opciones aquí
    ];

    return (
        <Form layout="vertical" onFinish={handleSubmit}>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="Dependencia">
                        <Dropdown
                            value={dependencia}
                            onChange={setDependencia}
                            options={dependenciaOptions}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Dirección">
                        <Dropdown
                            value={direccion}
                            onChange={setDireccion}
                            options={direccionOptions}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="Departamento">
                        <Dropdown
                            value={departamento}
                            onChange={setDepartamento}
                            options={departamentoOptions}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Nombre">
                        <Input value={nombre} onChange={(e) => setNombre(e.target.value)} />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="Apellido Paterno">
                        <Input value={apellidoPaterno} onChange={(e) => setApellidoPaterno(e.target.value)} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Apellido Materno">
                        <Input value={apellidoMaterno} onChange={(e) => setApellidoMaterno(e.target.value)} />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="Correo">
                        <Input value={correo} onChange={(e) => setCorreo(e.target.value)} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Teléfono">
                        <Input
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ''))}
                            maxLength={10} // Limitar el número de caracteres si lo deseas
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="Cargo">
                        <Dropdown
                            value={cargo}
                            onChange={setCargo}
                            options={cargoOptions}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24} justify="end">
                <Col>
                    <Button type="default" onClick={handleCancel} style={{ marginRight: 8 }}>
                        Cancelar
                    </Button>
                </Col>
                <Col>
                    <Button type="primary" htmlType="submit">
                        Agregar Enlace
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default AddEnlace;
