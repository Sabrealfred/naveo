import { useState } from 'react';
import { Card, Row, Col, Button, Table, Tag, Space, Modal, Form, Input, Select, Tabs, Switch, message, Statistic, Badge } from 'antd';
import { WalletOutlined, PlusOutlined, LinkOutlined, SafetyOutlined, KeyOutlined, QrcodeOutlined, SettingOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface Wallet {
  id: string;
  name: string;
  type: 'custodial' | 'non-custodial' | 'hardware' | 'multisig';
  provider: string;
  address: string;
  network: string;
  balance: string;
  status: 'active' | 'inactive' | 'pending';
  users: number;
  createdAt: string;
}

interface WalletProvider {
  id: string;
  name: string;
  type: 'web3' | 'custodial' | 'hardware';
  logo: string;
  status: 'connected' | 'disconnected';
  users: number;
}

/**
 * WalletManagementPage - Comprehensive wallet integration and management
 *
 * Features:
 * - Web3 wallet connections (MetaMask, WalletConnect, Coinbase Wallet)
 * - Custodial wallet services (platform-managed with multi-sig)
 * - Hardware wallet support (Ledger, Trezor)
 * - Wallet recovery flows
 * - Multi-signature wallet setup
 * - Provider configuration
 */
const WalletManagementPage = () => {
  const [activeTab, setActiveTab] = useState('wallets');
  const [addWalletModalVisible, setAddWalletModalVisible] = useState(false);
  const [configureProviderModalVisible, setConfigureProviderModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Mock data
  const wallets: Wallet[] = [
    {
      id: '1',
      name: 'Fund Treasury Wallet',
      type: 'multisig',
      provider: 'Gnosis Safe',
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      network: 'Ethereum',
      balance: '$2,450,000',
      status: 'active',
      users: 15,
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Investor Custody Pool',
      type: 'custodial',
      provider: 'Fireblocks',
      address: '0x8e23Ee67d1332aD560396262C48ffbB273f626a',
      network: 'Polygon',
      balance: '$1,200,000',
      status: 'active',
      users: 342,
      createdAt: '2024-02-01',
    },
    {
      id: '3',
      name: 'Cold Storage Vault',
      type: 'hardware',
      provider: 'Ledger',
      address: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0',
      network: 'Ethereum',
      balance: '$5,000,000',
      status: 'active',
      users: 3,
      createdAt: '2024-01-10',
    },
    {
      id: '4',
      name: 'Trading Wallet',
      type: 'non-custodial',
      provider: 'MetaMask',
      address: '0x9f8d6e5c4b3a2918273645f1e0d9c8b7a6f5e4d',
      network: 'Arbitrum',
      balance: '$350,000',
      status: 'active',
      users: 8,
      createdAt: '2024-03-05',
    },
    {
      id: '5',
      name: 'Settlement Wallet (Pending)',
      type: 'custodial',
      provider: 'Coinbase Custody',
      address: 'Pending Setup',
      network: 'Base',
      balance: '$0',
      status: 'pending',
      users: 0,
      createdAt: '2024-11-10',
    },
  ];

  const providers: WalletProvider[] = [
    { id: '1', name: 'MetaMask', type: 'web3', logo: '🦊', status: 'connected', users: 125 },
    { id: '2', name: 'WalletConnect', type: 'web3', logo: '🔗', status: 'connected', users: 98 },
    { id: '3', name: 'Coinbase Wallet', type: 'web3', logo: '💼', status: 'connected', users: 67 },
    { id: '4', name: 'Fireblocks', type: 'custodial', logo: '🔥', status: 'connected', users: 342 },
    { id: '5', name: 'Coinbase Custody', type: 'custodial', logo: '🏦', status: 'disconnected', users: 0 },
    { id: '6', name: 'Gnosis Safe', type: 'web3', logo: '🛡️', status: 'connected', users: 15 },
    { id: '7', name: 'Ledger', type: 'hardware', logo: '📟', status: 'connected', users: 3 },
    { id: '8', name: 'Trezor', type: 'hardware', logo: '🔐', status: 'disconnected', users: 0 },
  ];

  const columns: ColumnsType<Wallet> = [
    {
      title: 'Wallet Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space>
          {record.type === 'multisig' && <SafetyOutlined style={{ color: '#52c41a' }} />}
          {record.type === 'custodial' && <WalletOutlined style={{ color: '#1890ff' }} />}
          {record.type === 'hardware' && <KeyOutlined style={{ color: '#fa8c16' }} />}
          {record.type === 'non-custodial' && <LinkOutlined style={{ color: '#722ed1' }} />}
          <strong>{name}</strong>
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const colors = {
          custodial: 'blue',
          'non-custodial': 'purple',
          hardware: 'orange',
          multisig: 'green',
        };
        return <Tag color={colors[type]}>{type.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Provider',
      dataIndex: 'provider',
      key: 'provider',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (address) => (
        <code style={{ fontSize: 11 }}>
          {address.length > 30 ? `${address.slice(0, 10)}...${address.slice(-8)}` : address}
        </code>
      ),
    },
    {
      title: 'Network',
      dataIndex: 'network',
      key: 'network',
      render: (network) => <Tag>{network}</Tag>,
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance) => <strong style={{ color: '#52c41a' }}>{balance}</strong>,
    },
    {
      title: 'Users',
      dataIndex: 'users',
      key: 'users',
      align: 'center',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = { active: 'green', inactive: 'red', pending: 'orange' };
        return <Badge status={status === 'active' ? 'success' : status === 'pending' ? 'warning' : 'error'} text={status.toUpperCase()} />;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<SettingOutlined />}>Configure</Button>
          <Button size="small" type="link">View Details</Button>
        </Space>
      ),
    },
  ];

  const handleAddWallet = () => {
    form.validateFields().then((values) => {
      console.log('Add wallet:', values);
      message.success('Wallet configuration initiated');
      setAddWalletModalVisible(false);
      form.resetFields();
    });
  };

  const handleConfigureProvider = () => {
    message.success('Provider configured successfully');
    setConfigureProviderModalVisible(false);
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
                    <WalletOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                    Wallet Management
                  </h2>
                  <p style={{ margin: 0, color: '#8c8c8c' }}>
                    Manage wallet integrations, custody solutions, and Web3 connections
                  </p>
                </Space>
              </Col>
              <Col>
                <Space>
                  <Button icon={<QrcodeOutlined />}>Connect Wallet</Button>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddWalletModalVisible(true)}>
                    Add Wallet
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
              title="Total Wallets"
              value={wallets.length}
              prefix={<WalletOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Balance"
              value="9,000,000"
              prefix="$"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Connected Users"
              value={wallets.reduce((sum, w) => sum + w.users, 0)}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Providers"
              value={providers.filter(p => p.status === 'connected').length}
              suffix={`/ ${providers.length}`}
              valueStyle={{ color: '#fa8c16' }}
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
              key: 'wallets',
              label: 'Wallets',
              children: (
                <Table
                  columns={columns}
                  dataSource={wallets}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
              ),
            },
            {
              key: 'providers',
              label: 'Wallet Providers',
              children: (
                <Row gutter={[16, 16]}>
                  {providers.map((provider) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={provider.id}>
                      <Card
                        hoverable
                        actions={[
                          provider.status === 'connected' ? (
                            <Button type="link" size="small">Configure</Button>
                          ) : (
                            <Button type="primary" size="small" onClick={() => setConfigureProviderModalVisible(true)}>
                              Connect
                            </Button>
                          ),
                        ]}
                      >
                        <Card.Meta
                          avatar={<div style={{ fontSize: 32 }}>{provider.logo}</div>}
                          title={provider.name}
                          description={
                            <Space direction="vertical" size={4} style={{ width: '100%' }}>
                              <Tag color={provider.type === 'web3' ? 'blue' : provider.type === 'custodial' ? 'green' : 'orange'}>
                                {provider.type.toUpperCase()}
                              </Tag>
                              <Badge
                                status={provider.status === 'connected' ? 'success' : 'default'}
                                text={provider.status}
                              />
                              <div style={{ fontSize: 12, color: '#8c8c8c' }}>{provider.users} users</div>
                            </Space>
                          }
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              ),
            },
            {
              key: 'security',
              label: 'Security Settings',
              children: (
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <Card title="Multi-Signature Requirements">
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Form.Item label="Required Signatures">
                          <Input type="number" defaultValue={2} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Total Signers">
                          <Input type="number" defaultValue={3} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>

                  <Card title="Wallet Policies">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Row justify="space-between">
                        <Col>Daily Transaction Limit</Col>
                        <Col><Switch defaultChecked /></Col>
                      </Row>
                      <Row justify="space-between">
                        <Col>Whitelist Addresses Only</Col>
                        <Col><Switch /></Col>
                      </Row>
                      <Row justify="space-between">
                        <Col>Auto-Approve Small Transactions (&lt;$1000)</Col>
                        <Col><Switch defaultChecked /></Col>
                      </Row>
                      <Row justify="space-between">
                        <Col>Require 2FA for Wallet Actions</Col>
                        <Col><Switch defaultChecked /></Col>
                      </Row>
                    </Space>
                  </Card>

                  <Card title="Recovery Settings">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Button icon={<KeyOutlined />}>Configure Recovery Phrase Backup</Button>
                      <Button icon={<SafetyOutlined />}>Setup Social Recovery</Button>
                      <Button icon={<QrcodeOutlined />}>Generate Recovery QR Code</Button>
                    </Space>
                  </Card>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      {/* Add Wallet Modal */}
      <Modal
        title="Add New Wallet"
        open={addWalletModalVisible}
        onCancel={() => setAddWalletModalVisible(false)}
        onOk={handleAddWallet}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Wallet Name" rules={[{ required: true }]}>
            <Input placeholder="e.g., Fund Treasury Wallet" />
          </Form.Item>

          <Form.Item name="type" label="Wallet Type" rules={[{ required: true }]}>
            <Select placeholder="Select wallet type">
              <Select.Option value="custodial">Custodial (Platform Managed)</Select.Option>
              <Select.Option value="non-custodial">Non-Custodial (User Managed)</Select.Option>
              <Select.Option value="multisig">Multi-Signature</Select.Option>
              <Select.Option value="hardware">Hardware Wallet</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="provider" label="Provider" rules={[{ required: true }]}>
            <Select placeholder="Select provider">
              <Select.Option value="fireblocks">Fireblocks</Select.Option>
              <Select.Option value="coinbase-custody">Coinbase Custody</Select.Option>
              <Select.Option value="gnosis-safe">Gnosis Safe</Select.Option>
              <Select.Option value="metamask">MetaMask</Select.Option>
              <Select.Option value="walletconnect">WalletConnect</Select.Option>
              <Select.Option value="ledger">Ledger</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="network" label="Network" rules={[{ required: true }]}>
            <Select placeholder="Select network">
              <Select.Option value="ethereum">Ethereum</Select.Option>
              <Select.Option value="polygon">Polygon</Select.Option>
              <Select.Option value="arbitrum">Arbitrum</Select.Option>
              <Select.Option value="base">Base</Select.Option>
              <Select.Option value="optimism">Optimism</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="address" label="Wallet Address (Optional)">
            <Input placeholder="0x..." />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="Purpose and usage of this wallet" rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Configure Provider Modal */}
      <Modal
        title="Configure Wallet Provider"
        open={configureProviderModalVisible}
        onCancel={() => setConfigureProviderModalVisible(false)}
        onOk={handleConfigureProvider}
        width={600}
      >
        <Form layout="vertical">
          <Form.Item label="API Key">
            <Input.Password placeholder="Enter provider API key" />
          </Form.Item>
          <Form.Item label="API Secret">
            <Input.Password placeholder="Enter provider API secret" />
          </Form.Item>
          <Form.Item label="Webhook URL">
            <Input placeholder="https://your-domain.com/webhooks/wallet" />
          </Form.Item>
          <Form.Item label="Environment">
            <Select defaultValue="production">
              <Select.Option value="sandbox">Sandbox</Select.Option>
              <Select.Option value="production">Production</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WalletManagementPage;
