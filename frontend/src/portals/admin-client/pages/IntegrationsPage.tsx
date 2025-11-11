import { useState } from 'react';
import { Card, Row, Col, Button, Space, Tag, Switch, Table, Modal, Form, Input, Select, message, Divider, Tabs, Statistic, Alert } from 'antd';
import {
  ApiOutlined,
  BankOutlined,
  LineChartOutlined,
  FileTextOutlined,
  SafetyOutlined,
  CloudServerOutlined,
  LinkOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  SettingOutlined,
  DeleteOutlined,
  SyncOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface TradingIntegration {
  key: string;
  name: string;
  type: 'dex' | 'cex' | 'otc';
  status: 'active' | 'inactive' | 'error';
  lastSync: string;
  volume24h: string;
  orders: number;
}

interface CustodialWallet {
  key: string;
  provider: string;
  walletType: 'hot' | 'cold' | 'multi-sig';
  address: string;
  balance: string;
  status: 'active' | 'inactive';
  lastActivity: string;
}

interface BankingPartner {
  key: string;
  bank: string;
  accountType: string;
  accountNumber: string;
  status: 'verified' | 'pending' | 'error';
  balance: string;
  addedDate: string;
}

interface DataProvider {
  key: string;
  provider: string;
  service: string;
  status: 'active' | 'inactive';
  apiCalls: number;
  lastUpdate: string;
}

interface ThirdPartyService {
  key: string;
  service: string;
  category: string;
  status: 'connected' | 'disconnected';
  subscription: string;
  expiryDate: string;
}

const IntegrationsPage = () => {
  const [activeTab, setActiveTab] = useState('trading');
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Mock data for trading integrations
  const [tradingIntegrations] = useState<TradingIntegration[]>([
    {
      key: '1',
      name: 'Uniswap V3',
      type: 'dex',
      status: 'active',
      lastSync: '2024-11-10 16:45',
      volume24h: '$2,450,000',
      orders: 127,
    },
    {
      key: '2',
      name: 'Binance',
      type: 'cex',
      status: 'active',
      lastSync: '2024-11-10 16:50',
      volume24h: '$5,680,000',
      orders: 234,
    },
    {
      key: '3',
      name: 'Circle OTC',
      type: 'otc',
      status: 'inactive',
      lastSync: '2024-11-08 10:20',
      volume24h: '$0',
      orders: 0,
    },
  ]);

  // Mock data for custodial wallets
  const [custodialWallets] = useState<CustodialWallet[]>([
    {
      key: '1',
      provider: 'Fireblocks',
      walletType: 'multi-sig',
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      balance: '$15,892,450',
      status: 'active',
      lastActivity: '2024-11-10 14:30',
    },
    {
      key: '2',
      provider: 'Copper',
      walletType: 'cold',
      address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      balance: '$8,450,120',
      status: 'active',
      lastActivity: '2024-11-09 09:15',
    },
    {
      key: '3',
      provider: 'BitGo',
      walletType: 'hot',
      address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      balance: '$1,245,680',
      status: 'active',
      lastActivity: '2024-11-10 16:00',
    },
  ]);

  // Mock data for banking partners
  const [bankingPartners] = useState<BankingPartner[]>([
    {
      key: '1',
      bank: 'JP Morgan',
      accountType: 'Business Checking',
      accountNumber: '****8521',
      status: 'verified',
      balance: '$4,250,000',
      addedDate: '2024-06-15',
    },
    {
      key: '2',
      bank: 'Silvergate',
      accountType: 'SEN Account',
      accountNumber: '****3142',
      status: 'verified',
      balance: '$2,890,500',
      addedDate: '2024-07-20',
    },
    {
      key: '3',
      bank: 'Signature Bank',
      accountType: 'Signet Account',
      accountNumber: '****9876',
      status: 'pending',
      balance: '$0',
      addedDate: '2024-11-05',
    },
  ]);

  // Mock data for data providers
  const [dataProviders] = useState<DataProvider[]>([
    {
      key: '1',
      provider: 'Chainlink',
      service: 'Price Feeds',
      status: 'active',
      apiCalls: 15420,
      lastUpdate: '2024-11-10 16:55',
    },
    {
      key: '2',
      provider: 'The Graph',
      service: 'Blockchain Indexing',
      status: 'active',
      apiCalls: 8765,
      lastUpdate: '2024-11-10 16:52',
    },
    {
      key: '3',
      provider: 'CoinGecko',
      service: 'Market Data',
      status: 'active',
      apiCalls: 2340,
      lastUpdate: '2024-11-10 16:48',
    },
    {
      key: '4',
      provider: 'Dune Analytics',
      service: 'On-chain Analytics',
      status: 'inactive',
      apiCalls: 0,
      lastUpdate: '2024-10-28 11:30',
    },
  ]);

  // Mock data for third-party services
  const [thirdPartyServices] = useState<ThirdPartyService[]>([
    {
      key: '1',
      service: 'TaxBit',
      category: 'Tax Reporting',
      status: 'connected',
      subscription: 'Enterprise',
      expiryDate: '2025-06-30',
    },
    {
      key: '2',
      service: 'Elliptic',
      category: 'Compliance & AML',
      status: 'connected',
      subscription: 'Professional',
      expiryDate: '2025-03-15',
    },
    {
      key: '3',
      service: 'Quadrata',
      category: 'Identity Verification',
      status: 'connected',
      subscription: 'Standard',
      expiryDate: '2025-08-20',
    },
    {
      key: '4',
      service: 'Persona',
      category: 'KYC/KYB',
      status: 'disconnected',
      subscription: 'N/A',
      expiryDate: 'N/A',
    },
  ]);

  // Trading integrations columns
  const tradingColumns: ColumnsType<TradingIntegration> = [
    {
      title: 'Integration',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space>
          <ApiOutlined style={{ fontSize: 20 }} />
          <div>
            <div style={{ fontWeight: 500 }}>{name}</div>
            <Tag>{record.type.toUpperCase()}</Tag>
          </div>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : status === 'inactive' ? 'default' : 'red'} icon={status === 'active' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: '24h Volume',
      dataIndex: 'volume24h',
      key: 'volume24h',
      render: (volume) => <span style={{ fontWeight: 500 }}>{volume}</span>,
    },
    {
      title: 'Orders',
      dataIndex: 'orders',
      key: 'orders',
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
          <Button type="link" size="small" icon={<SyncOutlined />}>
            Sync
          </Button>
          <Button type="link" size="small" icon={<SettingOutlined />}>
            Configure
          </Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>
            Remove
          </Button>
        </Space>
      ),
    },
  ];

  // Custodial wallet columns
  const walletColumns: ColumnsType<CustodialWallet> = [
    {
      title: 'Provider',
      dataIndex: 'provider',
      key: 'provider',
      render: (provider, record) => (
        <Space>
          <SafetyOutlined style={{ fontSize: 20 }} />
          <div>
            <div style={{ fontWeight: 500 }}>{provider}</div>
            <Tag color={record.walletType === 'multi-sig' ? 'purple' : record.walletType === 'cold' ? 'blue' : 'green'}>
              {record.walletType.toUpperCase()}
            </Tag>
          </div>
        </Space>
      ),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (address) => (
        <code style={{ fontSize: 11, color: '#8c8c8c' }}>
          {address.substring(0, 10)}...{address.substring(address.length - 8)}
        </code>
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
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'} icon={status === 'active' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Last Activity',
      dataIndex: 'lastActivity',
      key: 'lastActivity',
      render: (date) => <span style={{ fontSize: 12, color: '#8c8c8c' }}>{date}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<SettingOutlined />}>
            Manage
          </Button>
        </Space>
      ),
    },
  ];

  // Banking partner columns
  const bankingColumns: ColumnsType<BankingPartner> = [
    {
      title: 'Bank',
      dataIndex: 'bank',
      key: 'bank',
      render: (bank, record) => (
        <Space>
          <BankOutlined style={{ fontSize: 20 }} />
          <div>
            <div style={{ fontWeight: 500 }}>{bank}</div>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.accountType}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Account',
      dataIndex: 'accountNumber',
      key: 'accountNumber',
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance) => <span style={{ fontWeight: 500 }}>{balance}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'verified' ? 'green' : status === 'pending' ? 'orange' : 'red'} icon={status === 'verified' ? <CheckCircleOutlined /> : <WarningOutlined />}>
          {status.toUpperCase()}
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
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<SettingOutlined />}>
            Manage
          </Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>
            Remove
          </Button>
        </Space>
      ),
    },
  ];

  // Data provider columns
  const dataProviderColumns: ColumnsType<DataProvider> = [
    {
      title: 'Provider',
      dataIndex: 'provider',
      key: 'provider',
      render: (provider, record) => (
        <Space>
          <LineChartOutlined style={{ fontSize: 20 }} />
          <div>
            <div style={{ fontWeight: 500 }}>{provider}</div>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.service}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'default'} icon={status === 'active' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'API Calls (24h)',
      dataIndex: 'apiCalls',
      key: 'apiCalls',
      render: (calls) => calls.toLocaleString(),
    },
    {
      title: 'Last Update',
      dataIndex: 'lastUpdate',
      key: 'lastUpdate',
      render: (date) => <span style={{ fontSize: 12, color: '#8c8c8c' }}>{date}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<SettingOutlined />}>
            Configure
          </Button>
        </Space>
      ),
    },
  ];

  // Third-party service columns
  const serviceColumns: ColumnsType<ThirdPartyService> = [
    {
      title: 'Service',
      dataIndex: 'service',
      key: 'service',
      render: (service, record) => (
        <Space>
          <CloudServerOutlined style={{ fontSize: 20 }} />
          <div>
            <div style={{ fontWeight: 500 }}>{service}</div>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.category}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'connected' ? 'green' : 'default'} icon={status === 'connected' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Subscription',
      dataIndex: 'subscription',
      key: 'subscription',
      render: (sub) => <Tag color="blue">{sub}</Tag>,
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: (date) => <span style={{ fontSize: 12, color: '#8c8c8c' }}>{date}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {record.status === 'connected' ? (
            <>
              <Button type="link" size="small" icon={<SettingOutlined />}>
                Settings
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

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card>
            <Row align="middle" gutter={24}>
              <Col flex="auto">
                <Space direction="vertical" size={0}>
                  <h2 style={{ margin: 0 }}>
                    <LinkOutlined /> Fund Integrations
                  </h2>
                  <p style={{ margin: 0, color: '#8c8c8c' }}>
                    Manage trading integrations, custodial wallets, banking partners, and third-party services
                  </p>
                </Space>
              </Col>
              <Col>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
                  Add Integration
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Summary Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Trading Integrations" value={3} prefix={<ApiOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Custodial Wallets" value={3} prefix={<SafetyOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Banking Partners" value={3} prefix={<BankOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Third-Party Services" value={4} prefix={<CloudServerOutlined />} />
          </Card>
        </Col>
      </Row>

      {/* Alert for pending verifications */}
      <Alert
        message="Pending Verification"
        description="Signature Bank account verification is pending. Please complete the verification process."
        type="warning"
        showIcon
        closable
        style={{ marginBottom: 24 }}
      />

      {/* Tabs for different integration types */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <Tabs.TabPane
            tab={
              <span>
                <ApiOutlined />
                Trading Integrations
              </span>
            }
            key="trading"
          >
            <Table columns={tradingColumns} dataSource={tradingIntegrations} pagination={false} />
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={
              <span>
                <SafetyOutlined />
                Custodial Wallets
              </span>
            }
            key="wallets"
          >
            <Table columns={walletColumns} dataSource={custodialWallets} pagination={false} />
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={
              <span>
                <BankOutlined />
                Banking Partners
              </span>
            }
            key="banking"
          >
            <Table columns={bankingColumns} dataSource={bankingPartners} pagination={false} />
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={
              <span>
                <LineChartOutlined />
                Data Providers
              </span>
            }
            key="data"
          >
            <Table columns={dataProviderColumns} dataSource={dataProviders} pagination={false} />
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={
              <span>
                <CloudServerOutlined />
                Third-Party Services
              </span>
            }
            key="services"
          >
            <Table columns={serviceColumns} dataSource={thirdPartyServices} pagination={false} />
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={
              <span>
                <FileTextOutlined />
                Reporting Tools
              </span>
            }
            key="reporting"
          >
            <div style={{ padding: 24, textAlign: 'center' }}>
              <Space direction="vertical" size="large">
                <FileTextOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                <h3>Reporting Tools</h3>
                <p style={{ color: '#8c8c8c' }}>Connect reporting and analytics tools for enhanced fund management</p>
                <Button type="primary" icon={<PlusOutlined />}>
                  Add Reporting Tool
                </Button>
              </Space>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </Card>

      {/* Add Integration Modal */}
      <Modal
        title="Add New Integration"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => {
          message.success('Integration added successfully!');
          setModalVisible(false);
        }}
        width={600}
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Integration Type" name="integrationType" rules={[{ required: true }]}>
            <Select placeholder="Select integration type">
              <Select.Option value="trading">Trading Integration</Select.Option>
              <Select.Option value="custodial">Custodial Wallet</Select.Option>
              <Select.Option value="banking">Banking Partner</Select.Option>
              <Select.Option value="data">Data Provider</Select.Option>
              <Select.Option value="service">Third-Party Service</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Provider/Service Name" name="provider" rules={[{ required: true }]}>
            <Input placeholder="e.g., Fireblocks, Binance, JP Morgan" />
          </Form.Item>
          <Form.Item label="API Key" name="apiKey">
            <Input.Password placeholder="Enter API key (if applicable)" />
          </Form.Item>
          <Form.Item label="API Secret" name="apiSecret">
            <Input.Password placeholder="Enter API secret (if applicable)" />
          </Form.Item>
          <Divider />
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>
            <p>All credentials are encrypted and stored securely. Ensure you have the necessary permissions before adding integrations.</p>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default IntegrationsPage;
