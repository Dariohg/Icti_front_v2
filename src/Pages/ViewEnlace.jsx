import React, { useState, useEffect } from 'react';
import {
    Input,
    Button,
    Form,
    Row,
    Col,
    Table,
    Tag,
    Space,
    Typography,
    message,
    Popconfirm,
    Divider,
    Select,
    Spin
} from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import {EditOutlined, DeleteOutlined, ExclamationCircleOutlined, ArrowLeftOutlined} from '@ant-design/icons';
import axios from 'axios';
import Cookies from 'js-cookie';
import EditContractDrawer from '../components/EditContractDrawer';

const { Text } = Typography;
const { Title } = Typography;

const ViewEnlace = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const token = Cookies.get('token'); // Obtener el token desde las cookies

    const [editable, setEditable] = useState(false);
    const [enlaceData, setEnlaceData] = useState({
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        correo: '',
        telefono: '',
        dependencia: null,
        direccion: null,
        adscripcion: null,
        cargo: null,
        contratos: [],
    });

    const [dependenciaOptions, setDependenciaOptions] = useState([]);
    const [direccionOptions, setDireccionOptions] = useState([]);
    const [departamentoOptions, setDepartamentoOptions] = useState([]);
    const [cargoOptions, setCargoOptions] = useState([]);

    const [selectedContract, setSelectedContract] = useState(null);
    const [drawerVisible, setDrawerVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const enlaceResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URI}enlaces/detallados/completo/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Agregar el token en los headers
                    }
                });
                const enlace = enlaceResponse.data.enlace;

                const contratosResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URI}contratos/detallados/enlaces/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Agregar el token en los headers
                    }
                });
                const contratos = contratosResponse.data.contrato;

                const contratosMapped = contratos.map(contrato => ({
                    key: contrato.id,
                    fechaContrato: contrato.fechaContrato.slice(0, 10), // Mostrar solo la fecha
                    tipoInstalacion: contrato.ubicacion,
                    tipoContrato: contrato.tipoContrato,
                    versionContrato: contrato.versionContrato,
                    estatus: contrato.estatus === 1 ? 'Activo' : 'Inactivo',
                    descripcion: contrato.descripcion,
                }));

                // Establecer los valores obtenidos desde el backend
                setEnlaceData({
                    nombre: enlace.nombre,
                    apellidoPaterno: enlace.apellidoP,
                    apellidoMaterno: enlace.apellidoM,
                    correo: enlace.correo,
                    telefono: enlace.telefono,
                    dependencia: enlace.dependenciaId, // El ID de la dependencia
                    direccion: enlace.direccionId, // El ID de la dirección
                    adscripcion: enlace.adscripcionId, // El ID del departamento
                    cargo: enlace.cargoId, // El ID del cargo
                    contratos: contratosMapped,
                });

                // Cargar opciones de dropdowns
                setLoading(false);
                await loadDropdownOptions(enlace.dependenciaId, enlace.direccionId);
            } catch (error) {
                console.error('Error al obtener los datos del enlace:', error);
                message.error('Hubo un error al obtener los datos del enlace.');
            }
        };

        fetchData();
    }, [id, token]);

    const loadDropdownOptions = async (dependenciaId, direccionId) => {
        try {
            const [dependenciasRes, cargosRes] = await Promise.all([
                axios.get(`${process.env.REACT_APP_BACKEND_URI}dependencias`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Agregar el token en los headers
                    }
                }),
                axios.get(`${process.env.REACT_APP_BACKEND_URI}cargos`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Agregar el token en los headers
                    }
                }),
            ]);
            setDependenciaOptions(dependenciasRes.data.dependencias);
            setCargoOptions(cargosRes.data.cargos);

            // Cargar direcciones y departamentos en cascada
            if (dependenciaId) {
                const direccionesRes = await axios.get(`${process.env.REACT_APP_BACKEND_URI}direcciones/dependencias/${dependenciaId}`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Agregar el token en los headers
                    }
                });
                setDireccionOptions(direccionesRes.data.direcciones);

                if (direccionId) {
                    const departamentosRes = await axios.get(`${process.env.REACT_APP_BACKEND_URI}departamentos/direcciones/${direccionId}`, {
                        headers: {
                            Authorization: `Bearer ${token}` // Agregar el token en los headers
                        }
                    });
                    setDepartamentoOptions(departamentosRes.data.departamentos);
                }
            }
        } catch (error) {
            console.error('Error al cargar las opciones de dropdown:', error);
        }
    };

    const handleDependenciaChange = async (value) => {
        setEnlaceData(prevState => ({
            ...prevState,
            dependencia: value,
            direccion: null,
            adscripcion: null,
        }));

        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}direcciones/dependencias/${value}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Agregar el token en los headers
                }
            });
            setDireccionOptions(response.data.direcciones);
            setDepartamentoOptions([]); // Limpiar adscripciones hasta que se seleccione una nueva dirección
        } catch (error) {
            console.error('Error al obtener las direcciones:', error);
        }
    };

    const handleDireccionChange = async (value) => {
        setEnlaceData(prevState => ({
            ...prevState,
            direccion: value,
            adscripcion: null,
        }));

        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}departamentos/direcciones/${value}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Agregar el token en los headers
                }
            });
            setDepartamentoOptions(response.data.departamentos);
        } catch (error) {
            console.error('Error al obtener los departamentos:', error);
        }
    };

    const handleSave = async () => {
        console.log('Datos al guardar:', enlaceData);
        try {
            if (!enlaceData.nombre || !enlaceData.apellidoPaterno || !enlaceData.apellidoMaterno || !enlaceData.correo || !enlaceData.telefono || !enlaceData.dependencia || !enlaceData.direccion || !enlaceData.adscripcion || !enlaceData.cargo) {
                message.error('Todos los campos son obligatorios');
                return;
            }
            const updateResponse = await axios.patch(`${process.env.REACT_APP_BACKEND_URI}enlaces/${id}`, enlaceData, {
                headers: {
                    Authorization: `Bearer ${token}` // Agregar el token en los headers
                }
            });
            if (updateResponse.status === 200) {
                message.success('Datos actualizados correctamente');
            } else {
                message.error('Error al actualizar los datos del enlace.');
            }
            setEditable(false);
        } catch (error) {
            console.error('Error al guardar los datos del enlace:', error);
            message.error('Hubo un error al guardar los datos del enlace.');
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URI}enlaces/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Agregar el token en los headers
                },
                data: { estatus_id: 3 }
            });
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

    const fetchContracts = async () => {
        try {
            const contratosResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URI}contratos/detallados/enlaces/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Agregar el token en los headers
                }
            });
            const contratos = contratosResponse.data.contrato;

            const contratosMapped = contratos.map(contrato => ({
                key: contrato.id,
                fechaContrato: contrato.fechaContrato.slice(0, 10),
                tipoInstalacion: contrato.ubicacion,
                tipoContrato: contrato.tipoContrato,
                versionContrato: contrato.versionContrato,
                estatus: contrato.estatus === 1 ? 'Activo' : 'Inactivo',
                descripcion: contrato.descripcion,
            }));

            setEnlaceData(prevState => ({ ...prevState, contratos: contratosMapped }));
        } catch (error) {
            console.error('Error al obtener los contratos:', error);
            message.error('Hubo un error al obtener los contratos.');
        }
    };

    const handleSaveContract = async (updatedContract) => {
        const updatedContracts = enlaceData.contratos.map(contract =>
            contract.key === updatedContract.key ? updatedContract : contract
        );
        setEnlaceData(prevState => ({ ...prevState, contratos: updatedContracts }));
        await fetchContracts(); // Recarga la lista de contratos después de guardar
        setDrawerVisible(false);
    };

    const handleDeleteContract = async (id) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URI}contratos/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Agregar el token en los headers
                }
            });
            if (response.status === 200) {
                setEnlaceData(prevState => ({
                    ...prevState,
                    contratos: prevState.contratos.filter(contrato => contrato.key !== id),
                }));
                setDrawerVisible(false);
            } else {
                message.error('Error al eliminar el contrato.');
            }
        } catch (error) {
            message.error('Error al eliminar el contrato. Por favor, inténtalo de nuevo.');
        }
    };

    const contratoColumns = [
        {
            title: 'Fecha de contrato',
            dataIndex: 'fechaContrato',
            key: 'fechaContrato',
        },
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
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                            console.log('Contrato seleccionado:', record); // Agrega un log para verificar el contrato seleccionado
                            setSelectedContract(record);
                            setDrawerVisible(true);
                        }}
                    >
                        Editar
                    </Button>
                </Space>
            ),
        },
    ];

    const expandedRowRender = (record) => (
        <Text>{record.descripcion}</Text>
    );

    if (loading) {
        return (
            <div className="spin-container">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px' }}>
                <Title level={3} style={{ margin: 0 }}>Detalles del enlace</Title>
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/enlaces')}
                >
                    Volver
                </Button>
            </div>
            <Divider/>

            <Form layout="vertical"
                  style={{ padding: '24px' }}
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label="Nombre">
                            <Input
                                name="nombre"
                                value={enlaceData.nombre}
                                onChange={(e) => setEnlaceData({ ...enlaceData, nombre: e.target.value })}
                                disabled={!editable}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Apellido Paterno">
                            <Input
                                name="apellidoPaterno"
                                value={enlaceData.apellidoPaterno}
                                onChange={(e) => setEnlaceData({ ...enlaceData, apellidoPaterno: e.target.value })}
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
                                onChange={(e) => setEnlaceData({ ...enlaceData, apellidoMaterno: e.target.value })}
                                disabled={!editable}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Correo Electrónico">
                            <Input
                                name="correo"
                                value={enlaceData.correo}
                                onChange={(e) => setEnlaceData({ ...enlaceData, correo: e.target.value })}
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
                                onChange={(e) => setEnlaceData({ ...enlaceData, telefono: e.target.value })}
                                disabled={!editable}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Dependencia">
                            <Select
                                value={enlaceData.dependencia}  // El valor es el ID de la dependencia
                                onChange={(value) => handleDependenciaChange(value)}
                                disabled={!editable}
                                options={dependenciaOptions.map(dep => ({ value: dep.id, label: dep.nombre }))}
                                showSearch
                                placeholder="Selecciona una dependencia"
                                optionFilterProp="label"
                                filterOption={(input, option) =>
                                    option.label.toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label="Dirección">
                            <Select
                                value={enlaceData.direccion}  // El valor es el ID de la dirección
                                onChange={(value) => handleDireccionChange(value)}
                                disabled={!editable}
                                options={direccionOptions.map(dir => ({ value: dir.id, label: dir.nombre }))}
                                showSearch
                                placeholder="Selecciona una dirección"
                                optionFilterProp="label"
                                filterOption={(input, option) =>
                                    option.label.toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Adscripción (Departamento)">
                            <Select
                                value={enlaceData.adscripcion}  // El valor es el ID de la adscripción
                                onChange={(value) => setEnlaceData({ ...enlaceData, adscripcion: value })}
                                disabled={!editable}
                                options={departamentoOptions.map(dep => ({ value: dep.id, label: dep.nombre }))}
                                showSearch
                                placeholder="Selecciona una adscripción"
                                optionFilterProp="label"
                                filterOption={(input, option) =>
                                    option.label.toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label="Cargo">
                            <Select
                                value={enlaceData.cargo}  // El valor es el ID del cargo
                                onChange={(value) => setEnlaceData({ ...enlaceData, cargo: value })}
                                disabled={!editable}
                                options={cargoOptions.map(cargo => ({ value: cargo.id, label: cargo.nombre }))}
                                showSearch
                                placeholder="Selecciona un cargo"
                                optionFilterProp="label"
                                filterOption={(input, option) =>
                                    option.label.toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {!editable ? (
                            <>
                                <Button type="primary" onClick={() => setEditable(true)} style={{ flex: 1, marginRight: 8 }}>
                                    Actualizar
                                </Button>
                                <Button danger type="text" onClick={() => navigate('/enlaces')} style={{ flex: 1 }}>
                                    Volver
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button type="primary" onClick={handleSave} style={{ flex: 1, marginRight: 8 }}>
                                    Guardar
                                </Button>
                                <Button danger type="text" onClick={() => setEditable(false)} style={{ flex: 1 }}>
                                    Cancelar
                                </Button>
                            </>
                        )}
                    </Col>
                </Row>
            </Form>

            <div style={{ padding: '24px' }}>
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

            <Divider/>

            <div style={{ textAlign: 'center' }}>
                <Popconfirm
                    title="¿Estás seguro de que deseas eliminar este enlace?"
                    icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                    onConfirm={handleDelete}
                    okText="Sí"
                    cancelText="No"
                    okButtonProps={{ danger: true }}
                >
                    <Button danger icon={<DeleteOutlined />}>
                        Eliminar Enlace
                    </Button>
                </Popconfirm>
            </div>

            <EditContractDrawer
                contrato={selectedContract}
                visible={drawerVisible}
                onClose={() => setDrawerVisible(false)}
                onSave={handleSaveContract}
                onDelete={() => {
                    if (selectedContract && selectedContract.key) {
                        console.log('Eliminando contrato con ID:', selectedContract.key);
                        handleDeleteContract(selectedContract.key);
                    } else {
                        message.error('No se puede eliminar el contrato. ID no definido.');
                    }
                }}
            />

        </>
    );
};

export default ViewEnlace;