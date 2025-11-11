import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  UserAddOutlined,
  EyeOutlined,
  EditOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import { Column } from '@ant-design/charts';
import { StatCard } from '../../../components/common';
import { tradersService, fundsService, supabaseClient } from '../../../services';
import type { Trader as DbTrader } from '../../../services/types';
import { useTranslation } from 'react-i18next';

const { Text, Title } = Typography;

type TraderStatus = 'active' | 'suspended' | 'pending';

interface Trader {
  id: string;
  name: string;
  email: string;
  role: 'junior' | 'senior' | 'lead';
  trades: number;
  volume: number;
  pnl: number;
  winRate: number;
  status: TraderStatus;
  bestTrade: number;
  worstTrade: number;
  fund_id: string | null;
  user_id: string | null;
}

const statusColors: Record<TraderStatus, string> = {
  active: 'green',
  suspended: 'volcano',
  pending: 'gold',
};

const TradersManagementPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [traders, setTraders] = useState<Trader[]>([]);
  const [currentFundId, setCurrentFundId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TraderStatus>('all');
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [isPerformanceModalOpen, setPerformanceModalOpen] = useState(false);
  const [isPermissionsModalOpen, setPermissionsModalOpen] = useState(false);
  const [selectedTrader, setSelectedTrader] = useState<Trader | null>(null);

  useEffect(() => {
    loadTraders();
  }, []);

  const loadTraders = async () => {
    try {
      setLoading(true);

      // Get first active fund (in real app, would get fund by manager ID from auth)
      const funds = await fundsService.getActiveFunds();
      if (funds.length === 0) {
        message.warning('No active funds found');
        setLoading(false);
        return;
      }

      const fundId = funds[0].id;
      setCurrentFundId(fundId);

      // Load traders for this fund
      const dbTraders = await tradersService.getTradersByFund(fundId);

      // Map to component format
      const mappedTraders = dbTraders.map(mapDbTraderToTrader);
      setTraders(mappedTraders);

    } catch (error: any) {
      console.error('Error loading traders:', error);
      message.error('Failed to load traders: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const metrics = useMemo(() => {
    const total = traders.length;
    const active = traders.filter((trader) => trader.status === 'active').length;
    const volume = traders.reduce((sum, trader) => sum + trader.volume, 0);
    const avgWinRate =
      traders.reduce((sum, trader) => sum + trader.winRate, 0) / (total || 1);

    return {
      total,
      active,
      volume,
      avgWinRate,
    };
  }, [traders]);

  const filteredTraders = useMemo(() => {
    return traders.filter((trader) => {
      const matchesSearch =
        trader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trader.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || trader.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [traders, searchTerm, statusFilter]);

  const columns: ColumnsType<Trader> = [
    {
      title: t('adminClient.tradersManagement.name'),
      dataIndex: 'name',
      render: (value, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{value}</Text>
          <Text type="secondary">{record.email}</Text>
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: t('adminClient.tradersManagement.role'),
      dataIndex: 'role',
      render: (role: string) => role?.charAt(0).toUpperCase() + role?.slice(1),
      filters: [
        { text: t('adminClient.tradersManagement.junior'), value: 'junior' },
        { text: t('adminClient.tradersManagement.senior'), value: 'senior' },
        { text: t('adminClient.tradersManagement.lead'), value: 'lead' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: t('adminClient.tradersManagement.totalTrades'),
      dataIndex: 'trades',
      sorter: (a, b) => a.trades - b.trades,
    },
    {
      title: t('adminClient.tradersManagement.volume'),
      dataIndex: 'volume',
      render: (value: number) => `$${(value / 1_000_000).toFixed(2)}M`,
      sorter: (a, b) => a.volume - b.volume,
    },
    {
      title: t('adminClient.traders.profitLoss'),
      dataIndex: 'pnl',
      render: (value: number) => (
        <Tag color={value >= 0 ? 'green' : 'volcano'}>
          {value >= 0 ? '+' : '-'}${Math.abs(value).toLocaleString()}
        </Tag>
      ),
      sorter: (a, b) => a.pnl - b.pnl,
    },
    {
      title: t('adminClient.traders.winRate'),
      dataIndex: 'winRate',
      render: (value: number) => (
        <Tag color={value > 60 ? 'blue' : 'default'}>
          {value.toFixed(1)}%
        </Tag>
      ),
      sorter: (a, b) => a.winRate - b.winRate,
    },
    {
      title: t('adminClient.tradersManagement.status'),
      dataIndex: 'status',
      render: (value: TraderStatus) => <Tag color={statusColors[value]}>{value.toUpperCase()}</Tag>,
      filters: [
        { text: t('adminClient.traders.active'), value: 'active' },
        { text: t('transactionsPage.pending'), value: 'pending' },
        { text: t('adminClient.tradersManagement.suspend'), value: 'suspended' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => {
              setSelectedTrader(record);
              setPerformanceModalOpen(true);
            }}
          >
            {t('adminClient.tradersManagement.viewPerformance')}
          </Button>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setSelectedTrader(record);
              setPermissionsModalOpen(true);
            }}
          >
            {t('adminClient.tradersManagement.editPermissions')}
          </Button>
          <Switch
            checkedChildren={<UnlockOutlined />}
            unCheckedChildren={<LockOutlined />}
            checked={record.status === 'active'}
            onChange={(checked) =>
              handleStatusChange(record.id, checked ? 'active' : 'suspended')
            }
          />
        </Space>
      ),
    },
  ];

  const handleStatusChange = async (traderId: string, status: TraderStatus) => {
    try {
      await tradersService.updateTrader(traderId, { status });

      setTraders((prev) =>
        prev.map((trader) =>
          trader.id === traderId ? { ...trader, status } : trader,
        ),
      );
      message.success(`Trader ${status === 'active' ? 'activated' : 'suspended'}`);
    } catch (error: any) {
      console.error('Error updating trader status:', error);
      message.error('Failed to update trader status: ' + error.message);
    }
  };

  const handleInviteSubmit = async (values: { name: string; email: string; role: Trader['role']; limit: number }) => {
    try {
      // In real app, would create user first, then create trader record
      // For now, creating trader with user_id placeholder
      const newDbTrader = await tradersService.createTrader({
        fund_id: currentFundId,
        user_id: values.email, // Placeholder - would be actual user ID
        role: values.role,
        status: 'pending'
      });

      const newTrader = mapDbTraderToTrader(newDbTrader);
      setTraders((prev) => [newTrader, ...prev]);
      message.success('Trader invited successfully');
      setInviteModalOpen(false);
    } catch (error: any) {
      console.error('Error creating trader:', error);
      message.error('Failed to invite trader: ' + error.message);
    }
  };

  const performanceHistory = useMemo(() => {
    if (!selectedTrader) return [];
    return Array.from({ length: 8 }).map((_, index) => ({
      month: `2024-${(index + 5).toString().padStart(2, '0')}`,
      pnl: selectedTrader.pnl / 8 + (Math.random() - 0.5) * 20000,
    }));
  }, [selectedTrader]);

  const recentTrades = useMemo(() => {
    if (!selectedTrader) return [];
    return Array.from({ length: 10 }).map((_, index) => ({
      id: `TX-${index + 1}`,
      symbol: ['BTC', 'ETH', 'SOL', 'ATOM'][index % 4],
      type: index % 3 === 0 ? 'Short' : 'Long',
      pnl: (Math.random() - 0.4) * 15000,
      size: Math.round(Math.random() * 300000),
      date: `2024-11-${(10 - index).toString().padStart(2, '0')}`,
    }));
  }, [selectedTrader]);

  if (loading) {
    return (
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" tip="Loading traders..." />
      </div>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <StatCard title={t('adminClient.tradersManagement.totalTraders')} value={metrics.total} />
        </Col>
        <Col xs={24} md={6}>
          <StatCard title={t('adminClient.tradersManagement.activeTraders')} value={metrics.active} />
        </Col>
        <Col xs={24} md={6}>
          <StatCard
            title={t('adminClient.tradersManagement.totalVolume')}
            value={`$${(metrics.volume / 1_000_000).toFixed(1)}M`}
          />
        </Col>
        <Col xs={24} md={6}>
          <StatCard title={t('adminClient.tradersManagement.avgWinRate')} value={`${metrics.avgWinRate.toFixed(1)}%`} />
        </Col>
      </Row>

      <Card
        title={t('adminClient.tradersManagement.title')}
        extra={
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => setInviteModalOpen(true)}
          >
            {t('adminClient.tradersManagement.addTrader')}
          </Button>
        }
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} md={16}>
            <Input
              placeholder={t('adminClient.tradersManagement.email')}
              allowClear
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </Col>
          <Col xs={24} md={8}>
            <Select
              value={statusFilter}
              onChange={(value) => setStatusFilter(value as 'all' | TraderStatus)}
              options={[
                { label: t('adminClient.tradersManagement.status'), value: 'all' },
                { label: t('adminClient.traders.active'), value: 'active' },
                { label: t('transactionsPage.pending'), value: 'pending' },
                { label: t('adminClient.tradersManagement.suspend'), value: 'suspended' },
              ]}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredTraders}
          pagination={{ pageSize: 8 }}
        />
      </Card>

      <Modal
        title={t('adminClient.tradersManagement.addTrader')}
        open={isInviteModalOpen}
        onCancel={() => setInviteModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleInviteSubmit}>
          <Form.Item
            label={t('adminClient.tradersManagement.name')}
            name="name"
            rules={[{ required: true, message: t('adminClient.tradersManagement.name') }]}
          >
            <Input placeholder="Jane Doe" />
          </Form.Item>
          <Form.Item
            label={t('adminClient.tradersManagement.email')}
            name="email"
            rules={[
              { required: true, message: t('adminClient.tradersManagement.email') },
              { type: 'email', message: t('login.emailInvalid') },
            ]}
          >
            <Input placeholder="trader@navfund.com" />
          </Form.Item>
          <Form.Item
            label={t('adminClient.tradersManagement.role')}
            name="role"
            rules={[{ required: true, message: t('adminClient.tradersManagement.role') }]}
          >
            <Select
              options={[
                { label: t('adminClient.tradersManagement.junior'), value: 'junior' },
                { label: t('adminClient.tradersManagement.senior'), value: 'senior' },
                { label: t('adminClient.tradersManagement.lead'), value: 'lead' },
              ]}
            />
          </Form.Item>
          <Form.Item
            label={t('adminClient.tradersManagement.totalVolume')}
            name="limit"
            rules={[{ required: true, message: t('adminClient.tradersManagement.totalVolume') }]}
          >
            <InputNumber
              min={500_000}
              step={100_000}
              style={{ width: '100%' }}
              prefix="$"
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            {t('common.submit')}
          </Button>
        </Form>
      </Modal>

      <Modal
        title={`${t('adminClient.tradersManagement.viewPerformance')} - ${selectedTrader?.name ?? ''}`}
        open={isPerformanceModalOpen}
        onCancel={() => {
          setPerformanceModalOpen(false);
          setSelectedTrader(null);
        }}
        footer={null}
        width={900}
      >
        {selectedTrader && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <StatCard title={t('adminClient.tradersManagement.totalTrades')} value={selectedTrader.trades} />
              </Col>
              <Col span={6}>
                <StatCard title={t('adminClient.traders.winRate')} value={`${selectedTrader.winRate}%`} />
              </Col>
              <Col span={6}>
                <StatCard
                  title={t('adminClient.traders.trades')}
                  value={`$${selectedTrader.bestTrade.toLocaleString()}`}
                />
              </Col>
              <Col span={6}>
                <StatCard
                  title={t('adminClient.traders.trades')}
                  value={`$${selectedTrader.worstTrade.toLocaleString()}`}
                  color="#ff4d4f"
                />
              </Col>
            </Row>

            <Card title={t('adminClient.traders.profitLoss')}>
              <Column
                data={performanceHistory}
                xField="month"
                yField="pnl"
                color={({ pnl }) => (pnl >= 0 ? '#52c41a' : '#ff4d4f')}
                height={260}
              />
            </Card>

            <Card title={t('adminClient.dashboard.recentTransactions')} bodyStyle={{ padding: 0 }}>
              <Table
                dataSource={recentTrades}
                rowKey="id"
                pagination={false}
                columns={[
                  { title: 'ID', dataIndex: 'id' },
                  { title: t('adminClient.transactions.asset'), dataIndex: 'symbol' },
                  { title: t('adminClient.transactions.type'), dataIndex: 'type' },
                  {
                    title: t('adminClient.transactions.amount'),
                    dataIndex: 'size',
                    render: (value: number) => `$${value.toLocaleString()}`,
                  },
                  {
                    title: t('adminClient.traders.profitLoss'),
                    dataIndex: 'pnl',
                    render: (value: number) => (
                      <Tag color={value >= 0 ? 'green' : 'volcano'}>
                        {value >= 0 ? '+' : '-'}${Math.abs(value).toLocaleString()}
                      </Tag>
                    ),
                  },
                  { title: t('adminClient.assets.date'), dataIndex: 'date' },
                ]}
              />
            </Card>
          </Space>
        )}
      </Modal>

      <Modal
        title={t('adminClient.tradersManagement.editPermissions')}
        open={isPermissionsModalOpen}
        onCancel={() => {
          setPermissionsModalOpen(false);
          setSelectedTrader(null);
        }}
        onOk={() => {
          message.success(t('adminClient.tradersManagement.editPermissions'));
          setPermissionsModalOpen(false);
        }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Title level={5}>{selectedTrader?.name}</Title>
            <Text type="secondary">{selectedTrader?.email}</Text>
          </div>

          <Form layout="vertical">
            <Form.Item label={t('adminClient.tradersManagement.role')}>
              <Select
                defaultValue={selectedTrader?.role}
                options={[
                  { label: `${t('adminClient.tradersManagement.junior')} - $1M`, value: 'junior' },
                  { label: `${t('adminClient.tradersManagement.senior')} - $5M`, value: 'senior' },
                  { label: `${t('adminClient.tradersManagement.lead')}`, value: 'lead' },
                ]}
              />
            </Form.Item>
            <Form.Item label={t('adminClient.assets.type')}>
              <Select
                mode="multiple"
                defaultValue={['crypto', 'defi']}
                options={[
                  { label: t('marketplace.cryptoFund'), value: 'crypto' },
                  { label: t('marketplace.defi'), value: 'defi' },
                  { label: t('marketplace.realEstate'), value: 'rwa' },
                  { label: 'Derivatives', value: 'derivatives' },
                ]}
              />
            </Form.Item>
          </Form>
        </Space>
      </Modal>
    </Space>
  );
};

export default TradersManagementPage;

// Helper function to map database Trader to component Trader
const mapDbTraderToTrader = (dbTrader: DbTrader): Trader => {
  // Extract name from user_id or use placeholder
  const userId = dbTrader.user_id || '';
  const name = userId.includes('@')
    ? userId.split('@')[0].replace(/[._-]/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : `Trader ${userId.substring(0, 8)}`;

  const email = userId.includes('@') ? userId : `${userId}@naveo.dev`;

  return {
    id: dbTrader.id,
    name,
    email,
    role: (dbTrader.role as Trader['role']) || 'junior',
    trades: dbTrader.total_trades || 0,
    volume: dbTrader.total_volume || 0,
    pnl: dbTrader.total_pnl || 0,
    winRate: dbTrader.win_rate || 0,
    status: (dbTrader.status as TraderStatus) || 'pending',
    bestTrade: 0, // Would need additional query to get best/worst trades
    worstTrade: 0,
    fund_id: dbTrader.fund_id,
    user_id: dbTrader.user_id,
  };
};
