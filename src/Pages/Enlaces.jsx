import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Tag, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Text } = Typography;

const expandedRowRender = (record) => {
    const subTableColumns = [
        { title: 'Fecha de contrato', dataIndex: 'fechaContrato', key: 'fechaContrato' },
        { title: 'Tipo de instalación', dataIndex: 'ubicacion', key: 'ubicacion' },
        { title: 'Tipo de contrato', dataIndex: 'tipoContrato', key: 'tipoContrato' },
        { title: 'Versión de contrato', dataIndex: 'versionContrato', key: 'versionContrato' },
        {
            title: 'Estatus',
            dataIndex: 'estatus',
            key: 'estatus',
            render: estatus => (
                <Tag color={estatus === 1 ? 'green' : 'red'}>
                    {estatus === 1 ? 'ACTIVO' : 'INACTIVO'}
                </Tag>
            ),
        },
    ];

    const limitedData = record.contratos.slice(0, 2);
    const hasMore = record.contratos.length > 2;

    return (
        <>
            <Table columns={subTableColumns} dataSource={limitedData} pagination={false} />
            {hasMore && (
                <Text type="secondary" style={{ marginTop: '10px', display: 'block' }}>
                    Hay más información disponible. Haz clic en "Ver" para ver la información completa.
                </Text>
            )}
        </>
    );
};

const Enlaces = () => {
    const navigate = useNavigate();
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchText, setSearchText] = useState('');

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
                contratos: contratosData.filter(contrato => contrato.persona === `${enlace.nombre} ${enlace.apellidoP} ${enlace.apellidoM}`), // Filtra los contratos por persona
            }));
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
        const filtered = filteredData.filter((item) =>
            item.nombre.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
    };

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
        },
        {
            title: 'Correo Electrónico',
            dataIndex: 'correo',
            key: 'correo',
        },
        {
            title: 'Número de Teléfono',
            dataIndex: 'telefono',
            key: 'telefono',
        },
        {
            title: 'Dependencia',
            dataIndex: 'dependencia',
            key: 'dependencia',
        },
        {
            title: 'Dirección',
            dataIndex: 'direccion',
            key: 'direccion',
        },
        {
            title: 'Adscripción',
            dataIndex: 'adscripcion',
            key: 'adscripcion',
        },
        {
            title: 'Cargo',
            dataIndex: 'cargo',
            key: 'cargo',
        },
        {
            title: 'Acción',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="link" icon={<EyeOutlined />} onClick={() => navigate(`/viewEnlace/${record.key}`)}>
                        Ver
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
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
                pagination={{ position: ['bottomRight'] }}
                bordered
            />
        </div>
    );
};

export default Enlaces;
