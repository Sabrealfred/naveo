import { useState, useMemo } from 'react';
import {
  Modal,
  Form,
  InputNumber,
  Radio,
  Space,
  Typography,
  Divider,
  Steps,
  Result,
  Button,
  Alert,
  Card,
} from 'antd';
import {
  DollarOutlined,
  BankOutlined,
  CreditCardOutlined,
  CheckCircleTwoTone,
  InfoCircleOutlined,
} from '@ant-design/icons';

const { Text, Title } = Typography;

interface DepositModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (values: DepositConfirmation) => void;
  currentBalance?: number;
}

interface DepositFormValues {
  amount: number;
  paymentMethod: 'wire' | 'card' | 'crypto';
}

interface DepositConfirmation extends DepositFormValues {
  fee: number;
  totalAmount: number;
}

const STEP_TITLES = ['Amount & Method', 'Instructions', 'Confirmation'];
const FEE_RATES = {
  wire: 0,
  card: 0.029, // 2.9%
  crypto: 0.005, // 0.5%
};

const DepositModal = ({
  visible,
  onClose,
  onSubmit,
  currentBalance = 0,
}: DepositModalProps) => {
  const [form] = Form.useForm<DepositFormValues>();
  const [currentStep, setCurrentStep] = useState(0);
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'wire' | 'card' | 'crypto'>('wire');
  const [processing, setProcessing] = useState(false);
  const [reviewData, setReviewData] = useState<DepositConfirmation | null>(null);

  const totals = useMemo(() => {
    const feeRate = FEE_RATES[paymentMethod];
    const fee = amount * feeRate;
    const totalAmount = amount + fee;
    return { fee, totalAmount };
  }, [amount, paymentMethod]);

  const resetState = () => {
    form.resetFields();
    setAmount(0);
    setPaymentMethod('wire');
    setCurrentStep(0);
    setProcessing(false);
    setReviewData(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload: DepositConfirmation = {
        ...values,
        fee: totals.fee,
        totalAmount: totals.totalAmount,
      };
      setReviewData(payload);
      setCurrentStep(1);
    } catch {
      // validation errors handled by Form
    }
  };

  const handleConfirm = () => {
    if (!reviewData) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setCurrentStep(2);
      onSubmit?.(reviewData);
    }, 1500);
  };

  const renderInstructions = () => {
    if (!reviewData) return null;

    const instructions = {
      wire: {
        title: 'Wire Transfer Instructions',
        icon: <BankOutlined style={{ fontSize: 48, color: '#1890ff' }} />,
        content: (
          <>
            <Alert
              message="Important"
              description="Please include your account ID in the transfer reference to ensure proper crediting."
              type="info"
              showIcon
              icon={<InfoCircleOutlined />}
              style={{ marginBottom: 16 }}
            />
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Text strong>Bank Name:</Text>
              <Text>JPMorgan Chase Bank, N.A.</Text>
              <Divider style={{ margin: '8px 0' }} />
              <Text strong>Account Name:</Text>
              <Text>MiraLabs Platform LLC</Text>
              <Divider style={{ margin: '8px 0' }} />
              <Text strong>Account Number:</Text>
              <Text copyable>1234567890</Text>
              <Divider style={{ margin: '8px 0' }} />
              <Text strong>Routing Number:</Text>
              <Text copyable>021000021</Text>
              <Divider style={{ margin: '8px 0' }} />
              <Text strong>SWIFT Code:</Text>
              <Text copyable>CHASUS33</Text>
              <Divider style={{ margin: '8px 0' }} />
              <Text strong>Reference:</Text>
              <Text copyable>USER-{Math.random().toString(36).substr(2, 9).toUpperCase()}</Text>
              <Divider style={{ margin: '8px 0' }} />
              <Text strong>Amount:</Text>
              <Text>${reviewData.amount.toLocaleString()}</Text>
            </Space>
            <Alert
              message="Processing Time: 1-3 business days"
              type="warning"
              showIcon
              style={{ marginTop: 16 }}
            />
          </>
        ),
      },
      card: {
        title: 'Credit/Debit Card Payment',
        icon: <CreditCardOutlined style={{ fontSize: 48, color: '#52c41a' }} />,
        content: (
          <>
            <Alert
              message="Instant Processing"
              description="Card payments are processed immediately and will be available in your account within minutes."
              type="success"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Text>You will be redirected to our secure payment processor to complete your deposit.</Text>
              <Divider style={{ margin: '8px 0' }} />
              <Text strong>Amount to Charge:</Text>
              <Text>${reviewData.totalAmount.toLocaleString()} (includes {(FEE_RATES.card * 100).toFixed(1)}% processing fee)</Text>
              <Divider style={{ margin: '8px 0' }} />
              <Text strong>Amount to Credit:</Text>
              <Text>${reviewData.amount.toLocaleString()}</Text>
            </Space>
          </>
        ),
      },
      crypto: {
        title: 'Cryptocurrency Deposit',
        icon: <DollarOutlined style={{ fontSize: 48, color: '#722ed1' }} />,
        content: (
          <>
            <Alert
              message="Fast Processing"
              description="Crypto deposits are typically confirmed within 15-30 minutes depending on network congestion."
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Text strong>Accepted Stablecoins:</Text>
              <Text>USDC, USDT (ERC-20)</Text>
              <Divider style={{ margin: '8px 0' }} />
              <Text strong>Deposit Address:</Text>
              <Text copyable>0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb</Text>
              <Divider style={{ margin: '8px 0' }} />
              <Text strong>Network:</Text>
              <Text>Ethereum (ERC-20) or Polygon</Text>
              <Divider style={{ margin: '8px 0' }} />
              <Text strong>Amount:</Text>
              <Text>${reviewData.amount.toLocaleString()} USD equivalent</Text>
              <Divider style={{ margin: '8px 0' }} />
              <Text strong>Fee:</Text>
              <Text>${reviewData.fee.toFixed(2)} ({(FEE_RATES.crypto * 100).toFixed(1)}%)</Text>
            </Space>
            <Alert
              message="Important: Only send USDC or USDT on supported networks"
              description="Sending any other token or using an unsupported network will result in permanent loss of funds."
              type="error"
              showIcon
              style={{ marginTop: 16 }}
            />
          </>
        ),
      },
    };

    const selected = instructions[reviewData.paymentMethod];

    return (
      <Card style={{ marginTop: 16 }}>
        <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
          {selected.icon}
          <Title level={4} style={{ margin: 0 }}>{selected.title}</Title>
        </Space>
        <Divider />
        {selected.content}
      </Card>
    );
  };

  const stepsContent = [
    // Step 1: Amount & Method
    (
      <Form
        key="form"
        form={form}
        layout="vertical"
        initialValues={{ paymentMethod: 'wire' }}
      >
        <Card style={{ background: '#fafafa', marginBottom: 16 }}>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Text type="secondary">Current Balance</Text>
            <Title level={3} style={{ margin: 0 }}>${currentBalance.toLocaleString()}</Title>
          </Space>
        </Card>

        <Form.Item
          label="Deposit Amount"
          name="amount"
          rules={[
            { required: true, message: 'Please enter deposit amount' },
            {
              validator: (_, value) => {
                if (!value || value <= 0) {
                  return Promise.reject(new Error('Amount must be greater than 0'));
                }
                if (value < 100) {
                  return Promise.reject(new Error('Minimum deposit is $100'));
                }
                if (value > 1000000) {
                  return Promise.reject(new Error('Maximum deposit is $1,000,000'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            min={100}
            max={1000000}
            step={100}
            precision={2}
            style={{ width: '100%' }}
            prefix="$"
            onChange={(value) => setAmount(value ?? 0)}
          />
        </Form.Item>

        <Form.Item
          label="Payment Method"
          name="paymentMethod"
          rules={[{ required: true, message: 'Select a payment method' }]}
        >
          <Radio.Group onChange={(e) => setPaymentMethod(e.target.value)}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Radio value="wire">
                <Space>
                  <BankOutlined />
                  <div>
                    <div>Wire Transfer</div>
                    <Text type="secondary" style={{ fontSize: 12 }}>No fees • 1-3 business days</Text>
                  </div>
                </Space>
              </Radio>
              <Radio value="card">
                <Space>
                  <CreditCardOutlined />
                  <div>
                    <div>Credit/Debit Card</div>
                    <Text type="secondary" style={{ fontSize: 12 }}>2.9% fee • Instant</Text>
                  </div>
                </Space>
              </Radio>
              <Radio value="crypto">
                <Space>
                  <DollarOutlined />
                  <div>
                    <div>USDC / USDT</div>
                    <Text type="secondary" style={{ fontSize: 12 }}>0.5% fee • 15-30 minutes</Text>
                  </div>
                </Space>
              </Radio>
            </Space>
          </Radio.Group>
        </Form.Item>

        <Divider />
        <div style={{ background: '#f5f5f5', borderRadius: 8, padding: 16 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>Deposit Amount</Text>
              <Text strong>${amount.toLocaleString()}</Text>
            </div>
            {totals.fee > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Processing Fee ({(FEE_RATES[paymentMethod] * 100).toFixed(1)}%)</Text>
                <Text>${totals.fee.toFixed(2)}</Text>
              </div>
            )}
            <Divider style={{ margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong>Total to Pay</Text>
              <Text strong style={{ fontSize: 18 }}>${totals.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
            </div>
          </Space>
        </div>
      </Form>
    ),
    // Step 2: Instructions
    (
      <div key="instructions">
        {renderInstructions()}
      </div>
    ),
    // Step 3: Confirmation
    (
      <Result
        key="result"
        status="success"
        title="Deposit Initiated"
        subTitle="Your deposit has been initiated. You will receive a confirmation email with tracking details."
        icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
        extra={[
          <Button type="primary" key="done" onClick={handleClose}>
            Done
          </Button>,
        ]}
      />
    ),
  ];

  const renderFooter = () => {
    if (currentStep === 0) {
      return [
        <Button key="cancel" onClick={handleClose}>
          Cancel
        </Button>,
        <Button key="next" type="primary" onClick={handleFormSubmit}>
          Continue
        </Button>,
      ];
    }

    if (currentStep === 1) {
      return [
        <Button key="back" onClick={() => setCurrentStep(0)} disabled={processing}>
          Back
        </Button>,
        <Button key="confirm" type="primary" loading={processing} onClick={handleConfirm}>
          Confirm Deposit
        </Button>,
      ];
    }

    return null;
  };

  return (
    <Modal
      title="Deposit Funds"
      open={visible}
      onCancel={handleClose}
      footer={currentStep === 2 ? null : renderFooter()}
      width={640}
      destroyOnClose
    >
      <Steps
        current={currentStep}
        items={STEP_TITLES.map((title) => ({ title }))}
        style={{ marginBottom: 24 }}
      />

      {stepsContent[currentStep]}
    </Modal>
  );
};

export default DepositModal;
