import { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tabs,
  Progress,
  Tooltip,
  Badge,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  BankOutlined,
  DollarOutlined,
  SwapOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  WalletOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CreditCardOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Line, Column } from '@ant-design/charts';

interface BankAccount {
  id: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  accountType: 'checking' | 'savings' | 'money_market';
  balance: number;
  currency: string;
  status: 'active' | 'inactive' | 'pending';
  lastSync: string;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'wire' | 'ach' | 'crypto';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'processing';
  fromAccount: string;
  toAccount: string;
  reference: string;
  date: string;
  fees: number;
}

const BankingPaymentsPage = () => {
  const { t } = useTranslation();
  const [addAccountModal, setAddAccountModal] = useState(false);
  const [initiatePaymentModal, setInitiatePaymentModal] = useState(false);
  const [form] = Form.useForm();

  // Mock data - Bank Accounts
  const bankAccounts: BankAccount[] = [
    {
      id: 'ba-001',
      accountName: 'Operating Account',
      accountNumber: '****4521',
      bankName: 'JPMorgan Chase',
      accountType: 'checking',
      balance: 2850000,
      currency: 'USD',
      status: 'active',
      lastSync: '2024-11-11 10:30',
    },
    {
      id: 'ba-002',
      accountName: 'Reserve Account',
      accountNumber: '****8234',
      bankName: 'Bank of America',
      accountType: 'savings',
      balance: 5200000,
      currency: 'USD',
      status: 'active',
      lastSync: '2024-11-11 10:25',
    },
    {
      id: 'ba-003',
      accountName: 'EUR Operations',
      accountNumber: '****DE89',
      bankName: 'Deutsche Bank',
      accountType: 'checking',
      balance: 1200000,
      currency: 'EUR',
      status: 'active',
      lastSync: '2024-11-11 09:45',
    },
    {
      id: 'ba-004',
      accountName: 'Crypto Settlement',
      accountNumber: '0x742d...bEb5',
      bankName: 'Coinbase Custody',
      accountType: 'checking',
      balance: 850000,
      currency: 'USDC',
      status: 'active',
      lastSync: '2024-11-11 10:35',
    },
  ];

  // Mock data - Transactions
  const transactions: Transaction[] = [
    {
      id: 'tx-001',
      type: 'deposit',
      amount: 500000,
      currency: 'USD',
      status: 'completed',
      fromAccount: 'Investor: John Smith',
      toAccount: 'Operating Account ****4521',
      reference: 'INV-2024-11-001',
      date: '2024-11-11 09:15',
      fees: 250,
    },
    {
      id: 'tx-002',
      type: 'wire',
      amount: 250000,
      currency: 'USD',
      status: 'processing',
      fromAccount: 'Operating Account ****4521',
      toAccount: 'Asset Purchase - Real Estate LLC',
      reference: 'ASSET-PURCHASE-001',
      date: '2024-11-11 08:45',
      fees: 45,
    },
    {
      id: 'tx-003',
      type: 'crypto',
      amount: 150000,
      currency: 'USDC',
      status: 'completed',
      fromAccount: 'Investor: Sarah Johnson',
      toAccount: 'Crypto Settlement 0x742d',
      reference: 'CRYPTO-DEP-445',
      date: '2024-11-10 16:20',
      fees: 15,
    },
    {
      id: 'tx-004',
      type: 'ach',
      amount: 75000,
      currency: 'USD',
      status: 'pending',
      fromAccount: 'Operating Account ****4521',
      toAccount: 'Management Fees - MiraLabs',
      reference: 'MGM-FEE-Q4-2024',
      date: '2024-11-10 14:30',
      fees: 5,
    },
    {
      id: 'tx-005',
      type: 'withdrawal',
      amount: 100000,
      currency: 'USD',
      status: 'completed',
      fromAccount: 'Reserve Account ****8234',
      toAccount: 'Investor: Michael Chen - Redemption',
      reference: 'RED-2024-11-003',
      date: '2024-11-09 11:00',
      fees: 50,
    },
  ];

  // Calculate totals
  const totalBalance = bankAccounts.reduce((sum, account) => {
    if (account.currency === 'USD') return sum + account.balance;
    if (account.currency === 'EUR') return sum + (account.balance * 1.08); // Mock conversion
    if (account.currency === 'USDC') return sum + account.balance;
    return sum;
  }, 0);

  const pendingTransactions = transactions.filter(t => t.status === 'pending' || t.status === 'processing');
  const completedToday = transactions.filter(t => t.status === 'completed' && t.date.includes('2024-11-11'));
  const monthlyVolume = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  // Bank Account Columns
  const bankColumns: ColumnsType<BankAccount> = [
    {
      title: 'Account',
      key: 'account',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{record.accountName}</div>
          <div style={{ fontSize: 12, color: '#999' }}>
            {record.bankName} • {record.accountNumber}
          </div>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'accountType',
      key: 'type',
      render: (type: string) => (
        <Tag>
          {type === 'checking' ? 'Checking' : type === 'savings' ? 'Savings' : 'Money Market'}
        </Tag>
      ),
    },
    {
      title: 'Balance',
      key: 'balance',
      render: (_, record) => (
        <div style={{ fontWeight: 600 }}>
          {record.currency === 'USDC' ? (
            <span>${record.balance.toLocaleString()} USDC</span>
          ) : (
            <span>{record.currency} {record.balance.toLocaleString()}</span>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          active: 'success',
          inactive: 'default',
          pending: 'warning',
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Last Sync',
      dataIndex: 'lastSync',
      key: 'lastSync',
      render: (date: string) => (
        <div>
          <div style={{ fontSize: 13 }}>{date}</div>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button size="small">View Details</Button>
          <Button size="small" icon={<SwapOutlined />}>Transfer</Button>
        </Space>
      ),
    },
  ];

  // Transaction Columns
  const txColumns: ColumnsType<Transaction> = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const icons: Record<string, any> = {
          deposit: <ArrowDownOutlined style={{ color: '#52c41a' }} />,
          withdrawal: <ArrowUpOutlined style={{ color: '#ff4d4f' }} />,
          wire: <BankOutlined />,
          ach: <CreditCardOutlined />,
          crypto: <WalletOutlined />,
        };
        return (
          <Space>
            {icons[type]}
            <span style={{ textTransform: 'capitalize' }}>{type}</span>
          </Space>
        );
      },
    },
    {
      title: 'Amount',
      key: 'amount',
      render: (_, record) => (
        <div style={{ fontWeight: 600 }}>
          {record.currency} {record.amount.toLocaleString()}
        </div>
      ),
    },
    {
      title: 'From',
      dataIndex: 'fromAccount',
      key: 'from',
      ellipsis: true,
    },
    {
      title: 'To',
      dataIndex: 'toAccount',
      key: 'to',
      ellipsis: true,
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
      key: 'reference',
      render: (ref: string) => (
        <Tooltip title={ref}>
          <code style={{ fontSize: 11, background: '#f5f5f5', padding: '2px 6px', borderRadius: 4 }}>
            {ref}
          </code>
        </Tooltip>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const configs: Record<string, any> = {
          completed: { color: 'success', icon: <CheckCircleOutlined /> },
          pending: { color: 'warning', icon: <ClockCircleOutlined /> },
          processing: { color: 'processing', icon: <ClockCircleOutlined /> },
          failed: { color: 'error', icon: <ExclamationCircleOutlined /> },
        };
        const config = configs[status];
        return <Tag color={config.color} icon={config.icon}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Button size="small" type="link">View</Button>
      ),
    },
  ];

  // Transaction volume chart data
  const volumeChartData = [
    { month: 'Jun', volume: 3200000 },
    { month: 'Jul', volume: 4100000 },
    { month: 'Aug', volume: 3800000 },
    { month: 'Sep', volume: 4500000 },
    { month: 'Oct', volume: 5200000 },
    { month: 'Nov', volume: 6100000 },
  ];

  const volumeConfig = {
    data: volumeChartData,
    xField: 'month',
    yField: 'volume',
    color: '#1a1a1a',
    columnStyle: {
      radius: [8, 8, 0, 0],
    },
    label: {
      position: 'top' as const,
      formatter: (datum: any) => `$${(datum.volume / 1000000).toFixed(1)}M`,
    },
    yAxis: {
      label: {
        formatter: (v: string) => `$${(Number(v) / 1000000).toFixed(0)}M`,
      },
    },
  };

  const handleAddAccount = async (values: any) => {
    try {
      message.success('Bank account added successfully');
      setAddAccountModal(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to add bank account');
    }
  };

  const handleInitiatePayment = async (values: any) => {
    try {
      message.success('Payment initiated successfully');
      setInitiatePaymentModal(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to initiate payment');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
          Banking & Payments
        </h1>
        <p style={{ color: '#999' }}>
          Manage bank accounts, payment rails, and transaction monitoring
        </p>
      </div>

      {/* Overview Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Total Balance"
              value={totalBalance}
              prefix={<DollarOutlined />}
              precision={0}
              valueStyle={{ color: '#1a1a1a', fontSize: 28 }}
            />
            <div style={{ fontSize: 12, color: '#52c41a', marginTop: 8 }}>
              <ArrowUpOutlined /> +12.5% from last month
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Active Accounts"
              value={bankAccounts.filter(a => a.status === 'active').length}
              prefix={<BankOutlined />}
              valueStyle={{ color: '#1a1a1a', fontSize: 28 }}
            />
            <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
              Across 4 institutions
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Badge dot status="processing" style={{ marginRight: 8 }}>
              <Statistic
                title="Pending Transactions"
                value={pendingTransactions.length}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#faad14', fontSize: 28 }}
              />
            </Badge>
            <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
              {pendingTransactions.reduce((sum, tx) => sum + tx.amount, 0).toLocaleString()} USD
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Monthly Volume"
              value={monthlyVolume}
              prefix={<SwapOutlined />}
              precision={0}
              valueStyle={{ color: '#1a1a1a', fontSize: 28 }}
            />
            <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
              {completedToday.length} completed today
            </div>
          </Card>
        </Col>
      </Row>

      {/* Transaction Volume Chart */}
      <Card
        title="Monthly Transaction Volume"
        bordered={false}
        style={{ marginBottom: '24px' }}
      >
        <Column {...volumeConfig} height={200} />
      </Card>

      {/* Main Content Tabs */}
      <Card bordered={false}>
        <Tabs
          defaultActiveKey="accounts"
          tabBarExtraContent={
            <Space>
              <Button icon={<PlusOutlined />} onClick={() => setAddAccountModal(true)}>
                Add Bank Account
              </Button>
              <Button type="primary" icon={<SwapOutlined />} onClick={() => setInitiatePaymentModal(true)}>
                Initiate Payment
              </Button>
            </Space>
          }
          items={[
            {
              key: 'accounts',
              label: (
                <span>
                  <BankOutlined />
                  Bank Accounts ({bankAccounts.length})
                </span>
              ),
              children: (
                <div>
                  <Table
                    columns={bankColumns}
                    dataSource={bankAccounts}
                    rowKey="id"
                    pagination={false}
                  />
                </div>
              ),
            },
            {
              key: 'transactions',
              label: (
                <span>
                  <SwapOutlined />
                  Transactions ({transactions.length})
                </span>
              ),
              children: (
                <div>
                  <div style={{ marginBottom: 16 }}>
                    <Space>
                      <Select placeholder="Filter by type" style={{ width: 150 }}>
                        <Select.Option value="all">All Types</Select.Option>
                        <Select.Option value="deposit">Deposit</Select.Option>
                        <Select.Option value="withdrawal">Withdrawal</Select.Option>
                        <Select.Option value="wire">Wire</Select.Option>
                        <Select.Option value="ach">ACH</Select.Option>
                        <Select.Option value="crypto">Crypto</Select.Option>
                      </Select>
                      <Select placeholder="Filter by status" style={{ width: 150 }}>
                        <Select.Option value="all">All Status</Select.Option>
                        <Select.Option value="completed">Completed</Select.Option>
                        <Select.Option value="pending">Pending</Select.Option>
                        <Select.Option value="processing">Processing</Select.Option>
                        <Select.Option value="failed">Failed</Select.Option>
                      </Select>
                      <Button icon={<GlobalOutlined />}>Export Report</Button>
                    </Space>
                  </div>
                  <Table
                    columns={txColumns}
                    dataSource={transactions}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 1200 }}
                  />
                </div>
              ),
            },
            {
              key: 'payment-rails',
              label: (
                <span>
                  <CreditCardOutlined />
                  Payment Rails
                </span>
              ),
              children: (
                <div>
                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <Card title="Wire Transfer" extra={<Tag color="success">Active</Tag>}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <div>
                            <div style={{ fontSize: 12, color: '#999' }}>Processing Time</div>
                            <div style={{ fontWeight: 500 }}>1-3 business days</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 12, color: '#999' }}>Fee</div>
                            <div style={{ fontWeight: 500 }}>$25 - $45</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 12, color: '#999' }}>Monthly Volume</div>
                            <Progress percent={75} size="small" />
                            <div style={{ fontSize: 11, color: '#999' }}>$4.5M / $6M limit</div>
                          </div>
                        </Space>
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card title="ACH Transfer" extra={<Tag color="success">Active</Tag>}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <div>
                            <div style={{ fontSize: 12, color: '#999' }}>Processing Time</div>
                            <div style={{ fontWeight: 500 }}>2-5 business days</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 12, color: '#999' }}>Fee</div>
                            <div style={{ fontWeight: 500 }}>$1 - $5</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 12, color: '#999' }}>Monthly Volume</div>
                            <Progress percent={45} size="small" status="active" />
                            <div style={{ fontSize: 11, color: '#999' }}>$2.7M / $10M limit</div>
                          </div>
                        </Space>
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card title="Crypto Transfers" extra={<Tag color="success">Active</Tag>}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <div>
                            <div style={{ fontSize: 12, color: '#999' }}>Processing Time</div>
                            <div style={{ fontWeight: 500 }}>Minutes (12 confirmations)</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 12, color: '#999' }}>Fee</div>
                            <div style={{ fontWeight: 500 }}>0.1% + gas</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 12, color: '#999' }}>Monthly Volume</div>
                            <Progress percent={28} size="small" />
                            <div style={{ fontSize: 11, color: '#999' }}>$1.4M / $5M limit</div>
                          </div>
                        </Space>
                      </Card>
                    </Col>
                  </Row>
                </div>
              ),
            },
          ]}
        />
      </Card>

      {/* Add Bank Account Modal */}
      <Modal
        title="Add Bank Account"
        open={addAccountModal}
        onCancel={() => setAddAccountModal(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleAddAccount}>
          <Form.Item
            name="accountName"
            label="Account Name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Operating Account" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="bankName"
                label="Bank Name"
                rules={[{ required: true }]}
              >
                <Input placeholder="JPMorgan Chase" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="accountType"
                label="Account Type"
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option value="checking">Checking</Select.Option>
                  <Select.Option value="savings">Savings</Select.Option>
                  <Select.Option value="money_market">Money Market</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="accountNumber"
                label="Account Number"
                rules={[{ required: true }]}
              >
                <Input placeholder="123456789" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="routingNumber"
                label="Routing Number"
                rules={[{ required: true }]}
              >
                <Input placeholder="021000021" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Space>
              <Button onClick={() => setAddAccountModal(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">Add Account</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Initiate Payment Modal */}
      <Modal
        title="Initiate Payment"
        open={initiatePaymentModal}
        onCancel={() => setInitiatePaymentModal(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleInitiatePayment}>
          <Form.Item
            name="paymentType"
            label="Payment Type"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select payment type">
              <Select.Option value="wire">Wire Transfer</Select.Option>
              <Select.Option value="ach">ACH Transfer</Select.Option>
              <Select.Option value="crypto">Crypto Transfer</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="fromAccount"
            label="From Account"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select source account">
              {bankAccounts.map(acc => (
                <Select.Option key={acc.id} value={acc.id}>
                  {acc.accountName} ({acc.accountNumber})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="toAccount"
            label="To Account / Address"
            rules={[{ required: true }]}
          >
            <Input placeholder="Account number or crypto address" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="amount"
                label="Amount"
                rules={[{ required: true }]}
              >
                <Input type="number" placeholder="100000" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="currency"
                label="Currency"
                rules={[{ required: true }]}
                initialValue="USD"
              >
                <Select>
                  <Select.Option value="USD">USD</Select.Option>
                  <Select.Option value="EUR">EUR</Select.Option>
                  <Select.Option value="USDC">USDC</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="reference"
            label="Reference / Memo"
          >
            <Input.TextArea rows={2} placeholder="Payment reference..." />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={() => setInitiatePaymentModal(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">Initiate Payment</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BankingPaymentsPage;
