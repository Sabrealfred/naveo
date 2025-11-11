import { useMemo, useState } from 'react';
import {
  Card,
  Col,
  Row,
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Statistic,
  Progress,
  Tabs,
  Badge,
  message,
  Dropdown,
  Menu,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  UserAddOutlined,
  EyeOutlined,
  SettingOutlined,
  LockOutlined,
  UnlockOutlined,
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  MoreOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
  WarningOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { Line, Column, Pie } from '@ant-design/charts';
import { StatCard } from '../../../components/common';
import { TraderManagementModal } from '../../../components/modals';

const { Text } = Typography;

type TraderStatus = 'active' | 'suspended' | 'pending';

interface Trader {
  id: string;
  name: string;
  email: string;
  role: 'Junior' | 'Senior' | 'Lead' | 'Principal';
  trades: number;
  volume: number;
  pnl: number;
  winRate: number;
  status: TraderStatus;
  bestTrade: number;
  worstTrade: number;
  assignedAssets: string[];
  joinDate: string;
  lastActive: string;
  avgTradeSize: number;
  dailyLimit: number;
  monthlyLimit: number;
  performance7d: number;
  performance30d: number;
}

const mockTraders: Trader[] = [
  {
    id: '1',
    name: 'John Carter',
    email: 'john.carter@fund.com',
    role: 'Lead',
    trades: 1245,
    volume: 52500000,
    pnl: 1245000,
    winRate: 72.5,
    status: 'active',
    bestTrade: 125000,
    worstTrade: -45000,
    assignedAssets: ['BTC', 'ETH', 'SOL'],
    joinDate: '2023-01-15',
    lastActive: '2024-11-10 16:45',
    avgTradeSize: 42168,
    dailyLimit: 500000,
    monthlyLimit: 10000000,
    performance7d: 8.5,
    performance30d: 22.3,
  },
  {
    id: '2',
    name: 'Sofia Martinez',
    email: 'sofia.martinez@fund.com',
    role: 'Senior',
    trades: 892,
    volume: 38800000,
    pnl: 875000,
    winRate: 68.1,
    status: 'active',
    bestTrade: 98000,
    worstTrade: -32000,
    assignedAssets: ['ETH', 'MATIC', 'AVAX'],
    joinDate: '2023-03-20',
    lastActive: '2024-11-10 15:20',
    avgTradeSize: 43497,
    dailyLimit: 400000,
    monthlyLimit: 8000000,
    performance7d: 6.2,
    performance30d: 18.9,
  },
  {
    id: '3',
    name: 'Marcus Thompson',
    email: 'marcus.thompson@fund.com',
    role: 'Principal',
    trades: 1567,
    volume: 67200000,
    pnl: 1567000,
    winRate: 74.2,
    status: 'active',
    bestTrade: 156000,
    worstTrade: -52000,
    assignedAssets: ['BTC', 'ETH', 'SOL', 'AVAX', 'LINK'],
    joinDate: '2022-09-10',
    lastActive: '2024-11-10 17:10',
    avgTradeSize: 42865,
    dailyLimit: 750000,
    monthlyLimit: 15000000,
    performance7d: 9.8,
    performance30d: 28.5,
  },
  {
    id: '4',
    name: 'Emily Chen',
    email: 'emily.chen@fund.com',
    role: 'Senior',
    trades: 756,
    volume: 29400000,
    pnl: 654000,
    winRate: 65.9,
    status: 'active',
    bestTrade: 87000,
    worstTrade: -28000,
    assignedAssets: ['BTC', 'LINK', 'UNI'],
    joinDate: '2023-05-08',
    lastActive: '2024-11-10 14:55',
    avgTradeSize: 38889,
    dailyLimit: 350000,
    monthlyLimit: 7000000,
    performance7d: 5.4,
    performance30d: 16.2,
  },
  {
    id: '5',
    name: 'David Kim',
    email: 'david.kim@fund.com',
    role: 'Lead',
    trades: 1089,
    volume: 45600000,
    pnl: 987000,
    winRate: 70.3,
    status: 'suspended',
    bestTrade: 112000,
    worstTrade: -67000,
    assignedAssets: ['ETH', 'SOL', 'MATIC'],
    joinDate: '2023-02-14',
    lastActive: '2024-11-08 11:20',
    avgTradeSize: 41873,
    dailyLimit: 450000,
    monthlyLimit: 9000000,
    performance7d: -2.3,
    performance30d: 12.7,
  },
  {
    id: '6',
    name: 'Laura Gomez',
    email: 'laura.gomez@fund.com',
    role: 'Junior',
    trades: 342,
    volume: 8200000,
    pnl: 184000,
    winRate: 60.4,
    status: 'pending',
    bestTrade: 32000,
    worstTrade: -12000,
    assignedAssets: ['BTC', 'ETH'],
    joinDate: '2024-02-01',
    lastActive: '2024-11-09 09:10',
    avgTradeSize: 23976,
    dailyLimit: 120000,
    monthlyLimit: 2500000,
    performance7d: 2.1,
    performance30d: 8.4,
  },
];

const performanceHistory = [
  { date: '2024-06', pnl: 320000 },
  { date: '2024-07', pnl: 410000 },
  { date: '2024-08', pnl: 380000 },
  { date: '2024-09', pnl: 460000 },
  { date: '2024-10', pnl: 520000 },
  { date: '2024-11', pnl: 560000 },
];

const tradeDistribution = mockTraders.reduce(
  (acc, trader) => {
    acc.labels.push(trader.name);
    acc.data.push(trader.volume / 1_000_000);
    return acc;
  },
  { labels: [] as string[], data: [] as number[] },
);

const TradersManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TraderStatus>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | Trader['role']>('all');
  const [selectedTrader, setSelectedTrader] = useState<Trader | null>(null);

  const filteredTraders = useMemo(() => {
    return mockTraders.filter((trader) => {
      const matchesSearch =
        trader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trader.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || trader.status === statusFilter;
      const matchesRole = roleFilter === 'all' || trader.role === roleFilter;
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [searchTerm, statusFilter, roleFilter]);

  const traderColumns: ColumnsType<Trader> = [
    {
      title: 'Trader',
      dataIndex: 'name',
      render: (value: string, record) => (
        <Space direction="vertical" size={0}>
          <strong>{value}</strong>
          <span style={{ color: '#888' }}>{record.email}</span>
        </Space>
      ),
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      filters: [
        { text: 'Junior', value: 'Junior' },
        { text: 'Senior', value: 'Senior' },
        { text: 'Lead', value: 'Lead' },
        { text: 'Principal', value: 'Principal' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Operaciones',
      dataIndex: 'trades',
      sorter: (a, b) => a.trades - b.trades,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: 'Volumen (USD)',
      dataIndex: 'volume',
      sorter: (a, b) => a.volume - b.volume,
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
    {
      title: 'Win Rate',
      dataIndex: 'winRate',
      render: (value: number) => (
        <Tag color={value >= 65 ? 'blue' : 'default'}>{value.toFixed(1)}%</Tag>
      ),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => setSelectedTrader(record)}
          >
            Ver
          </Button>
          <Dropdown
            overlay={
              <Menu
                items={[
                  {
                    key: 'promote',
                    label: 'Proponer ascenso',
                    icon: <ThunderboltOutlined />,
                  },
                  {
                    key: 'suspend',
                    label: record.status === 'suspended' ? 'Reactivar' : 'Suspender',
                    icon: record.status === 'suspended' ? <UnlockOutlined /> : <LockOutlined />,
                  },
                ]}
              />
            }
          >
            <Button icon={<MoreOutlined />} size="small" />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <StatCard title="Traders Activos" value={mockTraders.filter((t) => t.status === 'active').length} />
        </Col>
        <Col xs={24} md={6}>
          <StatCard title="Volumen 30d" value={`$${(mockTraders.reduce((sum, t) => sum + t.volume, 0) / 1_000_000).toFixed(1)}M`} />
        </Col>
        <Col xs={24} md={6}>
          <StatCard title="Win Rate medio" value={`${(mockTraders.reduce((sum, t) => sum + t.winRate, 0) / mockTraders.length).toFixed(1)}%`} />
        </Col>
        <Col xs={24} md={6}>
          <StatCard title="P&L YTD" value={`$${(mockTraders.reduce((sum, t) => sum + t.pnl, 0) / 1_000_000).toFixed(2)}M`} />
        </Col>
      </Row>

      <Card>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Buscar trader"
              allowClear
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </Col>
          <Col xs={24} md={8}>
            <Select
              style={{ width: '100%' }}
              placeholder="Filtrar por estado"
              value={statusFilter}
              onChange={(value) => setStatusFilter(value as typeof statusFilter)}
              options={[
                { label: 'Todos', value: 'all' },
                { label: 'Activos', value: 'active' },
                { label: 'Suspendidos', value: 'suspended' },
                { label: 'Pendientes', value: 'pending' },
              ]}
            />
          </Col>
          <Col xs={24} md={8}>
            <Select
              style={{ width: '100%' }}
              placeholder="Filtrar por rol"
              value={roleFilter}
              onChange={(value) => setRoleFilter(value as typeof roleFilter)}
              options={[
                { label: 'Todos', value: 'all' },
                { label: 'Junior', value: 'Junior' },
                { label: 'Senior', value: 'Senior' },
                { label: 'Lead', value: 'Lead' },
                { label: 'Principal', value: 'Principal' },
              ]}
            />
          </Col>
        </Row>
      </Card>

      <Table
        dataSource={filteredTraders}
        columns={traderColumns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="P&L histórico">
            <Line
              data={performanceHistory}
              xField="date"
              yField="pnl"
              point={{ size: 4 }}
              smooth
              yAxis={{ label: { formatter: (val: string) => `$${Number(val) / 1_000}K` } }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Distribución volumen por trader">
            <Column
              data={mockTraders.map((trader) => ({
                trader: trader.name,
                volume: trader.volume / 1_000_000,
              }))}
              xField="trader"
              yField="volume"
              label={{
                position: 'top',
                formatter: (data: { value: number }) => `${data.value.toFixed(1)}M`,
              }}
            />
          </Card>
        </Col>
      </Row>

      <Tabs
        defaultActiveKey="performance"
        items={[
          {
            key: 'performance',
            label: 'Performance Insights',
            children: (
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Card title="Ranking YTD">
                    <Pie
                      data={mockTraders.map((trader) => ({
                        trader: trader.name,
                        pnl: trader.pnl,
                      }))}
                      angleField="pnl"
                      colorField="trader"
                      radius={1}
                      label={{ type: 'outer', content: '{name} {percentage}' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card title="Alertas">
                    <Space direction="vertical">
                      <Badge status="warning" text="David Kim está suspendido por límites excedidos" />
                      <Badge status="processing" text="Laura Gomez pendiente de aprobación final" />
                      <Badge status="error" text="Marcus Thompson requiere revisión de límites" />
                    </Space>
                  </Card>
                </Col>
              </Row>
            ),
          },
          {
            key: 'limits',
            label: 'Límites & Riesgo',
            children: (
              <Row gutter={[16, 16]}>
                {mockTraders.slice(0, 4).map((trader) => (
                  <Col xs={24} md={12} key={trader.id}>
                    <Card title={trader.name}>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Text type="secondary">Uso diario</Text>
                        <Progress percent={((trader.avgTradeSize * trader.trades) / trader.dailyLimit) * 100} />
                        <Text type="secondary">Uso mensual</Text>
                        <Progress percent={(trader.volume / trader.monthlyLimit) * 100} status="active" />
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            ),
          },
        ]}
      />

      <Card
        title="Controles"
        extra={
          <Button type="primary" icon={<UserAddOutlined />}>
            Invitar Trader
          </Button>
        }
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Button block icon={<FilterOutlined />}>
              Crear política
            </Button>
          </Col>
          <Col xs={24} md={8}>
            <Button block icon={<DownloadOutlined />}>
              Exportar reporte
            </Button>
          </Col>
          <Col xs={24} md={8}>
            <Button block icon={<SettingOutlined />}>
              Configurar límites globales
            </Button>
          </Col>
        </Row>
      </Card>

      <TraderManagementModal
        visible={Boolean(selectedTrader)}
        trader={
          selectedTrader
            ? {
                id: selectedTrader.id,
                name: selectedTrader.name,
                email: selectedTrader.email,
                role: selectedTrader.role,
                status: selectedTrader.status === 'active' ? 'active' : 'suspended',
                joinDate: selectedTrader.joinDate,
                totalTrades: selectedTrader.trades,
                successRate: selectedTrader.winRate,
                pnl: selectedTrader.pnl,
                assignedAssets: selectedTrader.assignedAssets,
                tradingLimit: {
                  daily: selectedTrader.dailyLimit,
                  monthly: selectedTrader.monthlyLimit,
                },
              }
            : undefined
        }
        onClose={() => setSelectedTrader(null)}
        onSubmit={() => message.success('Configuración actualizada')}
      />
    </Space>
  );
};

export default TradersManagementPage;
