import React, { useState, useEffect } from 'react';
import {Table, Spin, message, Button, Popconfirm, Typography} from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';
import moment from 'moment';

const ContratoTable = ({ onRestore }) => {
    const [loading, setLoading] = useState(true);
    const [contrato, setContrato] = useState(null);

    const token = Cookies.get('token');
    const contratoId = 11; // ID estático por ahora, puedes cambiarlo dinámicamente si es necesario

    const {Text} = Typography;

    useEffect(() => {
        const fetchContrato = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}contratos/modified/detallados/${contratoId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setContrato(response.data.contrato);
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener el contrato:', error);
                message.error('Hubo un error al obtener el contrato');
                setLoading(false);
            }
        };

        fetchContrato();
    }, [contratoId, token]);

    const handleRestore = async () => {
        try {
            const response = await axios.patch(`${process.env.REACT_APP_BACKEND_URI}contratos/restore/modified`, {
                modifiedId: contrato.id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                message.success('Contrato restaurado correctamente');
                onRestore(); // Llamar a la función pasada como prop para recargar datos
            } else {
                message.error('Error al restaurar el contrato');
            }
        } catch (error) {
            console.error('Error al restaurar el contrato:', error);
            message.error('Hubo un error al restaurar el contrato. Por favor, inténtalo de nuevo.');
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '24px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!contrato) {
        return null; // No mostrar nada si no se encuentra el contrato
    }

    const columns = [
        {
            title: 'Cliente',
            dataIndex: 'cliente',
            key: 'cliente',
            render: () => `${contrato.nombreEnlace} ${contrato.apellidoPEnlace} ${contrato.apellidoMEnlace}`,
        },
        {
            title: 'Correo',
            dataIndex: 'correo',
            key: 'correo',
            render: () => contrato.correoEnlace,
        },
        {
            title: 'Fecha de Contrato',
            dataIndex: 'fechaContrato',
            key: 'fechaContrato',
            render: () => moment(contrato.fechaContrato).format('YYYY-MM-DD'),
        },
        {
            title: 'Tipo de Contrato',
            dataIndex: 'tipoContrato',
            key: 'tipoContrato',
            render: () => contrato.tipoContrato,
        },
        {
            title: 'Versión de Contrato',
            dataIndex: 'versionContrato',
            key: 'versionContrato',
            render: () => contrato.versionContrato,
        },
        {
            title: 'Ubicación',
            dataIndex: 'ubicacion',
            key: 'ubicacion',
            render: () => contrato.ubicacion,
        },
        {
            title: 'Acciones',
            key: 'acciones',
            render: () => (
                <Popconfirm
                    title="¿Estás seguro de que deseas restaurar este contrato?"
                    onConfirm={handleRestore}
                    okText="Sí"
                    cancelText="No"
                    okButtonProps={{ style: { backgroundColor: 'orange', borderColor: 'orange' } }}
                >
                    <Button
                        type="primary"
                        style={{ backgroundColor: 'orange', borderColor: 'orange' }}
                    >
                        Restaurar
                    </Button>
                </Popconfirm>
            ),
        },
    ];

    const expandedRowRender = () => (
        <p style={{ margin: 0 }}>
            <strong>Descripción:</strong> {contrato.descripcion}
        </p>
    );

    return (
        <div>
            <Text style={{ fontSize: "20px" }}>Historial de modificaciones</Text>
            <Table
            columns={columns}
            dataSource={[contrato]} // Pasar los datos del contrato como array
            rowKey="id"
            expandable={{ expandedRowRender }}
            pagination={false} // Desactivar la paginación ya que solo hay un contrato
            />
        </div>

    );
};

export default ContratoTable;
