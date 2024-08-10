import React, { useState, useEffect } from 'react';
import { Input, Button, Form, Row, Col } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';

const ViewEnlace = () => {
    const { id } = useParams(); // Recoger el ID del enlace de la URL
    const navigate = useNavigate();

    const [editable, setEditable] = useState(false);
    const [enlaceData, setEnlaceData] = useState({
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        correo: '',
        telefono: '',
        dependencia: '',
        direccion: '',
        adscripcion: '',
        cargo: '',
    });

    // Simular la carga de datos desde una fuente externa (puede ser una llamada a una API)
    useEffect(() => {
        // Reemplazar con la lógica para obtener los datos del enlace desde el backend
        const fetchData = async () => {
            const data = {
                nombre: 'Juan',
                apellidoPaterno: 'Pérez',
                apellidoMaterno: 'Gómez',
                correo: 'juan.perez@example.com',
                telefono: '555-555-5555',
                dependencia: 'Dependencia A',
                direccion: 'Dirección A',
                adscripcion: 'Adscripción A',
                cargo: 'Cargo A',
            };
            setEnlaceData(data);
        };

        fetchData();
    }, [id]);

    const handleUpdate = () => {
        setEditable(true);
    };

    const handleCancel = () => {
        setEditable(false);
    };

    const handleSave = () => {
        console.log('Datos guardados:', enlaceData);
        setEditable(false);
        // Aquí puedes agregar la lógica para enviar los datos actualizados al backend
    };

    const handleChange = (e) => {
        setEnlaceData({
            ...enlaceData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <Form layout="vertical">
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="Nombre">
                        <Input
                            name="nombre"
                            value={enlaceData.nombre}
                            onChange={handleChange}
                            disabled={!editable}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Apellido Paterno">
                        <Input
                            name="apellidoPaterno"
                            value={enlaceData.apellidoPaterno}
                            onChange={handleChange}
                            disabled={!editable}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="Apellido Materno">
                        <Input
                            name="apellidoMaterno"
                            value={enlaceData.apellidoMaterno}
                            onChange={handleChange}
                            disabled={!editable}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Correo Electrónico">
                        <Input
                            name="correo"
                            value={enlaceData.correo}
                            onChange={handleChange}
                            disabled={!editable}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="Número de Teléfono">
                        <Input
                            name="telefono"
                            value={enlaceData.telefono}
                            onChange={handleChange}
                            disabled={!editable}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Dependencia">
                        <Input
                            name="dependencia"
                            value={enlaceData.dependencia}
                            onChange={handleChange}
                            disabled={!editable}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="Dirección">
                        <Input
                            name="direccion"
                            value={enlaceData.direccion}
                            onChange={handleChange}
                            disabled={!editable}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Adscripción">
                        <Input
                            name="adscripcion"
                            value={enlaceData.adscripcion}
                            onChange={handleChange}
                            disabled={!editable}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="Cargo">
                        <Input
                            name="cargo"
                            value={enlaceData.cargo}
                            onChange={handleChange}
                            disabled={!editable}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24} justify="end">
                {!editable && (
                    <>
                        <Button type="primary" onClick={handleUpdate} style={{ marginRight: 8 }}>
                            Actualizar
                        </Button>
                        <Button onClick={() => navigate('/enlaces')}>Volver</Button>
                    </>
                )}
                {editable && (
                    <>
                        <Button type="primary" onClick={handleSave} style={{ marginRight: 8 }}>
                            Guardar
                        </Button>
                        <Button onClick={handleCancel}>Cancelar</Button>
                    </>
                )}
            </Row>
        </Form>
    );
};

export default ViewEnlace;
