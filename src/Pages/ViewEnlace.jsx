import React, { useState, useEffect } from 'react';
import { Input, Button, Form, Row, Col, Table, Tag, Space, Typography, message, Popconfirm, Divider, Select } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import EditContractDrawer from '../components/EditContractDrawer';

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
                const enlaceResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URI}enlace/${id}`);
                const enlace = enlaceResponse.data;

                const contratosResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URI}contrato/byId/${id}`);
                const contratos = contratosResponse.data;

                const contratosMapped = contratos.map(contrato => ({
                    key: contrato.idContrato,
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
                    dependencia: enlace.direccion.dependencia.idDependencia, // El ID de la dependencia
                    direccion: enlace.direccion.idDireccion, // El ID de la dirección
                    adscripcion: enlace.departamento.idDepartamento, // El ID del departamento
                    cargo: enlace.cargoEnlace.idCargo, // El ID del cargo
                    contratos: contratosMapped,
                });

                // Cargar opciones de dropdowns
                await loadDropdownOptions(enlace.direccion.dependencia.idDependencia, enlace.direccion.idDireccion);
            } catch (error) {
                console.error('Error al obtener los datos del enlace:', error);
                message.error('Hubo un error al obtener los datos del enlace.');
            }
        };

        fetchData();
    }, [id]);

    const loadDropdownOptions = async (dependenciaId, direccionId) => {
        try {
            const [dependenciasRes, cargosRes] = await Promise.all([
                axios.get(`${process.env.REACT_APP_BACKEND_URI}dependencia/`),
                axios.get(`${process.env.REACT_APP_BACKEND_URI}cargo/`),
            ]);
            setDependenciaOptions(dependenciasRes.data);
            setCargoOptions(cargosRes.data);

            // Cargar direcciones y departamentos en cascada
            if (dependenciaId) {
                const direccionesRes = await axios.get(`${process.env.REACT_APP_BACKEND_URI}direccion/direccionById?dependencia_id=${dependenciaId}`);
                setDireccionOptions(direccionesRes.data);

                if (direccionId) {
                    const departamentosRes = await axios.get(`${process.env.REACT_APP_BACKEND_URI}departamento/departamentoById?id_direccion=${direccionId}`);
                    setDepartamentoOptions(departamentosRes.data);
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
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}direccion/direccionById?dependencia_id=${value}`);
            setDireccionOptions(response.data);
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
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}departamento/departamentoById?id_direccion=${value}`);
            setDepartamentoOptions(response.data);
        } catch (error) {
            console.error('Error al obtener los departamentos:', error);
        }
    };

    const handleSave = async () => {
        console.log('Datos al guardar:', enlaceData);
        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URI}enlace/${id}`, enlaceData);
            message.success('Enlace actualizado correctamente');
            setEditable(false);
        } catch (error) {
            console.error('Error al guardar los datos del enlace:', error);
            message.error('Hubo un error al guardar los datos del enlace.');
        }
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

    const handleSaveContract = async (updatedContract) => {
        const updatedContracts = enlaceData.contratos.map(contract =>
            contract.key === updatedContract.key ? updatedContract : contract
        );
        setEnlaceData(prevState => ({ ...prevState, contratos: updatedContracts }));
        setDrawerVisible(false);
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
                    <Button icon={<EditOutlined />} onClick={() => { setSelectedContract(record); setDrawerVisible(true); }}>
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
                                options={dependenciaOptions.map(dep => ({ value: dep.idDependencia, label: dep.nombreDependencia }))}
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
                                options={direccionOptions.map(dir => ({ value: dir.idDireccion, label: dir.nombre }))}
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
                                options={departamentoOptions.map(dep => ({ value: dep.idDepartamento, label: dep.nombreDepartamento }))}
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
                                options={cargoOptions.map(cargo => ({ value: cargo.idCargo, label: cargo.nombreCargo }))}
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

            <Divider style={{ marginTop: '40px' }} />

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
            />
        </>
    );
};

export default ViewEnlace;
