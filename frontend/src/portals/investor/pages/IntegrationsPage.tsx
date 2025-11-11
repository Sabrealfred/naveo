import { useState } from 'react';
import { Card, Row, Col, Button, Space, Tag, Switch, Table, Modal, Form, Input, Select, message, Divider, Avatar, Tooltip } from 'antd';
import {
  WalletOutlined,
  CreditCardOutlined,
  SwapOutlined,
  ApiOutlined,
  BellOutlined,
  LinkOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  SettingOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface ConnectedWallet {
  key: string;
  name: string;
  address: string;
  type: 'metamask' | 'ledger' | 'trezor' | 'walletconnect';
  balance: string;
  connected: boolean;
  lastUsed: string;
}

interface PaymentMethod {
  key: string;
  type: 'bank' | 'card';
  name: string;
  details: string;
  isDefault: boolean;
  verified: boolean;
  addedDate: string;
}

interface Exchange {
  key: string;
  name: string;
  logo: string;
  connected: boolean;
  apiStatus: 'active' | 'expired' | 'none';
  lastSync: string;
}

const IntegrationsPage = () => {
  const exchangeStatusMap: Record<Exchange['apiStatus'], { color: string; text: string }> = {
    active: { color: 'green', text: 'Active' },
    expired: { color: 'red', text: 'Expired' },
    none: { color: 'default', text: 'No API Key' },
  };
  const [walletModalVisible, setWalletModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [exchangeModalVisible, setExchangeModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Mock data for wallets
  const [wallets, setWallets] = useState<ConnectedWallet[]>([
    {
      key: '1',
      name: 'MetaMask',
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      type: 'metamask',
      balance: '2,450 USDC',
      connected: true,
      lastUsed: '2024-11-10 14:30',
    },
    {
      key: '2',
      name: 'Ledger Nano X',
      address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      type: 'ledger',
      balance: '15,892 USDC',
      connected: true,
      lastUsed: '2024-11-09 09:15',
    },
  ]);

  // Mock data for payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      key: '1',
      type: 'bank',
      name: 'Chase Bank',
      details: '****4521',
      isDefault: true,
      verified: true,
      addedDate: '2024-08-15',
    },
    {
      key: '2',
      type: 'card',
      name: 'Visa',
      details: '****8942',
      isDefault: false,
      verified: true,
      addedDate: '2024-09-20',
    },
  ]);

  // Mock data for exchanges
  const [exchanges, setExchanges] = useState<Exchange[]>([
    {
      key: '1',
      name: 'Binance',
      logo: '🅱',
      connected: true,
      apiStatus: 'active',
      lastSync: '2024-11-10 16:45',
    },
    {
      key: '2',
      name: 'Coinbase',
      logo: '🅲',
      connected: false,
      apiStatus: 'none',
      lastSync: 'Never',
    },
    {
      key: '3',
      name: 'Kraken',
      logo: '🅺',
      connected: true,
      apiStatus: 'expired',
      lastSync: '2024-10-15 11:20',
    },
  ]);

  // Wallet columns
  const walletColumns: ColumnsType<ConnectedWallet> = [
    {
      title: 'Wallet',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space>
          <Avatar
            style={{
              backgroundColor: record.type === 'metamask' ? '#f6851b' : record.type === 'ledger' ? '#000' : '#3f51b5',
            }}
          >
            {name[0]}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{name}</div>
            <code style={{ fontSize: 11, color: '#8c8c8c' }}>
              {record.address.substring(0, 10)}...{record.address.substring(record.address.length - 8)}
            </code>
          </div>
        </Space>
      ),
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance) => <span style={{ fontWeight: 500 }}>{balance}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'connected',
      key: 'connected',
      render: (connected) => (
        <Tag color={connected ? 'green' : 'red'} icon={connected ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
          {connected ? 'Connected' : 'Disconnected'}
        </Tag>
      ),
    },
    {
      title: 'Last Used',
      dataIndex: 'lastUsed',
      key: 'lastUsed',
      render: (date) => <span style={{ fontSize: 12, color: '#8c8c8c' }}>{date}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<SettingOutlined />}>
            Settings
          </Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>
            Remove
          </Button>
        </Space>
      ),
    },
  ];

  // Payment method columns
  const paymentColumns: ColumnsType<PaymentMethod> = [
    {
      title: 'Method',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space>
          {record.type === 'bank' ? <CreditCardOutlined style={{ fontSize: 20 }} /> : <CreditCardOutlined style={{ fontSize: 20 }} />}
          <div>
            <div style={{ fontWeight: 500 }}>
              {name} {record.isDefault && <Tag color="blue">Default</Tag>}
            </div>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.details}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => <Tag>{type === 'bank' ? 'Bank Account' : 'Credit Card'}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'verified',
      key: 'verified',
      render: (verified) => (
        <Tag color={verified ? 'green' : 'orange'} icon={verified ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
          {verified ? 'Verified' : 'Pending'}
        </Tag>
      ),
    },
    {
      title: 'Added',
      dataIndex: 'addedDate',
      key: 'addedDate',
      render: (date) => <span style={{ fontSize: 12, color: '#8c8c8c' }}>{date}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {!record.isDefault && (
            <Button type="link" size="small">
              Set Default
            </Button>
          )}
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>
            Remove
          </Button>
        </Space>
      ),
    },
  ];

  // Exchange columns
  const exchangeColumns: ColumnsType<Exchange> = [
    {
      title: 'Exchange',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space>
          <span style={{ fontSize: 24 }}>{record.logo}</span>
          <span style={{ fontWeight: 500 }}>{name}</span>
        </Space>
      ),
    },
    {
      title: 'Connection',
      dataIndex: 'connected',
      key: 'connected',
      render: (connected) => (
        <Tag color={connected ? 'green' : 'default'} icon={connected ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
          {connected ? 'Connected' : 'Not Connected'}
        </Tag>
      ),
    },
    {
      title: 'API Status',
      dataIndex: 'apiStatus',
      key: 'apiStatus',
      render: (status: Exchange['apiStatus']) => {
        const config = exchangeStatusMap[status];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Last Sync',
      dataIndex: 'lastSync',
      key: 'lastSync',
      render: (date) => <span style={{ fontSize: 12, color: '#8c8c8c' }}>{date}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {record.connected ? (
            <>
              <Button type="link" size="small" icon={<SettingOutlined />}>
                Configure
              </Button>
              <Button type="link" size="small" danger>
                Disconnect
              </Button>
            </>
          ) : (
            <Button type="primary" size="small" icon={<LinkOutlined />}>
              Connect
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleAddWallet = () => {
    message.success('Wallet connected successfully!');
    setWalletModalVisible(false);
  };

  const handleAddPayment = () => {
    message.success('Payment method added successfully!');
    setPaymentModalVisible(false);
  };

  const handleConnectExchange = () => {
    message.success('Exchange connected successfully!');
    setExchangeModalVisible(false);
  };

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card>
            <Row align="middle" gutter={24}>
              <Col flex="auto">
                <Space direction="vertical" size={0}>
                  <h2 style={{ margin: 0 }}>
                    <LinkOutlined /> Integrations
                  </h2>
                  <p style={{ margin: 0, color: '#8c8c8c' }}>
                    Manage your connected wallets, payment methods, and exchange integrations
                  </p>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Connected Wallets Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card
            title={
              <Space>
                <WalletOutlined />
                <span>Connected Wallets</span>
              </Space>
            }
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setWalletModalVisible(true)}>
                Connect Wallet
              </Button>
            }
          >
            <Table columns={walletColumns} dataSource={wallets} pagination={false} />
          </Card>
        </Col>
      </Row>

      {/* Payment Methods Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card
            title={
              <Space>
                <CreditCardOutlined />
                <span>Payment Methods</span>
              </Space>
            }
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setPaymentModalVisible(true)}>
                Add Payment Method
              </Button>
            }
          >
            <Table columns={paymentColumns} dataSource={paymentMethods} pagination={false} />
          </Card>
        </Col>
      </Row>

      {/* Exchange Integrations Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card
            title={
              <Space>
                <SwapOutlined />
                <span>Connected Exchanges</span>
              </Space>
            }
          >
            <Table columns={exchangeColumns} dataSource={exchanges} pagination={false} />
          </Card>
        </Col>
      </Row>

      {/* Notification Preferences Section */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title={
              <Space>
                <BellOutlined />
                <span>Notification Preferences</span>
              </Space>
            }
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                    <div>
                      <div style={{ fontWeight: 500 }}>Transaction Notifications</div>
                      <div style={{ fontSize: 12, color: '#8c8c8c' }}>Receive alerts for all transactions</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Divider style={{ margin: 0 }} />
                </Col>
                <Col span={24}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                    <div>
                      <div style={{ fontWeight: 500 }}>Price Alerts</div>
                      <div style={{ fontSize: 12, color: '#8c8c8c' }}>Get notified about significant price changes</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Divider style={{ margin: 0 }} />
                </Col>
                <Col span={24}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                    <div>
                      <div style={{ fontWeight: 500 }}>Portfolio Updates</div>
                      <div style={{ fontSize: 12, color: '#8c8c8c' }}>Weekly portfolio performance summary</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Divider style={{ margin: 0 }} />
                </Col>
                <Col span={24}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                    <div>
                      <div style={{ fontWeight: 500 }}>Email Notifications</div>
                      <div style={{ fontSize: 12, color: '#8c8c8c' }}>Receive notifications via email</div>
                    </div>
                    <Switch />
                  </div>
                  <Divider style={{ margin: 0 }} />
                </Col>
                <Col span={24}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                    <div>
                      <div style={{ fontWeight: 500 }}>SMS Notifications</div>
                      <div style={{ fontSize: 12, color: '#8c8c8c' }}>Receive critical alerts via SMS</div>
                    </div>
                    <Switch />
                  </div>
                </Col>
              </Row>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Connect Wallet Modal */}
      <Modal
        title="Connect Wallet"
        open={walletModalVisible}
        onCancel={() => setWalletModalVisible(false)}
        onOk={handleAddWallet}
        width={500}
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Select Wallet Type" name="walletType" rules={[{ required: true }]}>
            <Select placeholder="Choose wallet provider">
              <Select.Option value="metamask">MetaMask</Select.Option>
              <Select.Option value="ledger">Ledger</Select.Option>
              <Select.Option value="trezor">Trezor</Select.Option>
              <Select.Option value="walletconnect">WalletConnect</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Wallet Address" name="address" rules={[{ required: true }]}>
            <Input placeholder="0x..." />
          </Form.Item>
          <Form.Item label="Wallet Name (Optional)" name="name">
            <Input placeholder="My Wallet" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Payment Method Modal */}
      <Modal
        title="Add Payment Method"
        open={paymentModalVisible}
        onCancel={() => setPaymentModalVisible(false)}
        onOk={handleAddPayment}
        width={500}
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Payment Type" name="paymentType" rules={[{ required: true }]}>
            <Select placeholder="Select payment type">
              <Select.Option value="bank">Bank Account</Select.Option>
              <Select.Option value="card">Credit/Debit Card</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Account/Card Number" name="accountNumber" rules={[{ required: true }]}>
            <Input placeholder="****1234" />
          </Form.Item>
          <Form.Item label="Name on Account" name="accountName" rules={[{ required: true }]}>
            <Input placeholder="John Doe" />
          </Form.Item>
          <Form.Item name="setDefault" valuePropName="checked">
            <Switch /> <span style={{ marginLeft: 8 }}>Set as default payment method</span>
          </Form.Item>
        </Form>
      </Modal>

      {/* Connect Exchange Modal */}
      <Modal
        title="Connect Exchange"
        open={exchangeModalVisible}
        onCancel={() => setExchangeModalVisible(false)}
        onOk={handleConnectExchange}
        width={500}
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Exchange" name="exchange" rules={[{ required: true }]}>
            <Select placeholder="Select exchange">
              <Select.Option value="binance">Binance</Select.Option>
              <Select.Option value="coinbase">Coinbase</Select.Option>
              <Select.Option value="kraken">Kraken</Select.Option>
              <Select.Option value="gemini">Gemini</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="API Key" name="apiKey" rules={[{ required: true }]}>
            <Input.Password placeholder="Enter API key" />
          </Form.Item>
          <Form.Item label="API Secret" name="apiSecret" rules={[{ required: true }]}>
            <Input.Password placeholder="Enter API secret" />
          </Form.Item>
          <Divider />
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>
            <p>Your API keys are encrypted and stored securely. We recommend using read-only API keys when possible.</p>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default IntegrationsPage;
