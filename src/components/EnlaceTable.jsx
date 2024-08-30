import React, { useState, useEffect } from 'react';
import { Table, Button, message, Popconfirm, Space, Typography } from 'antd';
import axios from 'axios';
import { CheckOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import moment from 'moment';

const { Text } = Typography;

const EnlaceTable = ({ enlaceId, reloadTable, onReloadComplete, onRestore }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = Cookies.get('token');

    useEffect(() => {
        fetchEnlaceData();
    }, [enlaceId, reloadTable]);

    const fetchEnlaceData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}enlaces/modified/detallados/enlaces/${enlaceId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setData(response.data.enlaces);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.warn('No se encontraron enlaces modificados.');
            } else {
                console.error('Error al obtener los datos del enlace:', error);
                message.error('Hubo un error al obtener los datos del enlace.');
            }
        } finally {
            setLoading(false);
            onReloadComplete(); // Indicar que la recarga ha terminado
        }
    };

    const handleRestore = async (id) => {
        try {
            await axios.patch(`${process.env.REACT_APP_BACKEND_URI}enlaces/restore/modified`, {
                modifiedId: id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            message.success('Enlace restaurado exitosamente');
            fetchEnlaceData(); // Recargar los datos de la tabla después de la restauración
            onRestore(); // Recargar los datos del formulario principal
        } catch (error) {
            console.error('Error al restaurar el enlace:', error);
            message.error('Hubo un error al restaurar el enlace.');
        }
    };

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
        },
        {
            title: 'Apellido Paterno',
            dataIndex: 'apellidoP',
            key: 'apellidoP',
        },
        {
            title: 'Apellido Materno',
            dataIndex: 'apellidoM',
            key: 'apellidoM',
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
            title: 'Fecha y Hora de Actualización',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (text) => text ? (
                <>
                    <div><strong>Fecha:</strong> {moment(text).format('YYYY-MM-DD')}</div>
                    <div><strong>Hora:</strong> {moment(text).format('HH:mm:ss')}</div>
                </>
            ) : 'N/A',
        },
        {
            title: 'Acción',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Popconfirm
                        title="¿Estás seguro de que deseas restaurar este enlace?"
                        icon={<ExclamationCircleOutlined style={{ color: 'orange' }} />}
                        onConfirm={() => handleRestore(record.id)}
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
                </Space>
            ),
        },
    ];

    const expandedRowRender = (record) => (
        <div>
            <Text><strong>Dependencia:</strong> {record.dependencia ? record.dependencia : 'N/A'}</Text><br />
            <Text><strong>Dirección:</strong> {record.direccion ? record.direccion : 'N/A'}</Text><br />
            <Text><strong>Adscripción (Departamento):</strong> {record.adscripcion ? record.adscripcion : 'N/A'}</Text>
        </div>
    );

    return (
        <div>
            <Text style={{ fontSize: "20px", marginBottom: "24px"}}>Historial de modificaciones</Text>

            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                rowKey="id"
                pagination={false}
                expandable={{ expandedRowRender }}
            />
        </div>
    );
};

export default EnlaceTable;
