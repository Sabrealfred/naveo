import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  Card,
  Tabs,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Row,
  Col,
  Statistic,
  Tag,
  Badge,
  Alert,
  Checkbox,
  message,
  Typography,
  Divider,
  Progress,
  Tooltip,
} from 'antd';
import {
  ShoppingCartOutlined,
  UserOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  PlusOutlined,
  SendOutlined,
  ReloadOutlined,
  PercentageOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

type OrderType = 'buy' | 'sell' | 'rebalance';
type OrderStatus = 'pending' | 'executed' | 'failed' | 'cancelled';
type PortfolioType = 'individual' | 'model' | 'fund';

interface Client {
  id: string;
  name: string;
  email: string;
  portfolioValue: number;
  availableCash: number;
  portfolioType: PortfolioType;
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
}

interface Order {
  id: string;
  clientId: string;
  clientName: string;
  asset: string;
  type: OrderType;
  quantity: number;
  price: number;
  totalValue: number;
  status: OrderStatus;
  createdAt: string;
  executedAt?: string;
  isBulk: boolean;
}

interface ModelPortfolio {
  id: string;
  name: string;
  description: string;
  allocations: Array<{
    asset: string;
    percentage: number;
    minAmount?: number;
  }>;
  riskProfile: string;
  clientsUsing: number;
}

const ClientOrderManagementPage = () => {
  const [activeTab, setActiveTab] = useState('individual');
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [bulkOrderModalVisible, setBulkOrderModalVisible] = useState(false);
  const [modelPortfolioModalVisible, setModelPortfolioModalVisible] = useState(false);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [form] = Form.useForm();

  // Mock data
  const clients: Client[] = [
    {
      id: 'client-001',
      name: 'John Smith',
      email: 'john.smith@email.com',
      portfolioValue: 250000,
      availableCash: 50000,
      portfolioType: 'individual',
      riskProfile: 'moderate',
    },
    {
      id: 'client-002',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      portfolioValue: 500000,
      availableCash: 100000,
      portfolioType: 'individual',
      riskProfile: 'aggressive',
    },
    {
      id: 'client-003',
      name: 'Michael Chen',
      email: 'mchen@email.com',
      portfolioValue: 150000,
      availableCash: 30000,
      portfolioType: 'individual',
      riskProfile: 'conservative',
    },
    {
      id: 'client-004',
      name: 'Emily Rodriguez',
      email: 'emily.r@email.com',
      portfolioValue: 350000,
      availableCash: 70000,
      portfolioType: 'individual',
      riskProfile: 'moderate',
    },
    {
      id: 'client-005',
      name: 'David Kim',
      email: 'david.kim@email.com',
      portfolioValue: 180000,
      availableCash: 40000,
      portfolioType: 'individual',
      riskProfile: 'moderate',
    },
  ];

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'order-001',
      clientId: 'client-001',
      clientName: 'John Smith',
      asset: 'BTC',
      type: 'buy',
      quantity: 0.5,
      price: 35200,
      totalValue: 17600,
      status: 'executed',
      createdAt: '2025-11-10 14:30',
      executedAt: '2025-11-10 14:32',
      isBulk: false,
    },
    {
      id: 'order-002',
      clientId: 'client-002',
      clientName: 'Sarah Johnson',
      asset: 'ETH',
      type: 'buy',
      quantity: 10,
      price: 1920,
      totalValue: 19200,
      status: 'executed',
      createdAt: '2025-11-10 15:00',
      executedAt: '2025-11-10 15:02',
      isBulk: false,
    },
    {
      id: 'order-003',
      clientId: 'client-003',
      clientName: 'Michael Chen',
      asset: 'USDC',
      type: 'buy',
      quantity: 10000,
      price: 1,
      totalValue: 10000,
      status: 'pending',
      createdAt: '2025-11-11 09:15',
      isBulk: false,
    },
  ]);

  const modelPortfolios: ModelPortfolio[] = [
    {
      id: 'model-001',
      name: 'Conservative Growth',
      description: 'Low risk portfolio focused on stablecoins and blue-chip crypto',
      allocations: [
        { asset: 'USDC', percentage: 50, minAmount: 5000 },
        { asset: 'BTC', percentage: 30, minAmount: 3000 },
        { asset: 'ETH', percentage: 20, minAmount: 2000 },
      ],
      riskProfile: 'conservative',
      clientsUsing: 12,
    },
    {
      id: 'model-002',
      name: 'Balanced Digital Assets',
      description: 'Moderate risk with diversified crypto exposure',
      allocations: [
        { asset: 'BTC', percentage: 40, minAmount: 8000 },
        { asset: 'ETH', percentage: 35, minAmount: 7000 },
        { asset: 'USDC', percentage: 15, minAmount: 3000 },
        { asset: 'SOL', percentage: 10, minAmount: 2000 },
      ],
      riskProfile: 'moderate',
      clientsUsing: 25,
    },
    {
      id: 'model-003',
      name: 'Aggressive Growth',
      description: 'High risk/reward with altcoin exposure',
      allocations: [
        { asset: 'BTC', percentage: 30, minAmount: 6000 },
        { asset: 'ETH', percentage: 30, minAmount: 6000 },
        { asset: 'SOL', percentage: 20, minAmount: 4000 },
        { asset: 'AVAX', percentage: 10, minAmount: 2000 },
        { asset: 'MATIC', percentage: 10, minAmount: 2000 },
      ],
      riskProfile: 'aggressive',
      clientsUsing: 8,
    },
  ];

  const totalAUM = clients.reduce((sum, c) => sum + c.portfolioValue, 0);
  const totalCash = clients.reduce((sum, c) => sum + c.availableCash, 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;

  const handleCreateOrder = (values: any) => {
    const client = clients.find((c) => c.id === values.clientId);
    if (!client) return;

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      clientId: values.clientId,
      clientName: client.name,
      asset: values.asset,
      type: values.type,
      quantity: values.quantity,
      price: values.price,
      totalValue: values.quantity * values.price,
      status: 'pending',
      createdAt: dayjs().format('YYYY-MM-DD HH:mm'),
      isBulk: false,
    };

    setOrders((prev) => [newOrder, ...prev]);
    message.success(`Order created for ${client.name}`);
    setOrderModalVisible(false);
    form.resetFields();
  };

  const handleCreateBulkOrder = (values: any) => {
    if (selectedClients.length === 0) {
      message.error('Please select at least one client');
      return;
    }

    const newOrders = selectedClients.map((clientId) => {
      const client = clients.find((c) => c.id === clientId)!;
      return {
        id: `order-bulk-${Date.now()}-${clientId}`,
        clientId,
        clientName: client.name,
        asset: values.asset,
        type: values.type,
        quantity: values.quantity,
        price: values.price,
        totalValue: values.quantity * values.price,
        status: 'pending' as OrderStatus,
        createdAt: dayjs().format('YYYY-MM-DD HH:mm'),
        isBulk: true,
      };
    });

    setOrders((prev) => [...newOrders, ...prev]);
    message.success(`Created ${newOrders.length} bulk orders successfully`);
    setBulkOrderModalVisible(false);
    setSelectedClients([]);
    form.resetFields();
  };

  const handleApplyModelPortfolio = (modelId: string) => {
    if (selectedClients.length === 0) {
      message.error('Please select at least one client');
      return;
    }

    const model = modelPortfolios.find((m) => m.id === modelId);
    if (!model) return;

    Modal.confirm({
      title: 'Apply Model Portfolio',
      content: `Are you sure you want to apply "${model.name}" to ${selectedClients.length} selected client(s)? This will create rebalancing orders based on the model allocations.`,
      okText: 'Apply',
      cancelText: 'Cancel',
      onOk: () => {
        let totalOrders = 0;
        selectedClients.forEach((clientId) => {
          const client = clients.find((c) => c.id === clientId)!;
          model.allocations.forEach((allocation) => {
            const targetValue = (client.portfolioValue * allocation.percentage) / 100;
            const newOrder: Order = {
              id: `order-model-${Date.now()}-${clientId}-${allocation.asset}`,
              clientId,
              clientName: client.name,
              asset: allocation.asset,
              type: 'rebalance',
              quantity: 0, // Would be calculated based on current holdings
              price: 0, // Would be current market price
              totalValue: targetValue,
              status: 'pending' as OrderStatus,
              createdAt: dayjs().format('YYYY-MM-DD HH:mm'),
              isBulk: true,
            };
            setOrders((prev) => [newOrder, ...prev]);
            totalOrders++;
          });
        });
        message.success(`Created ${totalOrders} rebalancing orders from model portfolio`);
        setSelectedClients([]);
      },
    });
  };

  const riskColorMap: Record<Client['riskProfile'], string> = {
    conservative: 'blue',
    moderate: 'orange',
    aggressive: 'red',
  };

  const orderTypeConfig: Record<OrderType, { color: string; icon: ReactNode }> = {
    buy: { color: 'green', icon: <ShoppingCartOutlined /> },
    sell: { color: 'red', icon: <DollarOutlined /> },
    rebalance: { color: 'blue', icon: <ReloadOutlined /> },
  };

  const orderStatusConfig: Record<OrderStatus, { color: string; icon: ReactNode }> = {
    pending: { color: 'warning', icon: <ClockCircleOutlined /> },
    executed: { color: 'success', icon: <CheckCircleOutlined /> },
    failed: { color: 'error', icon: <CloseCircleOutlined /> },
    cancelled: { color: 'default', icon: <CloseCircleOutlined /> },
  };

  const clientColumns: ColumnsType<Client> = [
    {
      title: 'Client Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{name}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.email}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Portfolio Value',
      dataIndex: 'portfolioValue',
      key: 'portfolioValue',
      render: (value) => `$${value.toLocaleString()}`,
      sorter: (a, b) => a.portfolioValue - b.portfolioValue,
    },
    {
      title: 'Available Cash',
      dataIndex: 'availableCash',
      key: 'availableCash',
      render: (value) => `$${value.toLocaleString()}`,
      sorter: (a, b) => a.availableCash - b.availableCash,
    },
    {
      title: 'Risk Profile',
      dataIndex: 'riskProfile',
      key: 'riskProfile',
      render: (profile: Client['riskProfile']) => (
        <Tag color={riskColorMap[profile]}>{profile.toUpperCase()}</Tag>
      ),
      filters: [
        { text: 'Conservative', value: 'conservative' },
        { text: 'Moderate', value: 'moderate' },
        { text: 'Aggressive', value: 'aggressive' },
      ],
      onFilter: (value, record) => record.riskProfile === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      render: (record) => (
        <Space size="small">
          <Button
            size="small"
            icon={<ShoppingCartOutlined />}
            onClick={() => {
              form.setFieldsValue({ clientId: record.id });
              setOrderModalVisible(true);
            }}
          >
            New Order
          </Button>
          <Button size="small" icon={<UserOutlined />}>
            View Portfolio
          </Button>
        </Space>
      ),
    },
  ];

  const orderColumns: ColumnsType<Order> = [
    {
      title: 'Client',
      dataIndex: 'clientName',
      key: 'clientName',
      render: (name, record) => (
        <Space>
          {record.isBulk && (
            <Tooltip title="Bulk Order">
              <TeamOutlined style={{ color: '#1890ff' }} />
            </Tooltip>
          )}
          <Text>{name}</Text>
        </Space>
      ),
    },
    {
      title: 'Asset',
      dataIndex: 'asset',
      key: 'asset',
      render: (asset) => <Tag color="cyan">{asset}</Tag>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: OrderType) => {
        const cfg = orderTypeConfig[type];
        return (
          <Tag icon={cfg.icon} color={cfg.color}>
            {type.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'right',
      render: (qty) => qty.toLocaleString(undefined, { maximumFractionDigits: 8 }),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      render: (price) => (price > 0 ? `$${price.toLocaleString()}` : 'Market'),
    },
    {
      title: 'Total Value',
      dataIndex: 'totalValue',
      key: 'totalValue',
      align: 'right',
      render: (value) => `$${value.toLocaleString()}`,
      sorter: (a, b) => a.totalValue - b.totalValue,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: OrderStatus) => {
        const cfg = orderStatusConfig[status];
        return (
          <Tag icon={cfg.icon} color={cfg.color}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('MMM DD, HH:mm'),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      render: (record) => (
        <Space size="small">
          {record.status === 'pending' && (
            <>
              <Button size="small" type="primary" onClick={() => executeOrder(record.id)}>
                Execute
              </Button>
              <Button size="small" danger onClick={() => cancelOrder(record.id)}>
                Cancel
              </Button>
            </>
          )}
          {record.status === 'executed' && (
            <Button size="small" type="link">
              View Details
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const modelColumns: ColumnsType<ModelPortfolio> = [
    {
      title: 'Model Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{name}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.description}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Risk Profile',
      dataIndex: 'riskProfile',
      key: 'riskProfile',
      render: (profile) => {
        const colors = {
          conservative: 'blue',
          moderate: 'orange',
          aggressive: 'red',
        };
        return <Tag color={colors[profile as keyof typeof colors]}>{profile.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Allocations',
      dataIndex: 'allocations',
      key: 'allocations',
      render: (allocations) => (
        <Space wrap>
          {allocations.map((a: any) => (
            <Tag key={a.asset}>
              {a.asset}: {a.percentage}%
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Clients Using',
      dataIndex: 'clientsUsing',
      key: 'clientsUsing',
      align: 'center',
      render: (count) => (
        <Badge count={count} showZero style={{ backgroundColor: '#52c41a' }} />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      render: (record) => (
        <Space size="small">
          <Button
            size="small"
            type="primary"
            icon={<SendOutlined />}
            onClick={() => handleApplyModelPortfolio(record.id)}
            disabled={selectedClients.length === 0}
          >
            Apply to Selected
          </Button>
          <Button size="small">Edit</Button>
        </Space>
      ),
    },
  ];

  const executeOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: 'executed' as OrderStatus,
              executedAt: dayjs().format('YYYY-MM-DD HH:mm'),
            }
          : order
      )
    );
    message.success('Order executed successfully');
  };

  const cancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: 'cancelled' as OrderStatus } : order
      )
    );
    message.info('Order cancelled');
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <ShoppingCartOutlined /> Client Order Management
        </Title>
        <Paragraph type="secondary">
          Manage orders for individual clients, execute bulk orders, and apply model portfolios across
          multiple clients as a fund or RIA.
        </Paragraph>
      </div>

      <Alert
        message="Multi-Client Portfolio Management"
        description="Create orders for individual clients, execute bulk orders across multiple accounts, or apply model portfolios to groups of clients. Manage your advisory business like an RIA or fund manager."
        type="info"
        showIcon
        closable
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8} lg={6}>
          <Card>
            <Statistic
              title="Total AUM"
              value={totalAUM / 1000000}
              prefix={<DollarOutlined />}
              suffix="M"
              precision={2}
              valueStyle={{ color: '#1890ff' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Across {clients.length} clients
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={6}>
          <Card>
            <Statistic
              title="Available Cash"
              value={totalCash / 1000}
              prefix={<DollarOutlined />}
              suffix="K"
              precision={0}
              valueStyle={{ color: '#52c41a' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Ready to deploy
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={6}>
          <Card>
            <Statistic
              title="Pending Orders"
              value={pendingOrders}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Awaiting execution
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={6}>
          <Card>
            <Statistic
              title="Active Clients"
              value={clients.length}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Under management
            </Text>
          </Card>
        </Col>
      </Row>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        tabBarExtraContent={
          <Space>
            {selectedClients.length > 0 && (
              <Badge count={selectedClients.length} showZero>
                <Button
                  icon={<TeamOutlined />}
                  onClick={() => setBulkOrderModalVisible(true)}
                >
                  Bulk Order ({selectedClients.length})
                </Button>
              </Badge>
            )}
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setOrderModalVisible(true)}
            >
              New Order
            </Button>
          </Space>
        }
        items={[
          {
            key: 'individual',
            label: (
              <span>
                <UserOutlined />
                Individual Orders
              </span>
            ),
            children: (
              <Card>
                <Table
                  columns={orderColumns}
                  dataSource={orders.filter((o) => !o.isBulk)}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 1200 }}
                />
              </Card>
            ),
          },
          {
            key: 'bulk',
            label: (
              <span>
                <TeamOutlined />
                Bulk Orders
                <Badge
                  count={orders.filter((o) => o.isBulk).length}
                  offset={[10, 0]}
                  style={{ backgroundColor: '#1890ff' }}
                />
              </span>
            ),
            children: (
              <Card>
                <Table
                  columns={orderColumns}
                  dataSource={orders.filter((o) => o.isBulk)}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 1200 }}
                />
              </Card>
            ),
          },
          {
            key: 'clients',
            label: (
              <span>
                <TeamOutlined />
                Client Portfolios
              </span>
            ),
            children: (
              <Card
                title={
                  selectedClients.length > 0
                    ? `${selectedClients.length} client(s) selected`
                    : 'Select clients to manage portfolios'
                }
                extra={
                  selectedClients.length > 0 && (
                    <Button onClick={() => setSelectedClients([])}>Clear Selection</Button>
                  )
                }
              >
                <Table
                  columns={clientColumns}
                  dataSource={clients}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  rowSelection={{
                    selectedRowKeys: selectedClients,
                    onChange: (keys) => setSelectedClients(keys as string[]),
                  }}
                />
              </Card>
            ),
          },
          {
            key: 'models',
            label: (
              <span>
                <ThunderboltOutlined />
                Model Portfolios
              </span>
            ),
            children: (
              <>
                {selectedClients.length > 0 && (
                  <Alert
                    message={`${selectedClients.length} client(s) selected`}
                    description="Click 'Apply to Selected' to rebalance selected clients according to the model portfolio allocations."
                    type="success"
                    showIcon
                    closable
                    style={{ marginBottom: 16 }}
                  />
                )}
                <Card>
                  <Table
                    columns={modelColumns}
                    dataSource={modelPortfolios}
                    rowKey="id"
                    pagination={false}
                    expandable={{
                      expandedRowRender: (record) => (
                        <div style={{ paddingLeft: 24 }}>
                          <Title level={5}>Allocation Details</Title>
                          <Row gutter={[16, 16]}>
                            {record.allocations.map((allocation) => (
                              <Col key={allocation.asset} span={6}>
                                <Card size="small">
                                  <Space direction="vertical" style={{ width: '100%' }}>
                                    <Text strong>{allocation.asset}</Text>
                                    <Progress
                                      percent={allocation.percentage}
                                      strokeColor="#1890ff"
                                    />
                                    {allocation.minAmount && (
                                      <Text type="secondary" style={{ fontSize: 12 }}>
                                        Min: ${allocation.minAmount.toLocaleString()}
                                      </Text>
                                    )}
                                  </Space>
                                </Card>
                              </Col>
                            ))}
                          </Row>
                        </div>
                      ),
                    }}
                  />
                </Card>
              </>
            ),
          },
        ]}
      />

      {/* Individual Order Modal */}
      <Modal
        title="Create New Order"
        open={orderModalVisible}
        onCancel={() => {
          setOrderModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateOrder}>
          <Form.Item name="clientId" label="Client" rules={[{ required: true }]}>
            <Select placeholder="Select client">
              {clients.map((client) => (
                <Option key={client.id} value={client.id}>
                  {client.name} - ${client.portfolioValue.toLocaleString()} (Cash: $
                  {client.availableCash.toLocaleString()})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="type" label="Order Type" rules={[{ required: true }]}>
            <Select placeholder="Select type">
              <Option value="buy">Buy</Option>
              <Option value="sell">Sell</Option>
              <Option value="rebalance">Rebalance</Option>
            </Select>
          </Form.Item>
          <Form.Item name="asset" label="Asset" rules={[{ required: true }]}>
            <Select placeholder="Select asset">
              <Option value="BTC">Bitcoin (BTC)</Option>
              <Option value="ETH">Ethereum (ETH)</Option>
              <Option value="SOL">Solana (SOL)</Option>
              <Option value="USDC">USD Coin (USDC)</Option>
              <Option value="AVAX">Avalanche (AVAX)</Option>
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  step={0.00000001}
                  placeholder="0.00"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="price" label="Price (0 for market)" rules={[{ required: true }]}>
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  prefix="$"
                  placeholder="Market"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Bulk Order Modal */}
      <Modal
        title={`Create Bulk Order for ${selectedClients.length} Client(s)`}
        open={bulkOrderModalVisible}
        onCancel={() => {
          setBulkOrderModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        width={600}
      >
        <Alert
          message="Bulk Order Execution"
          description={`This will create identical orders for ${selectedClients.length} selected clients. Each order will be executed individually.`}
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Form form={form} layout="vertical" onFinish={handleCreateBulkOrder}>
          <Form.Item name="type" label="Order Type" rules={[{ required: true }]}>
            <Select placeholder="Select type">
              <Option value="buy">Buy</Option>
              <Option value="sell">Sell</Option>
              <Option value="rebalance">Rebalance</Option>
            </Select>
          </Form.Item>
          <Form.Item name="asset" label="Asset" rules={[{ required: true }]}>
            <Select placeholder="Select asset">
              <Option value="BTC">Bitcoin (BTC)</Option>
              <Option value="ETH">Ethereum (ETH)</Option>
              <Option value="SOL">Solana (SOL)</Option>
              <Option value="USDC">USD Coin (USDC)</Option>
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="quantity" label="Quantity per Client" rules={[{ required: true }]}>
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  step={0.00000001}
                  placeholder="0.00"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="price" label="Price (0 for market)" rules={[{ required: true }]}>
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  prefix="$"
                  placeholder="Market"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ClientOrderManagementPage;
