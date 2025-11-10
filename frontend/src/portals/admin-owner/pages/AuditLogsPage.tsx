import { useState, useMemo } from 'react';
import {
  Card,
  Table,
  Tag,
  Input,
  Select,
  DatePicker,
  Space,
  Button,
  Drawer,
  Descriptions,
  Row,
  Col,
  Statistic,
  Badge,
  Typography,
  Tooltip,
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  userId: string;
  action: string;
  module: string;
  resource: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  ipAddress: string;
  userAgent: string;
  details: Record<string, any>;
  status: 'success' | 'failed';
}

export default function AuditLogsPage() {
  const [searchText, setSearchText] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Mock data - replace with API call
  const auditLogs: AuditLog[] = [
    {
      id: 'LOG-2024-001',
      timestamp: '2024-11-10T15:45:00Z',
      user: 'John Admin',
      userId: 'USR-001',
      action: 'UPDATE_FUND_STATUS',
      module: 'Funds Management',
      resource: 'Alpha Growth Fund',
      severity: 'info',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 Chrome/119.0',
      details: {
        fundId: 'FUND-001',
        previousStatus: 'active',
        newStatus: 'paused',
        reason: 'Regulatory review',
      },
      status: 'success',
    },
    {
      id: 'LOG-2024-002',
      timestamp: '2024-11-10T15:30:00Z',
      user: 'Sarah Client',
      userId: 'USR-045',
      action: 'FAILED_LOGIN',
      module: 'Authentication',
      resource: 'Login System',
      severity: 'warning',
      ipAddress: '203.45.67.89',
      userAgent: 'Mozilla/5.0 Safari/17.0',
      details: {
        attempts: 3,
        lastAttempt: '2024-11-10T15:30:00Z',
        reason: 'Invalid password',
      },
      status: 'failed',
    },
    {
      id: 'LOG-2024-003',
      timestamp: '2024-11-10T15:15:00Z',
      user: 'Admin System',
      userId: 'SYS-001',
      action: 'CONTRACT_UPGRADE',
      module: 'Smart Contracts',
      resource: 'ERC-20 Token Contract',
      severity: 'critical',
      ipAddress: '10.0.0.1',
      userAgent: 'Automated System',
      details: {
        contractAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        fromVersion: 'v2.0.0',
        toVersion: 'v2.1.0',
        network: 'Polygon',
        gasUsed: '245000',
      },
      status: 'success',
    },
    {
      id: 'LOG-2024-004',
      timestamp: '2024-11-10T15:00:00Z',
      user: 'Mary Compliance',
      userId: 'USR-023',
      action: 'KYC_APPROVAL',
      module: 'Compliance',
      resource: 'Investor KYC-2024-892',
      severity: 'info',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 Firefox/120.0',
      details: {
        kycId: 'KYC-2024-892',
        investorId: 'INV-445',
        level: 'Level 2',
        verificationMethod: 'Persona',
      },
      status: 'success',
    },
    {
      id: 'LOG-2024-005',
      timestamp: '2024-11-10T14:45:00Z',
      user: 'Bob Admin',
      userId: 'USR-005',
      action: 'UPDATE_FEE_STRUCTURE',
      module: 'Fee Management',
      resource: 'Transaction Fees',
      severity: 'warning',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 Chrome/119.0',
      details: {
        feeType: 'Transaction Fee',
        previousRate: 0.5,
        newRate: 0.65,
        effectiveDate: '2024-11-15',
      },
      status: 'success',
    },
    {
      id: 'LOG-2024-006',
      timestamp: '2024-11-10T14:30:00Z',
      user: 'System Monitor',
      userId: 'SYS-002',
      action: 'API_RATE_LIMIT_EXCEEDED',
      module: 'API Gateway',
      resource: 'REST API',
      severity: 'error',
      ipAddress: '45.123.67.89',
      userAgent: 'Python-requests/2.31.0',
      details: {
        endpoint: '/api/v1/funds',
        requestsCount: 1250,
        limit: 1000,
        timeWindow: '1 hour',
        clientId: 'API-CLIENT-034',
      },
      status: 'failed',
    },
    {
      id: 'LOG-2024-007',
      timestamp: '2024-11-10T14:15:00Z',
      user: 'Alice Investor',
      userId: 'USR-234',
      action: 'FUND_SUBSCRIPTION',
      module: 'Investments',
      resource: 'Beta Yield Fund',
      severity: 'info',
      ipAddress: '98.76.54.32',
      userAgent: 'Mozilla/5.0 Chrome/119.0',
      details: {
        fundId: 'FUND-005',
        amount: 50000,
        currency: 'USDC',
        tokenAmount: 391.23,
      },
      status: 'success',
    },
    {
      id: 'LOG-2024-008',
      timestamp: '2024-11-10T14:00:00Z',
      user: 'Admin System',
      userId: 'SYS-001',
      action: 'NAV_CALCULATION',
      module: 'NAV System',
      resource: 'All Funds',
      severity: 'info',
      ipAddress: '10.0.0.1',
      userAgent: 'Automated System',
      details: {
        fundsProcessed: 18,
        totalAUM: 245680000,
        calculationTime: '2.3s',
        timestamp: '2024-11-10T14:00:00Z',
      },
      status: 'success',
    },
  ];

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: auditLogs.length,
      info: auditLogs.filter((log) => log.severity === 'info').length,
      warning: auditLogs.filter((log) => log.severity === 'warning').length,
      error: auditLogs.filter((log) => log.severity === 'error').length,
      critical: auditLogs.filter((log) => log.severity === 'critical').length,
      failed: auditLogs.filter((log) => log.status === 'failed').length,
    };
  }, [auditLogs]);

  // Filter logs
  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesSearch =
        searchText === '' ||
        log.user.toLowerCase().includes(searchText.toLowerCase()) ||
        log.action.toLowerCase().includes(searchText.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchText.toLowerCase());

      const matchesModule =
        selectedModule === 'all' || log.module === selectedModule;

      const matchesSeverity =
        selectedSeverity === 'all' || log.severity === selectedSeverity;

      const matchesDate =
        !dateRange ||
        (dayjs(log.timestamp).isAfter(dateRange[0]) &&
          dayjs(log.timestamp).isBefore(dateRange[1]));

      return matchesSearch && matchesModule && matchesSeverity && matchesDate;
    });
  }, [auditLogs, searchText, selectedModule, selectedSeverity, dateRange]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'info':
        return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
      case 'warning':
        return <WarningOutlined style={{ color: '#faad14' }} />;
      case 'error':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'critical':
        return <CloseCircleOutlined style={{ color: '#cf1322' }} />;
      default:
        return <InfoCircleOutlined />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info':
        return 'blue';
      case 'warning':
        return 'orange';
      case 'error':
        return 'red';
      case 'critical':
        return 'volcano';
      default:
        return 'default';
    }
  };

  const columns: ColumnsType<AuditLog> = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (timestamp: string) => (
        <Text style={{ fontSize: '13px' }}>
          {dayjs(timestamp).format('MMM DD, YYYY HH:mm:ss')}
        </Text>
      ),
      sorter: (a, b) => dayjs(a.timestamp).unix() - dayjs(b.timestamp).unix(),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      width: 120,
      render: (severity: string) => (
        <Tag icon={getSeverityIcon(severity)} color={getSeverityColor(severity)}>
          {severity.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Info', value: 'info' },
        { text: 'Warning', value: 'warning' },
        { text: 'Error', value: 'error' },
        { text: 'Critical', value: 'critical' },
      ],
      onFilter: (value, record) => record.severity === value,
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      width: 150,
      render: (user: string, record: AuditLog) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: '13px' }}>
            {user}
          </Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.userId}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 200,
      render: (action: string) => (
        <Tag style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
          {action}
        </Tag>
      ),
    },
    {
      title: 'Module',
      dataIndex: 'module',
      key: 'module',
      width: 150,
      filters: [
        { text: 'Funds Management', value: 'Funds Management' },
        { text: 'Authentication', value: 'Authentication' },
        { text: 'Smart Contracts', value: 'Smart Contracts' },
        { text: 'Compliance', value: 'Compliance' },
        { text: 'Fee Management', value: 'Fee Management' },
        { text: 'API Gateway', value: 'API Gateway' },
        { text: 'Investments', value: 'Investments' },
        { text: 'NAV System', value: 'NAV System' },
      ],
      onFilter: (value, record) => record.module === value,
    },
    {
      title: 'Resource',
      dataIndex: 'resource',
      key: 'resource',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (resource: string) => (
        <Tooltip placement="topLeft" title={resource}>
          {resource}
        </Tooltip>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag
          icon={status === 'success' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={status === 'success' ? 'success' : 'error'}
        >
          {status.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Success', value: 'success' },
        { text: 'Failed', value: 'failed' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedLog(record);
            setDrawerVisible(true);
          }}
        >
          Details
        </Button>
      ),
    },
  ];

  const handleExport = () => {
    // In production, this would trigger a CSV/JSON export
    console.log('Exporting audit logs:', filteredLogs);
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>Audit Logs</Title>
        <Text type="secondary">
          Complete audit trail of all system activities and user actions
        </Text>
      </div>

      {/* Stats Overview */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8} lg={4}>
          <Card>
            <Statistic
              title="Total Logs"
              value={stats.total}
              prefix={<InfoCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="Info"
              value={stats.info}
              valueStyle={{ color: '#1890ff' }}
              prefix={<InfoCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="Warnings"
              value={stats.warning}
              valueStyle={{ color: '#faad14' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="Errors"
              value={stats.error}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="Critical"
              value={stats.critical}
              valueStyle={{ color: '#cf1322' }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={4}>
          <Card>
            <Statistic
              title="Failed Actions"
              value={stats.failed}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: '16px' }}>
        <Space wrap style={{ width: '100%' }}>
          <Input
            placeholder="Search by user, action, or resource"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          <Select
            placeholder="Filter by module"
            style={{ width: 200 }}
            value={selectedModule}
            onChange={setSelectedModule}
          >
            <Select.Option value="all">All Modules</Select.Option>
            <Select.Option value="Funds Management">Funds Management</Select.Option>
            <Select.Option value="Authentication">Authentication</Select.Option>
            <Select.Option value="Smart Contracts">Smart Contracts</Select.Option>
            <Select.Option value="Compliance">Compliance</Select.Option>
            <Select.Option value="Fee Management">Fee Management</Select.Option>
            <Select.Option value="API Gateway">API Gateway</Select.Option>
            <Select.Option value="Investments">Investments</Select.Option>
            <Select.Option value="NAV System">NAV System</Select.Option>
          </Select>
          <Select
            placeholder="Filter by severity"
            style={{ width: 150 }}
            value={selectedSeverity}
            onChange={setSelectedSeverity}
          >
            <Select.Option value="all">All Severities</Select.Option>
            <Select.Option value="info">Info</Select.Option>
            <Select.Option value="warning">Warning</Select.Option>
            <Select.Option value="error">Error</Select.Option>
            <Select.Option value="critical">Critical</Select.Option>
          </Select>
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs] | null)}
            style={{ width: 300 }}
          />
          <Button
            icon={<FilterOutlined />}
            onClick={() => {
              setSearchText('');
              setSelectedModule('all');
              setSelectedSeverity('all');
              setDateRange(null);
            }}
          >
            Clear Filters
          </Button>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExport}
          >
            Export Logs
          </Button>
        </Space>
        <div style={{ marginTop: '12px' }}>
          <Text type="secondary">
            Showing {filteredLogs.length} of {auditLogs.length} logs
          </Text>
        </div>
      </Card>

      {/* Logs Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredLogs}
          rowKey="id"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} logs`,
          }}
          scroll={{ x: 1400 }}
        />
      </Card>

      {/* Details Drawer */}
      <Drawer
        title={
          <Space>
            <Text strong>Audit Log Details</Text>
            {selectedLog && (
              <Tag
                icon={getSeverityIcon(selectedLog.severity)}
                color={getSeverityColor(selectedLog.severity)}
              >
                {selectedLog.severity.toUpperCase()}
              </Tag>
            )}
          </Space>
        }
        width={600}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      >
        {selectedLog && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Log ID">{selectedLog.id}</Descriptions.Item>
              <Descriptions.Item label="Timestamp">
                {dayjs(selectedLog.timestamp).format('MMMM DD, YYYY HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="User">
                {selectedLog.user} ({selectedLog.userId})
              </Descriptions.Item>
              <Descriptions.Item label="Action">
                <Tag style={{ fontFamily: 'var(--font-mono)' }}>
                  {selectedLog.action}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Module">{selectedLog.module}</Descriptions.Item>
              <Descriptions.Item label="Resource">{selectedLog.resource}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag
                  icon={
                    selectedLog.status === 'success' ? (
                      <CheckCircleOutlined />
                    ) : (
                      <CloseCircleOutlined />
                    )
                  }
                  color={selectedLog.status === 'success' ? 'success' : 'error'}
                >
                  {selectedLog.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="IP Address">
                {selectedLog.ipAddress}
              </Descriptions.Item>
              <Descriptions.Item label="User Agent">
                {selectedLog.userAgent}
              </Descriptions.Item>
            </Descriptions>

            <Card title="Action Details" size="small">
              <pre
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: '12px',
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                }}
              >
                {JSON.stringify(selectedLog.details, null, 2)}
              </pre>
            </Card>
          </Space>
        )}
      </Drawer>
    </div>
  );
}
