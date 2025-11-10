import { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Radio,
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
import type { RadioChangeEvent } from 'antd';
import { Column, Line } from '@ant-design/charts';
import dayjs from 'dayjs';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
  LineChartOutlined,
  ShoppingCartOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { StatCard } from '../../../components/common';

const { Title, Text, Paragraph } = Typography;

type OrderSide = 'buy' | 'sell';
type OrderType = 'market' | 'limit';
type OrderStatus = 'open' | 'filled' | 'partial' | 'canceled';

interface OrderBookEntry {
  price: number;
  quantity: number;
  total: number;
}

interface Order {
  id: string;
  timestamp: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price: number;
  filledQuantity: number;
  status: OrderStatus;
  fund: string;
}

interface Trade {
  id: string;
  timestamp: string;
  price: number;
  quantity: number;
  side: OrderSide;
  value: number;
}

interface PriceHistoryPoint {
  date: string;
  price: number;
  volume: number;
}

interface TradingRestriction {
  name: string;
  value: string;
  description: string;
}

const mockBids: OrderBookEntry[] = [
  { price: 99.5, quantity: 50, total: 4975 },
  { price: 99.0, quantity: 100, total: 9900 },
  { price: 98.5, quantity: 75, total: 7387.5 },
  { price: 98.0, quantity: 150, total: 14700 },
  { price: 97.5, quantity: 200, total: 19500 },
];

const mockAsks: OrderBookEntry[] = [
  { price: 100.5, quantity: 80, total: 8040 },
  { price: 101.0, quantity: 120, total: 12120 },
  { price: 101.5, quantity: 60, total: 6090 },
  { price: 102.0, quantity: 100, total: 10200 },
  { price: 102.5, quantity: 150, total: 15375 },
];

const mockMyOrders: Order[] = [
  {
    id: 'order-1',
    timestamp: '2025-11-10 10:30:00',
    side: 'buy',
    type: 'limit',
    quantity: 50,
    price: 99.5,
    filledQuantity: 50,
    status: 'filled',
    fund: 'RWA Growth Fund',
  },
  {
    id: 'order-2',
    timestamp: '2025-11-10 11:15:00',
    side: 'buy',
    type: 'limit',
    quantity: 100,
    price: 99.0,
    filledQuantity: 0,
    status: 'open',
    fund: 'RWA Growth Fund',
  },
];

const mockRecentTrades: Trade[] = [
  { id: 'trade-1', timestamp: '10:35:22', price: 100.0, quantity: 25, side: 'buy', value: 2500 },
  { id: 'trade-2', timestamp: '10:34:18', price: 99.8, quantity: 50, side: 'sell', value: 4990 },
  { id: 'trade-3', timestamp: '10:33:45', price: 100.1, quantity: 30, side: 'buy', value: 3003 },
  { id: 'trade-4', timestamp: '10:32:10', price: 99.9, quantity: 75, side: 'sell', value: 7492.5 },
  { id: 'trade-5', timestamp: '10:31:05', price: 100.2, quantity: 40, side: 'buy', value: 4008 },
];

const mockPriceHistory: PriceHistoryPoint[] = [
  { date: '2025-10-01', price: 95.5, volume: 1200 },
  { date: '2025-10-08', price: 96.2, volume: 1500 },
  { date: '2025-10-15', price: 97.8, volume: 1800 },
  { date: '2025-10-22', price: 98.5, volume: 2100 },
  { date: '2025-10-29', price: 99.2, volume: 1900 },
  { date: '2025-11-05', price: 100.1, volume: 2300 },
];

const mockTradingRestrictions: TradingRestriction[] = [
  {
    name: 'Minimum Order Size',
    value: '10 shares',
    description: 'Minimum number of shares per order',
  },
  {
    name: 'Maximum Order Size',
    value: '500 shares',
    description: 'Maximum number of shares per single order',
  },
  {
    name: 'Daily Trading Limit',
    value: '$50,000',
    description: 'Maximum trading volume per day',
  },
  {
    name: 'Lock-up Period',
    value: '90 days',
    description: 'Minimum holding period before selling',
  },
];

const TradingPlatformPage = () => {
  const [orderSide, setOrderSide] = useState<OrderSide>('buy');
  const [orderType, setOrderType] = useState<OrderType>('limit');
  const [quantity, setQuantity] = useState<number>(0);
  const [limitPrice, setLimitPrice] = useState<number>(100);
  const [selectedFund] = useState('RWA Growth Fund');
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [form] = Form.useForm();

  const lastPrice = 100.0;
  const priceChange = 1.5;
  const priceChangePercent = 1.52;
  const bestBid = mockBids[0].price;
  const bestAsk = mockAsks[0].price;
  const spread = bestAsk - bestBid;
  const spreadPercent = ((spread / lastPrice) * 100).toFixed(2);

  const calculateEstimatedCost = (): number => {
    if (orderSide === 'buy') {
      const price = orderType === 'market' ? bestAsk : limitPrice;
      return quantity * price;
    } else {
      const price = orderType === 'market' ? bestBid : limitPrice;
      return quantity * price;
    }
  };

  const handleSubmitOrder = () => {
    form.validateFields().then(() => {
      const estimatedCost = calculateEstimatedCost();
      message.success(
        `${orderSide.toUpperCase()} order submitted for ${quantity} shares at ${orderType === 'market' ? 'market price' : `$${limitPrice}`}. Estimated ${orderSide === 'buy' ? 'cost' : 'proceeds'}: $${estimatedCost.toLocaleString()}`
      );
      setOrderModalOpen(false);
      form.resetFields();
    });
  };

  const handleCancelOrder = (orderId: string) => {
    message.success(`Order ${orderId} canceled successfully`);
  };

  const orderBookBidsColumns: ColumnsType<OrderBookEntry> = [
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => (
        <Text strong style={{ color: '#52c41a' }}>
          ${price.toFixed(2)}
        </Text>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => `$${total.toLocaleString()}`,
    },
  ];

  const orderBookAsksColumns: ColumnsType<OrderBookEntry> = [
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => (
        <Text strong style={{ color: '#ff4d4f' }}>
          ${price.toFixed(2)}
        </Text>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => `$${total.toLocaleString()}`,
    },
  ];

  const myOrdersColumns: ColumnsType<Order> = [
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (time: string) => dayjs(time).format('MM/DD HH:mm'),
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
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: OrderType) => type.toUpperCase(),
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
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number, record: Order) =>
        record.type === 'market' ? 'Market' : `$${price.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: OrderStatus) => {
        const colors: Record<OrderStatus, string> = {
          open: 'processing',
          filled: 'success',
          partial: 'warning',
          canceled: 'default',
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Order) =>
        record.status === 'open' || record.status === 'partial' ? (
          <Popconfirm
            title="Cancel Order"
            description="Are you sure you want to cancel this order?"
            onConfirm={() => handleCancelOrder(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" size="small" danger>
              Cancel
            </Button>
          </Popconfirm>
        ) : null,
    },
  ];

  const recentTradesColumns: ColumnsType<Trade> = [
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 100,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number, record: Trade) => (
        <Text strong style={{ color: record.side === 'buy' ? '#52c41a' : '#ff4d4f' }}>
          ${price.toFixed(2)}
        </Text>
      ),
      width: 100,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => `$${value.toLocaleString()}`,
      width: 100,
    },
  ];

  const restrictionsColumns: ColumnsType<TradingRestriction> = [
    {
      title: 'Restriction',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  // Chart configurations
  const priceChartConfig = {
    data: mockPriceHistory,
    xField: 'date',
    yField: 'price',
    smooth: true,
    point: {
      size: 5,
      shape: 'circle',
    },
    color: '#1890ff',
    xAxis: {
      label: {
        formatter: (v: string) => dayjs(v).format('MMM DD'),
      },
    },
    yAxis: {
      label: {
        formatter: (v: string) => `$${v}`,
      },
    },
  };

  const volumeChartConfig = {
    data: mockPriceHistory,
    xField: 'date',
    yField: 'volume',
    color: '#52c41a',
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    xAxis: {
      label: {
        formatter: (v: string) => dayjs(v).format('MMM DD'),
      },
    },
  };

  const depthChartData = [
    ...mockBids.map((bid) => ({ price: bid.price, quantity: bid.quantity, type: 'Bid' })),
    ...mockAsks.map((ask) => ({ price: ask.price, quantity: ask.quantity, type: 'Ask' })),
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Space direction="vertical" size={0}>
            <Title level={3}>Trading Platform</Title>
            <Paragraph type="secondary">
              Secondary market trading for fund shares
            </Paragraph>
          </Space>
        </Col>
        <Col>
          <Button
            type="primary"
            size="large"
            icon={<ShoppingCartOutlined />}
            onClick={() => setOrderModalOpen(true)}
          >
            Place Order
          </Button>
        </Col>
      </Row>

      {/* Price Metrics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Last Price"
              value={lastPrice}
              prefix="$"
              valueStyle={{ color: priceChange >= 0 ? '#3f8600' : '#cf1322' }}
              suffix={
                <Space size={4}>
                  {priceChange >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  <Text style={{ fontSize: 14 }}>
                    {priceChange >= 0 ? '+' : ''}
                    {priceChangePercent}%
                  </Text>
                </Space>
              }
            />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <StatCard
            title="Best Bid"
            value={`$${bestBid.toFixed(2)}`}
            icon={<ArrowDownOutlined style={{ color: '#52c41a' }} />}
          />
        </Col>
        <Col xs={24} md={6}>
          <StatCard
            title="Best Ask"
            value={`$${bestAsk.toFixed(2)}`}
            icon={<ArrowUpOutlined style={{ color: '#ff4d4f' }} />}
          />
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Spread"
              value={spread}
              prefix="$"
              suffix={
                <Text type="secondary" style={{ fontSize: 12 }}>
                  ({spreadPercent}%)
                </Text>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* Main Trading Area */}
      <Row gutter={[16, 16]}>
        {/* Left Column: Order Book */}
        <Col xs={24} lg={8}>
          <Card title="Order Book" size="small">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  ASKS (SELL ORDERS)
                </Text>
                <Table
                  dataSource={[...mockAsks].reverse()}
                  columns={orderBookAsksColumns}
                  rowKey="price"
                  pagination={false}
                  size="small"
                  showHeader={false}
                />
              </div>
              <Card size="small" style={{ background: '#f0f0f0', textAlign: 'center' }}>
                <Statistic
                  value={lastPrice}
                  prefix="$"
                  valueStyle={{ fontSize: 20, fontWeight: 'bold' }}
                />
                <Text type="secondary" style={{ fontSize: 11 }}>
                  Last Traded Price
                </Text>
              </Card>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  BIDS (BUY ORDERS)
                </Text>
                <Table
                  dataSource={mockBids}
                  columns={orderBookBidsColumns}
                  rowKey="price"
                  pagination={false}
                  size="small"
                  showHeader={false}
                />
              </div>
            </Space>
          </Card>
        </Col>

        {/* Center Column: Price Chart */}
        <Col xs={24} lg={10}>
          <Card
            title={
              <Space>
                <LineChartOutlined />
                <Text>Price Chart - {selectedFund}</Text>
              </Space>
            }
            size="small"
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Line {...priceChartConfig} height={200} />
              <div>
                <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 8 }}>
                  VOLUME
                </Text>
                <Column {...volumeChartConfig} height={100} />
              </div>
            </Space>
          </Card>
        </Col>

        {/* Right Column: Recent Trades */}
        <Col xs={24} lg={6}>
          <Card title="Recent Trades" size="small">
            <Table
              dataSource={mockRecentTrades}
              columns={recentTradesColumns}
              rowKey="id"
              pagination={false}
              size="small"
              scroll={{ y: 400 }}
            />
          </Card>
        </Col>
      </Row>

      {/* My Orders and Trading Rules */}
      <Card>
        <Tabs
          defaultActiveKey="my-orders"
          items={[
            {
              key: 'my-orders',
              label: 'My Orders',
              children: (
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Alert
                    message="Active Orders"
                    description={`You have ${mockMyOrders.filter((o) => o.status === 'open').length} open order(s)`}
                    type="info"
                    showIcon
                    closable
                  />
                  <Table
                    dataSource={mockMyOrders}
                    columns={myOrdersColumns}
                    rowKey="id"
                    pagination={false}
                  />
                </Space>
              ),
            },
            {
              key: 'trading-rules',
              label: 'Trading Rules & Limits',
              children: (
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Alert
                    message="Important Trading Information"
                    description="Please review the trading restrictions and limits before placing orders."
                    type="warning"
                    showIcon
                  />
                  <Table
                    dataSource={mockTradingRestrictions}
                    columns={restrictionsColumns}
                    rowKey="name"
                    pagination={false}
                  />
                </Space>
              ),
            },
          ]}
        />
      </Card>

      {/* Place Order Modal */}
      <Modal
        title="Place Order"
        open={orderModalOpen}
        onCancel={() => {
          setOrderModalOpen(false);
          form.resetFields();
        }}
        onOk={handleSubmitOrder}
        width={600}
        okText={`Place ${orderSide.toUpperCase()} Order`}
        okButtonProps={{
          danger: orderSide === 'sell',
          type: 'primary',
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Fund" name="fund" initialValue={selectedFund}>
            <Select disabled>
              <Select.Option value="RWA Growth Fund">RWA Growth Fund</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Order Side">
            <Radio.Group
              value={orderSide}
              onChange={(e: RadioChangeEvent) => setOrderSide(e.target.value)}
              buttonStyle="solid"
              size="large"
            >
              <Radio.Button value="buy" style={{ width: '50%', textAlign: 'center' }}>
                <Space>
                  <ArrowUpOutlined style={{ color: '#52c41a' }} />
                  BUY
                </Space>
              </Radio.Button>
              <Radio.Button value="sell" style={{ width: '50%', textAlign: 'center' }}>
                <Space>
                  <ArrowDownOutlined style={{ color: '#ff4d4f' }} />
                  SELL
                </Space>
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="Order Type">
            <Radio.Group
              value={orderType}
              onChange={(e: RadioChangeEvent) => setOrderType(e.target.value)}
            >
              <Radio value="market">Market Order</Radio>
              <Radio value="limit">Limit Order</Radio>
            </Radio.Group>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="quantity"
                label="Quantity"
                rules={[
                  { required: true, message: 'Please enter quantity' },
                  {
                    type: 'number',
                    min: 10,
                    max: 500,
                    message: 'Quantity must be between 10 and 500',
                  },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={10}
                  max={500}
                  onChange={(value) => setQuantity(value || 0)}
                  placeholder="Enter quantity"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              {orderType === 'limit' && (
                <Form.Item
                  name="limitPrice"
                  label="Limit Price"
                  rules={[{ required: true, message: 'Please enter limit price' }]}
                  initialValue={orderSide === 'buy' ? bestBid : bestAsk}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    step={0.1}
                    prefix="$"
                    onChange={(value) => setLimitPrice(value || 0)}
                    placeholder="Enter price"
                  />
                </Form.Item>
              )}
              {orderType === 'market' && (
                <Form.Item label="Execution Price">
                  <Input
                    value={`Market (≈$${orderSide === 'buy' ? bestAsk : bestBid})`}
                    disabled
                  />
                </Form.Item>
              )}
            </Col>
          </Row>

          <Card size="small" style={{ background: '#f5f5f5' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Row justify="space-between">
                <Text type="secondary">Estimated {orderSide === 'buy' ? 'Cost' : 'Proceeds'}:</Text>
                <Text strong style={{ fontSize: 16 }}>
                  ${calculateEstimatedCost().toLocaleString()}
                </Text>
              </Row>
              <Row justify="space-between">
                <Text type="secondary">Trading Fee (0.1%):</Text>
                <Text>${(calculateEstimatedCost() * 0.001).toFixed(2)}</Text>
              </Row>
              <Row justify="space-between">
                <Text strong>Total:</Text>
                <Text strong style={{ fontSize: 16 }}>
                  $
                  {(
                    calculateEstimatedCost() +
                    (orderSide === 'buy' ? 1 : -1) * calculateEstimatedCost() * 0.001
                  ).toLocaleString()}
                </Text>
              </Row>
            </Space>
          </Card>

          <Alert
            message={
              orderSide === 'buy'
                ? 'You are buying fund shares on the secondary market'
                : 'You are selling fund shares on the secondary market'
            }
            description={`Make sure you have reviewed the trading rules and restrictions before placing this ${orderSide} order.`}
            type="info"
            showIcon
            icon={<ExclamationCircleOutlined />}
            style={{ marginTop: 16 }}
          />
        </Form>
      </Modal>
    </Space>
  );
};

export default TradingPlatformPage;
