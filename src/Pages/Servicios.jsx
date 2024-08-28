import React, { useEffect, useState } from 'react';
import {Table, Button, Typography, Divider} from 'antd';
import axios from 'axios';

const { Text, Title } = Typography;

const Servicios = () => {
    const [servicios, setServicios] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URI}servicios/detallados`)
            .then(response => {
                setServicios(response.data.servicios);
            })
            .catch(error => {
                console.error('Error al obtener los servicios:', error);
            });
    }, []);
    const formatFecha = (fecha) => {
        const date = new Date(fecha);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

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
                <Button type="link">Ver Detalles</Button>
            ),
            align: 'center',
        },
    ];

    return (
        <div>
            <Title level={2}>Servicios</Title>
            <Divider style={{ marginTop: '20px' }} />
            <Table columns={columns} dataSource={servicios} rowKey="id" />
        </div>
    );
};

export default Servicios;
