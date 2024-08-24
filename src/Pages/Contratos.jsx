import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Divider, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

const Contratos = () => {
    const navigate = useNavigate();
    const [contracts, setContracts] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filteredContracts, setFilteredContracts] = useState([]);

    useEffect(() => {
        const fetchContracts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/contratos/detallados');
                const contratos = response.data.contratos;

                // Mapeamos los datos recibidos para que coincidan con las columnas de la tabla
                const mappedContracts = contratos.map(contract => ({
                    key: contract.id,
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

        fetchContracts();
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
            <Table columns={columns} dataSource={filteredContracts} />
        </div>
    );
};

export default Contratos;
