import { useState } from 'react';
import { Card, Row, Col, Statistic, Select, DatePicker, Tabs, Table, Tag, Button, Space, Progress } from 'antd';
import {
  LineChartOutlined,
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
  TeamOutlined,
  SwapOutlined,
  FundOutlined,
  PercentageOutlined,
  DownloadOutlined,
  BarChartOutlined,
  PieChartOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { Line, Column, Pie, Area, DualAxes } from '@ant-design/charts';
import type { TabsProps } from 'antd';

const { RangePicker } = DatePicker;

const AnalyticsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedTab, setSelectedTab] = useState('performance');

  // Performance data
  const performanceData = [
    { month: 'Jan', fund: 2.3, benchmark: 1.8, sector: 2.1 },
    { month: 'Feb', fund: 3.1, benchmark: 2.2, sector: 2.5 },
    { month: 'Mar', fund: 1.8, benchmark: 1.5, sector: 1.7 },
    { month: 'Apr', fund: 4.2, benchmark: 3.1, sector: 3.5 },
    { month: 'May', fund: 2.9, benchmark: 2.4, sector: 2.6 },
    { month: 'Jun', fund: 3.7, benchmark: 2.8, sector: 3.0 },
    { month: 'Jul', fund: 2.4, benchmark: 1.9, sector: 2.2 },
    { month: 'Aug', fund: 3.9, benchmark: 3.2, sector: 3.4 },
    { month: 'Sep', fund: 2.8, benchmark: 2.3, sector: 2.5 },
    { month: 'Oct', fund: 3.3, benchmark: 2.7, sector: 2.9 },
    { month: 'Nov', fund: 4.1, benchmark: 3.4, sector: 3.6 },
  ];

  // AUM growth data
  const aumGrowthData = [
    { month: 'Jan', aum: 65.2, investors: 180 },
    { month: 'Feb', aum: 68.5, investors: 195 },
    { month: 'Mar', aum: 71.3, investors: 208 },
    { month: 'Apr', aum: 74.8, investors: 218 },
    { month: 'May', aum: 77.2, investors: 225 },
    { month: 'Jun', aum: 79.5, investors: 232 },
    { month: 'Jul', aum: 81.3, investors: 238 },
    { month: 'Aug', aum: 83.7, investors: 245 },
    { month: 'Sep', aum: 85.9, investors: 253 },
    { month: 'Oct', aum: 88.2, investors: 261 },
    { month: 'Nov', aum: 91.5, investors: 270 },
  ];

  // Asset allocation
  const assetAllocationData = [
    { type: 'Bitcoin', value: 42.5, amount: '$38.9M' },
    { type: 'Ethereum', value: 28.3, amount: '$25.9M' },
    { type: 'DeFi Tokens', value: 15.8, amount: '$14.5M' },
    { type: 'Stablecoins', value: 10.2, amount: '$9.3M' },
    { type: 'Other Crypto', value: 3.2, amount: '$2.9M' },
  ];

  // Investor analytics
  const investorSegmentationData = [
    { segment: 'High Net Worth', count: 45, percentage: 16.7, aum: '$42.5M' },
    { segment: 'Retail', count: 180, percentage: 66.7, aum: '$28.2M' },
    { segment: 'Institutional', count: 25, percentage: 9.3, aum: '$15.8M' },
    { segment: 'Accredited', count: 20, percentage: 7.4, aum: '$5.0M' },
  ];

  // Trading volume data
  const tradingVolumeData = [
    { day: 'Mon', buy: 4.2, sell: 3.8 },
    { day: 'Tue', buy: 5.1, sell: 4.3 },
    { day: 'Wed', buy: 3.9, sell: 4.8 },
    { day: 'Thu', buy: 6.2, sell: 5.1 },
    { day: 'Fri', buy: 4.8, sell: 5.5 },
    { day: 'Sat', buy: 2.3, sell: 2.1 },
    { day: 'Sun', buy: 1.9, sell: 1.7 },
  ];

  // Risk metrics
  const riskMetrics = [
    { metric: 'Sharpe Ratio', value: 1.85, benchmark: 1.42, status: 'good' },
    { metric: 'Max Drawdown', value: -8.2, benchmark: -12.5, status: 'good' },
    { metric: 'Volatility (30d)', value: 15.3, benchmark: 18.7, status: 'good' },
    { metric: 'Beta', value: 0.92, benchmark: 1.0, status: 'neutral' },
    { metric: 'Alpha', value: 3.8, benchmark: 0.0, status: 'good' },
  ];

  // Top performing assets
  const topAssetsColumns = [
    {
      title: 'Asset',
      dataIndex: 'asset',
      key: 'asset',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Allocation',
      dataIndex: 'allocation',
      key: 'allocation',
      render: (value: number) => <Progress percent={value} size="small" />,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (value: string) => <span style={{ fontWeight: 500 }}>{value}</span>,
    },
    {
      title: '7d Change',
      dataIndex: 'change7d',
      key: 'change7d',
      render: (value: number) => (
        <Tag color={value >= 0 ? 'green' : 'red'} icon={value >= 0 ? <RiseOutlined /> : <FallOutlined />}>
          {value >= 0 ? '+' : ''}{value}%
        </Tag>
      ),
    },
    {
      title: '30d Return',
      dataIndex: 'return30d',
      key: 'return30d',
      render: (value: number) => (
        <span style={{ color: value >= 0 ? '#52c41a' : '#ff4d4f', fontWeight: 500 }}>
          {value >= 0 ? '+' : ''}{value}%
        </span>
      ),
    },
  ];

  const topAssetsData = [
    { key: '1', asset: 'Bitcoin (BTC)', allocation: 42, value: '$38.9M', change7d: 5.2, return30d: 18.4 },
    { key: '2', asset: 'Ethereum (ETH)', allocation: 28, value: '$25.9M', change7d: 8.1, return30d: 24.7 },
    { key: '3', asset: 'Solana (SOL)', allocation: 8, value: '$7.4M', change7d: 12.3, return30d: 45.9 },
    { key: '4', asset: 'Cardano (ADA)', allocation: 5, value: '$4.6M', change7d: -2.1, return30d: 8.3 },
    { key: '5', asset: 'Polygon (MATIC)', allocation: 4, value: '$3.7M', change7d: 3.8, return30d: 15.2 },
  ];

  // Investor flow data
  const investorFlowData = [
    { month: 'Jan', inflows: 4.2, outflows: 1.8, net: 2.4 },
    { month: 'Feb', inflows: 5.5, outflows: 2.1, net: 3.4 },
    { month: 'Mar', inflows: 3.8, outflows: 2.5, net: 1.3 },
    { month: 'Apr', inflows: 6.2, outflows: 1.9, net: 4.3 },
    { month: 'May', inflows: 4.9, outflows: 2.3, net: 2.6 },
    { month: 'Jun', inflows: 5.7, outflows: 2.8, net: 2.9 },
    { month: 'Jul', inflows: 4.3, outflows: 2.2, net: 2.1 },
    { month: 'Aug', inflows: 6.8, outflows: 2.5, net: 4.3 },
    { month: 'Sep', inflows: 5.2, outflows: 3.1, net: 2.1 },
    { month: 'Oct', inflows: 7.1, outflows: 2.4, net: 4.7 },
    { month: 'Nov', inflows: 6.5, outflows: 2.9, net: 3.6 },
  ];

  // Performance line chart config
  const performanceLineConfig = {
    data: performanceData.flatMap(d => [
      { month: d.month, value: d.fund, category: 'Fund Performance' },
      { month: d.month, value: d.benchmark, category: 'Benchmark' },
      { month: d.month, value: d.sector, category: 'Sector Average' },
    ]),
    xField: 'month',
    yField: 'value',
    seriesField: 'category',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    color: ['#1890ff', '#52c41a', '#faad14'],
  };

  // AUM growth dual axes chart config
  const aumGrowthConfig = {
    data: [aumGrowthData, aumGrowthData],
    xField: 'month',
    yField: ['aum', 'investors'],
    geometryOptions: [
      {
        geometry: 'line',
        smooth: true,
        color: '#5B8FF9',
      },
      {
        geometry: 'line',
        smooth: true,
        color: '#5AD8A6',
      },
    ],
  };

  // Asset allocation pie chart config
  const assetAllocationConfig = {
    data: assetAllocationData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  // Trading volume column chart config
  const tradingVolumeConfig = {
    data: tradingVolumeData.flatMap(d => [
      { day: d.day, value: d.buy, type: 'Buy' },
      { day: d.day, value: d.sell, type: 'Sell' },
    ]),
    xField: 'day',
    yField: 'value',
    seriesField: 'type',
    isGroup: true,
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    color: ['#52c41a', '#ff4d4f'],
  };

  // Investor flow area chart config
  const investorFlowConfig = {
    data: investorFlowData.flatMap(d => [
      { month: d.month, value: d.inflows, type: 'Inflows' },
      { month: d.month, value: d.outflows, type: 'Outflows' },
      { month: d.month, value: d.net, type: 'Net Flow' },
    ]),
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    areaStyle: {
      fillOpacity: 0.3,
    },
    color: ['#52c41a', '#ff4d4f', '#1890ff'],
  };

  const tabItems: TabsProps['items'] = [
    {
      key: 'performance',
      label: (
        <span>
          <LineChartOutlined /> Performance Analytics
        </span>
      ),
      children: (
        <div>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="YTD Return"
                  value={18.2}
                  precision={1}
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<RiseOutlined />}
                  suffix="%"
                />
                <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
                  vs Benchmark: +12.3%
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="30d Return"
                  value={4.1}
                  precision={1}
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<RiseOutlined />}
                  suffix="%"
                />
                <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
                  vs Benchmark: +3.4%
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="7d Return"
                  value={1.8}
                  precision={1}
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<RiseOutlined />}
                  suffix="%"
                />
                <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
                  vs Benchmark: +1.2%
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Sharpe Ratio"
                  value={1.85}
                  precision={2}
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<TrophyOutlined />}
                />
                <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
                  Risk-adjusted return
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card title="Performance Comparison" extra={<Select defaultValue="11m" style={{ width: 100 }}><Select.Option value="1m">1 Month</Select.Option><Select.Option value="3m">3 Months</Select.Option><Select.Option value="6m">6 Months</Select.Option><Select.Option value="11m">11 Months</Select.Option></Select>}>
                <Line {...performanceLineConfig} height={300} />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="Risk Metrics">
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  {riskMetrics.map((metric, index) => (
                    <div key={index}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: '#666' }}>{metric.metric}</span>
                        <span style={{ fontWeight: 500 }}>
                          {metric.value}
                          {metric.status === 'good' && <Tag color="green" style={{ marginLeft: 8, fontSize: 10 }}>Good</Tag>}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: '#999' }}>
                        Benchmark: {metric.benchmark}
                      </div>
                      {index < riskMetrics.length - 1 && <div style={{ borderBottom: '1px solid #f0f0f0', margin: '8px 0' }} />}
                    </div>
                  ))}
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: 'aum',
      label: (
        <span>
          <DollarOutlined /> AUM & Growth
        </span>
      ),
      children: (
        <div>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total AUM"
                  value={91.5}
                  precision={1}
                  prefix={<DollarOutlined />}
                  suffix="M"
                />
                <div style={{ fontSize: 12, color: '#52c41a', marginTop: 8 }}>
                  <RiseOutlined /> +40.4% YTD
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total Investors"
                  value={270}
                  prefix={<TeamOutlined />}
                />
                <div style={{ fontSize: 12, color: '#52c41a', marginTop: 8 }}>
                  <RiseOutlined /> +50 YTD
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Avg Investment"
                  value={338.9}
                  precision={1}
                  prefix={<DollarOutlined />}
                  suffix="K"
                />
                <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
                  Per investor
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="30d Net Inflow"
                  value={3.6}
                  precision={1}
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<RiseOutlined />}
                  suffix="M"
                />
                <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
                  Inflows - Outflows
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Card title="AUM & Investor Growth">
                <DualAxes {...aumGrowthConfig} height={300} />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24} lg={12}>
              <Card title="Investor Flows (Last 11 Months)">
                <Area {...investorFlowConfig} height={280} />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Investor Segmentation">
                <Table
                  dataSource={investorSegmentationData}
                  pagination={false}
                  size="small"
                  columns={[
                    { title: 'Segment', dataIndex: 'segment', key: 'segment' },
                    { title: 'Count', dataIndex: 'count', key: 'count', align: 'center' },
                    {
                      title: 'Percentage',
                      dataIndex: 'percentage',
                      key: 'percentage',
                      align: 'center',
                      render: (val: number) => `${val}%`,
                    },
                    {
                      title: 'AUM',
                      dataIndex: 'aum',
                      key: 'aum',
                      align: 'right',
                      render: (val: string) => <span style={{ fontWeight: 500 }}>{val}</span>,
                    },
                  ]}
                />
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: 'assets',
      label: (
        <span>
          <PieChartOutlined /> Asset Analytics
        </span>
      ),
      children: (
        <div>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total Assets"
                  value={42}
                  prefix={<FundOutlined />}
                />
                <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
                  Across portfolio
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Best Performer"
                  value="SOL"
                />
                <div style={{ fontSize: 12, color: '#52c41a', marginTop: 8 }}>
                  <RiseOutlined /> +45.9% (30d)
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Portfolio Diversity"
                  value={8.5}
                  precision={1}
                  suffix="/10"
                />
                <div style={{ fontSize: 12, color: '#52c41a', marginTop: 8 }}>
                  Well diversified
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Rebalancing Due"
                  value={3}
                />
                <div style={{ fontSize: 12, color: '#faad14', marginTop: 8 }}>
                  Assets need attention
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={10}>
              <Card title="Asset Allocation">
                <Pie {...assetAllocationConfig} height={300} />
              </Card>
            </Col>
            <Col xs={24} lg={14}>
              <Card title="Top Performing Assets">
                <Table
                  columns={topAssetsColumns}
                  dataSource={topAssetsData}
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: 'trading',
      label: (
        <span>
          <BarChartOutlined /> Trading Analytics
        </span>
      ),
      children: (
        <div>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="30d Volume"
                  value={42.8}
                  precision={1}
                  prefix={<SwapOutlined />}
                  suffix="M"
                />
                <div style={{ fontSize: 12, color: '#52c41a', marginTop: 8 }}>
                  <RiseOutlined /> +12.3% vs last month
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total Trades"
                  value={1247}
                />
                <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
                  Last 30 days
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Avg Trade Size"
                  value={34.3}
                  precision={1}
                  prefix="$"
                  suffix="K"
                />
                <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
                  Per transaction
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Win Rate"
                  value={68.5}
                  precision={1}
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<PercentageOutlined />}
                  suffix="%"
                />
                <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
                  Profitable trades
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Card title="Trading Volume (Last 7 Days)">
                <Column {...tradingVolumeConfig} height={300} />
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, marginBottom: 8 }}>
            <BarChartOutlined style={{ marginRight: 8 }} />
            Analytics Dashboard
          </h1>
          <p style={{ color: '#666', marginBottom: 0 }}>
            Advanced analytics and performance insights for your fund
          </p>
        </div>
        <Space>
          <RangePicker />
          <Button type="primary" icon={<DownloadOutlined />}>
            Export Report
          </Button>
        </Space>
      </div>

      <Tabs
        activeKey={selectedTab}
        onChange={setSelectedTab}
        items={tabItems}
      />
    </div>
  );
};

export default AnalyticsPage;
