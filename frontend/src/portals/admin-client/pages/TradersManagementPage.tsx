import { useState, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
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
  DatePicker,
  message,
  Dropdown,
  Menu,
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
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

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

// Extended mock data with 20 traders
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
    name: 'Isabella Rodriguez',
    email: 'isabella.rodriguez@fund.com',
    role: 'Junior',
    trades: 423,
    volume: 16800000,
    pnl: 287000,
    winRate: 62.4,
    status: 'active',
    bestTrade: 52000,
    worstTrade: -19000,
    assignedAssets: ['BTC', 'ETH'],
    joinDate: '2024-01-10',
    lastActive: '2024-11-10 16:30',
    avgTradeSize: 39716,
    dailyLimit: 200000,
    monthlyLimit: 4000000,
    performance7d: 4.1,
    performance30d: 11.8,
  },
  {
    id: '7',
    name: 'James Wilson',
    email: 'james.wilson@fund.com',
    role: 'Senior',
    trades: 934,
    volume: 41200000,
    pnl: 823000,
    winRate: 69.2,
    status: 'active',
    bestTrade: 95000,
    worstTrade: -38000,
    assignedAssets: ['SOL', 'AVAX', 'ATOM'],
    joinDate: '2023-04-22',
    lastActive: '2024-11-10 15:45',
    avgTradeSize: 44090,
    dailyLimit: 400000,
    monthlyLimit: 8000000,
    performance7d: 7.3,
    performance30d: 19.6,
  },
  {
    id: '8',
    name: 'Aisha Patel',
    email: 'aisha.patel@fund.com',
    role: 'Lead',
    trades: 1178,
    volume: 49800000,
    pnl: 1124000,
    winRate: 71.8,
    status: 'active',
    bestTrade: 118000,
    worstTrade: -41000,
    assignedAssets: ['BTC', 'ETH', 'LINK', 'UNI'],
    joinDate: '2022-11-30',
    lastActive: '2024-11-10 17:00',
    avgTradeSize: 42275,
    dailyLimit: 500000,
    monthlyLimit: 10000000,
    performance7d: 8.9,
    performance30d: 24.1,
  },
  {
    id: '9',
    name: 'Michael Brown',
    email: 'michael.brown@fund.com',
    role: 'Junior',
    trades: 387,
    volume: 14200000,
    pnl: 198000,
    winRate: 59.7,
    status: 'pending',
    bestTrade: 38000,
    worstTrade: -15000,
    assignedAssets: ['ETH', 'MATIC'],
    joinDate: '2024-03-15',
    lastActive: '2024-11-10 13:25',
    avgTradeSize: 36692,
    dailyLimit: 150000,
    monthlyLimit: 3000000,
    performance7d: 3.2,
    performance30d: 8.5,
  },
  {
    id: '10',
    name: 'Yuki Tanaka',
    email: 'yuki.tanaka@fund.com',
    role: 'Principal',
    trades: 1423,
    volume: 71500000,
    pnl: 1689000,
    winRate: 75.6,
    status: 'active',
    bestTrade: 167000,
    worstTrade: -48000,
    assignedAssets: ['BTC', 'ETH', 'SOL', 'LINK', 'AVAX', 'ATOM'],
    joinDate: '2022-06-01',
    lastActive: '2024-11-10 17:15',
    avgTradeSize: 50246,
    dailyLimit: 800000,
    monthlyLimit: 16000000,
    performance7d: 10.4,
    performance30d: 31.2,
  },
  {
    id: '11',
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@fund.com',
    role: 'Senior',
    trades: 812,
    volume: 35600000,
    pnl: 723000,
    winRate: 67.3,
    status: 'active',
    bestTrade: 89000,
    worstTrade: -34000,
    assignedAssets: ['BTC', 'SOL', 'AVAX'],
    joinDate: '2023-06-12',
    lastActive: '2024-11-10 14:20',
    avgTradeSize: 43842,
    dailyLimit: 375000,
    monthlyLimit: 7500000,
    performance7d: 6.8,
    performance30d: 17.4,
  },
  {
    id: '12',
    name: 'Nina Petrov',
    email: 'nina.petrov@fund.com',
    role: 'Lead',
    trades: 1067,
    volume: 46900000,
    pnl: 1056000,
    winRate: 72.1,
    status: 'active',
    bestTrade: 127000,
    worstTrade: -39000,
    assignedAssets: ['ETH', 'SOL', 'MATIC', 'LINK'],
    joinDate: '2023-01-28',
    lastActive: '2024-11-10 16:50',
    avgTradeSize: 43953,
    dailyLimit: 475000,
    monthlyLimit: 9500000,
    performance7d: 8.1,
    performance30d: 21.8,
  },
  {
    id: '13',
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@fund.com',
    role: 'Junior',
    trades: 456,
    volume: 18900000,
    pnl: 334000,
    winRate: 63.2,
    status: 'active',
    bestTrade: 61000,
    worstTrade: -21000,
    assignedAssets: ['BTC', 'LINK'],
    joinDate: '2023-11-20',
    lastActive: '2024-11-10 15:10',
    avgTradeSize: 41447,
    dailyLimit: 225000,
    monthlyLimit: 4500000,
    performance7d: 4.7,
    performance30d: 13.2,
  },
  {
    id: '14',
    name: 'Li Wei',
    email: 'li.wei@fund.com',
    role: 'Senior',
    trades: 923,
    volume: 40100000,
    pnl: 856000,
    winRate: 68.9,
    status: 'active',
    bestTrade: 102000,
    worstTrade: -36000,
    assignedAssets: ['BTC', 'ETH', 'ATOM'],
    joinDate: '2023-03-05',
    lastActive: '2024-11-10 16:05',
    avgTradeSize: 43445,
    dailyLimit: 400000,
    monthlyLimit: 8000000,
    performance7d: 7.6,
    performance30d: 19.1,
  },
  {
    id: '15',
    name: 'Sarah O\'Connor',
    email: 'sarah.oconnor@fund.com',
    role: 'Lead',
    trades: 1189,
    volume: 51300000,
    pnl: 1187000,
    winRate: 73.4,
    status: 'active',
    bestTrade: 134000,
    worstTrade: -44000,
    assignedAssets: ['BTC', 'ETH', 'SOL', 'LINK'],
    joinDate: '2022-10-18',
    lastActive: '2024-11-10 17:05',
    avgTradeSize: 43152,
    dailyLimit: 525000,
    monthlyLimit: 10500000,
    performance7d: 8.7,
    performance30d: 25.3,
  },
  {
    id: '16',
    name: 'Thomas Anderson',
    email: 'thomas.anderson@fund.com',
    role: 'Junior',
    trades: 398,
    volume: 15100000,
    pnl: 242000,
    winRate: 60.8,
    status: 'active',
    bestTrade: 48000,
    worstTrade: -17000,
    assignedAssets: ['ETH', 'AVAX'],
    joinDate: '2024-02-08',
    lastActive: '2024-11-10 14:40',
    avgTradeSize: 37940,
    dailyLimit: 180000,
    monthlyLimit: 3600000,
    performance7d: 3.9,
    performance30d: 10.4,
  },
  {
    id: '17',
    name: 'Maya Singh',
    email: 'maya.singh@fund.com',
    role: 'Principal',
    trades: 1512,
    volume: 69800000,
    pnl: 1734000,
    winRate: 76.1,
    status: 'active',
    bestTrade: 178000,
    worstTrade: -51000,
    assignedAssets: ['BTC', 'ETH', 'SOL', 'LINK', 'AVAX', 'UNI'],
    joinDate: '2022-07-22',
    lastActive: '2024-11-10 17:20',
    avgTradeSize: 46164,
    dailyLimit: 850000,
    monthlyLimit: 17000000,
    performance7d: 11.2,
    performance30d: 32.7,
  },
  {
    id: '18',
    name: 'Roberto Dias',
    email: 'roberto.dias@fund.com',
    role: 'Senior',
    trades: 867,
    volume: 37200000,
    pnl: 789000,
    winRate: 66.7,
    status: 'suspended',
    bestTrade: 93000,
    worstTrade: -58000,
    assignedAssets: ['BTC', 'MATIC', 'ATOM'],
    joinDate: '2023-04-10',
    lastActive: '2024-11-09 09:15',
    avgTradeSize: 42906,
    dailyLimit: 380000,
    monthlyLimit: 7600000,
    performance7d: -1.8,
    performance30d: 14.3,
  },
  {
    id: '19',
    name: 'Anna Kowalski',
    email: 'anna.kowalski@fund.com',
    role: 'Lead',
    trades: 1134,
    volume: 48700000,
    pnl: 1098000,
    winRate: 71.5,
    status: 'active',
    bestTrade: 121000,
    worstTrade: -42000,
    assignedAssets: ['ETH', 'SOL', 'LINK', 'UNI'],
    joinDate: '2022-12-05',
    lastActive: '2024-11-10 16:55',
    avgTradeSize: 42945,
    dailyLimit: 490000,
    monthlyLimit: 9800000,
    performance7d: 8.4,
    performance30d: 23.6,
  },
  {
    id: '20',
    name: 'Daniel Park',
    email: 'daniel.park@fund.com',
    role: 'Junior',
    trades: 412,
    volume: 16200000,
    pnl: 276000,
    winRate: 61.9,
    status: 'pending',
    bestTrade: 54000,
    worstTrade: -18000,
    assignedAssets: ['BTC', 'ETH'],
    joinDate: '2024-01-28',
    lastActive: '2024-11-10 13:50',
    avgTradeSize: 39320,
    dailyLimit: 190000,
    monthlyLimit: 3800000,
    performance7d: 4.3,
    performance30d: 9.7,
  },
];

const statusColors: Record<TraderStatus, string> = {
  active: 'green',
  suspended: 'volcano',
  pending: 'gold',
};

const TradersManagementPage = () => {
  const [traders] = useState<Trader[]>(mockTraders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TraderStatus>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | string>('all');
  const [selectedTrader, setSelectedTrader] = useState<any>(null);
  const [traderModalVisible, setTraderModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const metrics = useMemo(() => {
    const total = traders.length;
    const active = traders.filter((t) => t.status === 'active').length;
    const suspended = traders.filter((t) => t.status === 'suspended').length;
    const pending = traders.filter((t) => t.status === 'pending').length;
    const totalVolume = traders.reduce((sum, t) => sum + t.volume, 0);
    const totalPnL = traders.reduce((sum, t) => sum + t.pnl, 0);
    const avgWinRate = traders.reduce((sum, t) => sum + t.winRate, 0) / (total || 1);
    const totalTrades = traders.reduce((sum, t) => sum + t.trades, 0);

    return {
      total,
      active,
      suspended,
      pending,
      totalVolume,
      totalPnL,
      avgWinRate,
      totalTrades,
    };
  }, [traders]);

  const filteredTraders = useMemo(() => {
    return traders.filter((trader) => {
      const matchesSearch =
        trader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trader.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || trader.status === statusFilter;
      const matchesRole = roleFilter === 'all' || trader.role === roleFilter;
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [traders, searchTerm, statusFilter, roleFilter]);

  const performanceData = useMemo(() => {
    return traders
      .filter(t => t.status === 'active')
      .sort((a, b) => b.pnl - a.pnl)
      .slice(0, 10)
      .map(t => ({
        name: t.name.split(' ')[0],
        pnl: t.pnl / 1000,
        winRate: t.winRate,
      }));
  }, [traders]);

  const roleDistribution = useMemo(() => {
    const distribution: { [key: string]: number } = {};
    traders.forEach(t => {
      distribution[t.role] = (distribution[t.role] || 0) + 1;
    });
    return Object.entries(distribution).map(([role, count]) => ({
      role,
      count,
    }));
  }, [traders]);

  const handleManageTrader = (trader: Trader) => {
    setSelectedTrader({
      id: trader.id,
      name: trader.name,
      email: trader.email,
      role: trader.role,
      status: trader.status,
      joinDate: trader.joinDate,
      totalTrades: trader.trades,
      successRate: trader.winRate,
      pnl: trader.pnl,
      assignedAssets: trader.assignedAssets,
      tradingLimit: {
        daily: trader.dailyLimit,
        monthly: trader.monthlyLimit,
      },
    });
    setTraderModalVisible(true);
  };

  const handleTraderSubmit = (values: any) => {
    console.log('Trader settings updated:', values);
    message.success('Trader settings updated successfully!');
  };

  const columns: ColumnsType<Trader> = [
    {
      title: 'Trader',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 250,
      render: (name: string, record: Trader) => (
        <Space direction="vertical" size={0}>
          <Space>
            <span style={{ fontWeight: 600 }}>{name}</span>
            <Tag color="blue">{record.role}</Tag>
          </Space>
          <span style={{ fontSize: '12px', color: '#999' }}>{record.email}</span>
          <span style={{ fontSize: '11px', color: '#aaa' }}>
            Last active: {dayjs(record.lastActive).format('MMM DD, HH:mm')}
          </span>
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Performance',
      key: 'performance',
      width: 180,
      render: (_: any, record: Trader) => (
        <Space direction="vertical" size={0} style={{ width: '100%' }}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: '#666' }}>7D:</span>
            <Tag color={record.performance7d >= 0 ? 'green' : 'red'}>
              {record.performance7d >= 0 ? '+' : ''}{record.performance7d}%
            </Tag>
          </Space>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: '#666' }}>30D:</span>
            <Tag color={record.performance30d >= 0 ? 'green' : 'red'}>
              {record.performance30d >= 0 ? '+' : ''}{record.performance30d}%
            </Tag>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Trades',
      dataIndex: 'trades',
      key: 'trades',
      sorter: (a, b) => a.trades - b.trades,
      render: (trades: number) => trades.toLocaleString(),
    },
    {
      title: 'Volume',
      dataIndex: 'volume',
      key: 'volume',
      sorter: (a, b) => a.volume - b.volume,
      render: (volume: number) => `$${(volume / 1_000_000).toFixed(1)}M`,
    },
    {
      title: 'P&L',
      dataIndex: 'pnl',
      key: 'pnl',
      sorter: (a, b) => a.pnl - b.pnl,
      render: (pnl: number) => (
        <Tag color={pnl >= 0 ? 'green' : 'red'} style={{ fontWeight: 600 }}>
          {pnl >= 0 ? '+' : ''}${(pnl / 1000).toFixed(0)}K
        </Tag>
      ),
    },
    {
      title: 'Win Rate',
      dataIndex: 'winRate',
      key: 'winRate',
      sorter: (a, b) => a.winRate - b.winRate,
      render: (winRate: number) => (
        <Space direction="vertical" size={0}>
          <Progress
            percent={winRate}
            size="small"
            strokeColor={winRate >= 70 ? '#52c41a' : winRate >= 60 ? '#faad14' : '#f5222d'}
          />
          <span style={{ fontSize: '12px' }}>{winRate.toFixed(1)}%</span>
        </Space>
      ),
    },
    {
      title: 'Assets',
      dataIndex: 'assignedAssets',
      key: 'assignedAssets',
      render: (assets: string[]) => (
        <Space size={[0, 4]} wrap>
          {assets.slice(0, 3).map(asset => (
            <Tag key={asset} style={{ margin: 0 }}>{asset}</Tag>
          ))}
          {assets.length > 3 && (
            <Tag style={{ margin: 0 }}>+{assets.length - 3}</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Pending', value: 'pending' },
        { text: 'Suspended', value: 'suspended' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: TraderStatus) => (
        <Badge
          status={status === 'active' ? 'success' : status === 'suspended' ? 'error' : 'warning'}
          text={
            <Tag color={statusColors[status]}>
              {status.toUpperCase()}
            </Tag>
          }
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 200,
      render: (_: any, record: Trader) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<SettingOutlined />}
            onClick={() => handleManageTrader(record)}
          >
            Manage
          </Button>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="view" icon={<EyeOutlined />}>
                  View Details
                </Menu.Item>
                <Menu.Item key="performance" icon={<TrophyOutlined />}>
                  Performance Report
                </Menu.Item>
                <Menu.Divider />
                {record.status === 'active' ? (
                  <Menu.Item key="suspend" icon={<LockOutlined />} danger>
                    Suspend Trader
                  </Menu.Item>
                ) : (
                  <Menu.Item key="activate" icon={<UnlockOutlined />}>
                    Activate Trader
                  </Menu.Item>
                )}
              </Menu>
            }
          >
            <Button size="small" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  const performanceChartConfig = {
    data: performanceData,
    xField: 'name',
    yField: 'pnl',
    label: {
      position: 'top' as const,
      formatter: (datum: any) => `$${datum.pnl.toFixed(0)}K`,
    },
    columnStyle: {
      radius: [8, 8, 0, 0],
      fill: 'l(270) 0:#722ed1 1:#9254de',
    },
    xAxis: {
      label: {
        autoRotate: false,
      },
    },
    yAxis: {
      label: {
        formatter: (v: string) => `$${v}K`,
      },
    },
  };

  const roleChartConfig = {
    data: roleDistribution,
    angleField: 'count',
    colorField: 'role',
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      content: '{value}',
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    legend: {
      position: 'bottom' as const,
    },
  };

  return (
    <div style={{ padding: '24px', background: '#f0f2f5' }}>
      {/* Page Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col>
          <h1 style={{ fontSize: '28px', fontWeight: 700, margin: 0 }}>
            Traders Management
          </h1>
          <p style={{ color: '#666', marginTop: '8px', marginBottom: 0 }}>
            Monitor and manage all traders' performance, permissions, and activities
          </p>
        </Col>
        <Col>
          <Space>
            <Button icon={<DownloadOutlined />} size="large">
              Export Report
            </Button>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              size="large"
            >
              Invite Trader
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Traders"
            value={metrics.total}
            icon={<TeamOutlined />}
            color="#1890ff"
            trend={{ value: 15, isPositive: true }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Active Traders"
            value={metrics.active}
            icon={<CheckCircleOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Volume"
            value={`$${(metrics.totalVolume / 1_000_000).toFixed(1)}M`}
            icon={<DollarOutlined />}
            color="#722ed1"
            trend={{ value: 23.5, isPositive: true }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total P&L"
            value={`$${(metrics.totalPnL / 1_000_000).toFixed(2)}M`}
            icon={<TrophyOutlined />}
            color="#faad14"
            trend={{ value: 18.2, isPositive: true }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Avg Win Rate"
              value={metrics.avgWinRate.toFixed(1)}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
              prefix={<ThunderboltOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Trades"
              value={metrics.totalTrades.toLocaleString()}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Suspended"
              value={metrics.suspended}
              valueStyle={{ color: '#f5222d' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending Approval"
              value={metrics.pending}
              valueStyle={{ color: '#faad14' }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={16}>
          <Card title="Top Performers (P&L)" bordered={false}>
            <Column {...performanceChartConfig} height={300} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Role Distribution" bordered={false}>
            <Pie {...roleChartConfig} height={300} />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Search traders by name or email..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="Status"
              value={statusFilter}
              onChange={setStatusFilter}
            >
              <Select.Option value="all">All Status</Select.Option>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="suspended">Suspended</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="Role"
              value={roleFilter}
              onChange={setRoleFilter}
            >
              <Select.Option value="all">All Roles</Select.Option>
              <Select.Option value="Principal">Principal</Select.Option>
              <Select.Option value="Lead">Lead</Select.Option>
              <Select.Option value="Senior">Senior</Select.Option>
              <Select.Option value="Junior">Junior</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <RangePicker style={{ width: '100%' }} />
          </Col>
        </Row>
      </Card>

      {/* Traders Table */}
      <Card
        title={
          <Space>
            <span>Traders List</span>
            <Badge count={filteredTraders.length} style={{ backgroundColor: '#722ed1' }} />
          </Space>
        }
        bordered={false}
      >
        <Table
          columns={columns}
          dataSource={filteredTraders}
          rowKey="id"
          scroll={{ x: 1500 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} traders`,
          }}
        />
      </Card>

      {/* Trader Management Modal */}
      <TraderManagementModal
        visible={traderModalVisible}
        onClose={() => setTraderModalVisible(false)}
        onSubmit={handleTraderSubmit}
        trader={selectedTrader}
      />
    </div>
  );
};

export default TradersManagementPage;
