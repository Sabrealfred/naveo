import { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  InputNumber,
  Modal,
  Progress,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Column, Line, Pie } from '@ant-design/charts';
import {
  AlertOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  FilePdfOutlined,
  LineChartOutlined,
  SafetyOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { StatCard } from '../../../components/common';

const { Title, Text, Paragraph } = Typography;

type VaRMethod = 'historical' | 'parametric' | 'montecarlo';
type ConfidenceLevel = 95 | 99;
type TimeHorizon = 1 | 10;
type LimitStatus = 'ok' | 'warning' | 'breach';
type ScenarioType = 'crash' | 'rate-spike' | 'crypto-winter' | 'custom';

interface MarketRiskMetrics {
  var: number;
  cvar: number;
  beta: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
}

interface VaRBreakdown {
  asset: string;
  var: number;
  contribution: number;
}

interface StressScenario {
  name: string;
  type: ScenarioType;
  impact: number;
  impactPercent: number;
  description: string;
}

interface ConcentrationMetric {
  largestPosition: { asset: string; weight: number; value: number };
  top5Weight: number;
  herfindahlIndex: number;
  breaches: number;
}

interface LiquidityMetric {
  liquidAssetsPercent: number;
  liquidityRatio: number;
  daysToLiquidate: number;
  redemptionCoverage: number;
}

interface RiskLimit {
  name: string;
  category: string;
  currentValue: number;
  limitThreshold: number;
  percentUtilized: number;
  status: LimitStatus;
}

interface HistoricalReturn {
  date: string;
  return: number;
}

const mockMarketRiskMetrics: MarketRiskMetrics = {
  var: 125000, // $125k at 95% confidence
  cvar: 182000, // $182k conditional VaR
  beta: 1.15,
  volatility: 0.28, // 28% annualized
  sharpeRatio: 1.85,
  maxDrawdown: -0.15, // -15%
};

const mockVaRBreakdown: VaRBreakdown[] = [
  { asset: 'BTC', var: 62500, contribution: 50 },
  { asset: 'ETH', var: 37500, contribution: 30 },
  { asset: 'SOL', var: 18750, contribution: 15 },
  { asset: 'AVAX', var: 6250, contribution: 5 },
];

const mockStressScenarios: StressScenario[] = [
  {
    name: 'Market Crash',
    type: 'crash',
    impact: -200000,
    impactPercent: -20,
    description: '20% decline across all assets',
  },
  {
    name: 'Interest Rate Spike',
    type: 'rate-spike',
    impact: -75000,
    impactPercent: -7.5,
    description: 'Fed raises rates by 200bps',
  },
  {
    name: 'Crypto Winter',
    type: 'crypto-winter',
    impact: -500000,
    impactPercent: -50,
    description: '50% decline in crypto markets',
  },
];

const mockConcentrationMetrics: ConcentrationMetric = {
  largestPosition: { asset: 'BTC', weight: 45, value: 4500000 },
  top5Weight: 100,
  herfindahlIndex: 0.3125, // Sum of squared weights
  breaches: 1,
};

const mockLiquidityMetrics: LiquidityMetric = {
  liquidAssetsPercent: 85,
  liquidityRatio: 2.5,
  daysToLiquidate: 3,
  redemptionCoverage: 45,
};

const mockRiskLimits: RiskLimit[] = [
  {
    name: 'Value at Risk (95%)',
    category: 'Market Risk',
    currentValue: 125000,
    limitThreshold: 150000,
    percentUtilized: 83.3,
    status: 'warning',
  },
  {
    name: 'Max Single Position',
    category: 'Concentration',
    currentValue: 45,
    limitThreshold: 40,
    percentUtilized: 112.5,
    status: 'breach',
  },
  {
    name: 'Leverage Ratio',
    category: 'Market Risk',
    currentValue: 1.2,
    limitThreshold: 2.0,
    percentUtilized: 60,
    status: 'ok',
  },
  {
    name: 'Liquidity Ratio',
    category: 'Liquidity',
    currentValue: 2.5,
    limitThreshold: 1.5,
    percentUtilized: 60,
    status: 'ok',
  },
  {
    name: 'Beta vs Benchmark',
    category: 'Market Risk',
    currentValue: 1.15,
    limitThreshold: 1.5,
    percentUtilized: 76.7,
    status: 'ok',
  },
  {
    name: 'Max Drawdown',
    category: 'Market Risk',
    currentValue: 15,
    limitThreshold: 20,
    percentUtilized: 75,
    status: 'ok',
  },
];

const mockHistoricalReturns: HistoricalReturn[] = Array.from({ length: 100 }, (_, i) => ({
  date: `Day ${i + 1}`,
  return: (Math.random() - 0.5) * 10, // Random returns between -5% and +5%
}));

const mockVolatilityHistory = [
  { date: '2025-10-01', volatility: 0.22 },
  { date: '2025-10-08', volatility: 0.24 },
  { date: '2025-10-15', volatility: 0.26 },
  { date: '2025-10-22', volatility: 0.25 },
  { date: '2025-10-29', volatility: 0.27 },
  { date: '2025-11-05', volatility: 0.28 },
];

const RiskDashboardPage = () => {
  const [varMethod, setVarMethod] = useState<VaRMethod>('historical');
  const [confidenceLevel, setConfidenceLevel] = useState<ConfidenceLevel>(95);
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>(1);
  const [stressTestModalOpen, setStressTestModalOpen] = useState(false);
  const [customScenarioForm] = Form.useForm();

  const limitStatusConfig: Record<LimitStatus, { color: string; icon: React.ReactNode }> = {
    ok: { color: 'success', icon: <CheckCircleOutlined /> },
    warning: { color: 'warning', icon: <WarningOutlined /> },
    breach: { color: 'error', icon: <ExclamationCircleOutlined /> },
  };

  const calculateVaR = (
    method: VaRMethod,
    confidence: ConfidenceLevel,
    horizon: TimeHorizon
  ): number => {
    // Simplified VaR calculation for demonstration
    const baseVaR = mockMarketRiskMetrics.var;
    const confidenceMultiplier = confidence === 99 ? 1.3 : 1.0;
    const horizonMultiplier = Math.sqrt(horizon);
    const methodMultiplier = method === 'montecarlo' ? 1.1 : method === 'parametric' ? 0.95 : 1.0;

    return baseVaR * confidenceMultiplier * horizonMultiplier * methodMultiplier;
  };

  const handleRunStressTest = () => {
    customScenarioForm.validateFields().then((values) => {
      message.success(`Custom stress test executed: ${values.scenarioName}`);
      setStressTestModalOpen(false);
    });
  };

  const handleGenerateReport = (type: string) => {
    message.success(`Generating ${type} risk report...`);
  };

  const varBreakdownColumns: ColumnsType<VaRBreakdown> = [
    {
      title: 'Asset',
      dataIndex: 'asset',
      key: 'asset',
      render: (asset: string) => <Text strong>{asset}</Text>,
    },
    {
      title: 'VaR Contribution',
      dataIndex: 'var',
      key: 'var',
      render: (var_: number) => `$${var_.toLocaleString()}`,
      sorter: (a, b) => a.var - b.var,
    },
    {
      title: '% of Total VaR',
      dataIndex: 'contribution',
      key: 'contribution',
      render: (contribution: number) => (
        <Space>
          <Text>{contribution}%</Text>
          <Progress percent={contribution} size="small" showInfo={false} style={{ width: 100 }} />
        </Space>
      ),
      sorter: (a, b) => a.contribution - b.contribution,
    },
  ];

  const stressScenarioColumns: ColumnsType<StressScenario> = [
    {
      title: 'Scenario',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Portfolio Impact',
      key: 'impact',
      render: (_: unknown, record: StressScenario) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ color: '#ff4d4f' }}>
            ${Math.abs(record.impact).toLocaleString()}
          </Text>
          <Text type="secondary" style={{ fontSize: 11 }}>
            ({record.impactPercent}%)
          </Text>
        </Space>
      ),
      sorter: (a, b) => a.impact - b.impact,
    },
    {
      title: 'Severity',
      key: 'severity',
      render: (_: unknown, record: StressScenario) => {
        const severity =
          Math.abs(record.impactPercent) > 30
            ? 'High'
            : Math.abs(record.impactPercent) > 15
              ? 'Medium'
              : 'Low';
        const color =
          severity === 'High' ? 'error' : severity === 'Medium' ? 'warning' : 'success';
        return <Tag color={color}>{severity}</Tag>;
      },
    },
  ];

  const riskLimitsColumns: ColumnsType<RiskLimit> = [
    {
      title: 'Limit Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: [
        { text: 'Market Risk', value: 'Market Risk' },
        { text: 'Concentration', value: 'Concentration' },
        { text: 'Liquidity', value: 'Liquidity' },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Current Value',
      dataIndex: 'currentValue',
      key: 'currentValue',
      render: (value: number, record: RiskLimit) =>
        record.name.includes('$') || record.name.includes('Value')
          ? `$${value.toLocaleString()}`
          : value.toFixed(2),
    },
    {
      title: 'Limit',
      dataIndex: 'limitThreshold',
      key: 'limitThreshold',
      render: (value: number, record: RiskLimit) =>
        record.name.includes('$') || record.name.includes('Value')
          ? `$${value.toLocaleString()}`
          : value.toFixed(2),
    },
    {
      title: 'Utilization',
      key: 'utilization',
      render: (_: unknown, record: RiskLimit) => (
        <Space>
          <Progress
            percent={record.percentUtilized}
            size="small"
            status={
              record.status === 'breach'
                ? 'exception'
                : record.status === 'warning'
                  ? 'active'
                  : 'success'
            }
            style={{ width: 100 }}
          />
          <Text>{record.percentUtilized.toFixed(1)}%</Text>
        </Space>
      ),
      sorter: (a, b) => a.percentUtilized - b.percentUtilized,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: LimitStatus) => (
        <Tag color={limitStatusConfig[status].color} icon={limitStatusConfig[status].icon}>
          {status.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'OK', value: 'ok' },
        { text: 'Warning', value: 'warning' },
        { text: 'Breach', value: 'breach' },
      ],
      onFilter: (value, record) => record.status === value,
    },
  ];

  const currentVaR = calculateVaR(varMethod, confidenceLevel, timeHorizon);
  const breachCount = mockRiskLimits.filter((l) => l.status === 'breach').length;
  const warningCount = mockRiskLimits.filter((l) => l.status === 'warning').length;

  // Chart configurations
  const varBreakdownChartData = mockVaRBreakdown.map((item) => ({
    asset: item.asset,
    value: item.var,
  }));

  const varBreakdownChartConfig = {
    data: varBreakdownChartData,
    xField: 'asset',
    yField: 'value',
    label: {
      position: 'top' as const,
      formatter: (datum: { value: number }) => `$${(datum.value / 1000).toFixed(0)}K`,
    },
    color: '#ff4d4f',
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
  };

  const volatilityHistoryConfig = {
    data: mockVolatilityHistory,
    xField: 'date',
    yField: 'volatility',
    smooth: true,
    color: '#faad14',
    point: {
      size: 5,
      shape: 'circle',
    },
    yAxis: {
      label: {
        formatter: (v: string) => `${(parseFloat(v) * 100).toFixed(0)}%`,
      },
    },
  };

  const concentrationPieData = [
    { type: 'BTC', value: mockConcentrationMetrics.largestPosition.weight },
    { type: 'ETH', value: 30 },
    { type: 'SOL', value: 15 },
    { type: 'Others', value: 10 },
  ];

  const concentrationPieConfig = {
    data: concentrationPieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer' as const,
      content: '{name} {percentage}',
    },
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3}>Risk Dashboard</Title>
          <Paragraph type="secondary">
            Comprehensive risk monitoring and stress testing for portfolio management
          </Paragraph>
        </Col>
        <Col>
          <Space>
            <Button icon={<DownloadOutlined />} onClick={() => handleGenerateReport('Daily')}>
              Export Data
            </Button>
            <Button icon={<FilePdfOutlined />} onClick={() => handleGenerateReport('Monthly')}>
              Risk Report
            </Button>
            <Button
              type="primary"
              icon={<AlertOutlined />}
              onClick={() => setStressTestModalOpen(true)}
            >
              Run Stress Test
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Alerts */}
      {breachCount > 0 && (
        <Alert
          message="Risk Limit Breach Detected"
          description={`${breachCount} risk limit(s) have been breached. Immediate action required.`}
          type="error"
          icon={<ExclamationCircleOutlined />}
          showIcon
          closable
        />
      )}

      {/* Market Risk Metrics */}
      <Card title={<Space><LineChartOutlined />Market Risk Metrics</Space>}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Row justify="space-between">
                  <Text type="secondary">VaR Method</Text>
                  <Select
                    value={varMethod}
                    onChange={setVarMethod}
                    size="small"
                    style={{ width: 120 }}
                  >
                    <Select.Option value="historical">Historical</Select.Option>
                    <Select.Option value="parametric">Parametric</Select.Option>
                    <Select.Option value="montecarlo">Monte Carlo</Select.Option>
                  </Select>
                </Row>
                <Row justify="space-between">
                  <Text type="secondary">Confidence Level</Text>
                  <Select
                    value={confidenceLevel}
                    onChange={setConfidenceLevel}
                    size="small"
                    style={{ width: 80 }}
                  >
                    <Select.Option value={95}>95%</Select.Option>
                    <Select.Option value={99}>99%</Select.Option>
                  </Select>
                </Row>
                <Row justify="space-between">
                  <Text type="secondary">Time Horizon</Text>
                  <Select
                    value={timeHorizon}
                    onChange={setTimeHorizon}
                    size="small"
                    style={{ width: 80 }}
                  >
                    <Select.Option value={1}>1-day</Select.Option>
                    <Select.Option value={10}>10-day</Select.Option>
                  </Select>
                </Row>
              </Space>
            </Card>
          </Col>
          <Col xs={24} md={16}>
            <Row gutter={[16, 16]}>
              <Col xs={12} md={8}>
                <Statistic
                  title="Value at Risk"
                  value={currentVaR}
                  prefix="$"
                  valueStyle={{ color: '#ff4d4f' }}
                  suffix={
                    <Tooltip title={`${confidenceLevel}% confidence, ${timeHorizon}-day horizon`}>
                      <ExclamationCircleOutlined style={{ fontSize: 14 }} />
                    </Tooltip>
                  }
                />
              </Col>
              <Col xs={12} md={8}>
                <Statistic
                  title="Conditional VaR"
                  value={mockMarketRiskMetrics.cvar}
                  prefix="$"
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Col>
              <Col xs={12} md={8}>
                <Statistic
                  title="Beta"
                  value={mockMarketRiskMetrics.beta}
                  precision={2}
                  valueStyle={{ color: mockMarketRiskMetrics.beta > 1 ? '#ff4d4f' : '#52c41a' }}
                />
              </Col>
              <Col xs={12} md={8}>
                <Statistic
                  title="Volatility"
                  value={mockMarketRiskMetrics.volatility * 100}
                  precision={1}
                  suffix="%"
                  valueStyle={{ color: '#faad14' }}
                />
              </Col>
              <Col xs={12} md={8}>
                <Statistic
                  title="Sharpe Ratio"
                  value={mockMarketRiskMetrics.sharpeRatio}
                  precision={2}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col xs={12} md={8}>
                <Statistic
                  title="Max Drawdown"
                  value={Math.abs(mockMarketRiskMetrics.maxDrawdown) * 100}
                  precision={1}
                  suffix="%"
                  prefix="-"
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      {/* VaR Breakdown and Volatility */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="VaR Breakdown by Asset">
            <Column {...varBreakdownChartConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Historical Volatility (Annualized)">
            <Line {...volatilityHistoryConfig} />
          </Card>
        </Col>
      </Row>

      {/* Tabs for different risk categories */}
      <Card>
        <Tabs
          defaultActiveKey="stress"
          items={[
            {
              key: 'stress',
              label: 'Stress Testing',
              children: (
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Alert
                    message="Stress Test Scenarios"
                    description="Analyze portfolio performance under adverse market conditions"
                    type="info"
                    showIcon
                  />
                  <Table
                    dataSource={mockStressScenarios}
                    columns={stressScenarioColumns}
                    rowKey="name"
                    pagination={false}
                  />
                </Space>
              ),
            },
            {
              key: 'concentration',
              label: 'Concentration Risk',
              children: (
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={12}>
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                      <Card title="Concentration Metrics" size="small">
                        <Descriptions column={1} bordered size="small">
                          <Descriptions.Item label="Largest Position">
                            <Space>
                              <Text strong>{mockConcentrationMetrics.largestPosition.asset}</Text>
                              <Tag color="warning">
                                {mockConcentrationMetrics.largestPosition.weight}%
                              </Tag>
                            </Space>
                          </Descriptions.Item>
                          <Descriptions.Item label="Top 5 Holdings Weight">
                            {mockConcentrationMetrics.top5Weight}%
                          </Descriptions.Item>
                          <Descriptions.Item label="Herfindahl Index">
                            {mockConcentrationMetrics.herfindahlIndex.toFixed(4)}
                          </Descriptions.Item>
                          <Descriptions.Item label="Concentration Breaches">
                            <Tag color={mockConcentrationMetrics.breaches > 0 ? 'error' : 'success'}>
                              {mockConcentrationMetrics.breaches}
                            </Tag>
                          </Descriptions.Item>
                        </Descriptions>
                      </Card>

                      {mockConcentrationMetrics.breaches > 0 && (
                        <Alert
                          message="Concentration Limit Breach"
                          description={`${mockConcentrationMetrics.largestPosition.asset} position (${mockConcentrationMetrics.largestPosition.weight}%) exceeds maximum single position limit of 40%`}
                          type="error"
                          showIcon
                        />
                      )}
                    </Space>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="Portfolio Concentration" size="small">
                      <Pie {...concentrationPieConfig} />
                    </Card>
                  </Col>
                </Row>
              ),
            },
            {
              key: 'liquidity',
              label: 'Liquidity Risk',
              children: (
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={6}>
                    <Card>
                      <Statistic
                        title="Liquid Assets"
                        value={mockLiquidityMetrics.liquidAssetsPercent}
                        suffix="%"
                        valueStyle={{ color: '#52c41a' }}
                      />
                      <Progress
                        percent={mockLiquidityMetrics.liquidAssetsPercent}
                        status="success"
                        showInfo={false}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} md={6}>
                    <Card>
                      <Statistic
                        title="Liquidity Ratio"
                        value={mockLiquidityMetrics.liquidityRatio}
                        precision={2}
                        valueStyle={{ color: '#1890ff' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} md={6}>
                    <Card>
                      <Statistic
                        title="Days to Liquidate 100%"
                        value={mockLiquidityMetrics.daysToLiquidate}
                        suffix="days"
                        valueStyle={{ color: '#faad14' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} md={6}>
                    <Card>
                      <Statistic
                        title="Redemption Coverage"
                        value={mockLiquidityMetrics.redemptionCoverage}
                        suffix="days"
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24}>
                    <Card title="Liquidity Analysis" size="small">
                      <Descriptions column={2} bordered>
                        <Descriptions.Item label="Can Sell in 1 Day">
                          ${((mockLiquidityMetrics.liquidAssetsPercent / 100) * 10000000).toLocaleString()}
                        </Descriptions.Item>
                        <Descriptions.Item label="Illiquid Assets">
                          ${((1 - mockLiquidityMetrics.liquidAssetsPercent / 100) * 10000000).toLocaleString()}
                        </Descriptions.Item>
                        <Descriptions.Item label="Average Daily Volume">
                          $3,500,000
                        </Descriptions.Item>
                        <Descriptions.Item label="Market Impact (est.)">
                          0.15% - Low
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                  </Col>
                </Row>
              ),
            },
            {
              key: 'limits',
              label: 'Limit Monitoring',
              children: (
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Row gutter={16}>
                    <Col span={8}>
                      <StatCard
                        title="Total Limits"
                        value={mockRiskLimits.length}
                        icon={<SafetyOutlined />}
                      />
                    </Col>
                    <Col span={8}>
                      <Card>
                        <Statistic
                          title="Warnings"
                          value={warningCount}
                          valueStyle={{ color: '#faad14' }}
                          prefix={<WarningOutlined />}
                        />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card>
                        <Statistic
                          title="Breaches"
                          value={breachCount}
                          valueStyle={{ color: '#ff4d4f' }}
                          prefix={<ExclamationCircleOutlined />}
                        />
                      </Card>
                    </Col>
                  </Row>
                  <Table
                    dataSource={mockRiskLimits}
                    columns={riskLimitsColumns}
                    rowKey="name"
                    pagination={false}
                  />
                </Space>
              ),
            },
          ]}
        />
      </Card>

      {/* Stress Test Modal */}
      <Modal
        title="Custom Stress Test"
        open={stressTestModalOpen}
        onCancel={() => setStressTestModalOpen(false)}
        onOk={handleRunStressTest}
        width={700}
        okText="Run Stress Test"
      >
        <Form form={customScenarioForm} layout="vertical">
          <Form.Item
            name="scenarioName"
            label="Scenario Name"
            rules={[{ required: true, message: 'Please enter scenario name' }]}
          >
            <Select placeholder="Select or create custom scenario">
              <Select.Option value="crash">Market Crash (-20%)</Select.Option>
              <Select.Option value="rate-spike">Interest Rate Spike (+200bps)</Select.Option>
              <Select.Option value="crypto-winter">Crypto Winter (-50%)</Select.Option>
              <Select.Option value="custom">Custom Scenario</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.scenarioName !== currentValues.scenarioName
            }
          >
            {({ getFieldValue }) => {
              const scenarioName = getFieldValue('scenarioName');
              return (
                scenarioName === 'custom' && (
                  <>
                    <Form.Item
                      name="btcImpact"
                      label="BTC Impact (%)"
                      rules={[{ required: true, message: 'Please enter BTC impact' }]}
                      initialValue={-10}
                    >
                      <InputNumber
                        min={-100}
                        max={100}
                        suffix="%"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                    <Form.Item
                      name="ethImpact"
                      label="ETH Impact (%)"
                      rules={[{ required: true, message: 'Please enter ETH impact' }]}
                      initialValue={-10}
                    >
                      <InputNumber
                        min={-100}
                        max={100}
                        suffix="%"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                    <Form.Item
                      name="altcoinImpact"
                      label="Altcoin Impact (%)"
                      rules={[{ required: true, message: 'Please enter altcoin impact' }]}
                      initialValue={-15}
                    >
                      <InputNumber
                        min={-100}
                        max={100}
                        suffix="%"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </>
                )
              );
            }}
          </Form.Item>

          <Alert
            message="Stress Test Impact"
            description="The stress test will calculate the portfolio impact under the selected scenario and show which positions are most vulnerable."
            type="info"
            showIcon
            style={{ marginTop: 16 }}
          />
        </Form>
      </Modal>
    </Space>
  );
};

export default RiskDashboardPage;
