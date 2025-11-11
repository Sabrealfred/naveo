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
  Input,
  Select,
} from 'antd';
import {
  DollarOutlined,
  BankOutlined,
  CheckCircleTwoTone,
  WarningOutlined,
} from '@ant-design/icons';

const { Text, Title } = Typography;
const { Option } = Select;

interface WithdrawalModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (values: WithdrawalConfirmation) => void;
  availableBalance?: number;
}

interface WithdrawalFormValues {
  amount: number;
  withdrawalMethod: 'wire' | 'crypto';
  bankAccount?: string;
  cryptoAddress?: string;
  cryptoNetwork?: 'ethereum' | 'polygon';
}

interface WithdrawalConfirmation extends WithdrawalFormValues {
  fee: number;
  netAmount: number;
}

const STEP_TITLES = ['Amount & Method', 'Account Details', 'Confirmation'];
const WITHDRAWAL_FEES = {
  wire: 25, // Flat fee
  crypto: 0.01, // 1% fee
};

const WithdrawalModal = ({
  visible,
  onClose,
  onSubmit,
  availableBalance = 0,
}: WithdrawalModalProps) => {
  const [form] = Form.useForm<WithdrawalFormValues>();
  const [currentStep, setCurrentStep] = useState(0);
  const [amount, setAmount] = useState<number>(0);
  const [withdrawalMethod, setWithdrawalMethod] = useState<'wire' | 'crypto'>('wire');
  const [processing, setProcessing] = useState(false);
  const [reviewData, setReviewData] = useState<WithdrawalConfirmation | null>(null);

  const totals = useMemo(() => {
    const fee = withdrawalMethod === 'wire' ? WITHDRAWAL_FEES.wire : amount * WITHDRAWAL_FEES.crypto;
    const netAmount = Math.max(amount - fee, 0);
    return { fee, netAmount };
  }, [amount, withdrawalMethod]);

  const resetState = () => {
    form.resetFields();
    setAmount(0);
    setWithdrawalMethod('wire');
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
      const payload: WithdrawalConfirmation = {
        ...values,
        fee: totals.fee,
        netAmount: totals.netAmount,
      };
      setReviewData(payload);
      setCurrentStep(1);
    } catch {
      // validation errors handled by Form
    }
  };

  const handleDetailsSubmit = async () => {
    try {
      await form.validateFields();
      setCurrentStep(2);
    } catch {
      // validation errors handled by Form
    }
  };

  const handleConfirm = () => {
    if (!reviewData) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setCurrentStep(3);
      onSubmit?.(reviewData);
    }, 1500);
  };

  const stepsContent = [
    // Step 1: Amount & Method
    (
      <Form
        key="form"
        form={form}
        layout="vertical"
        initialValues={{ withdrawalMethod: 'wire' }}
      >
        <Card style={{ background: '#fafafa', marginBottom: 16 }}>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Text type="secondary">Available Balance</Text>
            <Title level={3} style={{ margin: 0, color: '#52c41a' }}>
              ${availableBalance.toLocaleString()}
            </Title>
          </Space>
        </Card>

        <Form.Item
          label="Withdrawal Amount"
          name="amount"
          rules={[
            { required: true, message: 'Please enter withdrawal amount' },
            {
              validator: (_, value) => {
                if (!value || value <= 0) {
                  return Promise.reject(new Error('Amount must be greater than 0'));
                }
                if (value < 100) {
                  return Promise.reject(new Error('Minimum withdrawal is $100'));
                }
                if (value > availableBalance) {
                  return Promise.reject(new Error('Insufficient balance'));
                }
                const fee = withdrawalMethod === 'wire' ? WITHDRAWAL_FEES.wire : value * WITHDRAWAL_FEES.crypto;
                if (value + fee > availableBalance) {
                  return Promise.reject(new Error(`Amount + fee ($${fee.toFixed(2)}) exceeds available balance`));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            min={100}
            max={availableBalance}
            step={100}
            precision={2}
            style={{ width: '100%' }}
            prefix="$"
            onChange={(value) => setAmount(value ?? 0)}
          />
        </Form.Item>

        <Form.Item
          label="Withdrawal Method"
          name="withdrawalMethod"
          rules={[{ required: true, message: 'Select a withdrawal method' }]}
        >
          <Radio.Group onChange={(e) => setWithdrawalMethod(e.target.value)}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Radio value="wire">
                <Space>
                  <BankOutlined />
                  <div>
                    <div>Wire Transfer</div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      $25 flat fee • 1-3 business days
                    </Text>
                  </div>
                </Space>
              </Radio>
              <Radio value="crypto">
                <Space>
                  <DollarOutlined />
                  <div>
                    <div>USDC (Stablecoin)</div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      1% fee • 15-30 minutes
                    </Text>
                  </div>
                </Space>
              </Radio>
            </Space>
          </Radio.Group>
        </Form.Item>

        <Alert
          message="Important"
          description="Withdrawals are processed during business hours (Mon-Fri, 9am-5pm EST). Requests submitted outside these hours will be processed on the next business day."
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          style={{ marginBottom: 16 }}
        />

        <Divider />
        <div style={{ background: '#f5f5f5', borderRadius: 8, padding: 16 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>Withdrawal Amount</Text>
              <Text strong>${amount.toLocaleString()}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>
                Fee ({withdrawalMethod === 'wire' ? '$25 flat' : '1%'})
              </Text>
              <Text>${totals.fee.toFixed(2)}</Text>
            </div>
            <Divider style={{ margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong>You will receive</Text>
              <Text strong style={{ fontSize: 18, color: '#52c41a' }}>
                ${totals.netAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </div>
          </Space>
        </div>
      </Form>
    ),
    // Step 2: Account Details
    (
      <Form
        key="details"
        form={form}
        layout="vertical"
      >
        {withdrawalMethod === 'wire' ? (
          <>
            <Alert
              message="Bank Account Details"
              description="Please provide your bank account information where you'd like to receive the funds."
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Form.Item
              label="Bank Account"
              name="bankAccount"
              rules={[{ required: true, message: 'Select a bank account' }]}
            >
              <Select size="large" placeholder="Select bank account">
                <Option value="account1">
                  <Space direction="vertical" size={0}>
                    <Text strong>Chase Bank **** 4567</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>Primary Account</Text>
                  </Space>
                </Option>
                <Option value="account2">
                  <Space direction="vertical" size={0}>
                    <Text strong>Bank of America **** 8901</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>Savings Account</Text>
                  </Space>
                </Option>
                <Option value="new">
                  <Text type="secondary">+ Add New Bank Account</Text>
                </Option>
              </Select>
            </Form.Item>

            <Card style={{ background: '#fafafa' }}>
              <Text type="secondary">
                For security reasons, withdrawals can only be sent to bank accounts registered and verified in your name.
              </Text>
            </Card>
          </>
        ) : (
          <>
            <Alert
              message="Cryptocurrency Withdrawal"
              description="Funds will be sent as USDC stablecoin to the address you provide."
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Form.Item
              label="Crypto Network"
              name="cryptoNetwork"
              rules={[{ required: true, message: 'Select a network' }]}
            >
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value="ethereum">
                    Ethereum (ERC-20) - Higher fees, more established
                  </Radio>
                  <Radio value="polygon">
                    Polygon - Lower fees, faster transactions
                  </Radio>
                </Space>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="USDC Wallet Address"
              name="cryptoAddress"
              rules={[
                { required: true, message: 'Enter your wallet address' },
                {
                  pattern: /^0x[a-fA-F0-9]{40}$/,
                  message: 'Invalid Ethereum address format',
                },
              ]}
            >
              <Input
                size="large"
                placeholder="0x..."
                maxLength={42}
              />
            </Form.Item>

            <Alert
              message="⚠️ Double-check your address"
              description="Cryptocurrency transactions are irreversible. Please verify your wallet address carefully before confirming."
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Card style={{ background: '#fafafa' }}>
              <Space direction="vertical" size="small">
                <Text strong>Important:</Text>
                <Text type="secondary">• Only send to addresses that support USDC</Text>
                <Text type="secondary">• Ensure you select the correct network</Text>
                <Text type="secondary">• Transaction cannot be reversed once confirmed</Text>
              </Space>
            </Card>
          </>
        )}
      </Form>
    ),
    // Step 3: Review & Confirm
    (
      <div key="review">
        {reviewData && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card style={{ background: '#fafafa' }}>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text type="secondary">Withdrawal Summary</Text>
                <Divider style={{ margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Amount</Text>
                  <Text strong>${reviewData.amount.toLocaleString()}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Fee</Text>
                  <Text>${reviewData.fee.toFixed(2)}</Text>
                </div>
                <Divider style={{ margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong>You will receive</Text>
                  <Text strong style={{ fontSize: 18, color: '#52c41a' }}>
                    ${reviewData.netAmount.toLocaleString()}
                  </Text>
                </div>
              </Space>
            </Card>

            <Card>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text strong>Withdrawal Method</Text>
                <Text>{reviewData.withdrawalMethod === 'wire' ? 'Wire Transfer' : 'USDC (Crypto)'}</Text>
                <Divider style={{ margin: '8px 0' }} />
                {reviewData.withdrawalMethod === 'wire' ? (
                  <>
                    <Text strong>Bank Account</Text>
                    <Text>{reviewData.bankAccount}</Text>
                  </>
                ) : (
                  <>
                    <Text strong>Network</Text>
                    <Text>{reviewData.cryptoNetwork === 'ethereum' ? 'Ethereum (ERC-20)' : 'Polygon'}</Text>
                    <Divider style={{ margin: '8px 0' }} />
                    <Text strong>Wallet Address</Text>
                    <Text copyable style={{ fontSize: 12 }}>
                      {reviewData.cryptoAddress}
                    </Text>
                  </>
                )}
              </Space>
            </Card>

            <Alert
              message="Review your withdrawal details carefully"
              description="Once confirmed, this withdrawal request will be processed and cannot be cancelled."
              type="warning"
              showIcon
            />
          </Space>
        )}
      </div>
    ),
    // Step 4: Success
    (
      <Result
        key="result"
        status="success"
        title="Withdrawal Requested"
        subTitle={`Your withdrawal request for $${reviewData?.netAmount.toLocaleString()} has been submitted. Processing time: ${reviewData?.withdrawalMethod === 'wire' ? '1-3 business days' : '15-30 minutes'}.`}
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
        <Button key="back" onClick={() => setCurrentStep(0)}>
          Back
        </Button>,
        <Button key="review" type="primary" onClick={handleDetailsSubmit}>
          Review Withdrawal
        </Button>,
      ];
    }

    if (currentStep === 2) {
      return [
        <Button key="back" onClick={() => setCurrentStep(1)} disabled={processing}>
          Back
        </Button>,
        <Button key="confirm" type="primary" danger loading={processing} onClick={handleConfirm}>
          Confirm Withdrawal
        </Button>,
      ];
    }

    return null;
  };

  return (
    <Modal
      title="Withdraw Funds"
      open={visible}
      onCancel={handleClose}
      footer={currentStep === 3 ? null : renderFooter()}
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

export default WithdrawalModal;
