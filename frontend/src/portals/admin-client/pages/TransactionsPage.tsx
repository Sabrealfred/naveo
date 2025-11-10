import { useState } from 'react';
import { Card, Table, Tag, Button, Select, DatePicker, Row, Col, Space, Input, Statistic } from 'antd';
import {
  SwapOutlined,
  FilterOutlined,
  DownloadOutlined,
  SearchOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import type { ColumnType } from 'antd/es/table';
import StatCard from '../../../components/common/StatCard';

const { RangePicker } = DatePicker;

interface Transaction {
  id: string;
  date: string;
  type: 'buy' | 'sell' | 'deposit' | 'withdrawal' | 'transfer';
  asset: string;
  amount: number;
  price: number;
  total: number;
  investor: string;
  status: 'completed' | 'pending' | 'failed';
  hash: string;
}

export default function TransactionsPage() {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock data
  const transactions: Transaction[] = [
    {
      id: 'TXN001',
      date: '2024-11-10 14:32:15',
      type: 'buy',
      asset: 'Alpha Growth Fund',
      amount: 50,
      price: 127.85,
      total: 6392.50,
      investor: 'John Doe',
      status: 'completed',
      hash: '0x1a2b3c4d5e6f...',
    },
    {
      id: 'TXN002',
      date: '2024-11-10 13:15:42',
      type: 'sell',
      asset: 'Beta Value Fund',
      amount: 25,
      price: 95.20,
      total: 2380.00,
      investor: 'Jane Smith',
      status: 'completed',
      hash: '0x2b3c4d5e6f7g...',
    },
    {
      id: 'TXN003',
      date: '2024-11-10 11:45:30',
      type: 'deposit',
      asset: 'USDC',
      amount: 10000,
      price: 1.00,
      total: 10000.00,
      investor: 'Mike Johnson',
      status: 'completed',
      hash: '0x3c4d5e6f7g8h...',
    },
    {
      id: 'TXN004',
      date: '2024-11-10 10:20:15',
      type: 'buy',
      asset: 'Gamma Hedge Fund',
      amount: 100,
      price: 215.50,
      total: 21550.00,
      investor: 'Sarah Williams',
      status: 'pending',
      hash: '0x4d5e6f7g8h9i...',
    },
    {
      id: 'TXN005',
      date: '2024-11-09 16:55:28',
      type: 'withdrawal',
      asset: 'USDT',
      amount: 5000,
      price: 1.00,
      total: 5000.00,
      investor: 'David Brown',
      status: 'completed',
      hash: '0x5e6f7g8h9i0j...',
    },
    {
      id: 'TXN006',
      date: '2024-11-09 15:30:12',
      type: 'sell',
      asset: 'Alpha Growth Fund',
      amount: 30,
      price: 127.60,
      total: 3828.00,
      investor: 'Emily Davis',
      status: 'completed',
      hash: '0x6f7g8h9i0j1k...',
    },
    {
      id: 'TXN007',
      date: '2024-11-09 14:10:45',
      type: 'transfer',
      asset: 'Beta Value Fund',
      amount: 75,
      price: 95.15,
      total: 7136.25,
      investor: 'Robert Taylor',
      status: 'completed',
      hash: '0x7g8h9i0j1k2l...',
    },
    {
      id: 'TXN008',
      date: '2024-11-09 12:40:33',
      type: 'buy',
      asset: 'Delta Income Fund',
      amount: 200,
      price: 48.75,
      total: 9750.00,
      investor: 'Lisa Anderson',
      status: 'failed',
      hash: '0x8h9i0j1k2l3m...',
    },
  ];

  const getTypeTag = (type: Transaction['type']) => {
    const typeConfig = {
      buy: { color: 'green', icon: <ArrowDownOutlined /> },
      sell: { color: 'red', icon: <ArrowUpOutlined /> },
      deposit: { color: 'blue', icon: <ArrowDownOutlined /> },
      withdrawal: { color: 'orange', icon: <ArrowUpOutlined /> },
      transfer: { color: 'purple', icon: <SwapOutlined /> },
    };
    const config = typeConfig[type];
    return (
      <Tag color={config.color} icon={config.icon}>
        {type.toUpperCase()}
      </Tag>
    );
  };

  const getStatusTag = (status: Transaction['status']) => {
    const statusConfig = {
      completed: { color: 'success', text: 'Completed' },
      pending: { color: 'warning', text: 'Pending' },
      failed: { color: 'error', text: 'Failed' },
    };
    const config = statusConfig[status];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns: ColumnType<Transaction>[] = [
    {
      title: 'Transaction ID',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      width: 120,
    },
    {
      title: 'Date & Time',
      dataIndex: 'date',
      key: 'date',
      width: 180,
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: getTypeTag,
      filters: [
        { text: 'Buy', value: 'buy' },
        { text: 'Sell', value: 'sell' },
        { text: 'Deposit', value: 'deposit' },
        { text: 'Withdrawal', value: 'withdrawal' },
        { text: 'Transfer', value: 'transfer' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Asset / Fund',
      dataIndex: 'asset',
      key: 'asset',
      width: 200,
    },
    {
      title: 'Investor',
      dataIndex: 'investor',
      key: 'investor',
      width: 150,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      align: 'right',
      render: (amount: number) => amount.toLocaleString('en-US', { minimumFractionDigits: 2 }),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      align: 'right',
      render: (price: number) => `$${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    },
    {
      title: 'Total Value',
      dataIndex: 'total',
      key: 'total',
      width: 150,
      align: 'right',
      render: (total: number) => `$${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: getStatusTag,
      filters: [
        { text: 'Completed', value: 'completed' },
        { text: 'Pending', value: 'pending' },
        { text: 'Failed', value: 'failed' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'TX Hash',
      dataIndex: 'hash',
      key: 'hash',
      width: 150,
      render: (hash: string) => (
        <a href={`https://polygonscan.com/tx/${hash}`} target="_blank" rel="noopener noreferrer">
          {hash.slice(0, 12)}...
        </a>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 100,
      render: (_: any, record: Transaction) => (
        <Button type="link" size="small">
          View Details
        </Button>
      ),
    },
  ];

  const filteredTransactions = transactions.filter((txn) => {
    const typeMatch = filterType === 'all' || txn.type === filterType;
    const statusMatch = filterStatus === 'all' || txn.status === filterStatus;
    return typeMatch && statusMatch;
  });

  const totalVolume = transactions
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + t.total, 0);
  const todayTransactions = transactions.filter((t) => t.date.startsWith('2024-11-10')).length;
  const pendingCount = transactions.filter((t) => t.status === 'pending').length;

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Sansation, sans-serif', fontSize: '32px', marginBottom: '8px' }}>
          Fund Transactions
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Monitor and manage all fund transactions in real-time
        </p>
      </div>

      {/* Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Volume (24h)"
            value={`$${totalVolume.toLocaleString('en-US')}`}
            icon={<SwapOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Today's Transactions"
            value={todayTransactions}
            icon={<ArrowDownOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Pending Transactions"
            value={pendingCount}
            icon={<FilterOutlined />}
            color="#faad14"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="professional-card">
            <Statistic
              title="Success Rate"
              value={((transactions.filter((t) => t.status === 'completed').length / transactions.length) * 100).toFixed(1)}
              suffix="%"
              valueStyle={{ color: '#52c41a', fontSize: '24px', fontWeight: 600 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="professional-card" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Search by ID, investor, or asset"
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="Filter by type"
              value={filterType}
              onChange={setFilterType}
              options={[
                { label: 'All Types', value: 'all' },
                { label: 'Buy', value: 'buy' },
                { label: 'Sell', value: 'sell' },
                { label: 'Deposit', value: 'deposit' },
                { label: 'Withdrawal', value: 'withdrawal' },
                { label: 'Transfer', value: 'transfer' },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="Filter by status"
              value={filterStatus}
              onChange={setFilterStatus}
              options={[
                { label: 'All Status', value: 'all' },
                { label: 'Completed', value: 'completed' },
                { label: 'Pending', value: 'pending' },
                { label: 'Failed', value: 'failed' },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <RangePicker style={{ width: '100%' }} />
          </Col>
        </Row>
        <Row style={{ marginTop: '16px' }}>
          <Col>
            <Space>
              <Button icon={<DownloadOutlined />}>Export CSV</Button>
              <Button icon={<DownloadOutlined />}>Export PDF</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Transactions Table */}
      <Card className="professional-card">
        <Table
          columns={columns}
          dataSource={filteredTransactions}
          rowKey="id"
          scroll={{ x: 1400 }}
          pagination={{
            total: filteredTransactions.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} transactions`,
          }}
        />
      </Card>
    </div>
  );
}
