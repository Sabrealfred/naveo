import { Card, Row, Col, Table, Tag, Button, Statistic, Tabs, Space, Modal, Form, Input, Select, message } from 'antd';
import { DollarCircleOutlined, FireOutlined, SwapOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';

interface TokenOperation {
  id: string;
  type: 'mint' | 'burn' | 'transfer';
  tokenSymbol: string;
  amount: string;
  from?: string;
  to?: string;
  txHash: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
}

const TokenLifecyclePage = () => {
  const [activeTab, setActiveTab] = useState('operations');
  const [mintModalVisible, setMintModalVisible] = useState(false);
  const [form] = Form.useForm();

  const operations: TokenOperation[] = [
    { id: '1', type: 'mint', tokenSymbol: 'NVT', amount: '1,000,000', to: '0x742d...', txHash: '0xabc123...', status: 'completed', timestamp: '2024-11-10 09:30' },
    { id: '2', type: 'transfer', tokenSymbol: 'NVT', amount: '50,000', from: '0x742d...', to: '0x8e23...', txHash: '0xdef456...', status: 'completed', timestamp: '2024-11-10 09:15' },
    { id: '3', type: 'burn', tokenSymbol: 'NVT', amount: '10,000', from: '0x1a2b...', txHash: '0xghi789...', status: 'completed', timestamp: '2024-11-09 14:20' },
  ];

  const columns: ColumnsType<TokenOperation> = [
    { title: 'Type', dataIndex: 'type', key: 'type', render: (type) => <Tag color={type === 'mint' ? 'green' : type === 'burn' ? 'red' : 'blue'}>{type.toUpperCase()}</Tag> },
    { title: 'Token', dataIndex: 'tokenSymbol', key: 'tokenSymbol', render: (symbol) => <strong>{symbol}</strong> },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'From', dataIndex: 'from', key: 'from', render: (addr) => addr ? <code style={{ fontSize: 10 }}>{addr}</code> : '-' },
    { title: 'To', dataIndex: 'to', key: 'to', render: (addr) => addr ? <code style={{ fontSize: 10 }}>{addr}</code> : '-' },
    { title: 'Tx Hash', dataIndex: 'txHash', key: 'txHash', render: (hash) => <code style={{ fontSize: 10 }}>{hash}</code> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'completed' ? 'green' : status === 'pending' ? 'orange' : 'red'}>{status}</Tag> },
    { title: 'Time', dataIndex: 'timestamp', key: 'timestamp' },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card>
            <Row align="middle" gutter={24}>
              <Col flex="auto"><h2 style={{ margin: 0 }}><DollarCircleOutlined /> Token Lifecycle Management</h2></Col>
              <Col><Button type="primary" icon={<PlusOutlined />} onClick={() => setMintModalVisible(true)}>Mint Tokens</Button></Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={8}><Card><Statistic title="Total Minted" value="5.2M" prefix={<DollarCircleOutlined />} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col xs={24} lg={8}><Card><Statistic title="Total Burned" value="120K" prefix={<FireOutlined />} valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
        <Col xs={24} lg={8}><Card><Statistic title="Circulating Supply" value="5.08M" prefix={<SwapOutlined />} valueStyle={{ color: '#1890ff' }} /></Card></Col>
      </Row>

      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={[
          { key: 'operations', label: 'Token Operations', children: <Table columns={columns} dataSource={operations} rowKey="id" /> },
          { key: 'supply', label: 'Supply Management', children: <div style={{ padding: 24, textAlign: 'center' }}><h3>Supply tracking and cap management</h3></div> },
        ]} />
      </Card>

      <Modal title="Mint Tokens" open={mintModalVisible} onCancel={() => setMintModalVisible(false)} onOk={() => { message.success('Tokens minted'); setMintModalVisible(false); }}>
        <Form form={form} layout="vertical">
          <Form.Item name="token" label="Token" rules={[{ required: true }]}><Select><Select.Option value="NVT">NVT</Select.Option></Select></Form.Item>
          <Form.Item name="amount" label="Amount" rules={[{ required: true }]}><Input type="number" /></Form.Item>
          <Form.Item name="recipient" label="Recipient Address" rules={[{ required: true }]}><Input placeholder="0x..." /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TokenLifecyclePage;
