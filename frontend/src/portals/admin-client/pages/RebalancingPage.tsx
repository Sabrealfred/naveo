import { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Progress,
  Row,
  Select,
  Space,
  Statistic,
  Steps,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Column, Pie, Line } from '@ant-design/charts';
import {
  AlertOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  LineChartOutlined,
  PlusOutlined,
  ReloadOutlined,
  SaveOutlined,
  SendOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { StatCard } from '../../../components/common';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

type DriftStatus = 'in-range' | 'warning' | 'critical';
type OrderSide = 'buy' | 'sell';
type OrderStatus = 'pending' | 'sent' | 'filled' | 'cancelled';

interface AssetAllocation {
  asset: string;
  symbol: string;
  targetWeight: number;
  currentWeight: number;
  minWeight: number;
  maxWeight: number;
  currentValue: number;
  drift: number;
  driftStatus: DriftStatus;
}

interface TradeOrder {
  id: string;
  asset: string;
  side: OrderSide;
  quantity: number;
  estimatedPrice: number;
  estimatedValue: number;
  estimatedFees: number;
  estimatedSlippage: number;
  totalCost: number;
  status: OrderStatus;
}

interface AllocationModel {
  id: string;
  name: string;
  description: string;
  allocations: { asset: string; targetWeight: number; minWeight: number; maxWeight: number }[];
}

interface DriftHistoryPoint {
  date: string;
  asset: string;
  drift: number;
}

const mockAllocations: AssetAllocation[] = [
  {
    asset: 'Bitcoin',
    symbol: 'BTC',
    targetWeight: 40,
    currentWeight: 45,
    minWeight: 35,
    maxWeight: 45,
    currentValue: 4500000,
    drift: 5,
    driftStatus: 'warning',
  },
  {
    asset: 'Ethereum',
    symbol: 'ETH',
    targetWeight: 30,
    currentWeight: 28,
    minWeight: 25,
    maxWeight: 35,
    currentValue: 2800000,
    drift: -2,
    driftStatus: 'in-range',
  },
  {
    asset: 'Solana',
    symbol: 'SOL',
    targetWeight: 15,
    currentWeight: 12,
    minWeight: 10,
    maxWeight: 20,
    currentValue: 1200000,
    drift: -3,
    driftStatus: 'in-range',
  },
  {
    asset: 'Avalanche',
    symbol: 'AVAX',
    targetWeight: 10,
    currentWeight: 8,
    minWeight: 5,
    maxWeight: 15,
    currentValue: 800000,
    drift: -2,
    driftStatus: 'in-range',
  },
  {
    asset: 'Polygon',
    symbol: 'MATIC',
    targetWeight: 5,
    currentWeight: 7,
    minWeight: 0,
    maxWeight: 10,
    currentValue: 700000,
    drift: 2,
    driftStatus: 'in-range',
  },
];

const mockAllocationModels: AllocationModel[] = [
  {
    id: 'model-1',
    name: 'Conservative Crypto',
    description: 'Heavy BTC/ETH allocation with minimal altcoin exposure',
    allocations: [
      { asset: 'BTC', targetWeight: 60, minWeight: 55, maxWeight: 65 },
      { asset: 'ETH', targetWeight: 30, minWeight: 25, maxWeight: 35 },
      { asset: 'SOL', targetWeight: 10, minWeight: 5, maxWeight: 15 },
    ],
  },
  {
    id: 'model-2',
    name: 'Balanced Growth',
    description: 'Diversified allocation across top assets',
    allocations: [
      { asset: 'BTC', targetWeight: 40, minWeight: 35, maxWeight: 45 },
      { asset: 'ETH', targetWeight: 30, minWeight: 25, maxWeight: 35 },
      { asset: 'SOL', targetWeight: 15, minWeight: 10, maxWeight: 20 },
      { asset: 'AVAX', targetWeight: 10, minWeight: 5, maxWeight: 15 },
      { asset: 'MATIC', targetWeight: 5, minWeight: 0, maxWeight: 10 },
    ],
  },
];

const mockDriftHistory: DriftHistoryPoint[] = [
  { date: '2025-11-01', asset: 'BTC', drift: 2.1 },
  { date: '2025-11-02', asset: 'BTC', drift: 3.5 },
  { date: '2025-11-03', asset: 'BTC', drift: 4.2 },
  { date: '2025-11-04', asset: 'BTC', drift: 4.8 },
  { date: '2025-11-05', asset: 'BTC', drift: 5.0 },
  { date: '2025-11-01', asset: 'ETH', drift: -0.5 },
  { date: '2025-11-02', asset: 'ETH', drift: -1.2 },
  { date: '2025-11-03', asset: 'ETH', drift: -1.8 },
  { date: '2025-11-04', asset: 'ETH', drift: -2.1 },
  { date: '2025-11-05', asset: 'ETH', drift: -2.0 },
];

const RebalancingPage = () => {
  const [allocations, setAllocations] = useState<AssetAllocation[]>(mockAllocations);
  const [modelModalOpen, setModelModalOpen] = useState(false);
  const [rebalanceModalOpen, setRebalanceModalOpen] = useState(false);
  const [rebalanceStep, setRebalanceStep] = useState(0);
  const [tradeOrders, setTradeOrders] = useState<TradeOrder[]>([]);
  const [form] = Form.useForm();

  const totalValue = allocations.reduce((sum, a) => sum + a.currentValue, 0);
  const maxDrift = Math.max(...allocations.map((a) => Math.abs(a.drift)));
  const outOfBoundsCount = allocations.filter((a) => a.driftStatus !== 'in-range').length;
  const avgDrift =
    allocations.reduce((sum, a) => sum + Math.abs(a.drift), 0) / allocations.length;

  const driftStatusConfig: Record<DriftStatus, { color: string; text: string }> = {
    'in-range': { color: 'success', text: 'In Range' },
    warning: { color: 'warning', text: 'Warning' },
    critical: { color: 'error', text: 'Critical' },
  };

  const orderSideConfig: Record<OrderSide, { color: string; text: string }> = {
    buy: { color: 'green', text: 'BUY' },
    sell: { color: 'red', text: 'SELL' },
  };

  const calculateRebalancingTrades = () => {
    const trades: TradeOrder[] = [];

    allocations.forEach((allocation) => {
      const targetValue = (totalValue * allocation.targetWeight) / 100;
      const difference = targetValue - allocation.currentValue;

      if (Math.abs(difference) > 10000) {
        // Only create orders for significant differences
        const side: OrderSide = difference > 0 ? 'buy' : 'sell';
        const quantity = Math.abs(difference / 50000); // Mock price
        const estimatedPrice = 50000;
        const estimatedValue = Math.abs(difference);
        const estimatedFees = estimatedValue * 0.001; // 0.1% fee
        const estimatedSlippage = estimatedValue * 0.0005; // 0.05% slippage
        const totalCost = estimatedValue + estimatedFees + estimatedSlippage;

        trades.push({
          id: `trade-${allocation.symbol}-${Date.now()}`,
          asset: allocation.symbol,
          side,
          quantity,
          estimatedPrice,
          estimatedValue,
          estimatedFees,
          estimatedSlippage,
          totalCost,
          status: 'pending',
        });
      }
    });

    setTradeOrders(trades);
  };

  const handleStartRebalancing = () => {
    calculateRebalancingTrades();
    setRebalanceStep(0);
    setRebalanceModalOpen(true);
  };

  const handleExecuteRebalancing = () => {
    message.success('Rebalancing orders sent to OMS successfully!');
    setRebalanceModalOpen(false);
    setRebalanceStep(0);
  };

  const handleLoadModel = (modelId: string) => {
    const model = mockAllocationModels.find((m) => m.id === modelId);
    if (model) {
      message.success(`Loaded allocation model: ${model.name}`);
      setModelModalOpen(false);
    }
  };

  const allocationsColumns: ColumnsType<AssetAllocation> = [
    {
      title: 'Asset',
      dataIndex: 'asset',
      key: 'asset',
      render: (text: string, record: AssetAllocation) => (
        <Space>
          <Text strong>{text}</Text>
          <Text type="secondary">({record.symbol})</Text>
        </Space>
      ),
    },
    {
      title: 'Current Weight',
      dataIndex: 'currentWeight',
      key: 'currentWeight',
      render: (weight: number) => `${weight.toFixed(1)}%`,
      sorter: (a, b) => a.currentWeight - b.currentWeight,
    },
    {
      title: 'Target Weight',
      dataIndex: 'targetWeight',
      key: 'targetWeight',
      render: (weight: number) => `${weight.toFixed(1)}%`,
    },
    {
      title: 'Range',
      key: 'range',
      render: (_: unknown, record: AssetAllocation) => (
        <Text type="secondary">
          {record.minWeight}% - {record.maxWeight}%
        </Text>
      ),
    },
    {
      title: 'Drift',
      dataIndex: 'drift',
      key: 'drift',
      render: (drift: number, record: AssetAllocation) => {
        const color =
          record.driftStatus === 'in-range'
            ? '#52c41a'
            : record.driftStatus === 'warning'
              ? '#faad14'
              : '#ff4d4f';
        return (
          <Text strong style={{ color }}>
            {drift > 0 ? '+' : ''}
            {drift.toFixed(1)}%
          </Text>
        );
      },
      sorter: (a, b) => Math.abs(b.drift) - Math.abs(a.drift),
    },
    {
      title: 'Current Value',
      dataIndex: 'currentValue',
      key: 'currentValue',
      render: (value: number) => `$${value.toLocaleString()}`,
      sorter: (a, b) => a.currentValue - b.currentValue,
    },
    {
      title: 'Status',
      dataIndex: 'driftStatus',
      key: 'driftStatus',
      render: (status: DriftStatus) => (
        <Tag color={driftStatusConfig[status].color}>{driftStatusConfig[status].text}</Tag>
      ),
      filters: [
        { text: 'In Range', value: 'in-range' },
        { text: 'Warning', value: 'warning' },
        { text: 'Critical', value: 'critical' },
      ],
      onFilter: (value, record) => record.driftStatus === value,
    },
  ];

  const tradeOrdersColumns: ColumnsType<TradeOrder> = [
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
        <Tag color={orderSideConfig[side].color}>{orderSideConfig[side].text}</Tag>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (qty: number) => qty.toFixed(4),
    },
    {
      title: 'Est. Price',
      dataIndex: 'estimatedPrice',
      key: 'estimatedPrice',
      render: (price: number) => `$${price.toLocaleString()}`,
    },
    {
      title: 'Est. Value',
      dataIndex: 'estimatedValue',
      key: 'estimatedValue',
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      title: 'Fees',
      dataIndex: 'estimatedFees',
      key: 'estimatedFees',
      render: (fees: number) => `$${fees.toLocaleString()}`,
    },
    {
      title: 'Slippage',
      dataIndex: 'estimatedSlippage',
      key: 'estimatedSlippage',
      render: (slip: number) => `$${slip.toLocaleString()}`,
    },
    {
      title: 'Total Cost',
      dataIndex: 'totalCost',
      key: 'totalCost',
      render: (cost: number) => <Text strong>${cost.toLocaleString()}</Text>,
    },
  ];

  // Chart data preparation
  const allocationComparisonData = allocations.flatMap((a) => [
    { asset: a.symbol, type: 'Current', value: a.currentWeight },
    { asset: a.symbol, type: 'Target', value: a.targetWeight },
  ]);

  const currentAllocationPieData = allocations.map((a) => ({
    type: a.symbol,
    value: a.currentWeight,
  }));

  const driftHistoryChartData = mockDriftHistory;

  const allocationComparisonConfig = {
    data: allocationComparisonData,
    xField: 'asset',
    yField: 'value',
    seriesField: 'type',
    isGroup: true,
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    color: ['#1890ff', '#52c41a'],
    label: {
      position: 'top' as const,
      formatter: (datum: { value: number }) => `${datum.value.toFixed(1)}%`,
    },
    legend: {
      position: 'top' as const,
    },
  };

  const pieChartConfig = {
    data: currentAllocationPieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer' as const,
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'element-active' }],
  };

  const driftHistoryConfig = {
    data: driftHistoryChartData,
    xField: 'date',
    yField: 'drift',
    seriesField: 'asset',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    yAxis: {
      label: {
        formatter: (v: string) => `${v}%`,
      },
    },
  };

  const totalEstimatedCost = tradeOrders.reduce((sum, order) => sum + order.totalCost, 0);
  const totalEstimatedFees = tradeOrders.reduce((sum, order) => sum + order.estimatedFees, 0);
  const totalEstimatedSlippage = tradeOrders.reduce(
    (sum, order) => sum + order.estimatedSlippage,
    0
  );

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3}>Portfolio Rebalancing Manager</Title>
          <Paragraph type="secondary">
            Monitor portfolio drift and execute rebalancing trades to maintain target allocation
          </Paragraph>
        </Col>
        <Col>
          <Space>
            <Button icon={<SaveOutlined />} onClick={() => setModelModalOpen(true)}>
              Load Model
            </Button>
            <Button icon={<ReloadOutlined />} onClick={() => message.info('Refreshing data...')}>
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleStartRebalancing}
              disabled={outOfBoundsCount === 0}
            >
              Start Rebalancing
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Alert for Critical Drift */}
      {outOfBoundsCount > 0 && (
        <Alert
          message="Portfolio Drift Detected"
          description={`${outOfBoundsCount} asset(s) have drifted outside their target ranges. Consider rebalancing to maintain your allocation strategy.`}
          type="warning"
          icon={<WarningOutlined />}
          showIcon
          closable
        />
      )}

      {/* Metrics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <StatCard
            title="Total Portfolio Value"
            value={`$${(totalValue / 1000000).toFixed(1)}M`}
            icon={<DollarOutlined />}
          />
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Max Drift"
              value={maxDrift}
              precision={1}
              suffix="%"
              valueStyle={{ color: maxDrift > 3 ? '#ff4d4f' : '#52c41a' }}
              prefix={maxDrift > 3 ? <AlertOutlined /> : <CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Avg Drift"
              value={avgDrift}
              precision={1}
              suffix="%"
              valueStyle={{ color: avgDrift > 2 ? '#faad14' : '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Out of Bounds"
              value={outOfBoundsCount}
              suffix={`/ ${allocations.length}`}
              valueStyle={{ color: outOfBoundsCount > 0 ? '#ff4d4f' : '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Current vs Target Comparison */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title={<Space><LineChartOutlined />Current vs Target Allocation</Space>}>
            <Column {...allocationComparisonConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Current Allocation Breakdown">
            <Pie {...pieChartConfig} />
          </Card>
        </Col>
      </Row>

      {/* Allocations Table */}
      <Card title="Asset Allocations">
        <Table
          dataSource={allocations}
          columns={allocationsColumns}
          rowKey="symbol"
          pagination={false}
          rowClassName={(record) =>
            record.driftStatus === 'critical'
              ? 'row-critical'
              : record.driftStatus === 'warning'
                ? 'row-warning'
                : ''
          }
        />
      </Card>

      {/* Drift History Chart */}
      <Card title="Historical Drift Tracking">
        <Line {...driftHistoryConfig} />
      </Card>

      {/* Allocation Models Modal */}
      <Modal
        title="Load Allocation Model"
        open={modelModalOpen}
        onCancel={() => setModelModalOpen(false)}
        footer={null}
        width={700}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {mockAllocationModels.map((model) => (
            <Card
              key={model.id}
              size="small"
              hoverable
              onClick={() => handleLoadModel(model.id)}
              style={{ cursor: 'pointer' }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text strong>{model.name}</Text>
                <Text type="secondary">{model.description}</Text>
                <Divider style={{ margin: '8px 0' }} />
                <Row gutter={8}>
                  {model.allocations.map((alloc) => (
                    <Col key={alloc.asset}>
                      <Tag>{alloc.asset}: {alloc.targetWeight}%</Tag>
                    </Col>
                  ))}
                </Row>
              </Space>
            </Card>
          ))}
          <Divider />
          <Button type="dashed" icon={<PlusOutlined />} block>
            Create New Model
          </Button>
        </Space>
      </Modal>

      {/* Rebalancing Modal */}
      <Modal
        title="Portfolio Rebalancing"
        open={rebalanceModalOpen}
        onCancel={() => {
          setRebalanceModalOpen(false);
          setRebalanceStep(0);
        }}
        width={1000}
        footer={null}
      >
        <Steps current={rebalanceStep} style={{ marginBottom: 24 }}>
          <Step title="Review Trades" icon={<LineChartOutlined />} />
          <Step title="Cost Analysis" icon={<DollarOutlined />} />
          <Step title="Execute" icon={<SendOutlined />} />
        </Steps>

        {rebalanceStep === 0 && (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Alert
              message="Calculated Trades"
              description={`${tradeOrders.length} trade order(s) generated to rebalance portfolio to target allocation.`}
              type="info"
              showIcon
            />
            <Table
              dataSource={tradeOrders}
              columns={tradeOrdersColumns}
              rowKey="id"
              pagination={false}
              summary={(data) => (
                <Table.Summary>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={4}>
                      <Text strong>Total</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <Text strong>
                        $
                        {data
                          .reduce((sum, record) => sum + record.estimatedValue, 0)
                          .toLocaleString()}
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2}>
                      <Text>${totalEstimatedFees.toLocaleString()}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={3}>
                      <Text>${totalEstimatedSlippage.toLocaleString()}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={4}>
                      <Text strong>${totalEstimatedCost.toLocaleString()}</Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          </Space>
        )}

        {rebalanceStep === 1 && (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Card title="Transaction Cost Analysis" size="small">
              <Row gutter={16}>
                <Col span={6}>
                  <Statistic title="Total Trade Value" value={`$${(totalEstimatedCost - totalEstimatedFees - totalEstimatedSlippage).toLocaleString()}`} />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Estimated Fees"
                    value={`$${totalEstimatedFees.toLocaleString()}`}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Estimated Slippage"
                    value={`$${totalEstimatedSlippage.toLocaleString()}`}
                    valueStyle={{ color: '#ff7875' }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Total Cost"
                    value={`$${totalEstimatedCost.toLocaleString()}`}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
              </Row>
            </Card>

            <Card title="Cost vs Benefit Analysis" size="small">
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Current Max Drift">
                  {maxDrift.toFixed(2)}%
                </Descriptions.Item>
                <Descriptions.Item label="Expected Max Drift After Rebalancing">
                  0.00%
                </Descriptions.Item>
                <Descriptions.Item label="Total Rebalancing Cost">
                  ${totalEstimatedCost.toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Cost as % of Portfolio">
                  {((totalEstimatedCost / totalValue) * 100).toFixed(3)}%
                </Descriptions.Item>
                <Descriptions.Item label="Market Impact">
                  Low (estimated 5 bps)
                </Descriptions.Item>
                <Descriptions.Item label="Recommendation">
                  <Tag color="green">PROCEED - Cost is justified</Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Alert
              message="Best Execution"
              description="Orders will be executed using TWAP strategy over 30 minutes to minimize market impact."
              type="info"
              showIcon
            />
          </Space>
        )}

        {rebalanceStep === 2 && (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Alert
              message="Ready to Execute"
              description="Review all details before submitting orders to the Order Management System (OMS)."
              type="warning"
              showIcon
              icon={<WarningOutlined />}
            />

            <Card title="Execution Summary" size="small">
              <Descriptions column={2} bordered>
                <Descriptions.Item label="Number of Orders">{tradeOrders.length}</Descriptions.Item>
                <Descriptions.Item label="Total Value">
                  ${(totalEstimatedCost - totalEstimatedFees - totalEstimatedSlippage).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Execution Strategy">TWAP (30 min)</Descriptions.Item>
                <Descriptions.Item label="Destination">Primary Exchange</Descriptions.Item>
                <Descriptions.Item label="Time in Force">Good Till Cancel (GTC)</Descriptions.Item>
                <Descriptions.Item label="Pre-Trade Compliance">
                  <Tag color="green" icon={<CheckCircleOutlined />}>
                    PASSED
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="Target Allocation After Rebalancing" size="small">
              <Row gutter={8}>
                {allocations.map((alloc) => (
                  <Col key={alloc.symbol} span={4}>
                    <Tooltip title={`${alloc.asset} will be at ${alloc.targetWeight}%`}>
                      <Progress
                        type="circle"
                        percent={alloc.targetWeight}
                        width={80}
                        format={(percent) => `${alloc.symbol}\n${percent}%`}
                      />
                    </Tooltip>
                  </Col>
                ))}
              </Row>
            </Card>
          </Space>
        )}

        <Row justify="end" style={{ marginTop: 24 }}>
          <Space>
            <Button onClick={() => setRebalanceModalOpen(false)}>Cancel</Button>
            {rebalanceStep > 0 && (
              <Button onClick={() => setRebalanceStep(rebalanceStep - 1)}>Previous</Button>
            )}
            {rebalanceStep < 2 && (
              <Button type="primary" onClick={() => setRebalanceStep(rebalanceStep + 1)}>
                Next
              </Button>
            )}
            {rebalanceStep === 2 && (
              <Button
                type="primary"
                danger
                icon={<SendOutlined />}
                onClick={handleExecuteRebalancing}
              >
                Execute Rebalancing
              </Button>
            )}
          </Space>
        </Row>
      </Modal>
    </Space>
  );
};

export default RebalancingPage;
