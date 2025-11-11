import { useState, useEffect } from 'react';
import { Card, Col, Row, Statistic, Table, Tag, Progress, Button, Space, Spin, message } from 'antd';
import {
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
  TeamOutlined,
  SwapOutlined,
  TrophyOutlined,
  BankOutlined,
} from '@ant-design/icons';
import { Line, Column, Pie } from '@ant-design/charts';
import { StatCard, PerformanceChart } from '../../../components/common';
import { useTranslation } from 'react-i18next';
import { fundsService, tradersService, assetsService, reportsService } from '../../../services';
import type { Fund, FundPerformance, Trader, NavHistory } from '../../../services/types';

export default function DashboardPage() {
  const { t } = useTranslation();

  // State
  const [loading, setLoading] = useState(true);
  const [fund, setFund] = useState<Fund | null>(null);
  const [fundPerformance, setFundPerformance] = useState<FundPerformance | null>(null);
  const [navHistory, setNavHistory] = useState<NavHistory[]>([]);
  const [topTraders, setTopTraders] = useState<Trader[]>([]);
  const [assetAllocation, setAssetAllocation] = useState<any[]>([]);
  const [topAssets, setTopAssets] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Get first active fund (in real app, would get fund by manager ID from auth)
      const funds = await fundsService.getActiveFunds();
      if (funds.length === 0) {
        message.warning('No active funds found');
        setLoading(false);
        return;
      }

      const currentFund = funds[0];
      setFund(currentFund);

      // Load fund performance
      const performance = await fundsService.getFundPerformance(currentFund.id);
      setFundPerformance(performance as FundPerformance);

      // Load NAV history
      const navData = await reportsService.getNavHistory(currentFund.id, undefined, undefined, 12);
      setNavHistory(navData);

      // Load top traders
      const traders = await tradersService.getTopPerformingTraders(5, currentFund.id);
      setTopTraders(traders);

      // Load asset allocation
      const allocation = await assetsService.getFundAssetAllocation(currentFund.id);
      setAssetAllocation(allocation);

      // Load top performing assets
      const assets = await assetsService.getTopPerformingAssets(currentFund.id, 5);
      setTopAssets(assets);

    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
      message.error('Failed to load dashboard data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" tip="Loading dashboard..." />
      </div>
    );
  }

  if (!fund || !fundPerformance) {
    return (
      <div style={{ padding: '24px' }}>
        <Card>
          <p>No fund data available. Please contact support.</p>
        </Card>
      </div>
    );
  }

  // Calculate monthly and YTD returns from NAV history
  const calculateReturns = () => {
    if (navHistory.length < 2) return { monthly: 0, ytd: 0 };

    const latestNav = navHistory[0].nav;
    const monthAgoNav = navHistory[1]?.nav || latestNav;
    const ytdNav = navHistory[navHistory.length - 1]?.nav || latestNav;

    const monthlyReturn = ((latestNav - monthAgoNav) / monthAgoNav) * 100;
    const ytdReturn = ((latestNav - ytdNav) / ytdNav) * 100;

    return { monthly: monthlyReturn, ytd: ytdReturn };
  };

  const { monthly, ytd } = calculateReturns();

  // Transform NAV history for chart
  const navChartData = navHistory
    .slice()
    .reverse()
    .map(entry => ({
      date: new Date(entry.calculation_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      nav: entry.nav
    }));

  // Transform asset allocation for pie chart
  const allocationChartData = assetAllocation.map(item => ({
    asset: item.type,
    value: item.percentage,
    amount: item.value
  }));

  // Transform top assets for performance chart
  const performanceChartData = topAssets.map(asset => ({
    asset: asset.symbol,
    return: asset.pnl_percentage
  }));

  const navChartConfig = {
    data: navChartData,
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
    data: allocationChartData,
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
    data: performanceChartData,
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
      dataIndex: 'user_id',
      key: 'user_id',
      render: (userId: string) => <span style={{ fontWeight: 500 }}>Trader {userId.substring(0, 8)}</span>,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => <Tag color="blue">{role?.toUpperCase()}</Tag>,
    },
    {
      title: 'Trades',
      dataIndex: 'total_trades',
      key: 'total_trades',
    },
    {
      title: 'Volume',
      dataIndex: 'total_volume',
      key: 'total_volume',
      render: (vol: number) => `$${((vol || 0) / 1000000).toFixed(1)}M`,
      sorter: (a: any, b: any) => (a.total_volume || 0) - (b.total_volume || 0),
    },
    {
      title: 'P&L',
      dataIndex: 'total_pnl',
      key: 'total_pnl',
      render: (pl: number) => (
        <Tag color={(pl || 0) >= 0 ? 'green' : 'red'}>
          {(pl || 0) >= 0 ? '+' : ''}${((pl || 0) / 1000).toFixed(0)}K
        </Tag>
      ),
    },
    {
      title: 'Win Rate',
      dataIndex: 'win_rate',
      key: 'win_rate',
      render: (rate: number) => `${(rate || 0).toFixed(1)}%`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'orange'}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Fund Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
          {fund.name}
        </h1>
        <p style={{ color: '#8c8c8c', fontSize: '14px' }}>
          {fund.description || t('adminClient.dashboard.subtitle', 'Fund management dashboard')}
        </p>
      </div>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title={t('adminClient.dashboard.currentNAV', 'Current NAV')}
            value={`$${(fund.current_nav || 0).toFixed(2)}`}
            icon={<TrophyOutlined />}
            trend={{ value: monthly, isPositive: monthly >= 0 }}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title={t('adminClient.dashboard.totalAUM', 'Total AUM')}
            value={`$${((fund.total_aum || 0) / 1000000).toFixed(1)}M`}
            icon={<DollarOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title={t('adminClient.dashboard.investors', 'Investors')}
            value={(fundPerformance.total_investors || 0).toString()}
            icon={<TeamOutlined />}
            color="#722ed1"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('adminClient.dashboard.ytdReturn', 'YTD Return')}
              value={ytd}
              precision={1}
              valueStyle={{ color: ytd >= 0 ? '#3f8600' : '#cf1322' }}
              prefix={ytd >= 0 ? <RiseOutlined /> : <FallOutlined />}
              suffix="%"
            />
            <Progress
              percent={Math.min(Math.abs(ytd), 100)}
              strokeColor={ytd >= 0 ? '#52c41a' : '#ff4d4f'}
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
              title={t('adminClient.dashboard.activeTraders', 'Active Traders')}
              value={fundPerformance.active_traders || 0}
              prefix={<SwapOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={6}>
          <Card size="small">
            <Statistic
              title="Total Assets"
              value={fundPerformance.total_assets || 0}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={6}>
          <Card size="small">
            <Statistic
              title={t('adminClient.dashboard.monthlyReturn', 'Monthly Return')}
              value={monthly}
              precision={1}
              suffix="%"
              valueStyle={{ color: monthly >= 0 ? '#52c41a' : '#cf1322' }}
              prefix={monthly >= 0 ? <RiseOutlined /> : <FallOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={6}>
          <Card size="small">
            <Button type="primary" block>
              {t('adminClient.dashboard.viewNavReport', 'View NAV Report')}
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={16}>
          <Card title={t('adminClient.dashboard.navHistory', 'NAV History')} bordered={false}>
            {navChartData.length > 0 ? (
              <Line {...navChartConfig} />
            ) : (
              <p>No NAV history available</p>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title={t('adminClient.dashboard.assetAllocation', 'Asset Allocation')} bordered={false}>
            {allocationChartData.length > 0 ? (
              <Pie {...assetAllocationConfig} />
            ) : (
              <p>No asset allocation data available</p>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title={t('adminClient.dashboard.performanceByAsset', 'Performance by Asset')} bordered={false}>
            {performanceChartData.length > 0 ? (
              <Column {...performanceConfig} />
            ) : (
              <p>No performance data available</p>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Top Performing Assets" bordered={false}>
            <Table
              dataSource={topAssets}
              columns={[
                { title: 'Symbol', dataIndex: 'symbol', key: 'symbol' },
                { title: 'Name', dataIndex: 'name', key: 'name' },
                {
                  title: 'P&L %',
                  dataIndex: 'pnl_percentage',
                  key: 'pnl_percentage',
                  render: (val: number) => (
                    <Tag color={val >= 0 ? 'green' : 'red'}>
                      {val >= 0 ? '+' : ''}{val.toFixed(2)}%
                    </Tag>
                  ),
                  sorter: (a: any, b: any) => a.pnl_percentage - b.pnl_percentage
                },
                {
                  title: 'Current Value',
                  dataIndex: 'current_value',
                  key: 'current_value',
                  render: (val: number) => `$${val.toLocaleString()}`
                }
              ]}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>

      {/* Traders Table */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title={t('adminClient.dashboard.traderPerformance', 'Trader Performance')} bordered={false}>
            <Table
              dataSource={topTraders}
              columns={traderColumns}
              pagination={{ pageSize: 5 }}
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
