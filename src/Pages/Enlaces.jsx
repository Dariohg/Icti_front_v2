import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Tag, Space, Typography, Divider, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

const { Text, Title } = Typography;
const { Option } = Select;

const serviceOptions = [
    'Servicios de Hosting',
    'Servicios de Maquinas Virtuales',
    'Servicios de Telefonia',
    'Servicios de Internet',
    'RIG'
];

const expandedRowRender = (record) => {
    const subTableColumns = [
        {
            title: 'Fecha de contrato',
            dataIndex: 'fechaContrato',
            key: 'fechaContrato',
            render: (text) => moment(text).format('YYYY-MM-DD'),
            align: 'center',
        },
        { title: 'Tipo de instalación', dataIndex: 'ubicacion', key: 'ubicacion', align: 'center' },
        {title: 'Tipo de contrato', dataIndex: 'tipoContrato', key: 'tipoContrato', align: 'center',},
        { title: 'Versión de contrato', dataIndex: 'versionContrato', key: 'versionContrato', align: 'center' },
        {
            title: 'Estatus',
            dataIndex: 'estatus',
            key: 'estatus',
            render: estatus => (
                <Tag color={estatus === 1 ? 'green' : 'red'}>
                    {estatus === 1 ? 'ACTIVO' : 'INACTIVO'}
                </Tag>
            ),
            align: 'center',
        },
    ];

    const limitedData = record.contratos.slice(0, 2);
    const hasMore = record.contratos.length > 2;

    return (
        <>
            <Table columns={subTableColumns} dataSource={limitedData} pagination={false} />
            {hasMore && (
                <Text type="secondary" style={{ marginTop: '10px', display: 'block', textAlign: 'center' }}>
                    Hay más información disponible. Haz clic en "Ver" para ver la información completa.
                </Text>
            )}
        </>
    );
};

const Enlaces = () => {
    const navigate = useNavigate();
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [selectedServices, setSelectedServices] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}enlace/status?estatus=1`);
            const enlacesData = response.data;

            const contratosResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URI}contrato/`);
            const contratosData = contratosResponse.data;

            const enlacesMapped = enlacesData.map(enlace => ({
                key: enlace.idPersona,
                nombre: `${enlace.nombre} ${enlace.apellidoP} ${enlace.apellidoM}`,
                correo: enlace.correo,
                telefono: enlace.telefono,
                dependencia: enlace.direccion.dependencia.nombreCorto,
                direccion: enlace.direccion.nombre,
                adscripcion: enlace.departamento.nombreDepartamento,
                cargo: enlace.cargoEnlace.nombreCargo,
                contratos: contratosData.filter(contrato => contrato.persona === `${enlace.nombre} ${enlace.apellidoP} ${enlace.apellidoM}`).map(contrato => ({
                    ...contrato,
                    tipoContrato: contrato.tipoContrato,
                })),
            }));

            setOriginalData(enlacesMapped);
            setFilteredData(enlacesMapped);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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

    const handleSearch = (e) => {
        const { value } = e.target;
        setSearchText(value);
        filterData(value, selectedServices);
    };

    const handleServiceChange = (value) => {
        setSelectedServices(value);
        filterData(searchText, value);
    };

    const filterData = (searchText, selectedServices) => {
        let filtered = originalData;

        if (searchText) {
            filtered = filtered.filter((item) =>
                item.nombre.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        if (selectedServices.length > 0) {
            filtered = filtered.filter((item) =>
                item.contratos.some(contrato => selectedServices.includes(contrato.tipoContrato))
            );
        }

        setFilteredData(filtered);
    };

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
            align: 'center',
        },
        {
            title: 'Correo Electrónico',
            dataIndex: 'correo',
            key: 'correo',
            align: 'center',
        },
        {
            title: 'Número de Teléfono',
            dataIndex: 'telefono',
            key: 'telefono',
            align: 'center',
        },
        {
            title: 'Dependencia',
            dataIndex: 'dependencia',
            key: 'dependencia',
            align: 'center',
        },
        {
            title: 'Dirección',
            dataIndex: 'direccion',
            key: 'direccion',
            align: 'center',
        },
        {
            title: 'Adscripción',
            dataIndex: 'adscripcion',
            key: 'adscripcion',
            align: 'center',
        },
        {
            title: 'Cargo',
            dataIndex: 'cargo',
            key: 'cargo',
            align: 'center',
        },
        {
            title: 'Acción',
            key: 'action',
            render: (text, record) => (
                <Space size="middle" align="center">
                    <Button type="link" icon={<EyeOutlined />} onClick={() => navigate(`/viewEnlace/${record.key}`)}>
                        Ver
                    </Button>
                </Space>
            ),
            align: 'center',
        },
    ];

    return (
        <div>
            <Title level={2}>Enlaces</Title>
            <Divider style={{ marginTop: '20px' }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 16 }}>
                <Select
                    mode="multiple"
                    placeholder="Filtrar por tipo de servicio"
                    onChange={handleServiceChange}
                    style={{ width: 300, marginRight: '10px' }}
                    allowClear
                >
                    {serviceOptions.map(option => (
                        <Option key={option} value={option}>{option}</Option>
                    ))}
                </Select>
                <Input
                    placeholder="Buscar por nombre"
                    value={searchText}
                    onChange={handleSearch}
                    style={{ width: 300 }}
                    prefix={<SearchOutlined />}
                />
            </div>
            <Table
                columns={columns}
                expandable={{
                    expandedRowRender,
                    expandedRowKeys,
                    onExpand: handleExpand,
                }}
                dataSource={filteredData}
                rowKey="key"
                pagination={{ position: ['bottomRight'], pageSize: 10 }}
                bordered
            />
        </div>
    );
};

export default Enlaces;
