import { useState, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Select,
  DatePicker,
  Space,
  Typography,
  Tag,
  Table,
  Divider,
} from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  TrophyOutlined,
  LineChartOutlined,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons';
import { Line, Column, Pie } from '@ant-design/charts';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import {
  MOCK_PERFORMANCE_SERIES,
  MOCK_ASSET_PERFORMANCE,
  MOCK_MONTHLY_RETURNS,
} from '../mockData';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface PerformanceData {
  date: string;
  portfolioReturn: number;
  benchmarkReturn: number;
  value: number;
}

interface AssetPerformance {
  asset: string;
  allocation: number;
  return: number;
  ytdReturn: number;
  contribution: number;
  risk: string;
}

export default function PerformanceAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('1y');
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

  // Mock performance data
  const performanceData: PerformanceData[] = MOCK_PERFORMANCE_SERIES;
  const assetPerformance: AssetPerformance[] = MOCK_ASSET_PERFORMANCE;
  const monthlyReturns = MOCK_MONTHLY_RETURNS;

  // Calculate metrics
  const metrics = useMemo(() => {
    const currentValue = 125000;
    const initialInvestment = 100000;
    const totalReturn = currentValue - initialInvestment;
    const returnPercentage = (totalReturn / initialInvestment) * 100;

    const returns = monthlyReturns.map((r) => r.return);
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance =
      returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    const volatility = Math.sqrt(variance);
    const sharpeRatio = avgReturn / volatility;

    return {
      currentValue,
      totalReturn,
      returnPercentage,
      ytdReturn: 25.0,
      monthReturn: 0.0,
      weekReturn: -0.5,
      volatility: volatility.toFixed(2),
      sharpeRatio: sharpeRatio.toFixed(2),
      maxDrawdown: -8.5,
      winRate: 72,
    };
  }, []);

  // Performance chart config
  const performanceChartConfig = {
    data: performanceData,
    xField: 'date',
    yField: 'portfolioReturn',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'wave-in',
        duration: 1000,
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: datum.type,
          value: `${datum.portfolioReturn.toFixed(2)}%`,
        };
      },
    },
    yAxis: {
      label: {
        formatter: (v: string) => `${v}%`,
      },
    },
    meta: {
      date: {
        alias: 'Month',
      },
      portfolioReturn: {
        alias: 'Portfolio Return',
      },
      benchmarkReturn: {
        alias: 'Benchmark Return',
      },
    },
  };

  // Line chart for cumulative returns
  const cumulativeReturnsConfig = {
    data: performanceData.flatMap((item) => [
      { date: item.date, value: item.portfolioReturn, category: 'Your Portfolio' },
      { date: item.date, value: item.benchmarkReturn, category: 'S&P 500 Benchmark' },
    ]),
    xField: 'date',
    yField: 'value',
    seriesField: 'category',
    smooth: true,
    color: ['#1890ff', '#52c41a'],
    legend: {
      position: 'top' as const,
    },
    yAxis: {
      label: {
        formatter: (v: string) => `${v}%`,
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: datum.category,
          value: `${datum.value.toFixed(2)}%`,
        };
      },
    },
  };

  // Monthly returns chart
  const monthlyReturnsConfig = {
    data: monthlyReturns,
    xField: 'month',
    yField: 'return',
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    color: (datum: any) => {
      return datum.return >= 0 ? '#52c41a' : '#ff4d4f';
    },
    yAxis: {
      label: {
        formatter: (v: string) => `${v}%`,
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: 'Monthly Return',
          value: `${datum.return.toFixed(2)}%`,
        };
      },
    },
  };

  // Asset allocation pie chart
  const allocationConfig = {
    data: assetPerformance,
    angleField: 'allocation',
    colorField: 'asset',
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      type: 'spider' as const,
      content: '{name}\n{percentage}',
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    statistic: {
      title: {
        content: 'Total',
      },
      content: {
        content: '100%',
      },
    },
  };

  const assetColumns: ColumnsType<AssetPerformance> = [
    {
      title: 'Asset',
      dataIndex: 'asset',
      key: 'asset',
      render: (asset: string) => <Text strong>{asset}</Text>,
    },
    {
      title: 'Allocation',
      dataIndex: 'allocation',
      key: 'allocation',
      render: (allocation: number) => `${allocation}%`,
      sorter: (a, b) => a.allocation - b.allocation,
    },
    {
      title: 'Return',
      dataIndex: 'return',
      key: 'return',
      render: (returnValue: number) => (
        <Text
          style={{
            color: returnValue >= 0 ? '#52c41a' : '#ff4d4f',
            fontWeight: 500,
          }}
        >
          {returnValue >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {returnValue.toFixed(2)}%
        </Text>
      ),
      sorter: (a, b) => a.return - b.return,
    },
    {
      title: 'YTD Return',
      dataIndex: 'ytdReturn',
      key: 'ytdReturn',
      render: (ytdReturn: number) => (
        <Text
          style={{
            color: ytdReturn >= 0 ? '#52c41a' : '#ff4d4f',
          }}
        >
          {ytdReturn.toFixed(2)}%
        </Text>
      ),
    },
    {
      title: 'Contribution',
      dataIndex: 'contribution',
      key: 'contribution',
      render: (contribution: number) => `${contribution.toFixed(2)}%`,
      sorter: (a, b) => a.contribution - b.contribution,
    },
    {
      title: 'Risk Level',
      dataIndex: 'risk',
      key: 'risk',
      render: (risk: string) => {
        const color =
          risk === 'Very Low' ? 'green' : risk === 'Low' ? 'blue' : risk === 'Medium' ? 'orange' : 'red';
        return <Tag color={color}>{risk}</Tag>;
      },
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <div>
          <Title level={2}>Performance Analytics</Title>
          <Text type="secondary">Detailed analysis of your portfolio performance</Text>
        </div>
        <Space>
          <Select
            value={selectedPeriod}
            onChange={setSelectedPeriod}
            style={{ width: 120 }}
          >
            <Select.Option value="1m">1 Month</Select.Option>
            <Select.Option value="3m">3 Months</Select.Option>
            <Select.Option value="6m">6 Months</Select.Option>
            <Select.Option value="1y">1 Year</Select.Option>
            <Select.Option value="ytd">YTD</Select.Option>
            <Select.Option value="all">All Time</Select.Option>
          </Select>
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs] | null)}
          />
        </Space>
      </div>

      {/* Key Metrics */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Return"
              value={metrics.returnPercentage}
              precision={2}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
              prefix={<ArrowUpOutlined />}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              ${metrics.totalReturn.toLocaleString()} gain
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="YTD Return"
              value={metrics.ytdReturn}
              precision={2}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
              prefix={<RiseOutlined />}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Year-to-date performance
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Sharpe Ratio"
              value={metrics.sharpeRatio}
              precision={2}
              valueStyle={{ color: '#1890ff' }}
              prefix={<TrophyOutlined />}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Risk-adjusted return
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Volatility"
              value={metrics.volatility}
              suffix="%"
              valueStyle={{ color: '#faad14' }}
              prefix={<LineChartOutlined />}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Annualized volatility
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Secondary Metrics */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="Month Return"
              value={metrics.monthReturn}
              precision={2}
              suffix="%"
              valueStyle={{ color: metrics.monthReturn >= 0 ? '#52c41a' : '#ff4d4f' }}
              prefix={metrics.monthReturn >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="Week Return"
              value={metrics.weekReturn}
              precision={2}
              suffix="%"
              valueStyle={{ color: metrics.weekReturn >= 0 ? '#52c41a' : '#ff4d4f' }}
              prefix={metrics.weekReturn >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="Max Drawdown"
              value={metrics.maxDrawdown}
              precision={2}
              suffix="%"
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<FallOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="Win Rate"
              value={metrics.winRate}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Cumulative Returns Chart */}
      <Card title="Cumulative Returns Comparison" style={{ marginBottom: '16px' }}>
        <Line {...cumulativeReturnsConfig} height={300} />
      </Card>

      {/* Monthly Returns Chart */}
      <Card title="Monthly Returns" style={{ marginBottom: '16px' }}>
        <Column {...monthlyReturnsConfig} height={250} />
      </Card>

      {/* Asset Allocation & Performance */}
      <Row gutter={16} style={{ marginBottom: '16px' }}>
        <Col xs={24} lg={10}>
          <Card title="Asset Allocation">
            <Pie {...allocationConfig} height={300} />
          </Card>
        </Col>
        <Col xs={24} lg={14}>
          <Card title="Asset Performance Breakdown">
            <Table
              columns={assetColumns}
              dataSource={assetPerformance}
              rowKey="asset"
              pagination={false}
              size="small"
            />
            <Divider />
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong>Total Portfolio Return:</Text>
                <Text
                  strong
                  style={{
                    color: '#52c41a',
                    fontSize: '16px',
                  }}
                >
                  <ArrowUpOutlined /> {metrics.returnPercentage.toFixed(2)}%
                </Text>
              </div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Your portfolio has outperformed the S&P 500 benchmark by{' '}
                {(metrics.returnPercentage - 14.2).toFixed(2)}% YTD
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
