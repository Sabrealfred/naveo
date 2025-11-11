import { useState } from 'react';
import { Card, Col, Row, Statistic, Table, Tag, Progress, Button, Space, message, Tabs, Alert, Badge, Divider, Segmented } from 'antd';
import {
  DollarOutlined,
  RiseOutlined,
  FundProjectionScreenOutlined,
  BarChartOutlined,
  ThunderboltOutlined,
  TeamOutlined,
  RobotOutlined,
  LineChartOutlined,
  SafetyOutlined,
  BulbOutlined,
  ThunderboltFilled,
  FireOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  RadarChartOutlined,
  FallOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { Pie, Column, Line, Scatter, Heatmap, Area, DualAxes, Radar } from '@ant-design/charts';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../../../components/common';
import { PortfolioRebalanceModal, MUMStrategyModal } from '../../../components/modals';

export default function PortfolioManagementPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [rebalanceModalVisible, setRebalanceModalVisible] = useState(false);
  const [mumModalVisible, setMumModalVisible] = useState(false);
  const [timeRange, setTimeRange] = useState<string>('6M');
  const [activeTab, setActiveTab] = useState<string>('overview');

  const handleRebalanceSubmit = (values: any) => {
    console.log('Rebalance submitted:', values);
    message.success(t('ai.rebalance.submitted'));
    // In production: Send to Supabase
  };

  const handleMumSubmit = (values: any) => {
    console.log('MUM Strategy created:', values);
    message.success(t('ai.mum.strategyCreated'));
    // In production: Send to Supabase
  };

  // Mock data - Fund's portfolio allocation
  const portfolioMetrics = {
    totalAUM: 85000000, // $85M
    totalAssets: 12,
    bestPerformer: 'BTC',
    bestPerformance: 15.2,
    concentration: 42, // %
  };

  const assetAllocation = [
    { asset: 'BTC', percentage: 42, value: 35700000, target: 40 },
    { asset: 'ETH', percentage: 28, value: 23800000, target: 30 },
    { asset: 'Tokens', percentage: 18, value: 15300000, target: 20 },
    { asset: 'Stablecoins', percentage: 10, value: 8500000, target: 8 },
    { asset: 'Others', percentage: 2, value: 1700000, target: 2 },
  ];

  const performanceByAsset = [
    { asset: 'BTC', ytd: 15.2, mtd: 3.5, wtd: 1.2 },
    { asset: 'ETH', ytd: 22.8, mtd: 5.1, wtd: 2.3 },
    { asset: 'SOL', ytd: 45.3, mtd: 12.4, wtd: 4.5 },
    { asset: 'MATIC', ytd: 12.1, mtd: 2.8, wtd: 0.9 },
    { asset: 'LINK', ytd: 8.7, mtd: 1.5, wtd: 0.4 },
  ];

  // Portfolio Value Over Time (6 months)
  const portfolioValueHistory = [
    { date: 'Jun', value: 78500000, benchmark: 77000000 },
    { date: 'Jul', value: 79800000, benchmark: 78200000 },
    { date: 'Aug', value: 81200000, benchmark: 79500000 },
    { date: 'Sep', value: 82800000, benchmark: 80800000 },
    { date: 'Oct', value: 84100000, benchmark: 82100000 },
    { date: 'Nov', value: 85000000, benchmark: 83500000 },
  ];

  // Risk-Return Scatter Plot
  const riskReturnData = [
    { asset: 'BTC', return: 15.2, risk: 45.3, size: 35700000 },
    { asset: 'ETH', return: 22.8, risk: 52.1, size: 23800000 },
    { asset: 'SOL', return: 45.3, risk: 78.4, size: 5200000 },
    { asset: 'MATIC', return: 12.1, risk: 58.2, size: 3400000 },
    { asset: 'LINK', return: 8.7, risk: 42.8, size: 2900000 },
    { asset: 'USDC', return: 0.5, risk: 1.2, size: 8500000 },
  ];

  // Asset Correlation Heatmap Data
  const correlationData = [
    { asset1: 'BTC', asset2: 'BTC', correlation: 1.0 },
    { asset1: 'BTC', asset2: 'ETH', correlation: 0.85 },
    { asset1: 'BTC', asset2: 'SOL', correlation: 0.72 },
    { asset1: 'BTC', asset2: 'MATIC', correlation: 0.68 },
    { asset1: 'BTC', asset2: 'USDC', correlation: -0.12 },

    { asset1: 'ETH', asset2: 'BTC', correlation: 0.85 },
    { asset1: 'ETH', asset2: 'ETH', correlation: 1.0 },
    { asset1: 'ETH', asset2: 'SOL', correlation: 0.78 },
    { asset1: 'ETH', asset2: 'MATIC', correlation: 0.82 },
    { asset1: 'ETH', asset2: 'USDC', correlation: -0.08 },

    { asset1: 'SOL', asset2: 'BTC', correlation: 0.72 },
    { asset1: 'SOL', asset2: 'ETH', correlation: 0.78 },
    { asset1: 'SOL', asset2: 'SOL', correlation: 1.0 },
    { asset1: 'SOL', asset2: 'MATIC', correlation: 0.65 },
    { asset1: 'SOL', asset2: 'USDC', correlation: -0.15 },

    { asset1: 'MATIC', asset2: 'BTC', correlation: 0.68 },
    { asset1: 'MATIC', asset2: 'ETH', correlation: 0.82 },
    { asset1: 'MATIC', asset2: 'SOL', correlation: 0.65 },
    { asset1: 'MATIC', asset2: 'MATIC', correlation: 1.0 },
    { asset1: 'MATIC', asset2: 'USDC', correlation: -0.05 },

    { asset1: 'USDC', asset2: 'BTC', correlation: -0.12 },
    { asset1: 'USDC', asset2: 'ETH', correlation: -0.08 },
    { asset1: 'USDC', asset2: 'SOL', correlation: -0.15 },
    { asset1: 'USDC', asset2: 'MATIC', correlation: -0.05 },
    { asset1: 'USDC', asset2: 'USDC', correlation: 1.0 },
  ];

  // AI Insights & Recommendations
  const aiInsights = [
    {
      type: 'opportunity',
      title: 'Portfolio Rebalancing Recommended',
      description: 'BTC allocation is 2% above target. Consider rebalancing to reduce concentration risk.',
      action: 'Rebalance Now',
      priority: 'medium',
    },
    {
      type: 'warning',
      title: 'High Correlation Detected',
      description: 'ETH and MATIC show 82% correlation. Diversification could be improved.',
      action: 'View Analysis',
      priority: 'low',
    },
    {
      type: 'success',
      title: 'Strong Performance',
      description: 'Portfolio is outperforming benchmark by 1.8% this quarter.',
      action: 'View Report',
      priority: 'info',
    },
    {
      type: 'alert',
      title: 'Volatility Increase',
      description: 'SOL volatility increased 12% this week. Review risk exposure.',
      action: 'Risk Dashboard',
      priority: 'high',
    },
  ];

  // Performance Attribution
  const performanceAttribution = [
    { factor: 'Asset Selection', contribution: 2.8, percentage: 45 },
    { factor: 'Allocation', contribution: 1.9, percentage: 30 },
    { factor: 'Timing', contribution: 0.8, percentage: 13 },
    { factor: 'Other', contribution: 0.7, percentage: 12 },
  ];

  // Asset Risk Metrics
  const assetRiskMetrics = [
    { asset: 'BTC', sharpe: 0.92, volatility: 45.3, var95: 8.2, beta: 1.0, liquidity: 98 },
    { asset: 'ETH', sharpe: 1.15, volatility: 52.1, var95: 9.8, beta: 1.15, liquidity: 96 },
    { asset: 'SOL', sharpe: 1.35, volatility: 78.4, var95: 14.2, beta: 1.45, liquidity: 85 },
    { asset: 'MATIC', sharpe: 0.68, volatility: 58.2, var95: 10.5, beta: 1.22, liquidity: 88 },
    { asset: 'LINK', sharpe: 0.55, volatility: 42.8, var95: 7.8, beta: 0.95, liquidity: 90 },
  ];

  // Sector Breakdown
  const sectorBreakdown = [
    { sector: 'Layer 1', value: 59500000, percentage: 70, assets: ['BTC', 'ETH', 'SOL'] },
    { sector: 'Layer 2', value: 3400000, percentage: 4, assets: ['MATIC'] },
    { sector: 'DeFi', value: 12900000, percentage: 15, assets: ['LINK', 'AAVE', 'UNI'] },
    { sector: 'Stablecoins', value: 8500000, percentage: 10, assets: ['USDC', 'DAI'] },
    { sector: 'Others', value: 700000, percentage: 1, assets: ['Various'] },
  ];

  const allocationColumns = [
    {
      title: t('portfolio.asset'),
      dataIndex: 'asset',
      key: 'asset',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: t('portfolio.currentPercent'),
      dataIndex: 'percentage',
      key: 'percentage',
      render: (pct: number) => `${pct}%`,
    },
    {
      title: t('portfolio.targetPercent'),
      dataIndex: 'target',
      key: 'target',
      render: (pct: number) => `${pct}%`,
    },
    {
      title: t('portfolio.variance'),
      key: 'variance',
      render: (_: any, record: any) => {
        const variance = record.percentage - record.target;
        return (
          <Tag color={Math.abs(variance) <= 2 ? 'green' : 'orange'}>
            {variance > 0 ? '+' : ''}{variance.toFixed(1)}%
          </Tag>
        );
      },
    },
    {
      title: t('portfolio.value'),
      dataIndex: 'value',
      key: 'value',
      render: (val: number) => `$${(val / 1000000).toFixed(2)}M`,
      sorter: (a: any, b: any) => a.value - b.value,
    },
    {
      title: t('portfolio.allocationProgress'),
      key: 'progress',
      render: (_: any, record: any) => {
        const progress = (record.percentage / record.target) * 100;
        return (
          <Progress
            percent={progress}
            size="small"
            status={Math.abs(progress - 100) <= 10 ? 'success' : 'active'}
            showInfo={false}
          />
        );
      },
    },
  ];

  const performanceConfig = {
    data: performanceByAsset,
    xField: 'asset',
    yField: 'ytd',
    label: {
      position: 'top' as const,
      formatter: (datum: any) => `${datum.ytd.toFixed(1)}%`,
    },
    color: '#2d2d2d',
  };

  const allocationPieConfig = {
    data: assetAllocation,
    angleField: 'percentage',
    colorField: 'asset',
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      type: 'outer' as const,
      content: '{name}\n{percentage}%',
    },
    statistic: {
      title: {
        content: t('portfolio.total'),
      },
      content: {
        content: t('portfolio.allocation'),
      },
    },
  };

  // Portfolio Value History Config
  const portfolioValueConfig = {
    data: [portfolioValueHistory, portfolioValueHistory],
    xField: 'date',
    yField: ['value', 'benchmark'],
    geometryOptions: [
      {
        geometry: 'line',
        color: '#1890ff',
        lineStyle: { lineWidth: 3 },
      },
      {
        geometry: 'line',
        color: '#52c41a',
        lineStyle: { lineWidth: 2, lineDash: [4, 4] },
      },
    ],
    legend: {
      custom: true,
      items: [
        { name: 'Portfolio', value: 'value', marker: { symbol: 'line', style: { stroke: '#1890ff' } } },
        { name: 'Benchmark', value: 'benchmark', marker: { symbol: 'line', style: { stroke: '#52c41a' } } },
      ],
    },
    meta: {
      value: {
        alias: 'Value',
        formatter: (v: number) => `$${(v / 1000000).toFixed(1)}M`,
      },
      benchmark: {
        alias: 'Benchmark',
        formatter: (v: number) => `$${(v / 1000000).toFixed(1)}M`,
      },
    },
  };

  // Risk-Return Scatter Config
  const riskReturnConfig = {
    data: riskReturnData,
    xField: 'risk',
    yField: 'return',
    sizeField: 'size',
    colorField: 'asset',
    size: [4, 30],
    shape: 'circle',
    yAxis: {
      nice: true,
      line: { style: { stroke: '#aaa' } },
      label: { formatter: (v: string) => `${v}%` },
    },
    xAxis: {
      nice: true,
      line: { style: { stroke: '#aaa' } },
      label: { formatter: (v: string) => `${v}%` },
    },
    label: {
      formatter: (datum: any) => datum.asset,
      style: { fontSize: 12, fontWeight: 'bold' },
    },
    tooltip: {
      showTitle: false,
      formatter: (datum: any) => ({
        name: datum.asset,
        value: `Return: ${datum.return}%, Risk: ${datum.risk}%, Size: $${(datum.size / 1000000).toFixed(1)}M`,
      }),
    },
  };

  // Correlation Heatmap Config
  const correlationConfig = {
    data: correlationData,
    xField: 'asset1',
    yField: 'asset2',
    colorField: 'correlation',
    color: ['#0050b3', '#1890ff', '#91d5ff', '#ffffff', '#ffccc7', '#ff7875', '#d32029'],
    meta: {
      correlation: {
        min: -1,
        max: 1,
      },
    },
    label: {
      style: {
        fill: '#000',
        fontSize: 11,
      },
      formatter: (datum: any) => datum.correlation.toFixed(2),
    },
  };

  // Performance Attribution Config
  const attributionConfig = {
    data: performanceAttribution,
    angleField: 'percentage',
    colorField: 'factor',
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      type: 'inner' as const,
      offset: '-30%',
      content: '{value}%',
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    legend: { position: 'bottom' as const },
  };

  // Sector Breakdown Config
  const sectorConfig = {
    data: sectorBreakdown,
    xField: 'sector',
    yField: 'value',
    seriesField: 'sector',
    label: {
      position: 'top' as const,
      formatter: (datum: any) => `${datum.percentage}%`,
    },
    meta: {
      value: {
        alias: 'Value',
        formatter: (v: number) => `$${(v / 1000000).toFixed(1)}M`,
      },
    },
  };

  return (
    <div style={{ padding: '24px', background: 'var(--color-background)' }}>
      {/* Page Header with AI Actions */}
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col>
          <h1 style={{ marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
            {t('portfolio.title')}
          </h1>
          <p style={{ color: 'var(--color-secondary)', fontSize: '14px', margin: 0 }}>
            {t('portfolio.subtitle')}
          </p>
        </Col>
        <Col>
          <Space>
            <Button
              icon={<RobotOutlined />}
              size="large"
              onClick={() => navigate('/admin-client/ai-strategy')}
            >
              {t('ai.title')}
            </Button>
            <Button
              type="primary"
              icon={<ThunderboltOutlined />}
              size="large"
              onClick={() => setRebalanceModalVisible(true)}
            >
              {t('ai.portfolioRebalancing')}
            </Button>
            <Button
              icon={<TeamOutlined />}
              size="large"
              onClick={() => setMumModalVisible(true)}
            >
              {t('ai.mumStrategies')}
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title={t('portfolio.totalAUM')}
            value={`$${(portfolioMetrics.totalAUM / 1000000).toFixed(1)}M`}
            icon={<DollarOutlined />}
            color="#2d2d2d"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title={t('portfolio.totalAssets')}
            value={portfolioMetrics.totalAssets.toString()}
            icon={<FundProjectionScreenOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title={t('portfolio.bestPerformer')}
            value={portfolioMetrics.bestPerformer}
            icon={<RiseOutlined />}
            trend={{ value: portfolioMetrics.bestPerformance, isPositive: true }}
            color="#722ed1"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="professional-card">
            <Statistic
              title={t('portfolio.concentration')}
              value={portfolioMetrics.concentration}
              suffix="%"
              valueStyle={{ color: portfolioMetrics.concentration > 40 ? '#fa8c16' : '#52c41a' }}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* AI Copilot Insights */}
      <Card
        title={
          <Space>
            <RobotOutlined style={{ color: '#722ed1', fontSize: '18px' }} />
            <span style={{ fontWeight: 600 }}>AI Copilot Insights & Recommendations</span>
            <Badge count={aiInsights.length} style={{ backgroundColor: '#722ed1' }} />
          </Space>
        }
        style={{ marginBottom: '24px' }}
        bordered={false}
        extra={
          <Segmented
            options={['1D', '1W', '1M', '3M', '6M', '1Y']}
            value={timeRange}
            onChange={(value) => setTimeRange(value as string)}
          />
        }
      >
        <Row gutter={[16, 16]}>
          {aiInsights.map((insight, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Alert
                message={
                  <Space>
                    {insight.type === 'alert' && <WarningOutlined style={{ color: '#ff4d4f' }} />}
                    {insight.type === 'warning' && <ClockCircleOutlined style={{ color: '#faad14' }} />}
                    {insight.type === 'success' && <CheckCircleOutlined style={{ color: '#52c41a' }} />}
                    {insight.type === 'opportunity' && <BulbOutlined style={{ color: '#1890ff' }} />}
                    <strong>{insight.title}</strong>
                  </Space>
                }
                description={
                  <div>
                    <p style={{ fontSize: '12px', margin: '8px 0' }}>{insight.description}</p>
                    <Button size="small" type="link" style={{ padding: 0 }}>
                      {insight.action} →
                    </Button>
                  </div>
                }
                type={
                  insight.priority === 'high'
                    ? 'error'
                    : insight.priority === 'medium'
                    ? 'warning'
                    : insight.priority === 'low'
                    ? 'info'
                    : 'success'
                }
                showIcon
              />
            </Col>
          ))}
        </Row>
      </Card>

      {/* Portfolio Value Over Time */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24}>
          <Card
            title={
              <Space>
                <LineChartOutlined style={{ color: '#1890ff' }} />
                <span>Portfolio Value vs Benchmark</span>
                <Tag color="green">+1.8% vs Benchmark</Tag>
              </Space>
            }
            bordered={false}
          >
            <DualAxes {...portfolioValueConfig} height={300} />
          </Card>
        </Col>
      </Row>

      {/* Charts - Risk Analysis */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <RadarChartOutlined style={{ color: '#722ed1' }} />
                <span>Risk-Return Analysis</span>
              </Space>
            }
            bordered={false}
          >
            <Scatter {...riskReturnConfig} height={350} />
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ fontSize: '12px', color: '#8c8c8c', textAlign: 'center' }}>
              Bubble size represents asset allocation • Optimal zone: High return, Low risk
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <FireOutlined style={{ color: '#ff4d4f' }} />
                <span>Asset Correlation Matrix</span>
              </Space>
            }
            bordered={false}
          >
            <Heatmap {...correlationConfig} height={350} />
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ fontSize: '12px', color: '#8c8c8c', textAlign: 'center' }}>
              1.0 = Perfect correlation • -1.0 = Perfect negative correlation
            </div>
          </Card>
        </Col>
      </Row>

      {/* Performance Analysis */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={8}>
          <Card title={t('portfolio.ytdPerformance')} bordered={false} className="professional-card">
            <Column {...performanceConfig} height={280} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title={t('portfolio.allocation')} bordered={false} className="professional-card">
            <Pie {...allocationPieConfig} height={280} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <PieChartOutlined style={{ color: '#13c2c2' }} />
                <span>Performance Attribution</span>
              </Space>
            }
            bordered={false}
          >
            <Pie {...attributionConfig} height={280} />
          </Card>
        </Col>
      </Row>

      {/* Sector Breakdown and Risk Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <BarChartOutlined style={{ color: '#52c41a' }} />
                <span>Sector Breakdown</span>
              </Space>
            }
            bordered={false}
          >
            <Column {...sectorConfig} height={300} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <SafetyOutlined style={{ color: '#faad14' }} />
                <span>Asset Risk Metrics</span>
              </Space>
            }
            bordered={false}
          >
            <Table
              dataSource={assetRiskMetrics}
              columns={[
                {
                  title: 'Asset',
                  dataIndex: 'asset',
                  key: 'asset',
                  render: (text: string) => <strong>{text}</strong>,
                },
                {
                  title: 'Sharpe',
                  dataIndex: 'sharpe',
                  key: 'sharpe',
                  render: (val: number) => (
                    <Tag color={val > 1 ? 'green' : val > 0.5 ? 'orange' : 'red'}>
                      {val.toFixed(2)}
                    </Tag>
                  ),
                  sorter: (a: any, b: any) => a.sharpe - b.sharpe,
                },
                {
                  title: 'Vol %',
                  dataIndex: 'volatility',
                  key: 'volatility',
                  render: (val: number) => `${val.toFixed(1)}%`,
                  sorter: (a: any, b: any) => a.volatility - b.volatility,
                },
                {
                  title: 'VaR',
                  dataIndex: 'var95',
                  key: 'var95',
                  render: (val: number) => `${val.toFixed(1)}%`,
                  sorter: (a: any, b: any) => a.var95 - b.var95,
                },
                {
                  title: 'Beta',
                  dataIndex: 'beta',
                  key: 'beta',
                  render: (val: number) => val.toFixed(2),
                  sorter: (a: any, b: any) => a.beta - b.beta,
                },
                {
                  title: 'Liquidity',
                  dataIndex: 'liquidity',
                  key: 'liquidity',
                  render: (val: number) => (
                    <Progress
                      percent={val}
                      size="small"
                      strokeColor={val > 90 ? '#52c41a' : '#faad14'}
                      showInfo={false}
                    />
                  ),
                },
              ]}
              pagination={false}
              size="small"
              scroll={{ x: 600 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Allocation Table */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title={t('portfolio.allocationDetails')} bordered={false} className="professional-card">
            <Table
              dataSource={assetAllocation}
              columns={allocationColumns}
              pagination={false}
              scroll={{ x: 800 }}
            />
          </Card>
        </Col>
      </Row>

      {/* AI Modals */}
      <PortfolioRebalanceModal
        visible={rebalanceModalVisible}
        onClose={() => setRebalanceModalVisible(false)}
        onSubmit={handleRebalanceSubmit}
        currentAllocations={assetAllocation}
        totalValue={portfolioMetrics.totalAUM}
      />

      <MUMStrategyModal
        visible={mumModalVisible}
        onClose={() => setMumModalVisible(false)}
        onSubmit={handleMumSubmit}
        mode="create"
      />
    </div>
  );
}
