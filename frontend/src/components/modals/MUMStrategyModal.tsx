import { useState } from 'react';
import {
  Modal,
  Steps,
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  Table,
  Row,
  Col,
  Tag,
  Card,
  Alert,
  Space,
  Slider,
  Checkbox,
  Radio,
  Statistic,
  message,
  Tooltip,
} from 'antd';
import {
  TeamOutlined,
  RobotOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import { Pie } from '@ant-design/charts';
import { useTranslation } from 'react-i18next';

const { Option } = Select;
const { TextArea } = Input;

interface MUMStrategyModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (values: any) => void;
  mode?: 'create' | 'edit';
  existingStrategy?: any;
}

interface AIManager {
  id: string;
  name: string;
  type: string;
  riskLevel: 'low' | 'medium' | 'high';
  performance: number;
  specialty: string;
  minAllocation: number;
  maxAllocation: number;
}

const MUMStrategyModal: React.FC<MUMStrategyModalProps> = ({
  visible,
  onClose,
  onSubmit,
  mode = 'create',
  existingStrategy = null,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedManagers, setSelectedManagers] = useState<string[]>([]);
  const [managerAllocations, setManagerAllocations] = useState<{ [key: string]: number }>({});
  const [autoRebalance, setAutoRebalance] = useState(true);

  // Available AI Managers
  const aiManagers: AIManager[] = [
    {
      id: 'alpha',
      name: 'AI Strategy Alpha',
      type: 'Conservative Growth',
      riskLevel: 'low',
      performance: 12.5,
      specialty: 'Stable returns, low volatility',
      minAllocation: 10,
      maxAllocation: 60,
    },
    {
      id: 'beta',
      name: 'AI Strategy Beta',
      type: 'Aggressive DeFi',
      riskLevel: 'high',
      performance: 28.3,
      specialty: 'High growth DeFi protocols',
      minAllocation: 10,
      maxAllocation: 50,
    },
    {
      id: 'gamma',
      name: 'AI Strategy Gamma',
      type: 'Balanced Diversified',
      riskLevel: 'medium',
      performance: 15.8,
      specialty: 'Diversified blue-chip assets',
      minAllocation: 10,
      maxAllocation: 60,
    },
    {
      id: 'delta',
      name: 'AI Strategy Delta',
      type: 'Momentum Trading',
      riskLevel: 'high',
      performance: 35.2,
      specialty: 'Short-term momentum plays',
      minAllocation: 5,
      maxAllocation: 30,
    },
    {
      id: 'epsilon',
      name: 'AI Strategy Epsilon',
      type: 'Value Investing',
      riskLevel: 'low',
      performance: 10.3,
      specialty: 'Undervalued fundamentals',
      minAllocation: 10,
      maxAllocation: 50,
    },
  ];

  const managerColumns = [
    {
      title: t('ai.manager'),
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <RobotOutlined style={{ color: '#722ed1' }} />
          <span style={{ fontWeight: 600 }}>{text}</span>
        </Space>
      ),
    },
    {
      title: t('ai.type'),
      dataIndex: 'type',
      key: 'type',
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
      title: t('ai.ytdPerformance'),
      dataIndex: 'performance',
      key: 'performance',
      render: (val: number) => (
        <span style={{ color: val >= 15 ? '#52c41a' : '#faad14', fontWeight: 600 }}>
          +{val}%
        </span>
      ),
      sorter: (a: AIManager, b: AIManager) => a.performance - b.performance,
    },
    {
      title: t('ai.specialty'),
      dataIndex: 'specialty',
      key: 'specialty',
    },
  ];

  const allocationColumns = [
    {
      title: t('ai.manager'),
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span style={{ fontWeight: 600 }}>{text}</span>,
    },
    {
      title: t('ai.allocation'),
      key: 'allocation',
      render: (_: any, record: AIManager) => (
        <Row gutter={8} align="middle">
          <Col span={16}>
            <Slider
              min={record.minAllocation}
              max={record.maxAllocation}
              value={managerAllocations[record.id] || record.minAllocation}
              onChange={(value) => handleAllocationChange(record.id, value)}
              marks={{
                [record.minAllocation]: `${record.minAllocation}%`,
                [record.maxAllocation]: `${record.maxAllocation}%`,
              }}
            />
          </Col>
          <Col span={8}>
            <InputNumber
              min={record.minAllocation}
              max={record.maxAllocation}
              value={managerAllocations[record.id] || record.minAllocation}
              onChange={(value) => handleAllocationChange(record.id, value || record.minAllocation)}
              formatter={(value) => `${value}%`}
              parser={(value) => value?.replace('%', '') as any}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
      ),
    },
  ];

  const handleAllocationChange = (managerId: string, value: number) => {
    setManagerAllocations({
      ...managerAllocations,
      [managerId]: value,
    });
  };

  const totalAllocation = Object.values(managerAllocations).reduce((sum, val) => sum + val, 0);

  const selectedManagersData = aiManagers.filter(m => selectedManagers.includes(m.id));

  const allocationChartData = selectedManagersData.map(m => ({
    manager: m.name,
    allocation: managerAllocations[m.id] || 0,
  }));

  const allocationConfig = {
    data: allocationChartData,
    angleField: 'allocation',
    colorField: 'manager',
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      type: 'spider',
      content: '{name}\n{percentage}',
    },
    legend: {
      position: 'bottom' as const,
    },
  };

  const strategyMetrics = {
    avgPerformance: selectedManagersData.length > 0
      ? (selectedManagersData.reduce((sum, m) => sum + m.performance * (managerAllocations[m.id] || 0) / 100, 0)).toFixed(1)
      : 0,
    riskScore: selectedManagersData.length > 0
      ? Math.round(selectedManagersData.reduce((sum, m) => {
          const riskScores = { low: 20, medium: 50, high: 80 };
          return sum + riskScores[m.riskLevel] * (managerAllocations[m.id] || 0) / 100;
        }, 0))
      : 0,
    diversification: selectedManagersData.length,
  };

  const handleNext = () => {
    if (currentStep === 0 && selectedManagers.length === 0) {
      message.warning(t('ai.mum.selectAtLeastOne'));
      return;
    }
    if (currentStep === 1 && totalAllocation !== 100) {
      message.warning(t('ai.mum.allocationMustBe100'));
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const strategyData = {
        ...values,
        managers: selectedManagersData.map(m => ({
          id: m.id,
          name: m.name,
          allocation: managerAllocations[m.id],
        })),
        autoRebalance,
        metrics: strategyMetrics,
        createdAt: new Date().toISOString(),
      };

      if (onSubmit) {
        onSubmit(strategyData);
      }

      message.success(t('ai.mum.strategyCreated'));
      handleClose();
    }).catch((error) => {
      console.error('Validation error:', error);
    });
  };

  const handleClose = () => {
    setCurrentStep(0);
    setSelectedManagers([]);
    setManagerAllocations({});
    form.resetFields();
    onClose();
  };

  const handleSelectManager = (managerId: string) => {
    const manager = aiManagers.find(m => m.id === managerId);
    if (!manager) return;

    if (selectedManagers.includes(managerId)) {
      setSelectedManagers(selectedManagers.filter(id => id !== managerId));
      const newAllocations = { ...managerAllocations };
      delete newAllocations[managerId];
      setManagerAllocations(newAllocations);
    } else {
      setSelectedManagers([...selectedManagers, managerId]);
      setManagerAllocations({
        ...managerAllocations,
        [managerId]: manager.minAllocation,
      });
    }
  };

  const steps = [
    {
      title: t('ai.mum.selectManagers'),
      icon: <TeamOutlined />,
    },
    {
      title: t('ai.mum.allocateFunds'),
      icon: <ThunderboltOutlined />,
    },
    {
      title: t('ai.mum.configureStrategy'),
      icon: <InfoCircleOutlined />,
    },
    {
      title: t('ai.mum.review'),
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
          <TeamOutlined style={{ color: '#722ed1' }} />
          <span>
            {mode === 'create' ? t('ai.mum.createStrategy') : t('ai.mum.editStrategy')}
          </span>
        </Space>
      }
    >
      <Steps current={currentStep} items={steps} style={{ marginBottom: '32px' }} />

      {/* Step 1: Select Managers */}
      {currentStep === 0 && (
        <div>
          <Alert
            message={t('ai.mum.multiManagerTitle')}
            description={t('ai.mum.multiManagerDescription')}
            type="info"
            showIcon
            icon={<RobotOutlined />}
            style={{ marginBottom: '24px' }}
          />

          <Table
            columns={managerColumns}
            dataSource={aiManagers}
            rowKey="id"
            pagination={false}
            rowSelection={{
              selectedRowKeys: selectedManagers,
              onChange: (selectedRowKeys) => {
                // Handle bulk selection
                selectedRowKeys.forEach(key => {
                  const manager = aiManagers.find(m => m.id === key);
                  if (manager && !selectedManagers.includes(key as string)) {
                    handleSelectManager(key as string);
                  }
                });
                // Handle bulk deselection
                selectedManagers.forEach(key => {
                  if (!selectedRowKeys.includes(key)) {
                    handleSelectManager(key);
                  }
                });
              },
            }}
            expandable={{
              expandedRowRender: (record) => (
                <div style={{ padding: '16px', backgroundColor: '#fafafa' }}>
                  <Row gutter={16}>
                    <Col span={8}>
                      <strong>{t('ai.specialty')}:</strong>
                      <p>{record.specialty}</p>
                    </Col>
                    <Col span={8}>
                      <strong>{t('ai.allocationRange')}:</strong>
                      <p>{record.minAllocation}% - {record.maxAllocation}%</p>
                    </Col>
                    <Col span={8}>
                      <strong>{t('ai.ytdPerformance')}:</strong>
                      <p style={{ color: '#52c41a', fontWeight: 600 }}>+{record.performance}%</p>
                    </Col>
                  </Row>
                </div>
              ),
            }}
          />

          <Card style={{ marginTop: '16px', backgroundColor: '#f0f5ff', border: '1px solid #d6e4ff' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>{t('ai.mum.recommendation')}:</Text>
              <Text>{t('ai.mum.recommendationText')}</Text>
            </Space>
          </Card>
        </div>
      )}

      {/* Step 2: Allocate Funds */}
      {currentStep === 1 && (
        <div>
          <Alert
            message={
              <span>
                {t('ai.mum.totalAllocation')}: <strong>{totalAllocation}%</strong>
                {totalAllocation !== 100 && (
                  <span style={{ color: '#f5222d', marginLeft: '8px' }}>
                    ({totalAllocation < 100 ? t('ai.mum.underAllocated') : t('ai.mum.overAllocated')})
                  </span>
                )}
              </span>
            }
            type={totalAllocation === 100 ? 'success' : 'warning'}
            showIcon
            style={{ marginBottom: '24px' }}
          />

          <Table
            columns={allocationColumns}
            dataSource={selectedManagersData}
            rowKey="id"
            pagination={false}
          />

          <Card title={t('ai.mum.allocationVisualization')} style={{ marginTop: '24px' }}>
            {allocationChartData.length > 0 && (
              <Pie {...allocationConfig} height={300} />
            )}
          </Card>
        </div>
      )}

      {/* Step 3: Configure Strategy */}
      {currentStep === 2 && (
        <div>
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              strategyName: '',
              description: '',
              autoRebalance: true,
              rebalanceFrequency: 'monthly',
              riskTolerance: 'moderate',
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="strategyName"
                  label={t('ai.mum.strategyName')}
                  rules={[{ required: true, message: t('ai.mum.strategyNameRequired') }]}
                >
                  <Input placeholder={t('ai.mum.strategyNamePlaceholder')} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="riskTolerance"
                  label={t('ai.mum.riskTolerance')}
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Option value="conservative">{t('ai.conservative')}</Option>
                    <Option value="moderate">{t('ai.moderate')}</Option>
                    <Option value="aggressive">{t('ai.aggressive')}</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="description"
              label={t('ai.mum.description')}
            >
              <TextArea
                rows={4}
                placeholder={t('ai.mum.descriptionPlaceholder')}
              />
            </Form.Item>

            <Card title={t('ai.mum.rebalancingSettings')} style={{ marginBottom: '16px' }}>
              <Form.Item
                name="autoRebalance"
                valuePropName="checked"
              >
                <Checkbox onChange={(e) => setAutoRebalance(e.target.checked)}>
                  {t('ai.mum.enableAutoRebalance')}
                </Checkbox>
              </Form.Item>

              {autoRebalance && (
                <Form.Item
                  name="rebalanceFrequency"
                  label={t('ai.mum.rebalanceFrequency')}
                >
                  <Radio.Group>
                    <Radio value="daily">{t('ai.mum.daily')}</Radio>
                    <Radio value="weekly">{t('ai.mum.weekly')}</Radio>
                    <Radio value="monthly">{t('ai.mum.monthly')}</Radio>
                    <Radio value="quarterly">{t('ai.mum.quarterly')}</Radio>
                  </Radio.Group>
                </Form.Item>
              )}
            </Card>
          </Form>
        </div>
      )}

      {/* Step 4: Review */}
      {currentStep === 3 && (
        <div>
          <Alert
            message={t('ai.mum.reviewTitle')}
            description={t('ai.mum.reviewDescription')}
            type="success"
            showIcon
            icon={<CheckCircleOutlined />}
            style={{ marginBottom: '24px' }}
          />

          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col span={8}>
              <Card>
                <Statistic
                  title={t('ai.mum.expectedReturn')}
                  value={strategyMetrics.avgPerformance}
                  suffix="%"
                  prefix={<LineChartOutlined style={{ color: '#52c41a' }} />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title={t('ai.mum.riskScore')}
                  value={strategyMetrics.riskScore}
                  prefix={<SafetyOutlined style={{ color: strategyMetrics.riskScore > 60 ? '#f5222d' : '#faad14' }} />}
                  valueStyle={{ color: strategyMetrics.riskScore > 60 ? '#f5222d' : '#faad14' }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title={t('ai.mum.diversification')}
                  value={strategyMetrics.diversification}
                  suffix={t('ai.mum.managers')}
                  prefix={<TeamOutlined style={{ color: '#722ed1' }} />}
                />
              </Card>
            </Col>
          </Row>

          <Card title={t('ai.mum.strategySummary')} style={{ marginBottom: '16px' }}>
            <Row gutter={16}>
              <Col span={12}>
                <p><strong>{t('ai.mum.strategyName')}:</strong> {form.getFieldValue('strategyName')}</p>
                <p><strong>{t('ai.mum.riskTolerance')}:</strong> {t(`ai.${form.getFieldValue('riskTolerance')}`)}</p>
                <p><strong>{t('ai.mum.autoRebalance')}:</strong> {autoRebalance ? t('common.yes') : t('common.no')}</p>
              </Col>
              <Col span={12}>
                <p><strong>{t('ai.mum.selectedManagers')}:</strong> {selectedManagersData.length}</p>
                <p><strong>{t('ai.mum.rebalanceFrequency')}:</strong> {form.getFieldValue('rebalanceFrequency') ? t(`ai.mum.${form.getFieldValue('rebalanceFrequency')}`) : '-'}</p>
              </Col>
            </Row>
          </Card>

          <Card title={t('ai.mum.managerAllocations')}>
            <Table
              columns={[
                {
                  title: t('ai.manager'),
                  dataIndex: 'name',
                  key: 'name',
                  render: (text: string) => <span style={{ fontWeight: 600 }}>{text}</span>,
                },
                {
                  title: t('ai.allocation'),
                  key: 'allocation',
                  render: (_: any, record: AIManager) => `${managerAllocations[record.id]}%`,
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
              ]}
              dataSource={selectedManagersData}
              rowKey="id"
              pagination={false}
            />
          </Card>
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
            <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleSubmit}>
              {mode === 'create' ? t('ai.mum.createStrategy') : t('ai.mum.updateStrategy')}
            </Button>
          )}
        </Space>
      </div>
    </Modal>
  );
};

// Add Text component for Card content
const Text = ({ children, strong, style }: { children: React.ReactNode; strong?: boolean; style?: React.CSSProperties }) => (
  <span style={{ fontWeight: strong ? 600 : 400, ...style }}>{children}</span>
);

export default MUMStrategyModal;
