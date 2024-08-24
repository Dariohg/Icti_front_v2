import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Divider, Typography, Row, Col, Tooltip, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined, CopyOutlined } from '@ant-design/icons';
import axios from 'axios';
import '../Styles/contrato.css'; // Asegúrate de importar el archivo CSS


const { Title, Text } = Typography;

const Contratos = () => {
    const navigate = useNavigate();
    const [contracts, setContracts] = useState([]);
    const [enlaces, setEnlaces] = useState({});
    const [searchText, setSearchText] = useState('');
    const [filteredContracts, setFilteredContracts] = useState([]);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);

    useEffect(() => {
        const fetchContracts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/contratos/detallados');
                const contratos = response.data.contratos;

                const mappedContracts = contratos.map(contract => ({
                    key: contract.id,
                    enlaceId: contract.enlaceId,
                    cliente: `${contract.nombreEnlace} ${contract.apellidoPEnlace} ${contract.apellidoMEnlace}`,
                    tipoContrato: contract.tipoContrato,
                    fechaContrato: new Date(contract.fechaContrato).toLocaleDateString(),
                    versionContrato: contract.versionContrato,
                    tipoInstalacion: contract.ubicacion,
                    descripcion: contract.descripcion,
                }));

                setContracts(mappedContracts);
                setFilteredContracts(mappedContracts);
            } catch (error) {
                console.error('Error fetching contracts:', error);
            }
        };

        const fetchEnlaces = async () => {
            try {
                const response = await axios.get('http://localhost:8000/enlaces/detallados');
                const enlacesData = response.data.enlaces;

                const enlacesMap = enlacesData.reduce((acc, enlace) => {
                    acc[enlace.id] = enlace;
                    return acc;
                }, {});

                setEnlaces(enlacesMap);
            } catch (error) {
                console.error('Error fetching enlaces:', error);
            }
        };

        fetchContracts();
        fetchEnlaces();
    }, []);

    const handleSearch = (e) => {
        const { value } = e.target;
        setSearchText(value);
        const filteredData = contracts.filter(contract =>
            contract.cliente.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredContracts(filteredData);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        message.success('¡Copiado al portapapeles!');
    };

    const expandedRowRender = (record) => {
        const enlace = enlaces[record.enlaceId];
        return (
            enlace ? (
                <div style={{ padding: '10px 20px', background: '#f9f9f9', borderRadius: '5px' }}>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Text strong style={{ display: 'block', marginBottom: '10px' }}>Información del enlace asociado a este contrato:</Text>
                        </Col>

                        <Col span={12}>
                            <p><strong>Nombre:</strong> {enlace.nombre} {enlace.apellidoP} {enlace.apellidoM}</p>
                            <Row>
                                <Col style={{ flexBasis: '60%' }}>
                                    <p className="copy-container" style={{ whiteSpace: 'nowrap' }}>
                                        <strong>Correo:</strong> {enlace.correo}
                                        <Tooltip title="Copiar correo">
                                            <CopyOutlined
                                                className="copy-icon"
                                                onClick={() => copyToClipboard(enlace.correo)}
                                            />
                                        </Tooltip>
                                    </p>
                                </Col>
                                <Col style={{ flexBasis: '40%' }}>
                                    <p className="copy-container" style={{ whiteSpace: 'nowrap' }}>
                                        <strong>Teléfono:</strong> {enlace.telefono}
                                        <Tooltip title="Copiar teléfono">
                                            <CopyOutlined
                                                className="copy-icon"
                                                onClick={() => copyToClipboard(enlace.telefono)}
                                            />
                                        </Tooltip>
                                    </p>
                                </Col>
                            </Row>
                            <p><strong>Cargo:</strong> {enlace.cargo}</p>
                        </Col>
                        <Col span={12}>
                            <p><strong>Dependencia:</strong> {enlace.dependencia}</p>
                            <p><strong>Dirección:</strong> {enlace.direccion}</p>
                            <p><strong>Adscripción:</strong> {enlace.adscripcion}</p>
                        </Col>
                    </Row>
                </div>
            ) : (
                <p>Cargando información del enlace...</p>
            )
        );
    };

    const handleExpand = (expanded, record) => {
        let newExpandedRowKeys = [...expandedRowKeys];

        if (expanded) {
            if (newExpandedRowKeys.length >= 2) {
                newExpandedRowKeys.shift();
            }
            newExpandedRowKeys.push(record.key);
        } else {
            newExpandedRowKeys = newExpandedRowKeys.filter(key => key !== record.key);
        }

        setExpandedRowKeys(newExpandedRowKeys);
    };

    const columns = [
        {
            title: 'Cliente',
            dataIndex: 'cliente',
            key: 'cliente',
        },
        {
            title: 'Tipo de Contrato',
            dataIndex: 'tipoContrato',
            key: 'tipoContrato',
        },
        {
            title: 'Fecha de Contrato',
            dataIndex: 'fechaContrato',
            key: 'fechaContrato',
        },
        {
            title: 'Versión de Contrato',
            dataIndex: 'versionContrato',
            key: 'versionContrato',
        },
        {
            title: 'Tipo de Instalación',
            dataIndex: 'tipoInstalacion',
            key: 'tipoInstalacion',
        },
        {
            title: 'Descripción',
            dataIndex: 'descripcion',
            key: 'descripcion',
        },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (text, record) => (
                <Button type="link" onClick={() => navigate(`/viewContrato/${record.key}`)}>
                    Ver Detalles
                </Button>
            ),
        },
    ];

    return (
        <div>
            <Title level={2}>Contratos</Title>
            <Divider style={{ marginTop: '20px' }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
                <Input
                    placeholder="Buscar por cliente"
                    value={searchText}
                    onChange={handleSearch}
                    style={{ width: 300 }}
                    prefix={<SearchOutlined />}
                />
            </div>
            <Table
                columns={columns}
                dataSource={filteredContracts}
                expandable={{
                    expandedRowRender: expandedRowRender,
                    expandedRowKeys: expandedRowKeys,
                    onExpand: handleExpand,
                    rowExpandable: record => !!enlaces[record.enlaceId],
                }}
            />
        </div>
    );
};

export default Contratos;
