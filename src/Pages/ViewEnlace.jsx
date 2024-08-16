import React, { useState, useEffect } from 'react';
import { Input, Button, Form, Row, Col, Table, Tag, Space, Typography, message, Popconfirm } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import EditContractDrawer from '../components/EditContractDrawer'; // Asegúrate de ajustar la ruta

const { Text } = Typography;

const ViewEnlace = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [editable, setEditable] = useState(false);
    const [enlaceData, setEnlaceData] = useState({
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        correo: '',
        telefono: '',
        dependencia: '',
        direccion: '',
        adscripcion: '',
        cargo: '',
        contratos: [],
    });

    const [selectedContract, setSelectedContract] = useState(null);
    const [drawerVisible, setDrawerVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const enlaceResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URI}enlace/${id}`);
                const enlace = enlaceResponse.data;

                const contratosResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URI}contrato/byId/${id}`);
                const contratos = contratosResponse.data;

                const contratosMapped = contratos.map(contrato => ({
                    key: contrato.idContrato,
                    fechaContrato: contrato.fechaContrato,
                    tipoInstalacion: contrato.ubicacion,
                    tipoContrato: contrato.tipoContrato,
                    versionContrato: contrato.versionContrato,
                    estatus: contrato.estatus === 1 ? 'Activo' : 'Inactivo',
                    descripcion: contrato.descripcion,
                }));

                setEnlaceData({
                    nombre: enlace.nombre,
                    apellidoPaterno: enlace.apellidoP,
                    apellidoMaterno: enlace.apellidoM,
                    correo: enlace.correo,
                    telefono: enlace.telefono,
                    dependencia: enlace.direccion.dependencia.nombreCorto,
                    direccion: enlace.direccion.nombre,
                    adscripcion: enlace.departamento.nombreDepartamento,
                    cargo: enlace.cargoEnlace.nombreCargo,
                    contratos: contratosMapped,
                });
            } catch (error) {
                console.error('Error al obtener los datos del enlace:', error);
                message.error('Hubo un error al obtener los datos del enlace.');
            }
        };

        fetchData();
    }, [id]);

    const handleUpdate = () => {
        setEditable(true);
    };

    const handleCancel = () => {
        setEditable(false);
    };

    const handleSave = () => {
        console.log('Datos guardados:', enlaceData);
        setEditable(false);
    };

    const handleDelete = async () => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URI}enlace/eliminar/${id}`, { estatus_id: 3 });
            if (response.status === 200) {
                message.success('Enlace eliminado correctamente');
                navigate('/enlaces');
            } else {
                message.error('Error al eliminar el enlace.');
                console.error('Error en la respuesta:', response);
            }
        } catch (error) {
            console.error('Error al eliminar el enlace:', error.response ? error.response.data : error.message);
            message.error('Hubo un error al eliminar el enlace.');
        }
    };

    const handleChange = (e) => {
        setEnlaceData({
            ...enlaceData,
            [e.target.name]: e.target.value,
        });
    };

    const handleEditContract = (contract) => {
        setSelectedContract(contract);
        setDrawerVisible(true);
    };

    const handleSaveContract = (updatedContract) => {
        const updatedContracts = enlaceData.contratos.map(contract =>
            contract.key === updatedContract.key ? updatedContract : contract
        );
        setEnlaceData({ ...enlaceData, contratos: updatedContracts });
        setDrawerVisible(false);
    };

    const contratoColumns = [
        { title: 'Fecha de contrato', dataIndex: 'fechaContrato', key: 'fechaContrato' },
        { title: 'Tipo de instalación', dataIndex: 'tipoInstalacion', key: 'tipoInstalacion' },
        { title: 'Tipo de contrato', dataIndex: 'tipoContrato', key: 'tipoContrato' },
        { title: 'Versión del contrato', dataIndex: 'versionContrato', key: 'versionContrato' },
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
        {
            title: 'Acción',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEditContract(record)}>
                        Editar
                    </Button>
                </Space>
            ),
        },
    ];

    const expandedRowRender = (record) => (
        <Text>{record.descripcion}</Text>
    );

    return (
        <>
            <Form layout="vertical">
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label="Nombre">
                            <Input
                                name="nombre"
                                value={enlaceData.nombre}
                                onChange={handleChange}
                                disabled={!editable}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Apellido Paterno">
                            <Input
                                name="apellidoPaterno"
                                value={enlaceData.apellidoPaterno}
                                onChange={handleChange}
                                disabled={!editable}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label="Apellido Materno">
                            <Input
                                name="apellidoMaterno"
                                value={enlaceData.apellidoMaterno}
                                onChange={handleChange}
                                disabled={!editable}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Correo Electrónico">
                            <Input
                                name="correo"
                                value={enlaceData.correo}
                                onChange={handleChange}
                                disabled={!editable}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label="Número de Teléfono">
                            <Input
                                name="telefono"
                                value={enlaceData.telefono}
                                onChange={handleChange}
                                disabled={!editable}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Dependencia">
                            <Input
                                name="dependencia"
                                value={enlaceData.dependencia}
                                onChange={handleChange}
                                disabled={!editable}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label="Dirección">
                            <Input
                                name="direccion"
                                value={enlaceData.direccion}
                                onChange={handleChange}
                                disabled={!editable}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Adscripción">
                            <Input
                                name="adscripcion"
                                value={enlaceData.adscripcion}
                                onChange={handleChange}
                                disabled={!editable}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label="Cargo">
                            <Input
                                name="cargo"
                                value={enlaceData.cargo}
                                onChange={handleChange}
                                disabled={!editable}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {!editable && (
                            <>
                                <Button type="primary" onClick={handleUpdate} style={{ flex: 1, marginRight: 8 }}>
                                    Actualizar
                                </Button>
                                <Button danger type="text" onClick={() => navigate('/enlaces')} style={{ flex: 1 }}>
                                    Volver
                                </Button>
                            </>
                        )}
                        {editable && (
                            <>
                                <Button type="primary" onClick={handleSave} style={{ flex: 1, marginRight: 8 }}>
                                    Guardar
                                </Button>
                                <Button danger type="text" onClick={handleCancel} style={{ flex: 1 }}>
                                    Cancelar
                                </Button>
                            </>
                        )}
                    </Col>
                </Row>
            </Form>

            <div style={{ marginTop: '40px' }}>
                <h3>Contratos</h3>
                <Table
                    columns={contratoColumns}
                    dataSource={enlaceData.contratos}
                    pagination={false}
                    rowKey="key"
                    bordered
                    expandedRowRender={expandedRowRender}
                />
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Popconfirm
                    title="¿Estás seguro de que deseas eliminar este enlace?"
                    icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                    onConfirm={handleDelete}
                    okText="Sí"
                    cancelText="No"
                    okButtonProps={{ danger: true }}
                >
                    <Button type="danger" icon={<DeleteOutlined />}>
                        Eliminar Enlace
                    </Button>
                </Popconfirm>
            </div>

            <EditContractDrawer
                contrato={selectedContract}
                visible={drawerVisible}
                onClose={() => setDrawerVisible(false)}
                onSave={handleSaveContract}
            />
        </>
    );
};

export default ViewEnlace;
