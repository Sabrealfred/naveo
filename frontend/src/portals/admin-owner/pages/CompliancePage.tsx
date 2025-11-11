import { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Table,
  Tag,
  Button,
  Space,
  Tabs,
  Badge,
  Statistic,
  Timeline,
  Modal,
  Form,
  Input,
  Select,
  message,
  Descriptions,
  Alert,
  Drawer,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  SafetyCertificateOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  FileTextOutlined,
  FilterOutlined,
  AlertOutlined,
  BankOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { KYBVerificationModal } from '../../../components/modals';

interface KYCApplication {
  id: string;
  userId: string;
  userName: string;
  email: string;
  tier: number;
  status: 'pending' | 'approved' | 'rejected' | 'needs_review';
  submittedAt: string;
  reviewedAt?: string;
  riskScore: number;
  pepCheck: boolean;
  sanctionsCheck: boolean;
  verificationLevel: string;
}

interface KYBApplication {
  id: string;
  organizationId: string;
  organizationName: string;
  organizationType: string;
  tier: number;
  status: 'pending' | 'approved' | 'rejected' | 'needs_review';
  submittedAt: string;
  reviewedAt?: string;
  riskScore: number;
  riskLevel: string;
  jurisdiction: string;
}

interface RiskAlert {
  id: string;
  type: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved';
  title: string;
  description: string;
  userName?: string;
  createdAt: string;
  assignedTo?: string;
}

interface SystemEvent {
  id: string;
  eventType: string;
  category: string;
  severity: string;
  userName: string;
  title: string;
  description: string;
  createdAt: string;
}

const ComplianceDashboardPage = () => {
  const { t } = useTranslation();
  const [selectedKYC, setSelectedKYC] = useState<KYCApplication | null>(null);
  const [selectedKYB, setSelectedKYBApplication] = useState<KYBApplication | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<RiskAlert | null>(null);
  const [kycModalVisible, setKycModalVisible] = useState(false);
  const [kybModalVisible, setKybModalVisible] = useState(false);
  const [alertDrawerVisible, setAlertDrawerVisible] = useState(false);
  const [reviewForm] = Form.useForm();

  // Mock data - KYC Applications
  const kycApplications: KYCApplication[] = [
    {
      id: 'kyc-001',
      userId: 'user-001',
      userName: 'John Investor',
      email: 'john@example.com',
      tier: 2,
      status: 'pending',
      submittedAt: '2024-11-10 14:30',
      riskScore: 35,
      pepCheck: false,
      sanctionsCheck: false,
      verificationLevel: 'enhanced_due_diligence',
    },
    {
      id: 'kyc-002',
      userId: 'user-002',
      userName: 'Sarah Khan',
      email: 'sarah@example.com',
      tier: 3,
      status: 'needs_review',
      submittedAt: '2024-11-09 10:15',
      riskScore: 72,
      pepCheck: true,
      sanctionsCheck: false,
      verificationLevel: 'enhanced_due_diligence',
    },
    {
      id: 'kyc-003',
      userId: 'user-003',
      userName: 'Michael Chen',
      email: 'michael@example.com',
      tier: 1,
      status: 'approved',
      submittedAt: '2024-11-08 09:00',
      reviewedAt: '2024-11-08 16:30',
      riskScore: 15,
      pepCheck: false,
      sanctionsCheck: false,
      verificationLevel: 'identity_only',
    },
  ];

  // Mock data - KYB Applications
  const kybApplications: KYBApplication[] = [
    {
      id: 'kyb-001',
      organizationId: 'org-001',
      organizationName: 'Acme Investment Fund LLC',
      organizationType: 'fund',
      tier: 2,
      status: 'pending',
      submittedAt: '2024-11-09 11:00',
      riskScore: 45,
      riskLevel: 'medium',
      jurisdiction: 'US',
    },
    {
      id: 'kyb-002',
      organizationId: 'org-002',
      organizationName: 'Global Crypto Ventures Ltd',
      organizationType: 'corporation',
      tier: 3,
      status: 'needs_review',
      submittedAt: '2024-11-07 15:30',
      riskScore: 68,
      riskLevel: 'high',
      jurisdiction: 'SG',
    },
  ];

  // Mock data - Risk Alerts
  const riskAlerts: RiskAlert[] = [
    {
      id: 'alert-001',
      type: 'high_risk_kyc',
      category: 'aml',
      severity: 'high',
      status: 'open',
      title: 'High Risk KYC Application',
      description: 'PEP check flagged for enhanced due diligence',
      userName: 'Sarah Khan',
      createdAt: '2024-11-09 10:30',
      assignedTo: 'Compliance Officer 1',
    },
    {
      id: 'alert-002',
      type: 'kyc_expiring',
      category: 'kyc',
      severity: 'medium',
      status: 'open',
      title: 'KYC Expiring Soon',
      description: 'KYC verification expires in 15 days',
      userName: 'Thomas Wright',
      createdAt: '2024-11-10 08:00',
    },
    {
      id: 'alert-003',
      type: 'high_value_transaction',
      category: 'transaction',
      severity: 'medium',
      status: 'investigating',
      title: 'High Value Transaction',
      description: 'Transaction of $150,000 requires review',
      userName: 'Alice Johnson',
      createdAt: '2024-11-10 12:45',
      assignedTo: 'Compliance Officer 2',
    },
  ];

  // Mock data - System Events
  const systemEvents: SystemEvent[] = [
    {
      id: 'event-001',
      eventType: 'kyc_submitted',
      category: 'kyc',
      severity: 'info',
      userName: 'John Investor',
      title: 'KYC Application Submitted',
      description: 'Tier 2 KYC verification submitted',
      createdAt: '2024-11-10 14:30',
    },
    {
      id: 'event-002',
      eventType: 'kyc_approved',
      category: 'kyc',
      severity: 'info',
      userName: 'Michael Chen',
      title: 'KYC Application Approved',
      description: 'Tier 1 KYC verification approved by Admin',
      createdAt: '2024-11-08 16:30',
    },
    {
      id: 'event-003',
      eventType: 'risk_alert_created',
      category: 'compliance',
      severity: 'warning',
      userName: 'System',
      title: 'Risk Alert Created',
      description: 'High risk KYC application detected',
      createdAt: '2024-11-09 10:30',
    },
  ];

  // KYC Columns
  const kycColumns: ColumnsType<KYCApplication> = [
    {
      title: t('compliance.columns.applicant', 'Applicant'),
      dataIndex: 'userName',
      key: 'userName',
      render: (text: string, record: KYCApplication) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{record.email}</div>
        </div>
      ),
    },
    {
      title: t('compliance.columns.tier', 'Tier'),
      dataIndex: 'tier',
      key: 'tier',
      render: (tier: number) => (
        <Tag color={tier === 3 ? 'gold' : tier === 2 ? 'blue' : 'default'}>
          {t(`compliance.tier${tier}`, `Tier ${tier}`)}
        </Tag>
      ),
    },
    {
      title: t('compliance.columns.status', 'Status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          pending: 'processing',
          approved: 'success',
          rejected: 'error',
          needs_review: 'warning',
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: t('compliance.columns.riskScore', 'Risk Score'),
      dataIndex: 'riskScore',
      key: 'riskScore',
      render: (score: number) => (
        <div>
          <span style={{ fontWeight: 500, color: score > 70 ? '#ff4d4f' : score > 40 ? '#faad14' : '#52c41a' }}>
            {score}/100
          </span>
        </div>
      ),
    },
    {
      title: t('compliance.columns.flags', 'Flags'),
      key: 'flags',
      render: (_, record: KYCApplication) => (
        <Space size={4}>
          {record.pepCheck && <Tag color="red">PEP</Tag>}
          {record.sanctionsCheck && <Tag color="red">Sanctions</Tag>}
        </Space>
      ),
    },
    {
      title: t('compliance.columns.submitted', 'Submitted'),
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      sorter: (a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime(),
    },
    {
      title: t('common.actions', 'Actions'),
      key: 'actions',
      render: (_, record: KYCApplication) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedKYC(record);
              setKycModalVisible(true);
            }}
          >
            {t('common.review', 'Review')}
          </Button>
        </Space>
      ),
    },
  ];

  // KYB Columns
  const kybColumns: ColumnsType<KYBApplication> = [
    {
      title: t('compliance.columns.organization', 'Organization'),
      dataIndex: 'organizationName',
      key: 'organizationName',
      render: (text: string, record: KYBApplication) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{record.organizationType}</div>
        </div>
      ),
    },
    {
      title: t('compliance.columns.tier', 'Tier'),
      dataIndex: 'tier',
      key: 'tier',
      render: (tier: number) => (
        <Tag color={tier === 3 ? 'gold' : tier === 2 ? 'blue' : 'default'}>
          KYB Tier {tier}
        </Tag>
      ),
    },
    {
      title: t('compliance.columns.jurisdiction', 'Jurisdiction'),
      dataIndex: 'jurisdiction',
      key: 'jurisdiction',
    },
    {
      title: t('compliance.columns.riskLevel', 'Risk Level'),
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      render: (level: string) => {
        const colors: Record<string, string> = {
          low: 'success',
          medium: 'warning',
          high: 'error',
          critical: 'error',
        };
        return <Tag color={colors[level]}>{level.toUpperCase()}</Tag>;
      },
    },
    {
      title: t('compliance.columns.status', 'Status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          pending: 'processing',
          approved: 'success',
          rejected: 'error',
          needs_review: 'warning',
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: t('compliance.columns.submitted', 'Submitted'),
      dataIndex: 'submittedAt',
      key: 'submittedAt',
    },
    {
      title: t('common.actions', 'Actions'),
      key: 'actions',
      render: (_, record: KYBApplication) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedKYBApplication(record);
              setKybModalVisible(true);
            }}
          >
            {t('common.review', 'Review')}
          </Button>
        </Space>
      ),
    },
  ];

  // Risk Alerts Columns
  const alertColumns: ColumnsType<RiskAlert> = [
    {
      title: t('compliance.columns.severity', 'Severity'),
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: string) => {
        const colors: Record<string, string> = {
          low: 'default',
          medium: 'warning',
          high: 'error',
          critical: 'error',
        };
        return <Tag color={colors[severity]}>{severity.toUpperCase()}</Tag>;
      },
    },
    {
      title: t('compliance.columns.title', 'Title'),
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: RiskAlert) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{record.description}</div>
        </div>
      ),
    },
    {
      title: t('compliance.columns.category', 'Category'),
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag>{category.toUpperCase()}</Tag>,
    },
    {
      title: t('compliance.columns.user', 'User'),
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: t('compliance.columns.status', 'Status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          open: 'processing',
          investigating: 'warning',
          resolved: 'success',
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: t('compliance.columns.assignedTo', 'Assigned To'),
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      render: (assignedTo?: string) => assignedTo || '-',
    },
    {
      title: t('common.actions', 'Actions'),
      key: 'actions',
      render: (_, record: RiskAlert) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedAlert(record);
              setAlertDrawerVisible(true);
            }}
          >
            {t('common.view', 'View')}
          </Button>
        </Space>
      ),
    },
  ];

  const handleApproveKYC = async (application: KYCApplication) => {
    try {
      // Mock approval
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success(t('compliance.messages.kycApproved', 'KYC application approved'));
      setKycModalVisible(false);
    } catch (error) {
      message.error(t('compliance.messages.kycApprovalFailed', 'Failed to approve KYC'));
    }
  };

  const handleRejectKYC = async (application: KYCApplication, reason: string) => {
    try {
      // Mock rejection
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success(t('compliance.messages.kycRejected', 'KYC application rejected'));
      setKycModalVisible(false);
    } catch (error) {
      message.error(t('compliance.messages.kycRejectionFailed', 'Failed to reject KYC'));
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
          {t('compliance.title', 'Compliance & Regulatory Dashboard')}
        </h1>
        <p style={{ color: '#999' }}>
          {t('compliance.subtitle', 'Manage KYC/KYB verifications, risk alerts, and compliance monitoring')}
        </p>
      </div>

      {/* Overview Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title={t('compliance.metrics.pendingKYC', 'Pending KYC')}
              value={kycApplications.filter((a) => a.status === 'pending').length}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title={t('compliance.metrics.pendingKYB', 'Pending KYB')}
              value={kybApplications.filter((a) => a.status === 'pending').length}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title={t('compliance.metrics.openAlerts', 'Open Alerts')}
              value={riskAlerts.filter((a) => a.status === 'open').length}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title={t('compliance.metrics.highRiskUsers', 'High Risk Users')}
              value={kycApplications.filter((a) => a.riskScore > 70).length}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content Tabs */}
      <Card bordered={false}>
        <Tabs
          defaultActiveKey="kyc"
          items={[
            {
              key: 'kyc',
              label: (
                <span>
                  <SafetyCertificateOutlined />
                  {t('compliance.tabs.kycApplications', 'KYC Applications')} (
                  {kycApplications.filter((a) => a.status === 'pending' || a.status === 'needs_review').length})
                </span>
              ),
              children: (
                <div>
                  <div style={{ marginBottom: 16 }}>
                    <Space>
                      <Button icon={<FilterOutlined />}>
                        {t('common.filter', 'Filter')}
                      </Button>
                    </Space>
                  </div>
                  <Table
                    columns={kycColumns}
                    dataSource={kycApplications}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                  />
                </div>
              ),
            },
            {
              key: 'kyb',
              label: (
                <span>
                  <BankOutlined />
                  {t('compliance.tabs.kybApplications', 'KYB Applications')} (
                  {kybApplications.filter((a) => a.status === 'pending' || a.status === 'needs_review').length})
                </span>
              ),
              children: (
                <div>
                  <div style={{ marginBottom: 16 }}>
                    <Space>
                      <Button icon={<FilterOutlined />}>
                        {t('common.filter', 'Filter')}
                      </Button>
                    </Space>
                  </div>
                  <Table
                    columns={kybColumns}
                    dataSource={kybApplications}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                  />
                </div>
              ),
            },
            {
              key: 'alerts',
              label: (
                <Badge count={riskAlerts.filter((a) => a.status === 'open').length} offset={[10, 0]}>
                  <span>
                    <AlertOutlined />
                    {t('compliance.tabs.riskAlerts', 'Risk Alerts')}
                  </span>
                </Badge>
              ),
              children: (
                <div>
                  <Alert
                    message={t('compliance.alerts.criticalAlerts', 'Critical Alerts Require Attention')}
                    description={t(
                      'compliance.alerts.criticalAlertsDesc',
                      `You have ${riskAlerts.filter((a) => a.severity === 'critical').length} critical alerts that require immediate attention.`
                    )}
                    type="warning"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                  <Table
                    columns={alertColumns}
                    dataSource={riskAlerts}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                  />
                </div>
              ),
            },
            {
              key: 'audit',
              label: (
                <span>
                  <FileTextOutlined />
                  {t('compliance.tabs.auditTrail', 'Audit Trail')}
                </span>
              ),
              children: (
                <div>
                  <Timeline
                    items={systemEvents.map((event) => ({
                      color: event.severity === 'warning' ? 'orange' : event.severity === 'error' ? 'red' : 'blue',
                      children: (
                        <div>
                          <div style={{ fontWeight: 500 }}>{event.title}</div>
                          <div style={{ fontSize: 12, color: '#999' }}>{event.description}</div>
                          <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                            {event.userName} • {event.createdAt}
                          </div>
                        </div>
                      ),
                    }))}
                  />
                </div>
              ),
            },
          ]}
        />
      </Card>

      {/* KYC Review Modal */}
      <Modal
        title={t('compliance.modals.reviewKYC', 'Review KYC Application')}
        open={kycModalVisible}
        onCancel={() => setKycModalVisible(false)}
        width={800}
        footer={null}
      >
        {selectedKYC && (
          <div>
            <Descriptions column={2} bordered>
              <Descriptions.Item label={t('compliance.fields.applicant', 'Applicant')}>
                {selectedKYC.userName}
              </Descriptions.Item>
              <Descriptions.Item label={t('compliance.fields.email', 'Email')}>
                {selectedKYC.email}
              </Descriptions.Item>
              <Descriptions.Item label={t('compliance.fields.tier', 'Tier')}>
                <Tag color={selectedKYC.tier === 3 ? 'gold' : selectedKYC.tier === 2 ? 'blue' : 'default'}>
                  Tier {selectedKYC.tier}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t('compliance.fields.riskScore', 'Risk Score')}>
                <span style={{ color: selectedKYC.riskScore > 70 ? '#ff4d4f' : selectedKYC.riskScore > 40 ? '#faad14' : '#52c41a' }}>
                  {selectedKYC.riskScore}/100
                </span>
              </Descriptions.Item>
              <Descriptions.Item label={t('compliance.fields.pepCheck', 'PEP Check')}>
                <Tag color={selectedKYC.pepCheck ? 'red' : 'green'}>
                  {selectedKYC.pepCheck ? 'FLAGGED' : 'CLEAR'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t('compliance.fields.sanctionsCheck', 'Sanctions Check')}>
                <Tag color={selectedKYC.sanctionsCheck ? 'red' : 'green'}>
                  {selectedKYC.sanctionsCheck ? 'FLAGGED' : 'CLEAR'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t('compliance.fields.submittedAt', 'Submitted At')} span={2}>
                {selectedKYC.submittedAt}
              </Descriptions.Item>
            </Descriptions>

            {selectedKYC.pepCheck && (
              <Alert
                message={t('compliance.warnings.pepFlag', 'PEP Flag Detected')}
                description={t(
                  'compliance.warnings.pepFlagDesc',
                  'This applicant is flagged as a Politically Exposed Person. Enhanced due diligence is required.'
                )}
                type="error"
                showIcon
                style={{ marginTop: 16 }}
              />
            )}

            <Form form={reviewForm} layout="vertical" style={{ marginTop: 24 }}>
              <Form.Item
                name="decision"
                label={t('compliance.fields.decision', 'Decision')}
                rules={[{ required: true }]}
              >
                <Select size="large">
                  <Select.Option value="approve">
                    {t('compliance.options.approve', 'Approve')}
                  </Select.Option>
                  <Select.Option value="reject">
                    {t('compliance.options.reject', 'Reject')}
                  </Select.Option>
                  <Select.Option value="request_more_info">
                    {t('compliance.options.requestMoreInfo', 'Request More Information')}
                  </Select.Option>
                </Select>
              </Form.Item>

              <Form.Item name="notes" label={t('compliance.fields.notes', 'Review Notes')}>
                <Input.TextArea rows={4} placeholder={t('compliance.placeholders.addNotes', 'Add your review notes...')} />
              </Form.Item>
            </Form>

            <Space style={{ marginTop: 16, width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setKycModalVisible(false)}>
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button
                danger
                icon={<CloseOutlined />}
                onClick={() => handleRejectKYC(selectedKYC, 'Rejected by compliance')}
              >
                {t('common.reject', 'Reject')}
              </Button>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => handleApproveKYC(selectedKYC)}
              >
                {t('common.approve', 'Approve')}
              </Button>
            </Space>
          </div>
        )}
      </Modal>

      {/* KYB Review Modal */}
      <Modal
        title={t('compliance.modals.reviewKYB', 'Review KYB Application')}
        open={kybModalVisible}
        onCancel={() => setKybModalVisible(false)}
        width={800}
        footer={null}
      >
        {selectedKYB && (
          <div>
            <Descriptions column={2} bordered>
              <Descriptions.Item label={t('compliance.fields.organization', 'Organization')}>
                {selectedKYB.organizationName}
              </Descriptions.Item>
              <Descriptions.Item label={t('compliance.fields.type', 'Type')}>
                {selectedKYB.organizationType}
              </Descriptions.Item>
              <Descriptions.Item label={t('compliance.fields.jurisdiction', 'Jurisdiction')}>
                {selectedKYB.jurisdiction}
              </Descriptions.Item>
              <Descriptions.Item label={t('compliance.fields.tier', 'Tier')}>
                <Tag>KYB Tier {selectedKYB.tier}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t('compliance.fields.riskLevel', 'Risk Level')}>
                <Tag color={selectedKYB.riskLevel === 'high' ? 'error' : 'warning'}>
                  {selectedKYB.riskLevel.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t('compliance.fields.riskScore', 'Risk Score')}>
                {selectedKYB.riskScore}/100
              </Descriptions.Item>
            </Descriptions>

            <Space style={{ marginTop: 24, width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setKybModalVisible(false)}>
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button danger icon={<CloseOutlined />}>
                {t('common.reject', 'Reject')}
              </Button>
              <Button type="primary" icon={<CheckOutlined />}>
                {t('common.approve', 'Approve')}
              </Button>
            </Space>
          </div>
        )}
      </Modal>

      {/* Risk Alert Drawer */}
      <Drawer
        title={t('compliance.drawers.alertDetails', 'Alert Details')}
        placement="right"
        width={600}
        open={alertDrawerVisible}
        onClose={() => setAlertDrawerVisible(false)}
      >
        {selectedAlert && (
          <div>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Tag
                  color={
                    selectedAlert.severity === 'critical'
                      ? 'error'
                      : selectedAlert.severity === 'high'
                      ? 'error'
                      : selectedAlert.severity === 'medium'
                      ? 'warning'
                      : 'default'
                  }
                >
                  {selectedAlert.severity.toUpperCase()}
                </Tag>
                <Tag>{selectedAlert.category.toUpperCase()}</Tag>
              </div>

              <div>
                <h3>{selectedAlert.title}</h3>
                <p style={{ color: '#666' }}>{selectedAlert.description}</p>
              </div>

              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label={t('compliance.fields.user', 'User')}>
                  {selectedAlert.userName || '-'}
                </Descriptions.Item>
                <Descriptions.Item label={t('compliance.fields.status', 'Status')}>
                  <Tag color={selectedAlert.status === 'open' ? 'processing' : 'warning'}>
                    {selectedAlert.status.toUpperCase()}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label={t('compliance.fields.assignedTo', 'Assigned To')}>
                  {selectedAlert.assignedTo || t('compliance.values.unassigned', 'Unassigned')}
                </Descriptions.Item>
                <Descriptions.Item label={t('compliance.fields.createdAt', 'Created At')}>
                  {selectedAlert.createdAt}
                </Descriptions.Item>
              </Descriptions>

              <div>
                <h4>{t('compliance.sections.actions', 'Actions')}</h4>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button type="primary" block>
                    {t('compliance.actions.investigate', 'Mark as Investigating')}
                  </Button>
                  <Button block>{t('compliance.actions.assign', 'Assign to Officer')}</Button>
                  <Button block>{t('compliance.actions.resolve', 'Resolve Alert')}</Button>
                  <Button danger block>
                    {t('compliance.actions.escalate', 'Escalate')}
                  </Button>
                </Space>
              </div>
            </Space>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default ComplianceDashboardPage;
