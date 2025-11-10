import { Card, Col, Row, Statistic, Table, Tag, Select, DatePicker, Space } from 'antd';
import {
  UserOutlined,
  DollarOutlined,
  SwapOutlined,
  RiseOutlined,
  FallOutlined,
  LineChartOutlined,
  PieChartOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { Line, Column, Pie, Area } from '@ant-design/charts';
import { StatCard } from '../../../components/common';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

export default function PlatformAnalyticsPage() {
  // Mock analytics data
  const platformMetrics = {
    totalUsers: 1247,
    activeUsers: 892,
    newUsersThisMonth: 156,
    userGrowthRate: 14.2,
    totalTransactions: 8945,
    totalVolume: 245680000,
    avgTransactionSize: 27456,
    transactionGrowth: 23.5,
  };

  // User growth over time
  const userGrowthData = [
    { month: 'Jan', total: 450, new: 45, active: 320 },
    { month: 'Feb', total: 520, new: 70, active: 380 },
    { month: 'Mar', total: 610, new: 90, active: 450 },
    { month: 'Apr', total: 720, new: 110, active: 530 },
    { month: 'May', total: 850, new: 130, active: 640 },
    { month: 'Jun', total: 990, new: 140, active: 750 },
    { month: 'Jul', total: 1100, new: 110, active: 820 },
    { month: 'Aug', total: 1180, new: 80, active: 870 },
    { month: 'Sep', total: 1220, new: 40, active: 885 },
    { month: 'Oct', total: 1235, new: 15, active: 890 },
    { month: 'Nov', total: 1247, new: 12, active: 892 },
  ];

  // Transaction volume by day
  const transactionVolumeData = [
    { date: 'Nov 1', volume: 2100000, count: 45 },
    { date: 'Nov 2', volume: 1850000, count: 38 },
    { date: 'Nov 3', volume: 2450000, count: 52 },
    { date: 'Nov 4', volume: 1920000, count: 41 },
    { date: 'Nov 5', volume: 2680000, count: 58 },
    { date: 'Nov 6', volume: 2340000, count: 49 },
    { date: 'Nov 7', volume: 2890000, count: 63 },
    { date: 'Nov 8', volume: 2120000, count: 46 },
    { date: 'Nov 9', volume: 2560000, count: 54 },
    { date: 'Nov 10', volume: 2980000, count: 67 },
  ];

  // User types distribution
  const userTypesData = [
    { type: 'Investors', value: 892, percentage: 71.5 },
    { type: 'Fund Managers', value: 245, percentage: 19.6 },
    { type: 'Traders', value: 85, percentage: 6.8 },
    { type: 'Admins', value: 25, percentage: 2.0 },
  ];

  // Fund performance comparison
  const fundPerformanceData = [
    { fund: 'Alpha Growth', aum: 85, performance: 18.2, investors: 245 },
    { fund: 'Beta Stable', aum: 62, performance: 12.5, investors: 189 },
    { fund: 'Gamma Yield', aum: 48, performance: 8.9, investors: 156 },
    { fund: 'Delta Risk', aum: 35, performance: 24.7, investors: 98 },
    { fund: 'Epsilon Crypto', aum: 16, performance: -5.3, investors: 67 },
  ];

  // Top revenue sources
  const revenueSourcesData = [
    {
      key: '1',
      source: 'Transaction Fees',
      amount: 1250000,
      percentage: 45,
      trend: 'up',
      change: 12.3,
    },
    {
      key: '2',
      source: 'Management Fees',
      amount: 980000,
      percentage: 35,
      trend: 'up',
      change: 8.7,
    },
    {
      key: '3',
      source: 'Performance Fees',
      amount: 420000,
      percentage: 15,
      trend: 'up',
      change: 24.1,
    },
    {
      key: '4',
      source: 'Subscription Fees',
      amount: 140000,
      percentage: 5,
      trend: 'down',
      change: -3.2,
    },
  ];

  // Charts configurations
  const userGrowthConfig = {
    data: userGrowthData,
    xField: 'month',
    yField: 'total',
    smooth: true,
    point: {
      size: 5,
      shape: 'circle',
    },
    meta: {
      total: {
        alias: 'Total Users',
      },
    },
  };

  const transactionVolumeConfig = {
    data: transactionVolumeData,
    xField: 'date',
    yField: 'volume',
    columnWidthRatio: 0.6,
    label: {
      position: 'top' as const,
      formatter: (datum: any) => `$${(datum.volume / 1000000).toFixed(1)}M`,
    },
    meta: {
      volume: {
        alias: 'Volume',
        formatter: (v: number) => `$${(v / 1000000).toFixed(2)}M`,
      },
    },
  };

  const userTypesConfig = {
    data: userTypesData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      type: 'outer' as const,
      content: '{name} {percentage}%',
    },
    statistic: {
      title: {
        content: 'Total',
      },
      content: {
        content: platformMetrics.totalUsers.toString(),
      },
    },
  };

  const fundPerformanceConfig = {
    data: fundPerformanceData,
    xField: 'fund',
    yField: 'performance',
    seriesField: 'fund',
    label: {
      position: 'top' as const,
      formatter: (datum: any) => `${datum.performance}%`,
    },
    meta: {
      performance: {
        alias: 'Performance',
        formatter: (v: number) => `${v}%`,
      },
    },
  };

  const revenueColumns = [
    {
      title: 'Revenue Source',
      dataIndex: 'source',
      key: 'source',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amt: number) => `$${(amt / 1000).toFixed(0)}K`,
      sorter: (a: any, b: any) => a.amount - b.amount,
    },
    {
      title: '% of Total',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (pct: number) => `${pct}%`,
    },
    {
      title: 'Trend',
      dataIndex: 'trend',
      key: 'trend',
      render: (trend: string, record: any) => (
        <Tag
          color={trend === 'up' ? 'green' : 'red'}
          icon={trend === 'up' ? <RiseOutlined /> : <FallOutlined />}
        >
          {trend === 'up' ? '+' : ''}{record.change}%
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header with filters */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
            Platform Analytics
          </h1>
          <p style={{ color: '#8c8c8c', fontSize: '14px' }}>
            Comprehensive insights and metrics
          </p>
        </div>
        <Space>
          <Select defaultValue="30d" style={{ width: 120 }}>
            <Select.Option value="7d">Last 7 days</Select.Option>
            <Select.Option value="30d">Last 30 days</Select.Option>
            <Select.Option value="90d">Last 90 days</Select.Option>
            <Select.Option value="1y">Last year</Select.Option>
          </Select>
          <RangePicker
            defaultValue={[dayjs().subtract(30, 'days'), dayjs()]}
          />
        </Space>
      </div>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Users"
            value={platformMetrics.totalUsers.toLocaleString()}
            icon={<UserOutlined />}
            trend={{ value: platformMetrics.userGrowthRate, isPositive: true }}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Active Users"
            value={platformMetrics.activeUsers.toLocaleString()}
            icon={<UserOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Volume"
            value={`$${(platformMetrics.totalVolume / 1000000).toFixed(1)}M`}
            icon={<DollarOutlined />}
            trend={{ value: platformMetrics.transactionGrowth, isPositive: true }}
            color="#722ed1"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Transactions"
            value={platformMetrics.totalTransactions.toLocaleString()}
            icon={<SwapOutlined />}
            color="#fa8c16"
          />
        </Col>
      </Row>

      {/* Secondary Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="New Users (30d)"
              value={platformMetrics.newUsersThisMonth}
              prefix={<UserOutlined />}
              valueStyle={{ fontSize: '20px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="Avg Transaction"
              value={platformMetrics.avgTransactionSize}
              prefix="$"
              valueStyle={{ fontSize: '20px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="User Growth"
              value={platformMetrics.userGrowthRate}
              suffix="%"
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#3f8600', fontSize: '20px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="Volume Growth"
              value={platformMetrics.transactionGrowth}
              suffix="%"
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#3f8600', fontSize: '20px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row 1 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={16}>
          <Card
            title="User Growth Trend"
            bordered={false}
            extra={<LineChartOutlined />}
          >
            <Line {...userGrowthConfig} height={300} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title="User Types Distribution"
            bordered={false}
            extra={<PieChartOutlined />}
          >
            <Pie {...userTypesConfig} height={300} />
          </Card>
        </Col>
      </Row>

      {/* Charts Row 2 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card
            title="Daily Transaction Volume"
            bordered={false}
            extra={<BarChartOutlined />}
          >
            <Column {...transactionVolumeConfig} height={300} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title="Fund Performance Comparison"
            bordered={false}
            extra={<BarChartOutlined />}
          >
            <Column {...fundPerformanceConfig} height={300} />
          </Card>
        </Col>
      </Row>

      {/* Revenue Sources Table */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Revenue Sources" bordered={false}>
            <Table
              dataSource={revenueSourcesData}
              columns={revenueColumns}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
