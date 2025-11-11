import { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Select,
  DatePicker,
  Space,
  Table,
  Tag,
  Progress,
  Tabs,
  Timeline,
  Button,
  message,
} from 'antd';
import {
  RocketOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  FileTextOutlined,
  GlobalOutlined,
  RiseOutlined,
  FallOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Column, Line, Pie, Area } from '@ant-design/charts';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

export default function TokenizationAnalyticsPage() {
  const [dateRange, setDateRange] = useState<any>([dayjs().subtract(6, 'months'), dayjs()]);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('all');
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    message.info('Refreshing analytics data...');
    setTimeout(() => {
      setLoading(false);
      message.success('Analytics data updated!');
    }, 1500);
  };

  // Overview Metrics
  const overviewMetrics = {
    totalProcesses: 15,
    activeProcesses: 3,
    completedProcesses: 12,
    averageCompletionTime: 45, // days
    successRate: 92.3, // %
    totalValueTokenized: 287500000, // $287.5M
    averageTimeReduction: 34, // % vs traditional
    complianceScore: 94.2,
  };

  // Time Series Data
  const tokenizationTrend = [
    { month: 'Jun', initiated: 2, completed: 1, value: 35000000 },
    { month: 'Jul', initiated: 3, completed: 2, value: 48000000 },
    { month: 'Aug', initiated: 2, completed: 3, value: 62000000 },
    { month: 'Sep', initiated: 4, completed: 2, value: 45000000 },
    { month: 'Oct', initiated: 3, completed: 3, value: 58000000 },
    { month: 'Nov', initiated: 1, completed: 1, value: 39500000 },
  ];

  const avgCompletionTimeByStage = [
    { stage: 'Asset Origination', days: 8, benchmark: 12 },
    { stage: 'Legal Structure', days: 12, benchmark: 18 },
    { stage: 'Regulatory Compliance', days: 15, benchmark: 25 },
    { stage: 'Token Economics', days: 5, benchmark: 8 },
    { stage: 'Smart Contract', days: 10, benchmark: 15 },
    { stage: 'Documentation', days: 8, benchmark: 14 },
    { stage: 'Investor Onboarding', days: 12, benchmark: 20 },
  ];

  // Jurisdiction Distribution
  const jurisdictionData = [
    { jurisdiction: 'Turkey → USA', count: 8, value: 185000000 },
    { jurisdiction: 'Turkey → UAE', count: 3, value: 52500000 },
    { jurisdiction: 'Turkey → Singapore', count: 2, value: 35000000 },
    { jurisdiction: 'Turkey → UK', count: 2, value: 15000000 },
  ];

  // Asset Class Distribution
  const assetClassData = [
    { type: 'Real Estate', value: 45, count: 7 },
    { type: 'Private Equity', value: 25, count: 4 },
    { type: 'Infrastructure', value: 20, count: 2 },
    { type: 'Commodities', value: 10, count: 2 },
  ];

  // Compliance Metrics
  const complianceMetrics = [
    { category: 'SEC Filings', completion: 100, onTime: 12, delayed: 0 },
    { category: 'SPK Approval', completion: 95, onTime: 11, delayed: 1 },
    { category: 'KYC/AML', completion: 98, onTime: 14, delayed: 1 },
    { category: 'Legal Documents', completion: 92, onTime: 11, delayed: 2 },
    { category: 'Smart Contract Audits', completion: 100, onTime: 12, delayed: 0 },
  ];

  // Document Status
  const documentStats = [
    { type: 'PPM', total: 15, completed: 14, inReview: 1, pending: 0 },
    { type: 'Subscription Agreements', total: 15, completed: 13, inReview: 2, pending: 0 },
    { type: 'SEC Form D', total: 15, completed: 15, inReview: 0, pending: 0 },
    { type: 'SPK Approval Letters', total: 15, completed: 12, inReview: 2, pending: 1 },
    { type: 'Smart Contract Audits', total: 15, completed: 14, inReview: 1, pending: 0 },
    { type: 'Legal Opinions', total: 15, completed: 13, inReview: 1, pending: 1 },
  ];

  // Active Processes Detail
  const activeProcessesDetail = [
    {
      key: '1',
      fundName: 'Turkish Real Estate Fund I',
      stage: 'US Investor Onboarding',
      progress: 71,
      daysInProgress: 38,
      estimatedCompletion: '5 days',
      jurisdiction: 'Turkey → USA',
      blockers: 0,
      status: 'on-track',
    },
    {
      key: '2',
      fundName: 'Istanbul Commercial Properties',
      stage: 'Smart Contract Development',
      progress: 45,
      daysInProgress: 22,
      estimatedCompletion: '12 days',
      jurisdiction: 'Turkey → USA',
      blockers: 0,
      status: 'on-track',
    },
    {
      key: '3',
      fundName: 'Ankara Industrial Portfolio',
      stage: 'Regulatory Structure',
      progress: 28,
      daysInProgress: 15,
      estimatedCompletion: '18 days',
      jurisdiction: 'Turkey → UAE',
      blockers: 1,
      status: 'at-risk',
    },
  ];

  // Performance Benchmarks
  const performanceBenchmarks = {
    industry: {
      avgCompletionTime: 90, // days
      successRate: 75, // %
      avgCost: 450000, // $
      complianceScore: 82, // %
    },
    naveo: {
      avgCompletionTime: 45, // days
      successRate: 92.3, // %
      avgCost: 285000, // $
      complianceScore: 94.2, // %
    },
  };

  // Charts Configuration
  const trendChartConfig = {
    data: tokenizationTrend,
    xField: 'month',
    yField: 'completed',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };

  const stageTimeChartConfig = {
    data: avgCompletionTimeByStage.flatMap((item) => [
      { stage: item.stage, type: 'Actual', days: item.days },
      { stage: item.stage, type: 'Benchmark', days: item.benchmark },
    ]),
    xField: 'stage',
    yField: 'days',
    seriesField: 'type',
    isGroup: true,
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    color: ['#1890ff', '#d9d9d9'],
    label: {
      position: 'top' as const,
      style: {
        fill: '#000000',
        opacity: 0.6,
      },
    },
  };

  const jurisdictionPieConfig = {
    data: jurisdictionData,
    angleField: 'count',
    colorField: 'jurisdiction',
    radius: 0.8,
    label: {
      type: 'outer' as const,
      content: '{name} ({percentage})',
    },
    interactions: [
      {
        type: 'element-active' as const,
      },
    ],
  };

  const assetClassPieConfig = {
    data: assetClassData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      type: 'inner' as const,
      offset: '-30%',
      content: '{percentage}',
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
  };

  const valueChartConfig = {
    data: tokenizationTrend,
    xField: 'month',
    yField: 'value',
    smooth: true,
    areaStyle: {
      fillOpacity: 0.3,
    },
    color: '#52c41a',
  };

  // Table Columns
  const activeProcessColumns = [
    {
      title: 'Fund Name',
      dataIndex: 'fundName',
      key: 'fundName',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Jurisdiction',
      dataIndex: 'jurisdiction',
      key: 'jurisdiction',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Stage',
      dataIndex: 'stage',
      key: 'stage',
      responsive: ['md'] as any,
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => (
        <Progress
          percent={progress}
          strokeColor={progress > 70 ? '#52c41a' : progress > 40 ? '#faad14' : '#1890ff'}
          size="small"
        />
      ),
    },
    {
      title: 'Days',
      dataIndex: 'daysInProgress',
      key: 'daysInProgress',
      responsive: ['lg'] as any,
      render: (days: number) => `${days}d`,
    },
    {
      title: 'ETA',
      dataIndex: 'estimatedCompletion',
      key: 'estimatedCompletion',
      responsive: ['lg'] as any,
    },
    {
      title: 'Blockers',
      dataIndex: 'blockers',
      key: 'blockers',
      render: (blockers: number) =>
        blockers > 0 ? (
          <Tag color="orange" icon={<WarningOutlined />}>
            {blockers}
          </Tag>
        ) : (
          <Tag color="green" icon={<CheckCircleOutlined />}>
            None
          </Tag>
        ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'on-track' ? 'green' : status === 'at-risk' ? 'orange' : 'red'}>
          {status.toUpperCase().replace('-', ' ')}
        </Tag>
      ),
    },
  ];

  const documentColumns = [
    {
      title: 'Document Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
    },
    {
      title: 'Completed',
      dataIndex: 'completed',
      key: 'completed',
      render: (val: number) => <Tag color="green">{val}</Tag>,
    },
    {
      title: 'In Review',
      dataIndex: 'inReview',
      key: 'inReview',
      render: (val: number) => (val > 0 ? <Tag color="blue">{val}</Tag> : <span>-</span>),
    },
    {
      title: 'Pending',
      dataIndex: 'pending',
      key: 'pending',
      render: (val: number) => (val > 0 ? <Tag color="orange">{val}</Tag> : <span>-</span>),
    },
    {
      title: 'Completion %',
      key: 'completion',
      render: (record: any) => {
        const percentage = (record.completed / record.total) * 100;
        return (
          <Progress
            percent={percentage}
            strokeColor={percentage === 100 ? '#52c41a' : '#1890ff'}
            size="small"
          />
        );
      },
    },
  ];

  const complianceColumns = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Completion %',
      dataIndex: 'completion',
      key: 'completion',
      render: (val: number) => (
        <Progress
          percent={val}
          strokeColor={val === 100 ? '#52c41a' : val >= 95 ? '#faad14' : '#ff4d4f'}
          size="small"
        />
      ),
    },
    {
      title: 'On Time',
      dataIndex: 'onTime',
      key: 'onTime',
      render: (val: number) => <Tag color="green">{val}</Tag>,
    },
    {
      title: 'Delayed',
      dataIndex: 'delayed',
      key: 'delayed',
      render: (val: number) => (val > 0 ? <Tag color="red">{val}</Tag> : <span>-</span>),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <h1 style={{ marginBottom: 8, fontFamily: 'var(--font-heading)' }}>
              <RocketOutlined style={{ marginRight: 12 }} />
              Tokenization Analytics
            </h1>
            <p style={{ color: '#8c8c8c', fontSize: '14px', margin: 0 }}>
              Advanced metrics and insights for cross-border tokenization processes
            </p>
          </Col>
          <Col>
            <Space>
              <RangePicker
                value={dateRange}
                onChange={setDateRange}
                format="MMM DD, YYYY"
              />
              <Select
                value={selectedJurisdiction}
                onChange={setSelectedJurisdiction}
                style={{ width: 200 }}
              >
                <Select.Option value="all">All Jurisdictions</Select.Option>
                <Select.Option value="usa">Turkey → USA</Select.Option>
                <Select.Option value="uae">Turkey → UAE</Select.Option>
                <Select.Option value="singapore">Turkey → Singapore</Select.Option>
                <Select.Option value="uk">Turkey → UK</Select.Option>
              </Select>
              <Button type="primary" onClick={handleRefresh} loading={loading}>
                Refresh
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Overview Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Processes"
              value={overviewMetrics.totalProcesses}
              prefix={<RocketOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: 8 }}>
              <Tag color="green">{overviewMetrics.completedProcesses} Completed</Tag>
              <Tag color="blue">{overviewMetrics.activeProcesses} Active</Tag>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Success Rate"
              value={overviewMetrics.successRate}
              suffix="%"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>
              Industry Avg: {performanceBenchmarks.industry.successRate}%
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Avg Completion Time"
              value={overviewMetrics.averageCompletionTime}
              suffix="days"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <div style={{ marginTop: 8 }}>
              <Tag color="green" icon={<RiseOutlined />}>
                {overviewMetrics.averageTimeReduction}% faster
              </Tag>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Value Tokenized"
              value={overviewMetrics.totalValueTokenized / 1000000}
              precision={1}
              suffix="M"
              prefix="$"
              valueStyle={{ color: '#13c2c2' }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>
              Across {overviewMetrics.completedProcesses} completed processes
            </div>
          </Card>
        </Col>
      </Row>

      {/* Performance vs Industry Benchmark */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card title="Performance vs Industry Benchmark" bordered={false}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12} lg={6}>
                <Statistic
                  title="Completion Time"
                  value={performanceBenchmarks.naveo.avgCompletionTime}
                  suffix="days"
                  prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                />
                <Progress
                  percent={
                    ((performanceBenchmarks.industry.avgCompletionTime -
                      performanceBenchmarks.naveo.avgCompletionTime) /
                      performanceBenchmarks.industry.avgCompletionTime) *
                    100
                  }
                  strokeColor="#52c41a"
                  format={() => '50% faster'}
                  size="small"
                  style={{ marginTop: 8 }}
                />
              </Col>
              <Col xs={24} md={12} lg={6}>
                <Statistic
                  title="Success Rate"
                  value={performanceBenchmarks.naveo.successRate}
                  suffix="%"
                  prefix={<TrophyOutlined style={{ color: '#52c41a' }} />}
                />
                <Progress
                  percent={performanceBenchmarks.naveo.successRate}
                  strokeColor="#52c41a"
                  size="small"
                  style={{ marginTop: 8 }}
                />
              </Col>
              <Col xs={24} md={12} lg={6}>
                <Statistic
                  title="Avg Cost"
                  value={performanceBenchmarks.naveo.avgCost / 1000}
                  suffix="K"
                  prefix="$"
                  valueStyle={{ color: '#52c41a' }}
                />
                <Progress
                  percent={
                    ((performanceBenchmarks.industry.avgCost -
                      performanceBenchmarks.naveo.avgCost) /
                      performanceBenchmarks.industry.avgCost) *
                    100
                  }
                  strokeColor="#52c41a"
                  format={() => '37% cheaper'}
                  size="small"
                  style={{ marginTop: 8 }}
                />
              </Col>
              <Col xs={24} md={12} lg={6}>
                <Statistic
                  title="Compliance Score"
                  value={performanceBenchmarks.naveo.complianceScore}
                  suffix="%"
                  prefix={<FileTextOutlined style={{ color: '#52c41a' }} />}
                />
                <Progress
                  percent={performanceBenchmarks.naveo.complianceScore}
                  strokeColor="#52c41a"
                  size="small"
                  style={{ marginTop: 8 }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Tabs for Different Analytics Views */}
      <Tabs defaultActiveKey="1" style={{ marginBottom: 24 }}>
        <TabPane tab="Trends & Velocity" key="1">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="Tokenization Velocity" bordered={false}>
                <Column
                  data={tokenizationTrend.flatMap((item) => [
                    { month: item.month, type: 'Initiated', count: item.initiated },
                    { month: item.month, type: 'Completed', count: item.completed },
                  ])}
                  xField="month"
                  yField="count"
                  seriesField="type"
                  isGroup
                  columnStyle={{
                    radius: [4, 4, 0, 0],
                  }}
                  color={['#1890ff', '#52c41a']}
                />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Total Value Tokenized (Monthly)" bordered={false}>
                <Area {...valueChartConfig} />
              </Card>
            </Col>
            <Col xs={24}>
              <Card title="Avg Completion Time by Stage" bordered={false}>
                <Column {...stageTimeChartConfig} />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Geographic Distribution" key="2">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="Tokenizations by Jurisdiction" bordered={false}>
                <Pie {...jurisdictionPieConfig} />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Asset Class Distribution" bordered={false}>
                <Pie {...assetClassPieConfig} />
              </Card>
            </Col>
            <Col xs={24}>
              <Card title="Jurisdiction Details" bordered={false}>
                <Table
                  dataSource={jurisdictionData}
                  pagination={false}
                  size="small"
                  columns={[
                    {
                      title: 'Jurisdiction',
                      dataIndex: 'jurisdiction',
                      key: 'jurisdiction',
                      render: (text: string) => (
                        <Space>
                          <GlobalOutlined />
                          <span style={{ fontWeight: 500 }}>{text}</span>
                        </Space>
                      ),
                    },
                    {
                      title: 'Count',
                      dataIndex: 'count',
                      key: 'count',
                      render: (val: number) => <Tag color="blue">{val}</Tag>,
                    },
                    {
                      title: 'Total Value',
                      dataIndex: 'value',
                      key: 'value',
                      render: (val: number) => `$${(val / 1000000).toFixed(1)}M`,
                    },
                    {
                      title: 'Avg Value',
                      key: 'avgValue',
                      render: (record: any) =>
                        `$${((record.value / record.count) / 1000000).toFixed(1)}M`,
                    },
                  ]}
                />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Active Processes" key="3">
          <Card bordered={false}>
            <Table
              dataSource={activeProcessesDetail}
              columns={activeProcessColumns}
              pagination={false}
              scroll={{ x: 1000 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="Compliance & Documents" key="4">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="Compliance Metrics" bordered={false}>
                <Table
                  dataSource={complianceMetrics}
                  columns={complianceColumns}
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Document Status" bordered={false}>
                <Table
                  dataSource={documentStats}
                  columns={documentColumns}
                  pagination={false}
                  size="small"
                  scroll={{ x: 600 }}
                />
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
}
