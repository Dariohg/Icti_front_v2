import React from 'react';
import { Card, Typography, Row, Col } from 'antd';
import '../Styles/cardServicios.css';
import moment from 'moment';

const { Title, Text } = Typography;

const CardServicios = () => {
    // Datos de ejemplo
    const tipoDiagnostico = "Asesoría";
    const serviciosHoy = 56;
    const serviciosMesActual = 56;
    const serviciosTrimestreActual = 56;

    // Obtener la fecha de hoy, mes actual y trimestre actual
    const fechaHoy = moment().format('DD/MM/YYYY');
    const mesActual = moment().format('MMMM YYYY');
    const trimestreActual = `Q${Math.ceil((moment().month() + 1) / 3)} ${moment().year()}`;

    return (
        <Card className="card-servicios" bordered={true}>
            <Row justify="center" align="middle">
                <Col span={24} className="centered-text">
                    <Text strong>Tipo de diagnóstico</Text>
                    <Title level={4} style={{ color: 'red' }}>{tipoDiagnostico}</Title>
                </Col>

                <Col span={24} className="centered-text">
                    <Text strong>Servicios del:</Text> <Text style={{ color: 'red' }}>{fechaHoy}</Text>
                </Col>

                <Col span={24} className="centered-text">
                    <Title level={1} style={{ color: 'red' }}>{serviciosHoy}</Title>
                </Col>

                <Col span={24} className="centered-text">
                    <Text strong>Servicios de:</Text> <Text style={{ color: 'red' }}>{mesActual}</Text>
                    <Title level={2} style={{ color: 'red', display: 'inline', marginLeft: '8px' }}>{serviciosMesActual}</Title>
                </Col>

                <Col span={24} className="centered-text">
                    <Text strong>Servicios de:</Text> <Text style={{ color: 'red' }}>{trimestreActual}</Text>
                    <Title level={2} style={{ color: 'red', display: 'inline', marginLeft: '8px' }}>{serviciosTrimestreActual}</Title>
                </Col>
            </Row>
        </Card>
    );
};

export default CardServicios;
