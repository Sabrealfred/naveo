import { useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  FilePdfOutlined,
  LineChartOutlined,
  PlusOutlined,
  RiseOutlined,
  FallOutlined,
  SwapOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { StatCard } from '../../../components/common';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

type OrderSide = 'buy' | 'sell';
type OrderType = 'market' | 'limit' | 'stop' | 'stop-limit';
type OrderStatus = 'open' | 'partial' | 'filled' | 'canceled' | 'rejected';
type TimeInForce = 'GTC' | 'GTD' | 'IOC' | 'FOK';
type ComplianceStatus = 'pass' | 'warning' | 'fail';
type BenchmarkType = 'arrival' | 'vwap' | 'twap';

interface Order {
  id: string;
  orderId: string;
  timestamp: string;
  asset: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  limitPrice?: number;
  stopPrice?: number;
  filledQuantity: number;
  averagePrice: number;
  status: OrderStatus;
  timeInForce: TimeInForce;
  exchange: string;
  trader: string;
  exchangeConfirmation?: string;
}

interface Position {
  asset: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  realizedPnL: number;
}

interface Trade {
  id: string;
  timestamp: string;
  orderId: string;
  asset: string;
  side: OrderSide;
  quantity: number;
  price: number;
  value: number;
  fees: number;
  exchange: string;
  trader: string;
  slippageBps: number;
  executionQuality: 'excellent' | 'good' | 'fair' | 'poor';
}

interface ComplianceCheck {
  name: string;
  status: ComplianceStatus;
  message: string;
  currentValue?: number;
  limitValue?: number;
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderId: 'ORD-2025-001',
    timestamp: '2025-11-10 09:30:15',
    asset: 'BTC',
    side: 'buy',
    type: 'limit',
    quantity: 0.5,
    limitPrice: 42000,
    filledQuantity: 0.5,
    averagePrice: 41980,
    status: 'filled',
    timeInForce: 'GTC',
    exchange: 'Binance',
    trader: 'John Smith',
    exchangeConfirmation: 'BIN-4738291',
  },
  {
    id: '2',
    orderId: 'ORD-2025-002',
    timestamp: '2025-11-10 10:15:30',
    asset: 'ETH',
    side: 'buy',
    type: 'limit',
    quantity: 10,
    limitPrice: 2200,
    filledQuantity: 6,
    averagePrice: 2198,
    status: 'partial',
    timeInForce: 'GTC',
    exchange: 'Coinbase',
    trader: 'John Smith',
  },
  {
    id: '3',
    orderId: 'ORD-2025-003',
    timestamp: '2025-11-10 11:45:00',
    asset: 'SOL',
    side: 'sell',
    type: 'market',
    quantity: 100,
    filledQuantity: 0,
    averagePrice: 0,
    status: 'open',
    timeInForce: 'IOC',
    exchange: 'Kraken',
    trader: 'Sarah Lee',
  },
];

const mockPositions: Position[] = [
  {
    asset: 'BTC',
    quantity: 2.5,
    averagePrice: 40000,
    currentPrice: 42000,
    marketValue: 105000,
    unrealizedPnL: 5000,
    unrealizedPnLPercent: 5,
    realizedPnL: 2500,
  },
  {
    asset: 'ETH',
    quantity: 50,
    averagePrice: 2100,
    currentPrice: 2200,
    marketValue: 110000,
    unrealizedPnL: 5000,
    unrealizedPnLPercent: 4.76,
    realizedPnL: 1200,
  },
  {
    asset: 'SOL',
    quantity: 500,
    averagePrice: 120,
    currentPrice: 115,
    marketValue: 57500,
    unrealizedPnL: -2500,
    unrealizedPnLPercent: -4.17,
    realizedPnL: 800,
  },
];

const mockTrades: Trade[] = [
  {
    id: 'trade-1',
    timestamp: '2025-11-10 09:30:18',
    orderId: 'ORD-2025-001',
    asset: 'BTC',
    side: 'buy',
    quantity: 0.5,
    price: 41980,
    value: 20990,
    fees: 20.99,
    exchange: 'Binance',
    trader: 'John Smith',
    slippageBps: -4.76,
    executionQuality: 'excellent',
  },
  {
    id: 'trade-2',
    timestamp: '2025-11-10 10:15:35',
    orderId: 'ORD-2025-002',
    asset: 'ETH',
    side: 'buy',
    quantity: 6,
    price: 2198,
    value: 13188,
    fees: 13.19,
    exchange: 'Coinbase',
    trader: 'John Smith',
    slippageBps: -0.91,
    executionQuality: 'excellent',
  },
];

const TradingDashboardPage = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [positions] = useState<Position[]>(mockPositions);
  const [trades] = useState<Trade[]>(mockTrades);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>([]);
  const [complianceModalOpen, setComplianceModalOpen] = useState(false);
  const [form] = Form.useForm();

  const orderStatusConfig: Record<OrderStatus, { color: string; text: string }> = {
    open: { color: 'processing', text: 'Open' },
    partial: { color: 'warning', text: 'Partial' },
    filled: { color: 'success', text: 'Filled' },
    canceled: { color: 'default', text: 'Canceled' },
    rejected: { color: 'error', text: 'Rejected' },
  };

  const executionQualityConfig = {
    excellent: { color: '#52c41a', text: 'Excellent' },
    good: { color: '#1890ff', text: 'Good' },
    fair: { color: '#faad14', text: 'Fair' },
    poor: { color: '#ff4d4f', text: 'Poor' },
  };

  const complianceStatusConfig: Record<ComplianceStatus, { color: string; icon: React.ReactNode }> = {
    pass: { color: 'success', icon: <CheckCircleOutlined /> },
    warning: { color: 'warning', icon: <ExclamationCircleOutlined /> },
    fail: { color: 'error', icon: <CloseCircleOutlined /> },
  };

  const runComplianceChecks = (orderData: {
    asset: string;
    side: OrderSide;
    quantity: number;
    price: number;
  }): ComplianceCheck[] => {
    const checks: ComplianceCheck[] = [];

    // Position limit check
    const currentPosition = positions.find((p) => p.asset === orderData.asset)?.quantity || 0;
    const newPosition =
      orderData.side === 'buy'
        ? currentPosition + orderData.quantity
        : currentPosition - orderData.quantity;
    const positionLimit = 5.0; // Mock limit

    checks.push({
      name: 'Position Limit Check',
      status: Math.abs(newPosition) <= positionLimit ? 'pass' : 'fail',
      message:
        Math.abs(newPosition) <= positionLimit
          ? 'Within position limits'
          : 'Exceeds maximum position limit',
      currentValue: Math.abs(newPosition),
      limitValue: positionLimit,
    });

    // Concentration limit check
    const orderValue = orderData.quantity * orderData.price;
    const totalPortfolioValue = positions.reduce((sum, p) => sum + p.marketValue, 0);
    const concentrationPct = (orderValue / totalPortfolioValue) * 100;
    const concentrationLimit = 30;

    checks.push({
      name: 'Concentration Limit',
      status: concentrationPct <= concentrationLimit ? 'pass' : 'warning',
      message:
        concentrationPct <= concentrationLimit
          ? 'Within concentration limits'
          : 'High concentration risk',
      currentValue: concentrationPct,
      limitValue: concentrationLimit,
    });

    // Restricted list check
    const restrictedAssets = ['LUNA', 'FTT']; // Mock restricted list
    checks.push({
      name: 'Restricted List Check',
      status: !restrictedAssets.includes(orderData.asset) ? 'pass' : 'fail',
      message: !restrictedAssets.includes(orderData.asset)
        ? 'Asset not restricted'
        : 'Asset is on restricted list',
    });

    // Available cash check
    const availableCash = 500000; // Mock available cash
    const requiredCash = orderData.side === 'buy' ? orderValue : 0;

    checks.push({
      name: 'Available Cash',
      status: requiredCash <= availableCash ? 'pass' : 'fail',
      message:
        requiredCash <= availableCash
          ? 'Sufficient cash available'
          : 'Insufficient cash for order',
      currentValue: availableCash,
      limitValue: requiredCash,
    });

    return checks;
  };

  const handleSubmitOrder = () => {
    form.validateFields().then((values) => {
      const price = values.type === 'market' ? 42000 : values.limitPrice; // Mock market price
      const orderData = {
        asset: values.asset,
        side: values.side,
        quantity: values.quantity,
        price,
      };

      // Run compliance checks
      const checks = runComplianceChecks(orderData);
      setComplianceChecks(checks);

      const hasFailures = checks.some((c) => c.status === 'fail');

      if (hasFailures) {
        setComplianceModalOpen(true);
      } else {
        submitOrder(values);
      }
    });
  };

  const submitOrder = (values: {
    asset: string;
    side: OrderSide;
    type: OrderType;
    quantity: number;
    limitPrice?: number;
    stopPrice?: number;
    timeInForce: TimeInForce;
    exchange: string;
  }) => {
    const newOrder: Order = {
      id: `${orders.length + 1}`,
      orderId: `ORD-2025-${String(orders.length + 1).padStart(3, '0')}`,
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      asset: values.asset,
      side: values.side,
      type: values.type,
      quantity: values.quantity,
      limitPrice: values.limitPrice,
      stopPrice: values.stopPrice,
      filledQuantity: 0,
      averagePrice: 0,
      status: 'open',
      timeInForce: values.timeInForce,
      exchange: values.exchange,
      trader: 'Current User',
    };

    setOrders([...orders, newOrder]);
    message.success('Order submitted successfully!');
    setOrderModalOpen(false);
    setComplianceModalOpen(false);
    form.resetFields();
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders(
      orders.map((order) => (order.orderId === orderId ? { ...order, status: 'canceled' } : order))
    );
    message.success(`Order ${orderId} canceled`);
  };

  const handleClosePosition = (asset: string) => {
    message.success(`Close position order created for ${asset}`);
  };

  const ordersColumns: ColumnsType<Order> = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (id: string) => <Text strong>{id}</Text>,
      width: 130,
    },
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (time: string) => dayjs(time).format('HH:mm:ss'),
      sorter: (a, b) => dayjs(a.timestamp).unix() - dayjs(b.timestamp).unix(),
      width: 90,
    },
    {
      title: 'Asset',
      dataIndex: 'asset',
      key: 'asset',
      width: 80,
    },
    {
      title: 'Side',
      dataIndex: 'side',
      key: 'side',
      render: (side: OrderSide) => (
        <Tag color={side === 'buy' ? 'green' : 'red'}>{side.toUpperCase()}</Tag>
      ),
      filters: [
        { text: 'Buy', value: 'buy' },
        { text: 'Sell', value: 'sell' },
      ],
      onFilter: (value, record) => record.side === value,
      width: 80,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: OrderType) => type.toUpperCase(),
      width: 90,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (qty: number, record: Order) => (
        <Space direction="vertical" size={0}>
          <Text>{qty}</Text>
          {record.filledQuantity > 0 && (
            <Text type="secondary" style={{ fontSize: 11 }}>
              Filled: {record.filledQuantity}
            </Text>
          )}
        </Space>
      ),
      width: 100,
    },
    {
      title: 'Price',
      key: 'price',
      render: (_: unknown, record: Order) => {
        if (record.type === 'market') return 'Market';
        if (record.type === 'limit') return `$${record.limitPrice?.toLocaleString()}`;
        return `Stop: $${record.stopPrice?.toLocaleString()}`;
      },
      width: 110,
    },
    {
      title: 'Avg Fill Price',
      dataIndex: 'averagePrice',
      key: 'averagePrice',
      render: (price: number) => (price > 0 ? `$${price.toLocaleString()}` : '-'),
      width: 120,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: OrderStatus) => (
        <Tag color={orderStatusConfig[status].color}>{orderStatusConfig[status].text}</Tag>
      ),
      filters: Object.keys(orderStatusConfig).map((key) => ({
        text: orderStatusConfig[key as OrderStatus].text,
        value: key,
      })),
      onFilter: (value, record) => record.status === value,
      width: 90,
    },
    {
      title: 'Exchange',
      dataIndex: 'exchange',
      key: 'exchange',
      width: 100,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Order) => (
        <Space size="small">
          {(record.status === 'open' || record.status === 'partial') && (
            <Popconfirm
              title="Cancel Order"
              description="Are you sure you want to cancel this order?"
              onConfirm={() => handleCancelOrder(record.orderId)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" size="small" danger>
                Cancel
              </Button>
            </Popconfirm>
          )}
          {record.exchangeConfirmation && (
            <Tooltip title={`Exchange confirmation: ${record.exchangeConfirmation}`}>
              <Button type="link" size="small">
                View
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
      width: 120,
    },
  ];

  const positionsColumns: ColumnsType<Position> = [
    {
      title: 'Asset',
      dataIndex: 'asset',
      key: 'asset',
      render: (asset: string) => <Text strong>{asset}</Text>,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (qty: number) => qty.toFixed(4),
    },
    {
      title: 'Avg Price',
      dataIndex: 'averagePrice',
      key: 'averagePrice',
      render: (price: number) => `$${price.toLocaleString()}`,
    },
    {
      title: 'Current Price',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      render: (price: number) => `$${price.toLocaleString()}`,
    },
    {
      title: 'Market Value',
      dataIndex: 'marketValue',
      key: 'marketValue',
      render: (value: number) => <Text strong>${value.toLocaleString()}</Text>,
      sorter: (a, b) => a.marketValue - b.marketValue,
    },
    {
      title: 'Unrealized P&L',
      key: 'unrealizedPnL',
      render: (_: unknown, record: Position) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ color: record.unrealizedPnL >= 0 ? '#52c41a' : '#ff4d4f' }}>
            {record.unrealizedPnL >= 0 ? <RiseOutlined /> : <FallOutlined />} $
            {Math.abs(record.unrealizedPnL).toLocaleString()}
          </Text>
          <Text type="secondary" style={{ fontSize: 11 }}>
            ({record.unrealizedPnLPercent >= 0 ? '+' : ''}
            {record.unrealizedPnLPercent.toFixed(2)}%)
          </Text>
        </Space>
      ),
      sorter: (a, b) => a.unrealizedPnL - b.unrealizedPnL,
    },
    {
      title: 'Realized P&L',
      dataIndex: 'realizedPnL',
      key: 'realizedPnL',
      render: (pnl: number) => (
        <Text style={{ color: pnl >= 0 ? '#52c41a' : '#ff4d4f' }}>
          ${pnl.toLocaleString()}
        </Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Position) => (
        <Button
          type="link"
          size="small"
          danger
          onClick={() => handleClosePosition(record.asset)}
        >
          Close
        </Button>
      ),
    },
  ];

  const tradesColumns: ColumnsType<Trade> = [
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (time: string) => dayjs(time).format('MM/DD HH:mm:ss'),
      sorter: (a, b) => dayjs(a.timestamp).unix() - dayjs(b.timestamp).unix(),
    },
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Asset',
      dataIndex: 'asset',
      key: 'asset',
    },
    {
      title: 'Side',
      dataIndex: 'side',
      key: 'side',
      render: (side: OrderSide) => (
        <Tag color={side === 'buy' ? 'green' : 'red'}>{side.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (qty: number) => qty.toFixed(4),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toLocaleString()}`,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      title: 'Fees',
      dataIndex: 'fees',
      key: 'fees',
      render: (fees: number) => `$${fees.toFixed(2)}`,
    },
    {
      title: 'Slippage',
      dataIndex: 'slippageBps',
      key: 'slippageBps',
      render: (bps: number) => (
        <Text style={{ color: bps <= 0 ? '#52c41a' : '#ff4d4f' }}>
          {bps.toFixed(2)} bps
        </Text>
      ),
    },
    {
      title: 'Quality',
      dataIndex: 'executionQuality',
      key: 'executionQuality',
      render: (quality: 'excellent' | 'good' | 'fair' | 'poor') => (
        <Tag color={executionQualityConfig[quality].color}>
          {executionQualityConfig[quality].text}
        </Tag>
      ),
    },
    {
      title: 'Trader',
      dataIndex: 'trader',
      key: 'trader',
    },
  ];

  const totalMarketValue = positions.reduce((sum, p) => sum + p.marketValue, 0);
  const totalUnrealizedPnL = positions.reduce((sum, p) => sum + p.unrealizedPnL, 0);
  const totalRealizedPnL = positions.reduce((sum, p) => sum + p.realizedPnL, 0);
  const openOrdersCount = orders.filter((o) => o.status === 'open' || o.status === 'partial').length;

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3}>Trading Dashboard</Title>
          <Paragraph type="secondary">
            Order Management System (OMS) and Execution Management System (EMS)
          </Paragraph>
        </Col>
        <Col>
          <Space>
            <Button icon={<DownloadOutlined />}>Export CSV</Button>
            <Button icon={<FilePdfOutlined />}>Generate Report</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setOrderModalOpen(true)}>
              New Order
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Metrics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <StatCard
            title="Total Market Value"
            value={`$${(totalMarketValue / 1000).toFixed(0)}K`}
            icon={<DollarOutlined />}
          />
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Unrealized P&L"
              value={Math.abs(totalUnrealizedPnL)}
              prefix={totalUnrealizedPnL >= 0 ? <RiseOutlined /> : <FallOutlined />}
              suffix="USD"
              valueStyle={{ color: totalUnrealizedPnL >= 0 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Realized P&L"
              value={totalRealizedPnL}
              prefix="$"
              valueStyle={{ color: totalRealizedPnL >= 0 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <StatCard
            title="Open Orders"
            value={openOrdersCount}
            icon={<SwapOutlined />}
          />
        </Col>
      </Row>

      {/* Main Content Tabs */}
      <Card>
        <Tabs
          defaultActiveKey="orders"
          items={[
            {
              key: 'orders',
              label: 'Order Blotter',
              children: (
                <Table
                  dataSource={orders}
                  columns={ordersColumns}
                  rowKey="id"
                  pagination={{ pageSize: 20 }}
                  scroll={{ x: 1300 }}
                />
              ),
            },
            {
              key: 'positions',
              label: 'Positions',
              children: (
                <Table
                  dataSource={positions}
                  columns={positionsColumns}
                  rowKey="asset"
                  pagination={false}
                  summary={(data) => {
                    const totalValue = data.reduce((sum, p) => sum + p.marketValue, 0);
                    const totalUnrealized = data.reduce((sum, p) => sum + p.unrealizedPnL, 0);
                    const totalRealized = data.reduce((sum, p) => sum + p.realizedPnL, 0);

                    return (
                      <Table.Summary>
                        <Table.Summary.Row>
                          <Table.Summary.Cell index={0} colSpan={4}>
                            <Text strong>Total</Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={1}>
                            <Text strong>${totalValue.toLocaleString()}</Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={2}>
                            <Text strong style={{ color: totalUnrealized >= 0 ? '#52c41a' : '#ff4d4f' }}>
                              ${totalUnrealized.toLocaleString()}
                            </Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={3}>
                            <Text strong style={{ color: totalRealized >= 0 ? '#52c41a' : '#ff4d4f' }}>
                              ${totalRealized.toLocaleString()}
                            </Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={4} />
                        </Table.Summary.Row>
                      </Table.Summary>
                    );
                  }}
                />
              ),
            },
            {
              key: 'trades',
              label: 'Trade History',
              children: (
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Row gutter={16}>
                    <Col span={8}>
                      <RangePicker style={{ width: '100%' }} />
                    </Col>
                    <Col span={6}>
                      <Select placeholder="Filter by Asset" style={{ width: '100%' }}>
                        <Select.Option value="BTC">BTC</Select.Option>
                        <Select.Option value="ETH">ETH</Select.Option>
                        <Select.Option value="SOL">SOL</Select.Option>
                      </Select>
                    </Col>
                    <Col span={6}>
                      <Select placeholder="Filter by Trader" style={{ width: '100%' }}>
                        <Select.Option value="john">John Smith</Select.Option>
                        <Select.Option value="sarah">Sarah Lee</Select.Option>
                      </Select>
                    </Col>
                    <Col span={4}>
                      <Button icon={<DownloadOutlined />} block>
                        Export
                      </Button>
                    </Col>
                  </Row>
                  <Table
                    dataSource={trades}
                    columns={tradesColumns}
                    rowKey="id"
                    pagination={{ pageSize: 20 }}
                  />
                </Space>
              ),
            },
          ]}
        />
      </Card>

      {/* Order Entry Modal */}
      <Modal
        title="New Order"
        open={orderModalOpen}
        onCancel={() => {
          setOrderModalOpen(false);
          form.resetFields();
        }}
        onOk={handleSubmitOrder}
        width={700}
        okText="Submit Order"
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="asset"
                label="Asset"
                rules={[{ required: true, message: 'Please select asset' }]}
              >
                <Select placeholder="Select asset">
                  <Select.Option value="BTC">Bitcoin (BTC)</Select.Option>
                  <Select.Option value="ETH">Ethereum (ETH)</Select.Option>
                  <Select.Option value="SOL">Solana (SOL)</Select.Option>
                  <Select.Option value="AVAX">Avalanche (AVAX)</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="side"
                label="Side"
                rules={[{ required: true, message: 'Please select side' }]}
              >
                <Select placeholder="Select side">
                  <Select.Option value="buy">Buy</Select.Option>
                  <Select.Option value="sell">Sell</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Order Type"
                rules={[{ required: true, message: 'Please select order type' }]}
                initialValue="limit"
              >
                <Select>
                  <Select.Option value="market">Market</Select.Option>
                  <Select.Option value="limit">Limit</Select.Option>
                  <Select.Option value="stop">Stop</Select.Option>
                  <Select.Option value="stop-limit">Stop-Limit</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="quantity"
                label="Quantity"
                rules={[{ required: true, message: 'Please enter quantity' }]}
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  style={{ width: '100%' }}
                  placeholder="0.00"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
          >
            {({ getFieldValue }) => {
              const orderType = getFieldValue('type');
              return (
                <>
                  {(orderType === 'limit' || orderType === 'stop-limit') && (
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="limitPrice"
                          label="Limit Price"
                          rules={[{ required: true, message: 'Please enter limit price' }]}
                        >
                          <InputNumber
                            min={0}
                            prefix="$"
                            style={{ width: '100%' }}
                            placeholder="0.00"
                          />
                        </Form.Item>
                      </Col>
                      {orderType === 'stop-limit' && (
                        <Col span={12}>
                          <Form.Item
                            name="stopPrice"
                            label="Stop Price"
                            rules={[{ required: true, message: 'Please enter stop price' }]}
                          >
                            <InputNumber
                              min={0}
                              prefix="$"
                              style={{ width: '100%' }}
                              placeholder="0.00"
                            />
                          </Form.Item>
                        </Col>
                      )}
                    </Row>
                  )}
                </>
              );
            }}
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="timeInForce"
                label="Time in Force"
                rules={[{ required: true, message: 'Please select time in force' }]}
                initialValue="GTC"
              >
                <Select>
                  <Select.Option value="GTC">Good Till Cancel (GTC)</Select.Option>
                  <Select.Option value="GTD">Good Till Date (GTD)</Select.Option>
                  <Select.Option value="IOC">Immediate or Cancel (IOC)</Select.Option>
                  <Select.Option value="FOK">Fill or Kill (FOK)</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="exchange"
                label="Exchange"
                rules={[{ required: true, message: 'Please select exchange' }]}
                initialValue="Binance"
              >
                <Select>
                  <Select.Option value="Binance">Binance</Select.Option>
                  <Select.Option value="Coinbase">Coinbase</Select.Option>
                  <Select.Option value="Kraken">Kraken</Select.Option>
                  <Select.Option value="Gemini">Gemini</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Compliance Check Modal */}
      <Modal
        title="Pre-Trade Compliance Check"
        open={complianceModalOpen}
        onCancel={() => setComplianceModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setComplianceModalOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="override"
            type="primary"
            danger
            onClick={() => {
              form.validateFields().then((values) => {
                submitOrder(values);
              });
            }}
            disabled={complianceChecks.some((c) => c.status === 'fail')}
          >
            Override & Submit
          </Button>,
        ]}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Alert
            message="Compliance Violations Detected"
            description="Some compliance checks failed. Review below before proceeding."
            type="error"
            showIcon
            icon={<WarningOutlined />}
          />

          {complianceChecks.map((check, index) => (
            <Card key={index} size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Row justify="space-between" align="middle">
                  <Col>
                    <Text strong>{check.name}</Text>
                  </Col>
                  <Col>
                    <Space>
                      {complianceStatusConfig[check.status].icon}
                      <Badge
                        status={complianceStatusConfig[check.status].color as 'success' | 'warning' | 'error'}
                        text={check.status.toUpperCase()}
                      />
                    </Space>
                  </Col>
                </Row>
                <Text type="secondary">{check.message}</Text>
                {check.currentValue !== undefined && check.limitValue !== undefined && (
                  <Descriptions size="small" column={2}>
                    <Descriptions.Item label="Current">{check.currentValue.toFixed(2)}</Descriptions.Item>
                    <Descriptions.Item label="Limit">{check.limitValue.toFixed(2)}</Descriptions.Item>
                  </Descriptions>
                )}
              </Space>
            </Card>
          ))}
        </Space>
      </Modal>
    </Space>
  );
};

export default TradingDashboardPage;
