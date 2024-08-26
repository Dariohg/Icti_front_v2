import React, { useState } from 'react';
import { Card, Row, Col, Button, Space, Divider, Typography, Input } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined, DeleteOutlined, EditOutlined, ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import EditUserDrawer from '../components/EditUserDrawer'; // Importa el drawer

const { Title } = Typography;

const Usuarios = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Datos simulados de usuarios
    const usuarios = [
        {
            nombre: "Juan Pérez",
            correo: "juan.perez@example.com",
            telefono: "555-1234",
            dependencia: "Departamento de TI",
            direccion: "Calle Falsa 123",
            departamento: "Sistemas",
            cargo: "Desarrollador",
            nombreUsuario: "jperez",
        },
        {
            nombre: "María López",
            correo: "maria.lopez@example.com",
            telefono: "555-5678",
            dependencia: "Recursos Humanos",
            direccion: "Avenida Siempre Viva 742",
            departamento: "Personal",
            cargo: "Gerente",
            nombreUsuario: "mlopez",
        }
        // Agrega más usuarios según sea necesario
    ];

    const filteredUsers = usuarios.filter(usuario =>
        usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditClick = (usuario) => {
        setSelectedUser(usuario);
        setDrawerVisible(true);
    };

    const handleSaveUser = (updatedUser) => {
        // Aquí puedes manejar la lógica para actualizar el usuario en el estado o enviarlo al backend
        console.log('Usuario actualizado:', updatedUser);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px' }}>
                <Title level={3} style={{ margin: 0 }}>Usuarios</Title>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Input
                        placeholder="Buscar usuario..."
                        prefix={<SearchOutlined />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ marginRight: '16px' }}
                    />
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/home')}
                    >
                        Volver
                    </Button>
                </div>
            </div>
            <Divider />
            <Row gutter={[16, 16]} style={{ flexDirection: 'column' }}>
                {filteredUsers.map((usuario, index) => (
                    <Col span={24} key={index}>
                        <UserCard usuario={usuario} onEditClick={handleEditClick} />
                    </Col>
                ))}
            </Row>

            {selectedUser && (
                <EditUserDrawer
                    visible={drawerVisible}
                    onClose={() => setDrawerVisible(false)}
                    usuario={selectedUser}
                    onSave={handleSaveUser}
                />
            )}
        </div>
    );
};

const UserCard = ({ usuario, onEditClick }) => {
    return (
        <Card
            title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{usuario.nombre}</span>
                    <Space>
                        <Button icon={<EditOutlined />} type="text" onClick={() => onEditClick(usuario)} />
                        <Button icon={<DeleteOutlined />} type="text" danger />
                    </Space>
                </div>
            }
            bordered={false}
            style={{ width: '100%' }}
        >
            <Row gutter={16}>
                <Col span={12}>
                    <p><strong>Correo electrónico:</strong> {usuario.correo}</p>
                    <p><strong>Teléfono:</strong> {usuario.telefono}</p>
                    <p><strong>Dependencia:</strong> {usuario.dependencia}</p>
                    <p><strong>Dirección:</strong> {usuario.direccion}</p>
                </Col>
                <Col span={12}>
                    <p><strong>Departamento:</strong> {usuario.departamento}</p>
                    <p><strong>Cargo:</strong> {usuario.cargo}</p>
                    <p><strong>Nombre de usuario:</strong> {usuario.nombreUsuario}</p>

                </Col>
            </Row>
        </Card>
    );
};

export default Usuarios;
