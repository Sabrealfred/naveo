import { useState } from 'react';
import { Card, Table, Tag, Button, Select, Row, Col, Space, Badge, Timeline, Alert, Progress } from 'antd';
import {
  SafetyOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  AuditOutlined,
  BellOutlined,
} from '@ant-design/icons';
import type { ColumnType } from 'antd/es/table';
import StatCard from '../../../components/common/StatCard';

interface ComplianceAlert {
  id: string;
  date: string;
  severity: 'critical' | 'warning' | 'info';
  type: string;
  description: string;
  affectedEntity: string;
  status: 'open' | 'investigating' | 'resolved';
  assignedTo: string;
}

interface RegulationCheck {
  id: string;
  regulation: string;
  description: string;
  status: 'compliant' | 'non-compliant' | 'review-needed';
  lastCheck: string;
  nextCheck: string;
}

export default function CompliancePage() {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock Compliance Alerts
  const alerts: ComplianceAlert[] = [
    {
      id: 'ALERT001',
      date: '2024-11-10 15:45:00',
      severity: 'critical',
      type: 'AML Alert',
      description: 'Large transaction detected above threshold ($50,000)',
      affectedEntity: 'Investor: John Doe',
      status: 'investigating',
      assignedTo: 'Compliance Officer A',
    },
    {
      id: 'ALERT002',
      date: '2024-11-10 14:20:30',
      severity: 'warning',
      type: 'KYC Expiration',
      description: 'KYC documents expiring within 30 days',
      affectedEntity: 'Investor: Jane Smith',
      status: 'open',
      assignedTo: 'Compliance Officer B',
    },
    {
      id: 'ALERT003',
      date: '2024-11-10 11:15:45',
      severity: 'info',
      type: 'Regulatory Update',
      description: 'New SEC guidance on digital asset reporting',
      affectedEntity: 'All Funds',
      status: 'resolved',
      assignedTo: 'Compliance Manager',
    },
    {
      id: 'ALERT004',
      date: '2024-11-09 16:30:22',
      severity: 'critical',
      type: 'Sanction Screening',
      description: 'Potential match in OFAC sanctions list',
      affectedEntity: 'Pending Investor: M. Johnson',
      status: 'investigating',
      assignedTo: 'Compliance Officer A',
    },
    {
      id: 'ALERT005',
      date: '2024-11-09 13:55:10',
      severity: 'warning',
      type: 'Trade Limit Breach',
      description: 'Trader exceeded daily trading limit by 15%',
      affectedEntity: 'Trader: Sarah Williams',
      status: 'resolved',
      assignedTo: 'Compliance Officer C',
    },
    {
      id: 'ALERT006',
      date: '2024-11-09 10:40:33',
      severity: 'info',
      type: 'Document Upload',
      description: 'New compliance document uploaded for review',
      affectedEntity: 'Fund: Alpha Growth',
      status: 'resolved',
      assignedTo: 'Compliance Manager',
    },
  ];

  // Mock Regulation Checks
  const regulations: RegulationCheck[] = [
    {
      id: 'REG001',
      regulation: 'SEC Rule 17a-4',
      description: 'Electronic record retention requirements',
      status: 'compliant',
      lastCheck: '2024-11-01',
      nextCheck: '2024-12-01',
    },
    {
      id: 'REG002',
      regulation: 'AML/KYC Policy',
      description: 'Anti-Money Laundering and Know Your Customer procedures',
      status: 'compliant',
      lastCheck: '2024-11-05',
      nextCheck: '2024-11-19',
    },
    {
      id: 'REG003',
      regulation: 'GDPR Compliance',
      description: 'General Data Protection Regulation',
      status: 'review-needed',
      lastCheck: '2024-10-15',
      nextCheck: '2024-11-15',
    },
    {
      id: 'REG004',
      regulation: 'Accredited Investor Verification',
      description: 'Verification of accredited investor status',
      status: 'compliant',
      lastCheck: '2024-11-08',
      nextCheck: '2024-12-08',
    },
    {
      id: 'REG005',
      regulation: 'Trade Reporting (EMIR)',
      description: 'European Market Infrastructure Regulation reporting',
      status: 'non-compliant',
      lastCheck: '2024-11-07',
      nextCheck: '2024-11-14',
    },
  ];

  const getSeverityConfig = (severity: ComplianceAlert['severity']) => {
    const config = {
      critical: { color: 'error', icon: <ExclamationCircleOutlined />, text: 'CRITICAL' },
      warning: { color: 'warning', icon: <WarningOutlined />, text: 'WARNING' },
      info: { color: 'info', icon: <InfoCircleOutlined />, text: 'INFO' },
    };
    return config[severity];
  };

  const getStatusTag = (status: ComplianceAlert['status']) => {
    const config = {
      open: { color: 'red', text: 'Open' },
      investigating: { color: 'orange', text: 'Investigating' },
      resolved: { color: 'green', text: 'Resolved' },
    };
    const c = config[status];
    return <Tag color={c.color}>{c.text}</Tag>;
  };

  const getRegulationStatus = (status: RegulationCheck['status']) => {
    const config = {
      compliant: { color: 'success', icon: <CheckCircleOutlined />, text: 'Compliant' },
      'non-compliant': { color: 'error', icon: <ExclamationCircleOutlined />, text: 'Non-Compliant' },
      'review-needed': { color: 'warning', icon: <WarningOutlined />, text: 'Review Needed' },
    };
    const c = config[status];
    return (
      <Tag color={c.color} icon={c.icon}>
        {c.text}
      </Tag>
    );
  };

  const alertColumns: ColumnType<ComplianceAlert>[] = [
    {
      title: 'Alert ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: 'Date & Time',
      dataIndex: 'date',
      key: 'date',
      width: 180,
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      width: 130,
      render: (severity: ComplianceAlert['severity']) => {
        const config = getSeverityConfig(severity);
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
      filters: [
        { text: 'Critical', value: 'critical' },
        { text: 'Warning', value: 'warning' },
        { text: 'Info', value: 'info' },
      ],
      onFilter: (value, record) => record.severity === value,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 150,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 300,
    },
    {
      title: 'Affected Entity',
      dataIndex: 'affectedEntity',
      key: 'affectedEntity',
      width: 200,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: getStatusTag,
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      width: 180,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render: (_: any, record: ComplianceAlert) => (
        <Space>
          <Button type="link" size="small">
            View
          </Button>
          {record.status !== 'resolved' && (
            <Button type="link" size="small" danger>
              Resolve
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const regulationColumns: ColumnType<RegulationCheck>[] = [
    {
      title: 'Regulation',
      dataIndex: 'regulation',
      key: 'regulation',
      width: 200,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 350,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 180,
      render: getRegulationStatus,
    },
    {
      title: 'Last Check',
      dataIndex: 'lastCheck',
      key: 'lastCheck',
      width: 130,
    },
    {
      title: 'Next Check',
      dataIndex: 'nextCheck',
      key: 'nextCheck',
      width: 130,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: () => (
        <Button type="link" size="small">
          Run Check
        </Button>
      ),
    },
  ];

  const filteredAlerts = alerts.filter((alert) => {
    const severityMatch = filterSeverity === 'all' || alert.severity === filterSeverity;
    const statusMatch = filterStatus === 'all' || alert.status === filterStatus;
    return severityMatch && statusMatch;
  });

  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
  const openAlertsCount = alerts.filter((a) => a.status === 'open' || a.status === 'investigating').length;
  const complianceScore = (regulations.filter((r) => r.status === 'compliant').length / regulations.length) * 100;

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Sansation, sans-serif', fontSize: '32px', marginBottom: '8px' }}>
          Compliance Dashboard
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Monitor regulatory compliance and manage alerts
        </p>
      </div>

      {/* Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Critical Alerts"
            value={criticalCount}
            icon={<ExclamationCircleOutlined />}
            color="#ff4d4f"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Open Alerts"
            value={openAlertsCount}
            icon={<BellOutlined />}
            color="#faad14"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Regulations"
            value={regulations.length}
            icon={<FileTextOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="professional-card">
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', color: '#666' }}>Compliance Score</span>
            </div>
            <Progress
              type="circle"
              percent={complianceScore}
              size={80}
              strokeColor={{
                '0%': complianceScore >= 80 ? '#52c41a' : complianceScore >= 60 ? '#faad14' : '#ff4d4f',
                '100%': complianceScore >= 80 ? '#95de64' : complianceScore >= 60 ? '#ffd666' : '#ff7875',
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Compliance Alerts */}
      <Card
        className="professional-card"
        title={
          <Space>
            <SafetyOutlined />
            <span>Compliance Alerts</span>
          </Space>
        }
        extra={
          <Space>
            <Select
              style={{ width: 150 }}
              placeholder="Severity"
              value={filterSeverity}
              onChange={setFilterSeverity}
              options={[
                { label: 'All Severity', value: 'all' },
                { label: 'Critical', value: 'critical' },
                { label: 'Warning', value: 'warning' },
                { label: 'Info', value: 'info' },
              ]}
            />
            <Select
              style={{ width: 150 }}
              placeholder="Status"
              value={filterStatus}
              onChange={setFilterStatus}
              options={[
                { label: 'All Status', value: 'all' },
                { label: 'Open', value: 'open' },
                { label: 'Investigating', value: 'investigating' },
                { label: 'Resolved', value: 'resolved' },
              ]}
            />
          </Space>
        }
        style={{ marginBottom: '24px' }}
      >
        <Table
          columns={alertColumns}
          dataSource={filteredAlerts}
          rowKey="id"
          scroll={{ x: 1400 }}
          pagination={{
            pageSize: 5,
            showTotal: (total) => `Total ${total} alerts`,
          }}
        />
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          {/* Regulatory Checks */}
          <Card
            className="professional-card"
            title={
              <Space>
                <AuditOutlined />
                <span>Regulatory Compliance Checks</span>
              </Space>
            }
          >
            <Table
              columns={regulationColumns}
              dataSource={regulations}
              rowKey="id"
              scroll={{ x: 1000 }}
              pagination={false}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          {/* Recent Activity Timeline */}
          <Card
            className="professional-card"
            title="Recent Compliance Activity"
            style={{ marginBottom: '16px' }}
          >
            <Timeline
              items={[
                {
                  dot: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
                  children: (
                    <>
                      <div style={{ fontWeight: 500 }}>Trade Limit Alert Resolved</div>
                      <div style={{ fontSize: '12px', color: '#999' }}>2 hours ago</div>
                    </>
                  ),
                },
                {
                  dot: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
                  children: (
                    <>
                      <div style={{ fontWeight: 500 }}>AML Alert Raised</div>
                      <div style={{ fontSize: '12px', color: '#999' }}>3 hours ago</div>
                    </>
                  ),
                },
                {
                  dot: <InfoCircleOutlined style={{ color: '#1890ff' }} />,
                  children: (
                    <>
                      <div style={{ fontWeight: 500 }}>Regulatory Update</div>
                      <div style={{ fontSize: '12px', color: '#999' }}>5 hours ago</div>
                    </>
                  ),
                },
                {
                  dot: <WarningOutlined style={{ color: '#faad14' }} />,
                  children: (
                    <>
                      <div style={{ fontWeight: 500 }}>KYC Expiration Warning</div>
                      <div style={{ fontSize: '12px', color: '#999' }}>6 hours ago</div>
                    </>
                  ),
                },
              ]}
            />
          </Card>

          {/* Upcoming Reviews */}
          <Card className="professional-card" title="Upcoming Compliance Reviews">
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Alert
                message="GDPR Compliance Review"
                description="Due: November 15, 2024"
                type="warning"
                showIcon
                icon={<WarningOutlined />}
              />
              <Alert
                message="AML/KYC Policy Check"
                description="Due: November 19, 2024"
                type="info"
                showIcon
                icon={<InfoCircleOutlined />}
              />
              <Alert
                message="Trade Reporting (EMIR)"
                description="Due: November 14, 2024"
                type="error"
                showIcon
                icon={<ExclamationCircleOutlined />}
              />
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
