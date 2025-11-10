import { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Progress,
  Radio,
  Row,
  Select,
  Space,
  Statistic,
  Switch,
  Table,
  Tabs,
  Tag,
  Timeline,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { RadioChangeEvent } from 'antd';
import dayjs from 'dayjs';
import {
  AlertOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
  HistoryOutlined,
  LockOutlined,
  PlayCircleOutlined,
  SafetyOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import { StatCard } from '../../../components/common';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

type ProcessingMethod = 'fifo' | 'prorata';
type RedemptionStatus = 'pending' | 'approved' | 'partial' | 'rejected';
type GateStatus = 'active' | 'inactive';

interface RedemptionRequest {
  id: string;
  requestDate: string;
  investorName: string;
  investorId: string;
  fund: string;
  sharesRequested: number;
  valueRequested: number;
  queuePosition: number;
  status: RedemptionStatus;
  approvedShares: number;
  approvedValue: number;
}

interface GateConfig {
  isActive: boolean;
  reason: string;
  monthlyLimit: number;
  quarterlyLimit: number;
  processingMethod: ProcessingMethod;
  activatedDate: string;
}

interface ProRataCalculation {
  investorName: string;
  requestedAmount: number;
  proRataPercentage: number;
  allocatedAmount: number;
}

interface HistoricalGate {
  id: string;
  activatedDate: string;
  deactivatedDate: string;
  reason: string;
  duration: number; // days
  totalRequests: number;
  totalValueRequested: number;
  totalValueProcessed: number;
  impactScore: number;
}

const mockRedemptionQueue: RedemptionRequest[] = [
  {
    id: 'req-001',
    requestDate: '2025-11-01',
    investorName: 'John Smith',
    investorId: 'INV-001',
    fund: 'RWA Growth Fund',
    sharesRequested: 500,
    valueRequested: 52500,
    queuePosition: 1,
    status: 'pending',
    approvedShares: 0,
    approvedValue: 0,
  },
  {
    id: 'req-002',
    requestDate: '2025-11-02',
    investorName: 'Maria Garcia',
    investorId: 'INV-002',
    fund: 'RWA Growth Fund',
    sharesRequested: 300,
    valueRequested: 31500,
    queuePosition: 2,
    status: 'pending',
    approvedShares: 0,
    approvedValue: 0,
  },
  {
    id: 'req-003',
    requestDate: '2025-11-03',
    investorName: 'Chen Wei',
    investorId: 'INV-003',
    fund: 'RWA Growth Fund',
    sharesRequested: 750,
    valueRequested: 78750,
    queuePosition: 3,
    status: 'pending',
    approvedShares: 0,
    approvedValue: 0,
  },
  {
    id: 'req-004',
    requestDate: '2025-11-04',
    investorName: 'Sarah Johnson',
    investorId: 'INV-004',
    fund: 'RWA Growth Fund',
    sharesRequested: 1000,
    valueRequested: 105000,
    queuePosition: 4,
    status: 'pending',
    approvedShares: 0,
    approvedValue: 0,
  },
];

const mockHistoricalGates: HistoricalGate[] = [
  {
    id: 'gate-001',
    activatedDate: '2025-08-15',
    deactivatedDate: '2025-09-30',
    reason: 'Market volatility and liquidity concerns',
    duration: 46,
    totalRequests: 25,
    totalValueRequested: 5000000,
    totalValueProcessed: 3000000,
    impactScore: 7.5,
  },
  {
    id: 'gate-002',
    activatedDate: '2025-06-01',
    deactivatedDate: '2025-06-30',
    reason: 'Regulatory compliance review',
    duration: 29,
    totalRequests: 12,
    totalValueRequested: 2000000,
    totalValueProcessed: 1800000,
    impactScore: 4.2,
  },
];

const GateManagementPage = () => {
  const [gateConfig, setGateConfig] = useState<GateConfig>({
    isActive: true,
    reason: 'Market volatility and liquidity management',
    monthlyLimit: 1000000,
    quarterlyLimit: 3000000,
    processingMethod: 'fifo',
    activatedDate: '2025-11-01',
  });
  const [redemptionQueue] = useState<RedemptionRequest[]>(mockRedemptionQueue);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [proRataModalOpen, setProRataModalOpen] = useState(false);
  const [proRataResults, setProRataResults] = useState<ProRataCalculation[]>([]);
  const [form] = Form.useForm();

  const statusColors: Record<RedemptionStatus, string> = {
    pending: 'processing',
    approved: 'success',
    partial: 'warning',
    rejected: 'error',
  };

  const totalRequested = redemptionQueue.reduce((sum, req) => sum + req.valueRequested, 0);
  const totalPending = redemptionQueue.filter((r) => r.status === 'pending').length;
  const availableCapacity = gateConfig.monthlyLimit - totalRequested;
  const utilizationPercent = (totalRequested / gateConfig.monthlyLimit) * 100;

  const handleToggleGate = (checked: boolean) => {
    if (checked) {
      setConfigModalOpen(true);
    } else {
      Modal.confirm({
        title: 'Deactivate Gate',
        content: 'Are you sure you want to deactivate the redemption gate? All pending requests will be processed.',
        onOk: () => {
          setGateConfig({ ...gateConfig, isActive: false });
          message.success('Gate deactivated successfully');
        },
      });
    }
  };

  const handleActivateGate = () => {
    form.validateFields().then((values) => {
      setGateConfig({
        isActive: true,
        reason: values.reason,
        monthlyLimit: values.monthlyLimit,
        quarterlyLimit: values.quarterlyLimit,
        processingMethod: values.processingMethod,
        activatedDate: dayjs().format('YYYY-MM-DD'),
      });
      message.success('Gate activated successfully');
      setConfigModalOpen(false);
    });
  };

  const handleProcessNext = (requestId: string) => {
    message.success(`Processing redemption request ${requestId}`);
  };

  const handleCalculateProRata = () => {
    const availableCap = gateConfig.monthlyLimit;
    const totalReq = redemptionQueue.reduce((sum, req) => sum + req.valueRequested, 0);
    const proRataPercent = (availableCap / totalReq) * 100;

    const results: ProRataCalculation[] = redemptionQueue.map((req) => ({
      investorName: req.investorName,
      requestedAmount: req.valueRequested,
      proRataPercentage: proRataPercent,
      allocatedAmount: (req.valueRequested * proRataPercent) / 100,
    }));

    setProRataResults(results);
    setProRataModalOpen(true);
  };

  const redemptionQueueColumns: ColumnsType<RedemptionRequest> = [
    {
      title: 'Queue #',
      dataIndex: 'queuePosition',
      key: 'queuePosition',
      render: (pos: number) => (
        <Tag color="blue" style={{ fontSize: 14, fontWeight: 'bold' }}>
          #{pos}
        </Tag>
      ),
      width: 80,
    },
    {
      title: 'Request Date',
      dataIndex: 'requestDate',
      key: 'requestDate',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
      sorter: (a, b) => dayjs(a.requestDate).unix() - dayjs(b.requestDate).unix(),
    },
    {
      title: 'Investor',
      dataIndex: 'investorName',
      key: 'investorName',
      render: (name: string, record: RedemptionRequest) => (
        <Space direction="vertical" size={0}>
          <Text strong>{name}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>
            {record.investorId}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Fund',
      dataIndex: 'fund',
      key: 'fund',
    },
    {
      title: 'Shares',
      dataIndex: 'sharesRequested',
      key: 'sharesRequested',
    },
    {
      title: 'Value Requested',
      dataIndex: 'valueRequested',
      key: 'valueRequested',
      render: (value: number) => <Text strong>${value.toLocaleString()}</Text>,
      sorter: (a, b) => a.valueRequested - b.valueRequested,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: RedemptionStatus) => (
        <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>
      ),
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Approved', value: 'approved' },
        { text: 'Partial', value: 'partial' },
        { text: 'Rejected', value: 'rejected' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: RedemptionRequest) =>
        record.status === 'pending' && record.queuePosition === 1 ? (
          <Button
            type="primary"
            size="small"
            icon={<PlayCircleOutlined />}
            onClick={() => handleProcessNext(record.id)}
          >
            Process
          </Button>
        ) : (
          <Text type="secondary">In Queue</Text>
        ),
    },
  ];

  const proRataColumns: ColumnsType<ProRataCalculation> = [
    {
      title: 'Investor',
      dataIndex: 'investorName',
      key: 'investorName',
    },
    {
      title: 'Requested',
      dataIndex: 'requestedAmount',
      key: 'requestedAmount',
      render: (amount: number) => `$${amount.toLocaleString()}`,
    },
    {
      title: 'Pro-Rata %',
      dataIndex: 'proRataPercentage',
      key: 'proRataPercentage',
      render: (pct: number) => `${pct.toFixed(2)}%`,
    },
    {
      title: 'Allocated',
      dataIndex: 'allocatedAmount',
      key: 'allocatedAmount',
      render: (amount: number) => <Text strong>${amount.toLocaleString()}</Text>,
    },
  ];

  const historicalGatesColumns: ColumnsType<HistoricalGate> = [
    {
      title: 'Period',
      key: 'period',
      render: (_: unknown, record: HistoricalGate) => (
        <Space direction="vertical" size={0}>
          <Text>{dayjs(record.activatedDate).format('MMM DD, YYYY')}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>
            to {dayjs(record.deactivatedDate).format('MMM DD, YYYY')}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (days: number) => `${days} days`,
      sorter: (a, b) => a.duration - b.duration,
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true,
    },
    {
      title: 'Requests',
      dataIndex: 'totalRequests',
      key: 'totalRequests',
    },
    {
      title: 'Value Requested',
      dataIndex: 'totalValueRequested',
      key: 'totalValueRequested',
      render: (value: number) => `$${(value / 1000000).toFixed(1)}M`,
    },
    {
      title: 'Value Processed',
      dataIndex: 'totalValueProcessed',
      key: 'totalValueProcessed',
      render: (value: number) => `$${(value / 1000000).toFixed(1)}M`,
    },
    {
      title: 'Impact Score',
      dataIndex: 'impactScore',
      key: 'impactScore',
      render: (score: number) => (
        <Tag color={score > 7 ? 'error' : score > 5 ? 'warning' : 'success'}>
          {score.toFixed(1)}
        </Tag>
      ),
      sorter: (a, b) => a.impactScore - b.impactScore,
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3}>Gate Management</Title>
          <Paragraph type="secondary">
            Manage redemption gates and process redemption queue
          </Paragraph>
        </Col>
        <Col>
          <Space>
            <Text>Gate Status:</Text>
            <Switch
              checked={gateConfig.isActive}
              onChange={handleToggleGate}
              checkedChildren={<LockOutlined />}
              unCheckedChildren={<UnlockOutlined />}
            />
            <Tag color={gateConfig.isActive ? 'error' : 'success'} icon={gateConfig.isActive ? <LockOutlined /> : <UnlockOutlined />}>
              {gateConfig.isActive ? 'ACTIVE' : 'INACTIVE'}
            </Tag>
          </Space>
        </Col>
      </Row>

      {/* Gate Status Alert */}
      {gateConfig.isActive && (
        <Alert
          message="Redemption Gate Active"
          description={`Gate activated on ${dayjs(gateConfig.activatedDate).format('MMMM DD, YYYY')}. Reason: ${gateConfig.reason}`}
          type="warning"
          icon={<AlertOutlined />}
          showIcon
          closable
        />
      )}

      {/* Metrics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <StatCard
            title="Monthly Limit"
            value={`$${(gateConfig.monthlyLimit / 1000000).toFixed(1)}M`}
            icon={<DollarOutlined />}
          />
        </Col>
        <Col xs={24} md={6}>
          <StatCard
            title="Total Requested"
            value={`$${(totalRequested / 1000).toFixed(0)}K`}
            icon={<ExclamationCircleOutlined />}
          />
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Capacity Utilization"
              value={utilizationPercent}
              precision={1}
              suffix="%"
              valueStyle={{ color: utilizationPercent > 100 ? '#ff4d4f' : '#52c41a' }}
            />
            <Progress
              percent={Math.min(utilizationPercent, 100)}
              status={utilizationPercent > 100 ? 'exception' : 'active'}
              showInfo={false}
            />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <StatCard
            title="Pending Requests"
            value={totalPending}
            icon={<ClockCircleOutlined />}
          />
        </Col>
      </Row>

      {/* Main Content */}
      <Card>
        <Tabs
          defaultActiveKey="queue"
          items={[
            {
              key: 'queue',
              label: 'Redemption Queue',
              children: (
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Space>
                        <Text strong>Processing Method:</Text>
                        <Tag color="blue">
                          {gateConfig.processingMethod === 'fifo' ? 'FIFO (First In First Out)' : 'Pro-Rata'}
                        </Tag>
                      </Space>
                    </Col>
                    <Col>
                      <Space>
                        {gateConfig.processingMethod === 'prorata' && (
                          <Button icon={<DollarOutlined />} onClick={handleCalculateProRata}>
                            Calculate Pro-Rata
                          </Button>
                        )}
                        <Button type="primary" icon={<PlayCircleOutlined />}>
                          Process All Eligible
                        </Button>
                      </Space>
                    </Col>
                  </Row>

                  {utilizationPercent > 100 && (
                    <Alert
                      message="Capacity Exceeded"
                      description={`Total requested (${totalRequested.toLocaleString()}) exceeds monthly limit (${gateConfig.monthlyLimit.toLocaleString()}). Consider pro-rata processing or increasing limit.`}
                      type="error"
                      showIcon
                    />
                  )}

                  <Table
                    dataSource={redemptionQueue}
                    columns={redemptionQueueColumns}
                    rowKey="id"
                    pagination={false}
                  />
                </Space>
              ),
            },
            {
              key: 'config',
              label: 'Gate Configuration',
              children: (
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <Card title="Current Configuration" size="small">
                    <Descriptions column={2} bordered>
                      <Descriptions.Item label="Status">
                        <Tag color={gateConfig.isActive ? 'error' : 'success'}>
                          {gateConfig.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Activated Date">
                        {gateConfig.isActive ? dayjs(gateConfig.activatedDate).format('MMMM DD, YYYY') : 'N/A'}
                      </Descriptions.Item>
                      <Descriptions.Item label="Reason" span={2}>
                        {gateConfig.reason}
                      </Descriptions.Item>
                      <Descriptions.Item label="Monthly Limit">
                        ${gateConfig.monthlyLimit.toLocaleString()}
                      </Descriptions.Item>
                      <Descriptions.Item label="Quarterly Limit">
                        ${gateConfig.quarterlyLimit.toLocaleString()}
                      </Descriptions.Item>
                      <Descriptions.Item label="Processing Method" span={2}>
                        {gateConfig.processingMethod === 'fifo' ? 'FIFO (First In First Out)' : 'Pro-Rata'}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>

                  <Card title="Processing Methods Explained" size="small">
                    <Timeline
                      items={[
                        {
                          color: 'blue',
                          children: (
                            <Space direction="vertical">
                              <Text strong>FIFO (First In First Out)</Text>
                              <Text type="secondary">
                                Redemption requests are processed in the order they were received. First request in
                                queue gets processed first until capacity is exhausted.
                              </Text>
                            </Space>
                          ),
                        },
                        {
                          color: 'green',
                          children: (
                            <Space direction="vertical">
                              <Text strong>Pro-Rata</Text>
                              <Text type="secondary">
                                All redemption requests are partially fulfilled proportionally based on available
                                capacity. Each investor gets the same percentage of their request.
                              </Text>
                            </Space>
                          ),
                        },
                      ]}
                    />
                  </Card>
                </Space>
              ),
            },
            {
              key: 'history',
              label: 'Historical Gates',
              children: (
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Alert
                    message="Gate History"
                    description="Review past redemption gates and their impact on fund operations"
                    type="info"
                    showIcon
                    icon={<HistoryOutlined />}
                  />
                  <Table
                    dataSource={mockHistoricalGates}
                    columns={historicalGatesColumns}
                    rowKey="id"
                    pagination={false}
                  />
                </Space>
              ),
            },
          ]}
        />
      </Card>

      {/* Gate Activation Modal */}
      <Modal
        title="Activate Redemption Gate"
        open={configModalOpen}
        onCancel={() => setConfigModalOpen(false)}
        onOk={handleActivateGate}
        width={700}
        okText="Activate Gate"
        okButtonProps={{ danger: true }}
      >
        <Form form={form} layout="vertical">
          <Alert
            message="Important"
            description="Activating a redemption gate will limit redemptions for all investors. Please provide a clear reason and set appropriate limits."
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Form.Item
            name="reason"
            label="Reason for Gate Activation"
            rules={[{ required: true, message: 'Please provide a reason' }]}
            initialValue={gateConfig.reason}
          >
            <TextArea rows={3} placeholder="e.g., Market volatility, liquidity management, regulatory compliance" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="monthlyLimit"
                label="Monthly Redemption Limit"
                rules={[{ required: true, message: 'Please set monthly limit' }]}
                initialValue={gateConfig.monthlyLimit}
              >
                <InputNumber
                  min={0}
                  prefix="$"
                  style={{ width: '100%' }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="quarterlyLimit"
                label="Quarterly Redemption Limit"
                rules={[{ required: true, message: 'Please set quarterly limit' }]}
                initialValue={gateConfig.quarterlyLimit}
              >
                <InputNumber
                  min={0}
                  prefix="$"
                  style={{ width: '100%' }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="processingMethod"
            label="Processing Method"
            rules={[{ required: true }]}
            initialValue={gateConfig.processingMethod}
          >
            <Radio.Group>
              <Space direction="vertical">
                <Radio value="fifo">
                  <Space direction="vertical" size={0}>
                    <Text strong>FIFO (First In First Out)</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Process requests in order received
                    </Text>
                  </Space>
                </Radio>
                <Radio value="prorata">
                  <Space direction="vertical" size={0}>
                    <Text strong>Pro-Rata</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Allocate capacity proportionally to all requests
                    </Text>
                  </Space>
                </Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>

      {/* Pro-Rata Calculator Modal */}
      <Modal
        title="Pro-Rata Allocation"
        open={proRataModalOpen}
        onCancel={() => setProRataModalOpen(false)}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setProRataModalOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="apply"
            type="primary"
            onClick={() => {
              message.success('Pro-rata allocation applied successfully');
              setProRataModalOpen(false);
            }}
          >
            Apply Allocation
          </Button>,
        ]}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Alert
            message="Pro-Rata Calculation"
            description={`Available capacity: $${gateConfig.monthlyLimit.toLocaleString()} | Total requested: $${totalRequested.toLocaleString()}`}
            type="info"
            showIcon
          />

          <Table
            dataSource={proRataResults}
            columns={proRataColumns}
            rowKey="investorName"
            pagination={false}
            summary={(data) => (
              <Table.Summary>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}>
                    <Text strong>Total</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <Text strong>
                      ${data.reduce((sum, r) => sum + r.requestedAmount, 0).toLocaleString()}
                    </Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2} />
                  <Table.Summary.Cell index={3}>
                    <Text strong>
                      ${data.reduce((sum, r) => sum + r.allocatedAmount, 0).toLocaleString()}
                    </Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />
        </Space>
      </Modal>
    </Space>
  );
};

export default GateManagementPage;
