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
import {
    EditOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    ArrowLeftOutlined,
    CheckCircleOutlined, CloseCircleOutlined, QuestionCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';
import Cookies from 'js-cookie';
import EditContractDrawer from '../components/EditContractDrawer';
import LoadingSpinner from "../components/LoadingSpinner";
import { ExclamationCircleOutlined as WarningOutlined } from "@ant-design/icons/lib/icons";
import EnlaceTable from "../components/EnlaceTable";

const { Text } = Typography;
const { Title } = Typography;

const ViewAllEnlace = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const token = Cookies.get('token');

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
    const [estatus, setEstatus] = useState(null);
    const [reloadTable, setReloadTable] = useState(false); // Nuevo estado para recargar la tabla

    const fetchData = async () => {
        try {
            const enlaceResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URI}enlaces/detallados/completo/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const enlace = enlaceResponse.data.enlace;

            setEnlaceData({
                nombre: enlace.nombre,
                apellidoPaterno: enlace.apellidoP,
                apellidoMaterno: enlace.apellidoM,
                correo: enlace.correo,
                telefono: enlace.telefono,
                dependencia: enlace.dependenciaId,
                direccion: enlace.direccionId,
                adscripcion: enlace.adscripcionId,
                cargo: enlace.cargoId,
                contratos: [],
            });

            setEstatus(enlace.estatus);
            await loadDropdownOptions(enlace.dependenciaId, enlace.direccionId);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener los datos del enlace:', error);
            message.error('Hubo un error al obtener los datos del enlace.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        fetchContracts();
    }, [id, token]);

    const loadDropdownOptions = async (dependenciaId, direccionId) => {
        try {
            const [dependenciasRes, cargosRes] = await Promise.all([
                axios.get(`${process.env.REACT_APP_BACKEND_URI}dependencias`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }),
                axios.get(`${process.env.REACT_APP_BACKEND_URI}cargos`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }),
            ]);
            setDependenciaOptions(dependenciasRes.data.dependencias);
            setCargoOptions(cargosRes.data.cargos);

            if (dependenciaId) {
                const direccionesRes = await axios.get(`${process.env.REACT_APP_BACKEND_URI}direcciones/dependencias/${dependenciaId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setDireccionOptions(direccionesRes.data.direcciones);

                if (direccionId) {
                    const departamentosRes = await axios.get(`${process.env.REACT_APP_BACKEND_URI}departamentos/direcciones/${direccionId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
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
                    Authorization: `Bearer ${token}`
                }
            });
            setDireccionOptions(response.data.direcciones);
            setDepartamentoOptions([]);
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
                    Authorization: `Bearer ${token}`
                }
            });
            setDepartamentoOptions(response.data.departamentos);
        } catch (error) {
            console.error('Error al obtener los departamentos:', error);
        }
    };

    const handleSave = async () => {
        try {
            if (!enlaceData.nombre || !enlaceData.apellidoPaterno || !enlaceData.apellidoMaterno || !enlaceData.correo || !enlaceData.telefono || !enlaceData.dependencia || !enlaceData.direccion || !enlaceData.adscripcion || !enlaceData.cargo) {
                message.error('Todos los campos son obligatorios');
                return;
            }
            const updateResponse = await axios.patch(`${process.env.REACT_APP_BACKEND_URI}enlaces/${id}`, enlaceData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (updateResponse.status === 200) {
                message.success('Datos actualizados correctamente');
                setReloadTable(true); // Indicar que se debe recargar la tabla
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
                    Authorization: `Bearer ${token}`
                },
                data: { estatus_id: 3 }
            });
            if (response.status === 200) {
                message.success('Enlace eliminado correctamente');
                navigate('/allEnlaces');
            } else {
                message.error('Error al eliminar el enlace.');
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
                    Authorization: `Bearer ${token}`
                }
            });
            const contratos = contratosResponse.data.contrato;

            if (contratosResponse.data.msg === "No se encontraron contratos") {
                return;
            }

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
            if (error.response && error.response.status === 404) {
                console.warn('No se encontraron contratos para este enlace.');
            } else {
                console.error('Error al obtener los contratos:', error);
                message.error('Hubo un error al obtener los contratos.');
            }
        }
    };

    const handleSaveContract = async (updatedContract) => {
        const updatedContracts = enlaceData.contratos.map(contract =>
            contract.key === updatedContract.key ? updatedContract : contract
        );
        setEnlaceData(prevState => ({ ...prevState, contratos: updatedContracts }));
        await fetchContracts();
        setDrawerVisible(false);
    };

    const reactivarEnlace = async (enlaceId) => {
        try {
            const response = await axios.patch(`${process.env.REACT_APP_BACKEND_URI}enlaces/restore/deleted`, {
                enlaceId: enlaceId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                message.success('Enlace reactivado correctamente');
                setEstatus(1); // Actualiza el estado a "Activo"
            } else {
                message.error('Error al reactivar el enlace.');
            }
        } catch (error) {
            console.error('Error al reactivar el enlace:', error);
            message.error('Hubo un error al reactivar el enlace.');
        }
    };

    const finalizarEnlace = async (enlaceId) => {
        try {
            const response = await axios.patch(`${process.env.REACT_APP_BACKEND_URI}enlaces/${enlaceId}`, {
                estatus: 2
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                message.success('Enlace finalizado correctamente');
                setEstatus(2); // Actualiza el estado a "Inactivo"
            } else {
                message.error('Error al finalizar el enlace.');
            }
        } catch (error) {
            console.error('Error al finalizar el enlace:', error);
            message.error('Hubo un error al finalizar el enlace.');
        }
    };


    const handleDeleteContract = async (id) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URI}contratos/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
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

    const renderStatusTag = (estatus) => {
        switch (estatus) {
            case 1:
                return (
                    <Tag color="green" icon={<CheckCircleOutlined />} style={{ height: '32px', display: 'flex', alignItems: 'center', fontSize: "16px" }}>
                        Activo
                    </Tag>
                );
            case 2:
                return (
                    <Tag color="orange" icon={<WarningOutlined />} style={{ height: '32px', display: 'flex', alignItems: 'center', fontSize: "16px" }}>
                        Inactivo
                    </Tag>
                );
            case 3:
                return (
                    <Tag color="red" icon={<CloseCircleOutlined />} style={{ height: '32px', display: 'flex', alignItems: 'center', fontSize: "16px" }}>
                        Eliminado
                    </Tag>
                );
            default:
                return (
                    <Tag color="gray" icon={<QuestionCircleOutlined />} style={{ height: '32px', display: 'flex', alignItems: 'center', fontSize: "16px" }}>
                        Desconocido
                    </Tag>
                );
        }
    };

    const expandedRowRender = (record) => (
        <Text>{record.descripcion}</Text>
    );

    if (loading) {
        return (
            <LoadingSpinner />
        );
    }

    return (
        <>
            <div style={{padding: "24px"}}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Title level={3} style={{ margin: 0 }}>Detalles avanzados del enlace</Title>
                        <div style={{ marginLeft: "24px" }}>
                            {renderStatusTag(estatus)}
                        </div>
                    </div>
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/allEnlaces')}
                    >
                        Volver
                    </Button>
                </div>
                <Divider />

                <Form layout="vertical">
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
                                    value={enlaceData.dependencia}
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
                                    value={enlaceData.direccion}
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
                                    value={enlaceData.adscripcion}
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
                                    value={enlaceData.cargo}
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
                                    <Button
                                        type="primary"
                                        onClick={() => setEditable(true)}
                                        style={{ flex: 1, marginRight: 8 }}
                                        disabled={estatus !== 1}
                                    >
                                        Actualizar
                                    </Button>

                                    <Button danger type="text" onClick={() => navigate('/allEnlaces')} style={{ flex: 1 }}>
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
                <Row gutter={24}>
                    <Col span={12}>
                    </Col>
                    <Col span={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Button
                            type="primary"
                            style={{ backgroundColor: 'orange', borderColor: 'orange', marginRight: '16px', flex: 1 }}
                            disabled={estatus === 1}
                            onClick={() => reactivarEnlace(id)}
                        >
                            Reactivar Enlace
                        </Button>
                        <Button
                            type="primary"
                            style={{ backgroundColor: 'orange', borderColor: 'orange', flex: 1 }}
                            disabled={estatus !== 1}
                            onClick={() => finalizarEnlace(id)}
                        >
                            Finalizar Enlace
                        </Button>
                    </Col>
                </Row>

                <Divider />

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

                <Divider />

                <div>
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

                <div style={{ marginTop: "24px" }}>
                    <EnlaceTable enlaceId={id} reloadTable={reloadTable} onReloadComplete={() => setReloadTable(false)} onRestore={fetchData} />
                </div>
            </div>
        </>
    );
};

export default ViewAllEnlace;
