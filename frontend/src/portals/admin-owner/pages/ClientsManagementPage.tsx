import { useState } from 'react';
import { Table, Tag, Button, Space, Card, Row, Col, Statistic, Input, Select, Avatar, Drawer, Descriptions, Timeline } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, UserOutlined, MailOutlined, PhoneOutlined, BankOutlined } from '@ant-design/icons';
import { AdvancedFilter } from '../../../components/filters';
import { ProgressRing } from '../../../components/common';

const ClientsManagementPage = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const columns = [
    {
      title: 'Cliente',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          <Avatar style={{ backgroundColor: record.color }}>{text.charAt(0)}</Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <div style={{ fontSize: 12, color: '#999' }}>{record.type}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Fondos',
      dataIndex: 'funds',
      key: 'funds',
      render: (funds: string[]) => (
        <div>
          {funds.map((fund, idx) => (
            <Tag key={idx}>{fund}</Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'AUM Total',
      dataIndex: 'totalAUM',
      key: 'totalAUM',
      sorter: (a: any, b: any) => parseFloat(a.totalAUM) - parseFloat(b.totalAUM),
      render: (value: string) => `$${value}M`,
    },
    {
      title: 'Inversionistas',
      dataIndex: 'investors',
      key: 'investors',
    },
    {
      title: 'KYB Status',
      dataIndex: 'kybStatus',
      key: 'kybStatus',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          approved: 'green',
          pending: 'orange',
          rejected: 'red',
        };
        return <Tag color={colorMap[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Fecha Registro',
      dataIndex: 'registeredAt',
      key: 'registeredAt',
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          active: 'green',
          inactive: 'default',
          suspended: 'red',
        };
        return <Tag color={colorMap[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewClient(record)}
          >
            Ver
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
          >
            Editar
          </Button>
        </Space>
      ),
    },
  ];

  const clientsData = [
    {
      key: '1',
      name: 'Alpha Capital LLC',
      type: 'Asset Manager',
      email: 'contact@alphacapital.com',
      funds: ['Alpha Capital Fund'],
      totalAUM: '25.5',
      investors: 247,
      kybStatus: 'approved',
      registeredAt: '2023-01-15',
      status: 'active',
      color: '#1890ff',
      phone: '+1 (555) 123-4567',
      country: 'United States',
      address: '123 Wall Street, New York, NY 10005',
    },
    {
      key: '2',
      name: 'Beta Investments',
      type: 'Hedge Fund',
      email: 'info@betainv.com',
      funds: ['Beta Investments', 'Beta DeFi Fund'],
      totalAUM: '32.4',
      investors: 312,
      kybStatus: 'approved',
      registeredAt: '2023-02-20',
      status: 'active',
      color: '#52c41a',
      phone: '+1 (555) 234-5678',
      country: 'United States',
      address: '456 Market Street, San Francisco, CA 94102',
    },
    {
      key: '3',
      name: 'Gamma Properties',
      type: 'Real Estate Fund',
      email: 'hello@gammaprop.com',
      funds: ['Gamma Fund'],
      totalAUM: '32.1',
      investors: 189,
      kybStatus: 'pending',
      registeredAt: '2024-10-01',
      status: 'active',
      color: '#722ed1',
      phone: '+44 20 1234 5678',
      country: 'United Kingdom',
      address: '789 London Road, London, UK',
    },
    {
      key: '4',
      name: 'Delta Partners',
      type: 'Multi-Strategy',
      email: 'partners@delta.com',
      funds: ['Delta Partners', 'Delta Stable'],
      totalAUM: '93.9',
      investors: 876,
      kybStatus: 'approved',
      registeredAt: '2023-04-05',
      status: 'active',
      color: '#fa8c16',
      phone: '+41 22 123 4567',
      country: 'Switzerland',
      address: 'Rue de Geneva, Geneva, Switzerland',
    },
  ];

  const handleViewClient = (client: any) => {
    setSelectedClient(client);
    setDrawerVisible(true);
  };

  const progressItems = [
    { label: 'Active Clients', value: 85, color: '#52c41a' },
    { label: 'KYB Approved', value: 92, color: '#1890ff' },
    { label: 'Compliance Score', value: 95, color: '#722ed1' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Gestión de Clientes</h1>
        <Button type="primary" icon={<PlusOutlined />}>
          Agregar Cliente
        </Button>
      </div>

      {/* Estadísticas */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total de Clientes"
              value={clientsData.length}
              suffix="clientes"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="AUM Total"
              value={183.9}
              prefix="$"
              suffix="M"
              precision={1}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Inversionistas"
              value={1624}
            />
          </Card>
        </Col>
      </Row>

      {/* Progress Rings */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <ProgressRing
            title="Métricas de Clientes"
            items={progressItems}
          />
        </Col>
      </Row>

      {/* Filtros */}
      <AdvancedFilter
        onFilter={(values) => console.log('Filter:', values)}
        onClear={() => console.log('Clear')}
        showDateRange={false}
        showType={false}
        customFilters={
          <>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Input placeholder="Buscar por nombre..." prefix={<UserOutlined />} />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select placeholder="Tipo de Cliente" style={{ width: '100%' }} allowClear>
                <Select.Option value="asset_manager">Asset Manager</Select.Option>
                <Select.Option value="hedge_fund">Hedge Fund</Select.Option>
                <Select.Option value="real_estate">Real Estate Fund</Select.Option>
                <Select.Option value="multi_strategy">Multi-Strategy</Select.Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select placeholder="KYB Status" style={{ width: '100%' }} allowClear>
                <Select.Option value="approved">Aprobado</Select.Option>
                <Select.Option value="pending">Pendiente</Select.Option>
                <Select.Option value="rejected">Rechazado</Select.Option>
              </Select>
            </Col>
          </>
        }
      />

      {/* Tabla */}
      <Card>
        <Table
          columns={columns}
          dataSource={clientsData}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} clientes`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Drawer de detalles */}
      <Drawer
        title="Detalles del Cliente"
        placement="right"
        width={640}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {selectedClient && (
          <div>
            <Space style={{ marginBottom: 24 }}>
              <Avatar size={64} style={{ backgroundColor: selectedClient.color }}>
                {selectedClient.name.charAt(0)}
              </Avatar>
              <div>
                <h2 style={{ margin: 0 }}>{selectedClient.name}</h2>
                <Tag color="blue">{selectedClient.type}</Tag>
              </div>
            </Space>

            <Descriptions title="Información General" column={1} bordered>
              <Descriptions.Item label={<span><MailOutlined /> Email</span>}>
                {selectedClient.email}
              </Descriptions.Item>
              <Descriptions.Item label={<span><PhoneOutlined /> Teléfono</span>}>
                {selectedClient.phone}
              </Descriptions.Item>
              <Descriptions.Item label="País">
                {selectedClient.country}
              </Descriptions.Item>
              <Descriptions.Item label="Dirección">
                {selectedClient.address}
              </Descriptions.Item>
              <Descriptions.Item label="KYB Status">
                <Tag color={selectedClient.kybStatus === 'approved' ? 'green' : 'orange'}>
                  {selectedClient.kybStatus.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Estado">
                <Tag color="green">{selectedClient.status.toUpperCase()}</Tag>
              </Descriptions.Item>
            </Descriptions>

            <Descriptions title="Métricas" column={1} bordered style={{ marginTop: 24 }}>
              <Descriptions.Item label={<span><BankOutlined /> Fondos</span>}>
                {selectedClient.funds.join(', ')}
              </Descriptions.Item>
              <Descriptions.Item label="AUM Total">
                ${selectedClient.totalAUM}M
              </Descriptions.Item>
              <Descriptions.Item label="Inversionistas">
                {selectedClient.investors}
              </Descriptions.Item>
              <Descriptions.Item label="Fecha de Registro">
                {selectedClient.registeredAt}
              </Descriptions.Item>
            </Descriptions>

            <Card title="Historial de Actividad" style={{ marginTop: 24 }}>
              <Timeline
                items={[
                  {
                    color: 'green',
                    children: 'KYB aprobado - 2023-01-20',
                  },
                  {
                    color: 'blue',
                    children: 'Nuevo fondo agregado - 2023-03-15',
                  },
                  {
                    color: 'blue',
                    children: '100 nuevos inversionistas - 2023-06-01',
                  },
                  {
                    color: 'green',
                    children: 'AUM alcanzó $25M - 2023-09-10',
                  },
                ]}
              />
            </Card>

            <Space style={{ marginTop: 24, width: '100%', justifyContent: 'flex-end' }}>
              <Button>Editar</Button>
              <Button type="primary">Contactar</Button>
            </Space>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default ClientsManagementPage;
