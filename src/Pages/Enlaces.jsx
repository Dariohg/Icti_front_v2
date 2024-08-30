import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Tag, Space, Typography, Divider, TreeSelect, Select, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import Cookies from "js-cookie";
import LoadingSpinner from "../components/LoadingSpinner";

const { Text, Title } = Typography;
const { SHOW_PARENT } = TreeSelect;
const { Option } = Select;

const Enlaces = () => {
    const navigate = useNavigate();
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [selectedTreeValues, setSelectedTreeValues] = useState([]);
    const [treeData, setTreeData] = useState([]);
    const [tipoInstalacionOptions, setTipoInstalacionOptions] = useState([]);
    const [selectedTipoInstalacion, setSelectedTipoInstalacion] = useState(null);

    const [loading, setLoading] = useState(true);
    const token = Cookies.get('token'); // Obtener el token desde las cookies

    const fetchTipoContratos = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}contratos/tipos-contrato`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const tipoContratos = response.data.tipoContrato;

            const treeDataPromises = tipoContratos.map(async (tipoContrato) => {
                if (tipoContrato.nombre === "Servicios de Telefonia" || tipoContrato.nombre === "Servicios de Internet" || tipoContrato.nombre === "RIG") {
                    return {
                        title: tipoContrato.nombre,
                        value: tipoContrato.nombre,
                        key: `tipo-${tipoContrato.id}`,
                    };
                } else {
                    const versionesResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URI}contratos/versiones/${tipoContrato.id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const versiones = versionesResponse.data.versiones.map(version => ({
                        title: version.descripcion,
                        value: version.descripcion,
                        key: `version-${version.id}`,
                    }));

                    return {
                        title: tipoContrato.nombre,
                        value: tipoContrato.nombre,
                        key: `tipo-${tipoContrato.id}`,
                        children: versiones,
                    };
                }
            });
            setLoading(false);
            const resolvedTreeData = await Promise.all(treeDataPromises);
            setTreeData(resolvedTreeData);

        } catch (error) {
            console.error('Error al obtener los tipos de contrato:', error);
            message.error('Hubo un error al obtener los tipos de contrato');
        }
    };

    const fetchTipoInstalacion = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}contratos/tipos-instalacion`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const tipoInstalacion = response.data.tipoInstalacion;
            setTipoInstalacionOptions(tipoInstalacion);
        } catch (error) {
            console.error('Error al obtener los tipos de instalación:', error);
            message.error('Hubo un error al obtener los tipos de instalación');
        }
    };

    const fetchData = async () => {
        try {
            // Solicitud para obtener los enlaces
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}enlaces/detallados?estatus=1`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const enlacesData = response.data.enlaces;

            // Solicitud para obtener los contratos
            const contratosResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URI}contratos/detallados`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const contratosData = contratosResponse.data.contratos;

            // Mapear los enlaces con sus respectivos contratos
            const enlacesMapped = enlacesData.map(enlace => ({
                key: enlace.id,
                nombre: `${enlace.nombre} ${enlace.apellidoP} ${enlace.apellidoM}`,
                correo: enlace.correo,
                telefono: enlace.telefono,
                dependencia: enlace.dependencia, // Añadido
                direccion: enlace.direccion,
                cargo: enlace.cargo,
                contratos: contratosData.filter(contrato => contrato.enlaceId === enlace.id),
            }));

            setOriginalData(enlacesMapped);
            setFilteredData(enlacesMapped);
        } catch (error) {
            // Ignorar el error 404 y manejar otros errores
            if (error.response && error.response.status !== 404) {
                console.error('Error fetching data:', error);
            }
        }
    };


    useEffect(() => {
        fetchData();
        fetchTipoContratos();
        fetchTipoInstalacion();
    }, []);

    const handleExpand = (expanded, record) => {
        let newExpandedRowKeys = [...expandedRowKeys];

        if (expanded) {
            if (newExpandedRowKeys.length >= 2) {
                newExpandedRowKeys.shift();
            }
            newExpandedRowKeys.push(record.key);
        } else {
            newExpandedRowKeys = newExpandedRowKeys.filter(key => key !== record.key);
        }

        setExpandedRowKeys(newExpandedRowKeys);
    };

    const handleSearch = (e) => {
        const { value } = e.target;
        setSearchText(value);
        filterData(value, selectedTreeValues, selectedTipoInstalacion);
    };

    const handleTreeSelectChange = (value) => {
        setSelectedTreeValues(value);
        filterData(searchText, value, selectedTipoInstalacion);
    };

    const handleTipoInstalacionChange = (value) => {
        setSelectedTipoInstalacion(value);
        filterData(searchText, selectedTreeValues, value);
    };

    const filterData = (searchText, selectedTreeValues, selectedTipoInstalacion) => {
        let filtered = originalData;

        // Filtrado por nombre
        if (searchText) {
            filtered = filtered.filter((item) =>
                item.nombre.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        // Filtrado por tipo de contrato y versión de contrato (todos deben coincidir)
        if (selectedTreeValues.length > 0) {
            filtered = filtered.filter((item) =>
                selectedTreeValues.every(value =>
                    item.contratos.some(contrato =>
                        contrato.tipoContrato === value || contrato.versionContrato === value
                    )
                )
            );
        }

        // Filtrado por tipo de instalación
        if (selectedTipoInstalacion) {
            filtered = filtered.filter((item) =>
                item.contratos.some(contrato => contrato.ubicacion === selectedTipoInstalacion)
            );
        }

        setFilteredData(filtered);
    };

    const expandedRowRender = (record) => {
        const subTableColumns = [
            {
                title: 'Fecha de contrato',
                dataIndex: 'fechaContrato',
                key: 'fechaContrato',
                render: (text) => moment(text).format('YYYY-MM-DD'),
                align: 'center',
            },
            { title: 'Tipo de instalación', dataIndex: 'ubicacion', key: 'ubicacion', align: 'center' },
            { title: 'Tipo de contrato', dataIndex: 'tipoContrato', key: 'tipoContrato', align: 'center' },
            { title: 'Versión de contrato', dataIndex: 'versionContrato', key: 'versionContrato', align: 'center' },
            {
                title: 'Estatus',
                dataIndex: 'estatus',
                key: 'estatus',
                render: estatus => (
                    <Tag color={estatus === 1 ? 'green' : 'red'}>
                        {estatus === 1 ? 'ACTIVO' : 'INACTIVO'}
                    </Tag>
                ),
                align: 'center',
            },
        ];

        const limitedData = record.contratos.slice(0, 2);
        const hasMore = record.contratos.length > 2;

        return (
            <>
                <Table columns={subTableColumns} dataSource={limitedData} pagination={false} />
                {hasMore && (
                    <Text type="secondary" style={{ marginTop: '10px', display: 'block', textAlign: 'center' }}>
                        Hay más información disponible. Haz clic en "Ver" para ver la información completa.
                    </Text>
                )}
            </>
        );
    };

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
            align: 'center',
        },
        {
            title: 'Correo Electrónico',
            dataIndex: 'correo',
            key: 'correo',
            align: 'center',
        },
        {
            title: 'Número de Teléfono',
            dataIndex: 'telefono',
            key: 'telefono',
            align: 'center',
        },
        {
            title: 'Dependencia', // Añadido
            dataIndex: 'dependencia',
            key: 'dependencia',
            align: 'center',
        },
        {
            title: 'Dirección',
            dataIndex: 'direccion',
            key: 'direccion',
            align: 'center',
        },
        {
            title: 'Cargo',
            dataIndex: 'cargo',
            key: 'cargo',
            align: 'center',
        },
        {
            title: 'Acción',
            key: 'action',
            render: (text, record) => (
                <Space size="middle" align="center">
                    <Button type="link" icon={<EyeOutlined />} onClick={() => navigate(`/viewEnlace/${record.key}`)}>
                        Ver
                    </Button>
                </Space>
            ),
            align: 'center',
        },
    ];

    if (loading) {
        return (
            <LoadingSpinner/>
        );
    }

    return (
        <div>
            <Title level={2}>Enlaces</Title>
            <Divider style={{ marginTop: '20px' }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 16 }}>
                <TreeSelect
                    treeData={treeData}
                    value={selectedTreeValues}
                    onChange={handleTreeSelectChange}
                    treeCheckable={true}
                    showCheckedStrategy={SHOW_PARENT}
                    placeholder="Filtrar por tipo de contrato"
                    style={{ width: 300, marginRight: '10px' }}
                    allowClear
                />
                <Select
                    placeholder="Filtrar por tipo de instalación"
                    onChange={handleTipoInstalacionChange}
                    style={{ width: 200, marginRight: '10px' }}
                    allowClear
                >
                    {tipoInstalacionOptions.map(option => (
                        <Option key={option.id} value={option.nombre}>{option.nombre}</Option>
                    ))}
                </Select>
                <Input
                    placeholder="Buscar por nombre"
                    value={searchText}
                    onChange={handleSearch}
                    style={{ width: 300 }}
                    prefix={<SearchOutlined />}
                />
            </div>
            <Table
                columns={columns}
                expandable={{
                    expandedRowRender,
                    expandedRowKeys,
                    onExpand: handleExpand,
                }}
                dataSource={filteredData}
                rowKey="key"
                pagination={{ position: ['bottomRight'], pageSize: 10 }}
                bordered
            />
        </div>
    );
};

export default Enlaces;
