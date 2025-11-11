import { useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Collapse,
  Descriptions,
  Divider,
  Modal,
  Progress,
  Row,
  Space,
  Steps,
  Table,
  Tabs,
  Tag,
  Timeline,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  GlobalOutlined,
  LockOutlined,
  RocketOutlined,
  SafetyOutlined,
  UserOutlined,
  WarningOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { Step } = Steps;

type StageStatus = 'completed' | 'in-progress' | 'pending' | 'failed';
type DocumentStatus = 'draft' | 'review' | 'approved' | 'signed';

interface TokenizationStage {
  id: string;
  name: string;
  description: string;
  status: StageStatus;
  completionDate: string | null;
  duration: string;
  responsible: string;
  jurisdiction: string;
  subSteps: SubStep[];
}

interface SubStep {
  name: string;
  status: StageStatus;
  description: string;
  requirements: string[];
}

interface Document {
  id: string;
  name: string;
  type: string;
  status: DocumentStatus;
  version: string;
  lastUpdated: string;
  requiredFor: string[];
}

interface ComplianceCheck {
  name: string;
  status: StageStatus;
  jurisdiction: string;
  details: string;
  authority: string;
}

const mockTokenizationStages: TokenizationStage[] = [
  {
    id: 'stage-1',
    name: 'Asset Origination (Turkey)',
    description: 'Identify and structure real-world asset in Turkey for tokenization',
    status: 'completed',
    completionDate: '2025-09-15',
    duration: '30 days',
    responsible: 'Turkish Asset Manager',
    jurisdiction: 'Turkey',
    subSteps: [
      {
        name: 'Asset Identification',
        status: 'completed',
        description: 'Identify Turkish real estate portfolio',
        requirements: ['Property valuation', 'Title deeds', 'Land registry'],
      },
      {
        name: 'Legal Entity Formation',
        status: 'completed',
        description: 'Form Turkish SPV (Anonim Şirket)',
        requirements: ['Trade registry', 'Tax ID', 'Bank account'],
      },
      {
        name: 'Asset Transfer to SPV',
        status: 'completed',
        description: 'Transfer assets to SPV ownership',
        requirements: ['Title transfer', 'Notarization', 'Tax clearance'],
      },
    ],
  },
  {
    id: 'stage-2',
    name: 'Regulatory Structure (Cross-Border)',
    description: 'Establish regulatory framework for Turkey-US token offering',
    status: 'completed',
    completionDate: '2025-10-01',
    duration: '45 days',
    responsible: 'Legal Team (Multi-jurisdiction)',
    jurisdiction: 'Turkey & USA',
    subSteps: [
      {
        name: 'Turkish Capital Markets Board (SPK) Approval',
        status: 'completed',
        description: 'Obtain approval for asset tokenization',
        requirements: ['SPK application', 'Asset appraisal', 'Business plan'],
      },
      {
        name: 'US SEC Registration Exemption',
        status: 'completed',
        description: 'Structure under Reg D (506c) for US investors',
        requirements: ['Form D filing', 'Accredited investor verification', 'Blue sky compliance'],
      },
      {
        name: 'Anti-Money Laundering (AML) Program',
        status: 'completed',
        description: 'Implement AML/KYC procedures',
        requirements: ['AML policy', 'KYC provider', 'OFAC screening'],
      },
    ],
  },
  {
    id: 'stage-3',
    name: 'Token Smart Contract Development',
    description: 'Develop and audit security token smart contract',
    status: 'completed',
    completionDate: '2025-10-15',
    duration: '20 days',
    responsible: 'Blockchain Development Team',
    jurisdiction: 'Global (Ethereum)',
    subSteps: [
      {
        name: 'Smart Contract Development',
        status: 'completed',
        description: 'ERC-3643 compliant security token',
        requirements: ['T-REX standard', 'Transfer restrictions', 'Compliance module'],
      },
      {
        name: 'Security Audit',
        status: 'completed',
        description: 'Third-party smart contract audit',
        requirements: ['OpenZeppelin audit', 'Penetration testing', 'Bug bounty'],
      },
      {
        name: 'Token Deployment',
        status: 'completed',
        description: 'Deploy to Ethereum mainnet',
        requirements: ['Gas fees', 'Multi-sig deployment', 'Contract verification'],
      },
    ],
  },
  {
    id: 'stage-4',
    name: 'Legal Documentation (PPM & Agreements)',
    description: 'Prepare comprehensive offering documents',
    status: 'completed',
    completionDate: '2025-10-30',
    duration: '25 days',
    responsible: 'Legal Counsel',
    jurisdiction: 'USA',
    subSteps: [
      {
        name: 'Private Placement Memorandum (PPM)',
        status: 'completed',
        description: 'Draft comprehensive PPM for US investors',
        requirements: ['Risk disclosures', 'Use of proceeds', 'Management bios'],
      },
      {
        name: 'Subscription Agreement',
        status: 'completed',
        description: 'Investor subscription and representations',
        requirements: ['Accreditation cert', 'Investment amount', 'Electronic signature'],
      },
      {
        name: 'Token Purchase Agreement',
        status: 'completed',
        description: 'Terms and conditions of token purchase',
        requirements: ['Token rights', 'Transfer restrictions', 'Voting rights'],
      },
    ],
  },
  {
    id: 'stage-5',
    name: 'US Investor Onboarding',
    description: 'KYC/AML verification for US accredited investor',
    status: 'in-progress',
    completionDate: null,
    duration: '5-7 days (ongoing)',
    responsible: 'Compliance Team',
    jurisdiction: 'USA',
    subSteps: [
      {
        name: 'Accreditation Verification',
        status: 'completed',
        description: 'Verify investor meets SEC Rule 506(c) requirements',
        requirements: ['Income verification ($200k+)', 'Net worth certification ($1M+)', 'CPA letter'],
      },
      {
        name: 'KYC/AML Verification',
        status: 'completed',
        description: 'Identity verification and sanctions screening',
        requirements: ['Government ID', 'Proof of address', 'OFAC/PEP screening'],
      },
      {
        name: 'Suitability Assessment',
        status: 'in-progress',
        description: 'Risk tolerance and investment objectives',
        requirements: ['Risk questionnaire', 'Investment experience', 'Liquidity needs'],
      },
    ],
  },
  {
    id: 'stage-6',
    name: 'Token Subscription & Purchase',
    description: 'Investor reviews docs, signs agreements, and purchases tokens',
    status: 'pending',
    completionDate: null,
    duration: '3-5 days',
    responsible: 'Investor & Transfer Agent',
    jurisdiction: 'USA',
    subSteps: [
      {
        name: 'Document Review',
        status: 'pending',
        description: 'Investor reviews PPM and agreements',
        requirements: ['PPM acknowledgment', 'Risk disclosure acceptance'],
      },
      {
        name: 'Subscription Execution',
        status: 'pending',
        description: 'Sign subscription and purchase agreements',
        requirements: ['DocuSign', 'Wire instructions', 'Wallet address'],
      },
      {
        name: 'Payment & Token Issuance',
        status: 'pending',
        description: 'Wire transfer and token delivery',
        requirements: ['Wire confirmation', 'Token minting', 'Wallet delivery'],
      },
    ],
  },
  {
    id: 'stage-7',
    name: 'Post-Issuance Compliance',
    description: 'Ongoing compliance and investor servicing',
    status: 'pending',
    completionDate: null,
    duration: 'Ongoing',
    responsible: 'Compliance & Operations',
    jurisdiction: 'Turkey & USA',
    subSteps: [
      {
        name: 'Transfer Agent Services',
        status: 'pending',
        description: 'Maintain cap table and transfer records',
        requirements: ['Shareholder registry', 'Transfer approvals', '12-month lock-up'],
      },
      {
        name: 'Investor Reporting',
        status: 'pending',
        description: 'Quarterly and annual reports',
        requirements: ['NAV updates', 'Financial statements', 'Distribution notices'],
      },
      {
        name: 'Tax Compliance',
        status: 'pending',
        description: 'US and Turkish tax reporting',
        requirements: ['Form 1099', 'Turkish withholding tax', 'Treaty benefits'],
      },
    ],
  },
];

const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    name: 'Private Placement Memorandum (PPM)',
    type: 'Offering Document',
    status: 'approved',
    version: 'v2.1',
    lastUpdated: '2025-10-28',
    requiredFor: ['SEC Reg D', 'Investor Disclosure'],
  },
  {
    id: 'doc-2',
    name: 'Subscription Agreement',
    type: 'Legal Agreement',
    status: 'approved',
    version: 'v1.3',
    lastUpdated: '2025-10-25',
    requiredFor: ['Investor Onboarding'],
  },
  {
    id: 'doc-3',
    name: 'Form D Filing',
    type: 'Regulatory Filing',
    status: 'signed',
    version: 'v1.0',
    lastUpdated: '2025-10-01',
    requiredFor: ['SEC Compliance'],
  },
  {
    id: 'doc-4',
    name: 'Token Purchase Agreement',
    type: 'Legal Agreement',
    status: 'approved',
    version: 'v1.2',
    lastUpdated: '2025-10-26',
    requiredFor: ['Token Sale'],
  },
  {
    id: 'doc-5',
    name: 'Smart Contract Audit Report',
    type: 'Technical Document',
    status: 'approved',
    version: 'v1.0',
    lastUpdated: '2025-10-12',
    requiredFor: ['Token Deployment'],
  },
  {
    id: 'doc-6',
    name: 'Turkish SPV Formation Documents',
    type: 'Corporate Document',
    status: 'signed',
    version: 'v1.0',
    lastUpdated: '2025-09-10',
    requiredFor: ['Asset Origination'],
  },
  {
    id: 'doc-7',
    name: 'AML/KYC Policy',
    type: 'Compliance Policy',
    status: 'approved',
    version: 'v2.0',
    lastUpdated: '2025-09-20',
    requiredFor: ['Compliance Program'],
  },
  {
    id: 'doc-8',
    name: 'Risk Factors Disclosure',
    type: 'Disclosure Document',
    status: 'approved',
    version: 'v1.1',
    lastUpdated: '2025-10-27',
    requiredFor: ['Investor Protection'],
  },
];

const mockComplianceChecks: ComplianceCheck[] = [
  {
    name: 'SEC Reg D 506(c) Compliance',
    status: 'completed',
    jurisdiction: 'USA',
    details: 'Form D filed, general solicitation permitted',
    authority: 'US Securities and Exchange Commission',
  },
  {
    name: 'Turkish SPK Approval',
    status: 'completed',
    jurisdiction: 'Turkey',
    details: 'Asset tokenization approved by Capital Markets Board',
    authority: 'Sermaye Piyasası Kurulu (SPK)',
  },
  {
    name: 'OFAC Sanctions Screening',
    status: 'completed',
    jurisdiction: 'USA',
    details: 'No matches found in sanctions lists',
    authority: 'Office of Foreign Assets Control',
  },
  {
    name: 'Blue Sky Laws Compliance',
    status: 'completed',
    jurisdiction: 'USA (50 States)',
    details: 'Federal preemption under Rule 506(c)',
    authority: 'State Securities Regulators',
  },
  {
    name: 'FinCEN BSA/AML Compliance',
    status: 'in-progress',
    jurisdiction: 'USA',
    details: 'KYC program implemented, ongoing monitoring',
    authority: 'Financial Crimes Enforcement Network',
  },
];

const TokenizationFlowPage = () => {
  const [selectedStage, setSelectedStage] = useState<TokenizationStage | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const statusColors: Record<StageStatus, string> = {
    completed: 'success',
    'in-progress': 'processing',
    pending: 'default',
    failed: 'error',
  };

  const statusIcons: Record<StageStatus, React.ReactNode> = {
    completed: <CheckCircleOutlined />,
    'in-progress': <ClockCircleOutlined />,
    pending: <ClockCircleOutlined />,
    failed: <ExclamationCircleOutlined />,
  };

  const docStatusColors: Record<DocumentStatus, string> = {
    draft: 'default',
    review: 'processing',
    approved: 'success',
    signed: 'success',
  };

  const completedStages = mockTokenizationStages.filter((s) => s.status === 'completed').length;
  const totalStages = mockTokenizationStages.length;
  const completionPercent = (completedStages / totalStages) * 100;

  const handleViewDetails = (stage: TokenizationStage) => {
    setSelectedStage(stage);
    setDetailModalOpen(true);
  };

  const documentsColumns: ColumnsType<Document> = [
    {
      title: 'Document Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: DocumentStatus) => (
        <Tag color={docStatusColors[status]}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: 'Last Updated',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small">
            View
          </Button>
          <Button type="link" size="small">
            Download
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Space direction="vertical" size={0}>
            <Title level={3}>
              <GlobalOutlined /> Cross-Border Tokenization Flow
            </Title>
            <Paragraph type="secondary">
              Turkey → USA: Complete tokenization workflow from asset origination to investor purchase
            </Paragraph>
          </Space>
        </Col>
        <Col>
          <Space>
            <Tag color="blue" style={{ fontSize: 14, padding: '4px 12px' }}>
              <SafetyOutlined /> Jurisdiction: Multi-Country
            </Tag>
            <Tag color="green" style={{ fontSize: 14, padding: '4px 12px' }}>
              <RocketOutlined /> Status: Active
            </Tag>
          </Space>
        </Col>
      </Row>

      {/* Overview Alert */}
      <Alert
        message="End-to-End Tokenization Process"
        description="This dashboard tracks the complete tokenization journey from asset origination in Turkey through regulatory compliance, smart contract deployment, legal documentation, investor onboarding (US), token purchase, and ongoing compliance."
        type="info"
        showIcon
        icon={<GlobalOutlined />}
      />

      {/* Progress Overview */}
      <Card>
        <Row gutter={[24, 24]} align="middle">
          <Col span={18}>
            <Space direction="vertical" style={{ width: '100%' }} size="small">
              <Row justify="space-between">
                <Text strong style={{ fontSize: 16 }}>
                  Overall Progress
                </Text>
                <Text strong style={{ fontSize: 16 }}>
                  {completedStages} of {totalStages} Stages Completed
                </Text>
              </Row>
              <Progress
                percent={completionPercent}
                status="active"
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
              />
              <Row justify="space-between">
                <Text type="secondary">Estimated Time to Investor Purchase: 120-150 days</Text>
                <Text type="secondary">Current Stage: US Investor Onboarding</Text>
              </Row>
            </Space>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ textAlign: 'center', background: '#f0f5ff' }}>
              <Space direction="vertical">
                <DollarOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                <Text strong>Asset Value</Text>
                <Title level={4} style={{ margin: 0 }}>
                  $5.2M
                </Title>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Turkish Real Estate
                </Text>
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Main Content Tabs */}
      <Card>
        <Tabs
          defaultActiveKey="stages"
          items={[
            {
              key: 'stages',
              label: 'Tokenization Stages',
              children: (
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <Steps
                    direction="vertical"
                    current={mockTokenizationStages.findIndex((s) => s.status === 'in-progress')}
                    items={mockTokenizationStages.map((stage, index) => ({
                      title: (
                        <Space>
                          <Text strong>{stage.name}</Text>
                          <Tag color={statusColors[stage.status]} icon={statusIcons[stage.status]}>
                            {stage.status.toUpperCase()}
                          </Tag>
                        </Space>
                      ),
                      description: (
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Text>{stage.description}</Text>
                          <Row gutter={16}>
                            <Col span={8}>
                              <Text type="secondary">
                                <UserOutlined /> {stage.responsible}
                              </Text>
                            </Col>
                            <Col span={8}>
                              <Text type="secondary">
                                <GlobalOutlined /> {stage.jurisdiction}
                              </Text>
                            </Col>
                            <Col span={8}>
                              <Text type="secondary">
                                <ClockCircleOutlined /> {stage.duration}
                              </Text>
                            </Col>
                          </Row>
                          <Button
                            type="link"
                            size="small"
                            onClick={() => handleViewDetails(stage)}
                            style={{ paddingLeft: 0 }}
                          >
                            View Details →
                          </Button>
                        </Space>
                      ),
                      status:
                        stage.status === 'completed'
                          ? 'finish'
                          : stage.status === 'in-progress'
                            ? 'process'
                            : stage.status === 'failed'
                              ? 'error'
                              : 'wait',
                    }))}
                  />
                </Space>
              ),
            },
            {
              key: 'documents',
              label: 'Legal Documents & PPM',
              children: (
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Alert
                    message="Required Documentation"
                    description="All legal documents, regulatory filings, and offering materials required for Turkey-US token offering"
                    type="info"
                    showIcon
                    icon={<FileTextOutlined />}
                  />

                  <Collapse defaultActiveKey={['ppm']}>
                    <Panel
                      header={
                        <Space>
                          <FileTextOutlined />
                          <Text strong>Private Placement Memorandum (PPM)</Text>
                          <Tag color="success">APPROVED</Tag>
                        </Space>
                      }
                      key="ppm"
                    >
                      <Descriptions column={2} bordered size="small">
                        <Descriptions.Item label="Status">
                          <Tag color="success">Approved for Distribution</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Version">v2.1</Descriptions.Item>
                        <Descriptions.Item label="Last Updated">October 28, 2025</Descriptions.Item>
                        <Descriptions.Item label="Pages">87 pages</Descriptions.Item>
                      </Descriptions>
                      <Divider />
                      <Title level={5}>PPM Sections:</Title>
                      <ul>
                        <li>Executive Summary</li>
                        <li>Investment Overview (Asset description, token economics)</li>
                        <li>
                          Risk Factors (Cross-border risks, regulatory, liquidity, technology)
                        </li>
                        <li>Turkish Asset Details (Property portfolio, valuation, management)</li>
                        <li>Token Structure (ERC-3643, transfer restrictions, voting rights)</li>
                        <li>Use of Proceeds (Asset acquisition, platform development)</li>
                        <li>Management Team (Turkish and US operations)</li>
                        <li>Tax Considerations (US and Turkish taxation)</li>
                        <li>Legal & Regulatory (SEC Reg D, Turkish SPK compliance)</li>
                        <li>Subscription Process (Minimum investment, payment terms)</li>
                      </ul>
                    </Panel>

                    <Panel
                      header={
                        <Space>
                          <FileTextOutlined />
                          <Text strong>Subscription & Purchase Agreements</Text>
                          <Tag color="success">APPROVED</Tag>
                        </Space>
                      }
                      key="agreements"
                    >
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Card size="small" title="Subscription Agreement">
                          <ul>
                            <li>Investor representations & warranties</li>
                            <li>Accreditation certification</li>
                            <li>Investment amount and payment terms</li>
                            <li>Electronic signature (DocuSign)</li>
                          </ul>
                        </Card>
                        <Card size="small" title="Token Purchase Agreement">
                          <ul>
                            <li>Token rights and restrictions</li>
                            <li>12-month lock-up period (Reg D Rule 144)</li>
                            <li>Transfer procedures (compliance verification)</li>
                            <li>Dividend/distribution terms</li>
                          </ul>
                        </Card>
                      </Space>
                    </Panel>

                    <Panel
                      header={
                        <Space>
                          <SafetyOutlined />
                          <Text strong>Regulatory Filings</Text>
                          <Tag color="success">FILED</Tag>
                        </Space>
                      }
                      key="regulatory"
                    >
                      <Timeline
                        items={[
                          {
                            color: 'green',
                            children: (
                              <Space direction="vertical">
                                <Text strong>SEC Form D Filing (USA)</Text>
                                <Text type="secondary">Filed October 1, 2025</Text>
                                <Text>Rule 506(c) exemption - accredited investors only</Text>
                              </Space>
                            ),
                          },
                          {
                            color: 'green',
                            children: (
                              <Space direction="vertical">
                                <Text strong>Turkish SPK Approval</Text>
                                <Text type="secondary">Approved September 28, 2025</Text>
                                <Text>Asset tokenization approved by Capital Markets Board</Text>
                              </Space>
                            ),
                          },
                          {
                            color: 'green',
                            children: (
                              <Space direction="vertical">
                                <Text strong>Blue Sky Notice Filings</Text>
                                <Text type="secondary">Filed October 5, 2025 (50 states)</Text>
                                <Text>Federal preemption under Reg D</Text>
                              </Space>
                            ),
                          },
                        ]}
                      />
                    </Panel>
                  </Collapse>

                  <Divider />

                  <Table
                    dataSource={mockDocuments}
                    columns={documentsColumns}
                    rowKey="id"
                    pagination={false}
                  />
                </Space>
              ),
            },
            {
              key: 'compliance',
              label: 'Regulatory Compliance',
              children: (
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Alert
                    message="Multi-Jurisdiction Compliance"
                    description="Turkey (SPK) and USA (SEC, FinCEN, OFAC) regulatory compliance tracking"
                    type="success"
                    showIcon
                    icon={<SafetyOutlined />}
                  />

                  <Row gutter={[16, 16]}>
                    {mockComplianceChecks.map((check, index) => (
                      <Col xs={24} md={12} key={index}>
                        <Card size="small">
                          <Space direction="vertical" style={{ width: '100%' }}>
                            <Row justify="space-between" align="middle">
                              <Text strong>{check.name}</Text>
                              <Tag color={statusColors[check.status]} icon={statusIcons[check.status]}>
                                {check.status.toUpperCase()}
                              </Tag>
                            </Row>
                            <Descriptions column={1} size="small">
                              <Descriptions.Item label="Jurisdiction">
                                <Badge status="processing" text={check.jurisdiction} />
                              </Descriptions.Item>
                              <Descriptions.Item label="Authority">
                                {check.authority}
                              </Descriptions.Item>
                              <Descriptions.Item label="Details">{check.details}</Descriptions.Item>
                            </Descriptions>
                          </Space>
                        </Card>
                      </Col>
                    ))}
                  </Row>

                  <Card title="Key Compliance Requirements" size="small">
                    <Collapse>
                      <Panel header="SEC Requirements (USA)" key="sec">
                        <ul>
                          <li>
                            <strong>Rule 506(c) Compliance:</strong> All investors must be accredited
                            and verified
                          </li>
                          <li>
                            <strong>Form D Filing:</strong> Filed within 15 days of first sale
                          </li>
                          <li>
                            <strong>General Solicitation:</strong> Permitted with verification
                          </li>
                          <li>
                            <strong>Rule 144 Restriction:</strong> 12-month holding period for resale
                          </li>
                          <li>
                            <strong>Bad Actor Disqualification:</strong> Background checks completed
                          </li>
                        </ul>
                      </Panel>
                      <Panel header="Turkish SPK Requirements" key="spk">
                        <ul>
                          <li>
                            <strong>Asset Tokenization Approval:</strong> Required for digital
                            securitization
                          </li>
                          <li>
                            <strong>SPV Registration:</strong> Turkish entity holding real assets
                          </li>
                          <li>
                            <strong>Valuation Requirements:</strong> Independent appraisal every 6
                            months
                          </li>
                          <li>
                            <strong>Reporting:</strong> Quarterly reports to SPK
                          </li>
                        </ul>
                      </Panel>
                      <Panel header="AML/KYC Requirements" key="aml">
                        <ul>
                          <li>
                            <strong>Customer Identification Program (CIP):</strong> Government ID
                            verification
                          </li>
                          <li>
                            <strong>OFAC Screening:</strong> Sanctions and PEP list screening
                          </li>
                          <li>
                            <strong>Enhanced Due Diligence:</strong> For high-risk jurisdictions
                          </li>
                          <li>
                            <strong>Ongoing Monitoring:</strong> Transaction monitoring and SAR filing
                          </li>
                        </ul>
                      </Panel>
                    </Collapse>
                  </Card>
                </Space>
              ),
            },
            {
              key: 'timeline',
              label: 'Historical Timeline',
              children: (
                <Card>
                  <Timeline
                    mode="left"
                    items={[
                      {
                        label: 'September 1, 2025',
                        children: 'Turkish asset portfolio identified and valued at $5.2M',
                        color: 'green',
                      },
                      {
                        label: 'September 10, 2025',
                        children: 'Turkish SPV (Anonim Şirket) formed and registered',
                        color: 'green',
                      },
                      {
                        label: 'September 15, 2025',
                        children: 'Assets transferred to SPV ownership',
                        color: 'green',
                      },
                      {
                        label: 'September 28, 2025',
                        children: 'Turkish SPK approval obtained for tokenization',
                        color: 'green',
                      },
                      {
                        label: 'October 1, 2025',
                        children: 'SEC Form D filed under Rule 506(c)',
                        color: 'green',
                      },
                      {
                        label: 'October 12, 2025',
                        children: 'Smart contract audit completed (OpenZeppelin)',
                        color: 'green',
                      },
                      {
                        label: 'October 15, 2025',
                        children: 'ERC-3643 token deployed to Ethereum mainnet',
                        color: 'green',
                      },
                      {
                        label: 'October 28, 2025',
                        children: 'PPM v2.1 approved for distribution',
                        color: 'green',
                      },
                      {
                        label: 'November 10, 2025',
                        children: 'US investor KYC/AML verification completed',
                        color: 'blue',
                      },
                      {
                        label: 'November 12, 2025 (Current)',
                        children: 'Investor suitability assessment in progress',
                        color: 'blue',
                      },
                      {
                        label: 'Est. November 15, 2025',
                        children: 'Investor reviews PPM and signs subscription agreement',
                        color: 'gray',
                      },
                      {
                        label: 'Est. November 18, 2025',
                        children: 'Wire transfer received and tokens issued to investor wallet',
                        color: 'gray',
                      },
                    ]}
                  />
                </Card>
              ),
            },
          ]}
        />
      </Card>

      {/* Stage Detail Modal */}
      <Modal
        title={
          <Space>
            {selectedStage && statusIcons[selectedStage.status]}
            <Text>{selectedStage?.name}</Text>
          </Space>
        }
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setDetailModalOpen(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedStage && (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Status">
                <Tag color={statusColors[selectedStage.status]} icon={statusIcons[selectedStage.status]}>
                  {selectedStage.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Jurisdiction">{selectedStage.jurisdiction}</Descriptions.Item>
              <Descriptions.Item label="Responsible">{selectedStage.responsible}</Descriptions.Item>
              <Descriptions.Item label="Duration">{selectedStage.duration}</Descriptions.Item>
              {selectedStage.completionDate && (
                <Descriptions.Item label="Completed" span={2}>
                  {selectedStage.completionDate}
                </Descriptions.Item>
              )}
            </Descriptions>

            <Card title="Sub-Steps" size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                {selectedStage.subSteps.map((subStep, index) => (
                  <Card key={index} size="small" type="inner">
                    <Row justify="space-between" align="middle">
                      <Text strong>{subStep.name}</Text>
                      <Tag color={statusColors[subStep.status]}>{subStep.status.toUpperCase()}</Tag>
                    </Row>
                    <Paragraph type="secondary" style={{ marginTop: 8 }}>
                      {subStep.description}
                    </Paragraph>
                    <Divider style={{ margin: '8px 0' }} />
                    <Text strong>Requirements:</Text>
                    <ul style={{ marginTop: 8 }}>
                      {subStep.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </Space>
            </Card>
          </Space>
        )}
      </Modal>
    </Space>
  );
};

export default TokenizationFlowPage;
