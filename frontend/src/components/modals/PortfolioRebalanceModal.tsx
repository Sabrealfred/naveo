import { useState, useMemo } from 'react';
import {
  Modal,
  Steps,
  Button,
  Table,
  Row,
  Col,
  Tag,
  Progress,
  Alert,
  Space,
  Statistic,
  Card,
  Radio,
  Checkbox,
  message,
  Tooltip,
} from 'antd';
import {
  ThunderboltOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import { Column } from '@ant-design/charts';
import { useTranslation } from 'react-i18next';

interface RebalanceRecommendation {
  asset: string;
  current: number;
  recommended: number;
  difference: number;
  action: 'increase' | 'reduce' | 'maintain';
  reason: string;
  confidence: number;
  priority: 'high' | 'medium' | 'low';
  tradeAmount: number;
}

interface PortfolioRebalanceModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (values: any) => void;
  currentAllocations: Array<{
    asset: string;
    percentage: number;
    value: number;
  }>;
  totalValue?: number;
}

const PortfolioRebalanceModal: React.FC<PortfolioRebalanceModalProps> = ({
  visible,
  onClose,
  onSubmit,
  currentAllocations,
  totalValue = 85000000,
}) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [rebalanceMode, setRebalanceMode] = useState<'ai' | 'manual'>('ai');
  const [selectedRecommendations, setSelectedRecommendations] = useState<number[]>([]);
  const [riskTolerance, setRiskTolerance] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');

  // AI-generated rebalance recommendations
  const recommendations: RebalanceRecommendation[] = useMemo(() => {
    return [
      {
        asset: 'BTC',
        current: 42,
        recommended: 38,
        difference: -4,
        action: 'reduce',
        reason: t('ai.rebalance.btcOverweight'),
        confidence: 89,
        priority: 'high',
        tradeAmount: (totalValue * 0.04) / 1000000,
      },
      {
        asset: 'ETH',
        current: 28,
        recommended: 32,
        difference: 4,
        action: 'increase',
        reason: t('ai.rebalance.ethUnderweight'),
        confidence: 85,
        priority: 'high',
        tradeAmount: (totalValue * 0.04) / 1000000,
      },
      {
        asset: 'SOL',
        current: 8,
        recommended: 12,
        difference: 4,
        action: 'increase',
        reason: t('ai.rebalance.solOpportunity'),
        confidence: 76,
        priority: 'medium',
        tradeAmount: (totalValue * 0.04) / 1000000,
      },
      {
        asset: 'Stablecoins',
        current: 10,
        recommended: 8,
        difference: -2,
        action: 'reduce',
        reason: t('ai.rebalance.stablecoinExcess'),
        confidence: 82,
        priority: 'medium',
        tradeAmount: (totalValue * 0.02) / 1000000,
      },
      {
        asset: 'LINK',
        current: 6,
        recommended: 6,
        difference: 0,
        action: 'maintain',
        reason: t('ai.rebalance.linkOptimal'),
        confidence: 91,
        priority: 'low',
        tradeAmount: 0,
      },
    ];
  }, [totalValue, t]);

  const rebalanceColumns = [
    {
      title: (
        <Space>
          {t('ai.asset')}
          <Tooltip title={t('ai.rebalance.assetTooltip')}>
            <InfoCircleOutlined style={{ color: '#999' }} />
          </Tooltip>
        </Space>
      ),
      dataIndex: 'asset',
      key: 'asset',
      render: (text: string) => <span style={{ fontWeight: 600 }}>{text}</span>,
    },
    {
      title: t('ai.current'),
      dataIndex: 'current',
      key: 'current',
      render: (val: number) => `${val}%`,
    },
    {
      title: (
        <Space>
          {t('ai.recommended')}
          <Tooltip title={t('ai.rebalance.recommendedTooltip')}>
            <InfoCircleOutlined style={{ color: '#999' }} />
          </Tooltip>
        </Space>
      ),
      dataIndex: 'recommended',
      key: 'recommended',
      render: (val: number) => <span style={{ fontWeight: 600, color: '#722ed1' }}>{val}%</span>,
    },
    {
      title: t('ai.action'),
      dataIndex: 'action',
      key: 'action',
      render: (action: string) => {
        const configs = {
          reduce: { color: 'red', icon: <ArrowDownOutlined /> },
          increase: { color: 'green', icon: <ArrowUpOutlined /> },
          maintain: { color: 'blue', icon: <CheckCircleOutlined /> },
        };
        const config = configs[action as keyof typeof configs];
        return (
          <Tag color={config.color} icon={config.icon}>
            {t(`ai.${action}`)}
          </Tag>
        );
      },
    },
    {
      title: t('ai.tradeAmount'),
      dataIndex: 'tradeAmount',
      key: 'tradeAmount',
      render: (val: number) => `$${val.toFixed(2)}M`,
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
        return <Tag color={colors[priority as keyof typeof colors]}>{t(`ai.${priority}`)}</Tag>;
      },
    },
  ];

  const comparisonData = useMemo(() => {
    return recommendations.map(r => ({
      asset: r.asset,
      type: 'Current',
      value: r.current,
    })).concat(recommendations.map(r => ({
      asset: r.asset,
      type: 'Recommended',
      value: r.recommended,
    })));
  }, [recommendations]);

  const comparisonConfig = {
    data: comparisonData,
    xField: 'asset',
    yField: 'value',
    seriesField: 'type',
    isGroup: true,
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    label: {
      position: 'top' as const,
      formatter: (datum: any) => `${datum.value}%`,
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

  const impactMetrics = useMemo(() => {
    const highPriority = recommendations.filter(r => r.priority === 'high');
    const avgConfidence = recommendations.reduce((sum, r) => sum + r.confidence, 0) / recommendations.length;
    const totalTrades = recommendations.filter(r => r.action !== 'maintain').length;

    return {
      highPriorityChanges: highPriority.length,
      avgConfidence: avgConfidence.toFixed(1),
      totalTrades,
      estimatedImprovement: 12.5, // % improvement in risk-adjusted return
    };
  }, [recommendations]);

  const handleNext = () => {
    if (currentStep === 0 && rebalanceMode === 'ai' && selectedRecommendations.length === 0) {
      message.warning(t('ai.rebalance.selectAtLeastOne'));
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    const selectedRecs = recommendations.filter((_, index) => selectedRecommendations.includes(index));

    if (onSubmit) {
      onSubmit({
        mode: rebalanceMode,
        riskTolerance,
        recommendations: selectedRecs,
        timestamp: new Date().toISOString(),
      });
    }

    message.success(t('ai.rebalance.submitted'));
    handleClose();
  };

  const handleClose = () => {
    setCurrentStep(0);
    setSelectedRecommendations([]);
    setRebalanceMode('ai');
    onClose();
  };

  const handleSelectRecommendation = (index: number) => {
    if (selectedRecommendations.includes(index)) {
      setSelectedRecommendations(selectedRecommendations.filter(i => i !== index));
    } else {
      setSelectedRecommendations([...selectedRecommendations, index]);
    }
  };

  const steps = [
    {
      title: t('ai.rebalance.selectStrategy'),
      icon: <RobotOutlined />,
    },
    {
      title: t('ai.rebalance.reviewChanges'),
      icon: <InfoCircleOutlined />,
    },
    {
      title: t('ai.rebalance.confirm'),
      icon: <CheckCircleOutlined />,
    },
  ];

  return (
    <Modal
      open={visible}
      onCancel={handleClose}
      width={1200}
      footer={null}
      destroyOnClose
      title={
        <Space>
          <ThunderboltOutlined style={{ color: '#722ed1' }} />
          <span>{t('ai.rebalance.title')}</span>
        </Space>
      }
    >
      <Steps current={currentStep} items={steps} style={{ marginBottom: '32px' }} />

      {/* Step 1: Select Strategy */}
      {currentStep === 0 && (
        <div>
          <Alert
            message={t('ai.rebalance.aiPoweredTitle')}
            description={t('ai.rebalance.aiPoweredDescription')}
            type="info"
            showIcon
            icon={<RobotOutlined />}
            style={{ marginBottom: '24px' }}
          />

          <Card title={t('ai.rebalance.rebalanceMode')} style={{ marginBottom: '24px' }}>
            <Radio.Group
              value={rebalanceMode}
              onChange={(e) => setRebalanceMode(e.target.value)}
              style={{ width: '100%' }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Radio value="ai">
                  <Space direction="vertical">
                    <span style={{ fontWeight: 600 }}>{t('ai.rebalance.aiMode')}</span>
                    <span style={{ color: '#666', fontSize: '12px' }}>
                      {t('ai.rebalance.aiModeDescription')}
                    </span>
                  </Space>
                </Radio>
                <Radio value="manual">
                  <Space direction="vertical">
                    <span style={{ fontWeight: 600 }}>{t('ai.rebalance.manualMode')}</span>
                    <span style={{ color: '#666', fontSize: '12px' }}>
                      {t('ai.rebalance.manualModeDescription')}
                    </span>
                  </Space>
                </Radio>
              </Space>
            </Radio.Group>
          </Card>

          {rebalanceMode === 'ai' && (
            <>
              <Card title={t('ai.rebalance.riskTolerance')} style={{ marginBottom: '24px' }}>
                <Radio.Group
                  value={riskTolerance}
                  onChange={(e) => setRiskTolerance(e.target.value)}
                >
                  <Space>
                    <Radio value="conservative">{t('ai.conservative')}</Radio>
                    <Radio value="moderate">{t('ai.moderate')}</Radio>
                    <Radio value="aggressive">{t('ai.aggressive')}</Radio>
                  </Space>
                </Radio.Group>
              </Card>

              <Card title={t('ai.rebalance.recommendations')}>
                <Table
                  columns={rebalanceColumns}
                  dataSource={recommendations}
                  rowKey="asset"
                  pagination={false}
                  rowSelection={{
                    selectedRowKeys: selectedRecommendations,
                    onChange: (selectedRowKeys) => setSelectedRecommendations(selectedRowKeys as number[]),
                    getCheckboxProps: (record) => ({
                      disabled: record.action === 'maintain',
                    }),
                  }}
                  expandable={{
                    expandedRowRender: (record) => (
                      <div style={{ padding: '16px', backgroundColor: '#fafafa' }}>
                        <Row gutter={16}>
                          <Col span={24}>
                            <strong>{t('ai.reason')}:</strong>
                            <p style={{ marginTop: '8px' }}>{record.reason}</p>
                          </Col>
                        </Row>
                      </div>
                    ),
                  }}
                />
              </Card>
            </>
          )}

          {rebalanceMode === 'manual' && (
            <Alert
              message={t('ai.rebalance.manualNotice')}
              description={t('ai.rebalance.manualNoticeDescription')}
              type="warning"
              showIcon
            />
          )}
        </div>
      )}

      {/* Step 2: Review Changes */}
      {currentStep === 1 && (
        <div>
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title={t('ai.rebalance.highPriorityChanges')}
                  value={impactMetrics.highPriorityChanges}
                  prefix={<WarningOutlined style={{ color: '#fa8c16' }} />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title={t('ai.rebalance.avgConfidence')}
                  value={impactMetrics.avgConfidence}
                  suffix="%"
                  prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title={t('ai.rebalance.totalTrades')}
                  value={impactMetrics.totalTrades}
                  prefix={<ThunderboltOutlined style={{ color: '#722ed1' }} />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title={t('ai.rebalance.estimatedImprovement')}
                  value={impactMetrics.estimatedImprovement}
                  suffix="%"
                  prefix={<ArrowUpOutlined style={{ color: '#52c41a' }} />}
                />
              </Card>
            </Col>
          </Row>

          <Card title={t('ai.rebalance.visualComparison')} style={{ marginBottom: '24px' }}>
            <Column {...comparisonConfig} height={300} />
          </Card>

          <Card title={t('ai.rebalance.selectedChanges')}>
            <Table
              columns={rebalanceColumns}
              dataSource={recommendations.filter((_, index) => selectedRecommendations.includes(index))}
              rowKey="asset"
              pagination={false}
            />
          </Card>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {currentStep === 2 && (
        <div>
          <Alert
            message={t('ai.rebalance.confirmTitle')}
            description={t('ai.rebalance.confirmDescription')}
            type="success"
            showIcon
            icon={<CheckCircleOutlined />}
            style={{ marginBottom: '24px' }}
          />

          <Card title={t('ai.rebalance.executionSummary')} style={{ marginBottom: '24px' }}>
            <Row gutter={16}>
              <Col span={12}>
                <p><strong>{t('ai.rebalance.mode')}:</strong> {t(`ai.rebalance.${rebalanceMode}Mode`)}</p>
                <p><strong>{t('ai.rebalance.riskTolerance')}:</strong> {t(`ai.${riskTolerance}`)}</p>
                <p><strong>{t('ai.rebalance.totalChanges')}:</strong> {selectedRecommendations.length}</p>
              </Col>
              <Col span={12}>
                <p><strong>{t('ai.rebalance.avgConfidence')}:</strong> {impactMetrics.avgConfidence}%</p>
                <p><strong>{t('ai.rebalance.estimatedImprovement')}:</strong> +{impactMetrics.estimatedImprovement}%</p>
                <p><strong>{t('ai.rebalance.executionTime')}:</strong> {t('ai.rebalance.immediate')}</p>
              </Col>
            </Row>
          </Card>

          <Alert
            message={t('ai.rebalance.finalWarning')}
            description={t('ai.rebalance.finalWarningDescription')}
            type="warning"
            showIcon
          />
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: '24px', textAlign: 'right' }}>
        <Space>
          <Button onClick={handleClose}>{t('common.cancel')}</Button>
          {currentStep > 0 && (
            <Button onClick={handleBack}>{t('common.back')}</Button>
          )}
          {currentStep < steps.length - 1 && (
            <Button type="primary" onClick={handleNext}>
              {t('common.next')}
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button type="primary" icon={<ThunderboltOutlined />} onClick={handleSubmit}>
              {t('ai.rebalance.executeRebalance')}
            </Button>
          )}
        </Space>
      </div>
    </Modal>
  );
};

export default PortfolioRebalanceModal;
