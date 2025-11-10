import { Card, Col, Row, Table, Tag, Button, Space, Form, InputNumber, Select, Switch } from 'antd';
import { DollarOutlined, PercentageOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { StatCard } from '../../../components/common';
import { useState } from 'react';

export default function FeeStructurePage() {
  const [editMode, setEditMode] = useState(false);

  const feeMetrics = {
    totalRevenue: 2790000,
    monthlyRevenue: 245000,
    avgFeeRate: 0.75,
    transactionCount: 8945,
  };

  const feeStructureData = [
    {
      key: '1',
      type: 'Transaction Fee',
      category: 'Trading',
      rate: 0.5,
      flatFee: null,
      minAmount: 1,
      maxAmount: null,
      status: 'active',
      revenue: 1250000,
    },
    {
      key: '2',
      type: 'Management Fee',
      category: 'Fund Management',
      rate: 2.0,
      flatFee: null,
      minAmount: null,
      maxAmount: null,
      status: 'active',
      revenue: 980000,
    },
    {
      key: '3',
      type: 'Performance Fee',
      category: 'Fund Management',
      rate: 20.0,
      flatFee: null,
      minAmount: null,
      maxAmount: null,
      status: 'active',
      revenue: 420000,
    },
    {
      key: '4',
      type: 'Deposit Fee',
      category: 'On-Ramp',
      rate: 0.3,
      flatFee: 5,
      minAmount: 100,
      maxAmount: null,
      status: 'active',
      revenue: 85000,
    },
    {
      key: '5',
      type: 'Withdrawal Fee',
      category: 'Off-Ramp',
      rate: 0.5,
      flatFee: 10,
      minAmount: 50,
      maxAmount: null,
      status: 'active',
      revenue: 55000,
    },
  ];

  const columns = [
    {
      title: 'Fee Type',
      dataIndex: 'type',
      key: 'type',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (cat: string) => <Tag>{cat}</Tag>,
    },
    {
      title: 'Rate (%)',
      dataIndex: 'rate',
      key: 'rate',
      render: (rate: number) => {
        if (editMode) {
          return <InputNumber min={0} max={100} step={0.1} defaultValue={rate} style={{ width: '100%' }} />;
        }
        return `${rate}%`;
      },
    },
    {
      title: 'Flat Fee ($)',
      dataIndex: 'flatFee',
      key: 'flatFee',
      render: (fee: number | null) => {
        if (editMode && fee !== null) {
          return <InputNumber min={0} step={1} defaultValue={fee} style={{ width: '100%' }} />;
        }
        return fee ? `$${fee}` : '-';
      },
    },
    {
      title: 'Min Amount',
      dataIndex: 'minAmount',
      key: 'minAmount',
      render: (amt: number | null) => amt ? `$${amt}` : '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        if (editMode) {
          return <Switch defaultChecked={status === 'active'} />;
        }
        return <Tag color={status === 'active' ? 'green' : 'red'}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Monthly Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (rev: number) => `$${(rev / 1000).toFixed(0)}K`,
      sorter: (a: any, b: any) => a.revenue - b.revenue,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
            Fee Structure Management
          </h1>
          <p style={{ color: '#8c8c8c', fontSize: '14px' }}>
            Configure platform fees and pricing
          </p>
        </div>
        <Space>
          {editMode ? (
            <>
              <Button onClick={() => setEditMode(false)}>Cancel</Button>
              <Button type="primary" icon={<SaveOutlined />} onClick={() => setEditMode(false)}>
                Save Changes
              </Button>
            </>
          ) : (
            <Button type="primary" icon={<EditOutlined />} onClick={() => setEditMode(true)}>
              Edit Fees
            </Button>
          )}
        </Space>
      </div>

      {/* Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Revenue"
            value={`$${(feeMetrics.totalRevenue / 1000).toFixed(0)}K`}
            icon={<DollarOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Monthly Revenue"
            value={`$${(feeMetrics.monthlyRevenue / 1000).toFixed(0)}K`}
            icon={<DollarOutlined />}
            trend={{ value: 12.5, isPositive: true }}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Avg Fee Rate"
            value={`${feeMetrics.avgFeeRate}%`}
            icon={<PercentageOutlined />}
            color="#722ed1"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Transactions"
            value={feeMetrics.transactionCount.toLocaleString()}
            icon={<DollarOutlined />}
            color="#fa8c16"
          />
        </Col>
      </Row>

      {/* Fee Structure Table */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Fee Configuration" bordered={false}>
            <Table
              dataSource={feeStructureData}
              columns={columns}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
