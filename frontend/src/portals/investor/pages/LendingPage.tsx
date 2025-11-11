import { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Button,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Progress,
  Alert,
  Tabs,
  Typography,
  Divider,
  Badge,
  Tooltip,
  Timeline,
} from 'antd';
import {
  BankOutlined,
  DollarOutlined,
  RiseOutlined,
  SafetyOutlined,
  PlusOutlined,
  PercentageOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  LockOutlined,
  UnlockOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import { Line, Column, Pie } from '@ant-design/charts';
import { useTranslation } from 'react-i18next';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface LendingOpportunity {
  id: string;
  provider: string;
  asset: string;
  apr: number;
  minAmount: number;
  maxAmount: number;
  term: string;
  risk: 'low' | 'medium' | 'high';
  collateralized: boolean;
  availableLiquidity: number;
  rating?: string;
}

interface LendingPosition {
  id: string;
  provider: string;
  asset: string;
  principal: number;
  currentValue: number;
  interestEarned: number;
  apr: number;
  startDate: string;
  maturityDate: string;
  status: 'active' | 'matured' | 'withdrawn';
  autoRenew: boolean;
}

interface BorrowingOption {
  id: string;
  provider: string;
  collateralAsset: string;
  borrowAsset: string;
  ltv: number;
  apr: number;
  maxBorrow: number;
  term: string;
  liquidationThreshold: number;
}

interface CollateralPosition {
  asset: string;
  amount: number;
  value: number;
  availableToWithdraw: number;
  utilizationRate: number;
  healthFactor: number;
}

const LendingPage = () => {
  const { t } = useTranslation();
  const [lendModalVisible, setLendModalVisible] = useState(false);
  const [borrowModalVisible, setBorrowModalVisible] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<LendingOpportunity | null>(null);
  const [form] = Form.useForm();

  // Overview metrics
  const totalLent = 1250000;
  const totalEarned = 87500;
  const activePositions = 8;
  const avgAPR = 7.2;
  const totalBorrowed = 450000;
  const totalCollateral = 750000;

  // Lending opportunities
  const lendingOpportunities: LendingOpportunity[] = [
    {
      id: 'lend-001',
      provider: 'Galaxy Digital',
      asset: 'USDC',
      apr: 8.5,
      minAmount: 10000,
      maxAmount: 1000000,
      term: '90 days',
      risk: 'low',
      collateralized: true,
      availableLiquidity: 5000000,
      rating: 'AA',
    },
    {
      id: 'lend-002',
      provider: 'BlockFi',
      asset: 'BTC',
      apr: 6.2,
      minAmount: 0.1,
      maxAmount: 10,
      term: '180 days',
      risk: 'low',
      collateralized: true,
      availableLiquidity: 150,
      rating: 'A+',
    },
    {
      id: 'lend-003',
      provider: 'Celsius Network',
      asset: 'ETH',
      apr: 7.8,
      minAmount: 1,
      maxAmount: 100,
      term: '30 days',
      risk: 'medium',
      collateralized: true,
      availableLiquidity: 2500,
      rating: 'A',
    },
    {
      id: 'lend-004',
      provider: 'Nexo',
      asset: 'USDT',
      apr: 9.2,
      minAmount: 5000,
      maxAmount: 500000,
      term: '60 days',
      risk: 'low',
      collateralized: true,
      availableLiquidity: 3000000,
      rating: 'AA-',
    },
    {
      id: 'lend-005',
      provider: 'Ledn',
      asset: 'BTC',
      apr: 5.5,
      minAmount: 0.05,
      maxAmount: 5,
      term: '365 days',
      risk: 'low',
      collateralized: true,
      availableLiquidity: 75,
      rating: 'A+',
    },
  ];

  // Active lending positions
  const activeLendingPositions: LendingPosition[] = [
    {
      id: 'pos-001',
      provider: 'Galaxy Digital',
      asset: 'USDC',
      principal: 250000,
      currentValue: 262500,
      interestEarned: 12500,
      apr: 8.5,
      startDate: '2025-08-11',
      maturityDate: '2025-11-11',
      status: 'active',
      autoRenew: true,
    },
    {
      id: 'pos-002',
      provider: 'BlockFi',
      asset: 'BTC',
      principal: 350000,
      currentValue: 360850,
      interestEarned: 10850,
      apr: 6.2,
      startDate: '2025-05-11',
      maturityDate: '2026-05-11',
      status: 'active',
      autoRenew: false,
    },
    {
      id: 'pos-003',
      provider: 'Nexo',
      asset: 'USDT',
      principal: 150000,
      currentValue: 154600,
      interestEarned: 4600,
      apr: 9.2,
      startDate: '2025-09-11',
      maturityDate: '2025-11-11',
      status: 'active',
      autoRenew: true,
    },
    {
      id: 'pos-004',
      provider: 'Celsius Network',
      asset: 'ETH',
      principal: 200000,
      currentValue: 205200,
      interestEarned: 5200,
      apr: 7.8,
      startDate: '2025-10-11',
      maturityDate: '2025-11-11',
      status: 'active',
      autoRenew: false,
    },
    {
      id: 'pos-005',
      provider: 'Ledn',
      asset: 'BTC',
      principal: 300000,
      currentValue: 316500,
      interestEarned: 16500,
      apr: 5.5,
      startDate: '2024-11-11',
      maturityDate: '2025-11-11',
      status: 'matured',
      autoRenew: true,
    },
  ];

  // Borrowing options
  const borrowingOptions: BorrowingOption[] = [
    {
      id: 'borrow-001',
      provider: 'Galaxy Digital',
      collateralAsset: 'BTC',
      borrowAsset: 'USDC',
      ltv: 50,
      apr: 6.5,
      maxBorrow: 375000,
      term: 'Open',
      liquidationThreshold: 65,
    },
    {
      id: 'borrow-002',
      provider: 'BlockFi',
      collateralAsset: 'ETH',
      borrowAsset: 'USDC',
      ltv: 45,
      apr: 7.2,
      maxBorrow: 180000,
      term: 'Open',
      liquidationThreshold: 60,
    },
    {
      id: 'borrow-003',
      provider: 'Nexo',
      collateralAsset: 'BTC',
      borrowAsset: 'USDT',
      ltv: 55,
      apr: 5.9,
      maxBorrow: 412500,
      term: 'Open',
      liquidationThreshold: 70,
    },
  ];

  // Collateral positions
  const collateralPositions: CollateralPosition[] = [
    {
      asset: 'BTC',
      amount: 21.3,
      value: 750000,
      availableToWithdraw: 300000,
      utilizationRate: 60,
      healthFactor: 1.85,
    },
    {
      asset: 'ETH',
      amount: 150,
      value: 400000,
      availableToWithdraw: 220000,
      utilizationRate: 45,
      healthFactor: 2.22,
    },
  ];

  // Interest earnings history (monthly)
  const earningsData = [
    { month: '2025-05', earnings: 8500, positions: 5 },
    { month: '2025-06', earnings: 9200, positions: 6 },
    { month: '2025-07', earnings: 10100, positions: 7 },
    { month: '2025-08', earnings: 11800, positions: 8 },
    { month: '2025-09', earnings: 13500, positions: 8 },
    { month: '2025-10', earnings: 15200, positions: 8 },
    { month: '2025-11', earnings: 19200, positions: 8 },
  ];

  // Asset allocation in lending
  const lendingAllocation = [
    { asset: 'USDC', value: 400000, percentage: 32 },
    { asset: 'BTC', value: 350000, percentage: 28 },
    { asset: 'ETH', value: 200000, percentage: 16 },
    { asset: 'USDT', value: 150000, percentage: 12 },
    { asset: 'Other', value: 150000, percentage: 12 },
  ];

  const handleLendClick = (opportunity: LendingOpportunity) => {
    setSelectedOpportunity(opportunity);
    setLendModalVisible(true);
  };

  const handleLendSubmit = (values: any) => {
    console.log('Lending:', values);
    setLendModalVisible(false);
    form.resetFields();
  };

  const handleBorrowSubmit = (values: any) => {
    console.log('Borrowing:', values);
    setBorrowModalVisible(false);
    form.resetFields();
  };

  const opportunityColumns = [
    {
      title: 'Provider',
      dataIndex: 'provider',
      key: 'provider',
      render: (provider: string, record: LendingOpportunity) => (
        <Space>
          <BankOutlined style={{ color: '#1890ff' }} />
          <div>
            <div style={{ fontWeight: 500 }}>{provider}</div>
            {record.rating && (
              <Tag color="blue" style={{ fontSize: 10 }}>
                Rating: {record.rating}
              </Tag>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: 'Asset',
      dataIndex: 'asset',
      key: 'asset',
      render: (asset: string) => <Tag color="cyan">{asset}</Tag>,
    },
    {
      title: 'APR',
      dataIndex: 'apr',
      key: 'apr',
      render: (apr: number) => (
        <Space>
          <PercentageOutlined style={{ color: '#52c41a' }} />
          <Text strong style={{ color: '#52c41a', fontSize: 16 }}>
            {apr}%
          </Text>
        </Space>
      ),
      sorter: (a: LendingOpportunity, b: LendingOpportunity) => a.apr - b.apr,
    },
    {
      title: 'Min / Max',
      key: 'limits',
      render: (record: LendingOpportunity) => (
        <div>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>
            Min: {record.asset.includes('BTC') || record.asset.includes('ETH')
              ? `${record.minAmount} ${record.asset}`
              : `$${record.minAmount.toLocaleString()}`}
          </div>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>
            Max: {record.asset.includes('BTC') || record.asset.includes('ETH')
              ? `${record.maxAmount} ${record.asset}`
              : `$${record.maxAmount.toLocaleString()}`}
          </div>
        </div>
      ),
    },
    {
      title: 'Term',
      dataIndex: 'term',
      key: 'term',
      render: (term: string) => (
        <Space>
          <ClockCircleOutlined />
          <Text>{term}</Text>
        </Space>
      ),
    },
    {
      title: 'Risk',
      dataIndex: 'risk',
      key: 'risk',
      render: (risk: string) => {
        const colors = { low: 'green', medium: 'orange', high: 'red' };
        return <Tag color={colors[risk as keyof typeof colors]}>{risk.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Collateralized',
      dataIndex: 'collateralized',
      key: 'collateralized',
      render: (collateralized: boolean) =>
        collateralized ? (
          <Tag icon={<SafetyOutlined />} color="success">
            Yes
          </Tag>
        ) : (
          <Tag color="default">No</Tag>
        ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (record: LendingOpportunity) => (
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleLendClick(record)}>
          Lend
        </Button>
      ),
    },
  ];

  const positionColumns = [
    {
      title: 'Provider',
      dataIndex: 'provider',
      key: 'provider',
      render: (provider: string) => (
        <Space>
          <BankOutlined style={{ color: '#1890ff' }} />
          <Text>{provider}</Text>
        </Space>
      ),
    },
    {
      title: 'Asset',
      dataIndex: 'asset',
      key: 'asset',
      render: (asset: string) => <Tag color="cyan">{asset}</Tag>,
    },
    {
      title: 'Principal',
      dataIndex: 'principal',
      key: 'principal',
      render: (principal: number) => <Text>${principal.toLocaleString()}</Text>,
    },
    {
      title: 'Current Value',
      dataIndex: 'currentValue',
      key: 'currentValue',
      render: (value: number, record: LendingPosition) => (
        <div>
          <div style={{ fontWeight: 500 }}>${value.toLocaleString()}</div>
          <Text type="success" style={{ fontSize: 12 }}>
            +${record.interestEarned.toLocaleString()} ({record.apr}% APR)
          </Text>
        </div>
      ),
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'Maturity',
      dataIndex: 'maturityDate',
      key: 'maturityDate',
      render: (date: string, record: LendingPosition) => {
        const today = new Date('2025-11-11');
        const maturity = new Date(date);
        const daysLeft = Math.ceil((maturity.getTime() - today.getTime()) / (1000 * 3600 * 24));
        return (
          <div>
            <div>{date}</div>
            {record.status === 'active' && (
              <Text type={daysLeft < 30 ? 'warning' : 'secondary'} style={{ fontSize: 12 }}>
                {daysLeft > 0 ? `${daysLeft} days left` : 'Matured'}
              </Text>
            )}
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: LendingPosition) => {
        const statusConfig = {
          active: { color: 'success', icon: <CheckCircleOutlined /> },
          matured: { color: 'warning', icon: <ClockCircleOutlined /> },
          withdrawn: { color: 'default', icon: <CheckCircleOutlined /> },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return (
          <Space direction="vertical" size={0}>
            <Tag icon={config.icon} color={config.color}>
              {status.toUpperCase()}
            </Tag>
            {record.autoRenew && status === 'active' && (
              <Tag color="blue" style={{ fontSize: 10 }}>
                Auto-Renew
              </Tag>
            )}
          </Space>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (record: LendingPosition) => (
        <Space>
          {record.status === 'active' && (
            <Button size="small" type="link">
              Withdraw Early
            </Button>
          )}
          {record.status === 'matured' && (
            <Button size="small" type="primary">
              Withdraw
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const borrowingColumns = [
    {
      title: 'Provider',
      dataIndex: 'provider',
      key: 'provider',
    },
    {
      title: 'Collateral',
      dataIndex: 'collateralAsset',
      key: 'collateralAsset',
      render: (asset: string) => <Tag color="gold">{asset}</Tag>,
    },
    {
      title: 'Borrow',
      dataIndex: 'borrowAsset',
      key: 'borrowAsset',
      render: (asset: string) => <Tag color="blue">{asset}</Tag>,
    },
    {
      title: 'Max LTV',
      dataIndex: 'ltv',
      key: 'ltv',
      render: (ltv: number) => <Text>{ltv}%</Text>,
    },
    {
      title: 'APR',
      dataIndex: 'apr',
      key: 'apr',
      render: (apr: number) => (
        <Text strong style={{ color: '#ff4d4f' }}>
          {apr}%
        </Text>
      ),
    },
    {
      title: 'Max Borrow',
      dataIndex: 'maxBorrow',
      key: 'maxBorrow',
      render: (amount: number) => <Text>${amount.toLocaleString()}</Text>,
    },
    {
      title: 'Liquidation',
      dataIndex: 'liquidationThreshold',
      key: 'liquidationThreshold',
      render: (threshold: number) => (
        <Tooltip title="Loan will be liquidated if LTV exceeds this threshold">
          <Tag color="red" icon={<WarningOutlined />}>
            {threshold}%
          </Tag>
        </Tooltip>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Button type="primary" danger icon={<ArrowDownOutlined />} onClick={() => setBorrowModalVisible(true)}>
          Borrow
        </Button>
      ),
    },
  ];

  const collateralColumns = [
    {
      title: 'Asset',
      dataIndex: 'asset',
      key: 'asset',
      render: (asset: string) => <Tag color="gold">{asset}</Tag>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number, record: CollateralPosition) => (
        <Text>
          {amount} {record.asset}
        </Text>
      ),
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => <Text strong>${value.toLocaleString()}</Text>,
    },
    {
      title: 'Available to Withdraw',
      dataIndex: 'availableToWithdraw',
      key: 'availableToWithdraw',
      render: (amount: number) => <Text type="success">${amount.toLocaleString()}</Text>,
    },
    {
      title: 'Utilization',
      dataIndex: 'utilizationRate',
      key: 'utilizationRate',
      render: (rate: number) => (
        <Progress
          percent={rate}
          strokeColor={rate > 70 ? '#ff4d4f' : rate > 50 ? '#faad14' : '#52c41a'}
          style={{ width: 100 }}
        />
      ),
    },
    {
      title: 'Health Factor',
      dataIndex: 'healthFactor',
      key: 'healthFactor',
      render: (factor: number) => (
        <Tag color={factor > 2 ? 'green' : factor > 1.5 ? 'orange' : 'red'}>
          {factor.toFixed(2)}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space>
          <Button size="small" icon={<PlusOutlined />}>
            Add
          </Button>
          <Button size="small" icon={<UnlockOutlined />}>
            Withdraw
          </Button>
        </Space>
      ),
    },
  ];

  const earningsChartConfig = {
    data: earningsData,
    xField: 'month',
    yField: 'earnings',
    smooth: true,
    color: '#52c41a',
    point: {
      size: 5,
      shape: 'circle',
    },
    label: {
      style: {
        fill: '#52c41a',
      },
    },
  };

  const allocationChartConfig = {
    data: lendingAllocation,
    angleField: 'value',
    colorField: 'asset',
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      type: 'outer',
      content: '{name} {percentage}%',
    },
    interactions: [{ type: 'element-active' }],
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <BankOutlined /> Lending & Borrowing
        </Title>
        <Paragraph type="secondary">
          Earn interest on your crypto assets or borrow against your portfolio with competitive rates
        </Paragraph>
      </div>

      {/* Overview Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Lent"
              value={totalLent}
              prefix={<DollarOutlined />}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Across {activePositions} active positions
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Interest Earned (Total)"
              value={totalEarned}
              prefix={<RiseOutlined />}
              precision={0}
              valueStyle={{ color: '#52c41a' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Average APR: {avgAPR}%
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Borrowed"
              value={totalBorrowed}
              prefix={<ArrowDownOutlined />}
              precision={0}
              valueStyle={{ color: '#ff4d4f' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Collateral: ${totalCollateral.toLocaleString()}
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Portfolio Health"
              value={1.85}
              prefix={<SafetyOutlined />}
              precision={2}
              valueStyle={{ color: '#1890ff' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Safe zone (&gt;1.5)
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Main Content Tabs */}
      <Tabs
        defaultActiveKey="opportunities"
        items={[
          {
            key: 'opportunities',
            label: (
              <span>
                <ArrowUpOutlined />
                Lending Opportunities
              </span>
            ),
            children: (
              <>
                <Alert
                  message="Earn Passive Income"
                  description="Lend your crypto assets to earn competitive interest rates. All opportunities are fully collateralized and audited."
                  type="info"
                  showIcon
                  icon={<InfoCircleOutlined />}
                  style={{ marginBottom: 16 }}
                />
                <Card>
                  <Table
                    columns={opportunityColumns}
                    dataSource={lendingOpportunities}
                    rowKey="id"
                    pagination={false}
                  />
                </Card>
              </>
            ),
          },
          {
            key: 'positions',
            label: (
              <span>
                <LockOutlined />
                My Lending Positions
                <Badge count={activePositions} offset={[10, 0]} />
              </span>
            ),
            children: (
              <>
                <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                  <Col span={12}>
                    <Card title="Interest Earnings Over Time" size="small">
                      <Line {...earningsChartConfig} height={200} />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="Asset Allocation" size="small">
                      <Pie {...allocationChartConfig} height={200} />
                    </Card>
                  </Col>
                </Row>
                <Card>
                  <Table
                    columns={positionColumns}
                    dataSource={activeLendingPositions}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                  />
                </Card>
              </>
            ),
          },
          {
            key: 'borrowing',
            label: (
              <span>
                <ArrowDownOutlined />
                Borrowing Options
              </span>
            ),
            children: (
              <>
                <Alert
                  message="Borrow Against Your Portfolio"
                  description="Access liquidity without selling your crypto. Use your assets as collateral to borrow stablecoins at competitive rates."
                  type="warning"
                  showIcon
                  icon={<WarningOutlined />}
                  style={{ marginBottom: 16 }}
                />

                <Card title="Available Borrowing Options" style={{ marginBottom: 16 }}>
                  <Table
                    columns={borrowingColumns}
                    dataSource={borrowingOptions}
                    rowKey="id"
                    pagination={false}
                  />
                </Card>

                <Card
                  title={
                    <Space>
                      <SafetyOutlined />
                      <span>Collateral Management</span>
                      <Tag color="blue">Total: ${totalCollateral.toLocaleString()}</Tag>
                    </Space>
                  }
                >
                  <Table
                    columns={collateralColumns}
                    dataSource={collateralPositions}
                    rowKey="asset"
                    pagination={false}
                  />
                  <Divider />
                  <Alert
                    message="Health Factor Guide"
                    description={
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        <li>
                          <Text strong style={{ color: '#52c41a' }}>
                            {'>'} 2.0:
                          </Text>{' '}
                          Safe - Low liquidation risk
                        </li>
                        <li>
                          <Text strong style={{ color: '#faad14' }}>
                            1.5 - 2.0:
                          </Text>{' '}
                          Moderate - Consider adding collateral
                        </li>
                        <li>
                          <Text strong style={{ color: '#ff4d4f' }}>
                            {'<'} 1.5:
                          </Text>{' '}
                          Risky - Add collateral immediately to avoid liquidation
                        </li>
                      </ul>
                    }
                    type="info"
                    showIcon
                  />
                </Card>
              </>
            ),
          },
          {
            key: 'history',
            label: (
              <span>
                <ClockCircleOutlined />
                Transaction History
              </span>
            ),
            children: (
              <Card>
                <Timeline
                  items={[
                    {
                      color: 'green',
                      dot: <CheckCircleOutlined />,
                      children: (
                        <div>
                          <Text strong>Interest Payment Received</Text>
                          <div style={{ color: '#8c8c8c', fontSize: 12 }}>
                            +$4,600 from Nexo USDT lending - Nov 11, 2025 10:30 AM
                          </div>
                        </div>
                      ),
                    },
                    {
                      color: 'blue',
                      children: (
                        <div>
                          <Text strong>New Lending Position Opened</Text>
                          <div style={{ color: '#8c8c8c', fontSize: 12 }}>
                            $200,000 ETH lent to Celsius Network @ 7.8% APR - Oct 11, 2025
                          </div>
                        </div>
                      ),
                    },
                    {
                      color: 'green',
                      dot: <CheckCircleOutlined />,
                      children: (
                        <div>
                          <Text strong>Interest Payment Received</Text>
                          <div style={{ color: '#8c8c8c', fontSize: 12 }}>
                            +$12,500 from Galaxy Digital USDC lending - Oct 11, 2025
                          </div>
                        </div>
                      ),
                    },
                    {
                      color: 'orange',
                      children: (
                        <div>
                          <Text strong>Position Matured & Auto-Renewed</Text>
                          <div style={{ color: '#8c8c8c', fontSize: 12 }}>
                            $250,000 USDC position with Galaxy Digital - Sep 11, 2025
                          </div>
                        </div>
                      ),
                    },
                    {
                      color: 'blue',
                      children: (
                        <div>
                          <Text strong>New Lending Position Opened</Text>
                          <div style={{ color: '#8c8c8c', fontSize: 12 }}>
                            $150,000 USDT lent to Nexo @ 9.2% APR - Sep 11, 2025
                          </div>
                        </div>
                      ),
                    },
                    {
                      color: 'blue',
                      children: (
                        <div>
                          <Text strong>New Lending Position Opened</Text>
                          <div style={{ color: '#8c8c8c', fontSize: 12 }}>
                            $250,000 USDC lent to Galaxy Digital @ 8.5% APR - Aug 11, 2025
                          </div>
                        </div>
                      ),
                    },
                  ]}
                />
              </Card>
            ),
          },
        ]}
      />

      {/* Lend Modal */}
      <Modal
        title={
          <Space>
            <ArrowUpOutlined style={{ color: '#52c41a' }} />
            <span>Create Lending Position</span>
          </Space>
        }
        open={lendModalVisible}
        onCancel={() => {
          setLendModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        {selectedOpportunity && (
          <>
            <Alert
              message={`Lending to ${selectedOpportunity.provider}`}
              description={
                <div>
                  <div>
                    Asset: <Tag color="cyan">{selectedOpportunity.asset}</Tag>
                  </div>
                  <div>
                    APR: <Text strong style={{ color: '#52c41a' }}>{selectedOpportunity.apr}%</Text>
                  </div>
                  <div>Term: {selectedOpportunity.term}</div>
                  <div>
                    Risk Level:{' '}
                    <Tag color={selectedOpportunity.risk === 'low' ? 'green' : 'orange'}>
                      {selectedOpportunity.risk.toUpperCase()}
                    </Tag>
                  </div>
                </div>
              }
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <Form form={form} layout="vertical" onFinish={handleLendSubmit}>
              <Form.Item
                label="Amount"
                name="amount"
                rules={[
                  { required: true, message: 'Please enter amount' },
                  {
                    type: 'number',
                    min: selectedOpportunity.minAmount,
                    max: selectedOpportunity.maxAmount,
                    message: `Amount must be between ${selectedOpportunity.minAmount} and ${selectedOpportunity.maxAmount}`,
                  },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  prefix={selectedOpportunity.asset.includes('USD') ? '$' : ''}
                  suffix={selectedOpportunity.asset}
                  placeholder={`Min: ${selectedOpportunity.minAmount}`}
                />
              </Form.Item>
              <Form.Item label="Auto-Renew" name="autoRenew" valuePropName="checked">
                <Select defaultValue={false}>
                  <Option value={true}>Yes - Auto-renew at maturity</Option>
                  <Option value={false}>No - Withdraw at maturity</Option>
                </Select>
              </Form.Item>
              <Divider />
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">Estimated Earnings:</Text>
                <div>
                  <Text strong style={{ fontSize: 18, color: '#52c41a' }}>
                    Calculate based on your amount
                  </Text>
                </div>
              </div>
              <Form.Item>
                <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                  <Button
                    onClick={() => {
                      setLendModalVisible(false);
                      form.resetFields();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit" icon={<CheckCircleOutlined />}>
                    Confirm Lending
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>

      {/* Borrow Modal */}
      <Modal
        title={
          <Space>
            <ArrowDownOutlined style={{ color: '#ff4d4f' }} />
            <span>Borrow Against Collateral</span>
          </Space>
        }
        open={borrowModalVisible}
        onCancel={() => {
          setBorrowModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Alert
          message="Important: Liquidation Risk"
          description="If your loan-to-value (LTV) ratio exceeds the liquidation threshold, your collateral may be liquidated. Monitor your health factor closely."
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          style={{ marginBottom: 16 }}
        />
        <Form form={form} layout="vertical" onFinish={handleBorrowSubmit}>
          <Form.Item
            label="Collateral Asset"
            name="collateralAsset"
            rules={[{ required: true, message: 'Please select collateral asset' }]}
          >
            <Select placeholder="Select asset to use as collateral">
              <Option value="BTC">BTC (21.3 available)</Option>
              <Option value="ETH">ETH (150 available)</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Borrow Asset"
            name="borrowAsset"
            rules={[{ required: true, message: 'Please select borrow asset' }]}
          >
            <Select placeholder="Select asset to borrow">
              <Option value="USDC">USDC</Option>
              <Option value="USDT">USDT</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Borrow Amount"
            name="borrowAmount"
            rules={[{ required: true, message: 'Please enter borrow amount' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              prefix="$"
              placeholder="Enter amount to borrow"
            />
          </Form.Item>
          <Form.Item label="Provider" name="provider" rules={[{ required: true }]}>
            <Select placeholder="Select lending provider">
              <Option value="galaxy">Galaxy Digital (APR: 6.5%)</Option>
              <Option value="blockfi">BlockFi (APR: 7.2%)</Option>
              <Option value="nexo">Nexo (APR: 5.9%)</Option>
            </Select>
          </Form.Item>
          <Divider />
          <div style={{ marginBottom: 16 }}>
            <div>
              <Text type="secondary">Estimated Interest (Annual):</Text>
              <Text strong> Calculate based on amount</Text>
            </div>
            <div>
              <Text type="secondary">Health Factor:</Text>
              <Tag color="green">Will be calculated</Tag>
            </div>
          </div>
          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button
                onClick={() => {
                  setBorrowModalVisible(false);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button type="primary" danger htmlType="submit" icon={<CheckCircleOutlined />}>
                Confirm Borrowing
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LendingPage;
