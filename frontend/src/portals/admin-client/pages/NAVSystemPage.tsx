import { Row, Col, Card, Table, Button, Space, Statistic, Tag } from 'antd';
import { DownloadOutlined, CalculatorOutlined, HistoryOutlined } from '@ant-design/icons';
import { PerformanceChart, PerformanceGauge, ComparisonChart } from '../../../components/common';

const NAVSystemPage = () => {
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
          <Button icon={<CalculatorOutlined />}>
            Calcular NAV
          </Button>
          <Button type="primary" icon={<DownloadOutlined />}>
            Exportar Reporte
          </Button>
        </Space>
      </div>

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
    </div>
  );
};

export default NAVSystemPage;
