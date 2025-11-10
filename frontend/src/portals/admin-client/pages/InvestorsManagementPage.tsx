import { Card, Col, Row, Table, Tag, Button, Space, Input, Select, Badge } from 'antd';
import {
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  TeamOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { StatCard } from '../../../components/common';

const { Search } = Input;

export default function InvestorsManagementPage() {
  // Mock data
  const investorMetrics = {
    totalInvestors: 245,
    pendingKYC: 12,
    approved: 220,
    totalInvested: 85000000,
  };

  const investors = [
    {
      key: '1',
      name: 'John Smith',
      email: 'john@example.com',
      kycStatus: 'approved',
      investedAmount: 125000,
      shares: 1250,
      joinDate: '2024-08-15',
      tier: 'Gold',
    },
    {
      key: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      kycStatus: 'pending',
      investedAmount: 0,
      shares: 0,
      joinDate: '2024-11-10',
      tier: 'Silver',
    },
    {
      key: '3',
      name: 'Michael Chen',
      email: 'michael@example.com',
      kycStatus: 'approved',
      investedAmount: 250000,
      shares: 2500,
      joinDate: '2024-06-20',
      tier: 'Platinum',
    },
    {
      key: '4',
      name: 'Emily Davis',
      email: 'emily@example.com',
      kycStatus: 'rejected',
      investedAmount: 0,
      shares: 0,
      joinDate: '2024-10-05',
      tier: 'Bronze',
    },
  ];

  const columns = [
    {
      title: 'Investor',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          <UserOutlined />
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#999' }}>{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'KYC Status',
      dataIndex: 'kycStatus',
      key: 'kycStatus',
      filters: [
        { text: 'Approved', value: 'approved' },
        { text: 'Pending', value: 'pending' },
        { text: 'Rejected', value: 'rejected' },
      ],
      onFilter: (value: any, record: any) => record.kycStatus === value,
      render: (status: string) => {
        const config: Record<string, { color: string; icon: any; text: string }> = {
          approved: { color: 'success', icon: <CheckCircleOutlined />, text: 'Approved' },
          pending: { color: 'warning', icon: <ClockCircleOutlined />, text: 'Pending' },
          rejected: { color: 'error', icon: <CloseCircleOutlined />, text: 'Rejected' },
        };
        const { color, icon, text } = config[status] || config.pending;
        return (
          <Badge status={color as any} text={
            <Space>
              {icon}
              {text}
            </Space>
          } />
        );
      },
    },
    {
      title: 'Tier',
      dataIndex: 'tier',
      key: 'tier',
      render: (tier: string) => {
        const colors: Record<string, string> = {
          Platinum: 'purple',
          Gold: 'gold',
          Silver: 'default',
          Bronze: 'orange',
        };
        return <Tag color={colors[tier]}>{tier}</Tag>;
      },
    },
    {
      title: 'Invested',
      dataIndex: 'investedAmount',
      key: 'investedAmount',
      render: (amount: number) => `$${amount.toLocaleString()}`,
      sorter: (a: any, b: any) => a.investedAmount - b.investedAmount,
    },
    {
      title: 'Shares',
      dataIndex: 'shares',
      key: 'shares',
      render: (shares: number) => shares.toLocaleString(),
    },
    {
      title: 'Join Date',
      dataIndex: 'joinDate',
      key: 'joinDate',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" size="small">View</Button>
          {record.kycStatus === 'pending' && (
            <>
              <Button type="primary" size="small">Approve</Button>
              <Button danger size="small">Reject</Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: 'var(--color-background)' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
          Investors Management
        </h1>
        <p style={{ color: 'var(--color-secondary)', fontSize: '14px' }}>
          Manage and approve fund investors
        </p>
      </div>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Investors"
            value={investorMetrics.totalInvestors.toString()}
            icon={<TeamOutlined />}
            color="#2d2d2d"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Pending KYC"
            value={investorMetrics.pendingKYC.toString()}
            icon={<ClockCircleOutlined />}
            color="#fa8c16"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Approved"
            value={investorMetrics.approved.toString()}
            icon={<CheckCircleOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Invested"
            value={`$${(investorMetrics.totalInvested / 1000000).toFixed(1)}M`}
            icon={<DollarOutlined />}
            color="#722ed1"
          />
        </Col>
      </Row>

      {/* Filters */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md={12} lg={8}>
          <Search
            placeholder="Search by name or email"
            prefix={<SearchOutlined />}
            allowClear
          />
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Select
            placeholder="Filter by KYC Status"
            style={{ width: '100%' }}
            allowClear
            options={[
              { label: 'Approved', value: 'approved' },
              { label: 'Pending', value: 'pending' },
              { label: 'Rejected', value: 'rejected' },
            ]}
          />
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Select
            placeholder="Filter by Tier"
            style={{ width: '100%' }}
            allowClear
            options={[
              { label: 'Platinum', value: 'platinum' },
              { label: 'Gold', value: 'gold' },
              { label: 'Silver', value: 'silver' },
              { label: 'Bronze', value: 'bronze' },
            ]}
          />
        </Col>
      </Row>

      {/* Investors Table */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Investors List" bordered={false} className="professional-card">
            <Table
              dataSource={investors}
              columns={columns}
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1000 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
