import { useState } from 'react';
import { Card, Row, Col, Button, Table, Tag, Progress, Space, Alert, Statistic, Tabs, Badge, message } from 'antd';
import {
  RobotOutlined,
  ThunderboltOutlined,
  BulbOutlined,
  LineChartOutlined,
  SafetyOutlined,
  TeamOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import { Line, Column, Pie } from '@ant-design/charts';
import { useTranslation } from 'react-i18next';
import { StatCard } from '../../../components/common';

export default function AIStrategyManagementPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [optimizing, setOptimizing] = useState(false);

  // Mock AI insights data
  const aiInsights = {
    confidenceScore: 87, // % confidence in current strategy
    riskScore: 42, // Lower is better
    expectedReturn: 18.5, // % expected annual return
    optimizationOpportunities: 5,
    activeStrategies: 3,
    rebalanceRecommendations: 7,
  };

  // AI Recommendations for portfolio rebalancing
  const rebalanceRecommendations = [
    {
      id: 1,
      asset: 'BTC',
      action: 'reduce',
      current: 42,
      recommended: 38,
      difference: -4,
      reason: 'Overweight compared to optimal allocation',
      impact: 'Reduce risk by 2.3%',
      confidence: 89,
      priority: 'high',
    },
    {
      id: 2,
      asset: 'ETH',
      action: 'increase',
      current: 28,
      recommended: 32,
      difference: 4,
      reason: 'Underweight with strong growth signals',
      impact: 'Increase expected return by 1.8%',
      confidence: 85,
      priority: 'high',
    },
    {
      id: 3,
      asset: 'SOL',
      action: 'increase',
      current: 8,
      recommended: 12,
      difference: 4,
      reason: 'High momentum and positive correlation',
      impact: 'Diversification improvement',
      confidence: 76,
      priority: 'medium',
    },
    {
      id: 4,
      asset: 'Stablecoins',
      action: 'reduce',
      current: 10,
      recommended: 8,
      difference: -2,
      reason: 'Opportunity cost in bull market',
      impact: 'Free up capital for growth',
      confidence: 82,
      priority: 'medium',
    },
    {
      id: 5,
      asset: 'LINK',
      action: 'maintain',
      current: 6,
      recommended: 6,
      difference: 0,
      reason: 'Optimal allocation',
      impact: 'No action needed',
      confidence: 91,
      priority: 'low',
    },
  ];

  // Multi-Manager Strategy (MUM) coordination
  const mumStrategies = [
    {
      id: 1,
      strategyName: 'Conservative Growth',
      manager: 'AI Strategy Alpha',
      allocation: 40,
      status: 'active',
      performance: 12.5,
      riskLevel: 'low',
      assets: ['BTC', 'ETH', 'Stablecoins'],
      investors: 45,
    },
    {
      id: 2,
      strategyName: 'Aggressive DeFi',
      manager: 'AI Strategy Beta',
      allocation: 35,
      status: 'active',
      performance: 28.3,
      riskLevel: 'high',
      assets: ['ETH', 'SOL', 'MATIC', 'DeFi Tokens'],
      investors: 28,
    },
    {
      id: 3,
      strategyName: 'Balanced Diversified',
      manager: 'AI Strategy Gamma',
      allocation: 25,
      status: 'active',
      performance: 15.8,
      riskLevel: 'medium',
      assets: ['BTC', 'ETH', 'SOL', 'LINK', 'Stablecoins'],
      investors: 62,
    },
  ];

  // AI Performance predictions
  const performancePredictions = [
    { month: 'Current', actual: 100, predicted: 100 },
    { month: 'Month 1', actual: null, predicted: 103.5 },
    { month: 'Month 2', actual: null, predicted: 107.2 },
    { month: 'Month 3', actual: null, predicted: 110.8 },
    { month: 'Month 4', actual: null, predicted: 115.2 },
    { month: 'Month 5', actual: null, predicted: 118.9 },
    { month: 'Month 6', actual: null, predicted: 123.5 },
  ];

  // Risk analysis by asset
  const riskAnalysis = [
    { asset: 'BTC', risk: 35, return: 15.2, sharpe: 0.85 },
    { asset: 'ETH', risk: 42, return: 22.8, sharpe: 1.12 },
    { asset: 'SOL', risk: 58, return: 45.3, sharpe: 1.35 },
    { asset: 'Stablecoins', risk: 2, return: 4.5, sharpe: 0.35 },
    { asset: 'LINK', risk: 48, return: 18.7, sharpe: 0.92 },
  ];

  const rebalanceColumns = [
    {
      title: t('ai.asset'),
      dataIndex: 'asset',
      key: 'asset',
      render: (text: string) => <span style={{ fontWeight: 600 }}>{text}</span>,
    },
    {
      title: t('ai.action'),
      dataIndex: 'action',
      key: 'action',
      render: (action: string) => {
        const colors = { reduce: 'red', increase: 'green', maintain: 'blue' };
        const icons = { reduce: <ArrowDownOutlined />, increase: <ArrowUpOutlined />, maintain: <CheckCircleOutlined /> };
        return (
          <Tag color={colors[action as keyof typeof colors]} icon={icons[action as keyof typeof icons]}>
            {t(`ai.${action}`)}
          </Tag>
        );
      },
    },
    {
      title: t('ai.current'),
      dataIndex: 'current',
      key: 'current',
      render: (val: number) => `${val}%`,
    },
    {
      title: t('ai.recommended'),
      dataIndex: 'recommended',
      key: 'recommended',
      render: (val: number) => `${val}%`,
    },
    {
      title: t('ai.difference'),
      dataIndex: 'difference',
      key: 'difference',
      render: (val: number) => (
        <span style={{ color: val > 0 ? '#52c41a' : val < 0 ? '#f5222d' : '#666' }}>
          {val > 0 ? '+' : ''}{val}%
        </span>
      ),
    },
    {
      title: t('ai.confidence'),
      dataIndex: 'confidence',
      key: 'confidence',
      render: (val: number) => (
        <Progress
          percent={val}
          size="small"
          status={val >= 80 ? 'success' : 'active'}
          format={(percent) => `${percent}%`}
        />
      ),
    },
    {
      title: t('ai.priority'),
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        const colors = { high: 'red', medium: 'orange', low: 'blue' };
        return <Badge color={colors[priority as keyof typeof colors]} text={t(`ai.${priority}`)} />;
      },
    },
    {
      title: t('ai.impact'),
      dataIndex: 'impact',
      key: 'impact',
    },
  ];

  const mumColumns = [
    {
      title: t('ai.strategyName'),
      dataIndex: 'strategyName',
      key: 'strategyName',
      render: (text: string) => <span style={{ fontWeight: 600 }}>{text}</span>,
    },
    {
      title: t('ai.manager'),
      dataIndex: 'manager',
      key: 'manager',
      render: (text: string) => (
        <Space>
          <RobotOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: t('ai.allocation'),
      dataIndex: 'allocation',
      key: 'allocation',
      render: (val: number) => `${val}%`,
    },
    {
      title: t('ai.performance'),
      dataIndex: 'performance',
      key: 'performance',
      render: (val: number) => (
        <span style={{ color: val >= 15 ? '#52c41a' : '#faad14' }}>
          +{val}%
        </span>
      ),
      sorter: (a: any, b: any) => a.performance - b.performance,
    },
    {
      title: t('ai.riskLevel'),
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      render: (level: string) => {
        const colors = { low: 'green', medium: 'orange', high: 'red' };
        return <Tag color={colors[level as keyof typeof colors]}>{t(`ai.${level}`)}</Tag>;
      },
    },
    {
      title: t('ai.investors'),
      dataIndex: 'investors',
      key: 'investors',
    },
    {
      title: t('ai.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'default'} icon={<CheckCircleOutlined />}>
          {t(`ai.${status}`)}
        </Tag>
      ),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" size="small">{t('ai.optimize')}</Button>
          <Button type="link" size="small">{t('ai.viewDetails')}</Button>
        </Space>
      ),
    },
  ];

  const riskColumns = [
    {
      title: t('ai.asset'),
      dataIndex: 'asset',
      key: 'asset',
      render: (text: string) => <span style={{ fontWeight: 600 }}>{text}</span>,
    },
    {
      title: t('ai.riskScore'),
      dataIndex: 'risk',
      key: 'risk',
      render: (val: number) => (
        <Progress
          percent={val}
          size="small"
          strokeColor={val > 50 ? '#f5222d' : val > 30 ? '#faad14' : '#52c41a'}
          format={(percent) => `${percent}`}
        />
      ),
      sorter: (a: any, b: any) => a.risk - b.risk,
    },
    {
      title: t('ai.expectedReturn'),
      dataIndex: 'return',
      key: 'return',
      render: (val: number) => `${val}%`,
      sorter: (a: any, b: any) => a.return - b.return,
    },
    {
      title: t('ai.sharpeRatio'),
      dataIndex: 'sharpe',
      key: 'sharpe',
      render: (val: number) => (
        <span style={{ color: val >= 1 ? '#52c41a' : '#faad14' }}>
          {val.toFixed(2)}
        </span>
      ),
      sorter: (a: any, b: any) => a.sharpe - b.sharpe,
    },
  ];

  const predictionConfig = {
    data: performancePredictions.map(p => ({
      ...p,
      actual: p.actual || null,
      predicted: p.predicted || null,
    })),
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    lineStyle: (datum: any) => {
      if (datum.type === 'predicted') {
        return {
          lineDash: [4, 4],
          opacity: 0.8,
        };
      }
      return { opacity: 1 };
    },
    point: {
      size: 5,
      shape: 'circle',
    },
    legend: {
      position: 'top' as const,
    },
    yAxis: {
      label: {
        formatter: (v: string) => `${v}%`,
      },
    },
  };

  const riskReturnConfig = {
    data: riskAnalysis,
    xField: 'risk',
    yField: 'return',
    colorField: 'asset',
    size: 15,
    shape: 'circle',
    legend: {
      position: 'top' as const,
    },
    xAxis: {
      title: {
        text: t('ai.riskScore'),
      },
    },
    yAxis: {
      title: {
        text: t('ai.expectedReturn'),
      },
      label: {
        formatter: (v: string) => `${v}%`,
      },
    },
    label: {
      content: (datum: any) => datum.asset,
      style: {
        fontSize: 12,
        fontWeight: 600,
      },
    },
  };

  const handleOptimizeAll = () => {
    setOptimizing(true);
    setTimeout(() => {
      setOptimizing(false);
      message.success(t('ai.optimizationComplete'));
    }, 3000);
  };

  const handleApplyRecommendation = (recommendation: any) => {
    message.success(t('ai.recommendationApplied', { asset: recommendation.asset }));
  };

  return (
    <div className="ai-strategy-management-page">
      {/* Page Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col>
          <h1 style={{ fontSize: '28px', fontWeight: 700, margin: 0 }}>
            <RobotOutlined style={{ marginRight: '12px', color: '#722ed1' }} />
            {t('ai.title')}
          </h1>
          <p style={{ color: '#666', marginTop: '8px', marginBottom: 0 }}>
            {t('ai.subtitle')}
          </p>
        </Col>
        <Col>
          <Space>
            <Button
              type="primary"
              icon={<ThunderboltOutlined />}
              size="large"
              loading={optimizing}
              onClick={handleOptimizeAll}
            >
              {t('ai.optimizeAll')}
            </Button>
            <Button icon={<SyncOutlined />} size="large">
              {t('ai.refresh')}
            </Button>
          </Space>
        </Col>
      </Row>

      {/* AI Insights Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title={t('ai.confidenceScore')}
            value={`${aiInsights.confidenceScore}%`}
            icon={<CheckCircleOutlined />}
            color="#52c41a"
            trend={{ value: 5, isPositive: true }}
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title={t('ai.riskScore')}
            value={aiInsights.riskScore}
            icon={<SafetyOutlined />}
            color="#faad14"
            trend={{ value: 3, isPositive: false }}
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title={t('ai.expectedReturn')}
            value={`${aiInsights.expectedReturn}%`}
            icon={<LineChartOutlined />}
            color="#722ed1"
            trend={{ value: 2.3, isPositive: true }}
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title={t('ai.activeStrategies')}
            value={aiInsights.activeStrategies}
            icon={<TeamOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title={t('ai.rebalanceOpportunities')}
            value={aiInsights.rebalanceRecommendations}
            icon={<BulbOutlined />}
            color="#fa8c16"
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title={t('ai.optimizationOpportunities')}
            value={aiInsights.optimizationOpportunities}
            icon={<ThunderboltOutlined />}
            color="#eb2f96"
          />
        </Col>
      </Row>

      {/* Alert for high priority recommendations */}
      {rebalanceRecommendations.filter(r => r.priority === 'high').length > 0 && (
        <Alert
          message={t('ai.highPriorityAlert')}
          description={t('ai.highPriorityDescription', {
            count: rebalanceRecommendations.filter(r => r.priority === 'high').length,
          })}
          type="warning"
          icon={<WarningOutlined />}
          showIcon
          closable
          style={{ marginBottom: '24px' }}
          action={
            <Button size="small" type="primary" onClick={handleOptimizeAll}>
              {t('ai.reviewNow')}
            </Button>
          }
        />
      )}

      {/* Tabs for different AI sections */}
      <Card className="professional-card">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'overview',
              label: (
                <span>
                  <LineChartOutlined />
                  {t('ai.overview')}
                </span>
              ),
              children: (
                <div>
                  {/* Performance Predictions */}
                  <Card
                    title={t('ai.performancePredictions')}
                    extra={<Tag color="purple">{t('ai.aiPowered')}</Tag>}
                    style={{ marginBottom: '24px' }}
                  >
                    <Line {...predictionConfig} height={300} />
                    <Alert
                      message={t('ai.predictionNote')}
                      description={t('ai.predictionDescription')}
                      type="info"
                      showIcon
                      style={{ marginTop: '16px' }}
                    />
                  </Card>

                  {/* Risk-Return Analysis */}
                  <Card title={t('ai.riskReturnAnalysis')}>
                    <Table
                      columns={riskColumns}
                      dataSource={riskAnalysis}
                      rowKey="asset"
                      pagination={false}
                    />
                  </Card>
                </div>
              ),
            },
            {
              key: 'rebalance',
              label: (
                <span>
                  <ThunderboltOutlined />
                  {t('ai.portfolioRebalancing')}
                  <Badge
                    count={rebalanceRecommendations.filter(r => r.priority === 'high').length}
                    style={{ marginLeft: '8px' }}
                  />
                </span>
              ),
              children: (
                <div>
                  <Alert
                    message={t('ai.rebalanceInfo')}
                    description={t('ai.rebalanceDescription')}
                    type="info"
                    showIcon
                    closable
                    style={{ marginBottom: '16px' }}
                  />
                  <Table
                    columns={rebalanceColumns}
                    dataSource={rebalanceRecommendations}
                    rowKey="id"
                    pagination={false}
                    expandable={{
                      expandedRowRender: (record) => (
                        <div style={{ padding: '16px', backgroundColor: '#fafafa' }}>
                          <Row gutter={16}>
                            <Col span={12}>
                              <strong>{t('ai.reason')}:</strong>
                              <p>{record.reason}</p>
                            </Col>
                            <Col span={12}>
                              <strong>{t('ai.expectedImpact')}:</strong>
                              <p>{record.impact}</p>
                              <Button
                                type="primary"
                                size="small"
                                onClick={() => handleApplyRecommendation(record)}
                              >
                                {t('ai.applyRecommendation')}
                              </Button>
                            </Col>
                          </Row>
                        </div>
                      ),
                    }}
                  />
                </div>
              ),
            },
            {
              key: 'mum',
              label: (
                <span>
                  <TeamOutlined />
                  {t('ai.mumStrategies')}
                </span>
              ),
              children: (
                <div>
                  <Alert
                    message={t('ai.mumInfo')}
                    description={t('ai.mumDescription')}
                    type="info"
                    showIcon
                    closable
                    style={{ marginBottom: '16px' }}
                  />
                  <Table
                    columns={mumColumns}
                    dataSource={mumStrategies}
                    rowKey="id"
                    pagination={false}
                    expandable={{
                      expandedRowRender: (record) => (
                        <div style={{ padding: '16px', backgroundColor: '#fafafa' }}>
                          <Row gutter={16}>
                            <Col span={8}>
                              <Statistic title={t('ai.assets')} value={record.assets.join(', ')} />
                            </Col>
                            <Col span={8}>
                              <Statistic title={t('ai.totalInvestors')} value={record.investors} />
                            </Col>
                            <Col span={8}>
                              <Statistic
                                title={t('ai.ytdReturn')}
                                value={record.performance}
                                suffix="%"
                                valueStyle={{ color: '#52c41a' }}
                              />
                            </Col>
                          </Row>
                        </div>
                      ),
                    }}
                  />
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
