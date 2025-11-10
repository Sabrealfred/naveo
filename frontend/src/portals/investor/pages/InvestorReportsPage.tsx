import { Card, Col, Row, Table, Tag, Button, Space, DatePicker, Select } from 'antd';
import {
  FileTextOutlined,
  DownloadOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { RangePicker } = DatePicker;

export default function InvestorReportsPage() {
  const { t } = useTranslation();
  const reports = [
    {
      key: '1',
      type: 'Statement',
      period: 'Q3 2024',
      dateGenerated: '2024-10-05',
      format: 'PDF',
      status: 'available',
      size: '1.2 MB',
    },
    {
      key: '2',
      type: 'Tax Document',
      period: '2023',
      dateGenerated: '2024-02-15',
      format: 'PDF',
      status: 'available',
      size: '856 KB',
    },
    {
      key: '3',
      type: 'Performance Report',
      period: 'October 2024',
      dateGenerated: '2024-11-01',
      format: 'Excel',
      status: 'available',
      size: '324 KB',
    },
    {
      key: '4',
      type: 'Transaction History',
      period: 'YTD 2024',
      dateGenerated: '2024-11-10',
      format: 'CSV',
      status: 'processing',
      size: '-',
    },
  ];

  const columns = [
    {
      title: t('reports.type'),
      dataIndex: 'type',
      key: 'type',
      render: (text: string) => (
        <Space>
          <FilePdfOutlined style={{ fontSize: '16px', color: '#f5222d' }} />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      ),
    },
    {
      title: t('reports.period'),
      dataIndex: 'period',
      key: 'period',
    },
    {
      title: t('reports.generated'),
      dataIndex: 'dateGenerated',
      key: 'dateGenerated',
    },
    {
      title: t('reports.format'),
      dataIndex: 'format',
      key: 'format',
      render: (format: string) => {
        const colors: Record<string, string> = {
          PDF: 'red',
          Excel: 'green',
          CSV: 'blue',
        };
        return <Tag color={colors[format]}>{format}</Tag>;
      },
    },
    {
      title: t('reports.size'),
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'available' ? 'success' : 'processing'}>
          {status === 'available' ? t('reports.available').toUpperCase() : t('reports.processing').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          {record.status === 'available' ? (
            <>
              <Button
                type="primary"
                size="small"
                icon={<DownloadOutlined />}
              >
                {t('reports.download')}
              </Button>
              <Button size="small">{t('reports.view')}</Button>
            </>
          ) : (
            <Button size="small" disabled>{t('reports.processing')}</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: 'var(--color-background)' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
          {t('reports.myReports')}
        </h1>
        <p style={{ color: 'var(--color-secondary)', fontSize: '14px' }}>
          {t('reports.myReportsSubtitle')}
        </p>
      </div>

      {/* Quick Actions */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card className="professional-card" hoverable>
            <Space direction="vertical" align="center" style={{ width: '100%' }}>
              <FilePdfOutlined style={{ fontSize: '32px', color: '#2d2d2d' }} />
              <span style={{ fontWeight: 500 }}>{t('reports.accountStatement')}</span>
              <Button type="link">{t('reports.generate')}</Button>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="professional-card" hoverable>
            <Space direction="vertical" align="center" style={{ width: '100%' }}>
              <FileExcelOutlined style={{ fontSize: '32px', color: '#52c41a' }} />
              <span style={{ fontWeight: 500 }}>{t('reports.transactionExport')}</span>
              <Button type="link">{t('common.export')}</Button>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="professional-card" hoverable>
            <Space direction="vertical" align="center" style={{ width: '100%' }}>
              <FileTextOutlined style={{ fontSize: '32px', color: '#722ed1' }} />
              <span style={{ fontWeight: 500 }}>{t('reports.taxDocument')}</span>
              <Button type="link">{t('reports.view')}</Button>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="professional-card" hoverable>
            <Space direction="vertical" align="center" style={{ width: '100%' }}>
              <FilePdfOutlined style={{ fontSize: '32px', color: '#fa8c16' }} />
              <span style={{ fontWeight: 500 }}>{t('reports.performance')}</span>
              <Button type="link">{t('reports.download')}</Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md={12}>
          <RangePicker style={{ width: '100%' }} />
        </Col>
        <Col xs={24} md={12}>
          <Select
            placeholder={t('reports.filterByReportType')}
            style={{ width: '100%' }}
            allowClear
            options={[
              { label: t('reports.statement'), value: 'statement' },
              { label: t('reports.taxDocument'), value: 'tax' },
              { label: t('reports.performance'), value: 'performance' },
              { label: t('reports.transactionHistory'), value: 'transactions' },
            ]}
          />
        </Col>
      </Row>

      {/* Reports Table */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title={t('reports.availableReports')} bordered={false} className="professional-card">
            <Table
              dataSource={reports}
              columns={columns}
              pagination={{ pageSize: 10 }}
              scroll={{ x: 900 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
