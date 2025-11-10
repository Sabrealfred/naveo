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
  Modal,
  Progress,
  QRCode,
  Result,
  Row,
  Select,
  Space,
  Steps,
  Table,
  Tag,
  Typography,
  Upload,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  BankOutlined,
  CheckCircleOutlined,
  CopyOutlined,
  DownloadOutlined,
  LeftOutlined,
  RightOutlined,
  UploadOutlined,
  WalletOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

type ShareClass = 'A' | 'B' | 'C';
type PaymentMethod = 'wire' | 'crypto';
type SubscriptionStatus =
  | 'payment-pending'
  | 'payment-received'
  | 'nav-strike'
  | 'token-issuance'
  | 'completed';

interface Fund {
  id: string;
  name: string;
  description: string;
  minInvestment: number;
  managementFee: number;
  performanceFee: number;
  strategy: string;
  aum: number;
  nav: number;
  returns12m: number;
}

interface SubscriptionData {
  fundId?: string;
  fundName?: string;
  shareClass?: ShareClass;
  amount?: number;
  paymentMethod?: PaymentMethod;
  subscriptionId?: string;
  status?: SubscriptionStatus;
}

const mockFunds: Fund[] = [
  {
    id: 'fund-001',
    name: 'Naveo Growth Fund I',
    description: 'Multi-strategy crypto fund focused on DeFi and NFTs',
    minInvestment: 100000,
    managementFee: 2.0,
    performanceFee: 20,
    strategy: 'Growth',
    aum: 50000000,
    nav: 1250.5,
    returns12m: 45.3,
  },
  {
    id: 'fund-002',
    name: 'Naveo Stable Yield',
    description: 'Conservative stablecoin lending strategy',
    minInvestment: 50000,
    managementFee: 1.5,
    performanceFee: 10,
    strategy: 'Income',
    aum: 25000000,
    nav: 1050.2,
    returns12m: 8.7,
  },
  {
    id: 'fund-003',
    name: 'Naveo Emerging Markets',
    description: 'Tokenized assets from emerging markets',
    minInvestment: 150000,
    managementFee: 2.5,
    performanceFee: 25,
    strategy: 'Aggressive Growth',
    aum: 15000000,
    nav: 980.3,
    returns12m: -2.5,
  },
];

const SubscriptionWorkflowPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [data, setData] = useState<SubscriptionData>({});
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [fundModalOpen, setFundModalOpen] = useState(false);

  const steps = [
    { title: 'Select Fund' },
    { title: 'Investment Details' },
    { title: 'Payment Method' },
    { title: 'Payment' },
    { title: 'Confirmation' },
  ];

  const shareClasses = [
    {
      class: 'A' as ShareClass,
      label: 'Class A - Retail',
      minInvestment: 50000,
      managementFee: 2.0,
      subscriptionFee: 0.5,
    },
    {
      class: 'B' as ShareClass,
      label: 'Class B - Institutional',
      minInvestment: 500000,
      managementFee: 1.5,
      subscriptionFee: 0.25,
    },
    {
      class: 'C' as ShareClass,
      label: 'Class C - Strategic',
      minInvestment: 1000000,
      managementFee: 1.0,
      subscriptionFee: 0,
    },
  ];

  const calculateFees = (amount: number, shareClass: ShareClass) => {
    const classInfo = shareClasses.find((c) => c.class === shareClass);
    if (!classInfo) return { subscriptionFee: 0, netAmount: amount };

    const subscriptionFee = amount * (classInfo.subscriptionFee / 100);
    const netAmount = amount - subscriptionFee;
    return { subscriptionFee, netAmount };
  };

  const calculateShares = (netAmount: number) => {
    const nav = selectedFund?.nav || 1000;
    return netAmount / nav;
  };

  const handleNext = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      setData({ ...data, ...values });
      setCurrentStep(currentStep + 1);
    } catch (error) {
      message.error('Please complete all required fields');
    }
  };

  const handlePrevious = () => {
    const values = form.getFieldsValue();
    setData({ ...data, ...values });
    setCurrentStep(currentStep - 1);
  };

  const handleSelectFund = (fund: Fund) => {
    setSelectedFund(fund);
    setData({ ...data, fundId: fund.id, fundName: fund.name });
    setFundModalOpen(false);
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('Copied to clipboard!');
  };

  const handleSubmitSubscription = () => {
    const timestamp = new Date().getTime();
    const subscriptionId = `SUB-${timestamp}`;
    setData({ ...data, subscriptionId, status: 'payment-pending' });
    setCurrentStep(currentStep + 1);
    message.success('Subscription initiated successfully!');
  };

  const fundColumns: ColumnsType<Fund> = [
    {
      title: 'Fund Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Fund) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.description}
          </Text>
        </div>
      ),
    },
    {
      title: 'Strategy',
      dataIndex: 'strategy',
      key: 'strategy',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Min Investment',
      dataIndex: 'minInvestment',
      key: 'minInvestment',
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      title: 'NAV',
      dataIndex: 'nav',
      key: 'nav',
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      title: '12M Returns',
      dataIndex: 'returns12m',
      key: 'returns12m',
      render: (value: number) => (
        <Tag color={value >= 0 ? 'green' : 'red'}>{value > 0 ? '+' : ''}{value}%</Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: unknown, record: Fund) => (
        <Button type="primary" onClick={() => handleSelectFund(record)}>
          Select
        </Button>
      ),
    },
  ];

  const getStatusConfig = (status: SubscriptionStatus) => {
    const configs = {
      'payment-pending': {
        title: 'Payment Pending',
        description: 'Waiting for your payment',
        percent: 20,
        status: 'active' as const,
      },
      'payment-received': {
        title: 'Payment Received',
        description: 'Payment confirmed, processing subscription',
        percent: 40,
        status: 'active' as const,
      },
      'nav-strike': {
        title: 'NAV Strike',
        description: 'Determining share price at NAV',
        percent: 60,
        status: 'active' as const,
      },
      'token-issuance': {
        title: 'Token Issuance',
        description: 'Minting tokens to your wallet',
        percent: 80,
        status: 'active' as const,
      },
      completed: {
        title: 'Completed',
        description: 'Subscription completed successfully!',
        percent: 100,
        status: 'success' as const,
      },
    };
    return configs[status];
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={3}>Fund Subscription</Title>

      <Card>
        <Steps current={currentStep} items={steps} />
      </Card>

      <Form form={form} layout="vertical" initialValues={data}>
        {/* Step 0: Fund Selection */}
        {currentStep === 0 && (
          <Card title="Select Fund">
            {selectedFund ? (
              <Card size="small">
                <Descriptions column={2} bordered>
                  <Descriptions.Item label="Fund Name" span={2}>
                    <Text strong>{selectedFund.name}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Strategy">{selectedFund.strategy}</Descriptions.Item>
                  <Descriptions.Item label="AUM">${(selectedFund.aum / 1000000).toFixed(1)}M</Descriptions.Item>
                  <Descriptions.Item label="Management Fee">{selectedFund.managementFee}%</Descriptions.Item>
                  <Descriptions.Item label="Performance Fee">{selectedFund.performanceFee}%</Descriptions.Item>
                  <Descriptions.Item label="NAV">${selectedFund.nav}</Descriptions.Item>
                  <Descriptions.Item label="12M Returns">
                    <Tag color={selectedFund.returns12m >= 0 ? 'green' : 'red'}>
                      {selectedFund.returns12m > 0 ? '+' : ''}{selectedFund.returns12m}%
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
                <Button type="link" onClick={() => setFundModalOpen(true)} style={{ marginTop: 16 }}>
                  Change Fund
                </Button>
              </Card>
            ) : (
              <Button type="primary" size="large" onClick={() => setFundModalOpen(true)}>
                Browse Funds
              </Button>
            )}
          </Card>
        )}

        {/* Step 1: Investment Details */}
        {currentStep === 1 && selectedFund && (
          <Card title="Investment Details">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="shareClass"
                  label="Share Class"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="Select share class"
                    onChange={(value) => {
                      form.setFieldsValue({ shareClass: value });
                      const amount = form.getFieldValue('amount');
                      if (amount) {
                        const { netAmount } = calculateFees(amount, value);
                        form.setFieldsValue({ netAmount });
                      }
                    }}
                  >
                    {shareClasses.map((sc) => (
                      <Select.Option key={sc.class} value={sc.class}>
                        <div>
                          <div>{sc.label}</div>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Min: ${sc.minInvestment.toLocaleString()} | Fee: {sc.subscriptionFee}%
                          </Text>
                        </div>
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="amount"
                  label="Investment Amount"
                  rules={[
                    { required: true },
                    {
                      validator: async (_: unknown, value: number) => {
                        const shareClass = form.getFieldValue('shareClass');
                        const classInfo = shareClasses.find((c) => c.class === shareClass);
                        if (classInfo && value < classInfo.minInvestment) {
                          throw new Error(
                            `Minimum investment for Class ${shareClass} is $${classInfo.minInvestment.toLocaleString()}`
                          );
                        }
                      },
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    onChange={(value) => {
                      const shareClass = form.getFieldValue('shareClass');
                      if (value && shareClass && typeof value === 'number') {
                        const { subscriptionFee, netAmount } = calculateFees(value, shareClass);
                        form.setFieldsValue({ subscriptionFee, netAmount });
                      }
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            <Descriptions column={2} bordered>
              <Descriptions.Item label="Gross Amount">
                ${form.getFieldValue('amount')?.toLocaleString() || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Subscription Fee">
                $
                {(
                  form.getFieldValue('amount') *
                  ((shareClasses.find((c) => c.class === form.getFieldValue('shareClass'))
                    ?.subscriptionFee || 0) /
                    100)
                ).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Net Amount">
                $
                {calculateFees(
                  form.getFieldValue('amount') || 0,
                  form.getFieldValue('shareClass')
                ).netAmount.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Estimated Shares">
                {calculateShares(
                  calculateFees(
                    form.getFieldValue('amount') || 0,
                    form.getFieldValue('shareClass')
                  ).netAmount
                ).toFixed(4)}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}

        {/* Step 2: Payment Method */}
        {currentStep === 2 && (
          <Card title="Payment Method">
            <Form.Item name="paymentMethod" rules={[{ required: true }]}>
              <Select placeholder="Select payment method" size="large">
                <Select.Option value="wire">
                  <Space>
                    <BankOutlined />
                    Wire Transfer - Traditional bank wire
                  </Space>
                </Select.Option>
                <Select.Option value="crypto">
                  <Space>
                    <WalletOutlined />
                    Crypto Transfer - USDC, USDT, ETH
                  </Space>
                </Select.Option>
              </Select>
            </Form.Item>
          </Card>
        )}

        {/* Step 3: Payment Instructions */}
        {currentStep === 3 && (
          <Card title="Payment Instructions">
            {form.getFieldValue('paymentMethod') === 'wire' && (
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card title="Wire Transfer Details" size="small">
                  <Descriptions column={1} bordered>
                    <Descriptions.Item label="Bank Name">JPMorgan Chase Bank, N.A.</Descriptions.Item>
                    <Descriptions.Item label="Account Name">Naveo Fund Services LLC</Descriptions.Item>
                    <Descriptions.Item label="Account Number">
                      <Space>
                        <Text>1234567890</Text>
                        <Button
                          type="link"
                          icon={<CopyOutlined />}
                          onClick={() => handleCopyToClipboard('1234567890')}
                        />
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="Routing Number">
                      <Space>
                        <Text>021000021</Text>
                        <Button
                          type="link"
                          icon={<CopyOutlined />}
                          onClick={() => handleCopyToClipboard('021000021')}
                        />
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="SWIFT Code">CHASUS33</Descriptions.Item>
                    <Descriptions.Item label="Reference Number">
                      <Space>
                        <Text strong>SUB-{new Date().getTime()}</Text>
                        <Button
                          type="link"
                          icon={<CopyOutlined />}
                          onClick={() => handleCopyToClipboard(`SUB-${new Date().getTime()}`)}
                        />
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="Amount">
                      ${form.getFieldValue('amount')?.toLocaleString()}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>

                <Card title="Upload Proof of Transfer" size="small">
                  <Form.Item name="proofOfTransfer">
                    <Upload.Dragger maxCount={1} accept=".pdf,.jpg,.png">
                      <p className="ant-upload-drag-icon">
                        <UploadOutlined />
                      </p>
                      <p className="ant-upload-text">Click or drag file to upload</p>
                      <p className="ant-upload-hint">
                        Upload your bank transfer confirmation (PDF, JPG, PNG)
                      </p>
                    </Upload.Dragger>
                  </Form.Item>
                </Card>
              </Space>
            )}

            {form.getFieldValue('paymentMethod') === 'crypto' && (
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card title="Crypto Deposit Address" size="small">
                  <Space direction="vertical" align="center" style={{ width: '100%' }}>
                    <QRCode value="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb5" size={200} />
                    <Space>
                      <Text strong>0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb5</Text>
                      <Button
                        type="link"
                        icon={<CopyOutlined />}
                        onClick={() =>
                          handleCopyToClipboard('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb5')
                        }
                      />
                    </Space>
                    <Tag color="blue">Network: Ethereum (ERC-20)</Tag>
                    <Text type="secondary">Minimum 12 confirmations required</Text>
                  </Space>
                </Card>

                <Card title="Supported Tokens" size="small">
                  <Space direction="vertical">
                    <Text>• USDC - USD Coin</Text>
                    <Text>• USDT - Tether</Text>
                    <Text>• ETH - Ethereum</Text>
                  </Space>
                </Card>
              </Space>
            )}
          </Card>
        )}

        {/* Step 4: Confirmation & Status */}
        {currentStep === 4 && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Result
              status="success"
              title="Subscription Submitted Successfully!"
              subTitle={`Confirmation Number: ${data.subscriptionId}`}
              extra={[
                <Button type="primary" icon={<DownloadOutlined />} key="download">
                  Download Confirmation (PDF)
                </Button>,
                <Button key="portfolio">View in Portfolio</Button>,
              ]}
            />

            <Card title="Subscription Status">
              {data.status && (
                <>
                  <Progress
                    percent={getStatusConfig(data.status).percent}
                    status={getStatusConfig(data.status).status}
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                  />
                  <Space direction="vertical" style={{ marginTop: 16 }}>
                    <Text strong>{getStatusConfig(data.status).title}</Text>
                    <Text type="secondary">{getStatusConfig(data.status).description}</Text>
                  </Space>
                </>
              )}
            </Card>

            <Card title="Subscription Details">
              <Descriptions column={2} bordered>
                <Descriptions.Item label="Fund">{data.fundName}</Descriptions.Item>
                <Descriptions.Item label="Share Class">Class {data.shareClass}</Descriptions.Item>
                <Descriptions.Item label="Investment Amount">
                  ${data.amount?.toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Payment Method">
                  {data.paymentMethod === 'wire' ? 'Wire Transfer' : 'Crypto Transfer'}
                </Descriptions.Item>
                <Descriptions.Item label="Estimated Shares">
                  {data.amount
                    ? calculateShares(
                        calculateFees(data.amount, data.shareClass!).netAmount
                      ).toFixed(4)
                    : '0'}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color="processing">
                    {data.status?.replace('-', ' ').toUpperCase()}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Space>
        )}
      </Form>

      {/* Navigation */}
      {currentStep < 4 && (
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
              {currentStep < 3 ? (
                <Button
                  type="primary"
                  icon={<RightOutlined />}
                  onClick={handleNext}
                  disabled={currentStep === 0 && !selectedFund}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={handleSubmitSubscription}
                >
                  Submit Subscription
                </Button>
              )}
            </Col>
          </Row>
        </Card>
      )}

      {/* Fund Selection Modal */}
      <Modal
        title="Available Funds"
        open={fundModalOpen}
        onCancel={() => setFundModalOpen(false)}
        footer={null}
        width={1200}
      >
        <Table
          dataSource={mockFunds}
          columns={fundColumns}
          rowKey="id"
          pagination={false}
        />
      </Modal>
    </Space>
  );
};

export default SubscriptionWorkflowPage;
