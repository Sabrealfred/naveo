import { useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Badge,
  Typography,
  Row,
  Col,
  Statistic,
  Alert,
  Divider,
  Tabs,
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

type ApprovalStatus = 'pending' | 'approved' | 'rejected';

interface Asset {
  id: string;
  fund_id: string;
  fund_name: string;
  fund_manager: string;
  symbol: string;
  name: string;
  type: string;
  quantity: number;
  purchase_price: number;
  current_price: number;
  total_value: number;
  purchase_date: string;
  submitted_date: string;
  approval_status: ApprovalStatus;
  approval_date?: string;
  rejection_reason?: string;
  description?: string;
}

const AssetApprovalPage = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [form] = Form.useForm();

  // Mock data
  const mockAssets: Asset[] = [
    {
      id: 'asset-001',
      fund_id: 'fund-001',
      fund_name: 'Alpha Crypto Fund',
      fund_manager: 'Sarah Johnson',
      symbol: 'BTC',
      name: 'Bitcoin',
      type: 'crypto',
      quantity: 15.5,
      purchase_price: 35200,
      current_price: 35850,
      total_value: 555675,
      purchase_date: '2025-10-15',
      submitted_date: '2025-11-08',
      approval_status: 'pending',
      description: 'Core holding for crypto portfolio. Blue-chip asset with strong fundamentals.',
    },
    {
      id: 'asset-002',
      fund_id: 'fund-001',
      fund_name: 'Alpha Crypto Fund',
      fund_manager: 'Sarah Johnson',
      symbol: 'ETH',
      name: 'Ethereum',
      type: 'crypto',
      quantity: 200,
      purchase_price: 1850,
      current_price: 1920,
      total_value: 384000,
      purchase_date: '2025-10-20',
      submitted_date: '2025-11-09',
      approval_status: 'pending',
      description: 'Smart contract platform, second-largest cryptocurrency by market cap.',
    },
    {
      id: 'asset-003',
      fund_id: 'fund-002',
      fund_name: 'Beta DeFi Fund',
      fund_manager: 'Michael Chen',
      symbol: 'USDC',
      name: 'USD Coin',
      type: 'stablecoin',
      quantity: 500000,
      purchase_price: 1,
      current_price: 1,
      total_value: 500000,
      purchase_date: '2025-11-01',
      submitted_date: '2025-11-10',
      approval_status: 'pending',
      description: 'Stablecoin reserve for liquidity management and trading operations.',
    },
    {
      id: 'asset-004',
      fund_id: 'fund-001',
      fund_name: 'Alpha Crypto Fund',
      fund_manager: 'Sarah Johnson',
      symbol: 'SOL',
      name: 'Solana',
      type: 'token',
      quantity: 2000,
      purchase_price: 42,
      current_price: 48,
      total_value: 96000,
      purchase_date: '2025-10-25',
      submitted_date: '2025-11-05',
      approval_status: 'approved',
      approval_date: '2025-11-06',
      description: 'High-performance blockchain for DeFi and NFTs.',
    },
    {
      id: 'asset-005',
      fund_id: 'fund-002',
      fund_name: 'Beta DeFi Fund',
      fund_manager: 'Michael Chen',
      symbol: 'DOGE',
      name: 'Dogecoin',
      type: 'crypto',
      quantity: 100000,
      purchase_price: 0.08,
      current_price: 0.075,
      total_value: 7500,
      purchase_date: '2025-11-02',
      submitted_date: '2025-11-07',
      approval_status: 'rejected',
      approval_date: '2025-11-08',
      rejection_reason: 'Asset does not meet fund investment criteria. Insufficient fundamentals and high speculative risk.',
    },
  ];

  const [assets, setAssets] = useState<Asset[]>(mockAssets);

  const pendingCount = assets.filter((a) => a.approval_status === 'pending').length;
  const approvedCount = assets.filter((a) => a.approval_status === 'approved').length;
  const rejectedCount = assets.filter((a) => a.approval_status === 'rejected').length;

  const handleApprove = (asset: Asset) => {
    setSelectedAsset(asset);
    setApproveModalVisible(true);
  };

  const handleReject = (asset: Asset) => {
    setSelectedAsset(asset);
    form.resetFields();
    setRejectModalVisible(true);
  };

  const confirmApproval = () => {
    if (!selectedAsset) return;

    Modal.confirm({
      title: 'Approve Asset',
      content: `Are you sure you want to approve ${selectedAsset.name} (${selectedAsset.symbol}) for ${selectedAsset.fund_name}? Once approved, this asset will be visible to investors in the marketplace.`,
      okText: 'Approve',
      okType: 'primary',
      cancelText: 'Cancel',
      onOk: () => {
        setAssets((prev) =>
          prev.map((asset) =>
            asset.id === selectedAsset.id
              ? {
                  ...asset,
                  approval_status: 'approved' as ApprovalStatus,
                  approval_date: dayjs().format('YYYY-MM-DD'),
                }
              : asset
          )
        );
        message.success(`Asset ${selectedAsset.symbol} has been approved successfully`);
        setApproveModalVisible(false);
        setSelectedAsset(null);
      },
    });
  };

  const confirmRejection = () => {
    form.validateFields().then((values) => {
      if (!selectedAsset) return;

      setAssets((prev) =>
        prev.map((asset) =>
          asset.id === selectedAsset.id
            ? {
                ...asset,
                approval_status: 'rejected' as ApprovalStatus,
                approval_date: dayjs().format('YYYY-MM-DD'),
                rejection_reason: values.reason,
              }
            : asset
        )
      );

      message.warning(`Asset ${selectedAsset.symbol} has been rejected`);
      setRejectModalVisible(false);
      setSelectedAsset(null);
      form.resetFields();
    });
  };

  const columns: ColumnsType<Asset> = [
    {
      title: 'Asset',
      key: 'asset',
      render: (record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.symbol}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.name}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'crypto' ? 'blue' : type === 'stablecoin' ? 'green' : 'purple'}>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Fund / Manager',
      key: 'fund',
      render: (record) => (
        <Space direction="vertical" size={0}>
          <Text>{record.fund_name}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.fund_manager}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'right',
      render: (qty) => qty.toLocaleString(undefined, { maximumFractionDigits: 8 }),
    },
    {
      title: 'Total Value',
      dataIndex: 'total_value',
      key: 'total_value',
      align: 'right',
      render: (value) => `$${value.toLocaleString()}`,
      sorter: (a, b) => a.total_value - b.total_value,
    },
    {
      title: 'P&L',
      key: 'pnl',
      align: 'right',
      render: (record) => {
        const pnl =
          ((record.current_price - record.purchase_price) / record.purchase_price) * 100;
        return (
          <Tag color={pnl >= 0 ? 'green' : 'red'}>
            {pnl >= 0 ? '+' : ''}
            {pnl.toFixed(2)}%
          </Tag>
        );
      },
    },
    {
      title: 'Submitted',
      dataIndex: 'submitted_date',
      key: 'submitted_date',
      render: (date) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Status',
      dataIndex: 'approval_status',
      key: 'approval_status',
      render: (status: ApprovalStatus) => {
        const config = {
          pending: { color: 'warning', icon: <ClockCircleOutlined />, text: 'Pending' },
          approved: { color: 'success', icon: <CheckCircleOutlined />, text: 'Approved' },
          rejected: { color: 'error', icon: <CloseCircleOutlined />, text: 'Rejected' },
        };
        const cfg = config[status];
        return (
          <Tag icon={cfg.icon} color={cfg.color}>
            {cfg.text}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 220,
      render: (record) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedAsset(record);
              setDetailsModalVisible(true);
            }}
          >
            View
          </Button>
          {record.approval_status === 'pending' && (
            <>
              <Button
                size="small"
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handleApprove(record)}
              >
                Approve
              </Button>
              <Button
                size="small"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleReject(record)}
              >
                Reject
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const filteredAssets = assets.filter((asset) => {
    if (activeTab === 'all') return true;
    return asset.approval_status === activeTab;
  });

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 24 }}>
        <Typography.Title level={2}>
          <CheckCircleOutlined /> Asset Approval Management
        </Typography.Title>
        <Paragraph type="secondary">
          Review and approve assets submitted by fund managers. Approved assets will be visible to
          investors in the marketplace.
        </Paragraph>
      </div>

      <Alert
        message="Asset Approval Workflow"
        description="Fund managers submit assets for approval. Review each asset carefully before approving or rejecting. Approved assets will automatically appear in the investor marketplace."
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        closable
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Pending Approval"
              value={pendingCount}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Requires immediate attention
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Approved (Total)"
              value={approvedCount}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Visible to investors
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Rejected (Total)"
              value={rejectedCount}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Returned to fund manager
            </Text>
          </Card>
        </Col>
      </Row>

      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'pending',
              label: (
                <span>
                  <ClockCircleOutlined />
                  Pending
                  <Badge
                    count={pendingCount}
                    offset={[10, 0]}
                    style={{ backgroundColor: '#faad14' }}
                  />
                </span>
              ),
              children: (
                <Table
                  columns={columns}
                  dataSource={filteredAssets}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 1200 }}
                />
              ),
            },
            {
              key: 'approved',
              label: (
                <span>
                  <CheckCircleOutlined />
                  Approved
                  <Badge
                    count={approvedCount}
                    offset={[10, 0]}
                    style={{ backgroundColor: '#52c41a' }}
                  />
                </span>
              ),
              children: (
                <Table
                  columns={columns}
                  dataSource={filteredAssets}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 1200 }}
                />
              ),
            },
            {
              key: 'rejected',
              label: (
                <span>
                  <CloseCircleOutlined />
                  Rejected
                  <Badge
                    count={rejectedCount}
                    offset={[10, 0]}
                    style={{ backgroundColor: '#ff4d4f' }}
                  />
                </span>
              ),
              children: (
                <Table
                  columns={columns}
                  dataSource={filteredAssets}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 1200 }}
                />
              ),
            },
            {
              key: 'all',
              label: (
                <span>
                  <InfoCircleOutlined />
                  All Assets
                </span>
              ),
              children: (
                <Table
                  columns={columns}
                  dataSource={filteredAssets}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 1200 }}
                />
              ),
            },
          ]}
        />
      </Card>

      {/* Details Modal */}
      <Modal
        title={
          <Space>
            <InfoCircleOutlined />
            <span>Asset Details</span>
          </Space>
        }
        open={detailsModalVisible}
        onCancel={() => {
          setDetailsModalVisible(false);
          setSelectedAsset(null);
        }}
        footer={
          selectedAsset?.approval_status === 'pending'
            ? [
                <Button
                  key="reject"
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={() => {
                    setDetailsModalVisible(false);
                    handleReject(selectedAsset);
                  }}
                >
                  Reject
                </Button>,
                <Button
                  key="approve"
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={() => {
                    setDetailsModalVisible(false);
                    handleApprove(selectedAsset);
                  }}
                >
                  Approve
                </Button>,
              ]
            : [
                <Button
                  key="close"
                  onClick={() => {
                    setDetailsModalVisible(false);
                    setSelectedAsset(null);
                  }}
                >
                  Close
                </Button>,
              ]
        }
        width={700}
      >
        {selectedAsset && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Alert
              message={
                selectedAsset.approval_status === 'pending'
                  ? 'Pending Review'
                  : selectedAsset.approval_status === 'approved'
                  ? 'Approved'
                  : 'Rejected'
              }
              description={
                selectedAsset.approval_status === 'pending'
                  ? `Submitted on ${dayjs(selectedAsset.submitted_date).format('MMMM DD, YYYY')}`
                  : selectedAsset.approval_status === 'approved'
                  ? `Approved on ${dayjs(selectedAsset.approval_date).format('MMMM DD, YYYY')}`
                  : `Rejected on ${dayjs(selectedAsset.approval_date).format('MMMM DD, YYYY')}`
              }
              type={
                selectedAsset.approval_status === 'pending'
                  ? 'warning'
                  : selectedAsset.approval_status === 'approved'
                  ? 'success'
                  : 'error'
              }
              showIcon
            />

            <Card title="Asset Information" size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Row>
                  <Col span={8}>
                    <Text type="secondary">Symbol:</Text>
                  </Col>
                  <Col span={16}>
                    <Text strong>{selectedAsset.symbol}</Text>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <Text type="secondary">Name:</Text>
                  </Col>
                  <Col span={16}>
                    <Text>{selectedAsset.name}</Text>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <Text type="secondary">Type:</Text>
                  </Col>
                  <Col span={16}>
                    <Tag
                      color={
                        selectedAsset.type === 'crypto'
                          ? 'blue'
                          : selectedAsset.type === 'stablecoin'
                          ? 'green'
                          : 'purple'
                      }
                    >
                      {selectedAsset.type.toUpperCase()}
                    </Tag>
                  </Col>
                </Row>
                {selectedAsset.description && (
                  <>
                    <Divider style={{ margin: '8px 0' }} />
                    <Row>
                      <Col span={24}>
                        <Text type="secondary">Description:</Text>
                        <Paragraph style={{ marginTop: 8, marginBottom: 0 }}>
                          {selectedAsset.description}
                        </Paragraph>
                      </Col>
                    </Row>
                  </>
                )}
              </Space>
            </Card>

            <Card title="Fund Information" size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Row>
                  <Col span={8}>
                    <Text type="secondary">Fund Name:</Text>
                  </Col>
                  <Col span={16}>
                    <Text strong>{selectedAsset.fund_name}</Text>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <Text type="secondary">Fund Manager:</Text>
                  </Col>
                  <Col span={16}>
                    <Text>{selectedAsset.fund_manager}</Text>
                  </Col>
                </Row>
              </Space>
            </Card>

            <Card title="Financial Details" size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Row>
                  <Col span={12}>
                    <Text type="secondary">Quantity:</Text>
                    <div>
                      <Text strong style={{ fontSize: 16 }}>
                        {selectedAsset.quantity.toLocaleString(undefined, {
                          maximumFractionDigits: 8,
                        })}
                      </Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">Total Value:</Text>
                    <div>
                      <Text strong style={{ fontSize: 16 }}>
                        ${selectedAsset.total_value.toLocaleString()}
                      </Text>
                    </div>
                  </Col>
                </Row>
                <Divider style={{ margin: '8px 0' }} />
                <Row>
                  <Col span={12}>
                    <Text type="secondary">Purchase Price:</Text>
                    <div>
                      <Text>${selectedAsset.purchase_price.toLocaleString()}</Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">Current Price:</Text>
                    <div>
                      <Text>${selectedAsset.current_price.toLocaleString()}</Text>
                    </div>
                  </Col>
                </Row>
                <Divider style={{ margin: '8px 0' }} />
                <Row>
                  <Col span={12}>
                    <Text type="secondary">Purchase Date:</Text>
                    <div>
                      <Text>{dayjs(selectedAsset.purchase_date).format('MMM DD, YYYY')}</Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">P&L:</Text>
                    <div>
                      <Tag
                        color={
                          selectedAsset.current_price >= selectedAsset.purchase_price
                            ? 'green'
                            : 'red'
                        }
                        style={{ fontSize: 14 }}
                      >
                        {selectedAsset.current_price >= selectedAsset.purchase_price ? '+' : ''}
                        {(
                          ((selectedAsset.current_price - selectedAsset.purchase_price) /
                            selectedAsset.purchase_price) *
                          100
                        ).toFixed(2)}
                        %
                      </Tag>
                    </div>
                  </Col>
                </Row>
              </Space>
            </Card>

            {selectedAsset.rejection_reason && (
              <Alert
                message="Rejection Reason"
                description={selectedAsset.rejection_reason}
                type="error"
                showIcon
                icon={<WarningOutlined />}
              />
            )}
          </Space>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        title={
          <Space>
            <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
            <span>Reject Asset</span>
          </Space>
        }
        open={rejectModalVisible}
        onCancel={() => {
          setRejectModalVisible(false);
          setSelectedAsset(null);
          form.resetFields();
        }}
        onOk={confirmRejection}
        okText="Reject Asset"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
      >
        {selectedAsset && (
          <>
            <Alert
              message="You are about to reject this asset"
              description={`${selectedAsset.name} (${selectedAsset.symbol}) from ${selectedAsset.fund_name}. Please provide a detailed reason for rejection so the fund manager can address the issues.`}
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <Form form={form} layout="vertical">
              <Form.Item
                name="reason"
                label="Rejection Reason"
                rules={[
                  {
                    required: true,
                    message: 'Please provide a reason for rejection',
                  },
                  {
                    min: 10,
                    message: 'Please provide a more detailed reason (at least 10 characters)',
                  },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Explain why this asset is being rejected. Be specific so the fund manager can make necessary corrections."
                />
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>
    </div>
  );
};

export default AssetApprovalPage;
