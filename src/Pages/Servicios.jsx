import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spin, Divider, Typography, Input, Select } from 'antd';
import axios from 'axios';
import moment from 'moment';
import '../Styles/servicios.css';
import { SearchOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";

const { Title } = Typography;
const { Option } = Select;

const Servicios = () => {
    const [servicios, setServicios] = useState([]);
    const [filteredServicios, setFilteredServicios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [selectedTipoServicio, setSelectedTipoServicio] = useState('');
    const [tiposServicio, setTiposServicio] = useState([]);

    const token = Cookies.get('token');

    useEffect(() => {
        fetchServicios();
        fetchTiposServicio();
    }, []);

    const fetchServicios = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}servicios/detallados`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setServicios(response.data.servicios);
            setFilteredServicios(response.data.servicios);
            setLoading(false);
        } catch (error) {
            console.error("Error al obtener los servicios:", error);
            setLoading(false);
        }
    };

    const fetchTiposServicio = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}servicios/tipos/servicio`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTiposServicio(response.data.tipos);
        } catch (error) {
            console.error("Error al obtener los tipos de servicio:", error);
        }
    };

    const handleSearch = (e) => {
        const { value } = e.target;
        setSearchText(value);
        applyFilters(value, selectedTipoServicio);
    };

    const handleTipoServicioChange = (value) => {
        setSelectedTipoServicio(value);
        applyFilters(searchText, value);
    };

    const applyFilters = (searchText, tipoServicio) => {
        const filtered = servicios.filter(servicio => {
            const matchesSearchText =
                servicio.nombreSolicitante.toLowerCase().includes(searchText.toLowerCase()) ||
                servicio.nombreReceptor.toLowerCase().includes(searchText.toLowerCase());

            const matchesTipoServicio = tipoServicio
                ? servicio.tipoServicio === tipoServicio
                : true;

            return matchesSearchText && matchesTipoServicio;
        });

        setFilteredServicios(filtered);
    };

    return (
        <div className="servicios-container">
            <Title level={2}>Servicios</Title>
            <Divider style={{ marginTop: '20px' }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 16 }}>
                <Select
                    placeholder="Filtrar por tipo de servicio"
                    style={{ width: 300 }}
                    onChange={handleTipoServicioChange}
                    allowClear
                >
                    {tiposServicio.map(tipo => (
                        <Option key={tipo.id} value={tipo.nombre}>
                            {tipo.nombre} ({tipo.codigo})
                        </Option>
                    ))}
                </Select>
                <Input
                    placeholder="Buscar por nombre"
                    value={searchText}
                    onChange={handleSearch}
                    style={{ width: 300, marginLeft: "10px" }}
                    prefix={<SearchOutlined />}
                />
            </div>
            {loading ? (
                <div className="spin-container">
                    <Spin size="large" />
                </div>
            ) : (
                filteredServicios.map(servicio => (
                    <Card key={servicio.id} title={`Folio: ${servicio.folio}`} bordered={true} style={{ marginBottom: '16px' }}>
                        <Row className="hover-row-servicios" gutter={[16, 16]} style={{ marginBottom: '8px' }}>
                            <Col span={6}><strong>Dependencia:</strong> {servicio.dependencia}</Col>
                            <Col span={12}><strong>Dirección:</strong> {servicio.direccion}</Col>
                            <Col span={6}><strong>Folio:</strong> {servicio.folio}</Col>
                        </Row>
                        <Row className="hover-row-servicios" gutter={[16, 16]} style={{ marginBottom: '8px' }}>
                            <Col span={12}><strong>Solicitante:</strong> {servicio.nombreSolicitante}</Col>
                            <Col span={6}><strong>Cargo:</strong> {servicio.cargo}</Col>
                            <Col span={6}><strong>Receptor:</strong> {servicio.nombreReceptor}</Col>
                        </Row>
                        <Row className="hover-row-servicios" gutter={[16, 16]} style={{ marginBottom: '8px' }}>
                            <Col span={6}><strong>Fecha de Inicio:</strong> {moment(servicio.fechaInicio).format('YYYY-MM-DD')}</Col>
                            <Col span={6}><strong>Fecha de Término:</strong> {moment(servicio.fechaTermino).format('YYYY-MM-DD')}</Col>
                            <Col span={6}><strong>Tipo de Envío:</strong> {servicio.tipoEnvio}</Col>
                            <Col span={6}><strong>Nivel:</strong> {servicio.nivel}</Col>
                        </Row>
                        <Row className="hover-row-servicios" gutter={[16, 16]} style={{ marginBottom: '8px' }}>
                            <Col span={6}><strong>Hora de Inicio:</strong> {servicio.horaInicio}</Col>
                            <Col span={6}><strong>Hora de Término:</strong> {servicio.horaTermino}</Col>
                        </Row>
                        <Row className="hover-row-servicios" gutter={[16, 16]} style={{ marginBottom: '8px' }}>
                            <Col span={6}><strong>Tipo de Servicio:</strong> {servicio.tipoServicio}</Col>
                            <Col span={6}><strong>Código de Servicio:</strong> {servicio.codigoServicio}</Col>
                            <Col span={6}><strong>Tipo de Actividad:</strong> {servicio.tipoActividad}</Col>
                            <Col span={6}><strong>Estado del Servicio:</strong> {servicio.estadoServicio}</Col>
                        </Row>
                        <Row className="hover-row-servicios" gutter={[16, 16]} style={{ marginBottom: '8px' }}>
                            <Col span={24}><strong>Descripción de la Falla:</strong> {servicio.descripcionFalla}</Col>
                        </Row>
                        <Row className="hover-row-servicios" gutter={[16, 16]} style={{ marginBottom: '8px' }}>
                            <Col span={24}><strong>Descripción de la Actividad:</strong> {servicio.descripccionActividad}</Col>
                        </Row>
                        <Row className="hover-row-servicios" gutter={[16, 16]} style={{ marginBottom: '8px' }}>
                            <Col span={24}><strong>Observaciones:</strong> {servicio.observaciones}</Col>
                        </Row>
                    </Card>
                ))
            )}
        </div>
    );
};

export default Servicios;
