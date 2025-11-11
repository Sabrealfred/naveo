import { useMemo, useState, useEffect } from 'react';
import {
  Button,
  Card,
  Col,
  List,
  Row,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
  Statistic,
  Progress,
  Tooltip,
  Select,
  DatePicker,
  message,
  Spin,
} from 'antd';
import {
  WalletOutlined,
  RiseOutlined,
  FallOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  TrendingUpOutlined,
  LineChartOutlined,
  InfoCircleOutlined,
  BarChartOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { Line, Pie, Column, Heatmap, DualAxes, Area } from '@ant-design/charts';
import { StatCard } from '../../../components/common';
import { useTranslation } from 'react-i18next';
import { portfolioService, fundsService, transactionsService, reportsService } from '../../../services';
import type { PortfolioHolding, NavHistory } from '../../../services/types';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface AdvancedMetrics {
  sharpeRatio: number;
  volatility: number;
  maxDrawdown: number;
  beta: number;
  alpha: number;
  informationRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
}

interface NAVData {
  date: string;
  nav: number;
  fund: string;
  change: number;
  changePercent: number;
}

interface ContributionData {
  fund: string;
  contribution: number;
  contributionPercent: number;
}

interface CorrelationData {
  fund1: string;
  fund2: string;
  correlation: number;
}

const PortfolioPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [rawNavHistory, setRawNavHistory] = useState<Record<string, NavHistory[]>>({});
  const [period, setPeriod] = useState('1Y');
  const [selectedMetric, setSelectedMetric] = useState<'value' | 'return' | 'risk'>('value');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  // Mock user ID (replace with auth context)
  const userId = '10000000-0000-0000-0000-000000000001';

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    try {
      setLoading(true);

      // Load portfolio holdings
      const portfolioHoldings = await portfolioService.getPortfolioHoldings(userId);
      setHoldings(portfolioHoldings);

      // Load NAV history for each fund (last 24 months)
      const navHistoryMap: Record<string, NavHistory[]> = {};
      const startDate = dayjs().subtract(24, 'months').format('YYYY-MM-DD');
      const endDate = dayjs().format('YYYY-MM-DD');

      await Promise.all(
        portfolioHoldings.map(async (holding) => {
          if (holding.fund_id) {
            try {
              const history = await reportsService.getNavHistory(
                holding.fund_id,
                startDate,
                endDate
              );
              navHistoryMap[holding.fund_id] = history;
            } catch (error) {
              console.error(`Error loading NAV history for fund ${holding.fund_id}:`, error);
              // Don't fail the whole load if one fund's history fails
            }
          }
        })
      );

      setRawNavHistory(navHistoryMap);

    } catch (error: any) {
      console.error('Error loading portfolio:', error);
      message.error('Failed to load portfolio data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate advanced metrics
  const advancedMetrics = useMemo((): AdvancedMetrics => {
    // In real implementation, calculate from historical data
    // For now, using mock calculations

    const returns = holdings.map(h => h.return_percentage || 0);
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    const volatility = Math.sqrt(variance);

    // Risk-free rate (assumed 4%)
    const riskFreeRate = 4.0;

    // Sharpe Ratio = (Portfolio Return - Risk Free Rate) / Volatility
    const sharpeRatio = volatility > 0 ? (avgReturn - riskFreeRate) / volatility : 0;

    // Mock other metrics (in production, calculate from real data)
    const maxDrawdown = -8.5; // Maximum peak-to-trough decline
    const beta = 0.92; // Volatility relative to market
    const alpha = 2.3; // Excess return vs benchmark
    const informationRatio = 0.65; // Risk-adjusted active return
    const sortinoRatio = 1.8; // Return vs downside risk
    const calmarRatio = 1.2; // Return vs maximum drawdown

    return {
      sharpeRatio,
      volatility,
      maxDrawdown,
      beta,
      alpha,
      informationRatio,
      sortinoRatio,
      calmarRatio,
    };
  }, [holdings]);

  // Generate detailed NAV history from real data or fallback to estimated
  const navHistory = useMemo((): NAVData[] => {
    const data: NAVData[] = [];

    holdings.forEach(holding => {
      if (!holding.fund_id) return;

      const history = rawNavHistory[holding.fund_id];

      if (history && history.length > 0) {
        // Use real NAV history from database
        history.forEach((navEntry, index) => {
          const prevNav = index > 0 ? history[index - 1].nav : navEntry.nav;
          const change = navEntry.nav - prevNav;
          const changePercent = prevNav > 0 ? (change / prevNav) * 100 : 0;

          data.push({
            date: dayjs(navEntry.calculation_date).format('YYYY-MM'),
            nav: navEntry.nav,
            fund: holding.fund_name || 'Unknown Fund',
            change,
            changePercent,
          });
        });
      } else {
        // Fallback to estimated data if no history available
        const months = 24;
        const currentNav = holding.current_nav || 100;
        const avgGrowth = ((holding.return_percentage || 0) / 100) / months;

        for (let i = months; i >= 0; i--) {
          const date = dayjs().subtract(i, 'month').format('YYYY-MM');
          const historicalNav = currentNav / Math.pow(1 + avgGrowth, i);
          const prevNav = i < months ? historicalNav * 0.98 : historicalNav;

          data.push({
            date,
            nav: historicalNav,
            fund: holding.fund_name || 'Unknown Fund',
            change: historicalNav - prevNav,
            changePercent: ((historicalNav - prevNav) / prevNav) * 100,
          });
        }
      }
    });

    return data.sort((a, b) => a.date.localeCompare(b.date));
  }, [holdings, rawNavHistory]);

  // Calculate contribution to return
  const contributionData = useMemo((): ContributionData[] => {
    const totalValue = holdings.reduce((sum, h) => sum + (h.current_value || 0), 0);

    return holdings.map(h => {
      const contribution = (h.unrealized_pnl || 0);
      const contributionPercent = totalValue > 0 ? (contribution / totalValue) * 100 : 0;

      return {
        fund: h.fund_name || 'Unknown',
        contribution,
        contributionPercent,
      };
    }).sort((a, b) => b.contribution - a.contribution);
  }, [holdings]);

  // Calculate correlation matrix (mock data - in production, calculate from returns)
  const correlationData = useMemo((): CorrelationData[] => {
    const data: CorrelationData[] = [];

    for (let i = 0; i < holdings.length; i++) {
      for (let j = i + 1; j < holdings.length; j++) {
        // Mock correlation (in production, calculate from actual returns)
        const correlation = 0.3 + Math.random() * 0.6;

        data.push({
          fund1: holdings[i].fund_name || `Fund ${i + 1}`,
          fund2: holdings[j].fund_name || `Fund ${j + 1}`,
          correlation: parseFloat(correlation.toFixed(2)),
        });
      }
    }

    return data;
  }, [holdings]);

  // Performance vs Benchmark
  const benchmarkComparison = useMemo(() => {
    const months = 12;
    const data = [];

    for (let i = months; i >= 0; i--) {
      const date = dayjs().subtract(i, 'month').format('YYYY-MM');
      const portfolioReturn = 100 * Math.pow(1.015, months - i); // 15% annual return
      const benchmarkReturn = 100 * Math.pow(1.012, months - i); // 12% annual return (S&P 500 mock)

      data.push({
        date,
        portfolio: portfolioReturn,
        benchmark: benchmarkReturn,
      });
    }

    return data;
  }, []);

  // Metrics by fund
  const fundMetrics = useMemo(() => {
    return holdings.map(h => ({
      fund: h.fund_name || 'Unknown',
      value: h.current_value || 0,
      return: h.return_percentage || 0,
      volatility: 10 + Math.random() * 20, // Mock
      sharpe: 0.5 + Math.random() * 1.5, // Mock
      maxDrawdown: -5 - Math.random() * 15, // Mock
    }));
  }, [holdings]);

  const totalMetrics = useMemo(() => {
    const totalValue = holdings.reduce((sum, h) => sum + (h.current_value || 0), 0);
    const totalInvested = holdings.reduce((sum, h) => sum + (h.invested_amount || 0), 0);
    const totalReturn = totalValue - totalInvested;
    const totalReturnPercent = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;
    const availableBalance = 15250; // Mock

    return {
      totalValue,
      totalInvested,
      totalReturn,
      totalReturnPercent,
      availableBalance,
    };
  }, [holdings]);

  const holdingsColumns = [
    {
      title: t('investor.holdings.fund', 'Fund'),
      dataIndex: 'fund_name',
      key: 'fund_name',
      width: 200,
      fixed: 'left' as const,
      sorter: (a: PortfolioHolding, b: PortfolioHolding) =>
        (a.fund_name || '').localeCompare(b.fund_name || ''),
    },
    {
      title: <Tooltip title="Number of shares owned"><Text>Shares <InfoCircleOutlined /></Text></Tooltip>,
      dataIndex: 'shares',
      key: 'shares',
      render: (val: number | null) => val?.toFixed(4) || '0',
      sorter: (a: PortfolioHolding, b: PortfolioHolding) =>
        (a.shares || 0) - (b.shares || 0),
    },
    {
      title: <Tooltip title="Average purchase price per share"><Text>Avg Price <InfoCircleOutlined /></Text></Tooltip>,
      dataIndex: 'avg_purchase_price',
      key: 'avg_purchase_price',
      render: (val: number | null) => `$${(val || 0).toFixed(2)}`,
      sorter: (a: PortfolioHolding, b: PortfolioHolding) =>
        (a.avg_purchase_price || 0) - (b.avg_purchase_price || 0),
    },
    {
      title: <Tooltip title="Current Net Asset Value per share"><Text>Current NAV <InfoCircleOutlined /></Text></Tooltip>,
      dataIndex: 'current_nav',
      key: 'current_nav',
      render: (val: number | null) => `$${(val || 0).toFixed(2)}`,
      sorter: (a: PortfolioHolding, b: PortfolioHolding) =>
        (a.current_nav || 0) - (b.current_nav || 0),
    },
    {
      title: <Tooltip title="Total current value of holding"><Text>Current Value <InfoCircleOutlined /></Text></Tooltip>,
      dataIndex: 'current_value',
      key: 'current_value',
      render: (val: number | null) => `$${(val || 0).toLocaleString()}`,
      sorter: (a: PortfolioHolding, b: PortfolioHolding) =>
        (a.current_value || 0) - (b.current_value || 0),
    },
    {
      title: <Tooltip title="Unrealized profit/loss"><Text>P&L <InfoCircleOutlined /></Text></Tooltip>,
      dataIndex: 'unrealized_pnl',
      key: 'unrealized_pnl',
      render: (val: number | null) => {
        const value = val || 0;
        return (
          <Tag color={value >= 0 ? 'green' : 'volcano'}>
            {value >= 0 ? '+' : '-'}${Math.abs(value).toLocaleString()}
          </Tag>
        );
      },
      sorter: (a: PortfolioHolding, b: PortfolioHolding) =>
        (a.unrealized_pnl || 0) - (b.unrealized_pnl || 0),
    },
    {
      title: <Tooltip title="Return percentage"><Text>Return % <InfoCircleOutlined /></Text></Tooltip>,
      dataIndex: 'return_percentage',
      key: 'return_percentage',
      render: (val: number | null) => {
        const value = val || 0;
        return (
          <Tag color={value >= 0 ? 'green' : 'volcano'}>
            {value >= 0 ? '+' : ''}{value.toFixed(2)}%
          </Tag>
        );
      },
      sorter: (a: PortfolioHolding, b: PortfolioHolding) =>
        (a.return_percentage || 0) - (b.return_percentage || 0),
    },
    {
      title: <Tooltip title="Portfolio allocation percentage"><Text>Weight % <InfoCircleOutlined /></Text></Tooltip>,
      key: 'weight',
      render: (_: any, record: PortfolioHolding) => {
        const weight = ((record.current_value || 0) / totalMetrics.totalValue) * 100;
        return (
          <Space direction="vertical" size={0}>
            <Text>{weight.toFixed(1)}%</Text>
            <Progress percent={weight} showInfo={false} size="small" />
          </Space>
        );
      },
    },
    {
      title: t('common.actions', 'Actions'),
      key: 'actions',
      fixed: 'right' as const,
      width: 200,
      render: (_: any, record: PortfolioHolding) => (
        <Space>
          <Button size="small" type="primary" icon={<ShoppingCartOutlined />}>
            Buy
          </Button>
          <Button size="small" icon={<DollarOutlined />}>
            Sell
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" tip="Loading portfolio analytics..." />
      </div>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Portfolio Analytics
          </Title>
          <Text type="secondary">
            Advanced insights and performance metrics
          </Text>
        </div>
        <Space>
          <Select
            value={selectedMetric}
            onChange={setSelectedMetric}
            style={{ width: 150 }}
            options={[
              { value: 'value', label: 'Value Metrics' },
              { value: 'return', label: 'Return Metrics' },
              { value: 'risk', label: 'Risk Metrics' },
            ]}
          />
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)}
            presets={[
              { label: 'Last 7 Days', value: [dayjs().subtract(7, 'd'), dayjs()] },
              { label: 'Last 30 Days', value: [dayjs().subtract(30, 'd'), dayjs()] },
              { label: 'Last 90 Days', value: [dayjs().subtract(90, 'd'), dayjs()] },
              { label: 'Last Year', value: [dayjs().subtract(1, 'year'), dayjs()] },
            ]}
          />
        </Space>
      </div>

      {/* Key Metrics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Portfolio Value"
            value={`$${totalMetrics.totalValue.toLocaleString()}`}
            icon={<WalletOutlined />}
            color="#4f6bed"
            trend={totalMetrics.totalReturn >= 0 ? 'up' : 'down'}
            trendValue={totalMetrics.totalReturnPercent}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Return"
            value={`$${Math.abs(totalMetrics.totalReturn).toLocaleString()}`}
            icon={totalMetrics.totalReturn >= 0 ? <RiseOutlined /> : <FallOutlined />}
            color={totalMetrics.totalReturn >= 0 ? '#52c41a' : '#ff4d4f'}
            trend={totalMetrics.totalReturn >= 0 ? 'up' : 'down'}
            trendValue={totalMetrics.totalReturnPercent}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={<Space><Text>Sharpe Ratio</Text><Tooltip title="Risk-adjusted return (>1 is good)"><InfoCircleOutlined /></Tooltip></Space>}
              value={advancedMetrics.sharpeRatio}
              precision={2}
              valueStyle={{ color: advancedMetrics.sharpeRatio > 1 ? '#3f8600' : '#cf1322' }}
              prefix={<LineChartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={<Space><Text>Volatility</Text><Tooltip title="Standard deviation of returns"><InfoCircleOutlined /></Tooltip></Space>}
              value={advancedMetrics.volatility}
              precision={2}
              suffix="%"
              valueStyle={{ color: advancedMetrics.volatility < 15 ? '#3f8600' : '#cf1322' }}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Advanced Risk Metrics */}
      <Card title={<Space><TrendingUpOutlined /> Advanced Risk Metrics</Space>}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title={<Tooltip title="Volatility relative to market"><Text>Beta</Text></Tooltip>}
              value={advancedMetrics.beta}
              precision={2}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title={<Tooltip title="Excess return vs benchmark"><Text>Alpha</Text></Tooltip>}
              value={advancedMetrics.alpha}
              precision={2}
              suffix="%"
              valueStyle={{ color: advancedMetrics.alpha > 0 ? '#3f8600' : '#cf1322' }}
              prefix={advancedMetrics.alpha > 0 ? <RiseOutlined /> : <FallOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title={<Tooltip title="Maximum peak-to-trough decline"><Text>Max Drawdown</Text></Tooltip>}
              value={advancedMetrics.maxDrawdown}
              precision={2}
              suffix="%"
              valueStyle={{ color: '#cf1322' }}
              prefix={<FallOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title={<Tooltip title="Return vs downside risk"><Text>Sortino Ratio</Text></Tooltip>}
              value={advancedMetrics.sortinoRatio}
              precision={2}
              valueStyle={{ color: advancedMetrics.sortinoRatio > 1 ? '#3f8600' : '#cf1322' }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title={<Tooltip title="Risk-adjusted active return"><Text>Information Ratio</Text></Tooltip>}
              value={advancedMetrics.informationRatio}
              precision={2}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title={<Tooltip title="Return vs max drawdown"><Text>Calmar Ratio</Text></Tooltip>}
              value={advancedMetrics.calmarRatio}
              precision={2}
              valueStyle={{ color: advancedMetrics.calmarRatio > 1 ? '#3f8600' : '#cf1322' }}
            />
          </Col>
        </Row>
      </Card>

      {/* Performance Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <Card
            title="Portfolio vs Benchmark Performance"
            extra={
              <Tabs
                activeKey={period}
                onChange={setPeriod}
                items={[
                  { key: '1M', label: '1M' },
                  { key: '3M', label: '3M' },
                  { key: '6M', label: '6M' },
                  { key: '1Y', label: '1Y' },
                  { key: 'ALL', label: 'All' },
                ]}
              />
            }
          >
            <DualAxes
              height={350}
              data={[benchmarkComparison, benchmarkComparison]}
              xField="date"
              yField={['portfolio', 'benchmark']}
              geometryOptions={[
                {
                  geometry: 'line',
                  smooth: true,
                  color: '#5B8FF9',
                  lineStyle: { lineWidth: 3 },
                },
                {
                  geometry: 'line',
                  smooth: true,
                  color: '#5AD8A6',
                  lineStyle: { lineWidth: 2, lineDash: [4, 4] },
                },
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <Card title="Contribution to Return">
            <List
              dataSource={contributionData}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.fund}
                    description={
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Text>
                          <Tag color={item.contribution >= 0 ? 'green' : 'red'}>
                            {item.contribution >= 0 ? '+' : ''}${item.contribution.toLocaleString()}
                          </Tag>
                        </Text>
                        <Progress
                          percent={Math.abs(item.contributionPercent)}
                          status={item.contribution >= 0 ? 'success' : 'exception'}
                          size="small"
                        />
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* NAV History by Fund */}
      <Card title={<Space><LineChartOutlined /> Historical NAV by Fund</Space>}>
        <Line
          height={350}
          data={navHistory.slice(-288)} // Last 24 months * 12 data points per month
          xField="date"
          yField="nav"
          seriesField="fund"
          smooth
          legend={{ position: 'top' }}
          tooltip={{
            formatter: (datum) => ({
              name: datum.fund,
              value: `$${datum.nav.toFixed(2)} (${datum.changePercent >= 0 ? '+' : ''}${datum.changePercent.toFixed(2)}%)`,
            }),
          }}
        />
      </Card>

      {/* Fund Metrics Comparison */}
      <Card title="Fund Metrics Comparison">
        <Column
          height={350}
          data={fundMetrics}
          xField="fund"
          yField="return"
          seriesField="fund"
          label={{
            position: 'top',
            style: { fill: '#000000', opacity: 0.6 },
            formatter: (datum) => `${datum.return.toFixed(1)}%`,
          }}
          color={({ return: ret }) => ret >= 0 ? '#52c41a' : '#ff4d4f'}
        />
      </Card>

      {/* Holdings Table with Advanced Metrics */}
      <Card title={<Space><PieChartOutlined /> My Holdings - Detailed View</Space>}>
        <Table
          rowKey={(record) => record.portfolio_id}
          dataSource={holdings}
          columns={holdingsColumns}
          scroll={{ x: 1200 }}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Asset Allocation */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Current Asset Allocation">
            <Pie
              height={300}
              data={holdings.map(h => ({
                fund: h.fund_name || 'Unknown',
                value: h.current_value || 0,
              }))}
              angleField="value"
              colorField="fund"
              radius={0.9}
              innerRadius={0.6}
              label={{
                type: 'spider',
                labelHeight: 28,
                content: '{name}\n{percentage}',
              }}
              statistic={{
                title: { content: 'Total' },
                content: { content: `$${totalMetrics.totalValue.toLocaleString()}` },
              }}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Recommended Actions">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {contributionData.filter(d => d.contributionPercent < -2).length > 0 && (
                <Card type="inner" title="⚠️ Underperforming Assets" size="small">
                  <Text type="secondary">
                    {contributionData.filter(d => d.contributionPercent < -2).length} fund(s) are dragging down portfolio performance.
                    Consider rebalancing.
                  </Text>
                  <br />
                  <Button type="link" style={{ padding: 0, marginTop: 8 }}>Review Details →</Button>
                </Card>
              )}

              {advancedMetrics.volatility > 20 && (
                <Card type="inner" title="📊 High Volatility Alert" size="small">
                  <Text type="secondary">
                    Portfolio volatility is {advancedMetrics.volatility.toFixed(1)}%. Consider adding stable assets to reduce risk.
                  </Text>
                  <br />
                  <Button type="link" style={{ padding: 0, marginTop: 8 }}>Explore Stable Funds →</Button>
                </Card>
              )}

              <Card type="inner" title="💡 Optimization Opportunity" size="small">
                <Text type="secondary">
                  Based on your risk profile, we suggest increasing allocation to funds with Sharpe Ratio > 1.5.
                </Text>
                <br />
                <Button type="link" style={{ padding: 0, marginTop: 8 }}>See Recommendations →</Button>
              </Card>
            </Space>
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default PortfolioPage;
