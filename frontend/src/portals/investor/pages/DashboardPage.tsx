import { useState, useEffect } from 'react';
import { Card, Col, Row, Statistic, Table, Tag, Button, Space, Avatar, Spin, message } from 'antd';
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
import { portfolioService, transactionsService } from '../../../services';
import type { PortfolioHolding, Transaction, PortfolioValue } from '../../../services/types';

export default function DashboardPage() {
  const { t } = useTranslation();

  // State
  const [loading, setLoading] = useState(true);
  const [portfolioValue, setPortfolioValue] = useState<PortfolioValue | null>(null);
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [portfolioAllocation, setPortfolioAllocation] = useState<any[]>([]);

  // Mock user ID (in real app, get from auth context)
  const userId = '10000000-0000-0000-0000-000000000001';

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load portfolio value
      const value = await portfolioService.calculatePortfolioValue(userId);
      setPortfolioValue(value);

      // Load holdings
      const portfolioHoldings = await portfolioService.getPortfolioHoldings(userId);
      setHoldings(portfolioHoldings);

      // Load portfolio allocation
      const allocation = await portfolioService.getPortfolioAllocation(userId);
      setPortfolioAllocation(allocation);

      // Load recent transactions (last 30 days)
      const transactions = await transactionsService.getRecentTransactions(30, userId);
      setRecentTransactions(transactions.slice(0, 10)); // Show only 10 most recent

    } catch (error: any) {
      console.error('Error loading investor dashboard:', error);
      message.error('Failed to load dashboard data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" tip="Loading your portfolio..." />
      </div>
    );
  }

  if (!portfolioValue) {
    return (
      <div style={{ padding: '24px' }}>
        <Card>
          <p>No portfolio data available. Start investing to see your dashboard.</p>
          <Button type="primary" style={{ marginTop: 16 }}>
            Explore Funds
          </Button>
        </Card>
      </div>
    );
  }

  // Calculate portfolio history (mock for now - would need historical snapshots)
  const portfolioHistoryData = [
    { date: '6 months ago', value: portfolioValue.total_invested_amount * 0.85 },
    { date: '5 months ago', value: portfolioValue.total_invested_amount * 0.90 },
    { date: '4 months ago', value: portfolioValue.total_invested_amount * 0.95 },
    { date: '3 months ago', value: portfolioValue.total_invested_amount },
    { date: '2 months ago', value: portfolioValue.total_invested_amount * 1.05 },
    { date: '1 month ago', value: portfolioValue.total_invested_amount * 1.08 },
    { date: 'Today', value: portfolioValue.total_current_value },
  ];

  // Transform allocation for pie chart
  const allocationChartData = portfolioAllocation.map(item => ({
    asset: item.fund_name,
    value: item.allocation_percentage,
    amount: item.current_value
  }));

  const portfolioChartConfig = {
    data: portfolioHistoryData,
    xField: 'date',
    yField: 'value',
    smooth: true,
    meta: {
      value: {
        alias: 'Portfolio Value',
        formatter: (v: number) => `$${(v / 1000).toFixed(0)}K`,
      },
    },
  };

  const allocationConfig = {
    data: allocationChartData,
    angleField: 'value',
    colorField: 'asset',
    radius: 0.8,
    label: {
      type: 'outer' as const,
      content: '{name} {percentage}',
    },
  };

  const holdingsColumns = [
    {
      title: 'Fund',
      dataIndex: 'fund_name',
      key: 'fund_name',
      render: (text: string) => (
        <Space>
          <Avatar
            style={{ backgroundColor: '#1890ff' }}
            icon={<TrophyOutlined />}
          />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Current NAV',
      dataIndex: 'current_nav',
      key: 'current_nav',
      render: (nav: number) => `$${(nav || 0).toFixed(2)}`,
    },
    {
      title: 'Shares',
      dataIndex: 'shares',
      key: 'shares',
      render: (shares: number) => (shares || 0).toFixed(4),
    },
    {
      title: 'Invested',
      dataIndex: 'invested_amount',
      key: 'invested_amount',
      render: (val: number) => `$${(val || 0).toLocaleString()}`,
    },
    {
      title: 'Current Value',
      dataIndex: 'current_value',
      key: 'current_value',
      render: (val: number) => `$${(val || 0).toLocaleString()}`,
      sorter: (a: any, b: any) => (a.current_value || 0) - (b.current_value || 0),
    },
    {
      title: 'Return',
      dataIndex: 'return_percentage',
      key: 'return_percentage',
      render: (ret: number) => (
        <Tag
          color={(ret || 0) >= 0 ? 'green' : 'red'}
          icon={(ret || 0) >= 0 ? <RiseOutlined /> : <FallOutlined />}
        >
          {(ret || 0) >= 0 ? '+' : ''}{(ret || 0).toFixed(2)}%
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="primary" size="small">Buy</Button>
          <Button size="small">Sell</Button>
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
          buy: 'green',
          sell: 'red',
          deposit: 'blue',
          withdraw: 'orange',
        };
        return <Tag color={colorMap[type] || 'default'}>{type?.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Fund',
      dataIndex: 'fund_id',
      key: 'fund_id',
      render: (fundId: string) => fundId?.substring(0, 8) + '...',
    },
    {
      title: 'Shares',
      dataIndex: 'shares',
      key: 'shares',
      render: (shares: number) => shares > 0 ? (shares || 0).toFixed(4) : '-',
    },
    {
      title: 'NAV',
      dataIndex: 'nav_at_time',
      key: 'nav_at_time',
      render: (nav: number) => nav > 0 ? `$${(nav || 0).toFixed(2)}` : '-',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amt: number) => `$${(amt || 0).toLocaleString()}`,
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'green' : status === 'pending' ? 'orange' : 'red'}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Welcome Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
          {t('investor.dashboard.welcome', { name: 'Investor' })}
        </h1>
        <p style={{ color: '#8c8c8c', fontSize: '14px' }}>
          {t('investor.dashboard.summary')}
        </p>
      </div>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title={t('investor.dashboard.totalValue')}
            value={`$${(portfolioValue.total_current_value || 0).toLocaleString()}`}
            icon={<WalletOutlined />}
            trend={{
              value: portfolioValue.total_return_percentage || 0,
              isPositive: (portfolioValue.total_return_percentage || 0) >= 0,
            }}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title={t('investor.dashboard.totalReturn')}
            value={`$${(portfolioValue.total_unrealized_pnl || 0).toLocaleString()}`}
            icon={<RiseOutlined />}
            color={(portfolioValue.total_unrealized_pnl || 0) >= 0 ? '#52c41a' : '#ff4d4f'}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Invested"
            value={`$${(portfolioValue.total_invested_amount || 0).toLocaleString()}`}
            icon={<DollarOutlined />}
            color="#722ed1"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('investor.dashboard.returnPercent')}
              value={portfolioValue.total_return_percentage || 0}
              precision={1}
              valueStyle={{ color: (portfolioValue.total_return_percentage || 0) >= 0 ? '#3f8600' : '#cf1322' }}
              prefix={(portfolioValue.total_return_percentage || 0) >= 0 ? <RiseOutlined /> : <FallOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Card title={t('investor.dashboard.quickActions')}>
            <Space size="middle">
              <Button
                type="primary"
                icon={<ArrowUpOutlined />}
                size="large"
              >
                {t('investor.dashboard.depositFunds')}
              </Button>
              <Button
                icon={<SwapOutlined />}
                size="large"
              >
                {t('investor.dashboard.buyTokens')}
              </Button>
              <Button
                icon={<ArrowDownOutlined />}
                size="large"
              >
                {t('investor.dashboard.withdraw')}
              </Button>
              <Button size="large">
                {t('investor.dashboard.viewReports')}
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={16}>
          <Card title={t('investor.dashboard.portfolioPerformance')} bordered={false}>
            {portfolioHistoryData.length > 0 ? (
              <Line {...portfolioChartConfig} />
            ) : (
              <p>No performance history available</p>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title={t('investor.dashboard.assetAllocation')} bordered={false}>
            {allocationChartData.length > 0 ? (
              <Pie {...allocationConfig} />
            ) : (
              <p>No allocation data available</p>
            )}
          </Card>
        </Col>
      </Row>

      {/* Holdings Table */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Card title={t('investor.dashboard.myHoldings')} bordered={false}>
            <Table
              dataSource={holdings}
              columns={holdingsColumns}
              pagination={false}
              rowKey="portfolio_id"
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Transactions */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title={t('investor.dashboard.recentTransactions')}
            bordered={false}
            extra={<Button type="link">{t('dashboard.viewAll')}</Button>}
          >
            <Table
              dataSource={recentTransactions}
              columns={transactionColumns}
              pagination={{ pageSize: 5 }}
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
