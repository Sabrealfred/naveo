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
import { useTranslation } from 'react-i18next';
import { StatCard } from '../../../components/common';

const { Search } = Input;

export default function InvestorsManagementPage() {
  const { t } = useTranslation();
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
      title: t('investors.investor'),
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
      title: t('investors.kycStatus'),
      dataIndex: 'kycStatus',
      key: 'kycStatus',
      filters: [
        { text: t('investors.approved'), value: 'approved' },
        { text: t('investors.pending'), value: 'pending' },
        { text: t('investors.rejected'), value: 'rejected' },
      ],
      onFilter: (value: any, record: any) => record.kycStatus === value,
      render: (status: string) => {
        const config: Record<string, { color: string; icon: any; text: string }> = {
          approved: { color: 'success', icon: <CheckCircleOutlined />, text: t('investors.approved') },
          pending: { color: 'warning', icon: <ClockCircleOutlined />, text: t('investors.pending') },
          rejected: { color: 'error', icon: <CloseCircleOutlined />, text: t('investors.rejected') },
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
      title: t('investors.tier'),
      dataIndex: 'tier',
      key: 'tier',
      render: (tier: string) => {
        const colors: Record<string, string> = {
          Platinum: 'purple',
          Gold: 'gold',
          Silver: 'default',
          Bronze: 'orange',
        };
        const tierTranslations: Record<string, string> = {
          Platinum: t('investors.platinum'),
          Gold: t('investors.gold'),
          Silver: t('investors.silver'),
          Bronze: t('investors.bronze'),
        };
        return <Tag color={colors[tier]}>{tierTranslations[tier] || tier}</Tag>;
      },
    },
    {
      title: t('investors.invested'),
      dataIndex: 'investedAmount',
      key: 'investedAmount',
      render: (amount: number) => `$${amount.toLocaleString()}`,
      sorter: (a: any, b: any) => a.investedAmount - b.investedAmount,
    },
    {
      title: t('investors.shares'),
      dataIndex: 'shares',
      key: 'shares',
      render: (shares: number) => shares.toLocaleString(),
    },
    {
      title: t('investors.joinDate'),
      dataIndex: 'joinDate',
      key: 'joinDate',
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" size="small">{t('investors.view')}</Button>
          {record.kycStatus === 'pending' && (
            <>
              <Button type="primary" size="small">{t('investors.approve')}</Button>
              <Button danger size="small">{t('investors.reject')}</Button>
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
          {t('investors.title')}
        </h1>
        <p style={{ color: 'var(--color-secondary)', fontSize: '14px' }}>
          {t('investors.subtitle')}
        </p>
      </div>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title={t('investors.totalInvestors')}
            value={investorMetrics.totalInvestors.toString()}
            icon={<TeamOutlined />}
            color="#2d2d2d"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title={t('investors.pendingKYC')}
            value={investorMetrics.pendingKYC.toString()}
            icon={<ClockCircleOutlined />}
            color="#fa8c16"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title={t('investors.approved')}
            value={investorMetrics.approved.toString()}
            icon={<CheckCircleOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title={t('investors.totalInvested')}
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
            placeholder={t('investors.searchPlaceholder')}
            prefix={<SearchOutlined />}
            allowClear
          />
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Select
            placeholder={t('investors.filterByKycStatus')}
            style={{ width: '100%' }}
            allowClear
            options={[
              { label: t('investors.approved'), value: 'approved' },
              { label: t('investors.pending'), value: 'pending' },
              { label: t('investors.rejected'), value: 'rejected' },
            ]}
          />
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Select
            placeholder={t('investors.filterByTier')}
            style={{ width: '100%' }}
            allowClear
            options={[
              { label: t('investors.platinum'), value: 'platinum' },
              { label: t('investors.gold'), value: 'gold' },
              { label: t('investors.silver'), value: 'silver' },
              { label: t('investors.bronze'), value: 'bronze' },
            ]}
          />
        </Col>
      </Row>

      {/* Investors Table */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title={t('investors.investorsList')} bordered={false} className="professional-card">
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
