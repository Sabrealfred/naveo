import { Row, Col, Card, Table, Button, Space, Statistic, Tag, Tabs, Progress, Alert, Badge, Timeline, Divider, Modal, Form, InputNumber, Select, DatePicker, message, Input } from 'antd';
import { DownloadOutlined, CalculatorOutlined, HistoryOutlined, CheckCircleOutlined, SyncOutlined, WarningOutlined, EyeOutlined, FileTextOutlined, SafetyOutlined, ClockCircleOutlined, DollarOutlined, AuditOutlined, ApiOutlined, LineChartOutlined } from '@ant-design/icons';
import { PerformanceChart, PerformanceGauge, ComparisonChart } from '../../../components/common';
import { useState } from 'react';
import { Line, Column } from '@ant-design/charts';

const NAVSystemPage = () => {
  const [calculateModalVisible, setCalculateModalVisible] = useState(false);
  const [adjustmentModalVisible, setAdjustmentModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Asset Holdings Breakdown
  const assetHoldings = [
    { id: 1, asset: 'BTC', symbol: 'BTC', quantity: 425.5, price: 35200, value: 14977600, priceSource: 'Coinbase', lastUpdate: '2 min ago', status: 'verified' },
    { id: 2, asset: 'ETH', symbol: 'ETH', quantity: 1820.3, price: 1850, value: 3367555, priceSource: 'Kraken', lastUpdate: '2 min ago', status: 'verified' },
    { id: 3, asset: 'SOL', symbol: 'SOL', quantity: 8500, price: 98.5, value: 837250, priceSource: 'Binance', lastUpdate: '5 min ago', status: 'verified' },
    { id: 4, asset: 'MATIC', symbol: 'MATIC', quantity: 125000, price: 0.82, value: 102500, priceSource: 'Coinbase', lastUpdate: '3 min ago', status: 'verified' },
    { id: 5, asset: 'LINK', symbol: 'LINK', quantity: 18500, price: 14.8, value: 273800, priceSource: 'Binance', lastUpdate: '4 min ago', status: 'verified' },
    { id: 6, asset: 'USDC', symbol: 'USDC', quantity: 4300000, price: 1.0, value: 4300000, priceSource: 'Circle', lastUpdate: '1 min ago', status: 'verified' },
  ];

  // NAV Calculation Workflow Steps
  const navWorkflowSteps = [
    { step: 1, title: 'Data Collection', status: 'completed', time: '18:00:12', description: 'Fetched balances from 8 custodians' },
    { step: 2, title: 'Price Verification', status: 'completed', time: '18:00:45', description: 'Verified prices from 5 sources' },
    { step: 3, title: 'Asset Valuation', status: 'completed', time: '18:01:02', description: 'Calculated $25.8M total assets' },
    { step: 4, title: 'Liabilities Calculation', status: 'completed', time: '18:01:15', description: 'Computed $300K liabilities' },
    { step: 5, title: 'NAV Calculation', status: 'completed', time: '18:01:23', description: 'NAV per unit: $135.45' },
    { step: 6, title: 'Validation & Checks', status: 'completed', time: '18:01:35', description: 'All 12 checks passed' },
    { step: 7, title: 'Awaiting Approval', status: 'pending', time: '-', description: 'Pending compliance officer review' },
  ];

  // Data Source Integration Status
  const dataSourceStatus = [
    { source: 'Coinbase Custody', type: 'Exchange', assets: 3, status: 'connected', lastSync: '2 min ago', health: 100 },
    { source: 'Kraken', type: 'Exchange', assets: 2, status: 'connected', lastSync: '2 min ago', health: 100 },
    { source: 'Binance', type: 'Exchange', assets: 3, status: 'connected', lastSync: '4 min ago', health: 98 },
    { source: 'Fireblocks', type: 'Custody', assets: 4, status: 'connected', lastSync: '1 min ago', health: 100 },
    { source: 'Circle', type: 'Stablecoin', assets: 1, status: 'connected', lastSync: '1 min ago', health: 100 },
    { source: 'CoinGecko API', type: 'Price Feed', assets: 12, status: 'connected', lastSync: '30 sec ago', health: 100 },
    { source: 'Chainlink Oracles', type: 'Price Feed', assets: 12, status: 'connected', lastSync: '15 sec ago', health: 100 },
  ];

  // Validation Checks
  const validationChecks = [
    { check: 'Balance Reconciliation', status: 'passed', details: 'All balances match across sources' },
    { check: 'Price Deviation Check', status: 'passed', details: 'Max deviation: 0.12%' },
    { check: 'Liquidity Threshold', status: 'passed', details: '92% liquidity ratio (target: >80%)' },
    { check: 'Asset Count Verification', status: 'passed', details: '12 assets verified' },
    { check: 'Liability Calculation', status: 'passed', details: 'All fees calculated correctly' },
    { check: 'Units Outstanding', status: 'passed', details: '188,324 units verified' },
    { check: 'Historical Variance', status: 'warning', details: '0.24% change (within 2% threshold)' },
    { check: 'Audit Trail', status: 'passed', details: 'All changes logged' },
  ];

  // NAV Adjustment History
  const adjustmentHistory = [
    { date: '2024-11-08', type: 'Manual Correction', amount: -125, reason: 'Price feed error correction', approvedBy: 'Jane Smith', status: 'approved' },
    { date: '2024-11-01', type: 'Fee Accrual', amount: -450, reason: 'Performance fee accrual', approvedBy: 'John Doe', status: 'approved' },
    { date: '2024-10-25', type: 'Asset Revaluation', amount: 820, reason: 'Illiquid asset fair value adjustment', approvedBy: 'Jane Smith', status: 'approved' },
  ];

  // Price History for validation
  const priceHistoryData = [
    { time: '14:00', btc: 35100, eth: 1845 },
    { time: '15:00', btc: 35150, eth: 1848 },
    { time: '16:00', btc: 35180, eth: 1852 },
    { time: '17:00', btc: 35210, eth: 1855 },
    { time: '18:00', btc: 35200, eth: 1850 },
  ];

  const handleCalculateNAV = () => {
    message.loading('Calculating NAV...', 2).then(() => {
      message.success('NAV calculated successfully: $135.47');
      setCalculateModalVisible(false);
    });
  };

  const handleAdjustment = (values: any) => {
    console.log('NAV Adjustment:', values);
    message.success('NAV adjustment submitted for approval');
    setAdjustmentModalVisible(false);
    form.resetFields();
  };

  const navHistoryColumns = [
    {
      title: 'Fecha',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'NAV Opening',
      dataIndex: 'navOpening',
      key: 'navOpening',
      render: (value: string) => `$${value}`,
    },
    {
      title: 'NAV Closing',
      dataIndex: 'navClosing',
      key: 'navClosing',
      render: (value: string) => `$${value}`,
    },
    {
      title: 'Cambio',
      dataIndex: 'change',
      key: 'change',
      render: (value: number) => (
        <Tag color={value >= 0 ? 'green' : 'red'}>
          {value >= 0 ? '+' : ''}{value.toFixed(2)}%
        </Tag>
      ),
    },
    {
      title: 'Total Assets',
      dataIndex: 'totalAssets',
      key: 'totalAssets',
      render: (value: string) => `$${value}M`,
    },
    {
      title: 'Total Liabilities',
      dataIndex: 'totalLiabilities',
      key: 'totalLiabilities',
      render: (value: string) => `$${value}M`,
    },
    {
      title: 'Units Outstanding',
      dataIndex: 'unitsOutstanding',
      key: 'unitsOutstanding',
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          calculated: 'green',
          pending: 'orange',
          audited: 'blue',
        };
        return <Tag color={colorMap[status]}>{status.toUpperCase()}</Tag>;
      },
    },
  ];

  const navHistoryData = [
    {
      key: '1',
      date: '2024-11-09',
      navOpening: '135.12',
      navClosing: '135.45',
      change: 0.24,
      totalAssets: '25.8',
      totalLiabilities: '0.3',
      unitsOutstanding: 188324,
      status: 'calculated',
    },
    {
      key: '2',
      date: '2024-11-08',
      navOpening: '134.87',
      navClosing: '135.12',
      change: 0.19,
      totalAssets: '25.6',
      totalLiabilities: '0.3',
      unitsOutstanding: 188324,
      status: 'audited',
    },
    {
      key: '3',
      date: '2024-11-07',
      navOpening: '133.42',
      navClosing: '134.87',
      change: 1.09,
      totalAssets: '25.5',
      totalLiabilities: '0.3',
      unitsOutstanding: 188100,
      status: 'audited',
    },
    {
      key: '4',
      date: '2024-11-06',
      navOpening: '132.98',
      navClosing: '133.42',
      change: 0.33,
      totalAssets: '25.3',
      totalLiabilities: '0.3',
      unitsOutstanding: 188100,
      status: 'audited',
    },
    {
      key: '5',
      date: '2024-11-05',
      navOpening: '131.56',
      navClosing: '132.98',
      change: 1.08,
      totalAssets: '25.2',
      totalLiabilities: '0.3',
      unitsOutstanding: 187950,
      status: 'audited',
    },
  ];

  const navPerformanceData = [
    { date: '2024-01', value: 100.00 },
    { date: '2024-02', value: 104.25 },
    { date: '2024-03', value: 102.18 },
    { date: '2024-04', value: 108.93 },
    { date: '2024-05', value: 112.44 },
    { date: '2024-06', value: 115.67 },
    { date: '2024-07', value: 119.23 },
    { date: '2024-08', value: 123.56 },
    { date: '2024-09', value: 126.89 },
    { date: '2024-10', value: 130.12 },
    { date: '2024-11', value: 135.45 },
  ];

  const componentBreakdown = [
    { category: 'Assets', type: 'Crypto', value: 18.2 },
    { category: 'Assets', type: 'Cash', value: 4.3 },
    { category: 'Assets', type: 'Other', value: 3.3 },
    { category: 'Liabilities', type: 'Fees', value: 0.2 },
    { category: 'Liabilities', type: 'Other', value: 0.1 },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Sistema NAV</h1>
        <Space>
          <Button icon={<CalculatorOutlined />} onClick={() => setCalculateModalVisible(true)} size="large">
            Calcular NAV
          </Button>
          <Button icon={<AuditOutlined />} onClick={() => setAdjustmentModalVisible(true)} size="large">
            Ajustar NAV
          </Button>
          <Button type="primary" icon={<DownloadOutlined />} size="large">
            Exportar Reporte
          </Button>
        </Space>
      </div>

      {/* NAV Calculation Workflow Status */}
      <Card
        title={
          <Space>
            <SyncOutlined spin={navWorkflowSteps.some(s => s.status === 'pending')} />
            <span>Estado del Flujo de Cálculo NAV</span>
            <Badge status="processing" text="En Progreso" />
          </Space>
        }
        style={{ marginBottom: 24 }}
        bordered={false}
      >
        <Timeline
          items={navWorkflowSteps.map((step) => ({
            color: step.status === 'completed' ? 'green' : step.status === 'pending' ? 'blue' : 'gray',
            dot: step.status === 'completed' ? <CheckCircleOutlined /> : step.status === 'pending' ? <ClockCircleOutlined /> : undefined,
            children: (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <strong>{step.title}</strong>
                  <Space>
                    <Tag color={step.status === 'completed' ? 'green' : 'blue'}>
                      {step.status.toUpperCase()}
                    </Tag>
                    {step.time !== '-' && <span style={{ fontSize: '12px', color: '#8c8c8c' }}>{step.time}</span>}
                  </Space>
                </div>
                <div style={{ fontSize: '13px', color: '#666' }}>{step.description}</div>
              </div>
            ),
          }))}
        />
      </Card>

      {/* Métricas Principales */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="NAV Actual"
              value={135.45}
              prefix="$"
              precision={2}
              valueStyle={{ color: '#3f8600' }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
              Actualizado: Hoy 18:00
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Cambio Diario"
              value={0.24}
              suffix="%"
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix="+"
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
              +$0.33 por unit
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Net Assets"
              value={25.5}
              suffix="M"
              prefix="$"
              precision={1}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
              Assets: $25.8M | Liabilities: $0.3M
            </div>
          </Card>
        </Col>
      </Row>

      {/* Gráficos */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <PerformanceChart
            title="Evolución del NAV (Base 100)"
            data={navPerformanceData}
            height={350}
          />
        </Col>
        <Col xs={24} lg={12}>
          <ComparisonChart
            title="Composición del NAV"
            data={componentBreakdown}
            height={350}
          />
        </Col>
      </Row>

      {/* Medidores de Performance */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <PerformanceGauge
            title="Sharpe Ratio"
            value={2.35}
            max={5}
            format={(v) => v.toFixed(2)}
            thresholds={{ low: 1, medium: 2, high: 5 }}
          />
        </Col>
        <Col xs={24} md={8}>
          <PerformanceGauge
            title="Volatilidad (30d)"
            value={18.5}
            max={50}
            format={(v) => `${v.toFixed(1)}%`}
            thresholds={{ low: 20, medium: 35, high: 50 }}
          />
        </Col>
        <Col xs={24} md={8}>
          <PerformanceGauge
            title="Liquidity Ratio"
            value={92}
            max={100}
            format={(v) => `${v.toFixed(0)}%`}
            thresholds={{ low: 50, medium: 75, high: 100 }}
          />
        </Col>
      </Row>

      {/* Asset Holdings Breakdown */}
      <Card
        title={
          <Space>
            <DollarOutlined style={{ color: '#1890ff' }} />
            <span>Desglose de Activos</span>
            <Badge count={assetHoldings.length} style={{ backgroundColor: '#52c41a' }} />
          </Space>
        }
        style={{ marginBottom: 24 }}
        bordered={false}
      >
        <Table
          dataSource={assetHoldings}
          columns={[
            {
              title: 'Asset',
              dataIndex: 'asset',
              key: 'asset',
              render: (text: string, record: any) => (
                <Space>
                  <strong>{text}</strong>
                  <Tag color="blue">{record.symbol}</Tag>
                </Space>
              ),
            },
            {
              title: 'Cantidad',
              dataIndex: 'quantity',
              key: 'quantity',
              render: (val: number) => val.toLocaleString(undefined, { maximumFractionDigits: 4 }),
            },
            {
              title: 'Precio',
              dataIndex: 'price',
              key: 'price',
              render: (val: number) => `$${val.toLocaleString()}`,
            },
            {
              title: 'Valor',
              dataIndex: 'value',
              key: 'value',
              render: (val: number) => `$${val.toLocaleString()}`,
              sorter: (a: any, b: any) => a.value - b.value,
            },
            {
              title: 'Fuente de Precio',
              dataIndex: 'priceSource',
              key: 'priceSource',
              render: (text: string) => <Tag>{text}</Tag>,
            },
            {
              title: 'Última Actualización',
              dataIndex: 'lastUpdate',
              key: 'lastUpdate',
              render: (text: string) => (
                <span style={{ fontSize: '12px', color: '#8c8c8c' }}>{text}</span>
              ),
            },
            {
              title: 'Estado',
              dataIndex: 'status',
              key: 'status',
              render: (status: string) => (
                <Tag color="green" icon={<CheckCircleOutlined />}>
                  {status.toUpperCase()}
                </Tag>
              ),
            },
          ]}
          pagination={false}
          scroll={{ x: 1000 }}
          summary={(pageData) => {
            const totalValue = pageData.reduce((sum, record) => sum + record.value, 0);
            return (
              <Table.Summary fixed>
                <Table.Summary.Row style={{ background: '#fafafa' }}>
                  <Table.Summary.Cell index={0} colSpan={3}>
                    <strong>Total Assets</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <strong style={{ color: '#52c41a', fontSize: '16px' }}>
                      ${totalValue.toLocaleString()}
                    </strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2} colSpan={3} />
                </Table.Summary.Row>
              </Table.Summary>
            );
          }}
        />
      </Card>

      {/* Data Source Integration Status */}
      <Card
        title={
          <Space>
            <ApiOutlined style={{ color: '#722ed1' }} />
            <span>Estado de Integraciones</span>
            <Tag color="green">Todas Conectadas</Tag>
          </Space>
        }
        style={{ marginBottom: 24 }}
        bordered={false}
      >
        <Row gutter={[16, 16]}>
          {dataSourceStatus.map((source, index) => (
            <Col xs={24} sm={12} lg={8} key={index}>
              <Card size="small" style={{ background: '#fafafa' }}>
                <Space direction="vertical" style={{ width: '100%' }} size={8}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>{source.source}</strong>
                    <Badge status={source.status === 'connected' ? 'success' : 'error'} />
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    Tipo: {source.type} • Assets: {source.assets}
                  </div>
                  <Progress percent={source.health} size="small" strokeColor="#52c41a" />
                  <div style={{ fontSize: '11px', color: '#8c8c8c' }}>
                    Última sincronización: {source.lastSync}
                  </div>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Validation Checks */}
      <Card
        title={
          <Space>
            <SafetyOutlined style={{ color: '#52c41a' }} />
            <span>Validación y Verificaciones</span>
            <Tag color="green">7/8 Pasadas</Tag>
          </Space>
        }
        style={{ marginBottom: 24 }}
        bordered={false}
      >
        <Row gutter={[16, 16]}>
          {validationChecks.map((check, index) => (
            <Col xs={24} sm={12} key={index}>
              <Alert
                message={
                  <Space>
                    {check.status === 'passed' ? (
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    ) : (
                      <WarningOutlined style={{ color: '#faad14' }} />
                    )}
                    <strong>{check.check}</strong>
                  </Space>
                }
                description={check.details}
                type={check.status === 'passed' ? 'success' : 'warning'}
                showIcon={false}
                style={{ fontSize: '13px' }}
              />
            </Col>
          ))}
        </Row>
      </Card>

      {/* Price Verification & Adjustment History */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <LineChartOutlined style={{ color: '#1890ff' }} />
                <span>Verificación de Precios (Últimas 4h)</span>
              </Space>
            }
            bordered={false}
          >
            <Line
              data={priceHistoryData.flatMap(item => [
                { time: item.time, asset: 'BTC', price: item.btc },
                { time: item.time, asset: 'ETH', price: item.eth },
              ])}
              xField="time"
              yField="price"
              seriesField="asset"
              height={250}
              smooth
              legend={{ position: 'top' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <FileTextOutlined style={{ color: '#fa8c16' }} />
                <span>Historial de Ajustes</span>
              </Space>
            }
            bordered={false}
          >
            <Table
              dataSource={adjustmentHistory}
              columns={[
                { title: 'Fecha', dataIndex: 'date', key: 'date', width: 100 },
                { title: 'Tipo', dataIndex: 'type', key: 'type' },
                {
                  title: 'Monto',
                  dataIndex: 'amount',
                  key: 'amount',
                  render: (val: number) => (
                    <Tag color={val >= 0 ? 'green' : 'red'}>
                      {val >= 0 ? '+' : ''}${Math.abs(val)}
                    </Tag>
                  ),
                },
                {
                  title: 'Estado',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status: string) => (
                    <Tag color="green">{status.toUpperCase()}</Tag>
                  ),
                },
              ]}
              pagination={false}
              size="small"
              scroll={{ x: 600 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Detalles del Cálculo NAV */}
      <Card title="Detalle del Cálculo NAV (Hoy)" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <h4>Assets</h4>
            <div style={{ background: '#f0f2f5', padding: 16, borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Crypto Holdings</span>
                <span style={{ fontWeight: 600 }}>$18,200,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Cash & Equivalents</span>
                <span style={{ fontWeight: 600 }}>$4,300,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Receivables</span>
                <span style={{ fontWeight: 600 }}>$2,100,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Other Assets</span>
                <span style={{ fontWeight: 600 }}>$1,200,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTop: '2px solid #d9d9d9' }}>
                <span style={{ fontWeight: 600 }}>Total Assets</span>
                <span style={{ fontWeight: 600, color: '#52c41a' }}>$25,800,000</span>
              </div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <h4>Liabilities</h4>
            <div style={{ background: '#f0f2f5', padding: 16, borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Management Fees Payable</span>
                <span style={{ fontWeight: 600 }}>$150,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Performance Fees Payable</span>
                <span style={{ fontWeight: 600 }}>$100,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Other Liabilities</span>
                <span style={{ fontWeight: 600 }}>$50,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTop: '2px solid #d9d9d9' }}>
                <span style={{ fontWeight: 600 }}>Total Liabilities</span>
                <span style={{ fontWeight: 600, color: '#f5222d' }}>$300,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTop: '2px solid #000' }}>
                <span style={{ fontWeight: 700, fontSize: 16 }}>Net Assets</span>
                <span style={{ fontWeight: 700, fontSize: 16, color: '#1890ff' }}>$25,500,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <span>Units Outstanding</span>
                <span style={{ fontWeight: 600 }}>188,324</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTop: '2px solid #000', background: '#e6f7ff', padding: 12, borderRadius: 4, marginLeft: -16, marginRight: -16, paddingLeft: 16, paddingRight: 16 }}>
                <span style={{ fontWeight: 700, fontSize: 18 }}>NAV per Unit</span>
                <span style={{ fontWeight: 700, fontSize: 18, color: '#52c41a' }}>$135.45</span>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Historial NAV */}
      <Card
        title="Historial de NAV"
        extra={
          <Button icon={<HistoryOutlined />}>
            Ver Todo el Historial
          </Button>
        }
      >
        <Table
          columns={navHistoryColumns}
          dataSource={navHistoryData}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Calculate NAV Modal */}
      <Modal
        title={
          <Space>
            <CalculatorOutlined />
            <span>Calcular NAV</span>
          </Space>
        }
        open={calculateModalVisible}
        onCancel={() => setCalculateModalVisible(false)}
        onOk={handleCalculateNAV}
        width={600}
        okText="Calcular"
        cancelText="Cancelar"
      >
        <Alert
          message="Cálculo Automático de NAV"
          description="El sistema ejecutará el flujo completo de cálculo de NAV incluyendo: recopilación de datos, verificación de precios, valoración de activos, cálculo de pasivos y validaciones."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Divider />
        <Space direction="vertical" style={{ width: '100%' }} size={16}>
          <div>
            <strong>Fuentes de datos a consultar:</strong>
            <ul style={{ marginTop: 8, marginBottom: 0 }}>
              <li>Coinbase Custody, Kraken, Binance (Balances)</li>
              <li>Fireblocks (Custody Balances)</li>
              <li>CoinGecko, Chainlink Oracles (Precios)</li>
            </ul>
          </div>
          <div>
            <strong>Validaciones a ejecutar:</strong>
            <ul style={{ marginTop: 8, marginBottom: 0 }}>
              <li>Reconciliación de balances</li>
              <li>Verificación de desviación de precios</li>
              <li>Ratio de liquidez</li>
              <li>Varianza histórica</li>
            </ul>
          </div>
        </Space>
      </Modal>

      {/* NAV Adjustment Modal */}
      <Modal
        title={
          <Space>
            <AuditOutlined />
            <span>Ajustar NAV Manualmente</span>
          </Space>
        }
        open={adjustmentModalVisible}
        onCancel={() => setAdjustmentModalVisible(false)}
        onOk={() => form.submit()}
        width={700}
        okText="Enviar para Aprobación"
        cancelText="Cancelar"
      >
        <Alert
          message="Requiere Aprobación"
          description="Los ajustes manuales al NAV requieren aprobación del Compliance Officer antes de ser aplicados."
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAdjustment}
        >
          <Form.Item
            name="adjustmentType"
            label="Tipo de Ajuste"
            rules={[{ required: true, message: 'Selecciona el tipo de ajuste' }]}
          >
            <Select placeholder="Selecciona tipo">
              <Select.Option value="manual_correction">Corrección Manual</Select.Option>
              <Select.Option value="fee_accrual">Acumulación de Comisiones</Select.Option>
              <Select.Option value="asset_revaluation">Revaluación de Activo</Select.Option>
              <Select.Option value="price_correction">Corrección de Precio</Select.Option>
              <Select.Option value="other">Otro</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="amount"
            label="Monto del Ajuste ($)"
            rules={[{ required: true, message: 'Ingresa el monto' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="0.00"
              precision={2}
              step={0.01}
            />
          </Form.Item>

          <Form.Item
            name="effectiveDate"
            label="Fecha Efectiva"
            rules={[{ required: true, message: 'Selecciona la fecha' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="reason"
            label="Razón del Ajuste"
            rules={[{ required: true, message: 'Describe la razón' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Describe detalladamente la razón del ajuste..."
            />
          </Form.Item>

          <Form.Item
            name="supportingDocs"
            label="Documentos de Soporte"
          >
            <Button icon={<DownloadOutlined />}>
              Adjuntar Documentos
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NAVSystemPage;
