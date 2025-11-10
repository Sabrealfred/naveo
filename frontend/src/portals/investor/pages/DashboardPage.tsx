import { Card, Col, Row, Statistic, Table, Tag, Button, Space, Avatar } from 'antd';
import {
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
  WalletOutlined,
  SwapOutlined,
  TrophyOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import { Line, Pie } from '@ant-design/charts';
import { StatCard } from '../../../components/common';
import { useTranslation } from 'react-i18next';

export default function DashboardPage() {
  const { t } = useTranslation();

  // Mock data for Investor Dashboard - Replace with real Supabase data
  const portfolioMetrics = {
    totalValue: 125000, // $125K
    totalInvested: 100000, // $100K
    totalReturn: 25000, // $25K
    returnPercentage: 25.0, // 25%
    availableCash: 15000, // $15K
    pendingTransactions: 2,
  };

  const portfolioHistoryData = [
    { date: '2024-06', value: 100000 },
    { date: '2024-07', value: 105000 },
    { date: '2024-08', value: 108000 },
    { date: '2024-09', value: 112000 },
    { date: '2024-10', value: 120000 },
    { date: '2024-11', value: 125000 },
  ];

  const assetAllocation = [
    { asset: 'Alpha Growth Fund', value: 45, amount: 56250 },
    { asset: 'Beta Stable Fund', value: 30, amount: 37500 },
    { asset: 'Gamma Yield Fund', value: 15, amount: 18750 },
    { asset: 'Cash', value: 10, amount: 12500 },
  ];

  const myHoldings = [
    {
      key: '1',
      fund: 'Alpha Growth Fund',
      nav: 127.85,
      shares: 350,
      invested: 35000,
      currentValue: 44747.5,
      return: 27.85,
      color: '#2d2d2d',
    },
    {
      key: '2',
      fund: 'Beta Stable Fund',
      nav: 108.76,
      shares: 300,
      invested: 30000,
      currentValue: 32628,
      return: 8.76,
      color: '#52c41a',
    },
    {
      key: '3',
      fund: 'Gamma Yield Fund',
      nav: 98.34,
      shares: 200,
      invested: 20000,
      currentValue: 19668,
      return: -1.66,
      color: '#722ed1',
    },
  ];

  const recentTransactions = [
    {
      key: '1',
      type: 'Buy',
      fund: 'Alpha Growth Fund',
      shares: 50,
      nav: 127.85,
      amount: 6392.5,
      date: '2024-11-08',
      status: 'completed',
    },
    {
      key: '2',
      type: 'Buy',
      fund: 'Beta Stable Fund',
      shares: 100,
      nav: 108.76,
      amount: 10876,
      date: '2024-11-05',
      status: 'completed',
    },
    {
      key: '3',
      type: 'Sell',
      fund: 'Gamma Yield Fund',
      shares: 50,
      nav: 98.34,
      amount: 4917,
      date: '2024-11-03',
      status: 'completed',
    },
    {
      key: '4',
      type: 'Deposit',
      fund: 'Cash',
      shares: 0,
      nav: 0,
      amount: 15000,
      date: '2024-11-01',
      status: 'completed',
    },
  ];

  const portfolioChartConfig = {
    data: portfolioHistoryData,
    xField: 'date',
    yField: 'value',
    smooth: true,
    color: '#2d2d2d',
    areaStyle: {
      fill: 'l(270) 0:#ffffff 0.5:#f0f0f0 1:#fafafa',
    },
    meta: {
      value: {
        alias: t('dashboard.portfolioPerformance'),
        formatter: (v: number) => `$${(v / 1000).toFixed(0)}K`,
      },
    },
  };

  const allocationConfig = {
    data: assetAllocation,
    angleField: 'value',
    colorField: 'asset',
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      type: 'outer' as const,
      content: '{name}\n{percentage}',
      style: {
        fontSize: 12,
        textAlign: 'center',
      },
    },
    statistic: {
      title: false as const,
      content: {
        style: {
          fontSize: '18px',
          fontFamily: 'Sansation, sans-serif',
        },
        content: 'Assets',
      },
    },
    colorField: 'asset',
    theme: {
      colors10: ['#2d2d2d', '#52c41a', '#722ed1', '#fa8c16', '#13c2c2'],
    },
  };

  const holdingsColumns = [
    {
      title: 'Fund',
      dataIndex: 'fund',
      key: 'fund',
      render: (text: string, record: any) => (
        <Space>
          <Avatar
            style={{ backgroundColor: record.color }}
            icon={<TrophyOutlined />}
          />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Current NAV',
      dataIndex: 'nav',
      key: 'nav',
      render: (nav: number) => `$${nav.toFixed(2)}`,
    },
    {
      title: 'Shares',
      dataIndex: 'shares',
      key: 'shares',
    },
    {
      title: 'Invested',
      dataIndex: 'invested',
      key: 'invested',
      render: (val: number) => `$${val.toLocaleString()}`,
    },
    {
      title: 'Current Value',
      dataIndex: 'currentValue',
      key: 'currentValue',
      render: (val: number) => `$${val.toLocaleString()}`,
      sorter: (a: any, b: any) => a.currentValue - b.currentValue,
    },
    {
      title: 'Return',
      dataIndex: 'return',
      key: 'return',
      render: (ret: number) => (
        <Tag
          color={ret >= 0 ? 'green' : 'red'}
          icon={ret >= 0 ? <RiseOutlined /> : <FallOutlined />}
        >
          {ret >= 0 ? '+' : ''}{ret.toFixed(2)}%
        </Tag>
      ),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: () => (
        <Space>
          <Button type="primary" size="small">{t('common.buy')}</Button>
          <Button size="small">{t('common.sell')}</Button>
        </Space>
      ),
    },
  ];

  const transactionColumns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          Buy: 'green',
          Sell: 'red',
          Deposit: 'blue',
          Withdraw: 'orange',
        };
        return <Tag color={colorMap[type]}>{type}</Tag>;
      },
    },
    {
      title: 'Fund/Asset',
      dataIndex: 'fund',
      key: 'fund',
    },
    {
      title: 'Shares',
      dataIndex: 'shares',
      key: 'shares',
      render: (shares: number) => shares > 0 ? shares : '-',
    },
    {
      title: 'NAV',
      dataIndex: 'nav',
      key: 'nav',
      render: (nav: number) => nav > 0 ? `$${nav.toFixed(2)}` : '-',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amt: number) => `$${amt.toLocaleString()}`,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'green' : 'orange'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: 'var(--color-background)' }}>
      {/* Welcome Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ marginBottom: '8px', fontFamily: 'var(--font-heading)', color: 'var(--color-foreground)' }}>
          {t('dashboard.welcome')}, John Doe
        </h1>
        <p style={{ color: 'var(--color-secondary)', fontSize: '14px' }}>
          {t('dashboard.portfolioSummary')}
        </p>
      </div>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title={t('dashboard.totalPortfolioValue')}
            value={`$${portfolioMetrics.totalValue.toLocaleString()}`}
            icon={<WalletOutlined />}
            trend={{
              value: portfolioMetrics.returnPercentage,
              isPositive: true,
            }}
            color="#2d2d2d"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title={t('dashboard.totalReturn')}
            value={`$${portfolioMetrics.totalReturn.toLocaleString()}`}
            icon={<RiseOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title={t('dashboard.availableCash')}
            value={`$${portfolioMetrics.availableCash.toLocaleString()}`}
            icon={<DollarOutlined />}
            color="#722ed1"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="professional-card">
            <Statistic
              title={t('dashboard.returnPercentage')}
              value={portfolioMetrics.returnPercentage}
              precision={1}
              valueStyle={{ color: '#52c41a', fontFamily: 'var(--font-heading)' }}
              prefix={<RiseOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Card title={t('dashboard.quickActions')} className="professional-card">
            <Space size="middle" wrap>
              <Button
                type="primary"
                icon={<ArrowUpOutlined />}
                size="large"
              >
                {t('dashboard.depositFunds')}
              </Button>
              <Button
                icon={<SwapOutlined />}
                size="large"
              >
                {t('dashboard.buyTokens')}
              </Button>
              <Button
                icon={<ArrowDownOutlined />}
                size="large"
              >
                {t('dashboard.withdraw')}
              </Button>
              <Button size="large">
                {t('dashboard.viewReports')}
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={16}>
          <Card title={t('dashboard.portfolioPerformance')} bordered={false} className="professional-card">
            <Line {...portfolioChartConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title={t('dashboard.assetAllocation')} bordered={false} className="professional-card">
            <Pie {...allocationConfig} />
          </Card>
        </Col>
      </Row>

      {/* Holdings Table */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Card title={t('dashboard.myHoldings')} bordered={false} className="professional-card">
            <Table
              dataSource={myHoldings}
              columns={holdingsColumns}
              pagination={false}
              scroll={{ x: 800 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Transactions */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title={t('dashboard.recentTransactions')}
            bordered={false}
            className="professional-card"
            extra={<Button type="link">{t('dashboard.viewAll')}</Button>}
          >
            <Table
              dataSource={recentTransactions}
              columns={transactionColumns}
              pagination={{ pageSize: 5 }}
              scroll={{ x: 800 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
