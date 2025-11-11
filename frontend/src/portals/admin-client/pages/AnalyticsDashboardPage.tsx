import { useState, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Select,
  Space,
  Button,
  DatePicker,
  Segmented,
  Progress,
  Tag,
  Table,
  Tooltip,
} from 'antd';
import {
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
  TeamOutlined,
  TrophyOutlined,
  LineChartOutlined,
  BarChartOutlined,
  PieChartOutlined,
  DownloadOutlined,
  ReloadOutlined,
  FundProjectionScreenOutlined,
  TransactionOutlined,
  UserOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { Line, Column, Pie, Area, DualAxes, Gauge } from '@ant-design/charts';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function AnalyticsDashboardPage() {
  const [timePeriod, setTimePeriod] = useState<string>('1M');
  const [metricView, setMetricView] = useState<string>('overview');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([
    dayjs().subtract(1, 'month'),
    dayjs(),
  ]);

  // Mock data for fund performance over time
  const fundPerformanceData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
    return months.map((month, index) => ({
      month,
      nav: 100 + (index + 1) * 2.5 + Math.random() * 3,
      aum: 50 + (index + 1) * 5 + Math.random() * 5,
      target: 100 + (index + 1) * 3,
    }));
  }, []);

  // Asset allocation data
  const assetAllocationData = useMemo(
    () => [
      { asset: 'Equities', value: 42, change: 2.5 },
      { asset: 'Fixed Income', value: 28, change: -1.2 },
      { asset: 'Commodities', value: 15, change: 3.8 },
      { asset: 'Real Estate', value: 10, change: 1.5 },
      { asset: 'Cash', value: 5, change: -0.8 },
    ],
    []
  );

  // Monthly returns data
  const monthlyReturnsData = useMemo(() => {
    return [
      { month: 'Jan', return: 2.3, benchmark: 1.8 },
      { month: 'Feb', return: 1.5, benchmark: 1.2 },
      { month: 'Mar', return: 3.2, benchmark: 2.5 },
      { month: 'Apr', return: -0.8, benchmark: -0.5 },
      { month: 'May', return: 2.7, benchmark: 2.1 },
      { month: 'Jun', return: 1.9, benchmark: 1.5 },
      { month: 'Jul', return: 2.5, benchmark: 2.0 },
      { month: 'Aug', return: 1.2, benchmark: 1.0 },
      { month: 'Sep', return: 3.5, benchmark: 2.8 },
      { month: 'Oct', return: 2.1, benchmark: 1.7 },
      { month: 'Nov', return: 2.8, benchmark: 2.2 },
    ];
  }, []);

  // Investor activity data
  const investorActivityData = useMemo(() => {
    return [
      { week: 'W1', newInvestors: 12, deposits: 2.5, withdrawals: 0.8 },
      { week: 'W2', newInvestors: 15, deposits: 3.2, withdrawals: 1.2 },
      { week: 'W3', newInvestors: 18, deposits: 4.1, withdrawals: 1.5 },
      { week: 'W4', newInvestors: 14, deposits: 3.5, withdrawals: 1.0 },
      { week: 'W5', newInvestors: 20, deposits: 5.2, withdrawals: 1.8 },
      { week: 'W6', newInvestors: 17, deposits: 4.3, withdrawals: 1.3 },
      { week: 'W7', newInvestors: 22, deposits: 5.8, withdrawals: 2.1 },
      { week: 'W8', newInvestors: 19, deposits: 4.9, withdrawals: 1.6 },
    ];
  }, []);

  // Trading performance data
  const tradingPerformanceData = useMemo(() => {
    return [
      { strategy: 'Momentum', winRate: 72, avgReturn: 3.2, trades: 145 },
      { strategy: 'Mean Reversion', winRate: 68, avgReturn: 2.5, trades: 189 },
      { strategy: 'Arbitrage', winRate: 85, avgReturn: 1.8, trades: 234 },
      { strategy: 'Trend Following', winRate: 65, avgReturn: 4.1, trades: 112 },
      { strategy: 'Options', winRate: 70, avgReturn: 2.9, trades: 98 },
    ];
  }, []);

  // Regional distribution data
  const regionalDistributionData = useMemo(
    () => [
      { region: 'North America', allocation: 35 },
      { region: 'Europe', allocation: 28 },
      { region: 'Asia Pacific', allocation: 22 },
      { region: 'Latin America', allocation: 10 },
      { region: 'Middle East', allocation: 5 },
    ],
    []
  );

  // Top holdings table data
  const topHoldingsData = useMemo(
    () => [
      {
        key: '1',
        symbol: 'AAPL',
        name: 'Apple Inc.',
        allocation: 8.5,
        value: 4.25,
        return: 12.3,
        risk: 'medium',
      },
      {
        key: '2',
        symbol: 'MSFT',
        name: 'Microsoft Corp.',
        allocation: 7.2,
        value: 3.6,
        return: 15.7,
        risk: 'low',
      },
      {
        key: '3',
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        allocation: 6.8,
        value: 3.4,
        return: 10.2,
        risk: 'medium',
      },
      {
        key: '4',
        symbol: 'AMZN',
        name: 'Amazon.com Inc.',
        allocation: 5.9,
        value: 2.95,
        return: 8.9,
        risk: 'medium',
      },
      {
        key: '5',
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        allocation: 4.3,
        value: 2.15,
        return: 22.5,
        risk: 'high',
      },
    ],
    []
  );

  const handleExportReport = () => {
    console.log('Exporting analytics report...');
  };

  const handleRefreshData = () => {
    console.log('Refreshing analytics data...');
  };

  // Chart configurations
  const fundPerformanceConfig = {
    data: fundPerformanceData,
    xField: 'month',
    yField: 'nav',
    xAxis: {
      label: {
        autoRotate: false,
      },
    },
    yAxis: {
      label: {
        formatter: (v: string) => `$${v}`,
      },
    },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    lineStyle: {
      lineWidth: 3,
    },
    point: {
      size: 5,
      shape: 'circle',
      style: {
        fill: '#1890ff',
        stroke: '#fff',
        lineWidth: 2,
      },
    },
    area: {
      style: {
        fill: 'l(270) 0:#1890ff1a 1:#1890ff00',
      },
    },
  };

  const assetAllocationConfig = {
    data: assetAllocationData,
    angleField: 'value',
    colorField: 'asset',
    radius: 0.8,
    innerRadius: 0.64,
    label: {
      type: 'spider',
      content: '{name}\n{percentage}',
    },
    statistic: {
      title: false,
      content: {
        style: {
          fontSize: '24px',
          fontWeight: 'bold',
        },
        content: 'Asset Mix',
      },
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    color: ['#1890ff', '#52c41a', '#faad14', '#722ed1', '#eb2f96'],
  };

  const monthlyReturnsConfig = {
    data: monthlyReturnsData,
    xField: 'month',
    yField: 'return',
    seriesField: 'type',
    columnWidthRatio: 0.6,
    label: {
      position: 'top' as const,
      formatter: (datum: any) => `${datum.return}%`,
    },
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    color: ({ return: ret }: any) => (ret >= 0 ? '#52c41a' : '#f5222d'),
    xAxis: {
      label: {
        autoRotate: false,
      },
    },
    yAxis: {
      label: {
        formatter: (v: string) => `${v}%`,
      },
    },
  };

  const dualAxesConfig = {
    data: [investorActivityData, investorActivityData],
    xField: 'week',
    yField: ['newInvestors', 'deposits'],
    geometryOptions: [
      {
        geometry: 'column',
        color: '#5B8FF9',
      },
      {
        geometry: 'line',
        lineStyle: {
          lineWidth: 2,
        },
        color: '#5AD8A6',
      },
    ],
  };

  const regionalDistributionConfig = {
    data: regionalDistributionData,
    angleField: 'allocation',
    colorField: 'region',
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}%',
      style: {
        textAlign: 'center',
        fontSize: 14,
        fill: '#fff',
      },
    },
    statistic: {
      title: false,
      content: {
        style: {
          fontSize: '18px',
        },
        content: 'Regional',
      },
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
  };

  const topHoldingsColumns = [
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: 'Allocation',
      dataIndex: 'allocation',
      key: 'allocation',
      render: (value: number) => (
        <Space>
          <Progress
            percent={value * 10}
            size="small"
            showInfo={false}
            strokeColor="#1890ff"
            style={{ width: 60 }}
          />
          <Text>{value}%</Text>
        </Space>
      ),
      sorter: (a: any, b: any) => a.allocation - b.allocation,
    },
    {
      title: 'Value ($M)',
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => `$${value.toFixed(2)}M`,
      sorter: (a: any, b: any) => a.value - b.value,
    },
    {
      title: 'Return',
      dataIndex: 'return',
      key: 'return',
      render: (value: number) => (
        <Space>
          {value >= 0 ? (
            <RiseOutlined style={{ color: '#52c41a' }} />
          ) : (
            <FallOutlined style={{ color: '#f5222d' }} />
          )}
          <Text style={{ color: value >= 0 ? '#52c41a' : '#f5222d' }}>
            {value.toFixed(1)}%
          </Text>
        </Space>
      ),
      sorter: (a: any, b: any) => a.return - b.return,
    },
    {
      title: 'Risk',
      dataIndex: 'risk',
      key: 'risk',
      render: (risk: string) => (
        <Tag
          color={
            risk === 'low' ? 'green' : risk === 'medium' ? 'orange' : 'red'
          }
        >
          {risk.toUpperCase()}
        </Tag>
      ),
    },
  ];

  const tradingPerformanceColumns = [
    {
      title: 'Strategy',
      dataIndex: 'strategy',
      key: 'strategy',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Win Rate',
      dataIndex: 'winRate',
      key: 'winRate',
      render: (value: number) => (
        <Space direction="vertical" size={0} style={{ width: '100%' }}>
          <Progress
            percent={value}
            size="small"
            strokeColor={value >= 70 ? '#52c41a' : value >= 60 ? '#faad14' : '#f5222d'}
          />
        </Space>
      ),
      sorter: (a: any, b: any) => a.winRate - b.winRate,
    },
    {
      title: 'Avg Return',
      dataIndex: 'avgReturn',
      key: 'avgReturn',
      render: (value: number) => (
        <Text style={{ color: '#52c41a' }}>{value.toFixed(1)}%</Text>
      ),
      sorter: (a: any, b: any) => a.avgReturn - b.avgReturn,
    },
    {
      title: 'Total Trades',
      dataIndex: 'trades',
      key: 'trades',
      sorter: (a: any, b: any) => a.trades - b.trades,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <div>
          <Title level={2}>
            <LineChartOutlined /> Analytics Dashboard
          </Title>
          <Text type="secondary">
            Comprehensive fund performance and business intelligence
          </Text>
        </div>
        <Space>
          <RangePicker
            value={dateRange}
            onChange={(dates: any) => setDateRange(dates || [null, null])}
          />
          <Button icon={<ReloadOutlined />} onClick={handleRefreshData}>
            Refresh
          </Button>
          <Button type="primary" icon={<DownloadOutlined />} onClick={handleExportReport}>
            Export Report
          </Button>
        </Space>
      </div>

      {/* Time Period Selector */}
      <Card style={{ marginBottom: '16px' }}>
        <Space split>
          <div>
            <Text strong>Time Period:</Text>
            <div style={{ marginTop: '8px' }}>
              <Segmented
                options={['1W', '1M', '3M', '6M', 'YTD', '1Y', 'ALL']}
                value={timePeriod}
                onChange={setTimePeriod}
              />
            </div>
          </div>
          <div>
            <Text strong>View:</Text>
            <div style={{ marginTop: '8px' }}>
              <Segmented
                options={[
                  { label: 'Overview', value: 'overview', icon: <PieChartOutlined /> },
                  { label: 'Performance', value: 'performance', icon: <LineChartOutlined /> },
                  { label: 'Trading', value: 'trading', icon: <BarChartOutlined /> },
                ]}
                value={metricView}
                onChange={setMetricView}
              />
            </div>
          </div>
        </Space>
      </Card>

      {/* Key Performance Indicators */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total AUM"
              value={125.7}
              precision={1}
              suffix="M"
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Space style={{ marginTop: '8px' }}>
              <RiseOutlined style={{ color: '#52c41a' }} />
              <Text type="success">8.5%</Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                vs last month
              </Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Current NAV"
              value={128.45}
              precision={2}
              prefix="$"
              valueStyle={{ color: '#52c41a' }}
            />
            <Space style={{ marginTop: '8px' }}>
              <RiseOutlined style={{ color: '#52c41a' }} />
              <Text type="success">2.3%</Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                today
              </Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="YTD Return"
              value={18.7}
              precision={1}
              suffix="%"
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Space style={{ marginTop: '8px' }}>
              <TrophyOutlined style={{ color: '#faad14' }} />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Outperforming benchmark
              </Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Investors"
              value={245}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <Space style={{ marginTop: '8px' }}>
              <RiseOutlined style={{ color: '#52c41a' }} />
              <Text type="success">12</Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                new this month
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Secondary KPIs */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={6} lg={3}>
          <Card size="small">
            <Statistic
              title="Sharpe Ratio"
              value={1.85}
              precision={2}
              valueStyle={{ fontSize: '20px', color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card size="small">
            <Statistic
              title="Max Drawdown"
              value={-5.2}
              precision={1}
              suffix="%"
              valueStyle={{ fontSize: '20px', color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card size="small">
            <Statistic
              title="Volatility"
              value={12.3}
              precision={1}
              suffix="%"
              valueStyle={{ fontSize: '20px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card size="small">
            <Statistic
              title="Alpha"
              value={2.4}
              precision={1}
              suffix="%"
              valueStyle={{ fontSize: '20px', color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card size="small">
            <Statistic
              title="Beta"
              value={0.92}
              precision={2}
              valueStyle={{ fontSize: '20px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card size="small">
            <Statistic
              title="Win Rate"
              value={68}
              precision={0}
              suffix="%"
              valueStyle={{ fontSize: '20px', color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card size="small">
            <Statistic
              title="Avg Trade"
              value={2.5}
              precision={1}
              suffix="%"
              valueStyle={{ fontSize: '20px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card size="small">
            <Statistic
              title="Total Trades"
              value={1248}
              valueStyle={{ fontSize: '20px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Charts Row 1 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={16}>
          <Card title="Fund Performance (NAV)" bordered={false}>
            <Area {...fundPerformanceConfig} height={320} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Asset Allocation" bordered={false}>
            <Pie {...assetAllocationConfig} height={320} />
          </Card>
        </Col>
      </Row>

      {/* Main Charts Row 2 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title="Monthly Returns (%)" bordered={false}>
            <Column {...monthlyReturnsConfig} height={280} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Investor Activity" bordered={false}>
            <DualAxes {...dualAxesConfig} height={280} />
          </Card>
        </Col>
      </Row>

      {/* Charts Row 3 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={8}>
          <Card title="Regional Distribution" bordered={false}>
            <Pie {...regionalDistributionConfig} height={260} />
          </Card>
        </Col>
        <Col xs={24} lg={16}>
          <Card title="Trading Strategy Performance" bordered={false}>
            <Table
              columns={tradingPerformanceColumns}
              dataSource={tradingPerformanceData}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* Top Holdings Table */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="Top Holdings" bordered={false}>
            <Table
              columns={topHoldingsColumns}
              dataSource={topHoldingsData}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
