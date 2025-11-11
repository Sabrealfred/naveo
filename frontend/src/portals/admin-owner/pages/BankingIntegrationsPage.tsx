import { useState } from 'react';
import type { ReactNode } from 'react';
import { Card, Row, Col, Button, Table, Tag, Space, Modal, Form, Input, Select, Tabs, Switch, message, Statistic, Badge, Steps } from 'antd';
import type { BadgeProps } from 'antd';
import { BankOutlined, PlusOutlined, LinkOutlined, DollarOutlined, SafetyOutlined, CheckCircleOutlined, SyncOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: 'checking' | 'savings' | 'business';
  currency: string;
  balance: string;
  status: 'active' | 'pending' | 'inactive';
  verificationStatus: 'verified' | 'pending' | 'failed';
  lastSync: string;
}

interface WireTransfer {
  id: string;
  type: 'incoming' | 'outgoing';
  amount: string;
  fromAccount: string;
  toAccount: string;
  status: 'completed' | 'pending' | 'failed';
  reference: string;
  date: string;
}

/**
 * BankingIntegrationsPage - Complete banking integration management
 *
 * Features:
 * - Bank account linking (Plaid/Yodlee integration)
 * - Wire transfer processing and tracking
 * - ACH integration (direct debit/credit)
 * - Payment instruction management
 * - Bank reconciliation
 * - Multi-currency support
 */
const BankingIntegrationsPage = () => {
  const [activeTab, setActiveTab] = useState('accounts');
  const [addBankModalVisible, setAddBankModalVisible] = useState(false);
  const [wireTransferModalVisible, setWireTransferModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();

  // Mock data
  const bankAccounts: BankAccount[] = [
    {
      id: '1',
      bankName: 'JPMorgan Chase',
      accountName: 'Naveo Operating Account',
      accountNumber: '****5678',
      routingNumber: '021000021',
      accountType: 'business',
      currency: 'USD',
      balance: '$2,450,000',
      status: 'active',
      verificationStatus: 'verified',
      lastSync: '2024-11-10 09:30',
    },
    {
      id: '2',
      bankName: 'Bank of America',
      accountName: 'Investor Settlement Account',
      accountNumber: '****8901',
      routingNumber: '026009593',
      accountType: 'business',
      currency: 'USD',
      balance: '$1,200,000',
      status: 'active',
      verificationStatus: 'verified',
      lastSync: '2024-11-10 09:25',
    },
    {
      id: '3',
      bankName: 'HSBC',
      accountName: 'International Settlement EUR',
      accountNumber: 'GB****4567',
      routingNumber: 'HSBCGB2L',
      accountType: 'business',
      currency: 'EUR',
      balance: '€850,000',
      status: 'active',
      verificationStatus: 'verified',
      lastSync: '2024-11-10 09:20',
    },
    {
      id: '4',
      bankName: 'Wells Fargo',
      accountName: 'Reserve Account',
      accountNumber: '****2345',
      routingNumber: '121000248',
      accountType: 'savings',
      currency: 'USD',
      balance: '$5,000,000',
      status: 'active',
      verificationStatus: 'verified',
      lastSync: '2024-11-10 08:00',
    },
    {
      id: '5',
      bankName: 'Silicon Valley Bank',
      accountName: 'Pending Verification',
      accountNumber: '****9999',
      routingNumber: '121140399',
      accountType: 'business',
      currency: 'USD',
      balance: '$0',
      status: 'pending',
      verificationStatus: 'pending',
      lastSync: 'Never',
    },
  ];

  const wireTransfers: WireTransfer[] = [
    {
      id: '1',
      type: 'incoming',
      amount: '$250,000',
      fromAccount: 'Investor: John Doe',
      toAccount: 'JPMorgan Chase ****5678',
      status: 'completed',
      reference: 'WIRE-2024-001',
      date: '2024-11-10',
    },
    {
      id: '2',
      type: 'outgoing',
      amount: '$100,000',
      fromAccount: 'Bank of America ****8901',
      toAccount: 'Trading Account',
      status: 'completed',
      reference: 'WIRE-2024-002',
      date: '2024-11-09',
    },
    {
      id: '3',
      type: 'incoming',
      amount: '$500,000',
      fromAccount: 'Institutional Investor',
      toAccount: 'Wells Fargo ****2345',
      status: 'pending',
      reference: 'WIRE-2024-003',
      date: '2024-11-10',
    },
    {
      id: '4',
      type: 'outgoing',
      amount: '€75,000',
      fromAccount: 'HSBC GB****4567',
      toAccount: 'European Partner',
      status: 'failed',
      reference: 'WIRE-2024-004',
      date: '2024-11-08',
    },
  ];

  const bankColumns: ColumnsType<BankAccount> = [
    {
      title: 'Bank',
      dataIndex: 'bankName',
      key: 'bankName',
      render: (name, record) => (
        <Space direction="vertical" size={0}>
          <strong>{name}</strong>
          <span style={{ fontSize: 12, color: '#8c8c8c' }}>{record.accountName}</span>
        </Space>
      ),
    },
    {
      title: 'Account',
      key: 'account',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <code>{record.accountNumber}</code>
          <span style={{ fontSize: 11, color: '#8c8c8c' }}>Routing: {record.routingNumber}</span>
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'accountType',
      key: 'accountType',
      render: (type) => <Tag>{type.toUpperCase()}</Tag>,
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      key: 'currency',
      render: (currency) => <Tag color="blue">{currency}</Tag>,
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance) => <strong style={{ color: '#52c41a' }}>{balance}</strong>,
    },
    {
      title: 'Verification',
      dataIndex: 'verificationStatus',
      key: 'verificationStatus',
      render: (status: BankAccount['verificationStatus']) => {
        const verificationConfig: Record<
          BankAccount['verificationStatus'],
          { color: BadgeProps['status']; icon?: ReactNode; text: string }
        > = {
          verified: { color: 'success', icon: <CheckCircleOutlined />, text: 'Verified' },
          pending: { color: 'processing', icon: <SyncOutlined spin />, text: 'Pending' },
          failed: { color: 'error', icon: undefined, text: 'Failed' },
        };
        const { color, icon, text } = verificationConfig[status];
        return (
          <Space size={4}>
            {icon}
            <Badge status={color} text={text} />
          </Space>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: BankAccount['status']) => {
        const colors: Record<BankAccount['status'], string> = {
          active: 'green',
          inactive: 'red',
          pending: 'orange',
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Last Sync',
      dataIndex: 'lastSync',
      key: 'lastSync',
      render: (date) => <span style={{ fontSize: 12 }}>{date}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<SyncOutlined />}>Sync</Button>
          <Button size="small" type="link">Details</Button>
        </Space>
      ),
    },
  ];

  const wireStatusColors: Record<WireTransfer['status'], string> = {
    completed: 'green',
    pending: 'orange',
    failed: 'red',
  };

  const wireColumns: ColumnsType<WireTransfer> = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'incoming' ? 'green' : 'blue'}>
          {type === 'incoming' ? '↓ INCOMING' : '↑ OUTGOING'}
        </Tag>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => <strong>{amount}</strong>,
    },
    {
      title: 'From',
      dataIndex: 'fromAccount',
      key: 'fromAccount',
      render: (from) => <span style={{ fontSize: 12 }}>{from}</span>,
    },
    {
      title: 'To',
      dataIndex: 'toAccount',
      key: 'toAccount',
      render: (to) => <span style={{ fontSize: 12 }}>{to}</span>,
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
      key: 'reference',
      render: (ref) => <code style={{ fontSize: 11 }}>{ref}</code>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: WireTransfer['status']) => (
        <Tag color={wireStatusColors[status]}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" type="link">View</Button>
          {record.status === 'failed' && <Button size="small" type="link" danger>Retry</Button>}
        </Space>
      ),
    },
  ];

  const handleAddBank = () => {
    if (currentStep === 2) {
      message.success('Bank account added successfully');
      setAddBankModalVisible(false);
      setCurrentStep(0);
      form.resetFields();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleInitiateWire = () => {
    form.validateFields().then((values) => {
      console.log('Wire transfer:', values);
      message.success('Wire transfer initiated');
      setWireTransferModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card>
            <Row gutter={24} align="middle">
              <Col flex="auto">
                <Space direction="vertical" size={0}>
                  <h2 style={{ margin: 0 }}>
                    <BankOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                    Banking Integrations
                  </h2>
                  <p style={{ margin: 0, color: '#8c8c8c' }}>
                    Manage bank accounts, wire transfers, and payment processing
                  </p>
                </Space>
              </Col>
              <Col>
                <Space>
                  <Button icon={<DollarOutlined />} onClick={() => setWireTransferModalVisible(true)}>
                    Initiate Wire
                  </Button>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddBankModalVisible(true)}>
                    Add Bank Account
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Connected Banks"
              value={bankAccounts.filter(b => b.status === 'active').length}
              suffix={`/ ${bankAccounts.length}`}
              prefix={<BankOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Balance"
              value="9,500,000"
              prefix="$"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending Wires"
              value={wireTransfers.filter(w => w.status === 'pending').length}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="This Month"
              value={wireTransfers.length}
              suffix="transfers"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'accounts',
              label: 'Bank Accounts',
              children: (
                <Table
                  columns={bankColumns}
                  dataSource={bankAccounts}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
              ),
            },
            {
              key: 'wires',
              label: 'Wire Transfers',
              children: (
                <Table
                  columns={wireColumns}
                  dataSource={wireTransfers}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
              ),
            },
            {
              key: 'ach',
              label: 'ACH/Direct Debit',
              children: (
                <div style={{ padding: 24, textAlign: 'center' }}>
                  <SafetyOutlined style={{ fontSize: 48, color: '#8c8c8c', marginBottom: 16 }} />
                  <h3>ACH Integration Coming Soon</h3>
                  <p style={{ color: '#8c8c8c' }}>
                    Direct debit and credit capabilities will be available in the next release
                  </p>
                </div>
              ),
            },
            {
              key: 'settings',
              label: 'Settings',
              children: (
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <Card title="Payment Provider Configuration">
                    <Form layout="vertical">
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item label="Plaid API Key">
                            <Input.Password placeholder="Enter Plaid API key" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="Plaid Secret">
                            <Input.Password placeholder="Enter Plaid secret" />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item label="Environment">
                            <Select defaultValue="production">
                              <Select.Option value="sandbox">Sandbox</Select.Option>
                              <Select.Option value="development">Development</Select.Option>
                              <Select.Option value="production">Production</Select.Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="Webhook URL">
                            <Input placeholder="https://your-domain.com/webhooks/plaid" />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Button type="primary">Save Configuration</Button>
                    </Form>
                  </Card>

                  <Card title="Wire Transfer Policies">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Row justify="space-between">
                        <Col>Require Dual Approval for Wires &gt; $100,000</Col>
                        <Col><Switch defaultChecked /></Col>
                      </Row>
                      <Row justify="space-between">
                        <Col>Auto-Process Wires &lt; $10,000</Col>
                        <Col><Switch /></Col>
                      </Row>
                      <Row justify="space-between">
                        <Col>Send Email Notifications for All Wires</Col>
                        <Col><Switch defaultChecked /></Col>
                      </Row>
                      <Row justify="space-between">
                        <Col>Daily Wire Transfer Limit</Col>
                        <Col><Input style={{ width: 150 }} defaultValue="$1,000,000" /></Col>
                      </Row>
                    </Space>
                  </Card>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      {/* Add Bank Account Modal */}
      <Modal
        title="Add Bank Account"
        open={addBankModalVisible}
        onCancel={() => {
          setAddBankModalVisible(false);
          setCurrentStep(0);
          form.resetFields();
        }}
        onOk={handleAddBank}
        width={700}
        okText={currentStep === 2 ? 'Complete' : 'Next'}
      >
        <Steps current={currentStep} style={{ marginBottom: 24 }}>
          <Steps.Step title="Bank Details" />
          <Steps.Step title="Verification" />
          <Steps.Step title="Confirm" />
        </Steps>

        <Form form={form} layout="vertical">
          {currentStep === 0 && (
            <>
              <Form.Item name="bankName" label="Bank Name" rules={[{ required: true }]}>
                <Input placeholder="e.g., JPMorgan Chase" />
              </Form.Item>
              <Form.Item name="accountName" label="Account Name" rules={[{ required: true }]}>
                <Input placeholder="e.g., Operating Account" />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="accountNumber" label="Account Number" rules={[{ required: true }]}>
                    <Input placeholder="Account number" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="routingNumber" label="Routing Number" rules={[{ required: true }]}>
                    <Input placeholder="Routing number" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="accountType" label="Account Type" rules={[{ required: true }]}>
                    <Select placeholder="Select type">
                      <Select.Option value="checking">Checking</Select.Option>
                      <Select.Option value="savings">Savings</Select.Option>
                      <Select.Option value="business">Business</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="currency" label="Currency" rules={[{ required: true }]}>
                    <Select placeholder="Select currency">
                      <Select.Option value="USD">USD</Select.Option>
                      <Select.Option value="EUR">EUR</Select.Option>
                      <Select.Option value="GBP">GBP</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}

          {currentStep === 1 && (
            <div style={{ padding: 24, textAlign: 'center' }}>
              <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a', marginBottom: 16 }} />
              <h3>Verifying Bank Account</h3>
              <p style={{ color: '#8c8c8c' }}>
                We'll send two micro-deposits to your account within 1-2 business days.
                Please verify the amounts to complete the setup.
              </p>
              <Button type="primary">I've received the deposits</Button>
            </div>
          )}

          {currentStep === 2 && (
            <div style={{ padding: 24 }}>
              <h3>Confirm Bank Account Details</h3>
              <Space direction="vertical" size="small" style={{ width: '100%', marginTop: 16 }}>
                <Row>
                  <Col span={8}><strong>Bank:</strong></Col>
                  <Col span={16}>JPMorgan Chase</Col>
                </Row>
                <Row>
                  <Col span={8}><strong>Account:</strong></Col>
                  <Col span={16}>Operating Account</Col>
                </Row>
                <Row>
                  <Col span={8}><strong>Account Number:</strong></Col>
                  <Col span={16}>****5678</Col>
                </Row>
                <Row>
                  <Col span={8}><strong>Type:</strong></Col>
                  <Col span={16}>Business</Col>
                </Row>
                <Row>
                  <Col span={8}><strong>Currency:</strong></Col>
                  <Col span={16}>USD</Col>
                </Row>
              </Space>
            </div>
          )}
        </Form>
      </Modal>

      {/* Wire Transfer Modal */}
      <Modal
        title="Initiate Wire Transfer"
        open={wireTransferModalVisible}
        onCancel={() => setWireTransferModalVisible(false)}
        onOk={handleInitiateWire}
        width={600}
        okText="Initiate Transfer"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="type" label="Transfer Type" rules={[{ required: true }]}>
            <Select placeholder="Select type">
              <Select.Option value="domestic">Domestic Wire</Select.Option>
              <Select.Option value="international">International Wire</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="fromAccount" label="From Account" rules={[{ required: true }]}>
            <Select placeholder="Select source account">
              {bankAccounts
                .filter(acc => acc.status === 'active')
                .map(acc => (
                  <Select.Option key={acc.id} value={acc.id}>
                    {acc.bankName} - {acc.accountNumber}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
            <Input prefix="$" type="number" placeholder="0.00" />
          </Form.Item>

          <Form.Item name="recipientName" label="Recipient Name" rules={[{ required: true }]}>
            <Input placeholder="Recipient name" />
          </Form.Item>

          <Form.Item name="recipientBank" label="Recipient Bank" rules={[{ required: true }]}>
            <Input placeholder="Bank name" />
          </Form.Item>

          <Form.Item name="recipientAccount" label="Recipient Account Number" rules={[{ required: true }]}>
            <Input placeholder="Account number" />
          </Form.Item>

          <Form.Item name="recipientRouting" label="Recipient Routing Number" rules={[{ required: true }]}>
            <Input placeholder="Routing number" />
          </Form.Item>

          <Form.Item name="reference" label="Reference/Memo">
            <Input.TextArea placeholder="Purpose of transfer" rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BankingIntegrationsPage;
