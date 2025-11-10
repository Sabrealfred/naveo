import { Card, Col, Row, Statistic, Table, Tag, Progress } from 'antd';
import {
  DollarOutlined,
  RiseOutlined,
  FundProjectionScreenOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { Pie, Column } from '@ant-design/charts';
import { useTranslation } from 'react-i18next';
import { StatCard } from '../../../components/common';

export default function PortfolioManagementPage() {
  const { t } = useTranslation();
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

  return (
    <div style={{ padding: '24px', background: 'var(--color-background)' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
          {t('portfolio.title')}
        </h1>
        <p style={{ color: 'var(--color-secondary)', fontSize: '14px' }}>
          {t('portfolio.subtitle')}
        </p>
      </div>

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
            trend="up"
            trendValue={portfolioMetrics.bestPerformance}
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

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={16}>
          <Card title={t('portfolio.ytdPerformance')} bordered={false} className="professional-card">
            <Column {...performanceConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title={t('portfolio.allocation')} bordered={false} className="professional-card">
            <Pie {...allocationPieConfig} />
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
    </div>
  );
}
