import React, { useState, useEffect } from 'react';
import { Table, Spin, message, Button, Popconfirm, Typography } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';
import moment from 'moment';

const ContratoTable = ({ contratoId, onRestore }) => {
    const [loading, setLoading] = useState(true);
    const [contratos, setContratos] = useState([]);

    const token = Cookies.get('token');
    const { Text } = Typography;

    useEffect(() => {
        const fetchContrato = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}contratos/modified/detallados/contratos/${contratoId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Verifica si la respuesta contiene 'contratos'
                if (response.data && response.data.contratos) {
                    setContratos(response.data.contratos);
                } else {
                    message.error('No se encontraron historiales para este contrato.');
                }

                setLoading(false);
            } catch (error) {
                console.error('Error al obtener el historial del contrato:', error);
                message.error('Hubo un error al obtener el historial del contrato');
                setLoading(false);
            }
        };

        if (contratoId) {
            fetchContrato();
        }
    }, [contratoId, token]);

    const handleRestore = async (modifiedId) => {
        try {
            const response = await axios.patch(`${process.env.REACT_APP_BACKEND_URI}contratos/restore/modified`, {
                modifiedId: modifiedId // Enviar el modifiedId como parte del cuerpo de la solicitud
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

    if (!contratos || contratos.length === 0) {
        return <Text>No se encontraron historiales para este contrato.</Text>;
    }

    const columns = [
        {
            title: 'Cliente',
            dataIndex: 'cliente',
            key: 'cliente',
            render: (text, record) => `${record.nombreEnlace} ${record.apellidoPEnlace} ${record.apellidoMEnlace}`,
        },
        {
            title: 'Correo',
            dataIndex: 'correoEnlace',
            key: 'correoEnlace',
        },
        {
            title: 'Fecha de Contrato',
            dataIndex: 'fechaContrato',
            key: 'fechaContrato',
            render: (text) => moment(text).format('YYYY-MM-DD'),
        },
        {
            title: 'Tipo de Contrato',
            dataIndex: 'tipoContrato',
            key: 'tipoContrato',
        },
        {
            title: 'Versión de Contrato',
            dataIndex: 'versionContrato',
            key: 'versionContrato',
        },
        {
            title: 'Ubicación',
            dataIndex: 'ubicacion',
            key: 'ubicacion',
        },
        {
            title: 'Fecha de Respaldo',
            dataIndex: 'backedUpAt',
            key: 'backedUpAt',
            render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (text, record) => (
                <Popconfirm
                    title="¿Estás seguro de que deseas restaurar este contrato?"
                    onConfirm={() => handleRestore(record.id)} // Aquí se pasa el id de la modificación
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

    const expandedRowRender = (record) => (
        <p style={{ margin: 0 }}>
            <strong>Descripción:</strong> {record.descripcion}
        </p>
    );

    return (
        <div>
            <Text style={{ fontSize: "20px" }}>Historial de modificaciones</Text>
            <Table
                columns={columns}
                dataSource={contratos} // Pasar los datos del contrato como array
                rowKey="id"
                expandable={{ expandedRowRender }}
                pagination={true}
            />
        </div>
    );
};

export default ContratoTable;
