import { useState } from 'react';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Radio,
  Result,
  Row,
  Select,
  Space,
  Steps,
  Typography,
  Upload,
  message,
  Progress,
} from 'antd';
import {
  CheckCircleOutlined,
  IdcardOutlined,
  LoadingOutlined,
  SafetyOutlined,
  UserOutlined,
  FileTextOutlined,
  BankOutlined,
  RightOutlined,
  LeftOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

type AccreditationType = 'income' | 'networth' | 'professional' | 'entity';
type KYCStatus = 'pending' | 'in-progress' | 'completed' | 'failed';

interface OnboardingData {
  // Step 1: Account
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;

  // Step 2: Profile
  dateOfBirth?: string;
  nationality?: string;
  country?: string;
  address?: string;
  city?: string;
  zipCode?: string;

  // Step 3: Accreditation
  accreditationType?: AccreditationType;
  accreditationDocuments?: File[];

  // Step 4: KYC
  kycStatus?: KYCStatus;
  kycSessionId?: string;

  // Step 5: AML
  amlScreeningPassed?: boolean;
  isPEP?: boolean;
  sourceOfWealth?: string;

  // Step 6: Documents
  documentsSigned?: boolean;
  signatureData?: string;

  // Step 7: Funding
  fundingMethod?: 'wire' | 'crypto';
  bankDetails?: any;
  walletAddress?: string;
}

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [data, setData] = useState<OnboardingData>({});
  const [loading, setLoading] = useState(false);
  const [kycStatus, setKycStatus] = useState<KYCStatus>('pending');

  const steps = [
    {
      title: 'Account',
      icon: <UserOutlined />,
    },
    {
      title: 'Profile',
      icon: <IdcardOutlined />,
    },
    {
      title: 'Accreditation',
      icon: <SafetyOutlined />,
    },
    {
      title: 'KYC',
      icon: <IdcardOutlined />,
    },
    {
      title: 'AML',
      icon: <SafetyOutlined />,
    },
    {
      title: 'Documents',
      icon: <FileTextOutlined />,
    },
    {
      title: 'Funding',
      icon: <BankOutlined />,
    },
  ];

  const handleNext = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      setData({ ...data, ...values });
      setCurrentStep(currentStep + 1);
    } catch (error) {
      message.error('Please fill in all required fields');
    }
  };

  const handlePrevious = () => {
    const values = form.getFieldsValue();
    setData({ ...data, ...values });
    setCurrentStep(currentStep - 1);
  };

  const handleStartKYC = () => {
    setLoading(true);
    setKycStatus('in-progress');
    // Simulate KYC verification
    setTimeout(() => {
      setKycStatus('completed');
      setLoading(false);
      message.success('KYC verification completed successfully!');
    }, 3000);
  };

  const handleFinish = () => {
    message.success('Onboarding completed successfully!');
    // Redirect to dashboard
  };

  const calculateProgress = () => {
    return Math.round(((currentStep + 1) / steps.length) * 100);
  };

  const calculateTimeRemaining = () => {
    const avgTimePerStep = 5; // minutes
    const remainingSteps = steps.length - currentStep - 1;
    return remainingSteps * avgTimePerStep;
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%', padding: '24px' }}>
      <Card>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Title level={3}>Investor Onboarding</Title>
          <Progress percent={calculateProgress()} status="active" />
          <Text type="secondary">
            Step {currentStep + 1} of {steps.length} • Estimated time remaining: {calculateTimeRemaining()} minutes
          </Text>
        </Space>
      </Card>

      <Card>
        <Steps current={currentStep} items={steps} />
      </Card>

      <Form form={form} layout="vertical" initialValues={data}>
        {/* Step 0: Account Creation */}
        {currentStep === 0 && (
          <Card title="Create Your Account">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
                  <Input placeholder="John" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
                  <Input placeholder="Doe" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[{ required: true, type: 'email' }]}
                >
                  <Input placeholder="john.doe@example.com" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true, min: 8 }]}
                >
                  <Input.Password placeholder="Min 8 characters" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
                  <Input placeholder="+1 (555) 123-4567" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        )}

        {/* Step 1: Investor Profile */}
        {currentStep === 1 && (
          <Card title="Investor Profile">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="dateOfBirth" label="Date of Birth" rules={[{ required: true }]}>
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="nationality" label="Nationality" rules={[{ required: true }]}>
                  <Select
                    placeholder="Select nationality"
                    options={[
                      { label: 'United States', value: 'US' },
                      { label: 'United Kingdom', value: 'UK' },
                      { label: 'Canada', value: 'CA' },
                      { label: 'Mexico', value: 'MX' },
                      { label: 'Other', value: 'OTHER' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="address" label="Street Address" rules={[{ required: true }]}>
                  <Input placeholder="123 Main Street" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="city" label="City" rules={[{ required: true }]}>
                  <Input placeholder="New York" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="zipCode" label="ZIP Code" rules={[{ required: true }]}>
                  <Input placeholder="10001" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        )}

        {/* Step 2: Accreditation Verification */}
        {currentStep === 2 && (
          <Card title="Accreditation Verification">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Paragraph>
                To invest in certain funds, you must be an accredited investor. Please select your
                accreditation type:
              </Paragraph>
              <Form.Item name="accreditationType" rules={[{ required: true }]}>
                <Radio.Group>
                  <Space direction="vertical">
                    <Radio value="income">
                      <strong>Income-based:</strong> Individual income exceeding $200,000 (or
                      $300,000 with spouse) in each of the past two years
                    </Radio>
                    <Radio value="networth">
                      <strong>Net worth-based:</strong> Net worth exceeding $1,000,000 (excluding
                      primary residence)
                    </Radio>
                    <Radio value="professional">
                      <strong>Professional certification:</strong> Series 7, 65, or 82 license
                    </Radio>
                    <Radio value="entity">
                      <strong>Entity-based:</strong> Entity with assets exceeding $5,000,000
                    </Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name="accreditationDocuments"
                label="Upload Supporting Documents"
                rules={[{ required: true }]}
              >
                <Upload.Dragger
                  multiple
                  accept=".pdf,.jpg,.png"
                  beforeUpload={() => false}
                >
                  <p className="ant-upload-drag-icon">
                    <FileTextOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag files to upload</p>
                  <p className="ant-upload-hint">
                    Accepted formats: PDF, JPG, PNG (Max 10MB per file)
                  </p>
                </Upload.Dragger>
              </Form.Item>
            </Space>
          </Card>
        )}

        {/* Step 3: KYC Verification */}
        {currentStep === 3 && (
          <Card title="Identity Verification (KYC)">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {kycStatus === 'pending' && (
                <>
                  <Paragraph>
                    We use a secure third-party service (Persona) to verify your identity. This
                    process typically takes 2-3 minutes.
                  </Paragraph>
                  <Paragraph>
                    <strong>What you'll need:</strong>
                  </Paragraph>
                  <ul>
                    <li>Government-issued ID (passport, driver's license, or national ID)</li>
                    <li>A device with a camera for liveness check</li>
                    <li>Proof of address (utility bill, bank statement)</li>
                  </ul>
                  <Button
                    type="primary"
                    size="large"
                    icon={<SafetyOutlined />}
                    onClick={handleStartKYC}
                  >
                    Start Identity Verification
                  </Button>
                </>
              )}

              {kycStatus === 'in-progress' && (
                <Result
                  icon={<LoadingOutlined />}
                  title="Verification in Progress"
                  subTitle="Please wait while we verify your identity..."
                  extra={<Progress percent={60} status="active" />}
                />
              )}

              {kycStatus === 'completed' && (
                <Result
                  status="success"
                  title="Identity Verified Successfully!"
                  subTitle="Your identity has been verified. You can proceed to the next step."
                />
              )}
            </Space>
          </Card>
        )}

        {/* Step 4: AML Screening */}
        {currentStep === 4 && (
          <Card title="AML Screening">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Paragraph>
                As part of our compliance requirements, we need to collect additional information
                for Anti-Money Laundering (AML) screening.
              </Paragraph>

              <Form.Item
                name="isPEP"
                label="Are you a Politically Exposed Person (PEP)?"
                rules={[{ required: true }]}
              >
                <Radio.Group>
                  <Radio value={false}>No</Radio>
                  <Radio value={true}>Yes</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name="sourceOfWealth"
                label="Source of Wealth"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select source"
                  options={[
                    { label: 'Employment/Salary', value: 'employment' },
                    { label: 'Business Ownership', value: 'business' },
                    { label: 'Inheritance', value: 'inheritance' },
                    { label: 'Investment Income', value: 'investment' },
                    { label: 'Real Estate', value: 'real-estate' },
                    { label: 'Other', value: 'other' },
                  ]}
                />
              </Form.Item>

              <Form.Item
                name="sourceOfWealthDetails"
                label="Additional Details"
                rules={[{ required: true }]}
              >
                <TextArea rows={4} placeholder="Please provide details about your source of wealth" />
              </Form.Item>
            </Space>
          </Card>
        )}

        {/* Step 5: Subscription Documents */}
        {currentStep === 5 && (
          <Card title="Review & Sign Documents">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Paragraph>
                Please review and sign the following documents to complete your onboarding:
              </Paragraph>

              <Card size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>1. Subscription Agreement</Text>
                  <Text type="secondary">
                    This agreement outlines the terms and conditions of your investment.
                  </Text>
                  <Button type="link">Download & Review</Button>
                </Space>
              </Card>

              <Card size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>2. Risk Disclosure Statement</Text>
                  <Text type="secondary">
                    Important information about investment risks.
                  </Text>
                  <Button type="link">Download & Review</Button>
                </Space>
              </Card>

              <Card size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>3. Privacy Policy</Text>
                  <Text type="secondary">
                    How we collect, use, and protect your personal information.
                  </Text>
                  <Button type="link">Download & Review</Button>
                </Space>
              </Card>

              <Form.Item
                name="documentsSigned"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject(new Error('You must agree to the terms')),
                  },
                ]}
              >
                <Radio.Group>
                  <Radio value={true}>
                    I have read and agree to all the documents above
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Space>
          </Card>
        )}

        {/* Step 6: Funding Setup */}
        {currentStep === 6 && (
          <Card title="Funding Setup">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Paragraph>
                Set up your funding method to start investing. You can add additional methods later.
              </Paragraph>

              <Form.Item name="fundingMethod" label="Select Funding Method" rules={[{ required: true }]}>
                <Radio.Group>
                  <Space direction="vertical">
                    <Radio value="wire">
                      <strong>Wire Transfer</strong> - Link your bank account for wire transfers
                    </Radio>
                    <Radio value="crypto">
                      <strong>Cryptocurrency</strong> - Connect your crypto wallet (USDC, USDT, ETH)
                    </Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>

              {form.getFieldValue('fundingMethod') === 'wire' && (
                <>
                  <Form.Item name="bankName" label="Bank Name" rules={[{ required: true }]}>
                    <Input placeholder="Bank of America" />
                  </Form.Item>
                  <Form.Item name="accountNumber" label="Account Number" rules={[{ required: true }]}>
                    <Input placeholder="1234567890" />
                  </Form.Item>
                  <Form.Item name="routingNumber" label="Routing Number" rules={[{ required: true }]}>
                    <Input placeholder="021000021" />
                  </Form.Item>
                </>
              )}

              {form.getFieldValue('fundingMethod') === 'crypto' && (
                <Form.Item name="walletAddress" label="Wallet Address" rules={[{ required: true }]}>
                  <Input placeholder="0x..." />
                </Form.Item>
              )}
            </Space>
          </Card>
        )}
      </Form>

      {/* Navigation */}
      <Card>
        <Row justify="space-between" align="middle">
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
            <Text type="secondary">
              Step {currentStep + 1} of {steps.length}
            </Text>
          </Col>
          <Col>
            {currentStep < steps.length - 1 ? (
              <Button
                type="primary"
                icon={<RightOutlined />}
                onClick={handleNext}
                disabled={currentStep === 3 && kycStatus !== 'completed'}
              >
                Next
              </Button>
            ) : (
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={handleFinish}
              >
                Complete Onboarding
              </Button>
            )}
          </Col>
        </Row>
      </Card>

      <Card>
        <Text type="secondary">
          Need help? Contact our support team at support@naveo.com
        </Text>
      </Card>
    </Space>
  );
};

export default OnboardingPage;
