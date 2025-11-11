import { Card, Table, Button, DatePicker, Select, Space, Tag, Tabs, Row, Col, Statistic, Alert } from 'antd';
import {
  DownloadOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  EyeOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

export default function StatementsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  // Mock data for statements
  const statements = [
    {
      id: 1,
      type: 'Monthly Statement',
      period: '2024-10',
      date: '2024-11-01',
      status: 'Available',
      format: 'PDF',
      size: '2.4 MB',
      holdings: 3,
      transactions: 12,
      nav: 127.85,
    },
    {
      id: 2,
      type: 'Quarterly Statement',
      period: 'Q3 2024',
      date: '2024-10-01',
      status: 'Available',
      format: 'PDF',
      size: '5.8 MB',
      holdings: 3,
      transactions: 45,
      nav: 125.42,
    },
    {
      id: 3,
      type: 'Monthly Statement',
      period: '2024-09',
      date: '2024-10-01',
      status: 'Available',
      format: 'PDF',
      size: '2.1 MB',
      holdings: 2,
      transactions: 8,
      nav: 125.42,
    },
    {
      id: 4,
      type: 'Annual Statement',
      period: '2023',
      date: '2024-01-15',
      status: 'Available',
      format: 'PDF',
      size: '12.5 MB',
      holdings: 2,
      transactions: 96,
      nav: 118.92,
    },
    {
      id: 5,
      type: 'Monthly Statement',
      period: '2024-08',
      date: '2024-09-01',
      status: 'Available',
      format: 'PDF',
      size: '1.9 MB',
      holdings: 2,
      transactions: 6,
      nav: 122.15,
    },
  ];

  const transactionStatements = [
    {
      id: 1,
      type: 'Purchase Confirmation',
      fund: 'Alpha Growth Fund',
      date: '2024-10-15',
      amount: 10000,
      shares: 78.2,
      status: 'Confirmed',
    },
    {
      id: 2,
      type: 'Redemption Confirmation',
      fund: 'Beta Stable Fund',
      date: '2024-10-08',
      amount: 5000,
      shares: 45.5,
      status: 'Confirmed',
    },
    {
      id: 3,
      type: 'Purchase Confirmation',
      fund: 'Alpha Growth Fund',
      date: '2024-09-20',
      amount: 15000,
      shares: 119.6,
      status: 'Confirmed',
    },
  ];

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (text: string) => (
        <Space>
          <FileTextOutlined />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Period',
      dataIndex: 'period',
      key: 'period',
      sorter: (a: any, b: any) => a.period.localeCompare(b.period),
    },
    {
      title: 'Date Issued',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Holdings',
      dataIndex: 'holdings',
      key: 'holdings',
      render: (count: number) => `${count} funds`,
    },
    {
      title: 'Transactions',
      dataIndex: 'transactions',
      key: 'transactions',
    },
    {
      title: 'NAV',
      dataIndex: 'nav',
      key: 'nav',
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color="green">{status}</Tag>
      ),
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />}>
            View
          </Button>
          <Button type="link" size="small" icon={<DownloadOutlined />}>
            Download
          </Button>
        </Space>
      ),
    },
  ];

  const transactionColumns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (text: string) => (
        <Space>
          <FilePdfOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Fund',
      dataIndex: 'fund',
      key: 'fund',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      title: 'Shares',
      dataIndex: 'shares',
      key: 'shares',
      render: (value: number) => value.toFixed(2),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color="green">{status}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />}>
            View
          </Button>
          <Button type="link" size="small" icon={<DownloadOutlined />}>
            Download
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '28px' }}>
          Account Statements
        </h1>
        <p style={{ margin: '8px 0 0 0', color: '#666' }}>
          View and download your investment statements and confirmations
        </p>
      </div>

      {/* Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Available Statements"
              value={statements.length}
              prefix={<FileTextOutlined />}
              valueStyle={{ fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Latest Statement"
              value={statements[0].period}
              prefix={<CalendarOutlined />}
              valueStyle={{ fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Documents"
              value={statements.length + transactionStatements.length}
              prefix={<FilePdfOutlined />}
              valueStyle={{ fontSize: '24px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Info Alert */}
      <Alert
        message="Statement Delivery"
        description="Statements are generated automatically and made available on the 1st of each month. You'll receive an email notification when new statements are ready."
        type="info"
        showIcon
        closable
        style={{ marginBottom: 24 }}
      />

      {/* Tabs */}
      <Card>
        <Tabs
          defaultActiveKey="account"
          items={[
            {
              key: 'account',
              label: 'Account Statements',
              children: (
                <div>
                  {/* Filters */}
                  <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <Space wrap>
                      <Select
                        defaultValue="all"
                        style={{ width: 180 }}
                        onChange={setSelectedPeriod}
                        options={[
                          { value: 'all', label: 'All Periods' },
                          { value: 'monthly', label: 'Monthly' },
                          { value: 'quarterly', label: 'Quarterly' },
                          { value: 'annual', label: 'Annual' },
                        ]}
                      />
                      <RangePicker
                        defaultValue={[dayjs().subtract(1, 'year'), dayjs()]}
                      />
                    </Space>
                    <Button type="primary" icon={<DownloadOutlined />}>
                      Download All
                    </Button>
                  </div>

                  {/* Table */}
                  <Table
                    columns={columns}
                    dataSource={statements}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                  />
                </div>
              ),
            },
            {
              key: 'transactions',
              label: 'Transaction Confirmations',
              children: (
                <div>
                  <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                    <Space>
                      <Select
                        defaultValue="all"
                        style={{ width: 180 }}
                        options={[
                          { value: 'all', label: 'All Types' },
                          { value: 'purchase', label: 'Purchases' },
                          { value: 'redemption', label: 'Redemptions' },
                        ]}
                      />
                      <RangePicker
                        defaultValue={[dayjs().subtract(6, 'months'), dayjs()]}
                      />
                    </Space>
                    <Button type="primary" icon={<DownloadOutlined />}>
                      Download All
                    </Button>
                  </div>

                  <Table
                    columns={transactionColumns}
                    dataSource={transactionStatements}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                  />
                </div>
              ),
            },
          ]}
        />
      </Card>

      {/* Help Section */}
      <Card style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 16 }}>Need Help?</h3>
        <p style={{ marginBottom: 16, color: '#666' }}>
          If you need a specific statement or have questions about your account, please contact our support team.
        </p>
        <Space>
          <Button>Contact Support</Button>
          <Button type="link">View FAQ</Button>
        </Space>
      </Card>
    </div>
  );
}
