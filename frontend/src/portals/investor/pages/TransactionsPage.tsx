import { useState, useEffect, useMemo } from 'react';
import { Table, Tag, Button, Space, Tabs, Spin, message } from 'antd';
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { AdvancedFilter } from '../../../components/filters';
import type { TabsProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { transactionsService, fundsService } from '../../../services';
import type { Transaction } from '../../../services/types';

interface TransactionDisplay {
  key: string;
  date: string;
  type: string;
  asset: string;
  amount: string;
  price: string;
  total: string;
  status: string;
  fund_id: string | null;
  shares: number | null;
  nav_at_time: number | null;
}

const TransactionsPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<TransactionDisplay[]>([]);
  const [filteredData, setFilteredData] = useState<TransactionDisplay[]>([]);
  const [fundNames, setFundNames] = useState<Record<string, string>>({});

  // Mock user ID (in real app, get from auth context)
  const userId = '10000000-0000-0000-0000-000000000001';

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);

      // Load all funds first to get names
      const funds = await fundsService.getAllFunds();
      const fundNamesMap = funds.reduce((acc, fund) => {
        acc[fund.id] = fund.name;
        return acc;
      }, {} as Record<string, string>);
      setFundNames(fundNamesMap);

      // Load user transactions
      const dbTransactions = await transactionsService.getTransactionsByUser(userId);

      // Map to display format
      const displayTransactions = dbTransactions.map(mapTransactionToDisplay);
      setTransactions(displayTransactions);

    } catch (error: any) {
      console.error('Error loading transactions:', error);
      message.error('Failed to load transactions: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const mapTransactionToDisplay = (tx: Transaction): TransactionDisplay => {
    const fundName = tx.fund_id ? (fundNames[tx.fund_id] || 'Unknown Fund') : 'N/A';
    const shares = tx.shares || 0;
    const navAtTime = tx.nav_at_time || 0;
    const amount = tx.amount || 0;

    return {
      key: tx.id,
      date: new Date(tx.created_at).toISOString().split('T')[0],
      type: tx.type || 'unknown',
      asset: fundName,
      amount: shares > 0 ? `${shares.toFixed(4)} shares` : '-',
      price: navAtTime > 0 ? navAtTime.toFixed(2) : '-',
      total: amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      status: tx.status || 'pending',
      fund_id: tx.fund_id,
      shares: tx.shares,
      nav_at_time: tx.nav_at_time,
    };
  };

  const columns = [
    {
      title: t('transactionsPage.date'),
      dataIndex: 'date',
      key: 'date',
      sorter: (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: t('transactionsPage.type'),
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          buy: 'green',
          sell: 'orange',
          deposit: 'blue',
          withdrawal: 'purple',
        };
        const labelMap: Record<string, string> = {
          buy: t('transactionsPage.buy'),
          sell: t('transactionsPage.sell'),
          deposit: t('transactionsPage.deposit'),
          withdrawal: t('transactionsPage.withdrawal'),
        };
        return <Tag color={colorMap[type]}>{labelMap[type]}</Tag>;
      },
    },
    {
      title: t('transactionsPage.asset'),
      dataIndex: 'asset',
      key: 'asset',
    },
    {
      title: t('transactionsPage.amount'),
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: t('transactionsPage.price'),
      dataIndex: 'price',
      key: 'price',
      render: (price: string) => `$${price}`,
    },
    {
      title: t('transactionsPage.total'),
      dataIndex: 'total',
      key: 'total',
      render: (total: string) => `$${total}`,
      sorter: (a: any, b: any) => parseFloat(a.total.replace(/,/g, '')) - parseFloat(b.total.replace(/,/g, '')),
    },
    {
      title: t('transactionsPage.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          completed: 'success',
          pending: 'warning',
          failed: 'error',
        };
        const labelMap: Record<string, string> = {
          completed: t('transactionsPage.completed'),
          pending: t('transactionsPage.pending'),
          failed: t('transactionsPage.failed'),
        };
        return <Tag color={colorMap[status]}>{labelMap[status]}</Tag>;
      },
    },
    {
      title: t('transactionsPage.actions'),
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
          >
            {t('transactionsPage.viewDetails')}
          </Button>
          <Button
            type="link"
            size="small"
            icon={<DownloadOutlined />}
          >
            {t('transactionsPage.downloadReceipt')}
          </Button>
        </Space>
      ),
    },
  ];

  const handleFilter = (values: any) => {
    console.log('Filter values:', values);
    // Apply filters to transactions
    let filtered = [...transactions];

    // Filter by type if specified
    if (values.type && values.type !== 'all') {
      filtered = filtered.filter(tx => tx.type === values.type);
    }

    // Filter by status if specified
    if (values.status && values.status !== 'all') {
      filtered = filtered.filter(tx => tx.status === values.status);
    }

    // Filter by date range if specified
    if (values.dateRange && values.dateRange.length === 2) {
      const [startDate, endDate] = values.dateRange;
      filtered = filtered.filter(tx => {
        const txDate = new Date(tx.date);
        return txDate >= startDate && txDate <= endDate;
      });
    }

    // Filter by amount range if specified
    if (values.minAmount !== undefined || values.maxAmount !== undefined) {
      filtered = filtered.filter(tx => {
        const amount = parseFloat(tx.total.replace(/,/g, ''));
        const minOk = values.minAmount === undefined || amount >= values.minAmount;
        const maxOk = values.maxAmount === undefined || amount <= values.maxAmount;
        return minOk && maxOk;
      });
    }

    setFilteredData(filtered);
  };

  const handleClearFilter = () => {
    setFilteredData([]);
  };

  const tabItems: TabsProps['items'] = [
    {
      key: 'all',
      label: t('transactionsPage.allTransactions'),
      children: (
        <div>
          <AdvancedFilter
            onFilter={handleFilter}
            onClear={handleClearFilter}
            showAmount
          />
          <Table
            columns={columns}
            dataSource={filteredData.length > 0 ? filteredData : transactions}
            pagination={{ pageSize: 10 }}
            loading={loading}
          />
        </div>
      ),
    },
    {
      key: 'buys',
      label: t('transactionsPage.purchases'),
      children: (
        <Table
          columns={columns}
          dataSource={transactions.filter(t => t.type === 'buy')}
          pagination={{ pageSize: 10 }}
          loading={loading}
        />
      ),
    },
    {
      key: 'sells',
      label: t('transactionsPage.sales'),
      children: (
        <Table
          columns={columns}
          dataSource={transactions.filter(t => t.type === 'sell')}
          pagination={{ pageSize: 10 }}
          loading={loading}
        />
      ),
    },
    {
      key: 'deposits',
      label: t('transactionsPage.deposits'),
      children: (
        <Table
          columns={columns}
          dataSource={transactions.filter(t => t.type === 'deposit')}
          pagination={{ pageSize: 10 }}
          loading={loading}
        />
      ),
    },
    {
      key: 'withdrawals',
      label: t('transactionsPage.withdrawals'),
      children: (
        <Table
          columns={columns}
          dataSource={transactions.filter(t => t.type === 'withdrawal' || t.type === 'withdraw')}
          pagination={{ pageSize: 10 }}
          loading={loading}
        />
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" tip="Loading transactions..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>{t('transactionsPage.title')}</h1>
          <p style={{ color: '#8c8c8c', fontSize: '14px', marginTop: 8 }}>{t('transactionsPage.subtitle')}</p>
        </div>
        <Button type="primary" icon={<DownloadOutlined />}>
          {t('transactionsPage.exportAll')}
        </Button>
      </div>

      <Tabs defaultActiveKey="all" items={tabItems} />
    </div>
  );
};

export default TransactionsPage;
