import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  message,
  Skeleton,
  Spin,
  Alert,
  Timeline,
  Divider,
  Typography,
  Badge,
  Tooltip,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SendOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { Line } from '@ant-design/charts';
import { StatCard } from '../../../components/common';
import { assetsService, fundsService } from '../../../services';
import type { Asset as AssetType } from '../../../services/types';
import { useTranslation } from 'react-i18next';

const { Text, Paragraph } = Typography;

type ApprovalStatus = 'draft' | 'pending' | 'approved' | 'rejected';

interface Asset extends AssetType {
  change24h?: number;
  approval_status?: ApprovalStatus;
  approval_date?: string;
  rejection_reason?: string;
  submitted_date?: string;
  description?: string;
}

interface AssetFormValues {
  symbol: string;
  name: string;
  type: string;
  quantity: number;
  purchase_price: number;
  current_price: number;
  purchase_date: dayjs.Dayjs;
  description?: string;
}

const usePortfolioMetrics = (assets: Asset[]) =>
  useMemo(() => {
    const totalValue = assets.reduce((acc, asset) => acc + (asset.quantity || 0) * (asset.current_price || 0), 0);
    const assetsWithPerformance = assets.map((asset) => ({
      ...asset,
      performance:
        ((asset.current_price || 0) - (asset.purchase_price || 0)) / (asset.purchase_price || 1) * 100,
    }));

    const bestPerformer = [...assetsWithPerformance].sort(
      (a, b) => (b.performance || 0) - (a.performance || 0)
    )[0];
    const worstPerformer = [...assetsWithPerformance].sort(
      (a, b) => (a.performance || 0) - (b.performance || 0)
    )[0];

    const pendingApproval = assets.filter((a) => a.approval_status === 'pending').length;
    const approvedAssets = assets.filter((a) => a.approval_status === 'approved').length;
    const draftAssets = assets.filter((a) => a.approval_status === 'draft').length;

    return {
      totalAssets: assets.length,
      totalValue,
      bestPerformer,
      worstPerformer,
      pendingApproval,
      approvedAssets,
      draftAssets,
    };
  }, [assets]);

const AssetFormModal = ({
  open,
  title,
  initialValues,
  onSubmit,
  onCancel,
}: {
  open: boolean;
  title: string;
  initialValues?: AssetFormValues;
  onSubmit: (values: AssetFormValues) => void;
  onCancel: () => void;
}) => {
  const [form] = Form.useForm<AssetFormValues>();
  const { t } = useTranslation();

  const assetTypeOptions = [
    { label: t('adminClient.assets.crypto', 'Crypto'), value: 'crypto' },
    { label: t('adminClient.assets.token', 'Token'), value: 'token' },
    { label: t('adminClient.assets.stablecoin', 'Stablecoin'), value: 'stablecoin' },
  ];

  const handleOk = async () => {
    const values = await form.validateFields();
    onSubmit(values);
  };

  return (
    <Modal
      open={open}
      title={title}
      okText={t('adminClient.assets.save', 'Save')}
      cancelText={t('common.cancel', 'Cancel')}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      destroyOnClose
      width={600}
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={
          initialValues ?? {
            purchase_date: dayjs(),
            type: 'crypto',
            current_price: 0,
          }
        }
      >
        <Form.Item
          name="symbol"
          label={t('adminClient.assets.symbol', 'Symbol')}
          rules={[{ required: true, message: t('adminClient.assets.enterSymbol', 'Please enter symbol') }]}
        >
          <Input placeholder="BTC" />
        </Form.Item>
        <Form.Item
          name="name"
          label={t('adminClient.assets.name', 'Name')}
          rules={[{ required: true, message: t('adminClient.assets.enterName', 'Please enter name') }]}
        >
          <Input placeholder="Bitcoin" />
        </Form.Item>
        <Form.Item
          name="description"
          label={t('adminClient.assets.description', 'Description')}
        >
          <Input.TextArea
            placeholder="Brief description of the asset..."
            rows={3}
          />
        </Form.Item>
        <Form.Item
          name="type"
          label={t('adminClient.assets.type', 'Type')}
          rules={[{ required: true }]}
        >
          <Select options={assetTypeOptions} />
        </Form.Item>
        <Form.Item
          name="quantity"
          label={t('adminClient.assets.quantity', 'Quantity')}
          rules={[
            { required: true, message: t('adminClient.assets.enterQuantity', 'Please enter quantity') },
          ]}
        >
          <InputNumber min={0} precision={8} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="purchase_price"
          label={t('adminClient.assets.purchasePrice', 'Purchase Price')}
          rules={[
            {
              required: true,
              message: t('adminClient.assets.enterPurchasePrice', 'Please enter purchase price'),
            },
          ]}
        >
          <InputNumber min={0} prefix="$" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="current_price"
          label={t('adminClient.assets.currentPrice', 'Current Price')}
          tooltip={t('adminClient.assets.marketReference', 'Market reference price')}
          rules={[
            {
              required: true,
              message: t('adminClient.assets.enterCurrentPrice', 'Please enter current price'),
            },
          ]}
        >
          <InputNumber min={0} prefix="$" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="purchase_date"
          label={t('adminClient.assets.purchaseDate', 'Purchase Date')}
          rules={[{ required: true, message: t('adminClient.assets.selectDate', 'Please select date') }]}
        >
          <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const AssetDetailsModal = ({
  asset,
  open,
  onClose,
}: {
  asset: Asset | null;
  open: boolean;
  onClose: () => void;
}) => {
  const { t } = useTranslation();

  const priceHistory = useMemo(() => {
    if (!asset) return [];
    const basePrice = asset.current_price || 0;
    return Array.from({ length: 12 }).map((_, idx) => ({
      month: dayjs()
        .subtract(11 - idx, 'month')
        .format('MMM YYYY'),
      value: basePrice * (1 + Math.sin(idx / 3) * 0.08),
    }));
  }, [asset]);

  const performance = asset
    ? ((asset.current_price || 0) - (asset.purchase_price || 0)) / (asset.purchase_price || 1) * 100
    : 0;

  const getStatusConfig = (status?: ApprovalStatus) => {
    switch (status) {
      case 'approved':
        return { color: 'success', icon: <CheckCircleOutlined />, text: 'Approved' };
      case 'pending':
        return { color: 'warning', icon: <ClockCircleOutlined />, text: 'Pending Approval' };
      case 'rejected':
        return { color: 'error', icon: <CloseCircleOutlined />, text: 'Rejected' };
      default:
        return { color: 'default', icon: <InfoCircleOutlined />, text: 'Draft' };
    }
  };

  const statusConfig = getStatusConfig(asset?.approval_status);

  return (
    <Modal
      open={open}
      title={t('adminClient.assets.detailOf', 'Asset Detail: {{name}}', { name: asset?.name ?? '' })}
      width={720}
      footer={null}
      onCancel={onClose}
    >
      {asset && (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Alert
            message={
              <Space>
                {statusConfig.icon}
                <span>Status: {statusConfig.text}</span>
              </Space>
            }
            description={
              <>
                {asset.approval_status === 'pending' && asset.submitted_date && (
                  <Text type="secondary">Submitted for approval on {asset.submitted_date}</Text>
                )}
                {asset.approval_status === 'approved' && asset.approval_date && (
                  <Text type="secondary">Approved on {asset.approval_date}</Text>
                )}
                {asset.approval_status === 'rejected' && (
                  <>
                    <Text type="secondary">
                      Rejected on {asset.approval_date || 'N/A'}
                    </Text>
                    {asset.rejection_reason && (
                      <div style={{ marginTop: 8 }}>
                        <Text strong>Reason: </Text>
                        <Text>{asset.rejection_reason}</Text>
                      </div>
                    )}
                  </>
                )}
                {asset.approval_status === 'draft' && (
                  <Text type="secondary">This asset has not been submitted for approval yet</Text>
                )}
              </>
            }
            type={statusConfig.color as any}
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Row gutter={16}>
            <Col span={8}>
              <StatCard
                title={t('adminClient.assets.currentPrice', 'Current Price')}
                value={`$${(asset.current_price || 0).toLocaleString()}`}
                trend={{ value: performance, isPositive: performance >= 0 }}
              />
            </Col>
            <Col span={8}>
              <StatCard
                title={t('adminClient.assets.quantity', 'Quantity')}
                value={(asset.quantity || 0).toLocaleString()}
              />
            </Col>
            <Col span={8}>
              <StatCard
                title={t('adminClient.assets.totalValue', 'Total Value')}
                value={`$${((asset.quantity || 0) * (asset.current_price || 0)).toLocaleString()}`}
              />
            </Col>
          </Row>

          <Card title={t('adminClient.assets.priceHistory', 'Price History')}>
            <Line
              height={240}
              data={priceHistory}
              xField="month"
              yField="value"
              point={{ size: 4 }}
              smooth
              tooltip={{ showMarkers: false }}
            />
          </Card>

          <Card title="Asset Information">
            <Space direction="vertical" style={{ width: '100%' }}>
              <p>
                <strong>Symbol:</strong> {asset.symbol}
              </p>
              <p>
                <strong>Type:</strong> {asset.type}
              </p>
              {asset.description && (
                <p>
                  <strong>Description:</strong> {asset.description}
                </p>
              )}
              <p>
                <strong>Purchase Price:</strong> ${(asset.purchase_price || 0).toLocaleString()}
              </p>
              <p>
                <strong>Purchase Date:</strong>{' '}
                {asset.purchase_date ? new Date(asset.purchase_date).toLocaleDateString() : 'N/A'}
              </p>
              <p>
                <strong>P&L:</strong>{' '}
                <Tag color={performance >= 0 ? 'green' : 'red'}>{performance.toFixed(2)}%</Tag>
              </p>
            </Space>
          </Card>
        </Space>
      )}
    </Modal>
  );
};

const AssetsManagementPage = () => {
  const { t } = useTranslation();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [currentFundId, setCurrentFundId] = useState<string | null>(null);

  const assetTypeOptions = [
    { label: t('adminClient.assets.allTypes', 'All Types'), value: 'all' },
    { label: t('adminClient.assets.crypto', 'Crypto'), value: 'crypto' },
    { label: t('adminClient.assets.token', 'Token'), value: 'token' },
    { label: t('adminClient.assets.stablecoin', 'Stablecoin'), value: 'stablecoin' },
  ];

  const statusOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Draft', value: 'draft' },
    { label: 'Pending Approval', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
  ];

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      setLoading(true);

      // Get first active fund (in real app, get from context/auth)
      const funds = await fundsService.getActiveFunds();
      if (funds.length === 0) {
        message.warning('No active funds found');
        setLoading(false);
        return;
      }

      const fundId = funds[0].id;
      setCurrentFundId(fundId);

      // Load assets for the fund
      const fundAssets = await assetsService.getAssetsByFund(fundId);

      // Add mock approval status for demo
      const assetsWithStatus = fundAssets.map((asset: Asset, idx: number) => ({
        ...asset,
        approval_status: (idx % 4 === 0 ? 'pending' : idx % 4 === 1 ? 'approved' : idx % 4 === 2 ? 'rejected' : 'draft') as ApprovalStatus,
        submitted_date: idx % 4 !== 3 ? dayjs().subtract(idx, 'day').format('YYYY-MM-DD') : undefined,
        approval_date: idx % 4 === 1 || idx % 4 === 2 ? dayjs().subtract(idx - 1, 'day').format('YYYY-MM-DD') : undefined,
        rejection_reason: idx % 4 === 2 ? 'Insufficient documentation provided. Please resubmit with complete information.' : undefined,
      }));

      setAssets(assetsWithStatus);
    } catch (error: any) {
      console.error('Error loading assets:', error);
      message.error('Failed to load assets: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const metrics = usePortfolioMetrics(assets);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesType = filterType === 'all' || asset.type === filterType;
      const matchesStatus = filterStatus === 'all' || asset.approval_status === filterStatus;
      const matchesSearch =
        (asset.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (asset.symbol || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch && matchesStatus;
    });
  }, [assets, filterType, filterStatus, searchTerm]);

  const totalPortfolioValue = metrics.totalValue || 1;

  const handleSubmitForApproval = (assetId: string) => {
    Modal.confirm({
      title: 'Submit Asset for Approval',
      content: 'Are you sure you want to submit this asset to the admin for approval? Once submitted, you cannot edit or delete it until it is reviewed.',
      okText: 'Submit',
      cancelText: 'Cancel',
      centered: true,
      onOk: async () => {
        try {
          // In real implementation, call API to update status
          setAssets((prev) =>
            prev.map((asset) =>
              asset.id === assetId
                ? {
                    ...asset,
                    approval_status: 'pending',
                    submitted_date: dayjs().format('YYYY-MM-DD'),
                  }
                : asset
            )
          );
          message.success('Asset submitted for approval successfully');
        } catch (error: any) {
          message.error('Failed to submit asset: ' + error.message);
        }
      },
    });
  };

  const columns: ColumnsType<Asset> = [
    {
      title: t('adminClient.assets.name', 'Name'),
      dataIndex: 'name',
      render: (value, record) => (
        <Space direction="vertical" size={0}>
          <strong>{record.symbol}</strong>
          <span>{value}</span>
        </Space>
      ),
    },
    {
      title: t('adminClient.assets.type', 'Type'),
      dataIndex: 'type',
      filters: assetTypeOptions
        .filter((option) => option.value !== 'all')
        .map((option) => ({ text: option.label, value: option.value })),
      onFilter: (value, record) => record.type === value,
      render: (type: string) => (
        <Tag color={type === 'crypto' ? 'blue' : type === 'stablecoin' ? 'green' : 'purple'}>
          {type?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Approval Status',
      dataIndex: 'approval_status',
      filters: statusOptions
        .filter((option) => option.value !== 'all')
        .map((option) => ({ text: option.label, value: option.value })),
      onFilter: (value, record) => record.approval_status === value,
      render: (status: ApprovalStatus) => {
        const config = {
          draft: { color: 'default', icon: <InfoCircleOutlined />, text: 'Draft' },
          pending: { color: 'warning', icon: <ClockCircleOutlined />, text: 'Pending' },
          approved: { color: 'success', icon: <CheckCircleOutlined />, text: 'Approved' },
          rejected: { color: 'error', icon: <CloseCircleOutlined />, text: 'Rejected' },
        };
        const cfg = config[status || 'draft'];
        return (
          <Tag icon={cfg.icon} color={cfg.color}>
            {cfg.text}
          </Tag>
        );
      },
    },
    {
      title: t('adminClient.assets.quantity', 'Quantity'),
      dataIndex: 'quantity',
      sorter: (a, b) => (a.quantity || 0) - (b.quantity || 0),
      render: (value) =>
        (value || 0).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 8,
        }),
    },
    {
      title: t('adminClient.assets.currentPrice', 'Current Price'),
      dataIndex: 'current_price',
      sorter: (a, b) => (a.current_price || 0) - (b.current_price || 0),
      render: (value) => `$${(value || 0).toLocaleString()}`,
    },
    {
      title: t('adminClient.assets.totalValue', 'Total Value'),
      dataIndex: 'totalValue',
      sorter: (a, b) =>
        (a.quantity || 0) * (a.current_price || 0) - (b.quantity || 0) * (b.current_price || 0),
      render: (_, record) =>
        `$${((record.quantity || 0) * (record.current_price || 0)).toLocaleString()}`,
    },
    {
      title: t('adminClient.assets.portfolio', '% Portfolio'),
      render: (_, record) => {
        const percentage =
          ((record.quantity || 0) * (record.current_price || 0) * 100) / totalPortfolioValue;
        return `${percentage.toFixed(2)}%`;
      },
    },
    {
      title: 'P&L',
      render: (_, record) => {
        const performance =
          ((record.current_price || 0) - (record.purchase_price || 0)) /
          (record.purchase_price || 1) *
          100;
        return (
          <Tag color={performance >= 0 ? 'green' : 'red'}>
            {performance >= 0 ? '+' : ''}
            {performance.toFixed(2)}%
          </Tag>
        );
      },
      sorter: (a, b) => {
        const perfA =
          ((a.current_price || 0) - (a.purchase_price || 0)) / (a.purchase_price || 1) * 100;
        const perfB =
          ((b.current_price || 0) - (b.purchase_price || 0)) / (b.purchase_price || 1) * 100;
        return perfA - perfB;
      },
    },
    {
      title: t('adminClient.assets.actions', 'Actions'),
      key: 'actions',
      fixed: 'right',
      width: 280,
      render: (_, record) => {
        const canEdit = record.approval_status === 'draft' || record.approval_status === 'rejected';
        const canDelete = record.approval_status === 'draft' || record.approval_status === 'rejected';
        const canSubmit = record.approval_status === 'draft' || record.approval_status === 'rejected';

        return (
          <Space size="small">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedAsset(record);
                setDetailsModalOpen(true);
              }}
            >
              View
            </Button>
            {canEdit && (
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => {
                  setSelectedAsset(record);
                  setEditModalOpen(true);
                }}
              >
                Edit
              </Button>
            )}
            {canSubmit && (
              <Button
                size="small"
                type="primary"
                icon={<SendOutlined />}
                onClick={() => handleSubmitForApproval(record.id)}
              >
                Submit
              </Button>
            )}
            {canDelete && (
              <Button
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleRemoveAsset(record.id)}
              >
                Remove
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  const handleRemoveAsset = (assetId: string) => {
    Modal.confirm({
      title: t('adminClient.assets.removeAsset', 'Remove Asset'),
      content: 'Are you sure you want to delete this asset?',
      okText: t('common.delete', 'Delete'),
      okType: 'danger',
      cancelText: t('common.cancel', 'Cancel'),
      centered: true,
      onOk: async () => {
        try {
          await assetsService.deleteAsset(assetId);
          setAssets((prev) => prev.filter((asset) => asset.id !== assetId));
          message.success('Asset deleted successfully');
        } catch (error: any) {
          message.error('Failed to delete asset: ' + error.message);
        }
      },
    });
  };

  const handleModalSubmit = async (values: AssetFormValues, assetId?: string) => {
    if (!currentFundId) {
      message.error('No fund selected');
      return;
    }

    try {
      const payload = {
        fund_id: currentFundId,
        symbol: values.symbol.toUpperCase(),
        name: values.name,
        type: values.type,
        quantity: values.quantity,
        purchase_price: values.purchase_price,
        current_price: values.current_price,
        purchase_date: values.purchase_date.format('YYYY-MM-DD'),
        description: values.description,
        approval_status: 'draft' as ApprovalStatus,
      };

      if (assetId) {
        const updated = await assetsService.updateAsset(assetId, payload);
        setAssets((prev) =>
          prev.map((asset) =>
            asset.id === assetId ? { ...updated, approval_status: 'draft' as ApprovalStatus } : asset
          )
        );
        message.success('Asset updated successfully');
      } else {
        const created = await assetsService.createAsset(payload);
        setAssets((prev) => [...prev, { ...created, approval_status: 'draft' as ApprovalStatus }]);
        message.success('Asset added successfully');
      }

      setSelectedAsset(null);
      setAddModalOpen(false);
      setEditModalOpen(false);
    } catch (error: any) {
      message.error('Failed to save asset: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          padding: '24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <Spin size="large" tip="Loading assets..." />
      </div>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Alert
        message="Asset Approval Workflow"
        description="Create assets as drafts, then submit them for approval by the Super Admin. Once approved, assets will be visible to investors in the marketplace."
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        closable
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <StatCard
            title={t('adminClient.assets.totalAssets', 'Total Assets')}
            value={metrics.totalAssets.toString()}
          />
        </Col>
        <Col xs={24} md={6}>
          <StatCard
            title={t('adminClient.assets.portfolioValue', 'Portfolio Value')}
            value={`$${metrics.totalValue.toLocaleString()}`}
          />
        </Col>
        <Col xs={24} md={4}>
          <Card>
            <Badge status="processing" text="Pending" />
            <div style={{ fontSize: 24, fontWeight: 600, marginTop: 8 }}>
              {metrics.pendingApproval}
            </div>
          </Card>
        </Col>
        <Col xs={24} md={4}>
          <Card>
            <Badge status="success" text="Approved" />
            <div style={{ fontSize: 24, fontWeight: 600, marginTop: 8 }}>
              {metrics.approvedAssets}
            </div>
          </Card>
        </Col>
        <Col xs={24} md={4}>
          <Card>
            <Badge status="default" text="Drafts" />
            <div style={{ fontSize: 24, fontWeight: 600, marginTop: 8 }}>{metrics.draftAssets}</div>
          </Card>
        </Col>
      </Row>

      <Card
        title={t('adminClient.assets.title', 'Assets Management')}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModalOpen(true)}>
            {t('adminClient.assets.addAsset', 'Add Asset')}
          </Button>
        }
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} md={8}>
            <Input.Search
              placeholder={t('adminClient.assets.search', 'Search assets...')}
              allowClear
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </Col>
          <Col xs={24} md={8}>
            <Select
              placeholder={t('adminClient.assets.filterByType', 'Filter by type')}
              options={assetTypeOptions}
              value={filterType}
              onChange={setFilterType}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} md={8}>
            <Select
              placeholder="Filter by approval status"
              options={statusOptions}
              value={filterStatus}
              onChange={setFilterStatus}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>

        <Table
          rowKey="id"
          dataSource={filteredAssets}
          columns={columns}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1400 }}
        />
      </Card>

      <AssetFormModal
        open={isAddModalOpen}
        title={t('adminClient.assets.addAsset', 'Add Asset')}
        onSubmit={(values) => handleModalSubmit(values)}
        onCancel={() => setAddModalOpen(false)}
      />

      <AssetFormModal
        open={isEditModalOpen}
        title={t('adminClient.assets.editAsset', 'Edit Asset')}
        initialValues={
          selectedAsset
            ? {
                symbol: selectedAsset.symbol || '',
                name: selectedAsset.name || '',
                type: selectedAsset.type || 'crypto',
                quantity: selectedAsset.quantity || 0,
                purchase_price: selectedAsset.purchase_price || 0,
                current_price: selectedAsset.current_price || 0,
                purchase_date: selectedAsset.purchase_date
                  ? dayjs(selectedAsset.purchase_date)
                  : dayjs(),
                description: (selectedAsset as any).description || '',
              }
            : undefined
        }
        onSubmit={(values) => selectedAsset && handleModalSubmit(values, selectedAsset.id)}
        onCancel={() => {
          setEditModalOpen(false);
          setSelectedAsset(null);
        }}
      />

      <AssetDetailsModal
        asset={selectedAsset}
        open={isDetailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedAsset(null);
        }}
      />
    </Space>
  );
};

export default AssetsManagementPage;
