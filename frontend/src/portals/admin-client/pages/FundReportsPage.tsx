import { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Select,
  DatePicker,
  Row,
  Col,
  Space,
  Tag,
  Modal,
  Form,
  Radio,
  Checkbox,
} from 'antd';
import {
  FileTextOutlined,
  DownloadOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileOutlined,
  PlusOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { ColumnType } from 'antd/es/table';
import StatCard from '../../../components/common/StatCard';

const { RangePicker } = DatePicker;

interface Report {
  id: string;
  name: string;
  type: 'performance' | 'nav' | 'holdings' | 'tax' | 'compliance' | 'investor-statement';
  period: string;
  generatedDate: string;
  generatedBy: string;
  format: 'PDF' | 'Excel' | 'CSV';
  status: 'ready' | 'generating' | 'failed';
  size: string;
}

export default function FundReportsPage() {
  const [isGenerateModalVisible, setIsGenerateModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedReportType, setSelectedReportType] = useState<string>('performance');

  // Mock data
  const reports: Report[] = [
    {
      id: 'RPT001',
      name: 'Q3 2024 Performance Report',
      type: 'performance',
      period: 'Q3 2024 (Jul-Sep)',
      generatedDate: '2024-10-05 14:30:00',
      generatedBy: 'Fund Manager',
      format: 'PDF',
      status: 'ready',
      size: '2.4 MB',
    },
    {
      id: 'RPT002',
      name: 'October 2024 NAV Report',
      type: 'nav',
      period: 'October 2024',
      generatedDate: '2024-11-01 09:15:00',
      generatedBy: 'System',
      format: 'Excel',
      status: 'ready',
      size: '1.8 MB',
    },
    {
      id: 'RPT003',
      name: 'Holdings Report - November 2024',
      type: 'holdings',
      period: 'November 2024',
      generatedDate: '2024-11-10 10:00:00',
      generatedBy: 'Portfolio Manager',
      format: 'Excel',
      status: 'ready',
      size: '3.2 MB',
    },
    {
      id: 'RPT004',
      name: 'Investor Statement - John Doe',
      type: 'investor-statement',
      period: 'Q3 2024',
      generatedDate: '2024-10-10 16:45:00',
      generatedBy: 'Fund Manager',
      format: 'PDF',
      status: 'ready',
      size: '856 KB',
    },
    {
      id: 'RPT005',
      name: 'Annual Tax Package 2023',
      type: 'tax',
      period: 'FY 2023',
      generatedDate: '2024-03-15 11:20:00',
      generatedBy: 'Tax Specialist',
      format: 'PDF',
      status: 'ready',
      size: '4.5 MB',
    },
    {
      id: 'RPT006',
      name: 'Compliance Report - October 2024',
      type: 'compliance',
      period: 'October 2024',
      generatedDate: '2024-11-01 14:00:00',
      generatedBy: 'Compliance Officer',
      format: 'PDF',
      status: 'ready',
      size: '1.2 MB',
    },
    {
      id: 'RPT007',
      name: 'Monthly Performance - November 2024',
      type: 'performance',
      period: 'November 2024 (MTD)',
      generatedDate: '2024-11-10 08:30:00',
      generatedBy: 'System',
      format: 'PDF',
      status: 'generating',
      size: '-',
    },
  ];

  const getTypeTag = (type: Report['type']) => {
    const typeConfig = {
      performance: { color: 'blue', text: 'Performance' },
      nav: { color: 'green', text: 'NAV' },
      holdings: { color: 'purple', text: 'Holdings' },
      tax: { color: 'orange', text: 'Tax' },
      compliance: { color: 'red', text: 'Compliance' },
      'investor-statement': { color: 'cyan', text: 'Investor Statement' },
    };
    const config = typeConfig[type];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getStatusTag = (status: Report['status']) => {
    const statusConfig = {
      ready: { color: 'success', text: 'Ready' },
      generating: { color: 'processing', text: 'Generating...' },
      failed: { color: 'error', text: 'Failed' },
    };
    const config = statusConfig[status];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getFormatIcon = (format: Report['format']) => {
    const icons = {
      PDF: <FilePdfOutlined style={{ color: '#ff4d4f', fontSize: '18px' }} />,
      Excel: <FileExcelOutlined style={{ color: '#52c41a', fontSize: '18px' }} />,
      CSV: <FileOutlined style={{ color: '#1890ff', fontSize: '18px' }} />,
    };
    return icons[format];
  };

  const columns: ColumnType<Report>[] = [
    {
      title: 'Report Name',
      dataIndex: 'name',
      key: 'name',
      width: 280,
      render: (name: string, record: Report) => (
        <Space>
          {getFormatIcon(record.format)}
          <span style={{ fontWeight: 500 }}>{name}</span>
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 180,
      render: getTypeTag,
      filters: [
        { text: 'Performance', value: 'performance' },
        { text: 'NAV', value: 'nav' },
        { text: 'Holdings', value: 'holdings' },
        { text: 'Tax', value: 'tax' },
        { text: 'Compliance', value: 'compliance' },
        { text: 'Investor Statement', value: 'investor-statement' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Period',
      dataIndex: 'period',
      key: 'period',
      width: 180,
    },
    {
      title: 'Generated Date',
      dataIndex: 'generatedDate',
      key: 'generatedDate',
      width: 180,
      sorter: (a, b) => new Date(a.generatedDate).getTime() - new Date(b.generatedDate).getTime(),
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
      align: 'center',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      width: 100,
      align: 'right',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: getStatusTag,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 180,
      render: (_: any, record: Report) => (
        <Space>
          {record.status === 'ready' && (
            <>
              <Button type="link" size="small" icon={<EyeOutlined />}>
                View
              </Button>
              <Button type="link" size="small" icon={<DownloadOutlined />}>
                Download
              </Button>
            </>
          )}
          {record.status === 'failed' && (
            <Button type="link" size="small" danger>
              Retry
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleGenerateReport = (values: any) => {
    console.log('Generating report with values:', values);
    // Aquí iría la lógica para generar el reporte
    setIsGenerateModalVisible(false);
    form.resetFields();
  };

  const totalReports = reports.length;
  const readyReports = reports.filter((r) => r.status === 'ready').length;
  const generatingReports = reports.filter((r) => r.status === 'generating').length;

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: 'Sansation, sans-serif', fontSize: '32px', marginBottom: '8px' }}>
            Fund Reports
          </h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            Generate and download fund performance, compliance, and investor reports
          </p>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => setIsGenerateModalVisible(true)}
          style={{ backgroundColor: '#2d2d2d' }}
        >
          Generate Report
        </Button>
      </div>

      {/* Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <StatCard
            title="Total Reports"
            value={totalReports}
            icon={<FileTextOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={8}>
          <StatCard
            title="Ready to Download"
            value={readyReports}
            icon={<DownloadOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={8}>
          <StatCard
            title="Generating"
            value={generatingReports}
            icon={<FileOutlined />}
            color="#faad14"
          />
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card className="professional-card" style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '16px', fontWeight: 500, fontSize: '16px' }}>Quick Generate</div>
        <Space wrap>
          <Button icon={<FilePdfOutlined />} onClick={() => { setSelectedReportType('performance'); setIsGenerateModalVisible(true); }}>
            Performance Report
          </Button>
          <Button icon={<FileExcelOutlined />} onClick={() => { setSelectedReportType('nav'); setIsGenerateModalVisible(true); }}>
            NAV Report
          </Button>
          <Button icon={<FileTextOutlined />} onClick={() => { setSelectedReportType('holdings'); setIsGenerateModalVisible(true); }}>
            Holdings Report
          </Button>
          <Button icon={<FilePdfOutlined />} onClick={() => { setSelectedReportType('tax'); setIsGenerateModalVisible(true); }}>
            Tax Package
          </Button>
          <Button icon={<FileOutlined />} onClick={() => { setSelectedReportType('compliance'); setIsGenerateModalVisible(true); }}>
            Compliance Report
          </Button>
        </Space>
      </Card>

      {/* Reports Table */}
      <Card className="professional-card">
        <Table
          columns={columns}
          dataSource={reports}
          rowKey="id"
          scroll={{ x: 1400 }}
          pagination={{
            total: reports.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} reports`,
          }}
        />
      </Card>

      {/* Generate Report Modal */}
      <Modal
        title={
          <Space>
            <FileTextOutlined />
            <span>Generate New Report</span>
          </Space>
        }
        open={isGenerateModalVisible}
        onCancel={() => {
          setIsGenerateModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleGenerateReport} initialValues={{ type: selectedReportType }}>
          <Form.Item name="type" label="Report Type" rules={[{ required: true }]}>
            <Select
              size="large"
              onChange={setSelectedReportType}
              options={[
                { label: 'Performance Report', value: 'performance' },
                { label: 'NAV Report', value: 'nav' },
                { label: 'Holdings Report', value: 'holdings' },
                { label: 'Tax Package', value: 'tax' },
                { label: 'Compliance Report', value: 'compliance' },
                { label: 'Investor Statement', value: 'investor-statement' },
              ]}
            />
          </Form.Item>

          <Form.Item name="period" label="Period" rules={[{ required: true }]}>
            <Radio.Group>
              <Space direction="vertical">
                <Radio value="mtd">Month to Date</Radio>
                <Radio value="qtd">Quarter to Date</Radio>
                <Radio value="ytd">Year to Date</Radio>
                <Radio value="custom">Custom Date Range</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.period !== currentValues.period}
          >
            {({ getFieldValue }) =>
              getFieldValue('period') === 'custom' ? (
                <Form.Item name="dateRange" label="Date Range" rules={[{ required: true }]}>
                  <RangePicker style={{ width: '100%' }} size="large" />
                </Form.Item>
              ) : null
            }
          </Form.Item>

          <Form.Item name="format" label="Format" rules={[{ required: true }]} initialValue="PDF">
            <Radio.Group>
              <Radio value="PDF">PDF</Radio>
              <Radio value="Excel">Excel</Radio>
              <Radio value="CSV">CSV</Radio>
            </Radio.Group>
          </Form.Item>

          {selectedReportType === 'investor-statement' && (
            <Form.Item name="investors" label="Select Investors">
              <Checkbox.Group
                options={[
                  { label: 'John Doe', value: 'john' },
                  { label: 'Jane Smith', value: 'jane' },
                  { label: 'Mike Johnson', value: 'mike' },
                  { label: 'All Investors', value: 'all' },
                ]}
              />
            </Form.Item>
          )}

          <Form.Item name="includeCharts" valuePropName="checked" initialValue={true}>
            <Checkbox>Include charts and visualizations</Checkbox>
          </Form.Item>

          <Form.Item name="includeComparative" valuePropName="checked">
            <Checkbox>Include comparative analysis (vs. previous period)</Checkbox>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => { setIsGenerateModalVisible(false); form.resetFields(); }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" style={{ backgroundColor: '#2d2d2d' }}>
                Generate Report
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
