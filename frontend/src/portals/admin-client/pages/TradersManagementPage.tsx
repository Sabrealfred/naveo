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
import { fetchTraders, type TraderRecord } from '../../../services/adminClient';

const { Text, Title } = Typography;

type TraderStatus = 'active' | 'suspended' | 'pending';

interface Trader {
  id: string;
  name: string;
  email: string;
  role: 'Junior' | 'Senior' | 'Lead';
  trades: number;
  volume: number;
  pnl: number;
  winRate: number;
  status: TraderStatus;
  bestTrade: number;
  worstTrade: number;
}

const mockTraders: Trader[] = [
  {
    id: '1',
    name: 'John Carter',
    email: 'john.carter@navfund.com',
    role: 'Lead',
    trades: 235,
    volume: 12500000,
    pnl: 245000,
    winRate: 68.5,
    status: 'active',
    bestTrade: 45000,
    worstTrade: -12000,
  },
  {
    id: '2',
    name: 'Sofia Martinez',
    email: 'sofia.martinez@navfund.com',
    role: 'Senior',
    trades: 184,
    volume: 9800000,
    pnl: 187500,
    winRate: 65.1,
    status: 'active',
    bestTrade: 33000,
    worstTrade: -8500,
  },
  {
    id: '3',
    name: 'Ethan Brooks',
    email: 'ethan.brooks@navfund.com',
    role: 'Junior',
    trades: 96,
    volume: 4100000,
    pnl: 42500,
    winRate: 57.3,
    status: 'pending',
    bestTrade: 15000,
    worstTrade: -9000,
  },
  {
    id: '4',
    name: 'Larissa Kim',
    email: 'larissa.kim@navfund.com',
    role: 'Senior',
    trades: 162,
    volume: 7600000,
    pnl: 112000,
    winRate: 61.9,
    status: 'active',
    bestTrade: 27000,
    worstTrade: -7000,
  },
  {
    id: '5',
    name: 'Marcus Lee',
    email: 'marcus.lee@navfund.com',
    role: 'Lead',
    trades: 205,
    volume: 13400000,
    pnl: 302000,
    winRate: 71.2,
    status: 'suspended',
    bestTrade: 52000,
    worstTrade: -25000,
  },
];

const statusColors: Record<TraderStatus, string> = {
  active: 'green',
  suspended: 'volcano',
  pending: 'gold',
};

const TradersManagementPage = () => {
  const [traders, setTraders] = useState<Trader[]>(mockTraders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TraderStatus>('all');
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [isPerformanceModalOpen, setPerformanceModalOpen] = useState(false);
  const [isPermissionsModalOpen, setPermissionsModalOpen] = useState(false);
  const [selectedTrader, setSelectedTrader] = useState<Trader | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadTraders = async () => {
      const { data, error } = await fetchTraders();
      if (!mounted) return;
      if (error) {
        console.warn('Supabase traders error', error);
        return;
      }
      if (data && data.length) {
        setTraders(data.map(mapTraderRecord));
      }
    };
    loadTraders();
    return () => {
      mounted = false;
    };
  }, []);

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
      title: 'Name',
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
      title: 'Role',
      dataIndex: 'role',
      filters: [
        { text: 'Junior', value: 'Junior' },
        { text: 'Senior', value: 'Senior' },
        { text: 'Lead', value: 'Lead' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Total Trades',
      dataIndex: 'trades',
      sorter: (a, b) => a.trades - b.trades,
    },
    {
      title: 'Volume',
      dataIndex: 'volume',
      render: (value: number) => `$${(value / 1_000_000).toFixed(2)}M`,
      sorter: (a, b) => a.volume - b.volume,
    },
    {
      title: 'P&L',
      dataIndex: 'pnl',
      render: (value: number) => (
        <Tag color={value >= 0 ? 'green' : 'volcano'}>
          {value >= 0 ? '+' : '-'}${Math.abs(value).toLocaleString()}
        </Tag>
      ),
      sorter: (a, b) => a.pnl - b.pnl,
    },
    {
      title: 'Win Rate',
      dataIndex: 'winRate',
      render: (value: number) => (
        <Tag color={value > 60 ? 'blue' : 'default'}>
          {value.toFixed(1)}%
        </Tag>
      ),
      sorter: (a, b) => a.winRate - b.winRate,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (value: TraderStatus) => <Tag color={statusColors[value]}>{value.toUpperCase()}</Tag>,
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Pending', value: 'pending' },
        { text: 'Suspended', value: 'suspended' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
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
            Performance
          </Button>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setSelectedTrader(record);
              setPermissionsModalOpen(true);
            }}
          >
            Permissions
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

  const handleStatusChange = (traderId: string, status: TraderStatus) => {
    setTraders((prev) =>
      prev.map((trader) =>
        trader.id === traderId ? { ...trader, status } : trader,
      ),
    );
    message.success(`Trader ${status === 'active' ? 'activado' : 'suspendido'}`);
  };

  const handleInviteSubmit = (values: { name: string; email: string; role: Trader['role']; limit: number }) => {
    const newTrader: Trader = {
      id: (traders.length + 1).toString(),
      name: values.name,
      email: values.email,
      role: values.role,
      trades: 0,
      volume: 0,
      pnl: 0,
      winRate: 0,
      status: 'pending',
      bestTrade: 0,
      worstTrade: 0,
    };

    setTraders((prev) => [newTrader, ...prev]);
    message.success('Invitación enviada al trader');
    setInviteModalOpen(false);
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

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <StatCard title="Total Traders" value={metrics.total} />
        </Col>
        <Col xs={24} md={6}>
          <StatCard title="Active Traders" value={metrics.active} />
        </Col>
        <Col xs={24} md={6}>
          <StatCard
            title="Trading Volume"
            value={`$${(metrics.volume / 1_000_000).toFixed(1)}M`}
          />
        </Col>
        <Col xs={24} md={6}>
          <StatCard title="Avg Win Rate" value={`${metrics.avgWinRate.toFixed(1)}%`} />
        </Col>
      </Row>

      <Card
        title="Traders Management"
        extra={
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => setInviteModalOpen(true)}
          >
            Add Trader
          </Button>
        }
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} md={16}>
            <Input
              placeholder="Buscar por nombre o email"
              allowClear
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </Col>
          <Col xs={24} md={8}>
            <Select
              value={statusFilter}
              onChange={(value) => setStatusFilter(value as 'all' | TraderStatus)}
              options={[
                { label: 'Todos los estados', value: 'all' },
                { label: 'Active', value: 'active' },
                { label: 'Pending', value: 'pending' },
                { label: 'Suspended', value: 'suspended' },
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
        title="Invitar nuevo trader"
        open={isInviteModalOpen}
        onCancel={() => setInviteModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleInviteSubmit}>
          <Form.Item
            label="Nombre completo"
            name="name"
            rules={[{ required: true, message: 'Ingresa el nombre' }]}
          >
            <Input placeholder="Jane Doe" />
          </Form.Item>
          <Form.Item
            label="Email institucional"
            name="email"
            rules={[
              { required: true, message: 'Ingresa el email' },
              { type: 'email', message: 'Email inválido' },
            ]}
          >
            <Input placeholder="trader@navfund.com" />
          </Form.Item>
          <Form.Item
            label="Rol"
            name="role"
            rules={[{ required: true, message: 'Selecciona un rol' }]}
          >
            <Select
              options={[
                { label: 'Junior Trader', value: 'Junior' },
                { label: 'Senior Trader', value: 'Senior' },
                { label: 'Lead Trader', value: 'Lead' },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Trading Limit (USD)"
            name="limit"
            rules={[{ required: true, message: 'Define un límite' }]}
          >
            <InputNumber
              min={500_000}
              step={100_000}
              style={{ width: '100%' }}
              prefix="$"
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Enviar invitación
          </Button>
        </Form>
      </Modal>

      <Modal
        title={`Performance de ${selectedTrader?.name ?? ''}`}
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
                <StatCard title="Total Trades" value={selectedTrader.trades} />
              </Col>
              <Col span={6}>
                <StatCard title="Win Rate" value={`${selectedTrader.winRate}%`} />
              </Col>
              <Col span={6}>
                <StatCard
                  title="Best Trade"
                  value={`$${selectedTrader.bestTrade.toLocaleString()}`}
                />
              </Col>
              <Col span={6}>
                <StatCard
                  title="Worst Trade"
                  value={`$${selectedTrader.worstTrade.toLocaleString()}`}
                  color="#ff4d4f"
                />
              </Col>
            </Row>

            <Card title="P&L Histórico">
              <Column
                data={performanceHistory}
                xField="month"
                yField="pnl"
                color={({ pnl }: { pnl: number }) => (pnl >= 0 ? '#52c41a' : '#ff4d4f')}
                height={260}
              />
            </Card>

            <Card title="Últimas operaciones" bodyStyle={{ padding: 0 }}>
              <Table
                dataSource={recentTrades}
                rowKey="id"
                pagination={false}
                columns={[
                  { title: 'ID', dataIndex: 'id' },
                  { title: 'Asset', dataIndex: 'symbol' },
                  { title: 'Type', dataIndex: 'type' },
                  {
                    title: 'Size',
                    dataIndex: 'size',
                    render: (value: number) => `$${value.toLocaleString()}`,
                  },
                  {
                    title: 'P&L',
                    dataIndex: 'pnl',
                    render: (value: number) => (
                      <Tag color={value >= 0 ? 'green' : 'volcano'}>
                        {value >= 0 ? '+' : '-'}${Math.abs(value).toLocaleString()}
                      </Tag>
                    ),
                  },
                  { title: 'Date', dataIndex: 'date' },
                ]}
              />
            </Card>
          </Space>
        )}
      </Modal>

      <Modal
        title="Editar permisos"
        open={isPermissionsModalOpen}
        onCancel={() => {
          setPermissionsModalOpen(false);
          setSelectedTrader(null);
        }}
        onOk={() => {
          message.success('Permisos actualizados');
          setPermissionsModalOpen(false);
        }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Title level={5}>{selectedTrader?.name}</Title>
            <Text type="secondary">{selectedTrader?.email}</Text>
          </div>

          <Form layout="vertical">
            <Form.Item label="Nivel de permisos">
              <Select
                defaultValue={selectedTrader?.role}
                options={[
                  { label: 'Junior - hasta $1M', value: 'Junior' },
                  { label: 'Senior - hasta $5M', value: 'Senior' },
                  { label: 'Lead - sin límite', value: 'Lead' },
                ]}
              />
            </Form.Item>
            <Form.Item label="Acceso a activos">
              <Select
                mode="multiple"
                defaultValue={['crypto', 'defi']}
                options={[
                  { label: 'Crypto Majors', value: 'crypto' },
                  { label: 'DeFi', value: 'defi' },
                  { label: 'Real World Assets', value: 'rwa' },
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

const mapTraderRecord = (record: TraderRecord): Trader => ({
  id: record.id,
  name: record.user_id ?? 'Unknown Trader',
  email: record.user_id ? `${record.user_id}@naveo.dev` : 'unknown@naveo.dev',
  role: (record.role as Trader['role']) ?? 'Junior',
  trades: Number(record.total_trades ?? 0),
  volume: Number(record.total_volume ?? 0),
  pnl: Number(record.total_pnl ?? 0),
  winRate: Number(record.win_rate ?? 0),
  status: (record.status as TraderStatus) ?? 'pending',
  bestTrade: 0,
  worstTrade: 0,
});
