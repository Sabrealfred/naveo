import { Card, Col, Row, Table, Tag, Button, Space, Switch } from 'antd';
import {
  UserAddOutlined,
  SafetyOutlined,
  TeamOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import { StatCard } from '../../../components/common';

export default function SubAdminsManagementPage() {
  const metrics = {
    totalAdmins: 5,
    active: 4,
    suspended: 1,
  };

  const subAdmins = [
    {
      key: '1',
      name: 'Alice Cooper',
      email: 'alice@fund.com',
      role: 'Portfolio Manager',
      permissions: ['view_assets', 'manage_assets', 'view_investors'],
      status: 'active',
      lastLogin: '2024-11-10 09:30',
    },
    {
      key: '2',
      name: 'Bob Williams',
      email: 'bob@fund.com',
      role: 'Compliance Officer',
      permissions: ['view_compliance', 'approve_kyc', 'view_reports'],
      status: 'active',
      lastLogin: '2024-11-09 14:20',
    },
    {
      key: '3',
      name: 'Charlie Davis',
      email: 'charlie@fund.com',
      role: 'Operations',
      permissions: ['view_transactions', 'reconcile', 'view_reports'],
      status: 'suspended',
      lastLogin: '2024-10-28 16:45',
    },
  ];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#999' }}>{record.email}</div>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => <Tag color="blue">{role}</Tag>,
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: string[]) => (
        <Space size="small" wrap>
          {permissions.slice(0, 2).map(perm => (
            <Tag key={perm} style={{ fontSize: '11px' }}>
              {perm.replace('_', ' ')}
            </Tag>
          ))}
          {permissions.length > 2 && (
            <Tag style={{ fontSize: '11px' }}>+{permissions.length - 2} more</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
    },
    {
      title: 'Active',
      key: 'toggle',
      render: (_: any, record: any) => (
        <Switch checked={record.status === 'active'} />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<SafetyOutlined />}>
            Edit Permissions
          </Button>
          <Button type="link" size="small" danger>
            Remove
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: 'var(--color-background)' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
            Sub-Admins Management
          </h1>
          <p style={{ color: 'var(--color-secondary)', fontSize: '14px' }}>
            Manage sub-administrators and their permissions
          </p>
        </div>
        <Button type="primary" icon={<UserAddOutlined />} size="large">
          Add Sub-Admin
        </Button>
      </div>

      {/* Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <StatCard
            title="Total Admins"
            value={metrics.totalAdmins.toString()}
            icon={<TeamOutlined />}
            color="#2d2d2d"
          />
        </Col>
        <Col xs={24} sm={8}>
          <StatCard
            title="Active"
            value={metrics.active.toString()}
            icon={<UnlockOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={8}>
          <StatCard
            title="Suspended"
            value={metrics.suspended.toString()}
            icon={<LockOutlined />}
            color="#f5222d"
          />
        </Col>
      </Row>

      {/* Table */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Sub-Administrators" bordered={false} className="professional-card">
            <Table
              dataSource={subAdmins}
              columns={columns}
              pagination={false}
              scroll={{ x: 1000 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
