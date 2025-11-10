import { useState } from 'react';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  InputNumber,
  Radio,
  Result,
  Row,
  Select,
  Space,
  Tag,
  Typography,
  message,
} from 'antd';
import {
  CheckCircleOutlined,
  DownloadOutlined,
  SafetyOutlined,
  WarningOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

type RiskCategory = 'conservative' | 'moderate' | 'aggressive';

interface QuestionnaireData {
  // Risk Tolerance
  riskQ1?: number;
  riskQ2?: number;
  riskQ3?: number;
  riskQ4?: number;
  riskQ5?: number;

  // Investment Experience
  yearsInvesting?: number;
  assetClasses?: string[];
  derivativesKnowledge?: string;
  professionalExperience?: boolean;

  // Financial Situation
  annualIncome?: string;
  netWorth?: string;
  liquidNetWorth?: string;
  investmentObjective?: string;
  investmentHorizon?: string;
  liquidityNeeds?: string;
}

const SuitabilityQuestionnairePage = () => {
  const [form] = Form.useForm();
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [category, setCategory] = useState<RiskCategory>('moderate');
  const [data, setData] = useState<QuestionnaireData>({});

  const riskQuestions = [
    {
      id: 1,
      question: 'If your portfolio lost 20% of its value in a month, what would you do?',
      options: [
        { label: 'Sell everything immediately', value: 1 },
        { label: 'Sell some to reduce risk', value: 2 },
        { label: 'Hold and wait for recovery', value: 3 },
        { label: 'Buy more at lower prices', value: 4 },
      ],
    },
    {
      id: 2,
      question: 'What is your primary investment goal?',
      options: [
        { label: 'Preserve capital', value: 1 },
        { label: 'Generate steady income', value: 2 },
        { label: 'Balanced growth and income', value: 3 },
        { label: 'Maximize long-term growth', value: 4 },
      ],
    },
    {
      id: 3,
      question: 'How would you describe your investment knowledge?',
      options: [
        { label: 'Limited - I am new to investing', value: 1 },
        { label: 'Basic - I understand stocks and bonds', value: 2 },
        { label: 'Intermediate - I have diverse investment experience', value: 3 },
        { label: 'Advanced - I am experienced with complex instruments', value: 4 },
      ],
    },
    {
      id: 4,
      question: 'How long can you leave your money invested?',
      options: [
        { label: 'Less than 1 year', value: 1 },
        { label: '1-3 years', value: 2 },
        { label: '3-7 years', value: 3 },
        { label: 'More than 7 years', value: 4 },
      ],
    },
    {
      id: 5,
      question: 'What percentage of your net worth will you invest?',
      options: [
        { label: 'Less than 10%', value: 1 },
        { label: '10-25%', value: 2 },
        { label: '25-50%', value: 3 },
        { label: 'More than 50%', value: 4 },
      ],
    },
  ];

  const calculateScore = (values: QuestionnaireData): number => {
    const riskScore =
      (values.riskQ1 || 0) +
      (values.riskQ2 || 0) +
      (values.riskQ3 || 0) +
      (values.riskQ4 || 0) +
      (values.riskQ5 || 0);

    // Weight adjustments based on experience and financial situation
    let experienceWeight = 1.0;
    if ((values.yearsInvesting || 0) > 5) experienceWeight = 1.2;
    if ((values.yearsInvesting || 0) > 10) experienceWeight = 1.4;

    let assetClassWeight = 1.0;
    if ((values.assetClasses?.length || 0) > 3) assetClassWeight = 1.1;

    const totalScore = riskScore * experienceWeight * assetClassWeight;
    return Math.round(totalScore);
  };

  const determineCategory = (finalScore: number): RiskCategory => {
    if (finalScore < 15) return 'conservative';
    if (finalScore < 25) return 'moderate';
    return 'aggressive';
  };

  const handleFinish = async () => {
    try {
      const values = await form.validateFields();
      setData(values);

      const calculatedScore = calculateScore(values);
      setScore(calculatedScore);

      const riskCategory = determineCategory(calculatedScore);
      setCategory(riskCategory);

      setCompleted(true);
      message.success('Questionnaire completed successfully!');
    } catch (error) {
      message.error('Please answer all questions');
    }
  };

  const handleDownloadReport = () => {
    message.success('Report downloaded successfully!');
  };

  const getRecommendations = (cat: RiskCategory) => {
    const recommendations = {
      conservative: {
        icon: <SafetyOutlined style={{ color: '#52c41a' }} />,
        title: 'Conservative Investor',
        description:
          'You prioritize capital preservation over growth. Suitable investments include stable funds with low volatility.',
        maxAllocation: 25,
        suitableProducts: ['Fixed Income Fund', 'Stable Yield Fund', 'Conservative Balanced Fund'],
      },
      moderate: {
        icon: <CheckCircleOutlined style={{ color: '#1890ff' }} />,
        title: 'Moderate Investor',
        description:
          'You seek a balance between growth and stability. Suitable for diversified funds with moderate risk.',
        maxAllocation: 50,
        suitableProducts: ['Balanced Growth Fund', 'Dividend Fund', 'Multi-Asset Fund'],
      },
      aggressive: {
        icon: <WarningOutlined style={{ color: '#ff4d4f' }} />,
        title: 'Aggressive Investor',
        description:
          'You are comfortable with high volatility to maximize long-term returns. Suitable for growth-oriented funds.',
        maxAllocation: 75,
        suitableProducts: ['Growth Equity Fund', 'Crypto Fund', 'Emerging Markets Fund'],
      },
    };

    return recommendations[cat];
  };

  if (completed) {
    const recommendation = getRecommendations(category);

    return (
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Result
            status="success"
            title="Suitability Assessment Complete"
            subTitle="Based on your responses, we have determined your investment profile."
          />
        </Card>

        <Card title="Your Investment Profile">
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Row gutter={16}>
              <Col span={12}>
                <Card>
                  <Space direction="vertical" align="center" style={{ width: '100%' }}>
                    {recommendation.icon}
                    <Title level={4}>{recommendation.title}</Title>
                    <Text type="secondary">{recommendation.description}</Text>
                  </Space>
                </Card>
              </Col>
              <Col span={12}>
                <Card>
                  <Descriptions column={1} bordered size="small">
                    <Descriptions.Item label="Risk Score">{score}/28</Descriptions.Item>
                    <Descriptions.Item label="Risk Category">
                      <Tag color={category === 'aggressive' ? 'red' : category === 'moderate' ? 'blue' : 'green'}>
                        {category.toUpperCase()}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Max Allocation">
                      {recommendation.maxAllocation}% of portfolio
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>

            <Card title="Suitable Products" size="small">
              <Space wrap>
                {recommendation.suitableProducts.map((product) => (
                  <Tag key={product} color="blue">
                    {product}
                  </Tag>
                ))}
              </Space>
            </Card>

            <Card title="Important Disclosures" size="small">
              <Space direction="vertical">
                <Text type="secondary">
                  • This assessment is based on your responses and should not be considered financial advice.
                </Text>
                <Text type="secondary">
                  • Your suitability profile may change over time. We recommend reassessing annually.
                </Text>
                <Text type="secondary">
                  • Past performance does not guarantee future results.
                </Text>
                <Text type="secondary">
                  • All investments carry risk, including potential loss of principal.
                </Text>
              </Space>
            </Card>

            <Row gutter={16}>
              <Col>
                <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownloadReport}>
                  Download Report (PDF)
                </Button>
              </Col>
              <Col>
                <Button onClick={() => setCompleted(false)}>Retake Assessment</Button>
              </Col>
            </Row>
          </Space>
        </Card>
      </Space>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card>
        <Title level={3}>Suitability Questionnaire</Title>
        <Paragraph>
          This questionnaire helps us understand your investment objectives, risk tolerance, and
          financial situation to recommend suitable investment products.
        </Paragraph>
      </Card>

      <Form form={form} layout="vertical">
        {/* Risk Tolerance Quiz */}
        <Card title="Part 1: Risk Tolerance (5 questions)">
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {riskQuestions.map((q) => (
              <Card key={q.id} size="small">
                <Form.Item
                  name={`riskQ${q.id}`}
                  label={<Text strong>{q.question}</Text>}
                  rules={[{ required: true, message: 'Please select an answer' }]}
                >
                  <Radio.Group>
                    <Space direction="vertical">
                      {q.options.map((opt) => (
                        <Radio key={opt.value} value={opt.value}>
                          {opt.label}
                        </Radio>
                      ))}
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </Card>
            ))}
          </Space>
        </Card>

        {/* Investment Experience */}
        <Card title="Part 2: Investment Experience">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="yearsInvesting"
                label="Years of Investment Experience"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} max={50} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="derivativesKnowledge"
                label="Derivatives Knowledge"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select level"
                  options={[
                    { label: 'None', value: 'none' },
                    { label: 'Basic', value: 'basic' },
                    { label: 'Intermediate', value: 'intermediate' },
                    { label: 'Advanced', value: 'advanced' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="assetClasses"
                label="Asset Classes Experienced With"
                rules={[{ required: true }]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select all that apply"
                  options={[
                    { label: 'Stocks', value: 'stocks' },
                    { label: 'Bonds', value: 'bonds' },
                    { label: 'Mutual Funds', value: 'mutual-funds' },
                    { label: 'ETFs', value: 'etfs' },
                    { label: 'Real Estate', value: 'real-estate' },
                    { label: 'Cryptocurrencies', value: 'crypto' },
                    { label: 'Commodities', value: 'commodities' },
                    { label: 'Derivatives', value: 'derivatives' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Financial Situation */}
        <Card title="Part 3: Financial Situation">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="annualIncome"
                label="Annual Income"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select range"
                  options={[
                    { label: 'Less than $50,000', value: '<50k' },
                    { label: '$50,000 - $100,000', value: '50k-100k' },
                    { label: '$100,000 - $200,000', value: '100k-200k' },
                    { label: '$200,000 - $500,000', value: '200k-500k' },
                    { label: 'More than $500,000', value: '>500k' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="netWorth" label="Net Worth" rules={[{ required: true }]}>
                <Select
                  placeholder="Select range"
                  options={[
                    { label: 'Less than $500,000', value: '<500k' },
                    { label: '$500,000 - $1,000,000', value: '500k-1m' },
                    { label: '$1,000,000 - $5,000,000', value: '1m-5m' },
                    { label: '$5,000,000 - $10,000,000', value: '5m-10m' },
                    { label: 'More than $10,000,000', value: '>10m' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="investmentObjective"
                label="Investment Objective"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select objective"
                  options={[
                    { label: 'Capital Preservation', value: 'preservation' },
                    { label: 'Income Generation', value: 'income' },
                    { label: 'Growth', value: 'growth' },
                    { label: 'Aggressive Growth', value: 'aggressive-growth' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="investmentHorizon"
                label="Investment Horizon"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select horizon"
                  options={[
                    { label: 'Short-term (< 3 years)', value: 'short' },
                    { label: 'Medium-term (3-7 years)', value: 'medium' },
                    { label: 'Long-term (> 7 years)', value: 'long' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="liquidityNeeds"
                label="Liquidity Needs"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select needs"
                  options={[
                    { label: 'High - Need access within days', value: 'high' },
                    { label: 'Medium - Can wait weeks/months', value: 'medium' },
                    { label: 'Low - Can wait years', value: 'low' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card>
          <Row justify="end">
            <Button type="primary" size="large" onClick={handleFinish}>
              Complete Assessment
            </Button>
          </Row>
        </Card>
      </Form>
    </Space>
  );
};

export default SuitabilityQuestionnairePage;
