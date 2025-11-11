import { Card, Row, Col, Button, Table, Progress, Tag, Modal, Form, InputNumber, Select, Space, Statistic, Alert, Timeline } from 'antd';
import {
  SyncOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ReloadOutlined,
  SaveOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { Pie, Column } from '@ant-design/charts';
import { useState } from 'react';

export default function RebalancingPage() {
  const [rebalanceModalVisible, setRebalanceModalVisible] = useState(false);
  const [targetModalVisible, setTargetModalVisible] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [form] = Form.useForm();

  // Mock data for current portfolio allocation
  const currentAllocation = [
    {
      id: 1,
      asset: 'Bitcoin (BTC)',
      current: 35.2,
      target: 30.0,
      value: 4326000,
      amount: 102.5,
      status: 'over',
      drift: 5.2
    },
    {
      id: 2,
      asset: 'Ethereum (ETH)',
      current: 28.5,
      target: 30.0,
      value: 3502500,
      amount: 1556.8,
      status: 'under',
      drift: -1.5
    },
    {
      id: 3,
      asset: 'USD Coin (USDC)',
      current: 15.0,
      target: 20.0,
      value: 1845000,
      amount: 1845000,
      status: 'under',
      drift: -5.0
    },
    {
      id: 4,
      asset: 'Polygon (MATIC)',
      current: 12.3,
      target: 10.0,
      value: 1512900,
      amount: 2106944,
      status: 'over',
      drift: 2.3
    },
    {
      id: 5,
      asset: 'Chainlink (LINK)',
      current: 9.0,
      target: 10.0,
      value: 1107000,
      amount: 77142,
      status: 'under',
      drift: -1.0
    },
  ];

  const totalPortfolioValue = currentAllocation.reduce((sum, item) => sum + item.value, 0);

  // Calculate rebalancing actions needed
  const rebalancingActions = currentAllocation.map(item => {
    const targetValue = (item.target / 100) * totalPortfolioValue;
    const difference = item.value - targetValue;
    const action = difference > 0 ? 'Sell' : 'Buy';
    const amount = Math.abs(difference);

    return {
      ...item,
      targetValue,
      difference,
      action,
      actionAmount: amount,
    };
  }).filter(item => Math.abs(item.drift) > 0.5); // Only show actions needed

  // Historical rebalancing data
  const rebalancingHistory = [
    {
      id: 1,
      date: '2024-10-15',
      type: 'Scheduled',
      status: 'Completed',
      trades: 8,
      value: 2450000,
      driftBefore: 6.2,
      driftAfter: 0.3,
    },
    {
      id: 2,
      date: '2024-09-15',
      type: 'Threshold',
      status: 'Completed',
      trades: 5,
      value: 1820000,
      driftBefore: 5.8,
      driftAfter: 0.5,
    },
    {
      id: 3,
      date: '2024-08-15',
      type: 'Scheduled',
      status: 'Completed',
      trades: 7,
      value: 2150000,
      driftBefore: 4.5,
      driftAfter: 0.4,
    },
  ];

  // Chart configurations
  const currentVsTargetData = currentAllocation.map(item => [
    { asset: item.asset, value: item.current, type: 'Current' },
    { asset: item.asset, value: item.target, type: 'Target' },
  ]).flat();

  const allocationComparisonConfig = {
    data: currentVsTargetData,
    xField: 'asset',
    yField: 'value',
    seriesField: 'type',
    isGroup: true,
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    label: {
      position: 'top' as const,
      formatter: (datum: any) => `${datum.value.toFixed(1)}%`,
    },
  };

  const driftDistributionData = currentAllocation.map(item => ({
    asset: item.asset.split(' ')[0],
    drift: item.drift,
  }));

  const driftChartConfig = {
    data: driftDistributionData,
    xField: 'asset',
    yField: 'drift',
    seriesField: 'asset',
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    color: (datum: any) => {
      return datum.drift > 0 ? '#ff4d4f' : '#52c41a';
    },
    label: {
      position: 'top' as const,
      formatter: (datum: any) => `${datum.drift > 0 ? '+' : ''}${datum.drift.toFixed(1)}%`,
    },
  };

  // Table columns
  const allocationColumns = [
    {
      title: 'Asset',
      dataIndex: 'asset',
      key: 'asset',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Current %',
      dataIndex: 'current',
      key: 'current',
      sorter: (a: any, b: any) => a.current - b.current,
      render: (value: number) => `${value.toFixed(2)}%`,
    },
    {
      title: 'Target %',
      dataIndex: 'target',
      key: 'target',
      render: (value: number) => `${value.toFixed(2)}%`,
    },
    {
      title: 'Drift',
      dataIndex: 'drift',
      key: 'drift',
      sorter: (a: any, b: any) => Math.abs(b.drift) - Math.abs(a.drift),
      render: (drift: number) => (
        <span style={{ color: Math.abs(drift) > 3 ? '#ff4d4f' : Math.abs(drift) > 1 ? '#fa8c16' : '#52c41a' }}>
          {drift > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {Math.abs(drift).toFixed(2)}%
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Over-weighted', value: 'over' },
        { text: 'Under-weighted', value: 'under' },
        { text: 'On Target', value: 'target' },
      ],
      onFilter: (value: any, record: any) => record.status === value,
      render: (status: string) => (
        <Tag color={status === 'over' ? 'red' : status === 'under' ? 'orange' : 'green'}>
          {status === 'over' ? 'Over-weighted' : status === 'under' ? 'Under-weighted' : 'On Target'}
        </Tag>
      ),
    },
    {
      title: 'Current Value',
      dataIndex: 'value',
      key: 'value',
      sorter: (a: any, b: any) => a.value - b.value,
      render: (value: number) => `$${(value / 1000000).toFixed(2)}M`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button
          size="small"
          onClick={() => {
            setSelectedAsset(record);
            setTargetModalVisible(true);
          }}
        >
          Adjust Target
        </Button>
      ),
    },
  ];

  const actionsColumns = [
    {
      title: 'Asset',
      dataIndex: 'asset',
      key: 'asset',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (action: string) => (
        <Tag color={action === 'Buy' ? 'green' : 'red'}>{action}</Tag>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'actionAmount',
      key: 'actionAmount',
      render: (value: number) => `$${(value / 1000).toFixed(2)}K`,
    },
    {
      title: 'Current',
      dataIndex: 'current',
      key: 'current',
      render: (value: number) => `${value.toFixed(2)}%`,
    },
    {
      title: 'Target',
      dataIndex: 'target',
      key: 'target',
      render: (value: number) => `${value.toFixed(2)}%`,
    },
  ];

  const historyColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'Scheduled' ? 'blue' : 'orange'}>{type}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color="green" icon={<CheckCircleOutlined />}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Trades',
      dataIndex: 'trades',
      key: 'trades',
    },
    {
      title: 'Value Rebalanced',
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => `$${(value / 1000000).toFixed(2)}M`,
    },
    {
      title: 'Drift Before',
      dataIndex: 'driftBefore',
      key: 'driftBefore',
      render: (value: number) => `${value.toFixed(1)}%`,
    },
    {
      title: 'Drift After',
      dataIndex: 'driftAfter',
      key: 'driftAfter',
      render: (value: number) => `${value.toFixed(1)}%`,
    },
  ];

  // Calculate max drift
  const maxDrift = Math.max(...currentAllocation.map(item => Math.abs(item.drift)));
  const needsRebalancing = maxDrift > 3;

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '28px' }}>
            Portfolio Rebalancing
          </h1>
          <p style={{ margin: '8px 0 0 0', color: '#666' }}>
            Monitor and execute portfolio rebalancing strategies
          </p>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />}>Refresh</Button>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={() => setRebalanceModalVisible(true)}
            danger={needsRebalancing}
          >
            {needsRebalancing ? 'Execute Rebalancing' : 'Rebalance Portfolio'}
          </Button>
        </Space>
      </div>

      {/* Alert for rebalancing needed */}
      {needsRebalancing && (
        <Alert
          message="Rebalancing Recommended"
          description={`Maximum drift detected: ${maxDrift.toFixed(2)}%. Portfolio allocation has deviated beyond acceptable threshold (3%). Consider rebalancing to maintain target allocation.`}
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          style={{ marginBottom: 24 }}
          action={
            <Button size="small" type="primary" onClick={() => setRebalanceModalVisible(true)}>
              Rebalance Now
            </Button>
          }
        />
      )}

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Portfolio Value"
              value={totalPortfolioValue}
              precision={2}
              prefix="$"
              valueStyle={{ color: '#1890ff', fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Max Drift"
              value={maxDrift}
              precision={2}
              suffix="%"
              valueStyle={{
                color: maxDrift > 5 ? '#ff4d4f' : maxDrift > 3 ? '#fa8c16' : '#52c41a',
                fontSize: '24px'
              }}
              prefix={maxDrift > 3 ? <WarningOutlined /> : <CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Assets Monitored"
              value={currentAllocation.length}
              valueStyle={{ fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Last Rebalance"
              value="26"
              suffix="days ago"
              valueStyle={{ fontSize: '24px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Current vs Target Allocation">
            <Column {...allocationComparisonConfig} height={300} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Allocation Drift">
            <Column {...driftChartConfig} height={300} />
          </Card>
        </Col>
      </Row>

      {/* Current Allocation Table */}
      <Card title="Current Portfolio Allocation" style={{ marginBottom: 24 }}>
        <Table
          columns={allocationColumns}
          dataSource={currentAllocation}
          rowKey="id"
          pagination={false}
          rowClassName={(record) =>
            Math.abs(record.drift) > 5 ? 'rebalance-critical' :
            Math.abs(record.drift) > 3 ? 'rebalance-warning' : ''
          }
        />
      </Card>

      {/* Rebalancing Actions Needed */}
      {rebalancingActions.length > 0 && (
        <Card title="Recommended Rebalancing Actions" style={{ marginBottom: 24 }}>
          <Table
            columns={actionsColumns}
            dataSource={rebalancingActions}
            rowKey="id"
            pagination={false}
          />
        </Card>
      )}

      {/* Rebalancing History */}
      <Card title="Rebalancing History">
        <Table
          columns={historyColumns}
          dataSource={rebalancingHistory}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Rebalance Execution Modal */}
      <Modal
        title="Execute Portfolio Rebalancing"
        open={rebalanceModalVisible}
        onCancel={() => setRebalanceModalVisible(false)}
        width={700}
        footer={[
          <Button key="cancel" onClick={() => setRebalanceModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="simulate" onClick={() => Modal.info({ title: 'Simulation Complete', content: 'Rebalancing simulation completed. Review actions above.' })}>
            Simulate
          </Button>,
          <Button key="execute" type="primary" danger onClick={() => {
            Modal.success({
              title: 'Rebalancing Initiated',
              content: 'Portfolio rebalancing has been initiated. Trades will be executed shortly.'
            });
            setRebalanceModalVisible(false);
          }}>
            Execute Rebalancing
          </Button>,
        ]}
      >
        <div style={{ marginBottom: 16 }}>
          <Alert
            message="Review Rebalancing Actions"
            description="The following trades will be executed to rebalance your portfolio to target allocation."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        </div>

        <Timeline
          items={rebalancingActions.map((action, index) => ({
            color: action.action === 'Buy' ? 'green' : 'red',
            children: (
              <div>
                <strong>{action.action} {action.asset}</strong>
                <br />
                <span style={{ color: '#666', fontSize: '13px' }}>
                  Amount: ${(action.actionAmount / 1000).toFixed(2)}K |
                  {action.current.toFixed(2)}% → {action.target.toFixed(2)}%
                </span>
              </div>
            ),
          }))}
        />

        <div style={{ marginTop: 16, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Statistic title="Total Trades" value={rebalancingActions.length} />
            </Col>
            <Col span={12}>
              <Statistic
                title="Total Value"
                value={rebalancingActions.reduce((sum, a) => sum + a.actionAmount, 0)}
                prefix="$"
                precision={0}
              />
            </Col>
          </Row>
        </div>
      </Modal>

      {/* Target Adjustment Modal */}
      <Modal
        title={`Adjust Target Allocation - ${selectedAsset?.asset}`}
        open={targetModalVisible}
        onCancel={() => setTargetModalVisible(false)}
        onOk={() => {
          form.validateFields().then(() => {
            Modal.success({ title: 'Target Updated', content: 'Target allocation has been updated successfully.' });
            setTargetModalVisible(false);
            form.resetFields();
          });
        }}
      >
        <Form form={form} layout="vertical" initialValues={{ target: selectedAsset?.target }}>
          <Form.Item
            label="Current Allocation"
            name="current"
          >
            <span style={{ fontSize: '16px', fontWeight: 500 }}>
              {selectedAsset?.current.toFixed(2)}%
            </span>
          </Form.Item>

          <Form.Item
            label="Target Allocation (%)"
            name="target"
            rules={[
              { required: true, message: 'Please enter target allocation' },
              { type: 'number', min: 0, max: 100, message: 'Must be between 0 and 100' },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              max={100}
              step={0.1}
              precision={1}
            />
          </Form.Item>

          <Alert
            message="Note"
            description="Changing target allocation will affect the overall portfolio balance. Ensure total allocations sum to 100%."
            type="info"
            showIcon
          />
        </Form>
      </Modal>

      <style>{`
        .rebalance-critical {
          background-color: #fff2f0 !important;
        }
        .rebalance-warning {
          background-color: #fffbe6 !important;
        }
      `}</style>
    </div>
  );
}
