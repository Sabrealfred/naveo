import { Table, Tag, Button, Space, Card, Row, Col, Switch, Select, Avatar, Modal, Form, Input, Checkbox } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { useState } from 'react';

const UsersPermissionsPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'Usuario',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          <Avatar src={record.avatar}>{text.charAt(0)}</Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <div style={{ fontSize: 12, color: '#999' }}>{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        const colorMap: Record<string, string> = {
          'super_admin': 'purple',
          'admin': 'blue',
          'manager': 'green',
          'analyst': 'orange',
        };
        return <Tag color={colorMap[role]}>{role.replace('_', ' ').toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Permisos',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: string[]) => (
        <Space size={[0, 4]} wrap>
          {permissions.slice(0, 3).map((perm, idx) => (
            <Tag key={idx}>{perm}</Tag>
          ))}
          {permissions.length > 3 && <Tag>+{permissions.length - 3} más</Tag>}
        </Space>
      ),
    },
    {
      title: 'Último Acceso',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean, record: any) => (
        <Switch checked={status} onChange={() => console.log('Toggle status')} />
      ),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />}>Editar</Button>
          <Button type="link" size="small" icon={<LockOutlined />}>Permisos</Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>Eliminar</Button>
        </Space>
      ),
    },
  ];

  const usersData = [
    {
      key: '1',
      name: 'John Admin',
      email: 'john@naveo.com',
      role: 'super_admin',
      permissions: ['all'],
      lastLogin: '2024-11-09 14:30',
      status: true,
    },
    {
      key: '2',
      name: 'Sarah Manager',
      email: 'sarah@naveo.com',
      role: 'admin',
      permissions: ['funds.manage', 'clients.view', 'users.manage', 'reports.view'],
      lastLogin: '2024-11-09 12:15',
      status: true,
    },
    {
      key: '3',
      name: 'Mike Analyst',
      email: 'mike@naveo.com',
      role: 'analyst',
      permissions: ['funds.view', 'clients.view', 'reports.view'],
      lastLogin: '2024-11-08 16:45',
      status: true,
    },
  ];

  const rolesData = [
    {
      key: '1',
      name: 'Super Admin',
      users: 1,
      permissions: 'Acceso total',
      description: 'Control completo de la plataforma',
    },
    {
      key: '2',
      name: 'Admin',
      users: 3,
      permissions: 'Gestión de fondos, clientes y usuarios',
      description: 'Administración general',
    },
    {
      key: '3',
      name: 'Manager',
      users: 5,
      permissions: 'Gestión de fondos y clientes',
      description: 'Gestores de fondos',
    },
    {
      key: '4',
      name: 'Analyst',
      users: 8,
      permissions: 'Solo lectura',
      description: 'Analistas y visualización',
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Usuarios y Permisos</h1>

      {/* Stats */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <div style={{ fontSize: 24, fontWeight: 600 }}>17</div>
            <div style={{ color: '#999' }}>Total Usuarios</div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <div style={{ fontSize: 24, fontWeight: 600 }}>15</div>
            <div style={{ color: '#999' }}>Usuarios Activos</div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <div style={{ fontSize: 24, fontWeight: 600 }}>4</div>
            <div style={{ color: '#999' }}>Roles Definidos</div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <div style={{ fontSize: 24, fontWeight: 600 }}>2</div>
            <div style={{ color: '#999' }}>Pendientes</div>
          </Card>
        </Col>
      </Row>

      {/* Usuarios */}
      <Card
        title="Usuarios"
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>Agregar Usuario</Button>}
        style={{ marginBottom: 24 }}
      >
        <Table columns={columns} dataSource={usersData} pagination={false} />
      </Card>

      {/* Roles */}
      <Card title="Roles y Permisos">
        <Table
          columns={[
            { title: 'Rol', dataIndex: 'name', key: 'name' },
            { title: 'Usuarios', dataIndex: 'users', key: 'users' },
            { title: 'Permisos', dataIndex: 'permissions', key: 'permissions' },
            { title: 'Descripción', dataIndex: 'description', key: 'description' },
            {
              title: 'Acciones',
              key: 'actions',
              render: () => (
                <Space>
                  <Button type="link" size="small">Editar</Button>
                  <Button type="link" size="small">Permisos</Button>
                </Space>
              ),
            },
          ]}
          dataSource={rolesData}
          pagination={false}
        />
      </Card>

      {/* Modal Crear Usuario */}
      <Modal
        title="Agregar Nuevo Usuario"
        open={isModalVisible}
        onOk={() => {
          form.validateFields().then(() => {
            setIsModalVisible(false);
            form.resetFields();
          });
        }}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Nombre" name="name" rules={[{ required: true }]}>
            <Input prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item label="Rol" name="role" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="manager">Manager</Select.Option>
              <Select.Option value="analyst">Analyst</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Permisos" name="permissions">
            <Checkbox.Group>
              <Space direction="vertical">
                <Checkbox value="funds.manage">Gestionar Fondos</Checkbox>
                <Checkbox value="clients.manage">Gestionar Clientes</Checkbox>
                <Checkbox value="users.manage">Gestionar Usuarios</Checkbox>
                <Checkbox value="reports.view">Ver Reportes</Checkbox>
              </Space>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UsersPermissionsPage;
