import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Divider, Typography, Row, Col, Tooltip, message, TreeSelect, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined, CopyOutlined } from '@ant-design/icons';
import axios from 'axios';
import Cookies from 'js-cookie';

const { Title, Text } = Typography;
const { Option } = Select;
const { SHOW_PARENT } = TreeSelect;

const Contratos = () => {
    const navigate = useNavigate();
    const [contracts, setContracts] = useState([]);
    const [filteredContracts, setFilteredContracts] = useState([]);
    const [enlaces, setEnlaces] = useState({});
    const [searchText, setSearchText] = useState('');
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [treeData, setTreeData] = useState([]);
    const [tipoInstalacionOptions, setTipoInstalacionOptions] = useState([]);
    const [selectedTreeValues, setSelectedTreeValues] = useState([]);
    const [selectedTipoInstalacion, setSelectedTipoInstalacion] = useState('');

    const token = Cookies.get('token');

    useEffect(() => {
        fetchContracts();
        fetchEnlaces();
        fetchTipoContratos();
        fetchTipoInstalacion();
    }, []);

    const fetchContracts = async () => {
        try {
            const response = await axios.get('http://localhost:8000/contratos/detallados', {
                headers: {
                    Authorization: `Bearer ${token}` // Agregar el token en los headers
                }
            });
            const contratos = response.data.contratos;

            const mappedContracts = contratos.map(contract => ({
                key: contract.id,
                enlaceId: contract.enlaceId,
                cliente: `${contract.nombreEnlace} ${contract.apellidoPEnlace} ${contract.apellidoMEnlace}`,
                tipoContrato: contract.tipoContrato,
                fechaContrato: new Date(contract.fechaContrato).toLocaleDateString(),
                versionContrato: contract.versionContrato,
                tipoInstalacion: contract.ubicacion,
            }));

            setContracts(mappedContracts);
            setFilteredContracts(mappedContracts);
        } catch (error) {
            console.error('Error fetching contracts:', error);
        }
    };

    const fetchEnlaces = async () => {
        try {
            const response = await axios.get('http://localhost:8000/enlaces/detallados', {
                headers: {
                    Authorization: `Bearer ${token}` // Agregar el token en los headers
                }
            });
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

    const fetchTipoContratos = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}contratos/tipos-contrato`);
            const tipoContratos = response.data.tipoContrato;

            const treeDataPromises = tipoContratos.map(async (tipoContrato) => {
                if (["Servicios de Telefonia", "Servicios de Internet", "RIG"].includes(tipoContrato.nombre)) {
                    return {
                        title: tipoContrato.nombre,
                        value: tipoContrato.nombre,
                        key: `tipo-${tipoContrato.id}`,
                    };
                } else {
                    const versionesResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URI}contratos/versiones/${tipoContrato.id}`);
                    const versiones = versionesResponse.data.versiones.map(version => ({
                        title: version.descripcion,
                        value: version.descripcion,
                        key: `version-${version.id}`,
                    }));

                    return {
                        title: tipoContrato.nombre,
                        value: tipoContrato.nombre,
                        key: `tipo-${tipoContrato.id}`,
                        children: versiones,
                    };
                }
            });

            const resolvedTreeData = await Promise.all(treeDataPromises);
            setTreeData(resolvedTreeData);
        } catch (error) {
            console.error('Error al obtener los tipos de contrato:', error);
            message.error('Hubo un error al obtener los tipos de contrato');
        }
    };

    const fetchTipoInstalacion = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}contratos/tipos-instalacion`);
            const tipoInstalacion = response.data.tipoInstalacion;
            setTipoInstalacionOptions(tipoInstalacion);
        } catch (error) {
            console.error('Error al obtener los tipos de instalación:', error);
            message.error('Hubo un error al obtener los tipos de instalación');
        }
    };

    const handleSearch = (e) => {
        const { value } = e.target;
        setSearchText(value);
        filterData(value, selectedTreeValues, selectedTipoInstalacion);
    };

    const handleTreeSelectChange = (value) => {
        setSelectedTreeValues(value);
        filterData(searchText, value, selectedTipoInstalacion);
    };

    const handleTipoInstalacionChange = (value) => {
        setSelectedTipoInstalacion(value);
        filterData(searchText, selectedTreeValues, value);
    };

    const filterData = (searchText, selectedTreeValues, selectedTipoInstalacion) => {
        let filtered = contracts;

        // Filtrado por nombre
        if (searchText) {
            filtered = filtered.filter((item) =>
                item.cliente.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        // Filtrado por tipo de contrato y versión de contrato (todos deben coincidir)
        if (selectedTreeValues.length > 0) {
            filtered = filtered.filter((item) =>
                selectedTreeValues.every(value =>
                    item.tipoContrato === value || item.versionContrato === value
                )
            );
        }

        // Filtrado por tipo de instalación
        if (selectedTipoInstalacion) {
            filtered = filtered.filter((item) =>
                item.tipoInstalacion === selectedTipoInstalacion
            );
        }

        setFilteredContracts(filtered);
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
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 16 }}>
                <TreeSelect
                    treeData={treeData}
                    value={selectedTreeValues}
                    onChange={handleTreeSelectChange}
                    treeCheckable={true}
                    showCheckedStrategy={SHOW_PARENT}
                    placeholder="Filtrar por tipo de contrato"
                    style={{ width: 300, marginRight: '10px' }}
                    allowClear
                />
                <Select
                    placeholder="Filtrar por tipo de instalación"
                    onChange={handleTipoInstalacionChange}
                    style={{ width: 200, marginRight: '10px' }}
                    allowClear
                >
                    {tipoInstalacionOptions.map(option => (
                        <Option key={option.id} value={option.nombre}>{option.nombre}</Option>
                    ))}
                </Select>
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
