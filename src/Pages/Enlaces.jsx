import React, {useEffect, useState} from 'react';
import { Table, Button, Input, Tag, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios'; // Importar Axios


const { Text } = Typography;

const data = [
    {
        key: '1',
        nombre: 'Juan Pérez',
        correo: 'juan.perez@example.com',
        telefono: '555-555-5555',
        dependencia: 'Dependencia A',
        direccion: 'Dirección A',
        adscripcion: 'Adscripción A',
        cargo: 'Cargo A',
        contratos: [
            {
                key: 1,
                fechaContrato: '2022-01-01',
                tipoInstalacion: 'Instalación A',
                tipoContrato: 'Contrato A',
                versionContrato: 'V1',
                estatus: 'Activo',
            },
            {
                key: 2,
                fechaContrato: '2022-02-01',
                tipoInstalacion: 'Instalación B',
                tipoContrato: 'Contrato B',
                versionContrato: 'V2',
                estatus: 'Inactivo',
            },
            {
                key: 3,
                fechaContrato: '2022-03-01',
                tipoInstalacion: 'Instalación C',
                tipoContrato: 'Contrato C',
                versionContrato: 'V3',
                estatus: 'Activo',
            },
        ]
    },
    {
        key: '2',
        nombre: 'Ana Gómez',
        correo: 'ana.gomez@example.com',
        telefono: '555-555-5556',
        dependencia: 'Dependencia B',
        direccion: 'Dirección B',
        adscripcion: 'Adscripción B',
        cargo: 'Cargo B',
        contratos: [
            {
                key: 1,
                fechaContrato: '2022-01-01',
                tipoInstalacion: 'Instalación A',
                tipoContrato: 'Contrato A',
                versionContrato: 'V1',
                estatus: 'Activo',
            },
            {
                key: 2,
                fechaContrato: '2022-02-01',
                tipoInstalacion: 'Instalación B',
                tipoContrato: 'Contrato B',
                versionContrato: 'V2',
                estatus: 'Activo',
            }
        ]
    },
];

const expandedRowRender = (record) => {
    const subTableColumns = [
        { title: 'Fecha de contrato', dataIndex: 'fechaContrato', key: 'fechaContrato' },
        { title: 'Tipo de instalación', dataIndex: 'tipoInstalacion', key: 'tipoInstalacion' },
        { title: 'Tipo de contrato', dataIndex: 'tipoContrato', key: 'tipoContrato' },
        { title: 'Versión de contrato', dataIndex: 'versionContrato', key: 'versionContrato' },
        {
            title: 'Estatus',
            dataIndex: 'estatus',
            key: 'estatus',
            render: estatus => (
                <Tag color={estatus === 'Activo' ? 'green' : 'red'}>
                    {estatus.toUpperCase()}
                </Tag>
            ),
        },
    ];

    const limitedData = record.contratos.slice(0, 2); // Limita a 2 filas
    const hasMore = record.contratos.length > 2; // Verifica si hay más de 2 contratos

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
    const [filteredData, setFilteredData] = useState(data);
    const [searchText, setSearchText] = useState('');

    const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.BACKEND_URI}enlace/status?estatus=1`);
            setFilteredData(response.data);
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
                newExpandedRowKeys.shift(); // Remover la primera subtabla abierta
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
        const filtered = data.filter((item) =>
            item.nombre.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'key',
            key: 'key',
            width: 50,
        },
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
