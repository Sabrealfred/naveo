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
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
      performance: { color: 'blue', text: t('reports.performance') },
      nav: { color: 'green', text: t('reports.nav') },
      holdings: { color: 'purple', text: t('reports.holdings') },
      tax: { color: 'orange', text: t('reports.tax') },
      compliance: { color: 'red', text: t('reports.compliance') },
      'investor-statement': { color: 'cyan', text: t('reports.investorStatement') },
    };
    const config = typeConfig[type];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getStatusTag = (status: Report['status']) => {
    const statusConfig = {
      ready: { color: 'success', text: t('reports.ready') },
      generating: { color: 'processing', text: t('reports.generatingStatus') },
      failed: { color: 'error', text: t('reports.failed') },
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
      title: t('reports.reportName'),
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
      title: t('reports.type'),
      dataIndex: 'type',
      key: 'type',
      width: 180,
      render: getTypeTag,
      filters: [
        { text: t('reports.performance'), value: 'performance' },
        { text: t('reports.nav'), value: 'nav' },
        { text: t('reports.holdings'), value: 'holdings' },
        { text: t('reports.tax'), value: 'tax' },
        { text: t('reports.compliance'), value: 'compliance' },
        { text: t('reports.investorStatement'), value: 'investor-statement' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: t('reports.period'),
      dataIndex: 'period',
      key: 'period',
      width: 180,
    },
    {
      title: t('reports.generatedDate'),
      dataIndex: 'generatedDate',
      key: 'generatedDate',
      width: 180,
      sorter: (a, b) => new Date(a.generatedDate).getTime() - new Date(b.generatedDate).getTime(),
    },
    {
      title: t('reports.generatedBy'),
      dataIndex: 'generatedBy',
      key: 'generatedBy',
      width: 150,
    },
    {
      title: t('reports.format'),
      dataIndex: 'format',
      key: 'format',
      width: 100,
      align: 'center',
    },
    {
      title: t('reports.size'),
      dataIndex: 'size',
      key: 'size',
      width: 100,
      align: 'right',
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: getStatusTag,
    },
    {
      title: t('common.actions'),
      key: 'actions',
      fixed: 'right',
      width: 180,
      render: (_: any, record: Report) => (
        <Space>
          {record.status === 'ready' && (
            <>
              <Button type="link" size="small" icon={<EyeOutlined />}>
                {t('reports.view')}
              </Button>
              <Button type="link" size="small" icon={<DownloadOutlined />}>
                {t('reports.download')}
              </Button>
            </>
          )}
          {record.status === 'failed' && (
            <Button type="link" size="small" danger>
              {t('reports.retry')}
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
            {t('reports.title')}
          </h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            {t('reports.subtitle')}
          </p>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => setIsGenerateModalVisible(true)}
          style={{ backgroundColor: '#2d2d2d' }}
        >
          {t('reports.generate')}
        </Button>
      </div>

      {/* Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <StatCard
            title={t('reports.totalReports')}
            value={totalReports}
            icon={<FileTextOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={8}>
          <StatCard
            title={t('reports.readyToDownload')}
            value={readyReports}
            icon={<DownloadOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={8}>
          <StatCard
            title={t('reports.generating')}
            value={generatingReports}
            icon={<FileOutlined />}
            color="#faad14"
          />
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card className="professional-card" style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '16px', fontWeight: 500, fontSize: '16px' }}>{t('reports.quickGenerate')}</div>
        <Space wrap>
          <Button icon={<FilePdfOutlined />} onClick={() => { setSelectedReportType('performance'); setIsGenerateModalVisible(true); }}>
            {t('reports.performance')}
          </Button>
          <Button icon={<FileExcelOutlined />} onClick={() => { setSelectedReportType('nav'); setIsGenerateModalVisible(true); }}>
            {t('reports.navReport')}
          </Button>
          <Button icon={<FileTextOutlined />} onClick={() => { setSelectedReportType('holdings'); setIsGenerateModalVisible(true); }}>
            {t('reports.holdingsReport')}
          </Button>
          <Button icon={<FilePdfOutlined />} onClick={() => { setSelectedReportType('tax'); setIsGenerateModalVisible(true); }}>
            {t('reports.taxPackage')}
          </Button>
          <Button icon={<FileOutlined />} onClick={() => { setSelectedReportType('compliance'); setIsGenerateModalVisible(true); }}>
            {t('reports.complianceReport')}
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
            showTotal: (total) => t('reports.totalCount', { total }),
          }}
        />
      </Card>

      {/* Generate Report Modal */}
      <Modal
        title={
          <Space>
            <FileTextOutlined />
            <span>{t('reports.generateNew')}</span>
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
          <Form.Item name="type" label={t('reports.type')} rules={[{ required: true }]}>
            <Select
              size="large"
              onChange={setSelectedReportType}
              options={[
                { label: t('reports.performance'), value: 'performance' },
                { label: t('reports.navReport'), value: 'nav' },
                { label: t('reports.holdingsReport'), value: 'holdings' },
                { label: t('reports.taxPackage'), value: 'tax' },
                { label: t('reports.complianceReport'), value: 'compliance' },
                { label: t('reports.investorStatement'), value: 'investor-statement' },
              ]}
            />
          </Form.Item>

          <Form.Item name="period" label={t('reports.period')} rules={[{ required: true }]}>
            <Radio.Group>
              <Space direction="vertical">
                <Radio value="mtd">{t('reports.monthToDate')}</Radio>
                <Radio value="qtd">{t('reports.quarterToDate')}</Radio>
                <Radio value="ytd">{t('reports.yearToDate')}</Radio>
                <Radio value="custom">{t('reports.customDateRange')}</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.period !== currentValues.period}
          >
            {({ getFieldValue }) =>
              getFieldValue('period') === 'custom' ? (
                <Form.Item name="dateRange" label={t('reports.dateRange')} rules={[{ required: true }]}>
                  <RangePicker style={{ width: '100%' }} size="large" />
                </Form.Item>
              ) : null
            }
          </Form.Item>

          <Form.Item name="format" label={t('reports.format')} rules={[{ required: true }]} initialValue="PDF">
            <Radio.Group>
              <Radio value="PDF">PDF</Radio>
              <Radio value="Excel">Excel</Radio>
              <Radio value="CSV">CSV</Radio>
            </Radio.Group>
          </Form.Item>

          {selectedReportType === 'investor-statement' && (
            <Form.Item name="investors" label={t('reports.selectInvestors')}>
              <Checkbox.Group
                options={[
                  { label: 'John Doe', value: 'john' },
                  { label: 'Jane Smith', value: 'jane' },
                  { label: 'Mike Johnson', value: 'mike' },
                  { label: t('reports.allInvestors'), value: 'all' },
                ]}
              />
            </Form.Item>
          )}

          <Form.Item name="includeCharts" valuePropName="checked" initialValue={true}>
            <Checkbox>{t('reports.includeCharts')}</Checkbox>
          </Form.Item>

          <Form.Item name="includeComparative" valuePropName="checked">
            <Checkbox>{t('reports.includeComparative')}</Checkbox>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => { setIsGenerateModalVisible(false); form.resetFields(); }}>
                {t('common.cancel')}
              </Button>
              <Button type="primary" htmlType="submit" style={{ backgroundColor: '#2d2d2d' }}>
                {t('reports.generate')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
