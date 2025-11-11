import { Card, Row, Col, Table, Tag, Button, Switch, Space, Modal, Form, Input, Select, message, Tabs } from 'antd';
import { SettingOutlined, PlusOutlined, LockOutlined, DollarOutlined } from '@ant-design/icons';
import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';

interface BusinessRule {
  id: string;
  name: string;
  category: 'accreditation' | 'limits' | 'compliance' | 'transfer';
  condition: string;
  action: string;
  enabled: boolean;
}

const BusinessRulesPage = () => {
  const [addRuleModalVisible, setAddRuleModalVisible] = useState(false);
  const [form] = Form.useForm();

  const rules: BusinessRule[] = [
    { id: '1', name: 'Accredited Investor Verification', category: 'accreditation', condition: 'Net worth < $1M', action: 'Block investment', enabled: true },
    { id: '2', name: 'Investment Limit Per Fund', category: 'limits', condition: 'Investment > $500K', action: 'Require approval', enabled: true },
    { id: '3', name: 'Lock-up Period Enforcement', category: 'compliance', condition: 'Lock-up < 12 months', action: 'Block redemption', enabled: true },
    { id: '4', name: 'Transfer Whitelist', category: 'transfer', condition: 'Recipient not whitelisted', action: 'Block transfer', enabled: false },
  ];

  const columns: ColumnsType<BusinessRule> = [
    { title: 'Rule Name', dataIndex: 'name', key: 'name', render: (name) => <strong>{name}</strong> },
    { title: 'Category', dataIndex: 'category', key: 'category', render: (cat) => <Tag>{cat.toUpperCase()}</Tag> },
    { title: 'Condition', dataIndex: 'condition', key: 'condition', render: (cond) => <code style={{ fontSize: 11 }}>{cond}</code> },
    { title: 'Action', dataIndex: 'action', key: 'action' },
    { title: 'Status', dataIndex: 'enabled', key: 'enabled', render: (enabled) => <Switch checked={enabled} /> },
    { title: 'Actions', key: 'actions', render: () => <Space><Button size="small">Edit</Button><Button size="small" danger>Delete</Button></Space> },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card>
            <Row align="middle" gutter={24}>
              <Col flex="auto"><h2 style={{ margin: 0 }}><SettingOutlined /> Business Rules Engine</h2></Col>
              <Col><Button type="primary" icon={<PlusOutlined />} onClick={() => setAddRuleModalVisible(true)}>Add Rule</Button></Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Card>
        <Tabs items={[
          { key: 'rules', label: 'Active Rules', children: <Table columns={columns} dataSource={rules} rowKey="id" /> },
          { key: 'templates', label: 'Rule Templates', children: <div style={{ padding: 24, textAlign: 'center' }}><h3>Pre-configured rule templates</h3></div> },
        ]} />
      </Card>

      <Modal title="Add Business Rule" open={addRuleModalVisible} onCancel={() => setAddRuleModalVisible(false)} onOk={() => { message.success('Rule added'); setAddRuleModalVisible(false); }} width={600}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Rule Name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select><Select.Option value="accreditation">Accreditation</Select.Option><Select.Option value="limits">Limits</Select.Option><Select.Option value="compliance">Compliance</Select.Option><Select.Option value="transfer">Transfer</Select.Option></Select>
          </Form.Item>
          <Form.Item name="condition" label="Condition" rules={[{ required: true }]}><Input.TextArea rows={2} placeholder="e.g., investmentAmount > 500000" /></Form.Item>
          <Form.Item name="action" label="Action" rules={[{ required: true }]}>
            <Select><Select.Option value="block">Block Action</Select.Option><Select.Option value="approve">Require Approval</Select.Option><Select.Option value="notify">Send Notification</Select.Option></Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BusinessRulesPage;
