import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Divider, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';

const { Title } = Typography; // Extraer Title desde Typography

const Contratos = () => {
    const navigate = useNavigate();
    const [contracts, setContracts] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filteredContracts, setFilteredContracts] = useState([]);

    useEffect(() => {
        // Aquí puedes realizar una llamada al backend para obtener los datos de los contratos
        // Por ahora, agregaremos datos ficticios como ejemplo
        const mockData = [
            {
                key: '1',
                cliente: 'Cliente 1',
                tipoContrato: 'Tipo de Contrato 1',
                fechaContrato: '2024-08-09',
                versionContrato: 'Versión 1',
                tipoInstalacion: 'Instalación 1',
                descripcion: 'Descripción del contrato 1',
            },
            {
                key: '2',
                cliente: 'Cliente 2',
                tipoContrato: 'Tipo de Contrato 2',
                fechaContrato: '2024-08-10',
                versionContrato: 'Versión 2',
                tipoInstalacion: 'Instalación 2',
                descripcion: 'Descripción del contrato 2',
            },
            // Agrega más datos según sea necesario
        ];
        setContracts(mockData);
        setFilteredContracts(mockData);
    }, []);

    const handleSearch = (e) => {
        const { value } = e.target;
        setSearchText(value);
        const filteredData = contracts.filter(contract =>
            contract.cliente.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredContracts(filteredData);
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
            <Title level={2}>Enlaces</Title> {/* Título corregido */}
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
            <Table columns={columns} dataSource={filteredContracts} />
        </div>
    );
};

export default Contratos;
