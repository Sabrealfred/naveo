import { Card, Steps, Button, Form, Input, Select, Upload, Checkbox, Result, Row, Col, Alert, Progress, Timeline, message, Radio } from 'antd';
import {
  UserOutlined,
  SafetyOutlined,
  FileTextOutlined,
  BankOutlined,
  CheckCircleOutlined,
  UploadOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { useState } from 'react';

const { TextArea } = Input;

export default function OnboardingFlowPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [form] = Form.useForm();

  const steps = [
    {
      title: 'Personal Info',
      icon: <UserOutlined />,
      description: 'Basic information',
    },
    {
      title: 'KYC Verification',
      icon: <SafetyOutlined />,
      description: 'Identity verification',
    },
    {
      title: 'Risk Assessment',
      icon: <FileTextOutlined />,
      description: 'Investment profile',
    },
    {
      title: 'Wallet Setup',
      icon: <BankOutlined />,
      description: 'Connect wallet',
    },
    {
      title: 'Complete',
      icon: <CheckCircleOutlined />,
      description: 'All done!',
    },
  ];

  const handleNext = () => {
    form.validateFields().then((values) => {
      setFormData({ ...formData, ...values });
      setCurrentStep(currentStep + 1);
      form.resetFields();
      message.success('Step completed successfully!');
    }).catch((error) => {
      message.error('Please fill in all required fields');
    });
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFinish = () => {
    message.success('Onboarding completed successfully!');
    // Redirect to dashboard
  };

  // Step 0: Personal Information
  const PersonalInfoStep = () => (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 24, fontFamily: 'var(--font-heading)' }}>Personal Information</h2>
      <p style={{ marginBottom: 24, color: '#666' }}>
        Let's start with some basic information about you.
      </p>

      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: 'Please enter your first name' }]}
            >
              <Input placeholder="John" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: 'Please enter your last name' }]}
            >
              <Input placeholder="Doe" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Email Address"
          name="email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input placeholder="john.doe@example.com" />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phone"
          rules={[{ required: true, message: 'Please enter your phone number' }]}
        >
          <Input placeholder="+1 (555) 123-4567" />
        </Form.Item>

        <Form.Item
          label="Date of Birth"
          name="dob"
          rules={[{ required: true, message: 'Please enter your date of birth' }]}
        >
          <Input type="date" />
        </Form.Item>

        <Form.Item
          label="Country of Residence"
          name="country"
          rules={[{ required: true, message: 'Please select your country' }]}
        >
          <Select placeholder="Select country">
            <Select.Option value="us">United States</Select.Option>
            <Select.Option value="uk">United Kingdom</Select.Option>
            <Select.Option value="ca">Canada</Select.Option>
            <Select.Option value="au">Australia</Select.Option>
            <Select.Option value="de">Germany</Select.Option>
            <Select.Option value="fr">France</Select.Option>
            <Select.Option value="es">Spain</Select.Option>
            <Select.Option value="it">Italy</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: 'Please enter your address' }]}
        >
          <TextArea rows={3} placeholder="Street address, city, state, ZIP code" />
        </Form.Item>
      </Form>
    </div>
  );

  // Step 1: KYC Verification
  const KYCVerificationStep = () => (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 24, fontFamily: 'var(--font-heading)' }}>KYC Verification</h2>
      <p style={{ marginBottom: 24, color: '#666' }}>
        Please upload the required documents to verify your identity.
      </p>

      <Alert
        message="Required Documents"
        description="We need to verify your identity to comply with regulations. All information is securely encrypted."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Form form={form} layout="vertical">
        <Form.Item
          label="Government-Issued ID Type"
          name="idType"
          rules={[{ required: true, message: 'Please select ID type' }]}
        >
          <Select placeholder="Select ID type">
            <Select.Option value="passport">Passport</Select.Option>
            <Select.Option value="drivers_license">Driver's License</Select.Option>
            <Select.Option value="national_id">National ID Card</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="ID Number"
          name="idNumber"
          rules={[{ required: true, message: 'Please enter your ID number' }]}
        >
          <Input placeholder="Enter ID number" />
        </Form.Item>

        <Form.Item
          label="Upload ID Document (Front)"
          name="idFront"
          rules={[{ required: true, message: 'Please upload front of ID' }]}
        >
          <Upload
            listType="picture-card"
            maxCount={1}
            beforeUpload={() => false}
          >
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Upload ID Document (Back)"
          name="idBack"
        >
          <Upload
            listType="picture-card"
            maxCount={1}
            beforeUpload={() => false}
          >
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Proof of Address (Utility Bill, Bank Statement)"
          name="proofOfAddress"
          rules={[{ required: true, message: 'Please upload proof of address' }]}
        >
          <Upload
            listType="picture-card"
            maxCount={1}
            beforeUpload={() => false}
          >
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>

        <Form.Item
          name="kycConsent"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error('You must consent to verification')),
            },
          ]}
        >
          <Checkbox>
            I consent to the verification of my identity and understand that my information will be securely stored.
          </Checkbox>
        </Form.Item>
      </Form>
    </div>
  );

  // Step 2: Risk Assessment
  const RiskAssessmentStep = () => (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 24, fontFamily: 'var(--font-heading)' }}>Investment Profile & Risk Assessment</h2>
      <p style={{ marginBottom: 24, color: '#666' }}>
        Help us understand your investment goals and risk tolerance.
      </p>

      <Form form={form} layout="vertical">
        <Form.Item
          label="Investment Experience"
          name="experience"
          rules={[{ required: true, message: 'Please select your experience level' }]}
        >
          <Radio.Group>
            <Radio value="beginner" style={{ display: 'block', marginBottom: 8 }}>
              Beginner - Little to no investment experience
            </Radio>
            <Radio value="intermediate" style={{ display: 'block', marginBottom: 8 }}>
              Intermediate - Some experience with traditional investments
            </Radio>
            <Radio value="advanced" style={{ display: 'block', marginBottom: 8 }}>
              Advanced - Experienced with crypto and alternative investments
            </Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Investment Goal"
          name="goal"
          rules={[{ required: true, message: 'Please select your investment goal' }]}
        >
          <Select placeholder="Select your primary goal">
            <Select.Option value="growth">Capital Growth</Select.Option>
            <Select.Option value="income">Regular Income</Select.Option>
            <Select.Option value="balanced">Balanced Growth & Income</Select.Option>
            <Select.Option value="preservation">Capital Preservation</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Investment Time Horizon"
          name="timeHorizon"
          rules={[{ required: true, message: 'Please select time horizon' }]}
        >
          <Select placeholder="Select time horizon">
            <Select.Option value="short">Short-term (&lt; 1 year)</Select.Option>
            <Select.Option value="medium">Medium-term (1-5 years)</Select.Option>
            <Select.Option value="long">Long-term (&gt; 5 years)</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Risk Tolerance"
          name="riskTolerance"
          rules={[{ required: true, message: 'Please select risk tolerance' }]}
        >
          <Radio.Group>
            <Radio value="conservative" style={{ display: 'block', marginBottom: 8 }}>
              <strong>Conservative</strong> - I prefer stable returns with minimal risk
            </Radio>
            <Radio value="moderate" style={{ display: 'block', marginBottom: 8 }}>
              <strong>Moderate</strong> - I can accept some volatility for better returns
            </Radio>
            <Radio value="aggressive" style={{ display: 'block', marginBottom: 8 }}>
              <strong>Aggressive</strong> - I'm comfortable with high risk for high potential returns
            </Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Initial Investment Amount"
          name="initialInvestment"
          rules={[{ required: true, message: 'Please enter initial investment amount' }]}
        >
          <Select placeholder="Select amount range">
            <Select.Option value="0-10k">$0 - $10,000</Select.Option>
            <Select.Option value="10k-50k">$10,000 - $50,000</Select.Option>
            <Select.Option value="50k-100k">$50,000 - $100,000</Select.Option>
            <Select.Option value="100k-500k">$100,000 - $500,000</Select.Option>
            <Select.Option value="500k+">$500,000+</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Annual Income"
          name="annualIncome"
          rules={[{ required: true, message: 'Please select annual income' }]}
        >
          <Select placeholder="Select income range">
            <Select.Option value="0-50k">$0 - $50,000</Select.Option>
            <Select.Option value="50k-100k">$50,000 - $100,000</Select.Option>
            <Select.Option value="100k-250k">$100,000 - $250,000</Select.Option>
            <Select.Option value="250k-500k">$250,000 - $500,000</Select.Option>
            <Select.Option value="500k+">$500,000+</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="riskDisclosure"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error('You must acknowledge the risks')),
            },
          ]}
        >
          <Checkbox>
            I understand that cryptocurrency investments carry significant risks and I may lose all my invested capital.
          </Checkbox>
        </Form.Item>
      </Form>
    </div>
  );

  // Step 3: Wallet Setup
  const WalletSetupStep = () => (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 24, fontFamily: 'var(--font-heading)' }}>Connect Your Wallet</h2>
      <p style={{ marginBottom: 24, color: '#666' }}>
        Connect your crypto wallet to start investing.
      </p>

      <Alert
        message="Secure Connection"
        description="Your wallet connection is encrypted and secure. We never have access to your private keys."
        type="success"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card
            hoverable
            style={{ textAlign: 'center' }}
            onClick={() => message.info('Connecting to MetaMask...')}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>🦊</div>
            <h3>MetaMask</h3>
            <p style={{ color: '#666' }}>Most popular wallet</p>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            hoverable
            style={{ textAlign: 'center' }}
            onClick={() => message.info('Connecting to WalletConnect...')}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔗</div>
            <h3>WalletConnect</h3>
            <p style={{ color: '#666' }}>Mobile wallets</p>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            hoverable
            style={{ textAlign: 'center' }}
            onClick={() => message.info('Connecting to Coinbase Wallet...')}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>💼</div>
            <h3>Coinbase Wallet</h3>
            <p style={{ color: '#666' }}>Coinbase users</p>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            hoverable
            style={{ textAlign: 'center' }}
            onClick={() => message.info('Connecting to Ledger...')}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
            <h3>Ledger</h3>
            <p style={{ color: '#666' }}>Hardware wallet</p>
          </Card>
        </Col>
      </Row>

      <Form form={form} layout="vertical">
        <Form.Item
          name="walletConsent"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error('You must accept the terms')),
            },
          ]}
        >
          <Checkbox>
            I understand that I am responsible for the security of my wallet and private keys.
          </Checkbox>
        </Form.Item>
      </Form>
    </div>
  );

  // Step 4: Completion
  const CompletionStep = () => (
    <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
      <Result
        status="success"
        title="Onboarding Complete!"
        subTitle="Your account has been successfully set up. You can now start investing in tokenized funds."
        extra={[
          <Button type="primary" size="large" key="dashboard" onClick={handleFinish}>
            Go to Dashboard
          </Button>,
          <Button size="large" key="marketplace">
            Browse Marketplace
          </Button>,
        ]}
      />

      <Card style={{ marginTop: 32, textAlign: 'left' }}>
        <h3 style={{ marginBottom: 16 }}>What's Next?</h3>
        <Timeline
          items={[
            {
              children: <div><strong>Browse Funds</strong><br />Explore available investment opportunities</div>,
            },
            {
              children: <div><strong>Make Your First Investment</strong><br />Start with as little as $100</div>,
            },
            {
              children: <div><strong>Track Performance</strong><br />Monitor your portfolio in real-time</div>,
            },
            {
              children: <div><strong>Manage Investments</strong><br />Buy, sell, or rebalance anytime</div>,
            },
          ]}
        />
      </Card>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoStep />;
      case 1:
        return <KYCVerificationStep />;
      case 2:
        return <RiskAssessmentStep />;
      case 3:
        return <WalletSetupStep />;
      case 4:
        return <CompletionStep />;
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ marginBottom: 8, fontFamily: 'var(--font-heading)', fontSize: '28px' }}>
            Investor Onboarding
          </h1>
          <p style={{ color: '#666' }}>
            Complete the following steps to get started with Naveo
          </p>
        </div>

        <Steps current={currentStep} items={steps} style={{ marginBottom: 48 }} />

        <div style={{ minHeight: 400 }}>
          {renderStepContent()}
        </div>

        {currentStep < 4 && (
          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              size="large"
              onClick={handlePrev}
              disabled={currentStep === 0}
              icon={<ArrowLeftOutlined />}
            >
              Previous
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={handleNext}
              icon={<ArrowRightOutlined />}
              iconPosition="end"
            >
              {currentStep === 3 ? 'Complete Onboarding' : 'Next'}
            </Button>
          </div>
        )}

        <div style={{ marginTop: 32 }}>
          <Progress percent={((currentStep + 1) / steps.length) * 100} showInfo={false} />
          <div style={{ textAlign: 'center', marginTop: 8, color: '#666', fontSize: '12px' }}>
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
      </Card>
    </div>
  );
}
