import { useMemo, useState } from 'react';
import {
  Button,
  Card,
  Col,
  List,
  Row,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import {
  WalletOutlined,
  RiseOutlined,
  FallOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { Line, Pie } from '@ant-design/charts';
import { StatCard } from '../../../components/common';
import { useTranslation } from 'react-i18next';

interface Holding {
  key: string;
  fund: string;
  shares: number;
  avgPrice: number;
  currentNav: number;
  value: number;
  pnl: number;
  pnlPercent: number;
}

interface Allocation {
  fund: string;
  value: number;
}

interface ActivityItem {
  id: string;
  type: 'Buy' | 'Sell' | 'Distribution' | 'Deposit' | 'Withdrawal';
  fund: string;
  amount: number;
  status: 'completed' | 'pending' | 'processing';
  date: string;
}

const holdings: Holding[] = [
  {
    key: 'alpha',
    fund: 'Alpha Growth Fund',
    shares: 350,
    avgPrice: 100,
    currentNav: 127.85,
    value: 44747.5,
    pnl: 9747.5,
    pnlPercent: 27.85,
  },
  {
    key: 'beta',
    fund: 'Beta Stable Income',
    shares: 420,
    avgPrice: 95,
    currentNav: 102.35,
    value: 42987,
    pnl: 2987,
    pnlPercent: 7.46,
  },
  {
    key: 'gamma',
    fund: 'Gamma Yield Opportunities',
    shares: 280,
    avgPrice: 80,
    currentNav: 94.12,
    value: 26353.6,
    pnl: 3943.6,
    pnlPercent: 17.55,
  },
  {
    key: 'delta',
    fund: 'Delta Tokenized Real Estate',
    shares: 150,
    avgPrice: 150,
    currentNav: 142.4,
    value: 21360,
    pnl: -1140,
    pnlPercent: -5.3,
  },
];

const allocationData: Allocation[] = [
  { fund: 'Alpha Growth Fund', value: 38 },
  { fund: 'Beta Stable Income', value: 29 },
  { fund: 'Gamma Yield Opportunities', value: 21 },
  { fund: 'Delta Tokenized Real Estate', value: 12 },
];

const activity: ActivityItem[] = [
  { id: 'tx1', type: 'Buy', fund: 'Alpha Growth Fund', amount: 12500, status: 'completed', date: '2024-11-09' },
  { id: 'tx2', type: 'Sell', fund: 'Delta Tokenized Real Estate', amount: 6500, status: 'completed', date: '2024-11-06' },
  { id: 'tx3', type: 'Distribution', fund: 'Beta Stable Income', amount: 420, status: 'completed', date: '2024-11-04' },
  { id: 'tx4', type: 'Buy', fund: 'Gamma Yield Opportunities', amount: 7500, status: 'processing', date: '2024-11-02' },
  { id: 'tx5', type: 'Deposit', fund: 'Wallet', amount: 15000, status: 'completed', date: '2024-10-30' },
];

const performanceHistory = [
  { date: '2024-01', value: 95000 },
  { date: '2024-02', value: 96000 },
  { date: '2024-03', value: 98000 },
  { date: '2024-04', value: 99500 },
  { date: '2024-05', value: 100500 },
  { date: '2024-06', value: 103000 },
  { date: '2024-07', value: 105000 },
  { date: '2024-08', value: 107250 },
  { date: '2024-09', value: 112000 },
  { date: '2024-10', value: 119500 },
  { date: '2024-11', value: 124200 },
  { date: '2024-12', value: 128400 },
];

const periodOptions = [
  { key: '1M', label: '1M' },
  { key: '3M', label: '3M' },
  { key: '6M', label: '6M' },
  { key: '1Y', label: '1Y' },
  { key: 'ALL', label: 'All' },
];

const PortfolioPage = () => {
  const { t } = useTranslation();
  const [period, setPeriod] = useState('1Y');

  const metrics = useMemo(() => {
    const totalValue = holdings.reduce((sum, item) => sum + item.value, 0);
    const totalInvested = holdings.reduce(
      (sum, item) => sum + item.shares * item.avgPrice,
      0,
    );
    const totalReturn = totalValue - totalInvested;
    const availableBalance = 15250;

    return {
      totalValue,
      totalInvested,
      totalReturn,
      totalReturnPercent: (totalReturn / totalInvested) * 100,
      availableBalance,
    };
  }, []);

  const filteredPerformance = useMemo(() => {
    switch (period) {
      case '1M':
        return performanceHistory.slice(-2);
      case '3M':
        return performanceHistory.slice(-4);
      case '6M':
        return performanceHistory.slice(-7);
      case '1Y':
        return performanceHistory.slice(-12);
      default:
        return performanceHistory;
    }
  }, [period]);

  const allocationList = allocationData.map((item) => ({
    title: item.fund,
    percent: item.value,
    amount:
      (item.value / 100) *
      holdings.reduce((sum, holding) => sum + holding.value, 0),
  }));

  const holdingsColumns = [
    {
      title: t('investor.holdings.fund', 'Fund'),
      dataIndex: 'fund',
      key: 'fund',
      sorter: (a: Holding, b: Holding) => a.fund.localeCompare(b.fund),
    },
    {
      title: t('investor.holdings.shares', 'Shares'),
      dataIndex: 'shares',
      key: 'shares',
      sorter: (a: Holding, b: Holding) => a.shares - b.shares,
    },
    {
      title: t('investor.holdings.invested', 'Avg Price'),
      dataIndex: 'avgPrice',
      key: 'avgPrice',
      render: (value: number) => `$${value.toFixed(2)}`,
      sorter: (a: Holding, b: Holding) => a.avgPrice - b.avgPrice,
    },
    {
      title: t('investor.holdings.currentNav', 'Current NAV'),
      dataIndex: 'currentNav',
      key: 'currentNav',
      render: (value: number) => `$${value.toFixed(2)}`,
      sorter: (a: Holding, b: Holding) => a.currentNav - b.currentNav,
    },
    {
      title: t('investor.holdings.currentValue', 'Current Value'),
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => `$${value.toLocaleString()}`,
      sorter: (a: Holding, b: Holding) => a.value - b.value,
    },
    {
      title: t('adminClient.traders.profitLoss', 'Profit/Loss'),
      dataIndex: 'pnl',
      key: 'pnl',
      render: (value: number) => (
        <Tag color={value >= 0 ? 'green' : 'volcano'}>
          {value >= 0 ? '+' : '-'}${Math.abs(value).toLocaleString()}
        </Tag>
      ),
      sorter: (a: Holding, b: Holding) => a.pnl - b.pnl,
    },
    {
      title: t('investor.holdings.return', 'Return %'),
      dataIndex: 'pnlPercent',
      key: 'pnlPercent',
      render: (value: number) => (
        <Tag color={value >= 0 ? 'green' : 'volcano'}>
          {value >= 0 ? '+' : '-'}
          {Math.abs(value).toFixed(2)}%
        </Tag>
      ),
      sorter: (a: Holding, b: Holding) => a.pnlPercent - b.pnlPercent,
    },
    {
      title: t('common.actions', 'Actions'),
      key: 'actions',
      render: (_, record: Holding) => (
        <Space>
          <Button type="primary" icon={<ShoppingCartOutlined />}>
            {t('investor.portfolio.buyMore', 'Buy More')}
          </Button>
          <Button icon={<DollarOutlined />}>{t('investor.holdings.sell', 'Sell')}</Button>
          <Button type="link">{t('investor.portfolio.viewHistory', 'View History')}</Button>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <StatCard
            title={t('investor.portfolio.totalValue', 'Total Portfolio Value')}
            value={`$${metrics.totalValue.toLocaleString()}`}
            icon={<WalletOutlined />}
            color="#4f6bed"
            trend="up"
            trendValue={metrics.totalReturnPercent}
          />
        </Col>
        <Col xs={24} md={8}>
          <StatCard
            title={t('investor.portfolio.totalReturn', 'Total Return')}
            value={`$${metrics.totalReturn.toLocaleString()}`}
            icon={<RiseOutlined />}
            color="#52c41a"
            trend={metrics.totalReturn >= 0 ? 'up' : 'down'}
            trendValue={metrics.totalReturnPercent}
          />
        </Col>
        <Col xs={24} md={8}>
          <StatCard
            title={t('investor.portfolio.availableBalance', 'Available Balance')}
            value={`$${metrics.availableBalance.toLocaleString()}`}
            icon={<DollarOutlined />}
            color="#faad14"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <Card
            title={t('investor.portfolio.performanceChart', 'Portfolio Performance')}
            extra={
              <Tabs
                activeKey={period}
                onChange={setPeriod}
                items={periodOptions.map((option) => ({
                  key: option.key,
                  label: option.label,
                }))}
              />
            }
          >
            <Line
              height={300}
              data={filteredPerformance}
              xField="date"
              yField="value"
              smooth
              tooltip={{
                formatter: (datum) => ({
                  name: t('investor.dashboard.totalValue', 'Total Value'),
                  value: `$${datum.value.toLocaleString()}`,
                }),
              }}
            />
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <Card title={t('investor.portfolio.assetAllocation', 'Asset Allocation')}>
            <Pie
              height={220}
              data={allocationData}
              angleField="value"
              colorField="fund"
              radius={0.9}
              label={{
                type: 'outer',
                content: '{name} {percentage}',
              }}
            />
            <List
              style={{ marginTop: 16 }}
              dataSource={allocationList}
              renderItem={(item) => (
                <List.Item>
                  <Space direction="vertical">
                    <Typography.Text strong>{item.title}</Typography.Text>
                    <Typography.Text type="secondary">
                      {item.percent}% · ${item.amount.toLocaleString()}
                    </Typography.Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Card title={t('investor.portfolio.myHoldings', 'My Holdings')}>
        <Table
          rowKey="key"
          dataSource={holdings}
          columns={holdingsColumns}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title={t('investor.portfolio.recentActivity', 'Recent Activity')} extra={<Button type="link">{t('dashboard.viewAll', 'View All')}</Button>}>
            <List
              dataSource={activity}
              renderItem={(item) => (
                <List.Item
                  actions={[<span key="date">{item.date}</span>]}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        <Tag color={item.type === 'Buy' ? 'green' : item.type === 'Sell' ? 'volcano' : 'blue'}>
                          {item.type}
                        </Tag>
                        <Typography.Text strong>{item.fund}</Typography.Text>
                      </Space>
                    }
                    description={
                      <Space>
                        <Typography.Text>${item.amount.toLocaleString()}</Typography.Text>
                        <Tag color={item.status === 'completed' ? 'green' : 'orange'}>
                          {item.status.toUpperCase()}
                        </Tag>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Opportunities">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Card type="inner" title="Rebalance Portfolio" extra={<Button type="link">Rebalance</Button>}>
                <Typography.Text type="secondary">
                  Your exposure to Alpha Growth Fund is above target by 3.5%. Consider reallocating.
                </Typography.Text>
              </Card>
              <Card type="inner" title="Auto-Invest Plan" extra={<Button type="link">Configure</Button>}>
                <Typography.Text type="secondary">
                  Automate monthly contributions into Beta Stable Income to smooth returns.
                </Typography.Text>
              </Card>
            </Space>
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default PortfolioPage;
