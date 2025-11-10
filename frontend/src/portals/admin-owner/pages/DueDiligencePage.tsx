import { useState } from 'react';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  DatePicker,
  Descriptions,
  Form,
  Input,
  Modal,
  Progress,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Timeline,
  Typography,
  Upload,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  FileTextOutlined,
  UploadOutlined,
  WarningOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

type ChecklistStatus = 'not-started' | 'in-progress' | 'completed' | 'blocked';
type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  status: ChecklistStatus;
  assignee: string;
  dueDate: string;
  completedDate?: string;
  documents: string[];
  notes: string;
}

interface DDCategory {
  id: string;
  name: string;
  items: ChecklistItem[];
}

interface RiskItem {
  id: string;
  category: string;
  description: string;
  level: RiskLevel;
  mitigation: string;
  owner: string;
}

const mockCategories: DDCategory[] = [
  {
    id: 'financial',
    name: 'Financial Analysis',
    items: [
      {
        id: 'fin-001',
        title: 'Audited Financial Statements (3 years)',
        description: 'Review audited financials for last 3 fiscal years',
        status: 'completed',
        assignee: 'Laura Chen',
        dueDate: '2025-11-05',
        completedDate: '2025-11-03',
        documents: ['financials_2023.pdf', 'financials_2024.pdf'],
        notes: 'Clean audit opinions, no material weaknesses',
      },
      {
        id: 'fin-002',
        title: 'Cash Flow Analysis',
        description: 'Analyze historical and projected cash flows',
        status: 'in-progress',
        assignee: 'Mateo Ruiz',
        dueDate: '2025-11-12',
        documents: ['cashflow_model.xlsx'],
        notes: 'Awaiting Q3 actuals',
      },
      {
        id: 'fin-003',
        title: 'Revenue Model Validation',
        description: 'Validate assumptions in revenue projections',
        status: 'not-started',
        assignee: 'Sara González',
        dueDate: '2025-11-15',
        documents: [],
        notes: '',
      },
    ],
  },
  {
    id: 'legal',
    name: 'Legal Review',
    items: [
      {
        id: 'leg-001',
        title: 'Corporate Structure Review',
        description: 'Verify corporate structure and ownership',
        status: 'completed',
        assignee: 'Legal Team',
        dueDate: '2025-11-08',
        completedDate: '2025-11-07',
        documents: ['articles_of_incorporation.pdf', 'shareholder_agreement.pdf'],
        notes: 'Structure confirmed, no red flags',
      },
      {
        id: 'leg-002',
        title: 'Material Contracts Review',
        description: 'Review all material contracts and agreements',
        status: 'in-progress',
        assignee: 'Legal Team',
        dueDate: '2025-11-14',
        documents: ['contract_summary.xlsx'],
        notes: 'Reviewing 12 key contracts',
      },
      {
        id: 'leg-003',
        title: 'Regulatory Compliance Check',
        description: 'Verify compliance with applicable regulations',
        status: 'blocked',
        assignee: 'Compliance Officer',
        dueDate: '2025-11-10',
        documents: [],
        notes: 'Waiting for regulatory filing history from issuer',
      },
    ],
  },
  {
    id: 'technical',
    name: 'Technical Assessment',
    items: [
      {
        id: 'tech-001',
        title: 'Technology Stack Review',
        description: 'Assess technology infrastructure and capabilities',
        status: 'in-progress',
        assignee: 'Noah Park',
        dueDate: '2025-11-16',
        documents: ['tech_stack_doc.pdf'],
        notes: 'Modern stack, mostly cloud-based',
      },
      {
        id: 'tech-002',
        title: 'Security Audit',
        description: 'Review cybersecurity measures and incident history',
        status: 'not-started',
        assignee: 'Security Team',
        dueDate: '2025-11-20',
        documents: [],
        notes: '',
      },
    ],
  },
  {
    id: 'market',
    name: 'Market Analysis',
    items: [
      {
        id: 'mkt-001',
        title: 'Competitive Landscape',
        description: 'Analyze competitive positioning and market share',
        status: 'completed',
        assignee: 'Strategy Team',
        dueDate: '2025-11-06',
        completedDate: '2025-11-05',
        documents: ['market_analysis.pdf'],
        notes: 'Strong positioning in niche market',
      },
      {
        id: 'mkt-002',
        title: 'TAM/SAM Analysis',
        description: 'Validate addressable market size',
        status: 'in-progress',
        assignee: 'Strategy Team',
        dueDate: '2025-11-13',
        documents: ['tam_sam_som.xlsx'],
        notes: 'Bottom-up and top-down analysis in progress',
      },
    ],
  },
  {
    id: 'operational',
    name: 'Operational DD',
    items: [
      {
        id: 'ops-001',
        title: 'Management Team Assessment',
        description: 'Evaluate management experience and track record',
        status: 'completed',
        assignee: 'HR Partner',
        dueDate: '2025-11-04',
        completedDate: '2025-11-03',
        documents: ['mgmt_bios.pdf'],
        notes: 'Experienced team with strong track record',
      },
      {
        id: 'ops-002',
        title: 'Operational Metrics Review',
        description: 'Review key operational KPIs and efficiency metrics',
        status: 'in-progress',
        assignee: 'Operations Team',
        dueDate: '2025-11-17',
        documents: ['kpi_dashboard.xlsx'],
        notes: 'Strong operational metrics vs. peers',
      },
    ],
  },
];

const mockRisks: RiskItem[] = [
  {
    id: 'risk-001',
    category: 'Financial',
    description: 'High customer concentration (top 3 = 65% of revenue)',
    level: 'high',
    mitigation: 'Require customer diversification plan as closing condition',
    owner: 'Laura Chen',
  },
  {
    id: 'risk-002',
    category: 'Legal',
    description: 'Pending litigation ($2M claim)',
    level: 'medium',
    mitigation: 'Escrow $2.5M pending resolution',
    owner: 'Legal Team',
  },
  {
    id: 'risk-003',
    category: 'Market',
    description: 'Regulatory uncertainty in key jurisdiction',
    level: 'high',
    mitigation: 'Add regulatory change clauses in documentation',
    owner: 'Compliance Officer',
  },
  {
    id: 'risk-004',
    category: 'Technical',
    description: 'Key person risk (CTO)',
    level: 'medium',
    mitigation: 'Require retention bonus and knowledge transfer plan',
    owner: 'HR Partner',
  },
];

const DueDiligencePage = () => {
  const [selectedItem, setSelectedItem] = useState<ChecklistItem | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [form] = Form.useForm();

  const statusIcons: Record<ChecklistStatus, React.ReactNode> = {
    'not-started': <ClockCircleOutlined style={{ color: '#d9d9d9' }} />,
    'in-progress': <ClockCircleOutlined style={{ color: '#1890ff' }} />,
    completed: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
    blocked: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
  };

  const statusColors: Record<ChecklistStatus, string> = {
    'not-started': 'default',
    'in-progress': 'processing',
    completed: 'success',
    blocked: 'error',
  };

  const riskColors: Record<RiskLevel, string> = {
    low: 'green',
    medium: 'orange',
    high: 'red',
    critical: 'purple',
  };

  const calculateCategoryProgress = (category: DDCategory) => {
    const total = category.items.length;
    const completed = category.items.filter((item) => item.status === 'completed').length;
    return Math.round((completed / total) * 100);
  };

  const overallProgress = () => {
    const allItems = mockCategories.flatMap((cat) => cat.items);
    const completed = allItems.filter((item) => item.status === 'completed').length;
    return Math.round((completed / allItems.length) * 100);
  };

  const handleItemClick = (item: ChecklistItem) => {
    setSelectedItem(item);
  };

  const handleUploadDocument = () => {
    setUploadModalOpen(true);
  };

  const handleGenerateReport = () => {
    message.success('DD Report generated successfully!');
  };

  const riskColumns: ColumnsType<RiskItem> = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120,
    },
    {
      title: 'Risk Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      render: (level: RiskLevel) => (
        <Tag color={riskColors[level]}>{level.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Mitigation Strategy',
      dataIndex: 'mitigation',
      key: 'mitigation',
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
      width: 150,
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3}>Due Diligence Tracker</Title>
        </Col>
        <Col>
          <Space>
            <Button icon={<DownloadOutlined />}>Export ZIP</Button>
            <Button type="primary" icon={<FileTextOutlined />} onClick={handleGenerateReport}>
              Generate Report
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Overall Progress */}
      <Card>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text strong>Overall DD Progress</Text>
          <Progress
            percent={overallProgress()}
            status="active"
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
          <Text type="secondary">
            {mockCategories.flatMap((cat) => cat.items).filter((item) => item.status === 'completed').length} of{' '}
            {mockCategories.flatMap((cat) => cat.items).length} items completed
          </Text>
        </Space>
      </Card>

      {/* DD Checklist by Category */}
      <Card title="Due Diligence Checklist">
        <Collapse defaultActiveKey={['financial', 'legal']}>
          {mockCategories.map((category) => (
            <Panel
              key={category.id}
              header={
                <Space>
                  <Text strong>{category.name}</Text>
                  <Tag color="blue">{category.items.length} items</Tag>
                  <Progress
                    percent={calculateCategoryProgress(category)}
                    steps={category.items.length}
                    size="small"
                    style={{ width: 200 }}
                  />
                </Space>
              }
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                {category.items.map((item) => (
                  <Card
                    key={item.id}
                    size="small"
                    hoverable
                    onClick={() => handleItemClick(item)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Row gutter={16} align="middle">
                      <Col flex="none">{statusIcons[item.status]}</Col>
                      <Col flex="auto">
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                          <Text strong>{item.title}</Text>
                          <Text type="secondary">{item.description}</Text>
                          <Space>
                            <Tag color={statusColors[item.status]}>{item.status.replace('-', ' ')}</Tag>
                            <Text type="secondary">Assignee: {item.assignee}</Text>
                            <Text type="secondary">Due: {item.dueDate}</Text>
                            {item.documents.length > 0 && (
                              <Tag icon={<FileTextOutlined />} color="blue">
                                {item.documents.length} docs
                              </Tag>
                            )}
                          </Space>
                        </Space>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </Space>
            </Panel>
          ))}
        </Collapse>
      </Card>

      {/* Risk Assessment Matrix */}
      <Card title={<Space><WarningOutlined />Risk Assessment Matrix</Space>}>
        <Table
          dataSource={mockRisks}
          columns={riskColumns}
          rowKey="id"
          pagination={false}
        />
      </Card>

      {/* Item Details Modal */}
      <Modal
        title={selectedItem?.title}
        open={!!selectedItem}
        onCancel={() => setSelectedItem(null)}
        footer={[
          <Button key="upload" icon={<UploadOutlined />} onClick={handleUploadDocument}>
            Upload Document
          </Button>,
          <Button key="close" onClick={() => setSelectedItem(null)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {selectedItem && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Status">
                <Tag color={statusColors[selectedItem.status]}>
                  {selectedItem.status.replace('-', ' ').toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Assignee">{selectedItem.assignee}</Descriptions.Item>
              <Descriptions.Item label="Due Date">{selectedItem.dueDate}</Descriptions.Item>
              <Descriptions.Item label="Completed Date">
                {selectedItem.completedDate || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Description" span={2}>
                {selectedItem.description}
              </Descriptions.Item>
            </Descriptions>

            {selectedItem.documents.length > 0 && (
              <Card title="Documents" size="small">
                <Timeline>
                  {selectedItem.documents.map((doc, index) => (
                    <Timeline.Item key={index} color="blue">
                      <Space>
                        <FileTextOutlined />
                        <Text>{doc}</Text>
                        <Button type="link" size="small" icon={<DownloadOutlined />}>
                          Download
                        </Button>
                      </Space>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card>
            )}

            {selectedItem.notes && (
              <Card title="Notes" size="small">
                <Text>{selectedItem.notes}</Text>
              </Card>
            )}
          </Space>
        )}
      </Modal>

      {/* Upload Document Modal */}
      <Modal
        title="Upload Document"
        open={uploadModalOpen}
        onCancel={() => setUploadModalOpen(false)}
        onOk={() => {
          form.validateFields().then(() => {
            message.success('Document uploaded successfully!');
            setUploadModalOpen(false);
            form.resetFields();
          });
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="file" label="File" rules={[{ required: true }]}>
            <Upload maxCount={1}>
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default DueDiligencePage;
