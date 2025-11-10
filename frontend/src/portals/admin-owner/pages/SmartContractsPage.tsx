import { Card, Col, Row, Table, Tag, Button, Space, Modal, Form, Input, Select, Alert, Tooltip } from 'antd';
import {
  CodeOutlined,
  RocketOutlined,
  SafetyOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ApiOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { StatCard } from '../../../components/common';
import { useState } from 'react';

const { TextArea } = Input;

export default function SmartContractsPage() {
  const [upgradeModalVisible, setUpgradeModalVisible] = useState(false);
  const [deployModalVisible, setDeployModalVisible] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any>(null);

  // Mock smart contracts data
  const contractsData = [
    {
      key: '1',
      name: 'Token Contract (ERC-20)',
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      network: 'Polygon',
      version: 'v2.1.0',
      status: 'active',
      deployer: 'Admin',
      deployedAt: '2024-06-15',
      lastUpgrade: '2024-09-20',
      gasUsed: '2,450,000',
      interactions: 8945,
    },
    {
      key: '2',
      name: 'NAV Oracle Contract',
      address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      network: 'Polygon',
      version: 'v1.5.2',
      status: 'active',
      deployer: 'Admin',
      deployedAt: '2024-05-10',
      lastUpgrade: '2024-08-15',
      gasUsed: '1,850,000',
      interactions: 12456,
    },
    {
      key: '3',
      name: 'Diamond Proxy',
      address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      network: 'Polygon',
      version: 'v3.0.1',
      status: 'active',
      deployer: 'Admin',
      deployedAt: '2024-07-01',
      lastUpgrade: '2024-10-05',
      gasUsed: '3,200,000',
      interactions: 5632,
    },
    {
      key: '4',
      name: 'Governance Contract',
      address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      network: 'Ethereum',
      version: 'v1.2.0',
      status: 'paused',
      deployer: 'Admin',
      deployedAt: '2024-04-20',
      lastUpgrade: '2024-07-10',
      gasUsed: '4,120,000',
      interactions: 892,
    },
    {
      key: '5',
      name: 'Staking Contract',
      address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      network: 'Ethereum',
      version: 'v2.0.0',
      status: 'deprecated',
      deployer: 'Admin',
      deployedAt: '2024-03-01',
      lastUpgrade: '2024-05-15',
      gasUsed: '2,890,000',
      interactions: 3421,
    },
  ];

  const metrics = {
    totalContracts: 5,
    activeContracts: 3,
    totalInteractions: 31346,
    totalGasUsed: 14510000,
    pendingUpgrades: 1,
    networksSupported: 2,
  };

  // Pending upgrades
  const pendingUpgradesData = [
    {
      key: '1',
      contract: 'NAV Oracle Contract',
      currentVersion: 'v1.5.2',
      newVersion: 'v1.6.0',
      changes: 'Add multi-oracle support, Gas optimization',
      risk: 'Medium',
      scheduledDate: '2024-11-15',
    },
  ];

  const contractColumns = [
    {
      title: 'Contract Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <CodeOutlined />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (addr: string) => (
        <code style={{ fontSize: '12px', background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>
          {addr.substring(0, 10)}...{addr.substring(addr.length - 8)}
        </code>
      ),
    },
    {
      title: 'Network',
      dataIndex: 'network',
      key: 'network',
      render: (network: string) => (
        <Tag color={network === 'Polygon' ? 'purple' : 'blue'}>{network}</Tag>
      ),
    },
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
      render: (ver: string) => <Tag>{ver}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          active: 'green',
          paused: 'orange',
          deprecated: 'red',
        };
        const iconMap: Record<string, any> = {
          active: <CheckCircleOutlined />,
          paused: <WarningOutlined />,
          deprecated: <SafetyOutlined />,
        };
        return (
          <Tag color={colorMap[status]} icon={iconMap[status]}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Interactions',
      dataIndex: 'interactions',
      key: 'interactions',
      render: (val: number) => val.toLocaleString(),
      sorter: (a: any, b: any) => a.interactions - b.interactions,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="View Details">
            <Button type="link" size="small" icon={<FileTextOutlined />}>
              Details
            </Button>
          </Tooltip>
          <Tooltip title="Upgrade Contract">
            <Button
              type="link"
              size="small"
              icon={<RocketOutlined />}
              onClick={() => {
                setSelectedContract(record);
                setUpgradeModalVisible(true);
              }}
              disabled={record.status !== 'active'}
            >
              Upgrade
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const upgradeColumns = [
    {
      title: 'Contract',
      dataIndex: 'contract',
      key: 'contract',
    },
    {
      title: 'Current → New',
      key: 'version',
      render: (_: any, record: any) => (
        <span>
          {record.currentVersion} → <strong>{record.newVersion}</strong>
        </span>
      ),
    },
    {
      title: 'Changes',
      dataIndex: 'changes',
      key: 'changes',
    },
    {
      title: 'Risk Level',
      dataIndex: 'risk',
      key: 'risk',
      render: (risk: string) => {
        const colorMap: Record<string, string> = {
          Low: 'green',
          Medium: 'orange',
          High: 'red',
        };
        return <Tag color={colorMap[risk]}>{risk}</Tag>;
      },
    },
    {
      title: 'Scheduled',
      dataIndex: 'scheduledDate',
      key: 'scheduledDate',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="primary" size="small" icon={<RocketOutlined />}>
            Execute
          </Button>
          <Button size="small">Cancel</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
          Smart Contracts Management
        </h1>
        <p style={{ color: '#8c8c8c', fontSize: '14px' }}>
          Deploy, upgrade, and monitor blockchain smart contracts
        </p>
      </div>

      {/* Alert for pending upgrades */}
      {metrics.pendingUpgrades > 0 && (
        <Alert
          message={`${metrics.pendingUpgrades} pending contract upgrade(s)`}
          description="Review and execute scheduled upgrades below"
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          style={{ marginBottom: '24px' }}
          action={
            <Button size="small" type="primary">
              Review
            </Button>
          }
        />
      )}

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Contracts"
            value={metrics.totalContracts.toString()}
            icon={<CodeOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Active Contracts"
            value={metrics.activeContracts.toString()}
            icon={<CheckCircleOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Interactions"
            value={metrics.totalInteractions.toLocaleString()}
            icon={<ApiOutlined />}
            color="#722ed1"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Networks"
            value={metrics.networksSupported.toString()}
            icon={<SafetyOutlined />}
            color="#fa8c16"
          />
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Card>
            <Space size="middle">
              <Button
                type="primary"
                icon={<RocketOutlined />}
                size="large"
                onClick={() => setDeployModalVisible(true)}
              >
                Deploy New Contract
              </Button>
              <Button icon={<SyncOutlined />} size="large">
                Sync Contract State
              </Button>
              <Button icon={<SafetyOutlined />} size="large">
                Audit Logs
              </Button>
              <Button icon={<FileTextOutlined />} size="large">
                Export Report
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Pending Upgrades */}
      {pendingUpgradesData.length > 0 && (
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col span={24}>
            <Card title="Pending Upgrades" bordered={false}>
              <Table
                dataSource={pendingUpgradesData}
                columns={upgradeColumns}
                pagination={false}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Contracts Table */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Deployed Contracts" bordered={false}>
            <Table
              dataSource={contractsData}
              columns={contractColumns}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Upgrade Modal */}
      <Modal
        title="Upgrade Smart Contract"
        open={upgradeModalVisible}
        onCancel={() => setUpgradeModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setUpgradeModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" icon={<RocketOutlined />}>
            Schedule Upgrade
          </Button>,
        ]}
        width={600}
      >
        <Form layout="vertical">
          <Form.Item label="Contract Name">
            <Input value={selectedContract?.name} disabled />
          </Form.Item>
          <Form.Item label="Current Version">
            <Input value={selectedContract?.version} disabled />
          </Form.Item>
          <Form.Item label="New Version" required>
            <Input placeholder="e.g., v2.2.0" />
          </Form.Item>
          <Form.Item label="Network">
            <Input value={selectedContract?.network} disabled />
          </Form.Item>
          <Form.Item label="Upgrade Description" required>
            <TextArea
              rows={4}
              placeholder="Describe the changes in this upgrade..."
            />
          </Form.Item>
          <Form.Item label="Risk Level" required>
            <Select placeholder="Select risk level">
              <Select.Option value="low">Low - Minor bug fixes</Select.Option>
              <Select.Option value="medium">Medium - Feature updates</Select.Option>
              <Select.Option value="high">High - Major changes</Select.Option>
            </Select>
          </Form.Item>
          <Alert
            message="Warning"
            description="Contract upgrades are irreversible. Ensure thorough testing before deployment."
            type="warning"
            showIcon
          />
        </Form>
      </Modal>

      {/* Deploy Modal */}
      <Modal
        title="Deploy New Smart Contract"
        open={deployModalVisible}
        onCancel={() => setDeployModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setDeployModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" icon={<RocketOutlined />}>
            Deploy Contract
          </Button>,
        ]}
        width={700}
      >
        <Form layout="vertical">
          <Form.Item label="Contract Type" required>
            <Select placeholder="Select contract type">
              <Select.Option value="erc20">ERC-20 Token</Select.Option>
              <Select.Option value="erc721">ERC-721 NFT</Select.Option>
              <Select.Option value="diamond">Diamond Proxy</Select.Option>
              <Select.Option value="oracle">Price Oracle</Select.Option>
              <Select.Option value="governance">Governance</Select.Option>
              <Select.Option value="custom">Custom Contract</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Contract Name" required>
            <Input placeholder="e.g., Naveo Token" />
          </Form.Item>
          <Form.Item label="Network" required>
            <Select placeholder="Select blockchain network">
              <Select.Option value="polygon">Polygon Mainnet</Select.Option>
              <Select.Option value="ethereum">Ethereum Mainnet</Select.Option>
              <Select.Option value="polygon-mumbai">Polygon Mumbai (Testnet)</Select.Option>
              <Select.Option value="goerli">Goerli (Testnet)</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Contract Code" required>
            <TextArea
              rows={8}
              placeholder="Paste Solidity contract code here..."
              style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}
            />
          </Form.Item>
          <Form.Item label="Constructor Arguments">
            <TextArea
              rows={3}
              placeholder="Enter constructor arguments (JSON format)"
            />
          </Form.Item>
          <Alert
            message="Deployment Checklist"
            description={
              <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                <li>Contract code has been audited</li>
                <li>Constructor arguments are correct</li>
                <li>Sufficient gas balance available</li>
                <li>Network selection is correct</li>
              </ul>
            }
            type="info"
            showIcon
          />
        </Form>
      </Modal>
    </div>
  );
}
