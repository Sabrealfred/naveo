import { Card, Table, Button, Select, Space, Tag, Alert, Row, Col, Statistic, Timeline, Divider } from 'antd';
import {
  DownloadOutlined,
  FilePdfOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

export default function TaxDocumentsPage() {
  // Mock data for tax documents
  const taxDocuments = [
    {
      id: 1,
      type: '1099-B',
      year: 2024,
      description: 'Proceeds from Broker and Barter Exchange Transactions',
      date: '2025-01-31',
      status: 'Available',
      format: 'PDF',
      size: '1.2 MB',
    },
    {
      id: 2,
      type: '1099-DIV',
      year: 2024,
      description: 'Dividends and Distributions',
      date: '2025-01-31',
      status: 'Available',
      format: 'PDF',
      size: '856 KB',
    },
    {
      id: 3,
      type: '1099-B',
      year: 2023,
      description: 'Proceeds from Broker and Barter Exchange Transactions',
      date: '2024-01-31',
      status: 'Available',
      format: 'PDF',
      size: '1.1 MB',
    },
    {
      id: 4,
      type: '1099-DIV',
      year: 2023,
      description: 'Dividends and Distributions',
      date: '2024-01-31',
      status: 'Available',
      format: 'PDF',
      size: '792 KB',
    },
    {
      id: 5,
      type: 'Tax Summary',
      year: 2024,
      description: 'Annual Tax Summary Report',
      date: '2025-01-15',
      status: 'Available',
      format: 'PDF',
      size: '2.4 MB',
    },
  ];

  const taxSummary = {
    year: 2024,
    totalGains: 12450,
    totalLosses: 3200,
    netGains: 9250,
    dividends: 1850,
    interest: 245,
    totalTaxable: 11345,
  };

  const columns = [
    {
      title: 'Document Type',
      dataIndex: 'type',
      key: 'type',
      render: (text: string) => (
        <Space>
          <FilePdfOutlined style={{ fontSize: 18, color: '#ff4d4f' }} />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Tax Year',
      dataIndex: 'year',
      key: 'year',
      sorter: (a: any, b: any) => b.year - a.year,
      render: (year: number) => <Tag color="blue">{year}</Tag>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Date Available',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color="green" icon={<CheckCircleOutlined />}>
          {status}
        </Tag>
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

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '28px' }}>
          Tax Documents
        </h1>
        <p style={{ margin: '8px 0 0 0', color: '#666' }}>
          Access your tax forms and reports for filing purposes
        </p>
      </div>

      {/* Important Notice */}
      <Alert
        message="Tax Filing Deadline Approaching"
        description="2024 tax documents are now available. The deadline for filing your 2024 taxes is April 15, 2025."
        type="warning"
        showIcon
        icon={<InfoCircleOutlined />}
        closable
        style={{ marginBottom: 24 }}
      />

      {/* Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Net Capital Gains (2024)"
              value={taxSummary.netGains}
              precision={2}
              prefix="$"
              valueStyle={{ color: '#52c41a', fontSize: '24px' }}
            />
            <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
              Gains: ${taxSummary.totalGains.toLocaleString()} | Losses: ${taxSummary.totalLosses.toLocaleString()}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total Dividends (2024)"
              value={taxSummary.dividends}
              precision={2}
              prefix="$"
              valueStyle={{ fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total Taxable Income"
              value={taxSummary.totalTaxable}
              precision={2}
              prefix="$"
              valueStyle={{ fontSize: '24px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Documents Table */}
      <Card title="Available Tax Documents" style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Select
              defaultValue="2024"
              style={{ width: 120 }}
              options={[
                { value: 'all', label: 'All Years' },
                { value: '2024', label: '2024' },
                { value: '2023', label: '2023' },
                { value: '2022', label: '2022' },
              ]}
            />
            <Select
              defaultValue="all"
              style={{ width: 180 }}
              options={[
                { value: 'all', label: 'All Document Types' },
                { value: '1099-B', label: '1099-B' },
                { value: '1099-DIV', label: '1099-DIV' },
                { value: 'summary', label: 'Tax Summary' },
              ]}
            />
          </Space>
          <Button type="primary" icon={<DownloadOutlined />}>
            Download All 2024 Documents
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={taxDocuments}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Tax Information */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Tax Document Timeline">
            <Timeline
              items={[
                {
                  color: 'green',
                  dot: <CheckCircleOutlined />,
                  children: (
                    <div>
                      <strong>January 15, 2025</strong>
                      <br />
                      Tax Summary Reports Available
                    </div>
                  ),
                },
                {
                  color: 'green',
                  dot: <CheckCircleOutlined />,
                  children: (
                    <div>
                      <strong>January 31, 2025</strong>
                      <br />
                      All 1099 Forms Available
                    </div>
                  ),
                },
                {
                  color: 'blue',
                  dot: <ClockCircleOutlined />,
                  children: (
                    <div>
                      <strong>April 15, 2025</strong>
                      <br />
                      Tax Filing Deadline
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Important Tax Information">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Alert
                message="Cost Basis Method"
                description="Your account uses First-In-First-Out (FIFO) for cost basis calculations. You can change this in your account settings."
                type="info"
                showIcon
                icon={<InfoCircleOutlined />}
              />

              <Divider style={{ margin: '12px 0' }} />

              <div>
                <h4 style={{ marginBottom: 8 }}>Tax Reporting Guidelines</h4>
                <ul style={{ paddingLeft: 20, color: '#666', fontSize: '14px' }}>
                  <li>All cryptocurrency transactions are subject to capital gains tax</li>
                  <li>Short-term gains (held < 1 year) are taxed as ordinary income</li>
                  <li>Long-term gains (held ≥ 1 year) receive preferential tax rates</li>
                  <li>Dividends and distributions are reported on Form 1099-DIV</li>
                </ul>
              </div>

              <Divider style={{ margin: '12px 0' }} />

              <div>
                <h4 style={{ marginBottom: 8 }}>Need Help?</h4>
                <Space>
                  <Button type="link" style={{ padding: 0 }}>
                    Tax FAQ
                  </Button>
                  <Button type="link" style={{ padding: 0 }}>
                    Contact Tax Support
                  </Button>
                  <Button type="link" style={{ padding: 0 }}>
                    Find a CPA
                  </Button>
                </Space>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Disclaimer */}
      <Alert
        message="Tax Disclaimer"
        description="The information provided is for informational purposes only and should not be considered tax advice. Please consult with a qualified tax professional regarding your specific situation. Naveo does not provide tax, legal, or accounting advice."
        type="warning"
        showIcon
        style={{ marginTop: 24 }}
      />
    </div>
  );
}
