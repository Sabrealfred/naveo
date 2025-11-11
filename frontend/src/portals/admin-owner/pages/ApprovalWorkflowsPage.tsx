import { Card, Row, Col, Table, Tag, Button, Steps, Space, Modal, Form, Input, Select, message, Statistic } from 'antd';
import { AuditOutlined, PlusOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';

interface ApprovalRequest {
  id: string;
  type: 'wire' | 'redemption' | 'fund-launch' | 'large-trade';
  amount: string;
  requester: string;
  status: 'pending' | 'approved' | 'rejected';
  currentStep: number;
  totalSteps: number;
  createdAt: string;
}

const ApprovalWorkflowsPage = () => {
  const [createWorkflowModalVisible, setCreateWorkflowModalVisible] = useState(false);
  const [form] = Form.useForm();

  const requests: ApprovalRequest[] = [
    { id: '1', type: 'wire', amount: '$250,000', requester: 'John Doe', status: 'pending', currentStep: 1, totalSteps: 2, createdAt: '2024-11-10 09:30' },
    { id: '2', type: 'redemption', amount: '$500,000', requester: 'Jane Smith', status: 'approved', currentStep: 2, totalSteps: 2, createdAt: '2024-11-09' },
    { id: '3', type: 'large-trade', amount: '$1,000,000', requester: 'Trader A', status: 'pending', currentStep: 0, totalSteps: 3, createdAt: '2024-11-10 10:00' },
  ];

  const columns: ColumnsType<ApprovalRequest> = [
    { title: 'Type', dataIndex: 'type', key: 'type', render: (type) => <Tag>{type.toUpperCase()}</Tag> },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (amt) => <strong>{amt}</strong> },
    { title: 'Requester', dataIndex: 'requester', key: 'requester' },
    { title: 'Progress', key: 'progress', render: (_, record) => <span>{record.currentStep + 1}/{record.totalSteps}</span> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'pending' ? 'orange' : status === 'approved' ? 'green' : 'red'}>{status}</Tag> },
    { title: 'Created', dataIndex: 'createdAt', key: 'createdAt' },
    { title: 'Actions', key: 'actions', render: (_, record) => record.status === 'pending' && <Space><Button size="small" type="primary">Approve</Button><Button size="small" danger>Reject</Button></Space> },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card>
            <Row align="middle" gutter={24}>
              <Col flex="auto"><h2 style={{ margin: 0 }}><AuditOutlined /> Approval Workflows</h2></Col>
              <Col><Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateWorkflowModalVisible(true)}>Create Workflow</Button></Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={8}><Card><Statistic title="Pending Approvals" value={requests.filter(r => r.status === 'pending').length} prefix={<ClockCircleOutlined />} valueStyle={{ color: '#fa8c16' }} /></Card></Col>
        <Col xs={24} lg={8}><Card><Statistic title="Approved Today" value={requests.filter(r => r.status === 'approved').length} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col xs={24} lg={8}><Card><Statistic title="Average Time" value="4.5" suffix="hours" valueStyle={{ color: '#1890ff' }} /></Card></Col>
      </Row>

      <Card title="Approval Queue">
        <Table columns={columns} dataSource={requests} rowKey="id" />
      </Card>

      <Modal title="Create Approval Workflow" open={createWorkflowModalVisible} onCancel={() => setCreateWorkflowModalVisible(false)} onOk={() => { message.success('Workflow created'); setCreateWorkflowModalVisible(false); }} width={700}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Workflow Name" rules={[{ required: true }]}><Input placeholder="e.g., Large Wire Transfer Approval" /></Form.Item>
          <Form.Item name="triggerType" label="Trigger Type" rules={[{ required: true }]}>
            <Select><Select.Option value="wire">Wire Transfer</Select.Option><Select.Option value="redemption">Redemption</Select.Option><Select.Option value="trade">Large Trade</Select.Option><Select.Option value="fund">Fund Launch</Select.Option></Select>
          </Form.Item>
          <Form.Item name="threshold" label="Threshold Amount" rules={[{ required: true }]}><Input prefix="$" type="number" placeholder="100000" /></Form.Item>
          <Form.Item name="approvers" label="Approvers (in order)" rules={[{ required: true }]}>
            <Select mode="tags" placeholder="Enter email addresses"><Select.Option value="cfo@naveo.com">CFO</Select.Option><Select.Option value="ceo@naveo.com">CEO</Select.Option></Select>
          </Form.Item>
          <Form.Item name="description" label="Description"><Input.TextArea rows={2} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ApprovalWorkflowsPage;
