import { useState } from 'react';
import { Card, Table, Button, Space, Row, Col, Tag, Select, DatePicker, Modal, Form, Input, Checkbox, message, Tabs } from 'antd';
import {
  DownloadOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  MailOutlined,
  ScheduleOutlined,
  PlusOutlined,
  EyeOutlined,
  DeleteOutlined,
  CalendarOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import type { TabsProps } from 'antd';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface Report {
  key: string;
  name: string;
  description: string;
  type: 'performance' | 'investors' | 'compliance' | 'financial' | 'operations';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'on-demand';
  format: string[];
  lastGenerated?: string;
  nextGeneration?: string;
  autoSend: boolean;
  recipients: string[];
  status: 'active' | 'inactive' | 'generating';
}

interface ReportTemplate {
  key: string;
  name: string;
  description: string;
  category: string;
  icon: any;
}

const ReportsPage = () => {
  const [selectedTab, setSelectedTab] = useState('scheduled');
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [generateModalVisible, setGenerateModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [form] = Form.useForm();
  const [generateForm] = Form.useForm();

  // Mock data for scheduled reports
  const scheduledReports: Report[] = [
    {
      key: '1',
      name: 'Monthly Performance Report',
      description: 'Comprehensive fund performance analysis including returns, risk metrics, and benchmarks',
      type: 'performance',
      frequency: 'monthly',
      format: ['PDF', 'Excel'],
      lastGenerated: '2024-11-01',
      nextGeneration: '2024-12-01',
      autoSend: true,
      recipients: ['cfo@fund.com', 'board@fund.com'],
      status: 'active',
    },
    {
      key: '2',
      name: 'Weekly Investor Report',
      description: 'Summary of investor activities, new subscriptions, and redemptions',
      type: 'investors',
      frequency: 'weekly',
      format: ['PDF'],
      lastGenerated: '2024-11-08',
      nextGeneration: '2024-11-15',
      autoSend: true,
      recipients: ['investors@fund.com'],
      status: 'active',
    },
    {
      key: '3',
      name: 'Quarterly Compliance Report',
      description: 'KYC/AML status, regulatory compliance, and audit trail',
      type: 'compliance',
      frequency: 'quarterly',
      format: ['PDF', 'Excel'],
      lastGenerated: '2024-10-01',
      nextGeneration: '2025-01-01',
      autoSend: true,
      recipients: ['compliance@fund.com', 'auditor@external.com'],
      status: 'active',
    },
    {
      key: '4',
      name: 'Daily NAV Report',
      description: 'Daily Net Asset Value calculation and breakdown by asset class',
      type: 'financial',
      frequency: 'daily',
      format: ['Excel'],
      lastGenerated: '2024-11-10',
      nextGeneration: '2024-11-11',
      autoSend: true,
      recipients: ['ops@fund.com'],
      status: 'active',
    },
    {
      key: '5',
      name: 'Annual Financial Statements',
      description: 'Complete financial statements with balance sheet, P&L, and cash flow',
      type: 'financial',
      frequency: 'annual',
      format: ['PDF', 'Excel'],
      lastGenerated: '2024-01-15',
      nextGeneration: '2025-01-15',
      autoSend: false,
      recipients: [],
      status: 'active',
    },
  ];

  // Report templates
  const reportTemplates: ReportTemplate[] = [
    {
      key: 'performance',
      name: 'Performance Report',
      description: 'Fund returns, benchmarks, risk metrics, and performance attribution',
      category: 'Performance',
      icon: <FileTextOutlined />,
    },
    {
      key: 'investor-statement',
      name: 'Investor Statement',
      description: 'Individual investor holdings, transactions, and performance',
      category: 'Investors',
      icon: <FileTextOutlined />,
    },
    {
      key: 'holdings',
      name: 'Portfolio Holdings',
      description: 'Complete list of assets with valuations and allocations',
      category: 'Financial',
      icon: <FileTextOutlined />,
    },
    {
      key: 'transactions',
      name: 'Transaction Report',
      description: 'Buy/sell transactions with trade dates, prices, and fees',
      category: 'Operations',
      icon: <FileTextOutlined />,
    },
    {
      key: 'kyc-status',
      name: 'KYC Status Report',
      description: 'Investor verification status, pending KYC, and compliance alerts',
      category: 'Compliance',
      icon: <FileTextOutlined />,
    },
    {
      key: 'aml-screening',
      name: 'AML Screening Report',
      description: 'PEP checks, sanctions screening, and risk assessments',
      category: 'Compliance',
      icon: <FileTextOutlined />,
    },
    {
      key: 'nav-calculation',
      name: 'NAV Calculation',
      description: 'Detailed NAV breakdown with asset valuations and methodology',
      category: 'Financial',
      icon: <FileTextOutlined />,
    },
    {
      key: 'subscription-redemption',
      name: 'Subscriptions & Redemptions',
      description: 'Capital flows, pending transactions, and settlement schedule',
      category: 'Investors',
      icon: <FileTextOutlined />,
    },
  ];

  // Recent reports (on-demand generated)
  const recentReports = [
    {
      key: '1',
      name: 'Q3 2024 Performance Report',
      type: 'Performance',
      generatedDate: '2024-10-15',
      generatedBy: 'Sarah Johnson',
      format: 'PDF',
      size: '2.4 MB',
    },
    {
      key: '2',
      name: 'October Investor Statement - All',
      type: 'Investors',
      generatedDate: '2024-11-05',
      generatedBy: 'Sarah Johnson',
      format: 'Excel',
      size: '1.8 MB',
    },
    {
      key: '3',
      name: 'Portfolio Holdings Snapshot',
      type: 'Financial',
      generatedDate: '2024-11-09',
      generatedBy: 'Michael Chen',
      format: 'PDF',
      size: '856 KB',
    },
    {
      key: '4',
      name: 'KYC Compliance Audit',
      type: 'Compliance',
      generatedDate: '2024-11-08',
      generatedBy: 'Compliance Officer',
      format: 'PDF',
      size: '1.2 MB',
    },
  ];

  const scheduledReportsColumns = [
    {
      title: 'Report Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Report) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{record.description}</div>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          performance: 'blue',
          investors: 'green',
          compliance: 'purple',
          financial: 'orange',
          operations: 'cyan',
        };
        return <Tag color={colorMap[type]}>{type.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Frequency',
      dataIndex: 'frequency',
      key: 'frequency',
      width: 120,
      render: (freq: string) => (
        <Tag icon={<ScheduleOutlined />}>{freq.charAt(0).toUpperCase() + freq.slice(1)}</Tag>
      ),
    },
    {
      title: 'Format',
      dataIndex: 'format',
      key: 'format',
      width: 120,
      render: (formats: string[]) => (
        <Space size="small">
          {formats.map((f, idx) => (
            <Tag key={idx} icon={f === 'PDF' ? <FilePdfOutlined /> : <FileExcelOutlined />}>
              {f}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Last Generated',
      dataIndex: 'lastGenerated',
      key: 'lastGenerated',
      width: 130,
    },
    {
      title: 'Next Generation',
      dataIndex: 'nextGeneration',
      key: 'nextGeneration',
      width: 140,
      render: (date: string) => (
        <span>
          <CalendarOutlined style={{ marginRight: 4 }} />
          {date}
        </span>
      ),
    },
    {
      title: 'Auto-Send',
      dataIndex: 'autoSend',
      key: 'autoSend',
      width: 110,
      render: (autoSend: boolean, record: Report) => (
        <div>
          <Tag color={autoSend ? 'green' : 'default'} icon={autoSend ? <MailOutlined /> : null}>
            {autoSend ? 'ACTIVE' : 'OFF'}
          </Tag>
          {autoSend && (
            <div style={{ fontSize: 10, color: '#999', marginTop: 4 }}>
              {record.recipients.length} recipient(s)
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      fixed: 'right' as const,
      render: (_: any, record: Report) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewReport(record)}
          >
            View
          </Button>
          <Button
            type="link"
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => handleDownloadReport(record)}
          >
            Download
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const recentReportsColumns = [
    {
      title: 'Report Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => <Tag>{type}</Tag>,
    },
    {
      title: 'Generated Date',
      dataIndex: 'generatedDate',
      key: 'generatedDate',
      width: 140,
    },
    {
      title: 'Generated By',
      dataIndex: 'generatedBy',
      key: 'generatedBy',
      width: 150,
    },
    {
      title: 'Format',
      dataIndex: 'format',
      key: 'format',
      width: 100,
      render: (format: string) => (
        <Tag icon={format === 'PDF' ? <FilePdfOutlined /> : <FileExcelOutlined />}>
          {format}
        </Tag>
      ),
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      width: 100,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: () => (
        <Space size="small">
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

  const handleViewReport = (report: Report) => {
    message.info(`Viewing report: ${report.name}`);
  };

  const handleDownloadReport = (report: Report) => {
    message.success(`Downloading ${report.name}...`);
  };

  const handleCreateReport = () => {
    form.validateFields().then((values) => {
      console.log('Creating report:', values);
      message.success('Report scheduled successfully!');
      setCreateModalVisible(false);
      form.resetFields();
    });
  };

  const handleGenerateReport = (template: ReportTemplate) => {
    setSelectedReport(template as any);
    setGenerateModalVisible(true);
  };

  const confirmGenerateReport = () => {
    generateForm.validateFields().then((values) => {
      console.log('Generating report:', values);
      message.success('Report generation started! You will be notified when it is ready.');
      setGenerateModalVisible(false);
      generateForm.resetFields();
    });
  };

  const tabItems: TabsProps['items'] = [
    {
      key: 'scheduled',
      label: (
        <span>
          <ScheduleOutlined /> Scheduled Reports
        </span>
      ),
      children: (
        <div>
          <Card
            style={{ marginBottom: 16 }}
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalVisible(true)}>
                Schedule New Report
              </Button>
            }
          >
            <Table
              columns={scheduledReportsColumns}
              dataSource={scheduledReports}
              scroll={{ x: 1200 }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} scheduled reports`,
              }}
            />
          </Card>
        </div>
      ),
    },
    {
      key: 'templates',
      label: (
        <span>
          <FileTextOutlined /> Report Templates
        </span>
      ),
      children: (
        <div>
          <Row gutter={[16, 16]}>
            {reportTemplates.map((template) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={template.key}>
                <Card
                  hoverable
                  style={{ height: '100%' }}
                  actions={[
                    <Button
                      type="link"
                      icon={<DownloadOutlined />}
                      onClick={() => handleGenerateReport(template)}
                    >
                      Generate
                    </Button>,
                  ]}
                >
                  <div style={{ textAlign: 'center', marginBottom: 16 }}>
                    <div style={{ fontSize: 48, color: '#1890ff' }}>
                      {template.icon}
                    </div>
                  </div>
                  <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 8 }}>
                    {template.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
                    {template.description}
                  </div>
                  <Tag color="blue">{template.category}</Tag>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ),
    },
    {
      key: 'recent',
      label: (
        <span>
          <CalendarOutlined /> Recent Reports
        </span>
      ),
      children: (
        <Card>
          <Table
            columns={recentReportsColumns}
            dataSource={recentReports}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} reports`,
            }}
          />
        </Card>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>
          <FileTextOutlined style={{ marginRight: 8 }} />
          Reports Management
        </h1>
        <p style={{ color: '#666', marginBottom: 0 }}>
          Generate, schedule, and manage automated reports for your fund
        </p>
      </div>

      <Tabs
        activeKey={selectedTab}
        onChange={setSelectedTab}
        items={tabItems}
      />

      {/* Create Report Modal */}
      <Modal
        title="Schedule New Report"
        open={createModalVisible}
        onOk={handleCreateReport}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
        }}
        width={600}
        okText="Schedule Report"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Report Name"
            rules={[{ required: true, message: 'Please enter report name' }]}
          >
            <Input placeholder="e.g., Monthly Performance Report" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={3} placeholder="Brief description of the report..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Report Type"
                rules={[{ required: true, message: 'Please select type' }]}
              >
                <Select placeholder="Select type">
                  <Select.Option value="performance">Performance</Select.Option>
                  <Select.Option value="investors">Investors</Select.Option>
                  <Select.Option value="compliance">Compliance</Select.Option>
                  <Select.Option value="financial">Financial</Select.Option>
                  <Select.Option value="operations">Operations</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="frequency"
                label="Frequency"
                rules={[{ required: true, message: 'Please select frequency' }]}
              >
                <Select placeholder="Select frequency">
                  <Select.Option value="daily">Daily</Select.Option>
                  <Select.Option value="weekly">Weekly</Select.Option>
                  <Select.Option value="monthly">Monthly</Select.Option>
                  <Select.Option value="quarterly">Quarterly</Select.Option>
                  <Select.Option value="annual">Annual</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="format"
            label="Output Format"
            rules={[{ required: true, message: 'Please select at least one format' }]}
          >
            <Checkbox.Group>
              <Checkbox value="PDF">PDF</Checkbox>
              <Checkbox value="Excel">Excel</Checkbox>
              <Checkbox value="CSV">CSV</Checkbox>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item
            name="autoSend"
            valuePropName="checked"
          >
            <Checkbox>Enable automatic email delivery</Checkbox>
          </Form.Item>

          <Form.Item
            name="recipients"
            label="Email Recipients"
            help="Comma-separated email addresses"
          >
            <Input placeholder="email1@example.com, email2@example.com" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Generate Report Modal */}
      <Modal
        title={`Generate ${selectedReport?.name || 'Report'}`}
        open={generateModalVisible}
        onOk={confirmGenerateReport}
        onCancel={() => {
          setGenerateModalVisible(false);
          generateForm.resetFields();
        }}
        width={500}
        okText="Generate Report"
      >
        <Form form={generateForm} layout="vertical">
          <Form.Item
            name="dateRange"
            label="Date Range"
            rules={[{ required: true, message: 'Please select date range' }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="format"
            label="Output Format"
            rules={[{ required: true, message: 'Please select format' }]}
          >
            <Select placeholder="Select format">
              <Select.Option value="pdf">PDF</Select.Option>
              <Select.Option value="excel">Excel</Select.Option>
              <Select.Option value="csv">CSV</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="sendEmail"
            valuePropName="checked"
          >
            <Checkbox>Send report to my email when ready</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReportsPage;
