import { useState } from 'react';
import { Row, Col, Card, Table, Tag, Button, Space, Progress, Tabs, Modal, Select, Input, Alert, Statistic, Badge } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  FileTextOutlined,
  SafetyOutlined,
  UserOutlined,
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { ActivityTimeline, ProgressRing } from '../../../components/common';
import type { TabsProps } from 'antd';

const { TextArea } = Input;

interface InvestorKYC {
  key: string;
  investorId: string;
  name: string;
  email: string;
  type: 'individual' | 'business';
  kycStatus: 'pending' | 'approved' | 'rejected' | 'review' | 'expired' | 'incomplete';
  kycLevel: number;
  riskLevel: 'low' | 'medium' | 'high';
  submittedAt: string;
  verifiedAt?: string;
  expiryDate?: string;
  documents: number;
  amlStatus: 'clear' | 'flagged' | 'pending' | 'review';
  pepMatch: boolean;
  sanctionsMatch: boolean;
  investmentAmount: string;
  lastReview?: string;
}

const KYCManagementPage = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState<InvestorKYC | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');

  // Mock data for investors
  const investorsData: InvestorKYC[] = [
    {
      key: '1',
      investorId: 'INV-001',
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      type: 'individual',
      kycStatus: 'pending',
      kycLevel: 2,
      riskLevel: 'low',
      submittedAt: '2024-11-08',
      documents: 3,
      amlStatus: 'clear',
      pepMatch: false,
      sanctionsMatch: false,
      investmentAmount: '$150,000',
    },
    {
      key: '2',
      investorId: 'INV-002',
      name: 'Venture Capital Partners LLC',
      email: 'contact@vcpartners.com',
      type: 'business',
      kycStatus: 'review',
      kycLevel: 3,
      riskLevel: 'medium',
      submittedAt: '2024-11-07',
      documents: 8,
      amlStatus: 'review',
      pepMatch: true,
      sanctionsMatch: false,
      investmentAmount: '$2,500,000',
      lastReview: '2024-11-09',
    },
    {
      key: '3',
      investorId: 'INV-003',
      name: 'Sarah Williams',
      email: 'sarah.w@email.com',
      type: 'individual',
      kycStatus: 'approved',
      kycLevel: 2,
      riskLevel: 'low',
      submittedAt: '2024-10-25',
      verifiedAt: '2024-10-26',
      expiryDate: '2025-10-26',
      documents: 4,
      amlStatus: 'clear',
      pepMatch: false,
      sanctionsMatch: false,
      investmentAmount: '$75,000',
    },
    {
      key: '4',
      investorId: 'INV-004',
      name: 'Global Holdings Inc',
      email: 'compliance@globalholdings.com',
      type: 'business',
      kycStatus: 'approved',
      kycLevel: 3,
      riskLevel: 'low',
      submittedAt: '2024-10-15',
      verifiedAt: '2024-10-17',
      expiryDate: '2025-10-17',
      documents: 12,
      amlStatus: 'clear',
      pepMatch: false,
      sanctionsMatch: false,
      investmentAmount: '$5,000,000',
    },
    {
      key: '5',
      investorId: 'INV-005',
      name: 'Robert Thompson',
      email: 'r.thompson@email.com',
      type: 'individual',
      kycStatus: 'incomplete',
      kycLevel: 1,
      riskLevel: 'low',
      submittedAt: '2024-11-05',
      documents: 1,
      amlStatus: 'pending',
      pepMatch: false,
      sanctionsMatch: false,
      investmentAmount: '$25,000',
    },
    {
      key: '6',
      investorId: 'INV-006',
      name: 'Alexandra Petrov',
      email: 'a.petrov@email.com',
      type: 'individual',
      kycStatus: 'rejected',
      kycLevel: 2,
      riskLevel: 'high',
      submittedAt: '2024-11-01',
      documents: 3,
      amlStatus: 'flagged',
      pepMatch: true,
      sanctionsMatch: true,
      investmentAmount: '$500,000',
      lastReview: '2024-11-02',
    },
  ];

  // Filter data based on search and filters
  const filteredData = investorsData.filter(investor => {
    const matchesSearch =
      investor.name.toLowerCase().includes(searchText.toLowerCase()) ||
      investor.email.toLowerCase().includes(searchText.toLowerCase()) ||
      investor.investorId.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus = filterStatus === 'all' || investor.kycStatus === filterStatus;
    const matchesRisk = filterRisk === 'all' || investor.riskLevel === filterRisk;

    return matchesSearch && matchesStatus && matchesRisk;
  });

  // Calculate statistics
  const stats = {
    total: investorsData.length,
    pending: investorsData.filter(i => i.kycStatus === 'pending').length,
    approved: investorsData.filter(i => i.kycStatus === 'approved').length,
    review: investorsData.filter(i => i.kycStatus === 'review').length,
    rejected: investorsData.filter(i => i.kycStatus === 'rejected').length,
    incomplete: investorsData.filter(i => i.kycStatus === 'incomplete').length,
    amlFlagged: investorsData.filter(i => i.amlStatus === 'flagged').length,
    highRisk: investorsData.filter(i => i.riskLevel === 'high').length,
  };

  const kycColumns = [
    {
      title: 'Investor ID',
      dataIndex: 'investorId',
      key: 'investorId',
      width: 120,
      render: (text: string) => <span style={{ fontFamily: 'monospace' }}>{text}</span>,
    },
    {
      title: 'Investor',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: InvestorKYC) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{record.email}</div>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => (
        <Tag color={type === 'individual' ? 'blue' : 'purple'}>
          {type === 'individual' ? 'Individual' : 'Business'}
        </Tag>
      ),
    },
    {
      title: 'KYC Status',
      dataIndex: 'kycStatus',
      key: 'kycStatus',
      width: 130,
      render: (status: string) => {
        const config: Record<string, { color: string; icon: any; label: string }> = {
          approved: { color: 'success', icon: <CheckCircleOutlined />, label: 'Approved' },
          pending: { color: 'warning', icon: <ClockCircleOutlined />, label: 'Pending' },
          rejected: { color: 'error', icon: <CloseOutlined />, label: 'Rejected' },
          review: { color: 'processing', icon: <FileTextOutlined />, label: 'In Review' },
          expired: { color: 'default', icon: <ExclamationCircleOutlined />, label: 'Expired' },
          incomplete: { color: 'default', icon: <WarningOutlined />, label: 'Incomplete' },
        };
        return <Tag color={config[status].color} icon={config[status].icon}>{config[status].label}</Tag>;
      },
    },
    {
      title: 'AML',
      dataIndex: 'amlStatus',
      key: 'amlStatus',
      width: 100,
      render: (status: string, record: InvestorKYC) => {
        const config: Record<string, { color: string; label: string }> = {
          clear: { color: 'success', label: 'Clear' },
          flagged: { color: 'error', label: 'Flagged' },
          pending: { color: 'warning', label: 'Pending' },
          review: { color: 'processing', label: 'Review' },
        };
        return (
          <div>
            <Tag color={config[status].color}>{config[status].label}</Tag>
            {(record.pepMatch || record.sanctionsMatch) && (
              <div style={{ fontSize: 10, marginTop: 4 }}>
                {record.pepMatch && <Tag color="orange" style={{ fontSize: 10, padding: '0 4px' }}>PEP</Tag>}
                {record.sanctionsMatch && <Tag color="red" style={{ fontSize: 10, padding: '0 4px' }}>Sanctions</Tag>}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Risk Level',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      width: 100,
      render: (level: string) => {
        const colorMap: Record<string, string> = {
          low: 'green',
          medium: 'orange',
          high: 'red',
        };
        return <Tag color={colorMap[level]}>{level.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Investment',
      dataIndex: 'investmentAmount',
      key: 'investmentAmount',
      width: 120,
      render: (amount: string) => <span style={{ fontWeight: 500 }}>{amount}</span>,
    },
    {
      title: 'Submitted',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      width: 110,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: InvestorKYC) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            View
          </Button>
          {record.kycStatus === 'pending' && (
            <>
              <Button
                type="link"
                size="small"
                style={{ color: '#52c41a' }}
                icon={<CheckOutlined />}
                onClick={() => handleApprove(record)}
              >
                Approve
              </Button>
              <Button
                type="link"
                size="small"
                danger
                icon={<CloseOutlined />}
                onClick={() => handleReject(record)}
              >
                Reject
              </Button>
            </>
          )}
          {record.kycStatus === 'review' && (
            <Button
              type="link"
              size="small"
              icon={<FileTextOutlined />}
            >
              Review
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleViewDetails = (investor: InvestorKYC) => {
    setSelectedInvestor(investor);
    setDetailsModalVisible(true);
  };

  const handleApprove = (investor: InvestorKYC) => {
    setSelectedInvestor(investor);
    setApproveModalVisible(true);
  };

  const handleReject = (investor: InvestorKYC) => {
    setSelectedInvestor(investor);
    setRejectModalVisible(true);
  };

  const confirmApprove = () => {
    console.log('Approving KYC for:', selectedInvestor?.name);
    setApproveModalVisible(false);
    setSelectedInvestor(null);
  };

  const confirmReject = () => {
    console.log('Rejecting KYC for:', selectedInvestor?.name, 'Reason:', rejectionReason);
    setRejectModalVisible(false);
    setSelectedInvestor(null);
    setRejectionReason('');
  };

  // Compliance timeline events
  const timelineEvents = [
    {
      timestamp: '2024-11-09 14:30',
      title: 'KYC Submitted',
      description: 'Michael Chen submitted KYC documents',
      type: 'info' as const,
    },
    {
      timestamp: '2024-11-09 11:15',
      title: 'AML Alert',
      description: 'PEP match detected for Venture Capital Partners LLC',
      type: 'warning' as const,
    },
    {
      timestamp: '2024-11-08 16:45',
      title: 'KYC Approved',
      description: 'Sarah Williams KYC verification approved',
      type: 'success' as const,
    },
    {
      timestamp: '2024-11-07 10:20',
      title: 'Document Requested',
      description: 'Additional documents requested from Robert Thompson',
      type: 'info' as const,
    },
    {
      timestamp: '2024-11-06 09:00',
      title: 'KYC Rejected',
      description: 'Alexandra Petrov KYC rejected due to sanctions match',
      type: 'error' as const,
    },
  ];

  const tabItems: TabsProps['items'] = [
    {
      key: 'overview',
      label: 'Overview',
      children: (
        <div>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total Investors"
                  value={stats.total}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Pending Review"
                  value={stats.pending + stats.review}
                  valueStyle={{ color: '#faad14' }}
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Approved"
                  value={stats.approved}
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Badge count={stats.amlFlagged} offset={[-10, 10]}>
                  <Statistic
                    title="High Risk"
                    value={stats.highRisk}
                    valueStyle={{ color: '#ff4d4f' }}
                    prefix={<WarningOutlined />}
                  />
                </Badge>
              </Card>
            </Col>
          </Row>

          <Card
            title="KYC Status Distribution"
            style={{ marginBottom: 24 }}
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <div style={{ textAlign: 'center' }}>
                  <ProgressRing
                    percent={(stats.approved / stats.total) * 100}
                    strokeColor="#52c41a"
                  />
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontSize: 24, fontWeight: 'bold' }}>
                      {((stats.approved / stats.total) * 100).toFixed(1)}%
                    </div>
                    <div style={{ color: '#999' }}>Approval Rate</div>
                  </div>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  <div>
                    <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                      <span>Approved</span>
                      <span style={{ fontWeight: 500 }}>{stats.approved}</span>
                    </div>
                    <Progress percent={(stats.approved / stats.total) * 100} strokeColor="#52c41a" showInfo={false} />
                  </div>
                  <div>
                    <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                      <span>Pending</span>
                      <span style={{ fontWeight: 500 }}>{stats.pending}</span>
                    </div>
                    <Progress percent={(stats.pending / stats.total) * 100} strokeColor="#faad14" showInfo={false} />
                  </div>
                  <div>
                    <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                      <span>In Review</span>
                      <span style={{ fontWeight: 500 }}>{stats.review}</span>
                    </div>
                    <Progress percent={(stats.review / stats.total) * 100} strokeColor="#1890ff" showInfo={false} />
                  </div>
                  <div>
                    <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                      <span>Rejected</span>
                      <span style={{ fontWeight: 500 }}>{stats.rejected}</span>
                    </div>
                    <Progress percent={(stats.rejected / stats.total) * 100} strokeColor="#ff4d4f" showInfo={false} />
                  </div>
                </Space>
              </Col>
            </Row>
          </Card>
        </div>
      ),
    },
    {
      key: 'investors',
      label: (
        <span>
          All Investors
          {stats.pending > 0 && (
            <Badge count={stats.pending} style={{ marginLeft: 8 }} />
          )}
        </span>
      ),
      children: (
        <div>
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col xs={24} sm={12} md={8}>
                <Input
                  placeholder="Search by name, email, or ID"
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={12} sm={6} md={4}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Status"
                  value={filterStatus}
                  onChange={setFilterStatus}
                >
                  <Select.Option value="all">All Status</Select.Option>
                  <Select.Option value="pending">Pending</Select.Option>
                  <Select.Option value="review">In Review</Select.Option>
                  <Select.Option value="approved">Approved</Select.Option>
                  <Select.Option value="rejected">Rejected</Select.Option>
                  <Select.Option value="incomplete">Incomplete</Select.Option>
                </Select>
              </Col>
              <Col xs={12} sm={6} md={4}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Risk"
                  value={filterRisk}
                  onChange={setFilterRisk}
                >
                  <Select.Option value="all">All Risk</Select.Option>
                  <Select.Option value="low">Low</Select.Option>
                  <Select.Option value="medium">Medium</Select.Option>
                  <Select.Option value="high">High</Select.Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Space>
                  <Button icon={<FilterOutlined />}>Advanced Filters</Button>
                  <Button icon={<ReloadOutlined />}>Refresh</Button>
                </Space>
              </Col>
            </Row>
          </Card>

          <Card>
            <Table
              columns={kycColumns}
              dataSource={filteredData}
              scroll={{ x: 1400 }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} investors`,
              }}
            />
          </Card>
        </div>
      ),
    },
    {
      key: 'timeline',
      label: 'Compliance Timeline',
      children: (
        <Card>
          <ActivityTimeline events={timelineEvents} />
        </Card>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>
          <SafetyOutlined style={{ marginRight: 8 }} />
          KYC/AML Management
        </h1>
        <p style={{ color: '#666', marginBottom: 0 }}>
          Manage investor verification, compliance screening, and KYC approvals for your fund
        </p>
      </div>

      {stats.amlFlagged > 0 && (
        <Alert
          message="AML Alerts Require Attention"
          description={`${stats.amlFlagged} investor(s) have been flagged for AML review. Please review these cases immediately.`}
          type="warning"
          showIcon
          closable
          style={{ marginBottom: 24 }}
        />
      )}

      <Tabs
        activeKey={selectedTab}
        onChange={setSelectedTab}
        items={tabItems}
      />

      {/* Details Modal */}
      <Modal
        title={`Investor Details - ${selectedInvestor?.name}`}
        open={detailsModalVisible}
        onCancel={() => {
          setDetailsModalVisible(false);
          setSelectedInvestor(null);
        }}
        width={800}
        footer={[
          <Button key="close" onClick={() => setDetailsModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedInvestor && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ color: '#999', fontSize: 12 }}>Investor ID</div>
                  <div style={{ fontWeight: 500 }}>{selectedInvestor.investorId}</div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ color: '#999', fontSize: 12 }}>Type</div>
                  <Tag color={selectedInvestor.type === 'individual' ? 'blue' : 'purple'}>
                    {selectedInvestor.type === 'individual' ? 'Individual' : 'Business'}
                  </Tag>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ color: '#999', fontSize: 12 }}>KYC Status</div>
                  <div>{selectedInvestor.kycStatus.toUpperCase()}</div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ color: '#999', fontSize: 12 }}>Risk Level</div>
                  <Tag color={selectedInvestor.riskLevel === 'low' ? 'green' : selectedInvestor.riskLevel === 'medium' ? 'orange' : 'red'}>
                    {selectedInvestor.riskLevel.toUpperCase()}
                  </Tag>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ color: '#999', fontSize: 12 }}>AML Status</div>
                  <div>{selectedInvestor.amlStatus.toUpperCase()}</div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ color: '#999', fontSize: 12 }}>Investment Amount</div>
                  <div style={{ fontWeight: 500 }}>{selectedInvestor.investmentAmount}</div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ color: '#999', fontSize: 12 }}>Documents Uploaded</div>
                  <div>{selectedInvestor.documents} files</div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ color: '#999', fontSize: 12 }}>Submitted Date</div>
                  <div>{selectedInvestor.submittedAt}</div>
                </div>
              </Col>
            </Row>
            {(selectedInvestor.pepMatch || selectedInvestor.sanctionsMatch) && (
              <Alert
                message="AML Screening Alerts"
                description={
                  <div>
                    {selectedInvestor.pepMatch && <div>• PEP (Politically Exposed Person) match detected</div>}
                    {selectedInvestor.sanctionsMatch && <div>• Sanctions list match detected</div>}
                  </div>
                }
                type="warning"
                showIcon
                style={{ marginTop: 16 }}
              />
            )}
          </div>
        )}
      </Modal>

      {/* Approve Modal */}
      <Modal
        title="Approve KYC Verification"
        open={approveModalVisible}
        onOk={confirmApprove}
        onCancel={() => {
          setApproveModalVisible(false);
          setSelectedInvestor(null);
        }}
        okText="Approve"
        okButtonProps={{ type: 'primary', icon: <CheckOutlined /> }}
      >
        <p>Are you sure you want to approve the KYC verification for:</p>
        <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 4, marginTop: 16 }}>
          <div style={{ fontWeight: 500, fontSize: 16 }}>{selectedInvestor?.name}</div>
          <div style={{ color: '#666', marginTop: 4 }}>{selectedInvestor?.email}</div>
          <div style={{ marginTop: 8 }}>
            <Tag>Investment: {selectedInvestor?.investmentAmount}</Tag>
          </div>
        </div>
        <Alert
          message="This action will grant the investor access to invest in your fund"
          type="info"
          showIcon
          style={{ marginTop: 16 }}
        />
      </Modal>

      {/* Reject Modal */}
      <Modal
        title="Reject KYC Verification"
        open={rejectModalVisible}
        onOk={confirmReject}
        onCancel={() => {
          setRejectModalVisible(false);
          setSelectedInvestor(null);
          setRejectionReason('');
        }}
        okText="Reject"
        okButtonProps={{ danger: true, icon: <CloseOutlined /> }}
      >
        <p>You are about to reject the KYC verification for:</p>
        <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 4, marginTop: 16, marginBottom: 16 }}>
          <div style={{ fontWeight: 500, fontSize: 16 }}>{selectedInvestor?.name}</div>
          <div style={{ color: '#666', marginTop: 4 }}>{selectedInvestor?.email}</div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>Rejection Reason *</div>
          <TextArea
            rows={4}
            placeholder="Please provide a detailed reason for rejection..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </div>
        <Alert
          message="The investor will be notified of this rejection"
          type="warning"
          showIcon
        />
      </Modal>
    </div>
  );
};

export default KYCManagementPage;
