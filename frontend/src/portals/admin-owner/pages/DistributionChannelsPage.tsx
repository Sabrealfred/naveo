import { useState } from 'react';
import { Card, Row, Col, Button, Table, Tag, Space, Modal, Form, Input, Select, Tabs, Switch, message, Statistic, Progress, Descriptions } from 'antd';
import { ShareAltOutlined, PlusOutlined, ApiOutlined, TeamOutlined, PercentageOutlined, GlobalOutlined, LinkOutlined, KeyOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface DistributionPartner {
  id: string;
  name: string;
  type: 'broker-dealer' | 'affiliate' | 'api-partner' | 'white-label';
  status: 'active' | 'inactive' | 'pending';
  volumeMTD: string;
  commission: string;
  investors: number;
  joinDate: string;
}

interface APIKey {
  id: string;
  partner: string;
  key: string;
  created: string;
  lastUsed: string;
  requests: number;
  status: 'active' | 'revoked';
}

/**
 * DistributionChannelsPage - Distribution partner and channel management
 *
 * Features:
 * - Distribution partner portal management
 * - Broker/dealer integrations
 * - Affiliate program tracking
 * - API for external distribution
 * - White-label capabilities
 * - Commission tracking
 * - Referral management
 */
const DistributionChannelsPage = () => {
  const [activeTab, setActiveTab] = useState('partners');
  const [addPartnerModalVisible, setAddPartnerModalVisible] = useState(false);
  const [apiKeyModalVisible, setApiKeyModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Mock data
  const partners: DistributionPartner[] = [
    {
      id: '1',
      name: 'Morgan Stanley Wealth Management',
      type: 'broker-dealer',
      status: 'active',
      volumeMTD: '$2.4M',
      commission: '$24,000',
      investors: 45,
      joinDate: '2024-01-15',
    },
    {
      id: '2',
      name: 'Goldman Sachs Private Wealth',
      type: 'broker-dealer',
      status: 'active',
      volumeMTD: '$3.2M',
      commission: '$32,000',
      investors: 62,
      joinDate: '2024-02-01',
    },
    {
      id: '3',
      name: 'CryptoWealth Partners',
      type: 'affiliate',
      status: 'active',
      volumeMTD: '$850K',
      commission: '$12,750',
      investors: 28,
      joinDate: '2024-03-10',
    },
    {
      id: '4',
      name: 'FintechAPI Solutions',
      type: 'api-partner',
      status: 'active',
      volumeMTD: '$1.5M',
      commission: '$15,000',
      investors: 120,
      joinDate: '2024-01-20',
    },
    {
      id: '5',
      name: 'Wealth Management Co.',
      type: 'white-label',
      status: 'active',
      volumeMTD: '$4.1M',
      commission: '$61,500',
      investors: 89,
      joinDate: '2024-02-15',
    },
    {
      id: '6',
      name: 'Digital Asset Advisors',
      type: 'affiliate',
      status: 'pending',
      volumeMTD: '$0',
      commission: '$0',
      investors: 0,
      joinDate: '2024-11-08',
    },
  ];

  const apiKeys: APIKey[] = [
    {
      id: '1',
      partner: 'FintechAPI Solutions',
      key: 'nav_live_sk_***************abc123',
      created: '2024-01-20',
      lastUsed: '2024-11-10 09:45',
      requests: 125430,
      status: 'active',
    },
    {
      id: '2',
      partner: 'Wealth Management Co.',
      key: 'nav_live_sk_***************def456',
      created: '2024-02-15',
      lastUsed: '2024-11-10 08:30',
      requests: 89234,
      status: 'active',
    },
    {
      id: '3',
      partner: 'FintechAPI Solutions (deprecated)',
      key: 'nav_live_sk_***************old789',
      created: '2024-01-20',
      lastUsed: '2024-03-15',
      requests: 45123,
      status: 'revoked',
    },
  ];

  const partnerColumns: ColumnsType<DistributionPartner> = [
    {
      title: 'Partner',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space>
          {record.type === 'broker-dealer' && <TeamOutlined style={{ color: '#1890ff' }} />}
          {record.type === 'affiliate' && <ShareAltOutlined style={{ color: '#52c41a' }} />}
          {record.type === 'api-partner' && <ApiOutlined style={{ color: '#722ed1' }} />}
          {record.type === 'white-label' && <GlobalOutlined style={{ color: '#fa8c16' }} />}
          <strong>{name}</strong>
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const config = {
          'broker-dealer': { color: 'blue', label: 'Broker/Dealer' },
          'affiliate': { color: 'green', label: 'Affiliate' },
          'api-partner': { color: 'purple', label: 'API Partner' },
          'white-label': { color: 'orange', label: 'White Label' },
        };
        return <Tag color={config[type].color}>{config[type].label}</Tag>;
      },
    },
    {
      title: 'Volume (MTD)',
      dataIndex: 'volumeMTD',
      key: 'volumeMTD',
      render: (vol) => <strong style={{ color: '#1890ff' }}>{vol}</strong>,
    },
    {
      title: 'Commission (MTD)',
      dataIndex: 'commission',
      key: 'commission',
      render: (comm) => <strong style={{ color: '#52c41a' }}>{comm}</strong>,
    },
    {
      title: 'Investors',
      dataIndex: 'investors',
      key: 'investors',
      align: 'center',
    },
    {
      title: 'Join Date',
      dataIndex: 'joinDate',
      key: 'joinDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = { active: 'green', inactive: 'red', pending: 'orange' };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button size="small">Edit</Button>
          <Button size="small" type="link">Portal</Button>
        </Space>
      ),
    },
  ];

  const apiColumns: ColumnsType<APIKey> = [
    {
      title: 'Partner',
      dataIndex: 'partner',
      key: 'partner',
    },
    {
      title: 'API Key',
      dataIndex: 'key',
      key: 'key',
      render: (key) => <code style={{ fontSize: 11 }}>{key}</code>,
    },
    {
      title: 'Created',
      dataIndex: 'created',
      key: 'created',
    },
    {
      title: 'Last Used',
      dataIndex: 'lastUsed',
      key: 'lastUsed',
      render: (date) => <span style={{ fontSize: 12 }}>{date}</span>,
    },
    {
      title: 'Requests',
      dataIndex: 'requests',
      key: 'requests',
      render: (count) => count.toLocaleString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = { active: 'green', revoked: 'red' };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {record.status === 'active' && <Button size="small" danger>Revoke</Button>}
          <Button size="small" type="link">Logs</Button>
        </Space>
      ),
    },
  ];

  const handleAddPartner = () => {
    form.validateFields().then((values) => {
      console.log('Add partner:', values);
      message.success('Partner added successfully');
      setAddPartnerModalVisible(false);
      form.resetFields();
    });
  };

  const handleGenerateAPIKey = () => {
    message.success('API key generated successfully');
    setApiKeyModalVisible(false);
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
                    <ShareAltOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                    Distribution Channels
                  </h2>
                  <p style={{ margin: 0, color: '#8c8c8c' }}>
                    Manage distribution partners, affiliates, and external integrations
                  </p>
                </Space>
              </Col>
              <Col>
                <Space>
                  <Button icon={<ApiOutlined />} onClick={() => setApiKeyModalVisible(true)}>
                    Generate API Key
                  </Button>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddPartnerModalVisible(true)}>
                    Add Partner
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
              title="Active Partners"
              value={partners.filter(p => p.status === 'active').length}
              suffix={`/ ${partners.length}`}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Volume (MTD)"
              value="12,050,000"
              prefix="$"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Commissions (MTD)"
              value="145,250"
              prefix="$"
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Investors"
              value={partners.reduce((sum, p) => sum + p.investors, 0)}
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
              key: 'partners',
              label: 'Distribution Partners',
              children: (
                <>
                  <Table
                    columns={partnerColumns}
                    dataSource={partners}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                  />
                </>
              ),
            },
            {
              key: 'api',
              label: 'API Keys',
              children: (
                <Table
                  columns={apiColumns}
                  dataSource={apiKeys}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
              ),
            },
            {
              key: 'commissions',
              label: 'Commission Structure',
              children: (
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <Card title="Commission Tiers">
                    <Descriptions column={2} bordered>
                      <Descriptions.Item label="Broker/Dealer">1.0% of AUM</Descriptions.Item>
                      <Descriptions.Item label="Minimum">$10,000/month</Descriptions.Item>
                      <Descriptions.Item label="Affiliate">1.5% of subscription</Descriptions.Item>
                      <Descriptions.Item label="Lifetime">Yes</Descriptions.Item>
                      <Descriptions.Item label="API Partner">1.0% flat fee</Descriptions.Item>
                      <Descriptions.Item label="Per Transaction">Yes</Descriptions.Item>
                      <Descriptions.Item label="White Label">1.5% + Platform Fee</Descriptions.Item>
                      <Descriptions.Item label="Custom Pricing">Available</Descriptions.Item>
                    </Descriptions>
                  </Card>

                  <Card title="Performance Bonuses">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div>
                        <div style={{ marginBottom: 8 }}>
                          <span>Volume Tier 1: $0 - $1M</span>
                          <Tag color="blue" style={{ float: 'right' }}>Standard Rate</Tag>
                        </div>
                        <Progress percent={100} showInfo={false} />
                      </div>
                      <div>
                        <div style={{ marginBottom: 8 }}>
                          <span>Volume Tier 2: $1M - $5M</span>
                          <Tag color="green" style={{ float: 'right' }}>+0.25% Bonus</Tag>
                        </div>
                        <Progress percent={45} showInfo={false} status="active" />
                      </div>
                      <div>
                        <div style={{ marginBottom: 8 }}>
                          <span>Volume Tier 3: $5M+</span>
                          <Tag color="gold" style={{ float: 'right' }}>+0.5% Bonus</Tag>
                        </div>
                        <Progress percent={0} showInfo={false} />
                      </div>
                    </Space>
                  </Card>
                </Space>
              ),
            },
            {
              key: 'settings',
              label: 'Settings',
              children: (
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <Card title="Partner Portal Settings">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Row justify="space-between">
                        <Col>Enable Partner Portal</Col>
                        <Col><Switch defaultChecked /></Col>
                      </Row>
                      <Row justify="space-between">
                        <Col>Allow Self-Registration</Col>
                        <Col><Switch /></Col>
                      </Row>
                      <Row justify="space-between">
                        <Col>Require Approval for New Partners</Col>
                        <Col><Switch defaultChecked /></Col>
                      </Row>
                      <Row justify="space-between">
                        <Col>Show Real-Time Commission</Col>
                        <Col><Switch defaultChecked /></Col>
                      </Row>
                    </Space>
                  </Card>

                  <Card title="White Label Configuration">
                    <Form layout="vertical">
                      <Form.Item label="Custom Domain Support">
                        <Switch defaultChecked />
                      </Form.Item>
                      <Form.Item label="Branding Customization">
                        <Select defaultValue="full" style={{ width: 200 }}>
                          <Select.Option value="none">None</Select.Option>
                          <Select.Option value="partial">Partial</Select.Option>
                          <Select.Option value="full">Full</Select.Option>
                        </Select>
                      </Form.Item>
                      <Form.Item label="API Rate Limit (requests/minute)">
                        <Input type="number" defaultValue={1000} style={{ width: 200 }} />
                      </Form.Item>
                    </Form>
                  </Card>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      {/* Add Partner Modal */}
      <Modal
        title="Add Distribution Partner"
        open={addPartnerModalVisible}
        onCancel={() => setAddPartnerModalVisible(false)}
        onOk={handleAddPartner}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Partner Name" rules={[{ required: true }]}>
            <Input placeholder="e.g., Morgan Stanley Wealth Management" />
          </Form.Item>

          <Form.Item name="type" label="Partner Type" rules={[{ required: true }]}>
            <Select placeholder="Select partner type">
              <Select.Option value="broker-dealer">Broker/Dealer</Select.Option>
              <Select.Option value="affiliate">Affiliate</Select.Option>
              <Select.Option value="api-partner">API Partner</Select.Option>
              <Select.Option value="white-label">White Label</Select.Option>
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="contactName" label="Contact Name" rules={[{ required: true }]}>
                <Input placeholder="Primary contact" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="contactEmail" label="Contact Email" rules={[{ required: true, type: 'email' }]}>
                <Input placeholder="email@partner.com" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="commissionRate" label="Commission Rate (%)" rules={[{ required: true }]}>
            <Input type="number" step="0.1" placeholder="1.0" suffix="%" />
          </Form.Item>

          <Form.Item name="notes" label="Notes">
            <Input.TextArea placeholder="Additional information" rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Generate API Key Modal */}
      <Modal
        title="Generate API Key"
        open={apiKeyModalVisible}
        onCancel={() => setApiKeyModalVisible(false)}
        onOk={handleGenerateAPIKey}
        width={600}
      >
        <Form layout="vertical">
          <Form.Item label="Partner" required>
            <Select placeholder="Select partner">
              {partners
                .filter(p => p.type === 'api-partner' || p.type === 'white-label')
                .map(p => (
                  <Select.Option key={p.id} value={p.id}>{p.name}</Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item label="Key Name">
            <Input placeholder="e.g., Production API Key" />
          </Form.Item>

          <Form.Item label="Permissions">
            <Select mode="multiple" placeholder="Select permissions">
              <Select.Option value="read">Read Access</Select.Option>
              <Select.Option value="trade">Trade Execution</Select.Option>
              <Select.Option value="investor">Investor Management</Select.Option>
              <Select.Option value="reporting">Reporting</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Rate Limit (requests/minute)">
            <Input type="number" defaultValue={1000} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DistributionChannelsPage;
