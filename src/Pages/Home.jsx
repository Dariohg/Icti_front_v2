import React, { useEffect } from 'react';
import { Card, Row, Col } from 'antd';
import { CheckCircleOutlined, CalendarOutlined, FieldTimeOutlined, PieChartOutlined } from '@ant-design/icons';
import '../Styles/home.css';
import dayjs from 'dayjs';
import 'dayjs/locale/es'; // Para el soporte en español

dayjs.locale('es');

const Home = () => {
    const fechaActual = dayjs().format('DD MMMM YYYY'); // Ejemplo: 25 Agosto 2024
    const mesActual = dayjs().format('MMMM'); // Ejemplo: Agosto
    const trimestre = obtenerTrimestre(dayjs().month() + 1); // Función para obtener el trimestre actual

    // Datos simulados
    const serviciosDia = 5;
    const serviciosMes = 23;
    const serviciosTrimestre = 60;

    useEffect(() => {
        console.log(document.cookie); // Muestra todas las cookies disponibles
    }, []);

    function obtenerTrimestre(mes) {
        if (mes <= 3) return 'Enero a Marzo';
        if (mes <= 6) return 'Abril a Junio';
        if (mes <= 9) return 'Julio a Septiembre';
        return 'Octubre a Diciembre';
    }

    return (
        <div className="home-container">
            <h2 className="home-title">Bienvenido al Home</h2>
            <p className="home-description">Esta es la página principal de la aplicación.</p>

            <Row gutter={[16, 16]} className="home-row">
                {[...Array(7)].map((_, index) => (
                    <Col span={index < 3 ? 8 : 6} key={index}>
                        <Card
                            title={<div className="card-header"> Asesorías</div>}
                            bordered={false}
                            className="home-card"
                        >
                            <div className="parent">
                                <div className="div1">
                                    <CalendarOutlined className="card-icon blue" />
                                    <p>{fechaActual}</p>
                                    <p className="numero_servicios">{serviciosDia}</p>
                                </div>
                                <div className="div2">
                                    <FieldTimeOutlined className="card-icon yellow" />
                                    <p>{mesActual}</p>
                                    <p className="numero_servicios">{serviciosMes}</p>
                                </div>
                                <div className="div3">
                                    <PieChartOutlined className="card-icon pink" />
                                    <p>{trimestre}</p>
                                    <p className="numero_servicios">{serviciosTrimestre}</p>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default Home;
