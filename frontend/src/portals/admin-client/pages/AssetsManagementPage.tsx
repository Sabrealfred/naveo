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
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Line } from '@ant-design/charts';
import { StatCard } from '../../../components/common';
import { assetsService, fundsService } from '../../../services';
import type { Asset as AssetType } from '../../../services/types';
import { useTranslation } from 'react-i18next';

interface Asset extends AssetType {
  change24h?: number;
}

interface AssetFormValues {
  symbol: string;
  name: string;
  type: string;
  quantity: number;
  purchase_price: number;
  current_price: number;
  purchase_date: dayjs.Dayjs;
}

const usePortfolioMetrics = (assets: Asset[]) =>
  useMemo(() => {
    const totalValue = assets.reduce((acc, asset) => acc + (asset.quantity || 0) * (asset.current_price || 0), 0);
    const assetsWithPerformance = assets.map(asset => ({
      ...asset,
      performance: ((asset.current_price || 0) - (asset.purchase_price || 0)) / (asset.purchase_price || 1) * 100
    }));

    const bestPerformer = [...assetsWithPerformance].sort((a, b) => (b.performance || 0) - (a.performance || 0))[0];
    const worstPerformer = [...assetsWithPerformance].sort((a, b) => (a.performance || 0) - (b.performance || 0))[0];

    return {
      totalAssets: assets.length,
      totalValue,
      bestPerformer,
      worstPerformer,
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
    { label: t('adminClient.assets.crypto'), value: 'crypto' },
    { label: t('adminClient.assets.token'), value: 'token' },
    { label: t('adminClient.assets.stablecoin'), value: 'stablecoin' },
  ];

  const handleOk = async () => {
    const values = await form.validateFields();
    onSubmit(values);
  };

  return (
    <Modal
      open={open}
      title={title}
      okText={t('adminClient.assets.save')}
      cancelText={t('common.cancel')}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      destroyOnClose
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
        <Form.Item name="symbol" label={t('adminClient.assets.symbol')} rules={[{ required: true, message: t('adminClient.assets.enterSymbol') }]}>
          <Input placeholder="BTC" />
        </Form.Item>
        <Form.Item name="name" label={t('adminClient.assets.name')} rules={[{ required: true, message: t('adminClient.assets.enterName') }]}>
          <Input placeholder="Bitcoin" />
        </Form.Item>
        <Form.Item name="type" label={t('adminClient.assets.type')} rules={[{ required: true }]}>
          <Select options={assetTypeOptions} />
        </Form.Item>
        <Form.Item
          name="quantity"
          label={t('adminClient.assets.quantity')}
          rules={[{ required: true, message: t('adminClient.assets.enterQuantity') }]}
        >
          <InputNumber min={0} precision={8} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="purchase_price"
          label={t('adminClient.assets.purchasePrice')}
          rules={[{ required: true, message: t('adminClient.assets.enterPurchasePrice') }]}
        >
          <InputNumber min={0} prefix="$" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="current_price"
          label={t('adminClient.assets.currentPrice')}
          tooltip={t('adminClient.assets.marketReference')}
          rules={[{ required: true, message: t('adminClient.assets.enterCurrentPrice') }]}
        >
          <InputNumber min={0} prefix="$" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="purchase_date"
          label={t('adminClient.assets.purchaseDate')}
          rules={[{ required: true, message: t('adminClient.assets.selectDate') }]}
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
      month: dayjs().subtract(11 - idx, 'month').format('MMM YYYY'),
      value: basePrice * (1 + Math.sin(idx / 3) * 0.08),
    }));
  }, [asset]);

  const performance = asset
    ? ((asset.current_price || 0) - (asset.purchase_price || 0)) / (asset.purchase_price || 1) * 100
    : 0;

  return (
    <Modal
      open={open}
      title={t('adminClient.assets.detailOf', { name: asset?.name ?? '' })}
      width={720}
      footer={null}
      onCancel={onClose}
    >
      {asset && (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Row gutter={16}>
            <Col span={8}>
              <StatCard
                title={t('adminClient.assets.currentPrice')}
                value={`$${(asset.current_price || 0).toLocaleString()}`}
                trend={{ value: performance, isPositive: performance >= 0 }}
              />
            </Col>
            <Col span={8}>
              <StatCard
                title={t('adminClient.assets.quantity')}
                value={(asset.quantity || 0).toLocaleString()}
              />
            </Col>
            <Col span={8}>
              <StatCard
                title={t('adminClient.assets.totalValue')}
                value={`$${((asset.quantity || 0) * (asset.current_price || 0)).toLocaleString()}`}
              />
            </Col>
          </Row>

          <Card title={t('adminClient.assets.priceHistory')}>
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
              <p><strong>Symbol:</strong> {asset.symbol}</p>
              <p><strong>Type:</strong> {asset.type}</p>
              <p><strong>Purchase Price:</strong> ${(asset.purchase_price || 0).toLocaleString()}</p>
              <p><strong>Purchase Date:</strong> {asset.purchase_date ? new Date(asset.purchase_date).toLocaleDateString() : 'N/A'}</p>
              <p><strong>P&L:</strong> <Tag color={performance >= 0 ? 'green' : 'red'}>{performance.toFixed(2)}%</Tag></p>
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
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [currentFundId, setCurrentFundId] = useState<string | null>(null);

  const assetTypeOptions = [
    { label: t('adminClient.assets.allTypes'), value: 'all' },
    { label: t('adminClient.assets.crypto'), value: 'crypto' },
    { label: t('adminClient.assets.token'), value: 'token' },
    { label: t('adminClient.assets.stablecoin'), value: 'stablecoin' },
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
      setAssets(fundAssets);

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
      const matchesSearch =
        (asset.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (asset.symbol || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [assets, filterType, searchTerm]);

  const totalPortfolioValue = metrics.totalValue || 1;

  const columns: ColumnsType<Asset> = [
    {
      title: t('adminClient.assets.name'),
      dataIndex: 'name',
      render: (value, record) => (
        <Space direction="vertical" size={0}>
          <strong>{record.symbol}</strong>
          <span>{value}</span>
        </Space>
      ),
    },
    {
      title: t('adminClient.assets.type'),
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
      title: t('adminClient.assets.quantity'),
      dataIndex: 'quantity',
      sorter: (a, b) => (a.quantity || 0) - (b.quantity || 0),
      render: (value) => (value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 }),
    },
    {
      title: t('adminClient.assets.currentPrice'),
      dataIndex: 'current_price',
      sorter: (a, b) => (a.current_price || 0) - (b.current_price || 0),
      render: (value) => `$${(value || 0).toLocaleString()}`,
    },
    {
      title: t('adminClient.assets.totalValue'),
      dataIndex: 'totalValue',
      sorter: (a, b) => ((a.quantity || 0) * (a.current_price || 0)) - ((b.quantity || 0) * (b.current_price || 0)),
      render: (_, record) => `$${((record.quantity || 0) * (record.current_price || 0)).toLocaleString()}`,
    },
    {
      title: t('adminClient.assets.portfolio'),
      render: (_, record) => {
        const percentage = ((record.quantity || 0) * (record.current_price || 0) * 100) / totalPortfolioValue;
        return `${percentage.toFixed(2)}%`;
      },
    },
    {
      title: 'P&L',
      render: (_, record) => {
        const performance = ((record.current_price || 0) - (record.purchase_price || 0)) / (record.purchase_price || 1) * 100;
        return (
          <Tag color={performance >= 0 ? 'green' : 'red'}>
            {performance >= 0 ? '+' : ''}
            {performance.toFixed(2)}%
          </Tag>
        );
      },
      sorter: (a, b) => {
        const perfA = ((a.current_price || 0) - (a.purchase_price || 0)) / (a.purchase_price || 1) * 100;
        const perfB = ((b.current_price || 0) - (b.purchase_price || 0)) / (b.purchase_price || 1) * 100;
        return perfA - perfB;
      },
    },
    {
      title: t('adminClient.assets.actions'),
      key: 'actions',
      render: (_, record) => (
        <Space>
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
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleRemoveAsset(record.id)}
          >
            Remove
          </Button>
        </Space>
      ),
    },
  ];

  const handleRemoveAsset = (assetId: string) => {
    Modal.confirm({
      title: t('adminClient.assets.removeAsset'),
      content: 'Are you sure you want to delete this asset?',
      okText: t('common.delete'),
      okType: 'danger',
      cancelText: t('common.cancel'),
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
      };

      if (assetId) {
        const updated = await assetsService.updateAsset(assetId, payload);
        setAssets((prev) => prev.map((asset) => (asset.id === assetId ? updated : asset)));
        message.success('Asset updated successfully');
      } else {
        const created = await assetsService.createAsset(payload);
        setAssets((prev) => [...prev, created]);
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
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" tip="Loading assets..." />
      </div>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <StatCard title={t('adminClient.assets.totalAssets')} value={metrics.totalAssets.toString()} />
        </Col>
        <Col xs={24} md={6}>
          <StatCard title={t('adminClient.assets.portfolioValue')} value={`$${metrics.totalValue.toLocaleString()}`} />
        </Col>
        <Col xs={24} md={6}>
          <StatCard
            title={t('adminClient.assets.bestPerformer')}
            value={metrics.bestPerformer ? metrics.bestPerformer.symbol : '—'}
            trend={metrics.bestPerformer ? { value: ((metrics.bestPerformer.current_price || 0) - (metrics.bestPerformer.purchase_price || 0)) / (metrics.bestPerformer.purchase_price || 1) * 100, isPositive: true } : undefined}
          />
        </Col>
        <Col xs={24} md={6}>
          <StatCard
            title={t('adminClient.assets.worstPerformer')}
            value={metrics.worstPerformer ? metrics.worstPerformer.symbol : '—'}
            trend={metrics.worstPerformer ? { value: ((metrics.worstPerformer.current_price || 0) - (metrics.worstPerformer.purchase_price || 0)) / (metrics.worstPerformer.purchase_price || 1) * 100, isPositive: false } : undefined}
          />
        </Col>
      </Row>

      <Card
        title={t('adminClient.assets.title')}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModalOpen(true)}>
            {t('adminClient.assets.addAsset')}
          </Button>
        }
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} md={12}>
            <Input.Search
              placeholder={t('adminClient.assets.search')}
              allowClear
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </Col>
          <Col xs={24} md={12}>
            <Select
              placeholder={t('adminClient.assets.filterByType')}
              options={assetTypeOptions}
              value={filterType}
              onChange={setFilterType}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>

        <Table
          rowKey="id"
          dataSource={filteredAssets}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <AssetFormModal
        open={isAddModalOpen}
        title={t('adminClient.assets.addAsset')}
        onSubmit={(values) => handleModalSubmit(values)}
        onCancel={() => setAddModalOpen(false)}
      />

      <AssetFormModal
        open={isEditModalOpen}
        title={t('adminClient.assets.editAsset')}
        initialValues={
          selectedAsset
            ? {
              symbol: selectedAsset.symbol || '',
              name: selectedAsset.name || '',
              type: selectedAsset.type || 'crypto',
              quantity: selectedAsset.quantity || 0,
              purchase_price: selectedAsset.purchase_price || 0,
              current_price: selectedAsset.current_price || 0,
              purchase_date: selectedAsset.purchase_date ? dayjs(selectedAsset.purchase_date) : dayjs(),
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
