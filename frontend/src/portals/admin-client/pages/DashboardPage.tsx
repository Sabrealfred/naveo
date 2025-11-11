import { useState, useEffect } from 'react';
import { Card, Col, Row, Statistic, Table, Tag, Progress, Button, Space, Spin, message, Badge, Timeline, Divider, Alert, Tabs } from 'antd';
import {
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
  TeamOutlined,
  SwapOutlined,
  TrophyOutlined,
  BankOutlined,
  SafetyOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  LineChartOutlined,
  BarChartOutlined,
  PieChartOutlined,
  ThunderboltOutlined,
  FireOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import { Line, Column, Pie, Area, DualAxes } from '@ant-design/charts';
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

  // Mock Risk Metrics
  const riskMetrics = {
    sharpeRatio: 1.82,
    volatility: 12.4,
    beta: 0.87,
    var95: 2.1,
    maxDrawdown: -8.3,
    alpha: 4.2,
  };

  // Mock Liquidity Metrics
  const liquidityMetrics = {
    cashReserves: 5200000,
    liquidAssets: 18700000,
    redemptionQueue: 2400000,
    availableLiquidity: 21500000,
    liquidityRatio: 42.3,
  };

  // Mock Recent Activities
  const recentActivities = [
    { time: '2 hours ago', action: 'Capital call processed', amount: '$500K', status: 'completed', type: 'success' },
    { time: '4 hours ago', action: 'New investor onboarded', amount: '$1.2M commitment', status: 'completed', type: 'info' },
    { time: '6 hours ago', action: 'Rebalancing executed', amount: '$3.5M reallocation', status: 'completed', type: 'success' },
    { time: '8 hours ago', action: 'KYC verification pending', amount: '2 investors', status: 'pending', type: 'warning' },
    { time: '1 day ago', action: 'NAV calculation completed', amount: '$127.45', status: 'completed', type: 'success' },
    { time: '1 day ago', action: 'Compliance report submitted', amount: 'Q4 2024', status: 'completed', type: 'success' },
  ];

  // Mock Fund Health Indicators
  const fundHealth = {
    compliance: 98,
    kycStatus: 95,
    documentCompletion: 92,
    riskScore: 'Low',
    operationalStatus: 'Excellent',
  };

  // Mock Monthly Performance Comparison Data
  const monthlyPerformanceData = [
    { month: 'Jan', thisYear: 5.2, lastYear: 4.1, benchmark: 3.8 },
    { month: 'Feb', thisYear: 3.8, lastYear: 2.9, benchmark: 3.2 },
    { month: 'Mar', thisYear: 6.5, lastYear: 5.3, benchmark: 4.5 },
    { month: 'Apr', thisYear: 4.2, lastYear: 3.8, benchmark: 3.9 },
    { month: 'May', thisYear: 7.1, lastYear: 6.2, benchmark: 5.1 },
    { month: 'Jun', thisYear: 5.9, lastYear: 4.7, benchmark: 4.3 },
    { month: 'Jul', thisYear: 6.8, lastYear: 5.9, benchmark: 5.2 },
    { month: 'Aug', thisYear: 4.5, lastYear: 3.6, benchmark: 3.7 },
    { month: 'Sep', thisYear: 5.7, lastYear: 4.9, benchmark: 4.4 },
    { month: 'Oct', thisYear: 6.2, lastYear: 5.1, benchmark: 4.8 },
    { month: 'Nov', thisYear: 7.3, lastYear: 6.4, benchmark: 5.6 },
    { month: 'Dec', thisYear: 5.8, lastYear: 4.8, benchmark: 4.2 },
  ];

  // Mock Drawdown Data
  const drawdownData = [
    { date: 'Jan', drawdown: 0 },
    { date: 'Feb', drawdown: -1.2 },
    { date: 'Mar', drawdown: 0 },
    { date: 'Apr', drawdown: -0.8 },
    { date: 'May', drawdown: 0 },
    { date: 'Jun', drawdown: -2.3 },
    { date: 'Jul', drawdown: -0.5 },
    { date: 'Aug', drawdown: -3.1 },
    { date: 'Sep', drawdown: -1.8 },
    { date: 'Oct', drawdown: 0 },
    { date: 'Nov', drawdown: 0 },
    { date: 'Dec', drawdown: -0.9 },
  ];

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

  // Monthly Performance Comparison Chart Config
  const monthlyComparisonConfig = {
    data: [monthlyPerformanceData, monthlyPerformanceData],
    xField: 'month',
    yField: ['thisYear', 'benchmark'],
    geometryOptions: [
      {
        geometry: 'column',
        color: '#1890ff',
        columnWidthRatio: 0.4,
      },
      {
        geometry: 'line',
        color: '#52c41a',
        lineStyle: {
          lineWidth: 2,
        },
      },
    ],
    legend: {
      custom: true,
      items: [
        { name: 'This Year', value: 'thisYear', marker: { symbol: 'square', style: { fill: '#1890ff' } } },
        { name: 'Benchmark', value: 'benchmark', marker: { symbol: 'line', style: { stroke: '#52c41a' } } },
      ],
    },
  };

  // Drawdown Chart Config
  const drawdownConfig = {
    data: drawdownData,
    xField: 'date',
    yField: 'drawdown',
    smooth: true,
    areaStyle: {
      fill: 'l(270) 0:#ff4d4f 1:#fff1f0',
    },
    line: {
      color: '#ff4d4f',
    },
    meta: {
      drawdown: {
        alias: 'Drawdown',
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

      {/* Risk Metrics Section */}
      <Card
        title={
          <Space>
            <SafetyOutlined style={{ color: '#722ed1' }} />
            <span>Risk Metrics</span>
            <Tag color="green">{fundHealth.riskScore} Risk</Tag>
          </Space>
        }
        style={{ marginBottom: '24px' }}
        bordered={false}
      >
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={8} lg={4}>
            <Statistic
              title="Sharpe Ratio"
              value={riskMetrics.sharpeRatio}
              precision={2}
              prefix={<LineChartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col xs={12} sm={8} lg={4}>
            <Statistic
              title="Volatility"
              value={riskMetrics.volatility}
              precision={1}
              suffix="%"
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Col>
          <Col xs={12} sm={8} lg={4}>
            <Statistic
              title="Beta"
              value={riskMetrics.beta}
              precision={2}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Col>
          <Col xs={12} sm={8} lg={4}>
            <Statistic
              title="VaR (95%)"
              value={riskMetrics.var95}
              precision={1}
              suffix="%"
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Col>
          <Col xs={12} sm={8} lg={4}>
            <Statistic
              title="Max Drawdown"
              value={riskMetrics.maxDrawdown}
              precision={1}
              suffix="%"
              prefix={<FallOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Col>
          <Col xs={12} sm={8} lg={4}>
            <Statistic
              title="Alpha"
              value={riskMetrics.alpha}
              precision={1}
              suffix="%"
              prefix={<FireOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
        </Row>
      </Card>

      {/* Liquidity & Fund Health Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <BankOutlined style={{ color: '#52c41a' }} />
                <span>Liquidity Position</span>
              </Space>
            }
            bordered={false}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="Cash Reserves"
                  value={liquidityMetrics.cashReserves / 1000000}
                  precision={1}
                  prefix="$"
                  suffix="M"
                  valueStyle={{ fontSize: '20px' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Liquid Assets"
                  value={liquidityMetrics.liquidAssets / 1000000}
                  precision={1}
                  prefix="$"
                  suffix="M"
                  valueStyle={{ fontSize: '20px' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Redemption Queue"
                  value={liquidityMetrics.redemptionQueue / 1000000}
                  precision={1}
                  prefix="$"
                  suffix="M"
                  valueStyle={{ fontSize: '20px', color: '#faad14' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Liquidity Ratio"
                  value={liquidityMetrics.liquidityRatio}
                  precision={1}
                  suffix="%"
                  valueStyle={{ fontSize: '20px', color: '#52c41a' }}
                />
              </Col>
            </Row>
            <Divider />
            <Progress
              percent={liquidityMetrics.liquidityRatio}
              strokeColor={{
                '0%': '#52c41a',
                '100%': '#1890ff',
              }}
              status="active"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                <span>Fund Health & Compliance</span>
              </Space>
            }
            bordered={false}
          >
            <Space direction="vertical" style={{ width: '100%' }} size={16}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span>Compliance Score</span>
                  <strong>{fundHealth.compliance}%</strong>
                </div>
                <Progress percent={fundHealth.compliance} strokeColor="#52c41a" showInfo={false} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span>KYC Status</span>
                  <strong>{fundHealth.kycStatus}%</strong>
                </div>
                <Progress percent={fundHealth.kycStatus} strokeColor="#1890ff" showInfo={false} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span>Document Completion</span>
                  <strong>{fundHealth.documentCompletion}%</strong>
                </div>
                <Progress percent={fundHealth.documentCompletion} strokeColor="#722ed1" showInfo={false} />
              </div>
              <Alert
                message={
                  <Space>
                    <Badge status="success" />
                    <span>Operational Status: <strong>{fundHealth.operationalStatus}</strong></span>
                  </Space>
                }
                type="success"
                showIcon
              />
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined style={{ color: '#1890ff' }} />
                <span>Recent Activity</span>
              </Space>
            }
            bordered={false}
          >
            <Timeline
              items={recentActivities.map((activity) => ({
                color: activity.type === 'success' ? 'green' : activity.type === 'warning' ? 'orange' : 'blue',
                children: (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>{activity.action}</strong>
                      <Tag color={activity.status === 'completed' ? 'green' : 'orange'}>
                        {activity.status}
                      </Tag>
                    </div>
                    <div style={{ color: '#8c8c8c', fontSize: '12px', marginTop: 4 }}>
                      {activity.amount} • {activity.time}
                    </div>
                  </div>
                ),
              }))}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <PieChartOutlined style={{ color: '#722ed1' }} />
                <span>Quick Actions</span>
              </Space>
            }
            bordered={false}
          >
            <Space direction="vertical" style={{ width: '100%' }} size={12}>
              <Button type="primary" icon={<DollarOutlined />} block size="large">
                Initiate Capital Call
              </Button>
              <Button icon={<SwapOutlined />} block size="large">
                Execute Rebalancing
              </Button>
              <Button icon={<TeamOutlined />} block size="large">
                Review KYC Queue
              </Button>
              <Button icon={<LineChartOutlined />} block size="large">
                Generate NAV Report
              </Button>
              <Divider style={{ margin: '8px 0' }} />
              <div style={{ padding: '8px 0' }}>
                <Space>
                  <LockOutlined style={{ color: '#52c41a', fontSize: '18px' }} />
                  <div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Gate Status</div>
                    <strong style={{ color: '#52c41a' }}>Open</strong>
                  </div>
                </Space>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={16}>
          <Card title={t('adminClient.dashboard.navHistory', 'NAV History')} bordered={false}>
            {navChartData.length > 0 ? (
              <Line {...navChartConfig} height={280} />
            ) : (
              <p>No NAV history available</p>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title={t('adminClient.dashboard.assetAllocation', 'Asset Allocation')} bordered={false}>
            {allocationChartData.length > 0 ? (
              <Pie {...assetAllocationConfig} height={280} />
            ) : (
              <p>No asset allocation data available</p>
            )}
          </Card>
        </Col>
      </Row>

      {/* Performance Analysis Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title="Monthly Performance vs Benchmark" bordered={false}>
            <DualAxes {...monthlyComparisonConfig} height={300} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Drawdown Analysis" bordered={false}>
            <Area {...drawdownConfig} height={300} />
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
