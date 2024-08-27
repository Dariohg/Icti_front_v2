import React, { useState, useEffect } from 'react';
import { Row, Col, Card, message } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';

const EnlaceInfo = ({ enlaceId }) => {
    const [enlace, setEnlace] = useState(null);
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchEnlace = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}enlaces/detallados/completo/${enlaceId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setEnlace(response.data.enlace);
            } catch (error) {
                console.error('Error al obtener el enlace:', error);
                message.error('Hubo un error al obtener la información del enlace');
            }
        };

        fetchEnlace();
    }, [enlaceId]);

    if (!enlace) {
        return <p>Cargando información del enlace...</p>;
    }

    return (
        <Card title="Información del Enlace">
            <Row gutter={16}>
                <Col span={12}><strong>Nombre:</strong> {enlace.nombre} {enlace.apellidoP} {enlace.apellidoM}</Col>
                <Col span={12}><strong>Correo:</strong> {enlace.correo}</Col>
            </Row>
            <Row gutter={16} style={{ marginTop: '12px' }}>
                <Col span={12}><strong>Teléfono:</strong> {enlace.telefono}</Col>
                <Col span={12}><strong>Cargo:</strong> {enlace.cargo}</Col>
            </Row>
            <Row gutter={16} style={{ marginTop: '12px' }}>
                <Col span={12}><strong>Dependencia:</strong> {enlace.dependencia}</Col>
                <Col span={12}><strong>Dirección:</strong> {enlace.direccion}</Col>
            </Row>
            <Row gutter={16} style={{ marginTop: '12px' }}>
                <Col span={12}><strong>Adscripción:</strong> {enlace.adscripcion}</Col>
            </Row>
        </Card>
    );
};

export default EnlaceInfo;
