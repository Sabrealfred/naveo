import { Row, Col, Table, Tag, Button, Space, Progress, Card } from 'antd';
import {
  DashboardOutlined,
  FundProjectionScreenOutlined,
  WalletOutlined,
  TeamOutlined,
  FileTextOutlined,
  SafetyOutlined,
  LineChartOutlined,
  SwapOutlined,
  UserSwitchOutlined,
  AlertOutlined,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import PerformanceChart from '../../components/common/PerformanceChart';
import AssetDistribution from '../../components/common/AssetDistribution';
import RecentActivity from '../../components/common/RecentActivity';

const AdminClientPortal = () => {
  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'portfolio',
      icon: <FundProjectionScreenOutlined />,
      label: 'Mi Portafolio',
    },
    {
      key: 'nav',
      icon: <LineChartOutlined />,
      label: 'Sistema NAV',
    },
    {
      key: 'investors',
      icon: <TeamOutlined />,
      label: 'Mis Inversionistas',
    },
    {
      key: 'team',
      icon: <UserSwitchOutlined />,
      label: 'Equipo y Permisos',
      children: [
        { key: 'traders', label: 'Traders' },
        { key: 'officers', label: 'Compliance Officers' },
        { key: 'admins', label: 'Sub-Admins' },
      ],
    },
    {
      key: 'transactions',
      icon: <SwapOutlined />,
      label: 'Transacciones',
    },
    {
      key: 'compliance',
      icon: <SafetyOutlined />,
      label: 'Compliance',
    },
    {
      key: 'reports',
      icon: <FileTextOutlined />,
      label: 'Reportes',
    },
  ];

  const navData = [
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

  const portfolioDistribution = [
    { type: 'Bitcoin', value: 40 },
    { type: 'Ethereum', value: 30 },
    { type: 'DeFi Tokens', value: 15 },
    { type: 'Stablecoins', value: 10 },
    { type: 'NFTs', value: 5 },
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'transaction' as const,
      title: 'Compra de BTC',
      description: 'Adquisición de 2.5 BTC a $42,000',
      timestamp: 'Hace 1 hora',
      status: 'success' as const,
      amount: '$105,000',
    },
    {
      id: '2',
      type: 'deposit' as const,
      title: 'Nuevo inversionista',
      description: 'John Doe depositó fondos',
      timestamp: 'Hace 3 horas',
      status: 'success' as const,
      amount: '$250,000',
    },
    {
      id: '3',
      type: 'kyc' as const,
      title: 'KYC completado',
      description: 'Verificación de Jane Smith aprobada',
      timestamp: 'Hace 5 horas',
      status: 'success' as const,
    },
    {
      id: '4',
      type: 'document' as const,
      title: 'Reporte mensual',
      description: 'NAV Statement - Octubre 2024',
      timestamp: 'Hace 1 día',
      status: 'success' as const,
    },
  ];

  // Tabla de top holdings
  const holdingsColumns = [
    {
      title: 'Activo',
      dataIndex: 'asset',
      key: 'asset',
      render: (text: string, record: any) => (
        <Space>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: record.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold'
          }}>
            {text.substring(0, 1)}
          </div>
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Cantidad',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Precio',
      dataIndex: 'price',
      key: 'price',
      render: (value: string) => `$${value}`,
    },
    {
      title: 'Valor Total',
      dataIndex: 'totalValue',
      key: 'totalValue',
      render: (value: string) => `$${value}`,
      sorter: (a: any, b: any) => parseFloat(a.totalValue.replace(/,/g, '')) - parseFloat(b.totalValue.replace(/,/g, '')),
    },
    {
      title: '% Portafolio',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (value: number) => (
        <div>
          <div>{value}%</div>
          <Progress percent={value} showInfo={false} size="small" />
        </div>
      ),
    },
    {
      title: 'P&L (24h)',
      dataIndex: 'pnl',
      key: 'pnl',
      render: (value: number) => (
        <Tag color={value >= 0 ? 'green' : 'red'} icon={value >= 0 ? <RiseOutlined /> : <FallOutlined />}>
          {value >= 0 ? '+' : ''}{value}%
        </Tag>
      ),
    },
  ];

  const holdingsData = [
    {
      key: '1',
      asset: 'Bitcoin',
      amount: '15.5 BTC',
      price: '42,150',
      totalValue: '653,325',
      percentage: 40,
      color: '#F7931A',
      pnl: 3.5,
    },
    {
      key: '2',
      asset: 'Ethereum',
      amount: '250 ETH',
      price: '2,250',
      totalValue: '562,500',
      percentage: 30,
      color: '#627EEA',
      pnl: 5.2,
    },
    {
      key: '3',
      asset: 'Chainlink',
      amount: '8,500 LINK',
      price: '15.50',
      totalValue: '131,750',
      percentage: 15,
      color: '#2A5ADA',
      pnl: -1.8,
    },
    {
      key: '4',
      asset: 'USDC',
      amount: '125,000 USDC',
      price: '1.00',
      totalValue: '125,000',
      percentage: 10,
      color: '#2775CA',
      pnl: 0.0,
    },
    {
      key: '5',
      asset: 'Aave',
      amount: '750 AAVE',
      price: '95.00',
      totalValue: '71,250',
      percentage: 5,
      color: '#B6509E',
      pnl: 2.1,
    },
  ];

  // Inversionistas recientes
  const investorsColumns = [
    {
      title: 'Inversionista',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Inversión',
      dataIndex: 'investment',
      key: 'investment',
      render: (value: string) => `$${value}`,
    },
    {
      title: 'NAV Units',
      dataIndex: 'units',
      key: 'units',
    },
    {
      title: 'Estado KYC',
      dataIndex: 'kycStatus',
      key: 'kycStatus',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          approved: 'green',
          pending: 'orange',
          rejected: 'red',
        };
        return <Tag color={colorMap[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Fecha',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  const investorsData = [
    { key: '1', name: 'John Doe', investment: '250,000', units: '1,845.92', kycStatus: 'approved', date: '2024-11-08' },
    { key: '2', name: 'Jane Smith', investment: '500,000', units: '3,691.85', kycStatus: 'approved', date: '2024-11-07' },
    { key: '3', name: 'Bob Johnson', investment: '100,000', units: '738.37', kycStatus: 'pending', date: '2024-11-06' },
    { key: '4', name: 'Alice Williams', investment: '750,000', units: '5,537.77', kycStatus: 'approved', date: '2024-11-05' },
  ];

  return (
    <DashboardLayout
      menuItems={menuItems}
      userRole="Fund Manager"
      userName="Sarah Johnson"
    >
      <div>
        <h1 style={{ marginBottom: 24 }}>Dashboard - Gestor de Fondo</h1>

        {/* Métricas principales */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="AUM"
              value={25500000}
              prefix="$"
              trend="up"
              trendValue={8.3}
              icon={<WalletOutlined />}
              color="#52c41a"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="NAV por Unidad"
              value={135.45}
              prefix="$"
              trend="up"
              trendValue={2.8}
              icon={<LineChartOutlined />}
              color="#1890ff"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Inversionistas"
              value={247}
              trend="up"
              trendValue={5.1}
              icon={<TeamOutlined />}
              color="#722ed1"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Rendimiento (YTD)"
              value={35.45}
              suffix="%"
              trend="up"
              trendValue={12.3}
              icon={<RiseOutlined />}
              color="#fa8c16"
            />
          </Col>
        </Row>

        {/* Alerts */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={24}>
            <Card>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <AlertOutlined style={{ fontSize: 20, color: '#faad14', marginRight: 12 }} />
                  <div>
                    <strong>3 inversionistas pendientes de KYC</strong>
                    <div style={{ color: '#666', fontSize: 14 }}>Requieren aprobación para comenzar trading</div>
                  </div>
                  <Button type="primary" size="small" style={{ marginLeft: 'auto' }}>Revisar</Button>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Gráficos */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} lg={16}>
            <PerformanceChart
              title="Evolución del NAV"
              data={navData}
              height={350}
            />
          </Col>
          <Col xs={24} lg={8}>
            <AssetDistribution
              title="Distribución de Portafolio"
              data={portfolioDistribution}
              height={350}
            />
          </Col>
        </Row>

        {/* Tablas */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24}>
            <Card title="Top Holdings" bordered={false}>
              <Table
                columns={holdingsColumns}
                dataSource={holdingsData}
                pagination={false}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card title="Nuevos Inversionistas" bordered={false}>
              <Table
                columns={investorsColumns}
                dataSource={investorsData}
                pagination={false}
              />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <RecentActivity activities={recentActivities} />
          </Col>
        </Row>
      </div>
    </DashboardLayout>
  );
};

export default AdminClientPortal;
