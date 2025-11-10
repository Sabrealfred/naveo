import { Row, Col, Table, Tag, Button, Space, Card, List, Avatar } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  WalletOutlined,
  HistoryOutlined,
  FileTextOutlined,
  UserOutlined,
  DollarOutlined,
  SwapOutlined,
  RiseOutlined,
  LineChartOutlined,
  ShoppingCartOutlined,
  BellOutlined,
} from '@ant-design/icons';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import PerformanceChart from '../../components/common/PerformanceChart';
import AssetDistribution from '../../components/common/AssetDistribution';
import RecentActivity from '../../components/common/RecentActivity';

const InvestorPortal = () => {
  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'portfolio',
      icon: <WalletOutlined />,
      label: 'Mi Portafolio',
    },
    {
      key: 'marketplace',
      icon: <ShoppingOutlined />,
      label: 'Marketplace',
    },
    {
      key: 'transactions',
      icon: <SwapOutlined />,
      label: 'Transacciones',
      children: [
        { key: 'buy', label: 'Comprar' },
        { key: 'sell', label: 'Vender' },
        { key: 'history', label: 'Historial' },
      ],
    },
    {
      key: 'nav',
      icon: <LineChartOutlined />,
      label: 'Performance',
    },
    {
      key: 'reports',
      icon: <FileTextOutlined />,
      label: 'Reportes y Estados',
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Mi Perfil',
    },
  ];

  const portfolioValueData = [
    { date: '2024-01', value: 100000 },
    { date: '2024-02', value: 105000 },
    { date: '2024-03', value: 102500 },
    { date: '2024-04', value: 110000 },
    { date: '2024-05', value: 115000 },
    { date: '2024-06', value: 120000 },
    { date: '2024-07', value: 125000 },
    { date: '2024-08', value: 130000 },
    { date: '2024-09', value: 135000 },
    { date: '2024-10', value: 142000 },
    { date: '2024-11', value: 150000 },
  ];

  const assetAllocation = [
    { type: 'Alpha Fund', value: 45 },
    { type: 'Beta Fund', value: 30 },
    { type: 'Gamma Token', value: 15 },
    { type: 'Delta Token', value: 10 },
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'transaction' as const,
      title: 'Compra completada',
      description: 'Alpha Fund - 50 units',
      timestamp: 'Hace 2 horas',
      status: 'success' as const,
      amount: '$7,500',
    },
    {
      id: '2',
      type: 'deposit' as const,
      title: 'Depósito confirmado',
      description: 'Wire transfer recibido',
      timestamp: 'Hace 1 día',
      status: 'success' as const,
      amount: '$25,000',
    },
    {
      id: '3',
      type: 'transaction' as const,
      title: 'Venta ejecutada',
      description: 'Beta Fund - 30 units',
      timestamp: 'Hace 2 días',
      status: 'success' as const,
      amount: '$4,200',
    },
    {
      id: '4',
      type: 'document' as const,
      title: 'Estado de cuenta',
      description: 'Q3 2024 disponible',
      timestamp: 'Hace 3 días',
      status: 'success' as const,
    },
  ];

  // Tabla de holdings del inversionista
  const holdingsColumns = [
    {
      title: 'Activo',
      dataIndex: 'asset',
      key: 'asset',
      render: (text: string, record: any) => (
        <Space>
          <Avatar style={{ backgroundColor: record.color }}>
            {text.substring(0, 2).toUpperCase()}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <div style={{ fontSize: 12, color: '#999' }}>{record.type}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'NAV Units',
      dataIndex: 'units',
      key: 'units',
    },
    {
      title: 'NAV Price',
      dataIndex: 'navPrice',
      key: 'navPrice',
      render: (value: string) => `$${value}`,
    },
    {
      title: 'Valor Total',
      dataIndex: 'totalValue',
      key: 'totalValue',
      render: (value: string) => `$${value}`,
    },
    {
      title: 'Costo Base',
      dataIndex: 'costBasis',
      key: 'costBasis',
      render: (value: string) => `$${value}`,
    },
    {
      title: 'P&L',
      dataIndex: 'pnl',
      key: 'pnl',
      render: (value: string, record: any) => (
        <div>
          <div style={{ color: record.pnlPercent >= 0 ? '#52c41a' : '#f5222d', fontWeight: 500 }}>
            {value >= 0 ? '+' : ''}${value}
          </div>
          <Tag color={record.pnlPercent >= 0 ? 'green' : 'red'} style={{ marginTop: 4 }}>
            {record.pnlPercent >= 0 ? '+' : ''}{record.pnlPercent}%
          </Tag>
        </div>
      ),
    },
  ];

  const holdingsData = [
    {
      key: '1',
      asset: 'Alpha Capital Fund',
      type: 'Fund Token',
      units: '450.00',
      navPrice: '135.45',
      totalValue: '60,952.50',
      costBasis: '56,700.00',
      pnl: '4,252.50',
      pnlPercent: 7.5,
      color: '#1890ff',
    },
    {
      key: '2',
      asset: 'Beta Investments',
      type: 'Fund Token',
      units: '320.00',
      navPrice: '98.42',
      totalValue: '31,494.40',
      costBasis: '30,000.00',
      pnl: '1,494.40',
      pnlPercent: 5.0,
      color: '#52c41a',
    },
    {
      key: '3',
      asset: 'Gamma Token',
      type: 'Asset Token',
      units: '1,200.00',
      navPrice: '18.75',
      totalValue: '22,500.00',
      costBasis: '20,000.00',
      pnl: '2,500.00',
      pnlPercent: 12.5,
      color: '#722ed1',
    },
    {
      key: '4',
      asset: 'Delta Token',
      type: 'Asset Token',
      units: '800.00',
      navPrice: '25.30',
      totalValue: '20,240.00',
      costBasis: '21,000.00',
      pnl: '-760.00',
      pnlPercent: -3.6,
      color: '#fa8c16',
    },
  ];

  // Marketplace de tokens disponibles
  const marketplaceData = [
    {
      key: '1',
      name: 'Epsilon Ventures',
      description: 'High-growth DeFi focused fund',
      nav: '156.23',
      minInvestment: '10,000',
      performance: '+18.5%',
      risk: 'Alto',
    },
    {
      key: '2',
      name: 'Zeta Real Estate',
      description: 'Tokenized real estate portfolio',
      nav: '203.67',
      minInvestment: '25,000',
      performance: '+12.3%',
      risk: 'Medio',
    },
    {
      key: '3',
      name: 'Theta Stable Fund',
      description: 'Conservative yield strategy',
      nav: '76.14',
      minInvestment: '5,000',
      performance: '+5.2%',
      risk: 'Bajo',
    },
  ];

  return (
    <DashboardLayout
      menuItems={menuItems}
      userRole="Inversionista"
      userName="John Doe"
    >
      <div>
        <h1 style={{ marginBottom: 24 }}>Mi Dashboard</h1>

        {/* Métricas principales */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Valor Total del Portafolio"
              value={150000}
              prefix="$"
              trend="up"
              trendValue={15.5}
              icon={<WalletOutlined />}
              color="#52c41a"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Ganancia Total"
              value={7486.90}
              prefix="$"
              trend="up"
              trendValue={8.2}
              icon={<RiseOutlined />}
              color="#1890ff"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Inversión Inicial"
              value={127700}
              prefix="$"
              icon={<DollarOutlined />}
              color="#722ed1"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Rendimiento Total"
              value={17.8}
              suffix="%"
              trend="up"
              trendValue={3.2}
              icon={<LineChartOutlined />}
              color="#fa8c16"
            />
          </Col>
        </Row>

        {/* Quick Actions */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={24}>
            <Card title="Acciones Rápidas" bordered={false}>
              <Space size="large">
                <Button type="primary" icon={<ShoppingCartOutlined />} size="large">
                  Comprar Tokens
                </Button>
                <Button icon={<SwapOutlined />} size="large">
                  Vender
                </Button>
                <Button icon={<DollarOutlined />} size="large">
                  Depositar Fondos
                </Button>
                <Button icon={<FileTextOutlined />} size="large">
                  Ver Reportes
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Gráficos */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} lg={16}>
            <PerformanceChart
              title="Evolución de Mi Portafolio"
              data={portfolioValueData}
              height={350}
            />
          </Col>
          <Col xs={24} lg={8}>
            <AssetDistribution
              title="Distribución de Activos"
              data={assetAllocation}
              height={350}
            />
          </Col>
        </Row>

        {/* Mis Holdings */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24}>
            <Card title="Mis Holdings" bordered={false}>
              <Table
                columns={holdingsColumns}
                dataSource={holdingsData}
                pagination={false}
              />
            </Card>
          </Col>
        </Row>

        {/* Marketplace y Actividad */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card
              title="Tokens Disponibles en Marketplace"
              bordered={false}
              extra={<Button type="link">Ver Todos</Button>}
            >
              <List
                dataSource={marketplaceData}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button type="primary" size="small">Invertir</Button>,
                      <Button size="small">Ver Detalles</Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar size={48} style={{ backgroundColor: '#1890ff' }}>
                          {item.name.substring(0, 1)}
                        </Avatar>
                      }
                      title={item.name}
                      description={
                        <div>
                          <div style={{ marginBottom: 8 }}>{item.description}</div>
                          <Space size="large">
                            <span>NAV: <strong>${item.nav}</strong></span>
                            <span>Min: <strong>${item.minInvestment}</strong></span>
                            <Tag color="green">{item.performance}</Tag>
                            <Tag color={item.risk === 'Alto' ? 'red' : item.risk === 'Medio' ? 'orange' : 'blue'}>
                              Riesgo {item.risk}
                            </Tag>
                          </Space>
                        </div>
                      }
                    />
                  </List.Item>
                )}
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

export default InvestorPortal;
