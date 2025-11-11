import { Card, Col, Row, Statistic, Table, Tag, Progress, Button, Space, Timeline, Badge } from 'antd';
import {
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
  TeamOutlined,
  SwapOutlined,
  TrophyOutlined,
  BankOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { Line, Column, Pie } from '@ant-design/charts';
import { StatCard, PerformanceChart } from '../../../components/common';

export default function DashboardPage() {
  // Mock data for Fund Manager Dashboard - Replace with real Supabase data
  const fundMetrics = {
    fundName: 'Alpha Growth Fund',
    currentNAV: 127.85,
    totalAUM: 85000000, // $85M
    investors: 245,
    monthlyReturn: 2.3, // %
    ytdReturn: 18.2, // %
    tradersActive: 8,
    pendingOrders: 12,
  };

  const navHistoryData = [
    { date: '2024-01', nav: 100.0 },
    { date: '2024-02', nav: 102.5 },
    { date: '2024-03', nav: 105.8 },
    { date: '2024-04', nav: 108.2 },
    { date: '2024-05', nav: 112.4 },
    { date: '2024-06', nav: 115.7 },
    { date: '2024-07', nav: 118.9 },
    { date: '2024-08', nav: 121.3 },
    { date: '2024-09', nav: 124.6 },
    { date: '2024-10', nav: 126.1 },
    { date: '2024-11', nav: 127.85 },
  ];

  const assetAllocation = [
    { asset: 'BTC', value: 42, amount: 35700000 },
    { asset: 'ETH', value: 28, amount: 23800000 },
    { asset: 'Tokens', value: 18, amount: 15300000 },
    { asset: 'Stablecoins', value: 10, amount: 8500000 },
    { asset: 'Others', value: 2, amount: 1700000 },
  ];

  const performanceByAsset = [
    { asset: 'BTC', return: 15.2 },
    { asset: 'ETH', return: 22.8 },
    { asset: 'SOL', return: 45.3 },
    { asset: 'MATIC', return: 12.1 },
    { asset: 'LINK', return: 8.7 },
  ];

  const topTraders = [
    {
      key: '1',
      name: 'John Trader',
      trades: 145,
      volume: 12500000,
      profitLoss: 245000,
      winRate: 68.5,
      status: 'active',
    },
    {
      key: '2',
      name: 'Sarah Johnson',
      trades: 98,
      volume: 8200000,
      profitLoss: 182000,
      winRate: 71.2,
      status: 'active',
    },
    {
      key: '3',
      name: 'Michael Chen',
      trades: 76,
      volume: 6800000,
      profitLoss: -45000,
      winRate: 54.3,
      status: 'review',
    },
    {
      key: '4',
      name: 'Emily Davis',
      trades: 124,
      volume: 9400000,
      profitLoss: 198000,
      winRate: 65.8,
      status: 'active',
    },
  ];

  const recentTransactions = [
    {
      key: '1',
      type: 'Buy',
      asset: 'BTC',
      amount: 2.5,
      value: 125000,
      trader: 'John Trader',
      time: '2 hours ago',
    },
    {
      key: '2',
      type: 'Sell',
      asset: 'ETH',
      amount: 45,
      value: 85000,
      trader: 'Sarah Johnson',
      time: '4 hours ago',
    },
    {
      key: '3',
      type: 'Buy',
      asset: 'SOL',
      amount: 1200,
      value: 95000,
      trader: 'Emily Davis',
      time: '6 hours ago',
    },
  ];

  // Tokenization status for this fund
  const fundTokenizationStatus = {
    isTokenized: true,
    tokenSymbol: 'AGROWTH',
    contractAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    blockchain: 'Ethereum',
    totalTokensIssued: 850000,
    tokenHolders: 245,
    complianceStandard: 'ERC-3643',
    nextComplianceAudit: '2024-12-15',
    recentMilestones: [
      {
        date: '2024-11-10',
        event: '15 new investors onboarded (US)',
        status: 'completed',
      },
      {
        date: '2024-11-08',
        event: 'SEC Form D amendment filed',
        status: 'completed',
      },
      {
        date: '2024-11-05',
        event: 'Q3 investor reporting completed',
        status: 'completed',
      },
      {
        date: '2024-11-12',
        event: 'Compliance audit scheduled',
        status: 'pending',
      },
    ],
  };

  const navChartConfig = {
    data: navHistoryData,
    xField: 'date',
    yField: 'nav',
    smooth: true,
    meta: {
      nav: {
        alias: 'NAV',
        formatter: (v: number) => `$${v.toFixed(2)}`,
      },
    },
  };

  const assetAllocationConfig = {
    data: assetAllocation,
    angleField: 'value',
    colorField: 'asset',
    radius: 0.8,
    label: {
      type: 'outer' as const,
      content: '{name} {percentage}',
    },
    interactions: [
      {
        type: 'element-active' as const,
      },
    ],
  };

  const performanceConfig = {
    data: performanceByAsset,
    xField: 'asset',
    yField: 'return',
    label: {
      position: 'top' as const,
      formatter: (datum: any) => `${datum.return.toFixed(1)}%`,
    },
    meta: {
      return: {
        alias: 'Return',
        formatter: (v: number) => `${v.toFixed(1)}%`,
      },
    },
  };

  const traderColumns = [
    {
      title: 'Trader',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Trades',
      dataIndex: 'trades',
      key: 'trades',
    },
    {
      title: 'Volume',
      dataIndex: 'volume',
      key: 'volume',
      render: (vol: number) => `$${(vol / 1000000).toFixed(1)}M`,
      sorter: (a: any, b: any) => a.volume - b.volume,
    },
    {
      title: 'P&L',
      dataIndex: 'profitLoss',
      key: 'profitLoss',
      render: (pl: number) => (
        <Tag color={pl >= 0 ? 'green' : 'red'}>
          {pl >= 0 ? '+' : ''}${(pl / 1000).toFixed(0)}K
        </Tag>
      ),
    },
    {
      title: 'Win Rate',
      dataIndex: 'winRate',
      key: 'winRate',
      render: (rate: number) => `${rate.toFixed(1)}%`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'orange'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small">View</Button>
          <Button type="link" size="small">Manage</Button>
        </Space>
      ),
    },
  ];

  const transactionColumns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'Buy' ? 'green' : 'red'}>{type}</Tag>
      ),
    },
    {
      title: 'Asset',
      dataIndex: 'asset',
      key: 'asset',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (val: number) => `$${val.toLocaleString()}`,
    },
    {
      title: 'Trader',
      dataIndex: 'trader',
      key: 'trader',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Fund Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
          {fundMetrics.fundName}
        </h1>
        <p style={{ color: '#8c8c8c', fontSize: '14px' }}>
          Fund Manager Dashboard
        </p>
      </div>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Current NAV"
            value={`$${fundMetrics.currentNAV.toFixed(2)}`}
            icon={<TrophyOutlined />}
            trend={fundMetrics.monthlyReturn >= 0 ? 'up' : 'down'}
            trendValue={Math.abs(fundMetrics.monthlyReturn)}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total AUM"
            value={`$${(fundMetrics.totalAUM / 1000000).toFixed(1)}M`}
            icon={<DollarOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Investors"
            value={fundMetrics.investors.toString()}
            icon={<TeamOutlined />}
            color="#722ed1"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="YTD Return"
              value={fundMetrics.ytdReturn}
              precision={1}
              valueStyle={{ color: '#3f8600' }}
              prefix={<RiseOutlined />}
              suffix="%"
            />
            <Progress
              percent={fundMetrics.ytdReturn}
              strokeColor="#52c41a"
              showInfo={false}
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Secondary Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={8} lg={6}>
          <Card size="small">
            <Statistic
              title="Active Traders"
              value={fundMetrics.tradersActive}
              prefix={<SwapOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={6}>
          <Card size="small">
            <Statistic
              title="Pending Orders"
              value={fundMetrics.pendingOrders}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={6}>
          <Card size="small">
            <Statistic
              title="30d Return"
              value={fundMetrics.monthlyReturn}
              precision={1}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
              prefix={<RiseOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={6}>
          <Card size="small">
            <Button type="primary" block>
              View Full NAV Report
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Tokenization Status */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Card
            title={
              <Space>
                <RocketOutlined />
                <span>Fund Tokenization Status</span>
                <Tag color="green">ACTIVE</Tag>
              </Space>
            }
            bordered={false}
            extra={
              <Button type="primary" icon={<FileTextOutlined />}>
                View Full Details
              </Button>
            }
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12} lg={6}>
                <Card size="small" style={{ marginBottom: 8 }}>
                  <Statistic
                    title="Token Symbol"
                    value={fundTokenizationStatus.tokenSymbol}
                    valueStyle={{ fontSize: '18px', color: '#1890ff', fontWeight: 'bold' }}
                  />
                  <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: 4 }}>
                    {fundTokenizationStatus.complianceStandard}
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={12} lg={6}>
                <Card size="small" style={{ marginBottom: 8 }}>
                  <Statistic
                    title="Tokens Issued"
                    value={fundTokenizationStatus.totalTokensIssued.toLocaleString()}
                    valueStyle={{ fontSize: '18px', color: '#52c41a' }}
                  />
                  <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: 4 }}>
                    {fundTokenizationStatus.blockchain}
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={12} lg={6}>
                <Card size="small" style={{ marginBottom: 8 }}>
                  <Statistic
                    title="Token Holders"
                    value={fundTokenizationStatus.tokenHolders}
                    valueStyle={{ fontSize: '18px', color: '#722ed1' }}
                    prefix={<TeamOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} md={12} lg={6}>
                <Card size="small" style={{ marginBottom: 8 }}>
                  <Statistic
                    title="Next Audit"
                    value={fundTokenizationStatus.nextComplianceAudit}
                    valueStyle={{ fontSize: '14px', color: '#fa8c16' }}
                  />
                </Card>
              </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col xs={24} lg={12}>
                <Card size="small" title="Smart Contract" style={{ height: '100%' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: 4 }}>
                        Contract Address
                      </div>
                      <div style={{ fontFamily: 'monospace', fontSize: '13px', wordBreak: 'break-all' }}>
                        {fundTokenizationStatus.contractAddress}
                      </div>
                    </div>
                    <Button type="link" size="small" style={{ padding: 0 }}>
                      View on Etherscan →
                    </Button>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card size="small" title="Recent Milestones" style={{ height: '100%' }}>
                  <Timeline
                    items={fundTokenizationStatus.recentMilestones.map((milestone) => ({
                      color: milestone.status === 'completed' ? 'green' : 'blue',
                      dot:
                        milestone.status === 'completed' ? (
                          <CheckCircleOutlined style={{ fontSize: '14px' }} />
                        ) : (
                          <ClockCircleOutlined style={{ fontSize: '14px' }} />
                        ),
                      children: (
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 500 }}>
                            {milestone.event}
                          </div>
                          <div style={{ fontSize: '11px', color: '#8c8c8c' }}>
                            {milestone.date}
                          </div>
                        </div>
                      ),
                    }))}
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={16}>
          <Card title="NAV History" bordered={false}>
            <Line {...navChartConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Asset Allocation" bordered={false}>
            <Pie {...assetAllocationConfig} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title="Performance by Asset" bordered={false}>
            <Column {...performanceConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Recent Transactions" bordered={false}>
            <Table
              dataSource={recentTransactions}
              columns={transactionColumns}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* Traders Table */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Trader Performance" bordered={false}>
            <Table
              dataSource={topTraders}
              columns={traderColumns}
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
