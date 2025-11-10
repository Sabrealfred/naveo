import { useState } from 'react';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Slider,
  Space,
  Steps,
  Switch,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  CheckCircleOutlined,
  DollarOutlined,
  DownloadOutlined,
  FileTextOutlined,
  LeftOutlined,
  RightOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { Line } from '@ant-design/charts';

const { Title, Text } = Typography;
const { TextArea } = Input;

type ProductType = 'open-end-fund' | 'closed-end-fund' | 'spv' | 'note' | 'direct-token';

interface ProductStructure {
  // Basic Info
  name: string;
  description: string;
  type: ProductType;

  // Economic Terms
  minInvestment: number;
  maxInvestment: number;
  targetRaise: number;
  hardCap: number;

  // Fee Structure
  managementFee: number;
  performanceFee: number;
  hurdleRate: number;
  highWaterMark: boolean;
  subscriptionFee: number;
  redemptionFee: number;
  earlyRedemptionPenalty: number;

  // Waterfall Structure
  waterfallTiers: WaterfallTier[];

  // Liquidity Terms
  lockupPeriod: number;
  redemptionFrequency: string;
  noticePeríod: number;

  // Governance
  votingRights: boolean;
  majorityThreshold: number;
}

interface WaterfallTier {
  id: string;
  name: string;
  returnThreshold: number;
  lpShare: number;
  gpShare: number;
}

const mockWaterfallTiers: WaterfallTier[] = [
  { id: 'tier-1', name: 'Return of Capital', returnThreshold: 0, lpShare: 100, gpShare: 0 },
  { id: 'tier-2', name: 'Preferred Return (8%)', returnThreshold: 8, lpShare: 100, gpShare: 0 },
  { id: 'tier-3', name: 'Catch-up (to 20% carry)', returnThreshold: 12, lpShare: 80, gpShare: 20 },
  { id: 'tier-4', name: 'Carried Interest', returnThreshold: 100, lpShare: 80, gpShare: 20 },
];

const ProductStructuringPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [structure, setStructure] = useState<Partial<ProductStructure>>({
    managementFee: 2.0,
    performanceFee: 20,
    hurdleRate: 8.0,
    highWaterMark: true,
    waterfallTiers: mockWaterfallTiers,
  });

  const productTypeOptions = [
    { label: 'Open-End Fund', value: 'open-end-fund' },
    { label: 'Closed-End Fund', value: 'closed-end-fund' },
    { label: 'SPV (Special Purpose Vehicle)', value: 'spv' },
    { label: 'Note (Debt Instrument)', value: 'note' },
    { label: 'Direct Token', value: 'direct-token' },
  ];

  const redemptionFrequencyOptions = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Quarterly', value: 'quarterly' },
    { label: 'Semi-Annual', value: 'semi-annual' },
    { label: 'Annual', value: 'annual' },
  ];

  const handleNext = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      setStructure({ ...structure, ...values });
      setCurrentStep(currentStep + 1);
    } catch (error) {
      message.error('Please fill in all required fields');
    }
  };

  const handlePrevious = () => {
    const values = form.getFieldsValue();
    setStructure({ ...structure, ...values });
    setCurrentStep(currentStep - 1);
  };

  const handleSaveTemplate = () => {
    message.success('Structure saved as template!');
  };

  const handleGenerateDocuments = () => {
    message.success('Documents generated successfully!');
  };

  const calculateWaterfallDistribution = (totalReturn: number) => {
    const invested = 100;
    const returns = totalReturn - invested;
    const returnPercent = (returns / invested) * 100;

    const distributions: { tier: string; lp: number; gp: number }[] = [];
    let remaining = totalReturn;

    // Simplified waterfall calculation
    if (returnPercent <= 8) {
      distributions.push({ tier: 'Return of Capital + Pref', lp: totalReturn, gp: 0 });
    } else if (returnPercent <= 12) {
      distributions.push({ tier: 'Return of Capital + Pref', lp: 108, gp: 0 });
      distributions.push({ tier: 'Catch-up', lp: (totalReturn - 108) * 0.8, gp: (totalReturn - 108) * 0.2 });
    } else {
      distributions.push({ tier: 'Return of Capital + Pref', lp: 108, gp: 0 });
      distributions.push({ tier: 'Catch-up', lp: 4 * 0.8, gp: 4 * 0.2 });
      distributions.push({ tier: 'Carried Interest', lp: (totalReturn - 112) * 0.8, gp: (totalReturn - 112) * 0.2 });
    }

    return distributions;
  };

  const waterfallSimulationData = [
    { totalReturn: 100, lpShare: 100, gpShare: 0 },
    { totalReturn: 105, lpShare: 105, gpShare: 0 },
    { totalReturn: 110, lpShare: 110, gpShare: 0 },
    { totalReturn: 115, lpShare: 113, gpShare: 2 },
    { totalReturn: 120, lpShare: 116, gpShare: 4 },
    { totalReturn: 130, lpShare: 124, gpShare: 6 },
    { totalReturn: 150, lpShare: 140, gpShare: 10 },
  ];

  const waterfallColumns: ColumnsType<WaterfallTier> = [
    {
      title: 'Tier',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Return Threshold (%)',
      dataIndex: 'returnThreshold',
      key: 'returnThreshold',
      render: (val: number) => `${val}%`,
    },
    {
      title: 'LP Share (%)',
      dataIndex: 'lpShare',
      key: 'lpShare',
      render: (val: number) => <Tag color="blue">{val}%</Tag>,
    },
    {
      title: 'GP Share (%)',
      dataIndex: 'gpShare',
      key: 'gpShare',
      render: (val: number) => <Tag color="green">{val}%</Tag>,
    },
  ];

  const steps = [
    { title: 'Basic Info', icon: <FileTextOutlined /> },
    { title: 'Economic Terms', icon: <DollarOutlined /> },
    { title: 'Fee Structure', icon: <DollarOutlined /> },
    { title: 'Waterfall', icon: <DollarOutlined /> },
    { title: 'Liquidity & Governance', icon: <FileTextOutlined /> },
    { title: 'Review', icon: <CheckCircleOutlined /> },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3}>Product Structuring Studio</Title>
        </Col>
        <Col>
          <Space>
            <Button icon={<SaveOutlined />} onClick={handleSaveTemplate}>
              Save Template
            </Button>
            <Button type="primary" icon={<DownloadOutlined />} onClick={handleGenerateDocuments}>
              Generate Documents
            </Button>
          </Space>
        </Col>
      </Row>

      <Card>
        <Steps current={currentStep} items={steps} />
      </Card>

      <Form form={form} layout="vertical" initialValues={structure}>
        {/* Step 0: Basic Info */}
        {currentStep === 0 && (
          <Card title="Basic Information">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
                  <Input placeholder="e.g., Naveo Growth Fund I" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="type" label="Product Type" rules={[{ required: true }]}>
                  <Select options={productTypeOptions} placeholder="Select product type" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="description" label="Description">
                  <TextArea rows={4} placeholder="Describe the investment strategy and objectives" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        )}

        {/* Step 1: Economic Terms */}
        {currentStep === 1 && (
          <Card title="Economic Terms">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="minInvestment" label="Minimum Investment" rules={[{ required: true }]}>
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    placeholder="e.g., 100,000"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="maxInvestment" label="Maximum Investment">
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    placeholder="e.g., 10,000,000"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="targetRaise" label="Target Raise" rules={[{ required: true }]}>
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    placeholder="e.g., 50,000,000"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="hardCap" label="Hard Cap" rules={[{ required: true }]}>
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    placeholder="e.g., 75,000,000"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        )}

        {/* Step 2: Fee Structure */}
        {currentStep === 2 && (
          <Card title="Fee Structure">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Text strong>Management Fee (Annual)</Text>
                <Form.Item name="managementFee">
                  <Slider
                    min={0}
                    max={5}
                    step={0.1}
                    marks={{ 0: '0%', 1: '1%', 2: '2%', 3: '3%', 5: '5%' }}
                    tooltip={{ formatter: (value) => `${value}%` }}
                  />
                </Form.Item>
              </div>

              <div>
                <Text strong>Performance Fee (Carried Interest)</Text>
                <Form.Item name="performanceFee">
                  <Slider
                    min={0}
                    max={30}
                    step={1}
                    marks={{ 0: '0%', 10: '10%', 20: '20%', 30: '30%' }}
                    tooltip={{ formatter: (value) => `${value}%` }}
                  />
                </Form.Item>
              </div>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="hurdleRate" label="Hurdle Rate (%)">
                    <InputNumber min={0} max={20} step={0.5} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="highWaterMark" label="High Water Mark" valuePropName="checked">
                    <Switch checkedChildren="Yes" unCheckedChildren="No" />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="subscriptionFee" label="Subscription Fee (%)">
                    <InputNumber min={0} max={5} step={0.1} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="redemptionFee" label="Redemption Fee (%)">
                    <InputNumber min={0} max={5} step={0.1} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="earlyRedemptionPenalty" label="Early Redemption Penalty (%)">
                    <InputNumber min={0} max={10} step={0.5} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
            </Space>
          </Card>
        )}

        {/* Step 3: Waterfall Structure */}
        {currentStep === 3 && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card title="Waterfall Structure">
              <Table
                dataSource={structure.waterfallTiers || mockWaterfallTiers}
                columns={waterfallColumns}
                rowKey="id"
                pagination={false}
              />
            </Card>

            <Card title="Waterfall Simulation">
              <Line
                data={waterfallSimulationData}
                xField="totalReturn"
                yField="value"
                seriesField="type"
                height={300}
                smooth
                legend={{ position: 'top' }}
                tooltip={{
                  formatter: (datum: { type: string; value: number }) => ({
                    name: datum.type,
                    value: `$${datum.value}`,
                  }),
                }}
              />
            </Card>
          </Space>
        )}

        {/* Step 4: Liquidity & Governance */}
        {currentStep === 4 && (
          <Card title="Liquidity Terms & Governance">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Title level={5}>Liquidity Terms</Title>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="lockupPeriod" label="Lock-up Period (months)">
                    <InputNumber min={0} max={60} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="redemptionFrequency" label="Redemption Frequency">
                    <Select options={redemptionFrequencyOptions} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="noticePeriod" label="Notice Period (days)">
                    <InputNumber min={0} max={90} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              <Title level={5}>Governance</Title>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="votingRights" label="Voting Rights" valuePropName="checked">
                    <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="majorityThreshold" label="Majority Threshold (%)">
                    <InputNumber min={50} max={100} step={1} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
            </Space>
          </Card>
        )}

        {/* Step 5: Review */}
        {currentStep === 5 && (
          <Card title="Structure Summary">
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Product Name" span={2}>
                {structure.name || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Product Type" span={2}>
                {structure.type || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Target Raise">
                ${structure.targetRaise?.toLocaleString() || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Hard Cap">
                ${structure.hardCap?.toLocaleString() || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Management Fee">
                {structure.managementFee}% annual
              </Descriptions.Item>
              <Descriptions.Item label="Performance Fee">
                {structure.performanceFee}%
              </Descriptions.Item>
              <Descriptions.Item label="Hurdle Rate">
                {structure.hurdleRate}%
              </Descriptions.Item>
              <Descriptions.Item label="High Water Mark">
                {structure.highWaterMark ? 'Yes' : 'No'}
              </Descriptions.Item>
              <Descriptions.Item label="Lock-up Period">
                {structure.lockupPeriod} months
              </Descriptions.Item>
              <Descriptions.Item label="Redemption Frequency">
                {structure.redemptionFrequency}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}
      </Form>

      {/* Navigation Buttons */}
      <Card>
        <Row justify="space-between">
          <Col>
            <Button
              icon={<LeftOutlined />}
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
          </Col>
          <Col>
            <Space>
              <Text type="secondary">
                Step {currentStep + 1} of {steps.length}
              </Text>
            </Space>
          </Col>
          <Col>
            {currentStep < steps.length - 1 ? (
              <Button type="primary" icon={<RightOutlined />} onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleGenerateDocuments}>
                Finalize & Generate
              </Button>
            )}
          </Col>
        </Row>
      </Card>
    </Space>
  );
};

export default ProductStructuringPage;
