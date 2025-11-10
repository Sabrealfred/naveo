import { Card, Col, Row, Statistic, Table, Tag, Progress } from 'antd';
import {
  DollarOutlined,
  UserOutlined,
  RiseOutlined,
  TeamOutlined,
  TrophyOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { Line, Column } from '@ant-design/charts';
import { StatCard } from '../../../components/common';

export default function DashboardPage() {
  // Mock data - Replace with real data from Supabase
  const platformStats = {
    totalAUM: 245680000, // $245.68M
    totalUsers: 1247,
    activeInvestors: 892,
    totalFunds: 18,
    monthlyVolume: 45320000, // $45.32M
    platformGrowth: 23.5, // %
  };

  const monthlyVolumeData = [
    { month: 'Ene', volume: 32000000 },
    { month: 'Feb', volume: 38000000 },
    { month: 'Mar', volume: 35000000 },
    { month: 'Abr', volume: 41000000 },
    { month: 'May', volume: 43000000 },
    { month: 'Jun', volume: 45320000 },
  ];

  const topFunds = [
    {
      key: '1',
      name: 'Alpha Growth Fund',
      aum: 85000000,
      nav: 125.43,
      performance: '+18.2%',
      investors: 245,
      status: 'active',
    },
    {
      key: '2',
      name: 'Beta Stable Fund',
      aum: 62000000,
      nav: 108.76,
      performance: '+12.5%',
      investors: 189,
      status: 'active',
    },
    {
      key: '3',
      name: 'Gamma Yield Fund',
      aum: 48000000,
      nav: 98.34,
      performance: '+8.9%',
      investors: 156,
      status: 'active',
    },
    {
      key: '4',
      name: 'Delta Risk Fund',
      aum: 35000000,
      nav: 142.89,
      performance: '+24.7%',
      investors: 98,
      status: 'active',
    },
    {
      key: '5',
      name: 'Epsilon Crypto Fund',
      aum: 15680000,
      nav: 78.12,
      performance: '-5.3%',
      investors: 67,
      status: 'review',
    },
  ];

  const recentActivities = [
    { key: '1', activity: 'New fund created: Zeta DeFi Fund', time: '2 hours ago', type: 'fund' },
    { key: '2', activity: 'KYC approved for 15 new investors', time: '4 hours ago', type: 'kyc' },
    { key: '3', activity: 'Smart contract upgrade completed', time: '1 day ago', type: 'blockchain' },
    { key: '4', activity: 'Compliance report generated', time: '2 days ago', type: 'compliance' },
    { key: '5', activity: 'Integration: Stripe connected', time: '3 days ago', type: 'integration' },
  ];

  const volumeChartConfig = {
    data: monthlyVolumeData,
    xField: 'month',
    yField: 'volume',
    label: {
      position: 'top' as const,
      formatter: (datum: any) => `$${(datum.volume / 1000000).toFixed(1)}M`,
    },
    meta: {
      volume: {
        alias: 'Volumen',
        formatter: (v: number) => `$${(v / 1000000).toFixed(2)}M`,
      },
    },
  };

  const fundColumns = [
    {
      title: 'Fund Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'AUM',
      dataIndex: 'aum',
      key: 'aum',
      render: (aum: number) => `$${(aum / 1000000).toFixed(2)}M`,
      sorter: (a: any, b: any) => a.aum - b.aum,
    },
    {
      title: 'NAV',
      dataIndex: 'nav',
      key: 'nav',
      render: (nav: number) => `$${nav.toFixed(2)}`,
    },
    {
      title: 'Performance',
      dataIndex: 'performance',
      key: 'performance',
      render: (perf: string) => (
        <Tag color={perf.startsWith('+') ? 'green' : 'red'}>{perf}</Tag>
      ),
    },
    {
      title: 'Investors',
      dataIndex: 'investors',
      key: 'investors',
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
  ];

  const activityColumns = [
    {
      title: 'Activity',
      dataIndex: 'activity',
      key: 'activity',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag>{type}</Tag>,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px', fontFamily: 'var(--font-heading)' }}>
        Platform Overview
      </h1>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="Total AUM"
            value={`$${(platformStats.totalAUM / 1000000).toFixed(2)}M`}
            icon={<DollarOutlined />}
            trend={{ value: platformStats.platformGrowth, isPositive: true }}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="Total Users"
            value={platformStats.totalUsers.toLocaleString()}
            icon={<UserOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="Active Investors"
            value={platformStats.activeInvestors.toLocaleString()}
            icon={<TeamOutlined />}
            color="#722ed1"
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="Total Funds"
            value={platformStats.totalFunds.toString()}
            icon={<TrophyOutlined />}
            color="#fa8c16"
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="Monthly Volume"
            value={`$${(platformStats.monthlyVolume / 1000000).toFixed(2)}M`}
            icon={<SwapOutlined />}
            trend={{ value: 15.3, isPositive: true }}
            color="#13c2c2"
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Platform Growth"
              value={platformStats.platformGrowth}
              precision={1}
              valueStyle={{ color: '#3f8600' }}
              prefix={<RiseOutlined />}
              suffix="%"
            />
            <Progress
              percent={platformStats.platformGrowth}
              strokeColor="#52c41a"
              showInfo={false}
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={16}>
          <Card title="Monthly Volume Trend" bordered={false}>
            <Column {...volumeChartConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Recent Platform Activity" bordered={false}>
            <Table
              dataSource={recentActivities}
              columns={activityColumns}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* Top Funds Table */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Top Performing Funds" bordered={false}>
            <Table
              dataSource={topFunds}
              columns={fundColumns}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
