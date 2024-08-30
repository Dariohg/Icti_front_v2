import React, { useEffect, useState } from 'react';
import { Table, Button, Typography, Divider, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from "../components/LoadingSpinner";
import { SearchOutlined } from "@ant-design/icons";

const { Title } = Typography;

const Servicios = () => {
    const [filteredData, setFilteredData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(true);
    const [originalData, setOriginalData] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URI}servicios/detallados?estatus=1`)
            .then(response => {
                const servicios = response.data.servicios || [];
                setOriginalData(servicios);
                setFilteredData(servicios);
            })
            .catch(error => {
                if (error.response && error.response.status !== 404) {
                    message.error('Hubo un error al obtener los servicios');
                    console.error('Error al obtener los servicios:', error);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);


    const formatFecha = (fecha) => {
        const date = new Date(fecha);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleSearch = (e) => {
        const { value } = e.target;
        setSearchText(value);
        filterData(value);
    };

    const filterData = (searchText) => {
        let filtered = originalData;

        if (searchText) {
            filtered = filtered.filter((item) =>
                item.nombreSolicitante.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        setFilteredData(filtered);
    };

    const handleViewDetails = (id) => {
        navigate(`/viewServicio/${id}`);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    const columns = [
        {
            title: 'Folio',
            dataIndex: 'folio',
            key: 'folio',
            align: 'center',
        },
        {
            title: 'Nombre del Solicitante',
            dataIndex: 'nombreSolicitante',
            key: 'nombreSolicitante',
            align: 'center',
        },
        {
            title: 'Dirección',
            dataIndex: 'direccion',
            key: 'direccion',
            align: 'center',
        },
        {
            title: 'Fecha de Inicio',
            dataIndex: 'fechaInicio',
            key: 'fechaInicio',
            render: (text) => formatFecha(text),
            align: 'center',
        },
        {
            title: 'Estado del Servicio',
            dataIndex: 'estadoServicio',
            key: 'estadoServicio',
            align: 'center',
        },
        {
            title: 'Nombre del Receptor',
            dataIndex: 'nombreReceptor',
            key: 'nombreReceptor',
            align: 'center',
        },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (text, record) => (
                <Button type="link" onClick={() => handleViewDetails(record.id)}>Ver Detalles</Button>
            ),
            align: 'center',
        },
    ];

    return (
        <div>
            <Title level={2}>Servicios</Title>
            <Divider style={{ marginTop: '20px' }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 16 }}>
                <Input
                    placeholder="Buscar por nombre"
                    value={searchText}
                    onChange={handleSearch}
                    style={{ width: 300 }}
                    prefix={<SearchOutlined />}
                />
            </div>
            <Table columns={columns} dataSource={filteredData} rowKey="id" />
        </div>
    );
};

export default Servicios;
