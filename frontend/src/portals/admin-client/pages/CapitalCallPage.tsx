import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Form,
  Input,
  InputNumber,
  Modal,
  Progress,
  Row,
  Select,
  Space,
  Statistic,
  Steps,
  Table,
  Tag,
  Tooltip,
  Typography,
  Upload,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import {
  BellOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
  FilePdfOutlined,
  MailOutlined,
  PlusOutlined,
  TeamOutlined,
  UploadOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { StatCard } from '../../../components/common';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Step } = Steps;

type PaymentStatus = 'pending' | 'paid' | 'partial' | 'overdue' | 'defaulted';
type CallStatus = 'draft' | 'sent' | 'in-progress' | 'completed' | 'cancelled';

interface InvestorCommitment {
  id: string;
  investorName: string;
  email: string;
  totalCommitment: number;
  previouslyFunded: number;
  remainingCommitment: number;
  callAmount: number;
  percentOfCommitment: number;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  paidDate?: string;
  proofDocuments: string[];
}

interface CapitalCall {
  id: string;
  callNumber: number;
  callDate: string;
  dueDate: string;
  purpose: string;
  totalAmount: number;
  percentOfCommitment: number;
  status: CallStatus;
  totalDue: number;
  totalReceived: number;
  percentCollected: number;
  defaultCount: number;
  investors: InvestorCommitment[];
}

const mockCapitalCalls: CapitalCall[] = [
  {
    id: 'call-001',
    callNumber: 1,
    callDate: '2025-10-15',
    dueDate: '2025-11-01',
    purpose: 'Initial Investment - Series A Portfolio Companies',
    totalAmount: 5000000,
    percentOfCommitment: 25,
    status: 'completed',
    totalDue: 5000000,
    totalReceived: 5000000,
    percentCollected: 100,
    defaultCount: 0,
    investors: [],
  },
  {
    id: 'call-002',
    callNumber: 2,
    callDate: '2025-11-01',
    dueDate: '2025-11-20',
    purpose: 'Follow-on Investment - TechCo Series B',
    totalAmount: 3000000,
    percentOfCommitment: 15,
    status: 'in-progress',
    totalDue: 3000000,
    totalReceived: 2400000,
    percentCollected: 80,
    defaultCount: 1,
    investors: [],
  },
];

const mockInvestorCommitments: InvestorCommitment[] = [
  {
    id: 'inv-001',
    investorName: 'John Smith',
    email: 'john.smith@example.com',
    totalCommitment: 2000000,
    previouslyFunded: 500000,
    remainingCommitment: 1500000,
    callAmount: 300000,
    percentOfCommitment: 15,
    paymentStatus: 'paid',
    amountPaid: 300000,
    paidDate: '2025-11-15',
    proofDocuments: ['wire_confirmation_001.pdf'],
  },
  {
    id: 'inv-002',
    investorName: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    totalCommitment: 5000000,
    previouslyFunded: 1250000,
    remainingCommitment: 3750000,
    callAmount: 750000,
    percentOfCommitment: 15,
    paymentStatus: 'paid',
    amountPaid: 750000,
    paidDate: '2025-11-16',
    proofDocuments: ['wire_confirmation_002.pdf'],
  },
  {
    id: 'inv-003',
    investorName: 'Chen Wei',
    email: 'chen.wei@example.com',
    totalCommitment: 3000000,
    previouslyFunded: 750000,
    remainingCommitment: 2250000,
    callAmount: 450000,
    percentOfCommitment: 15,
    paymentStatus: 'pending',
    amountPaid: 0,
    proofDocuments: [],
  },
  {
    id: 'inv-004',
    investorName: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    totalCommitment: 4000000,
    previouslyFunded: 1000000,
    remainingCommitment: 3000000,
    callAmount: 600000,
    percentOfCommitment: 15,
    paymentStatus: 'partial',
    amountPaid: 300000,
    proofDocuments: ['partial_payment_001.pdf'],
  },
  {
    id: 'inv-005',
    investorName: 'Ahmed Al-Fayed',
    email: 'ahmed.alfayed@example.com',
    totalCommitment: 6000000,
    previouslyFunded: 1500000,
    remainingCommitment: 4500000,
    callAmount: 900000,
    percentOfCommitment: 15,
    paymentStatus: 'overdue',
    amountPaid: 0,
    proofDocuments: [],
  },
];

const CapitalCallPage = () => {
  const [selectedCall, setSelectedCall] = useState<CapitalCall | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createStep, setCreateStep] = useState(0);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState<InvestorCommitment | null>(null);
  const [form] = Form.useForm();
  const [investorAllocations, setInvestorAllocations] = useState<InvestorCommitment[]>([]);

  const paymentStatusConfig: Record<
    PaymentStatus,
    { color: string; icon: React.ReactNode; text: string }
  > = {
    pending: {
      color: 'default',
      icon: <ClockCircleOutlined />,
      text: 'Pending',
    },
    paid: {
      color: 'success',
      icon: <CheckCircleOutlined />,
      text: 'Paid',
    },
    partial: {
      color: 'processing',
      icon: <ExclamationCircleOutlined />,
      text: 'Partial',
    },
    overdue: {
      color: 'warning',
      icon: <WarningOutlined />,
      text: 'Overdue',
    },
    defaulted: {
      color: 'error',
      icon: <ExclamationCircleOutlined />,
      text: 'Defaulted',
    },
  };

  const callStatusConfig: Record<CallStatus, { color: string; text: string }> = {
    draft: { color: 'default', text: 'Draft' },
    sent: { color: 'processing', text: 'Sent' },
    'in-progress': { color: 'processing', text: 'In Progress' },
    completed: { color: 'success', text: 'Completed' },
    cancelled: { color: 'error', text: 'Cancelled' },
  };

  const handleCreateCall = () => {
    setCreateStep(0);
    setCreateModalOpen(true);
    form.resetFields();
  };

  const handleNextStep = () => {
    form.validateFields().then(() => {
      if (createStep === 0) {
        // Calculate investor allocations
        const formValues = form.getFieldsValue();
        const percentOfCommitment = formValues.percentOfCommitment;

        const allocations = mockInvestorCommitments.map((inv) => ({
          ...inv,
          callAmount: (inv.remainingCommitment * percentOfCommitment) / 100,
          percentOfCommitment,
          paymentStatus: 'pending' as PaymentStatus,
          amountPaid: 0,
          proofDocuments: [],
        }));

        setInvestorAllocations(allocations);
      }
      setCreateStep(createStep + 1);
    });
  };

  const handlePrevStep = () => {
    setCreateStep(createStep - 1);
  };

  const handleSubmitCall = () => {
    message.success('Capital call created and notices sent to all investors!');
    setCreateModalOpen(false);
    setCreateStep(0);
  };

  const handleMarkAsPaid = (values: {
    amountPaid: number;
    paidDate: Dayjs;
    proofDocuments: unknown[];
  }) => {
    if (selectedInvestor) {
      message.success(`Payment recorded for ${selectedInvestor.investorName}`);
      setPaymentModalOpen(false);
      setSelectedInvestor(null);
    }
  };

  const handleSendReminder = (investor: InvestorCommitment) => {
    message.success(`Reminder email sent to ${investor.investorName}`);
  };

  const capitalCallsColumns: ColumnsType<CapitalCall> = [
    {
      title: 'Call #',
      dataIndex: 'callNumber',
      key: 'callNumber',
      render: (num: number) => <Text strong>#{num}</Text>,
      width: 80,
    },
    {
      title: 'Call Date',
      dataIndex: 'callDate',
      key: 'callDate',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
      sorter: (a, b) => dayjs(a.callDate).unix() - dayjs(b.callDate).unix(),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
      sorter: (a, b) => dayjs(a.dueDate).unix() - dayjs(b.dueDate).unix(),
    },
    {
      title: 'Purpose',
      dataIndex: 'purpose',
      key: 'purpose',
      ellipsis: { showTitle: false },
      render: (text: string) => (
        <Tooltip title={text}>
          <Text ellipsis>{text}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `$${amount.toLocaleString()}`,
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: '% Commitment',
      dataIndex: 'percentOfCommitment',
      key: 'percentOfCommitment',
      render: (pct: number) => `${pct}%`,
    },
    {
      title: 'Collected',
      key: 'collected',
      render: (_: unknown, record: CapitalCall) => (
        <Progress
          percent={record.percentCollected}
          size="small"
          status={record.percentCollected === 100 ? 'success' : 'active'}
        />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: CallStatus) => (
        <Tag color={callStatusConfig[status].color}>{callStatusConfig[status].text}</Tag>
      ),
      filters: Object.keys(callStatusConfig).map((key) => ({
        text: callStatusConfig[key as CallStatus].text,
        value: key,
      })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: CapitalCall) => (
        <Button type="link" onClick={() => setSelectedCall(record)}>
          View Details
        </Button>
      ),
    },
  ];

  const investorAllocationColumns: ColumnsType<InvestorCommitment> = [
    {
      title: 'Investor',
      dataIndex: 'investorName',
      key: 'investorName',
    },
    {
      title: 'Total Commitment',
      dataIndex: 'totalCommitment',
      key: 'totalCommitment',
      render: (amount: number) => `$${amount.toLocaleString()}`,
    },
    {
      title: 'Previously Funded',
      dataIndex: 'previouslyFunded',
      key: 'previouslyFunded',
      render: (amount: number) => `$${amount.toLocaleString()}`,
    },
    {
      title: 'Remaining',
      dataIndex: 'remainingCommitment',
      key: 'remainingCommitment',
      render: (amount: number) => `$${amount.toLocaleString()}`,
    },
    {
      title: 'Call Amount',
      dataIndex: 'callAmount',
      key: 'callAmount',
      render: (amount: number) => <Text strong>${amount.toLocaleString()}</Text>,
    },
    {
      title: 'Amount Paid',
      dataIndex: 'amountPaid',
      key: 'amountPaid',
      render: (amount: number) => `$${amount.toLocaleString()}`,
    },
    {
      title: 'Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status: PaymentStatus) => (
        <Tag color={paymentStatusConfig[status].color} icon={paymentStatusConfig[status].icon}>
          {paymentStatusConfig[status].text}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: InvestorCommitment) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => {
              setSelectedInvestor(record);
              setPaymentModalOpen(true);
            }}
            disabled={record.paymentStatus === 'paid'}
          >
            Mark Paid
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => handleSendReminder(record)}
            disabled={record.paymentStatus === 'paid'}
          >
            Send Reminder
          </Button>
        </Space>
      ),
    },
  ];

  const totalDue =
    mockCapitalCalls
      .filter((c) => c.status !== 'cancelled')
      .reduce((sum, call) => sum + call.totalDue, 0) || 0;

  const totalReceived =
    mockCapitalCalls
      .filter((c) => c.status !== 'cancelled')
      .reduce((sum, call) => sum + call.totalReceived, 0) || 0;

  const percentCollected = totalDue > 0 ? (totalReceived / totalDue) * 100 : 0;

  const outstandingAmount = totalDue - totalReceived;

  const defaultRate =
    mockInvestorCommitments.filter((inv) => inv.paymentStatus === 'defaulted').length /
      mockInvestorCommitments.length || 0;

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3}>Capital Call Management</Title>
          <Paragraph type="secondary">
            Manage capital calls for closed-end funds and track investor payments
          </Paragraph>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateCall}>
            Create Capital Call
          </Button>
        </Col>
      </Row>

      {/* Metrics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <StatCard
            title="Total Due"
            value={`$${(totalDue / 1000000).toFixed(1)}M`}
            icon={<DollarOutlined />}
          />
        </Col>
        <Col xs={24} md={6}>
          <StatCard
            title="Total Received"
            value={`$${(totalReceived / 1000000).toFixed(1)}M`}
            icon={<CheckCircleOutlined />}
            trend="up"
            trendValue={15}
          />
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="% Collected"
              value={percentCollected}
              precision={1}
              suffix="%"
              valueStyle={{ color: percentCollected >= 80 ? '#3f8600' : '#cf1322' }}
            />
            <Progress
              percent={percentCollected}
              status={percentCollected >= 80 ? 'success' : 'exception'}
              showInfo={false}
            />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <StatCard
            title="Outstanding"
            value={`$${(outstandingAmount / 1000000).toFixed(1)}M`}
            icon={<ClockCircleOutlined />}
          />
        </Col>
      </Row>

      {/* Capital Calls Table */}
      <Card title="Capital Calls History">
        <Table
          dataSource={mockCapitalCalls}
          columns={capitalCallsColumns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Selected Call Details */}
      {selectedCall && (
        <Card
          title={
            <Space>
              <Text>Capital Call #{selectedCall.callNumber} - Details</Text>
              <Tag color={callStatusConfig[selectedCall.status].color}>
                {callStatusConfig[selectedCall.status].text}
              </Tag>
            </Space>
          }
          extra={
            <Space>
              <Button
                icon={<MailOutlined />}
                onClick={() => message.info('Sending reminder emails to investors...')}
              >
                Send Reminders
              </Button>
              <Button icon={<FilePdfOutlined />}>Generate Report</Button>
              <Button onClick={() => setSelectedCall(null)}>Close</Button>
            </Space>
          }
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Call Date">
                {dayjs(selectedCall.callDate).format('MMMM DD, YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Due Date">
                {dayjs(selectedCall.dueDate).format('MMMM DD, YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Purpose" span={2}>
                {selectedCall.purpose}
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount">
                ${selectedCall.totalAmount.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="% of Commitment">
                {selectedCall.percentOfCommitment}%
              </Descriptions.Item>
              <Descriptions.Item label="Total Received">
                ${selectedCall.totalReceived.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Outstanding">
                ${(selectedCall.totalDue - selectedCall.totalReceived).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>

            <div>
              <Title level={5}>Investor Payments</Title>
              <Table
                dataSource={mockInvestorCommitments}
                columns={investorAllocationColumns}
                rowKey="id"
                pagination={false}
              />
            </div>
          </Space>
        </Card>
      )}

      {/* Create Capital Call Modal */}
      <Modal
        title="Create Capital Call"
        open={createModalOpen}
        onCancel={() => {
          setCreateModalOpen(false);
          setCreateStep(0);
        }}
        width={900}
        footer={null}
      >
        <Steps current={createStep} style={{ marginBottom: 24 }}>
          <Step title="Call Details" icon={<DollarOutlined />} />
          <Step title="Investor Allocations" icon={<TeamOutlined />} />
          <Step title="Review & Send" icon={<MailOutlined />} />
        </Steps>

        <Form form={form} layout="vertical">
          {createStep === 0 && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="callDate"
                  label="Call Date"
                  rules={[{ required: true, message: 'Please select call date' }]}
                  initialValue={dayjs()}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="dueDate"
                  label="Due Date"
                  rules={[{ required: true, message: 'Please select due date' }]}
                  initialValue={dayjs().add(30, 'day')}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="purpose"
                  label="Purpose"
                  rules={[{ required: true, message: 'Please enter purpose' }]}
                >
                  <TextArea rows={3} placeholder="e.g., Follow-on investment in Series B round" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="percentOfCommitment"
                  label="% of Commitment to Call"
                  rules={[{ required: true, message: 'Please enter percentage' }]}
                  initialValue={15}
                >
                  <InputNumber
                    min={1}
                    max={100}
                    suffix="%"
                    style={{ width: '100%' }}
                    onChange={(value) => {
                      const totalCommitment = 20000000; // Mock total commitment
                      if (value && typeof value === 'number') {
                        const totalAmount = (totalCommitment * value) / 100;
                        form.setFieldsValue({ totalAmount });
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="totalAmount" label="Total Amount (Auto-calculated)">
                  <InputNumber
                    disabled
                    prefix="$"
                    style={{ width: '100%' }}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}

          {createStep === 1 && (
            <div>
              <Paragraph>
                Review the auto-calculated allocations for each investor based on their commitments.
                You can edit individual amounts if needed.
              </Paragraph>
              <Table
                dataSource={investorAllocations}
                columns={[
                  { title: 'Investor', dataIndex: 'investorName', key: 'investorName' },
                  {
                    title: 'Total Commitment',
                    dataIndex: 'totalCommitment',
                    key: 'totalCommitment',
                    render: (amount: number) => `$${amount.toLocaleString()}`,
                  },
                  {
                    title: 'Remaining',
                    dataIndex: 'remainingCommitment',
                    key: 'remainingCommitment',
                    render: (amount: number) => `$${amount.toLocaleString()}`,
                  },
                  {
                    title: 'Call Amount',
                    dataIndex: 'callAmount',
                    key: 'callAmount',
                    render: (amount: number) => <Text strong>${amount.toLocaleString()}</Text>,
                  },
                  {
                    title: '%',
                    key: 'percent',
                    render: (_: unknown, record: InvestorCommitment) => (
                      <Text>{((record.callAmount / record.remainingCommitment) * 100).toFixed(1)}%</Text>
                    ),
                  },
                ]}
                rowKey="id"
                pagination={false}
                summary={(data) => (
                  <Table.Summary>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={3}>
                        <Text strong>Total</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1}>
                        <Text strong>
                          $
                          {data
                            .reduce((sum, record) => sum + record.callAmount, 0)
                            .toLocaleString()}
                        </Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={2} />
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
              />
            </div>
          )}

          {createStep === 2 && (
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Card size="small" title={<Space><BellOutlined />Notice Settings</Space>}>
                <Form.Item
                  name="sendEmail"
                  label="Send Email Notifications"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Select defaultValue="yes">
                    <Select.Option value="yes">Yes, send to all investors</Select.Option>
                    <Select.Option value="no">No, I'll send manually</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="includePDF"
                  label="Include PDF Notice"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Select defaultValue="yes">
                    <Select.Option value="yes">Yes, attach PDF</Select.Option>
                    <Select.Option value="no">No PDF attachment</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="includeWireInstructions"
                  label="Include Wire Instructions"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Select defaultValue="yes">
                    <Select.Option value="yes">Yes, include instructions</Select.Option>
                    <Select.Option value="no">No</Select.Option>
                  </Select>
                </Form.Item>
              </Card>

              <Card size="small" title="Summary">
                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label="Call Date">
                    {form.getFieldValue('callDate')?.format('MMMM DD, YYYY')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Due Date">
                    {form.getFieldValue('dueDate')?.format('MMMM DD, YYYY')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Purpose">
                    {form.getFieldValue('purpose')}
                  </Descriptions.Item>
                  <Descriptions.Item label="% of Commitment">
                    {form.getFieldValue('percentOfCommitment')}%
                  </Descriptions.Item>
                  <Descriptions.Item label="Total Amount">
                    ${form.getFieldValue('totalAmount')?.toLocaleString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="Number of Investors">
                    {investorAllocations.length}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Space>
          )}

          <Row justify="end" style={{ marginTop: 24 }}>
            <Space>
              <Button onClick={() => setCreateModalOpen(false)}>Cancel</Button>
              {createStep > 0 && <Button onClick={handlePrevStep}>Previous</Button>}
              {createStep < 2 && (
                <Button type="primary" onClick={handleNextStep}>
                  Next
                </Button>
              )}
              {createStep === 2 && (
                <Button type="primary" icon={<MailOutlined />} onClick={handleSubmitCall}>
                  Create & Send Notices
                </Button>
              )}
            </Space>
          </Row>
        </Form>
      </Modal>

      {/* Payment Recording Modal */}
      <Modal
        title={`Record Payment - ${selectedInvestor?.investorName}`}
        open={paymentModalOpen}
        onCancel={() => {
          setPaymentModalOpen(false);
          setSelectedInvestor(null);
        }}
        onOk={() => {
          form.validateFields().then((values) => {
            handleMarkAsPaid(values);
          });
        }}
        okText="Record Payment"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="amountPaid"
            label="Amount Paid"
            rules={[{ required: true, message: 'Please enter amount' }]}
            initialValue={selectedInvestor?.callAmount}
          >
            <InputNumber
              prefix="$"
              style={{ width: '100%' }}
              max={selectedInvestor?.callAmount}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Form.Item>
          <Form.Item
            name="paidDate"
            label="Payment Date"
            rules={[{ required: true, message: 'Please select date' }]}
            initialValue={dayjs()}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="proofDocuments" label="Upload Payment Proof">
            <Upload>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <TextArea rows={3} placeholder="Any additional notes about this payment" />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default CapitalCallPage;
