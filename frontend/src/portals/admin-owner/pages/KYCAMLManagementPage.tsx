import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Image,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
  Input,
  message,
  Progress,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
  SafetyOutlined,
  SearchOutlined,
  UserOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Line } from '@ant-design/charts';
import { StatCard } from '../../../components/common';

const { Title, Text } = Typography;

type KYCStatus = 'pending' | 'approved' | 'rejected' | 'needs-review';
type KYCTier = 'tier-1' | 'tier-2' | 'tier-3';
type AMLRiskLevel = 'low' | 'medium' | 'high' | 'critical';

interface InvestorKYC {
  id: string;
  name: string;
  email: string;
  submittedDate: string;
  status: KYCStatus;
  tier: KYCTier;
  amlRisk: AMLRiskLevel;
  isPEP: boolean;
  country: string;
  investmentAmount: number;
  lastReviewDate?: string;
  nextReviewDate?: string;
  documents: string[];
}

const mockInvestors: InvestorKYC[] = [
  {
    id: 'inv-001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    submittedDate: '2025-11-01',
    status: 'pending',
    tier: 'tier-2',
    amlRisk: 'low',
    isPEP: false,
    country: 'United States',
    investmentAmount: 250000,
    documents: ['passport.pdf', 'proof_of_address.pdf', 'accreditation.pdf'],
  },
  {
    id: 'inv-002',
    name: 'Maria Garcia',
    email: 'maria.g@example.com',
    submittedDate: '2025-10-28',
    status: 'needs-review',
    tier: 'tier-3',
    amlRisk: 'medium',
    isPEP: true,
    country: 'Mexico',
    investmentAmount: 500000,
    documents: ['id_card.pdf', 'bank_statement.pdf', 'pep_declaration.pdf'],
  },
  {
    id: 'inv-003',
    name: 'Robert Chen',
    email: 'robert.chen@example.com',
    submittedDate: '2025-10-25',
    status: 'approved',
    tier: 'tier-2',
    amlRisk: 'low',
    isPEP: false,
    country: 'Singapore',
    investmentAmount: 150000,
    lastReviewDate: '2025-10-27',
    nextReviewDate: '2026-10-27',
    documents: ['passport.pdf', 'utility_bill.pdf'],
  },
  {
    id: 'inv-004',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    submittedDate: '2025-10-20',
    status: 'rejected',
    tier: 'tier-1',
    amlRisk: 'high',
    isPEP: false,
    country: 'Nigeria',
    investmentAmount: 50000,
    documents: ['passport.pdf'],
  },
  {
    id: 'inv-005',
    name: 'Ahmed Al-Rashid',
    email: 'ahmed.ar@example.com',
    submittedDate: '2025-11-05',
    status: 'needs-review',
    tier: 'tier-3',
    amlRisk: 'high',
    isPEP: true,
    country: 'United Arab Emirates',
    investmentAmount: 1000000,
    documents: ['passport.pdf', 'wealth_source.pdf', 'company_registry.pdf'],
  },
];

const KYCAMLManagementPage = () => {
  const [statusFilter, setStatusFilter] = useState<KYCStatus | 'all'>('all');
  const [tierFilter, setTierFilter] = useState<KYCTier | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvestor, setSelectedInvestor] = useState<InvestorKYC | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const statusColors: Record<KYCStatus, string> = {
    pending: 'gold',
    approved: 'green',
    rejected: 'red',
    'needs-review': 'orange',
  };

  const statusIcons: Record<KYCStatus, React.ReactNode> = {
    pending: <ClockCircleOutlined />,
    approved: <CheckCircleOutlined />,
    rejected: <CloseCircleOutlined />,
    'needs-review': <ExclamationCircleOutlined />,
  };

  const riskColors: Record<AMLRiskLevel, string> = {
    low: 'green',
    medium: 'orange',
    high: 'red',
    critical: 'purple',
  };

  const filteredInvestors = mockInvestors.filter((inv) => {
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    const matchesTier = tierFilter === 'all' || inv.tier === tierFilter;
    const matchesSearch =
      inv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesTier && matchesSearch;
  });

  const metrics = {
    totalSubmissions: mockInvestors.length,
    pending: mockInvestors.filter((i) => i.status === 'pending').length,
    approved: mockInvestors.filter((i) => i.status === 'approved').length,
    rejected: mockInvestors.filter((i) => i.status === 'rejected').length,
    needsReview: mockInvestors.filter((i) => i.status === 'needs-review').length,
    approvalRate: Math.round(
      (mockInvestors.filter((i) => i.status === 'approved').length / mockInvestors.length) * 100
    ),
    avgProcessingTime: 2.5, // days
    highRiskCount: mockInvestors.filter((i) => i.amlRisk === 'high' || i.amlRisk === 'critical')
      .length,
  };

  const handleViewDetails = (investor: InvestorKYC) => {
    setSelectedInvestor(investor);
    setDetailsModalOpen(true);
  };

  const handleApprove = () => {
    message.success(`KYC approved for ${selectedInvestor?.name}`);
    setDetailsModalOpen(false);
  };

  const handleReject = () => {
    message.error(`KYC rejected for ${selectedInvestor?.name}`);
    setDetailsModalOpen(false);
  };

  const handleRequestMoreInfo = () => {
    message.info(`More information requested from ${selectedInvestor?.name}`);
    setDetailsModalOpen(false);
  };

  const columns: ColumnsType<InvestorKYC> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: InvestorKYC) => (
        <Space>
          <UserOutlined />
          <div>
            <div>{text}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: KYCStatus) => (
        <Tag icon={statusIcons[status]} color={statusColors[status]}>
          {status.replace('-', ' ').toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Approved', value: 'approved' },
        { text: 'Rejected', value: 'rejected' },
        { text: 'Needs Review', value: 'needs-review' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Tier',
      dataIndex: 'tier',
      key: 'tier',
      render: (tier: KYCTier) => (
        <Tag color="blue">{tier.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'AML Risk',
      dataIndex: 'amlRisk',
      key: 'amlRisk',
      render: (risk: AMLRiskLevel) => (
        <Tag color={riskColors[risk]}>{risk.toUpperCase()}</Tag>
      ),
      sorter: (a, b) => {
        const order = { low: 1, medium: 2, high: 3, critical: 4 };
        return order[a.amlRisk] - order[b.amlRisk];
      },
    },
    {
      title: 'PEP',
      dataIndex: 'isPEP',
      key: 'isPEP',
      render: (isPEP: boolean) =>
        isPEP ? <Badge status="error" text="Yes" /> : <Badge status="success" text="No" />,
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'Investment Amount',
      dataIndex: 'investmentAmount',
      key: 'investmentAmount',
      render: (amount: number) => `$${amount.toLocaleString()}`,
      sorter: (a, b) => a.investmentAmount - b.investmentAmount,
    },
    {
      title: 'Submitted',
      dataIndex: 'submittedDate',
      key: 'submittedDate',
      sorter: (a, b) => new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: InvestorKYC) => (
        <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewDetails(record)}>
          Review
        </Button>
      ),
    },
  ];

  const processingTimeData = [
    { month: 'May', avgDays: 3.2 },
    { month: 'Jun', avgDays: 2.8 },
    { month: 'Jul', avgDays: 2.5 },
    { month: 'Aug', avgDays: 2.3 },
    { month: 'Sep', avgDays: 2.6 },
    { month: 'Oct', avgDays: 2.4 },
    { month: 'Nov', avgDays: 2.5 },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={3}>KYC/AML Management</Title>

      {/* Metrics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <StatCard title="Total Submissions" value={metrics.totalSubmissions} />
        </Col>
        <Col xs={24} md={6}>
          <StatCard
            title="Pending Review"
            value={metrics.pending + metrics.needsReview}
            trend="down"
            trendValue={12}
          />
        </Col>
        <Col xs={24} md={6}>
          <StatCard
            title="Approval Rate"
            value={`${metrics.approvalRate}%`}
            trend="up"
            trendValue={5}
          />
        </Col>
        <Col xs={24} md={6}>
          <StatCard
            title="Avg Processing Time"
            value={`${metrics.avgProcessingTime}d`}
            trend="down"
            trendValue={8}
          />
        </Col>
      </Row>

      {/* Processing Time Chart */}
      <Card title="Average Processing Time Trend">
        <Line
          data={processingTimeData}
          xField="month"
          yField="avgDays"
          height={200}
          smooth
          point={{ size: 5 }}
        />
      </Card>

      {/* Filters */}
      <Card>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Input
              placeholder="Search by name or email..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
          <Col>
            <Select
              placeholder="Filter by status"
              style={{ width: 150 }}
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { label: 'All Statuses', value: 'all' },
                { label: 'Pending', value: 'pending' },
                { label: 'Approved', value: 'approved' },
                { label: 'Rejected', value: 'rejected' },
                { label: 'Needs Review', value: 'needs-review' },
              ]}
            />
          </Col>
          <Col>
            <Select
              placeholder="Filter by tier"
              style={{ width: 120 }}
              value={tierFilter}
              onChange={setTierFilter}
              options={[
                { label: 'All Tiers', value: 'all' },
                { label: 'Tier 1', value: 'tier-1' },
                { label: 'Tier 2', value: 'tier-2' },
                { label: 'Tier 3', value: 'tier-3' },
              ]}
            />
          </Col>
        </Row>
      </Card>

      {/* Investor Table */}
      <Card title="Investor Screening Queue">
        <Table
          dataSource={filteredInvestors}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Details Modal */}
      <Modal
        title={
          <Space>
            <UserOutlined />
            KYC/AML Review: {selectedInvestor?.name}
          </Space>
        }
        open={detailsModalOpen}
        onCancel={() => setDetailsModalOpen(false)}
        width={1000}
        footer={[
          <Button key="reject" danger onClick={handleReject}>
            Reject
          </Button>,
          <Button key="more-info" onClick={handleRequestMoreInfo}>
            Request More Info
          </Button>,
          <Button key="approve" type="primary" onClick={handleApprove}>
            Approve
          </Button>,
        ]}
      >
        {selectedInvestor && (
          <Tabs
            items={[
              {
                key: 'personal',
                label: 'Personal Information',
                children: (
                  <Descriptions column={2} bordered size="small">
                    <Descriptions.Item label="Full Name" span={2}>
                      {selectedInvestor.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">{selectedInvestor.email}</Descriptions.Item>
                    <Descriptions.Item label="Country">{selectedInvestor.country}</Descriptions.Item>
                    <Descriptions.Item label="KYC Tier">
                      <Tag color="blue">{selectedInvestor.tier.toUpperCase()}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="PEP Status">
                      {selectedInvestor.isPEP ? (
                        <Tag color="red">Yes</Tag>
                      ) : (
                        <Tag color="green">No</Tag>
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Investment Amount">
                      ${selectedInvestor.investmentAmount.toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="Submitted Date">
                      {selectedInvestor.submittedDate}
                    </Descriptions.Item>
                  </Descriptions>
                ),
              },
              {
                key: 'documents',
                label: 'Documents',
                icon: <FileTextOutlined />,
                children: (
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Text strong>Uploaded Documents ({selectedInvestor.documents.length}):</Text>
                    {selectedInvestor.documents.map((doc, index) => (
                      <Card key={index} size="small">
                        <Space>
                          <FileTextOutlined />
                          <Text>{doc}</Text>
                          <Button type="link" size="small">
                            View
                          </Button>
                          <Button type="link" size="small">
                            Download
                          </Button>
                        </Space>
                      </Card>
                    ))}
                  </Space>
                ),
              },
              {
                key: 'aml',
                label: 'AML Screening',
                icon: <SafetyOutlined />,
                children: (
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Card title="Screening Results" size="small">
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Row justify="space-between">
                          <Text>PEP Check (OFAC, UN, EU)</Text>
                          {selectedInvestor.isPEP ? (
                            <Tag color="red">MATCH FOUND</Tag>
                          ) : (
                            <Tag color="green">NO MATCH</Tag>
                          )}
                        </Row>
                        <Row justify="space-between">
                          <Text>Sanctions List Check</Text>
                          <Tag color="green">CLEAR</Tag>
                        </Row>
                        <Row justify="space-between">
                          <Text>Adverse Media Check</Text>
                          <Tag color="green">NO HITS</Tag>
                        </Row>
                        <Row justify="space-between">
                          <Text>Overall AML Risk</Text>
                          <Tag color={riskColors[selectedInvestor.amlRisk]}>
                            {selectedInvestor.amlRisk.toUpperCase()}
                          </Tag>
                        </Row>
                      </Space>
                    </Card>

                    {selectedInvestor.amlRisk === 'high' ||
                    selectedInvestor.amlRisk === 'critical' ? (
                      <Card title="Enhanced Due Diligence Required" size="small">
                        <Space direction="vertical">
                          <Text type="warning">
                            <WarningOutlined /> This investor triggers EDD requirements:
                          </Text>
                          <ul>
                            {selectedInvestor.isPEP && <li>Politically Exposed Person (PEP)</li>}
                            {selectedInvestor.investmentAmount > 100000 && (
                              <li>Investment amount exceeds $100,000</li>
                            )}
                            {selectedInvestor.amlRisk === 'high' && (
                              <li>High-risk jurisdiction</li>
                            )}
                          </ul>
                          <Text>Additional documentation and manual review required.</Text>
                        </Space>
                      </Card>
                    ) : null}
                  </Space>
                ),
              },
              {
                key: 'monitoring',
                label: 'Ongoing Monitoring',
                children: (
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {selectedInvestor.status === 'approved' ? (
                      <>
                        <Descriptions column={2} bordered size="small">
                          <Descriptions.Item label="Last Review">
                            {selectedInvestor.lastReviewDate || 'N/A'}
                          </Descriptions.Item>
                          <Descriptions.Item label="Next Review">
                            {selectedInvestor.nextReviewDate || 'N/A'}
                          </Descriptions.Item>
                          <Descriptions.Item label="Review Frequency" span={2}>
                            Annual (12 months)
                          </Descriptions.Item>
                        </Descriptions>

                        <Card title="Transaction Monitoring" size="small">
                          <Progress percent={85} status="active" />
                          <Text type="secondary">No suspicious activity detected</Text>
                        </Card>
                      </>
                    ) : (
                      <Text type="secondary">
                        Ongoing monitoring will be activated after KYC approval.
                      </Text>
                    )}
                  </Space>
                ),
              },
            ]}
          />
        )}
      </Modal>
    </Space>
  );
};

export default KYCAMLManagementPage;
