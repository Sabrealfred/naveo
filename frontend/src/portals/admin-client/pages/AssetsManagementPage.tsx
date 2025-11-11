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
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Line } from '@ant-design/charts';
import { StatCard } from '../../../components/common';
import { fetchAssets, type AssetRecord } from '../../../services/adminClient';

type AssetType = 'Crypto' | 'Token' | 'Stablecoin';

interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: AssetType;
  quantity: number;
  currentPrice: number;
  purchasePrice: number;
  purchaseDate: string;
  change24h: number;
}

interface AssetFormValues {
  symbol: string;
  name: string;
  type: AssetType;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  change24h: number;
  purchaseDate: dayjs.Dayjs;
}

const marketReference: Record<string, { currentPrice: number; change24h: number }> = {
  BTC: { currentPrice: 42150, change24h: 3.5 },
  ETH: { currentPrice: 2250, change24h: 5.2 },
  SOL: { currentPrice: 145.3, change24h: 2.1 },
  USDC: { currentPrice: 1, change24h: 0 },
  USDT: { currentPrice: 1, change24h: 0 },
  MKR: { currentPrice: 2315, change24h: -1.1 },
};

const defaultAssets: Asset[] = [
  {
    id: 'btc',
    symbol: 'BTC',
    name: 'Bitcoin',
    type: 'Crypto',
    quantity: 15.5,
    currentPrice: 42150,
    purchasePrice: 31500,
    purchaseDate: '2024-03-12',
    change24h: 3.5,
  },
  {
    id: 'eth',
    symbol: 'ETH',
    name: 'Ethereum',
    type: 'Crypto',
    quantity: 250,
    currentPrice: 2250,
    purchasePrice: 1875,
    purchaseDate: '2024-04-02',
    change24h: 5.2,
  },
  {
    id: 'usdc',
    symbol: 'USDC',
    name: 'USD Coin',
    type: 'Stablecoin',
    quantity: 125000,
    currentPrice: 1,
    purchasePrice: 1,
    purchaseDate: '2024-02-18',
    change24h: 0,
  },
  {
    id: 'sol',
    symbol: 'SOL',
    name: 'Solana',
    type: 'Token',
    quantity: 4200,
    currentPrice: 145.3,
    purchasePrice: 96.2,
    purchaseDate: '2023-11-20',
    change24h: 2.1,
  },
  {
    id: 'mkr',
    symbol: 'MKR',
    name: 'MakerDAO',
    type: 'Token',
    quantity: 350,
    currentPrice: 2315,
    purchasePrice: 1960,
    purchaseDate: '2024-05-09',
    change24h: -1.1,
  },
];

const assetTypeOptions = [
  { label: 'Todos los tipos', value: 'all' },
  { label: 'Crypto', value: 'Crypto' },
  { label: 'Token', value: 'Token' },
  { label: 'Stablecoin', value: 'Stablecoin' },
];

const usePortfolioMetrics = (assets: Asset[]) =>
  useMemo(() => {
    const totalValue = assets.reduce((acc, asset) => acc + asset.quantity * asset.currentPrice, 0);
    const bestPerformer = [...assets].sort((a, b) => b.change24h - a.change24h)[0];
    const worstPerformer = [...assets].sort((a, b) => a.change24h - b.change24h)[0];

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

  const handleOk = async () => {
    const values = await form.validateFields();
    onSubmit(values);
  };

  return (
    <Modal
      open={open}
      title={title}
      okText="Guardar"
      cancelText="Cancelar"
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
            purchaseDate: dayjs(),
            type: 'Crypto',
            change24h: 0,
            currentPrice: 0,
          }
        }
      >
        <Form.Item name="symbol" label="Symbol" rules={[{ required: true, message: 'Ingresa el símbolo' }]}>
          <Input placeholder="BTC" />
        </Form.Item>
        <Form.Item name="name" label="Nombre" rules={[{ required: true, message: 'Ingresa el nombre del activo' }]}>
          <Input placeholder="Bitcoin" />
        </Form.Item>
        <Form.Item name="type" label="Tipo" rules={[{ required: true }]}>
          <Select options={assetTypeOptions.filter((option) => option.value !== 'all')} />
        </Form.Item>
        <Form.Item
          name="quantity"
          label="Cantidad"
          rules={[{ required: true, message: 'Ingresa la cantidad' }]}
        >
          <InputNumber min={0} precision={2} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="purchasePrice"
          label="Precio de compra"
          rules={[{ required: true, message: 'Ingresa el precio de compra' }]}
        >
          <InputNumber min={0} prefix="$" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="currentPrice"
          label="Precio actual"
          tooltip="Prellenado con referencia de mercado si está disponible"
          rules={[{ required: true, message: 'Ingresa el precio actual' }]}
        >
          <InputNumber min={0} prefix="$" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="change24h"
          label="Variación 24h (%)"
          rules={[{ required: true, message: 'Ingresa el cambio porcentual' }]}
        >
          <InputNumber min={-100} max={100} precision={2} suffix="%" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="purchaseDate"
          label="Fecha de compra"
          rules={[{ required: true, message: 'Selecciona la fecha' }]}
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
  const priceHistory = useMemo(() => {
    if (!asset) return [];
    const basePrice = asset.currentPrice;
    return Array.from({ length: 12 }).map((_, idx) => ({
      month: dayjs().subtract(11 - idx, 'month').format('MMM YYYY'),
      value: basePrice * (1 + Math.sin(idx / 3) * 0.08),
    }));
  }, [asset]);

  const recentTransactions = [
    { type: 'Buy', amount: 5, date: '2024-09-02', price: asset?.currentPrice ?? 0 },
    { type: 'Sell', amount: 2, date: '2024-07-18', price: (asset?.currentPrice ?? 0) * 0.92 },
    { type: 'Buy', amount: 3, date: '2024-05-05', price: (asset?.currentPrice ?? 0) * 0.88 },
  ];

  return (
    <Modal
      open={open}
      title={`Detalle de ${asset?.name ?? ''}`}
      width={720}
      footer={null}
      onCancel={onClose}
    >
      {asset && (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Row gutter={16}>
            <Col span={8}>
              <StatCard
                title="Precio actual"
                value={`$${asset.currentPrice.toLocaleString()}`}
                trend={{ value: Math.abs(asset.change24h), isPositive: asset.change24h >= 0 }}
              />
            </Col>
            <Col span={8}>
              <StatCard
                title="Cantidad"
                value={asset.quantity.toLocaleString()}
              />
            </Col>
            <Col span={8}>
              <StatCard
                title="Valor total"
                value={`$${(asset.quantity * asset.currentPrice).toLocaleString()}`}
              />
            </Col>
          </Row>

          <Card title="Histórico de precio (12M)">
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

          <Card title="Actividad reciente">
            <Table
              rowKey="date"
              dataSource={recentTransactions}
              pagination={false}
              columns={[
                { title: 'Tipo', dataIndex: 'type' },
                {
                  title: 'Cantidad',
                  dataIndex: 'amount',
                  render: (value) => `${value} ${asset.symbol}`,
                },
                {
                  title: 'Precio',
                  dataIndex: 'price',
                  render: (value) => `$${value.toLocaleString()}`,
                },
                { title: 'Fecha', dataIndex: 'date' },
              ]}
            />
          </Card>
        </Space>
      )}
    </Modal>
  );
};

const AssetsManagementPage = () => {
  const [assets, setAssets] = useState<Asset[]>(defaultAssets);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const loadAssets = async () => {
      const { data, error } = await fetchAssets();
      if (!mounted) return;
      if (error) {
        console.warn('Supabase assets error', error);
        setLoading(false);
        return;
      }
      if (data && data.length) {
        setAssets(data.map(mapAssetRecord));
      }
      setLoading(false);
    };

    loadAssets();
    return () => {
      mounted = false;
    };
  }, []);

  const metrics = usePortfolioMetrics(assets);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesType = filterType === 'all' || asset.type === filterType;
      const matchesSearch =
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [assets, filterType, searchTerm]);

  const totalPortfolioValue = metrics.totalValue || 1;

  const columns: ColumnsType<Asset> = [
    {
      title: 'Asset',
      dataIndex: 'name',
      render: (value, record) => (
        <Space direction="vertical" size={0}>
          <strong>{record.symbol}</strong>
          <span>{value}</span>
        </Space>
      ),
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      filters: assetTypeOptions
        .filter((option) => option.value !== 'all')
        .map((option) => ({ text: option.label, value: option.value })),
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
      render: (value) => value.toLocaleString(),
    },
    {
      title: 'Current Price',
      dataIndex: 'currentPrice',
      sorter: (a, b) => a.currentPrice - b.currentPrice,
      render: (value) => `$${value.toLocaleString()}`,
    },
    {
      title: 'Total Value',
      dataIndex: 'totalValue',
      sorter: (a, b) => a.quantity * a.currentPrice - b.quantity * b.currentPrice,
      render: (_, record) => `$${(record.quantity * record.currentPrice).toLocaleString()}`,
    },
    {
      title: '% Portfolio',
      render: (_, record) => {
        const percentage = (record.quantity * record.currentPrice * 100) / totalPortfolioValue;
        return `${percentage.toFixed(2)}%`;
      },
    },
    {
      title: '24h Change',
      dataIndex: 'change24h',
      sorter: (a, b) => a.change24h - b.change24h,
      render: (value: number) => (
        <Tag color={value >= 0 ? 'green' : 'volcano'}>
          {value >= 0 ? '+' : ''}
          {value}%
        </Tag>
      ),
    },
    {
      title: 'Actions',
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
      title: 'Eliminar asset',
      content: '¿Estás seguro de eliminar este asset del portafolio?',
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      centered: true,
      onOk: () => {
        setAssets((prev) => prev.filter((asset) => asset.id !== assetId));
        message.success('Asset eliminado');
      },
    });
  };

  const handleModalSubmit = (values: AssetFormValues, assetId?: string) => {
    const reference = marketReference[values.symbol.toUpperCase()];
    const payload: Asset = {
      id: assetId ?? values.symbol.toLowerCase(),
      symbol: values.symbol.toUpperCase(),
      name: values.name,
      type: values.type,
      quantity: values.quantity,
      purchasePrice: values.purchasePrice,
      currentPrice: values.currentPrice || reference?.currentPrice || values.purchasePrice,
      purchaseDate: values.purchaseDate.format('YYYY-MM-DD'),
      change24h: values.change24h ?? reference?.change24h ?? 0,
    };

    setAssets((prev) => {
      if (assetId) {
        return prev.map((asset) => (asset.id === assetId ? payload : asset));
      }
      return [...prev, payload];
    });

    message.success(assetId ? 'Asset actualizado' : 'Asset creado');
    setSelectedAsset(null);
    setAddModalOpen(false);
    setEditModalOpen(false);
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        {loading ? (
          <>
            <Col xs={24} md={6}><Skeleton active /></Col>
            <Col xs={24} md={6}><Skeleton active /></Col>
            <Col xs={24} md={6}><Skeleton active /></Col>
            <Col xs={24} md={6}><Skeleton active /></Col>
          </>
        ) : (
          <>
            <Col xs={24} md={6}>
              <StatCard title="Total Assets" value={metrics.totalAssets} />
            </Col>
            <Col xs={24} md={6}>
              <StatCard title="Portfolio Value" value={`$${metrics.totalValue.toLocaleString()}`} />
            </Col>
            <Col xs={24} md={6}>
              <StatCard
                title="Best Performer (24h)"
                value={metrics.bestPerformer ? metrics.bestPerformer.symbol : '—'}
                trend={metrics.bestPerformer ? { value: Math.abs(metrics.bestPerformer.change24h), isPositive: metrics.bestPerformer.change24h >= 0 } : undefined}
              />
            </Col>
            <Col xs={24} md={6}>
              <StatCard
                title="Worst Performer (24h)"
                value={metrics.worstPerformer ? metrics.worstPerformer.symbol : '—'}
                trend={metrics.worstPerformer ? { value: Math.abs(metrics.worstPerformer.change24h), isPositive: metrics.worstPerformer.change24h >= 0 } : undefined}
              />
            </Col>
          </>
        )}
      </Row>

      <Card
        title="Gestión de Activos"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModalOpen(true)}>
            Add Asset
          </Button>
        }
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} md={12}>
            <Input.Search
              placeholder="Buscar por nombre o símbolo"
              allowClear
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </Col>
          <Col xs={24} md={12}>
            <Select
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
          pagination={{ pageSize: 8 }}
          loading={loading}
        />
      </Card>

      <AssetFormModal
        open={isAddModalOpen}
        title="Agregar nuevo asset"
        onSubmit={(values) => handleModalSubmit(values)}
        onCancel={() => setAddModalOpen(false)}
      />

      <AssetFormModal
        open={isEditModalOpen}
        title="Editar asset"
        initialValues={
          selectedAsset
            ? {
              symbol: selectedAsset.symbol,
              name: selectedAsset.name,
              type: selectedAsset.type,
              quantity: selectedAsset.quantity,
              purchasePrice: selectedAsset.purchasePrice,
              currentPrice: selectedAsset.currentPrice,
              change24h: selectedAsset.change24h,
              purchaseDate: dayjs(selectedAsset.purchaseDate),
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

const mapAssetRecord = (record: AssetRecord): Asset => ({
  id: record.id,
  symbol: record.symbol,
  name: record.name,
  type: (record.type as AssetType) ?? 'Crypto',
  quantity: Number(record.quantity ?? 0),
  purchasePrice: Number(record.purchase_price ?? 0),
  currentPrice: Number(record.current_price ?? 0),
  purchaseDate: record.purchase_date ?? dayjs().format('YYYY-MM-DD'),
  change24h: 0,
});