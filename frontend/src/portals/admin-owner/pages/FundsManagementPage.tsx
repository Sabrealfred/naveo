import { useState } from 'react';
import { Table, Tag, Button, Space, Card, Row, Col, Statistic, Modal, Form, Input, Select, Timeline, Progress, Badge, Drawer } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, RocketOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { AdvancedFilter } from '../../../components/filters';
import { ComparisonChart } from '../../../components/common';

const FundsManagementPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingFund, setEditingFund] = useState<any>(null);
  const [tokenizationDrawerVisible, setTokenizationDrawerVisible] = useState(false);
  const [selectedFundTokenization, setSelectedFundTokenization] = useState<any>(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Nombre del Fondo',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{record.fundType}</div>
        </div>
      ),
    },
    {
      title: 'Gestor',
      dataIndex: 'manager',
      key: 'manager',
    },
    {
      title: 'AUM',
      dataIndex: 'aum',
      key: 'aum',
      sorter: (a: any, b: any) => parseFloat(a.aum) - parseFloat(b.aum),
      render: (value: string) => `$${value}M`,
    },
    {
      title: 'NAV',
      dataIndex: 'nav',
      key: 'nav',
      render: (value: string) => `$${value}`,
    },
    {
      title: 'Inversionistas',
      dataIndex: 'investors',
      key: 'investors',
    },
    {
      title: 'Performance (30d)',
      dataIndex: 'performance30d',
      key: 'performance30d',
      render: (value: number) => (
        <Tag color={value >= 0 ? 'green' : 'red'}>
          {value >= 0 ? '+' : ''}{value}%
        </Tag>
      ),
    },
    {
      title: 'Performance (YTD)',
      dataIndex: 'performanceYTD',
      key: 'performanceYTD',
      render: (value: number) => (
        <Tag color={value >= 0 ? 'green' : 'red'}>
          {value >= 0 ? '+' : ''}{value}%
        </Tag>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          active: 'green',
          pending: 'orange',
          suspended: 'red',
          closed: 'default',
        };
        const labelMap: Record<string, string> = {
          active: 'Activo',
          pending: 'Pendiente',
          suspended: 'Suspendido',
          closed: 'Cerrado',
        };
        return <Tag color={colorMap[status]}>{labelMap[status]}</Tag>;
      },
    },
    {
      title: 'Fecha Creación',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Tokenización',
      key: 'tokenization',
      render: (_: any, record: any) => {
        if (!record.tokenizationStatus) {
          return <Tag color="default">No iniciado</Tag>;
        }
        const statusConfig: Record<string, { color: string; text: string }> = {
          'in-progress': { color: 'blue', text: 'En Progreso' },
          'completed': { color: 'green', text: 'Completado' },
          'on-hold': { color: 'orange', text: 'En Pausa' },
        };
        const config = statusConfig[record.tokenizationStatus.status];
        return (
          <Space direction="vertical" size={0}>
            <Tag color={config.color}>{config.text}</Tag>
            {record.tokenizationStatus.progress !== undefined && (
              <div style={{ width: 80 }}>
                <Progress
                  percent={record.tokenizationStatus.progress}
                  size="small"
                  showInfo={false}
                />
              </div>
            )}
          </Space>
        );
      },
    },
    {
      title: 'Acciones',
      key: 'actions',
      fixed: 'right' as const,
      width: 240,
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
          >
            Ver
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Editar
          </Button>
          {record.tokenizationStatus && (
            <Button
              type="link"
              size="small"
              icon={<RocketOutlined />}
              onClick={() => handleViewTokenization(record)}
            >
              Timeline
            </Button>
          )}
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
          >
            Suspender
          </Button>
        </Space>
      ),
    },
  ];

  const fundsData = [
    {
      key: '1',
      id: 'FND-001',
      name: 'Alpha Capital Fund',
      fundType: 'Crypto Diversified',
      manager: 'John Smith',
      aum: '25.5',
      nav: '135.45',
      investors: 247,
      performance30d: 12.5,
      performanceYTD: 45.2,
      status: 'active',
      createdAt: '2023-01-15',
      tokenizationStatus: {
        status: 'completed',
        progress: 100,
        timeline: [
          { date: '2023-01-20', stage: 'Asset Origination', status: 'completed', details: 'Turkish SPV formation completed' },
          { date: '2023-02-10', stage: 'Regulatory Structure', status: 'completed', details: 'SEC Reg D 506(c) approved' },
          { date: '2023-02-25', stage: 'Smart Contract Development', status: 'completed', details: 'ERC-3643 deployed and audited' },
          { date: '2023-03-05', stage: 'Legal Documentation', status: 'completed', details: 'PPM and subscription agreements finalized' },
          { date: '2023-03-15', stage: 'Token Issuance', status: 'completed', details: 'Initial token issuance to 247 investors' },
        ],
      },
    },
    {
      key: '2',
      id: 'FND-002',
      name: 'Beta Investments',
      fundType: 'DeFi Focused',
      manager: 'Sarah Johnson',
      aum: '18.2',
      nav: '98.42',
      investors: 189,
      performance30d: 8.3,
      performanceYTD: 38.7,
      status: 'active',
      createdAt: '2023-02-20',
    },
    {
      key: '3',
      id: 'FND-003',
      name: 'Gamma Fund',
      fundType: 'Real Estate Token',
      manager: 'Michael Chen',
      aum: '32.1',
      nav: '156.23',
      investors: 312,
      performance30d: -2.1,
      performanceYTD: 28.9,
      status: 'active',
      createdAt: '2023-03-10',
      tokenizationStatus: {
        status: 'in-progress',
        progress: 68,
        timeline: [
          { date: '2024-09-01', stage: 'Asset Origination', status: 'completed', details: 'Turkish real estate portfolio identified and valued' },
          { date: '2024-09-15', stage: 'Regulatory Structure', status: 'completed', details: 'SPK approval obtained' },
          { date: '2024-10-05', stage: 'Smart Contract Development', status: 'completed', details: 'ERC-3643 deployed, security audit in progress' },
          { date: '2024-10-20', stage: 'Legal Documentation', status: 'in-progress', details: 'PPM v2.1 approved, subscription agreements being finalized' },
          { date: '2024-11-15', stage: 'US Investor Onboarding', status: 'pending', details: 'Accreditation verification and KYC pending' },
          { date: '2024-12-01', stage: 'Token Issuance', status: 'pending', details: 'Estimated token issuance date' },
        ],
      },
    },
    {
      key: '4',
      id: 'FND-004',
      name: 'Delta Partners',
      fundType: 'Multi-Strategy',
      manager: 'Emily Davis',
      aum: '41.8',
      nav: '203.67',
      investors: 425,
      performance30d: 15.7,
      performanceYTD: 52.3,
      status: 'active',
      createdAt: '2023-04-05',
    },
    {
      key: '5',
      id: 'FND-005',
      name: 'Epsilon Ventures',
      fundType: 'NFT Focused',
      manager: 'Robert Wilson',
      aum: '12.3',
      nav: '76.14',
      investors: 98,
      performance30d: 5.2,
      performanceYTD: 102.5,
      status: 'pending',
      createdAt: '2024-10-15',
    },
    {
      key: '6',
      id: 'FND-006',
      name: 'Zeta Index',
      fundType: 'Market Index',
      manager: 'Lisa Anderson',
      aum: '67.3',
      nav: '112.89',
      investors: 876,
      performance30d: 14.6,
      performanceYTD: 38.1,
      status: 'active',
      createdAt: '2023-05-22',
    },
  ];

  const comparisonData = [
    { category: 'Q1', type: 'AUM', value: 145.2 },
    { category: 'Q1', type: 'Inversionistas', value: 1789 },
    { category: 'Q2', type: 'AUM', value: 162.8 },
    { category: 'Q2', type: 'Inversionistas', value: 1923 },
    { category: 'Q3', type: 'AUM', value: 178.4 },
    { category: 'Q3', type: 'Inversionistas', value: 2145 },
    { category: 'Q4', type: 'AUM', value: 197.2 },
    { category: 'Q4', type: 'Inversionistas', value: 2347 },
  ];

  const handleEdit = (fund: any) => {
    setEditingFund(fund);
    form.setFieldsValue(fund);
    setIsModalVisible(true);
  };

  const handleCreateNew = () => {
    setEditingFund(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      console.log('Saving fund:', values);
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleViewTokenization = (fund: any) => {
    setSelectedFundTokenization(fund);
    setTokenizationDrawerVisible(true);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Gestión de Fondos</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateNew}>
          Crear Nuevo Fondo
        </Button>
      </div>

      {/* Estadísticas */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total de Fondos"
              value={fundsData.length}
              suffix="fondos"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="AUM Total"
              value={197.2}
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
              value={2347}
            />
          </Card>
        </Col>
      </Row>

      {/* Gráfico de comparación */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <ComparisonChart
            title="Crecimiento Trimestral"
            data={comparisonData}
            height={300}
          />
        </Col>
      </Row>

      {/* Filtros */}
      <AdvancedFilter
        onFilter={(values) => console.log('Filter:', values)}
        onClear={() => console.log('Clear filters')}
        showDateRange={false}
        showStatus={true}
        showType={false}
        customFilters={
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item label="Tipo de Fondo" name="fundType">
              <Select placeholder="Todos" allowClear>
                <Select.Option value="crypto">Crypto</Select.Option>
                <Select.Option value="defi">DeFi</Select.Option>
                <Select.Option value="realestate">Real Estate</Select.Option>
                <Select.Option value="nft">NFT</Select.Option>
                <Select.Option value="index">Index</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        }
      />

      {/* Tabla de fondos */}
      <Card>
        <Table
          columns={columns}
          dataSource={fundsData}
          scroll={{ x: 1500 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} fondos`,
          }}
        />
      </Card>

      {/* Modal de creación/edición */}
      <Modal
        title={editingFund ? 'Editar Fondo' : 'Crear Nuevo Fondo'}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Nombre del Fondo"
                name="name"
                rules={[{ required: true, message: 'Campo requerido' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tipo de Fondo"
                name="fundType"
                rules={[{ required: true, message: 'Campo requerido' }]}
              >
                <Select>
                  <Select.Option value="Crypto Diversified">Crypto Diversified</Select.Option>
                  <Select.Option value="DeFi Focused">DeFi Focused</Select.Option>
                  <Select.Option value="Real Estate Token">Real Estate Token</Select.Option>
                  <Select.Option value="NFT Focused">NFT Focused</Select.Option>
                  <Select.Option value="Market Index">Market Index</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Gestor"
                name="manager"
                rules={[{ required: true, message: 'Campo requerido' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Estado"
                name="status"
                rules={[{ required: true, message: 'Campo requerido' }]}
              >
                <Select>
                  <Select.Option value="active">Activo</Select.Option>
                  <Select.Option value="pending">Pendiente</Select.Option>
                  <Select.Option value="suspended">Suspendido</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Descripción"
                name="description"
              >
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Tokenization Timeline Drawer */}
      <Drawer
        title={
          <Space>
            <RocketOutlined />
            <span>Tokenization Timeline</span>
            {selectedFundTokenization && (
              <Tag color="blue">{selectedFundTokenization.name}</Tag>
            )}
          </Space>
        }
        placement="right"
        width={600}
        onClose={() => setTokenizationDrawerVisible(false)}
        open={tokenizationDrawerVisible}
      >
        {selectedFundTokenization && selectedFundTokenization.tokenizationStatus && (
          <div>
            <Card size="small" style={{ marginBottom: 24 }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title="Status"
                    value={
                      selectedFundTokenization.tokenizationStatus.status === 'completed'
                        ? 'Completado'
                        : selectedFundTokenization.tokenizationStatus.status === 'in-progress'
                        ? 'En Progreso'
                        : 'En Pausa'
                    }
                    valueStyle={{
                      color:
                        selectedFundTokenization.tokenizationStatus.status === 'completed'
                          ? '#52c41a'
                          : selectedFundTokenization.tokenizationStatus.status === 'in-progress'
                          ? '#1890ff'
                          : '#faad14',
                    }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Progreso"
                    value={selectedFundTokenization.tokenizationStatus.progress}
                    suffix="%"
                    valueStyle={{ color: '#1890ff' }}
                  />
                  <Progress
                    percent={selectedFundTokenization.tokenizationStatus.progress}
                    strokeColor="#1890ff"
                    showInfo={false}
                    style={{ marginTop: 8 }}
                  />
                </Col>
              </Row>
            </Card>

            <h3 style={{ marginBottom: 16 }}>Etapas de Tokenización</h3>
            <Timeline
              items={selectedFundTokenization.tokenizationStatus.timeline.map((item: any) => {
                const statusConfig: Record<string, { color: string; icon: JSX.Element }> = {
                  completed: {
                    color: 'green',
                    icon: <CheckCircleOutlined style={{ fontSize: 16 }} />,
                  },
                  'in-progress': {
                    color: 'blue',
                    icon: <ClockCircleOutlined style={{ fontSize: 16 }} />,
                  },
                  pending: {
                    color: 'gray',
                    icon: <ClockCircleOutlined style={{ fontSize: 16 }} />,
                  },
                };
                const config = statusConfig[item.status];
                return {
                  color: config.color,
                  dot: config.icon,
                  children: (
                    <div>
                      <div style={{ fontWeight: 500, marginBottom: 4 }}>{item.stage}</div>
                      <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>
                        {item.date}
                      </div>
                      <div style={{ fontSize: 13 }}>{item.details}</div>
                      <Badge
                        status={
                          item.status === 'completed'
                            ? 'success'
                            : item.status === 'in-progress'
                            ? 'processing'
                            : 'default'
                        }
                        text={
                          item.status === 'completed'
                            ? 'Completado'
                            : item.status === 'in-progress'
                            ? 'En Progreso'
                            : 'Pendiente'
                        }
                        style={{ marginTop: 8 }}
                      />
                    </div>
                  ),
                };
              })}
            />
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default FundsManagementPage;
