import { useState } from 'react';
import { Card, Col, Row, Statistic, Table, Tag, Button, Space, Avatar, Steps, Alert, message } from 'antd';
import {
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
  WalletOutlined,
  SwapOutlined,
  TrophyOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileProtectOutlined,
} from '@ant-design/icons';
import { Line, Pie } from '@ant-design/charts';
import { StatCard } from '../../../components/common';

export default function DashboardPage() {
  const [loadingOnboarding, setLoadingOnboarding] = useState(false);

  const handleContinueOnboarding = () => {
    setLoadingOnboarding(true);
    message.info('Loading suitability assessment questionnaire...');
    setTimeout(() => {
      setLoadingOnboarding(false);
      message.success('Questionnaire loaded! Please complete all questions.');
    }, 1500);
  };
  // Mock data for Investor Dashboard - Replace with real Supabase data
  const portfolioMetrics = {
    totalValue: 125000, // $125K
    totalInvested: 100000, // $100K
    totalReturn: 25000, // $25K
    returnPercentage: 25.0, // 25%
    availableCash: 15000, // $15K
    pendingTransactions: 2,
  };

  const portfolioHistoryData = [
    { date: '2024-06', value: 100000 },
    { date: '2024-07', value: 105000 },
    { date: '2024-08', value: 108000 },
    { date: '2024-09', value: 112000 },
    { date: '2024-10', value: 120000 },
    { date: '2024-11', value: 125000 },
  ];

  const assetAllocation = [
    { asset: 'Alpha Growth Fund', value: 45, amount: 56250 },
    { asset: 'Beta Stable Fund', value: 30, amount: 37500 },
    { asset: 'Gamma Yield Fund', value: 15, amount: 18750 },
    { asset: 'Cash', value: 10, amount: 12500 },
  ];

  const myHoldings = [
    {
      key: '1',
      fund: 'Alpha Growth Fund',
      nav: 127.85,
      shares: 350,
      invested: 35000,
      currentValue: 44747.5,
      return: 27.85,
      color: '#1890ff',
    },
    {
      key: '2',
      fund: 'Beta Stable Fund',
      nav: 108.76,
      shares: 300,
      invested: 30000,
      currentValue: 32628,
      return: 8.76,
      color: '#52c41a',
    },
    {
      key: '3',
      fund: 'Gamma Yield Fund',
      nav: 98.34,
      shares: 200,
      invested: 20000,
      currentValue: 19668,
      return: -1.66,
      color: '#722ed1',
    },
  ];

  const recentTransactions = [
    {
      key: '1',
      type: 'Buy',
      fund: 'Alpha Growth Fund',
      shares: 50,
      nav: 127.85,
      amount: 6392.5,
      date: '2024-11-08',
      status: 'completed',
    },
    {
      key: '2',
      type: 'Buy',
      fund: 'Beta Stable Fund',
      shares: 100,
      nav: 108.76,
      amount: 10876,
      date: '2024-11-05',
      status: 'completed',
    },
    {
      key: '3',
      type: 'Sell',
      fund: 'Gamma Yield Fund',
      shares: 50,
      nav: 98.34,
      amount: 4917,
      date: '2024-11-03',
      status: 'completed',
    },
    {
      key: '4',
      type: 'Deposit',
      fund: 'Cash',
      shares: 0,
      nav: 0,
      amount: 15000,
      date: '2024-11-01',
      status: 'completed',
    },
  ];

  // Tokenization onboarding status for investor
  const tokenizationOnboarding = {
    fundName: 'Turkish Real Estate Fund I',
    currentStep: 2, // 0-indexed: step 3 is active
    totalSteps: 5,
    jurisdiction: 'Turkey → USA',
    estimatedCompletion: '3-5 business days',
    nextAction: 'Complete suitability assessment questionnaire',
    steps: [
      {
        title: 'Accreditation Verified',
        description: 'Income and net worth documentation reviewed',
        status: 'finish' as const,
        icon: <CheckCircleOutlined />,
      },
      {
        title: 'KYC/AML Completed',
        description: 'Identity verification and sanctions screening passed',
        status: 'finish' as const,
        icon: <CheckCircleOutlined />,
      },
      {
        title: 'Suitability Assessment',
        description: 'Investment objectives and risk tolerance evaluation',
        status: 'process' as const,
        icon: <ClockCircleOutlined />,
      },
      {
        title: 'Document Review',
        description: 'PPM, subscription agreement, and disclosures',
        status: 'wait' as const,
      },
      {
        title: 'Token Purchase',
        description: 'Payment and token issuance',
        status: 'wait' as const,
      },
    ],
  };

  const portfolioChartConfig = {
    data: portfolioHistoryData,
    xField: 'date',
    yField: 'value',
    smooth: true,
    meta: {
      value: {
        alias: 'Portfolio Value',
        formatter: (v: number) => `$${(v / 1000).toFixed(0)}K`,
      },
    },
  };

  const allocationConfig = {
    data: assetAllocation,
    angleField: 'value',
    colorField: 'asset',
    radius: 0.8,
    label: {
      type: 'outer' as const,
      content: '{name} {percentage}',
    },
  };

  const holdingsColumns = [
    {
      title: 'Fund',
      dataIndex: 'fund',
      key: 'fund',
      render: (text: string, record: any) => (
        <Space>
          <Avatar
            style={{ backgroundColor: record.color }}
            icon={<TrophyOutlined />}
          />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Current NAV',
      dataIndex: 'nav',
      key: 'nav',
      render: (nav: number) => `$${nav.toFixed(2)}`,
    },
    {
      title: 'Shares',
      dataIndex: 'shares',
      key: 'shares',
    },
    {
      title: 'Invested',
      dataIndex: 'invested',
      key: 'invested',
      render: (val: number) => `$${val.toLocaleString()}`,
    },
    {
      title: 'Current Value',
      dataIndex: 'currentValue',
      key: 'currentValue',
      render: (val: number) => `$${val.toLocaleString()}`,
      sorter: (a: any, b: any) => a.currentValue - b.currentValue,
    },
    {
      title: 'Return',
      dataIndex: 'return',
      key: 'return',
      render: (ret: number) => (
        <Tag
          color={ret >= 0 ? 'green' : 'red'}
          icon={ret >= 0 ? <RiseOutlined /> : <FallOutlined />}
        >
          {ret >= 0 ? '+' : ''}{ret.toFixed(2)}%
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="primary" size="small">Buy</Button>
          <Button size="small">Sell</Button>
        </Space>
      ),
    },
  ];

  const transactionColumns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          Buy: 'green',
          Sell: 'red',
          Deposit: 'blue',
          Withdraw: 'orange',
        };
        return <Tag color={colorMap[type]}>{type}</Tag>;
      },
    },
    {
      title: 'Fund/Asset',
      dataIndex: 'fund',
      key: 'fund',
    },
    {
      title: 'Shares',
      dataIndex: 'shares',
      key: 'shares',
      render: (shares: number) => shares > 0 ? shares : '-',
    },
    {
      title: 'NAV',
      dataIndex: 'nav',
      key: 'nav',
      render: (nav: number) => nav > 0 ? `$${nav.toFixed(2)}` : '-',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amt: number) => `$${amt.toLocaleString()}`,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'green' : 'orange'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Welcome Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
          Welcome Back, John Doe
        </h1>
        <p style={{ color: '#8c8c8c', fontSize: '14px' }}>
          Here's your portfolio summary
        </p>
      </div>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Portfolio Value"
            value={`$${portfolioMetrics.totalValue.toLocaleString()}`}
            icon={<WalletOutlined />}
            trend={portfolioMetrics.returnPercentage >= 0 ? 'up' : 'down'}
            trendValue={Math.abs(portfolioMetrics.returnPercentage)}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Return"
            value={`$${portfolioMetrics.totalReturn.toLocaleString()}`}
            icon={<RiseOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Available Cash"
            value={`$${portfolioMetrics.availableCash.toLocaleString()}`}
            icon={<DollarOutlined />}
            color="#722ed1"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Return %"
              value={portfolioMetrics.returnPercentage}
              precision={1}
              valueStyle={{ color: '#3f8600' }}
              prefix={<RiseOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Card title="Quick Actions">
            <Space size="middle">
              <Button
                type="primary"
                icon={<ArrowUpOutlined />}
                size="large"
              >
                Deposit Funds
              </Button>
              <Button
                icon={<SwapOutlined />}
                size="large"
              >
                Buy Tokens
              </Button>
              <Button
                icon={<ArrowDownOutlined />}
                size="large"
              >
                Withdraw
              </Button>
              <Button size="large">
                View Reports
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Tokenization Onboarding Status */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Card
            title={
              <Space>
                <RocketOutlined />
                <span>Token Purchase Onboarding</span>
                <Tag color="blue">{tokenizationOnboarding.jurisdiction}</Tag>
              </Space>
            }
            bordered={false}
            extra={
              <Button
                type="primary"
                icon={<FileProtectOutlined />}
                onClick={handleContinueOnboarding}
                loading={loadingOnboarding}
              >
                Continue Onboarding
              </Button>
            }
          >
            <Alert
              message={`Next Action Required: ${tokenizationOnboarding.nextAction}`}
              description={`Estimated completion time: ${tokenizationOnboarding.estimatedCompletion}`}
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={18}>
                <Steps
                  current={tokenizationOnboarding.currentStep}
                  items={tokenizationOnboarding.steps}
                  direction="vertical"
                />
              </Col>
              <Col xs={24} lg={6}>
                <Card size="small" style={{ marginBottom: 16 }}>
                  <Statistic
                    title="Fund Name"
                    value={tokenizationOnboarding.fundName}
                    valueStyle={{ fontSize: '14px', fontWeight: 500 }}
                  />
                </Card>
                <Card size="small" style={{ marginBottom: 16 }}>
                  <Statistic
                    title="Progress"
                    value={((tokenizationOnboarding.currentStep + 1) / tokenizationOnboarding.totalSteps * 100).toFixed(0)}
                    suffix="%"
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
                <Card size="small">
                  <Statistic
                    title="Steps Completed"
                    value={`${tokenizationOnboarding.currentStep + 1}/${tokenizationOnboarding.totalSteps}`}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={16}>
          <Card title="Portfolio Performance" bordered={false}>
            <Line {...portfolioChartConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Asset Allocation" bordered={false}>
            <Pie {...allocationConfig} />
          </Card>
        </Col>
      </Row>

      {/* Holdings Table */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Card title="My Holdings" bordered={false}>
            <Table
              dataSource={myHoldings}
              columns={holdingsColumns}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Transactions */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title="Recent Transactions"
            bordered={false}
            extra={<Button type="link">View All</Button>}
          >
            <Table
              dataSource={recentTransactions}
              columns={transactionColumns}
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
