import { Row, Col, Table, Tag, Button, Space } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  FundOutlined,
  SettingOutlined,
  FileTextOutlined,
  SafetyOutlined,
  BankOutlined,
  GlobalOutlined,
  RiseOutlined,
  UserOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import PerformanceChart from '../../components/common/PerformanceChart';
import AssetDistribution from '../../components/common/AssetDistribution';
import RecentActivity from '../../components/common/RecentActivity';

const AdminOwnerPortal = () => {
  // Menu items para el sidebar
  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'funds',
      icon: <BankOutlined />,
      label: 'Gestión de Fondos',
    },
    {
      key: 'clients',
      icon: <TeamOutlined />,
      label: 'Gestión de Clientes',
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Usuarios y Permisos',
    },
    {
      key: 'integrations',
      icon: <GlobalOutlined />,
      label: 'Integraciones',
      children: [
        { key: 'kyc', label: 'KYC/KYB (Persona)' },
        { key: 'onramp', label: 'On/Off Ramp' },
        { key: 'blockchain', label: 'Blockchain' },
      ],
    },
    {
      key: 'compliance',
      icon: <SafetyOutlined />,
      label: 'Compliance y Auditoría',
    },
    {
      key: 'reports',
      icon: <FileTextOutlined />,
      label: 'Reporting',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Configuración',
    },
  ];

  // Datos de ejemplo para métricas
  const performanceData = [
    { date: '2024-01', value: 45000000 },
    { date: '2024-02', value: 52000000 },
    { date: '2024-03', value: 48000000 },
    { date: '2024-04', value: 61000000 },
    { date: '2024-05', value: 67000000 },
    { date: '2024-06', value: 73000000 },
    { date: '2024-07', value: 79000000 },
    { date: '2024-08', value: 85000000 },
    { date: '2024-09', value: 92000000 },
    { date: '2024-10', value: 98000000 },
    { date: '2024-11', value: 105000000 },
  ];

  const assetDistributionData = [
    { type: 'BTC', value: 35 },
    { type: 'ETH', value: 28 },
    { type: 'Tokens', value: 22 },
    { type: 'Stablecoins', value: 10 },
    { type: 'Otros', value: 5 },
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'kyc' as const,
      title: 'Nuevo fondo registrado',
      description: 'Alpha Capital Fund completó KYB',
      timestamp: 'Hace 2 horas',
      status: 'success' as const,
    },
    {
      id: '2',
      type: 'transaction' as const,
      title: 'Transacción de alto volumen',
      description: 'Beta Investments - Compra de tokens',
      timestamp: 'Hace 4 horas',
      status: 'success' as const,
      amount: '$2,500,000',
    },
    {
      id: '3',
      type: 'document' as const,
      title: 'Actualización de compliance',
      description: 'Gamma Fund actualizó documentación',
      timestamp: 'Hace 6 horas',
      status: 'pending' as const,
    },
    {
      id: '4',
      type: 'deposit' as const,
      title: 'Depósito institucional',
      description: 'Delta Partners depositó fondos',
      timestamp: 'Hace 1 día',
      status: 'success' as const,
      amount: '$5,000,000',
    },
  ];

  // Tabla de fondos activos
  const fundColumns = [
    {
      title: 'Fondo',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Gestor',
      dataIndex: 'manager',
      key: 'manager',
    },
    {
      title: 'AUM',
      dataIndex: 'aum',
      key: 'aum',
      sorter: (a: any, b: any) => parseFloat(a.aum) - parseFloat(b.aum),
      render: (value: string) => `$${value}M`,
    },
    {
      title: 'NAV',
      dataIndex: 'nav',
      key: 'nav',
      render: (value: string) => `$${value}`,
    },
    {
      title: 'Rendimiento (30d)',
      dataIndex: 'performance',
      key: 'performance',
      render: (value: number) => (
        <Tag color={value >= 0 ? 'green' : 'red'}>
          {value >= 0 ? '+' : ''}{value}%
        </Tag>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          active: 'green',
          pending: 'orange',
          suspended: 'red',
        };
        return <Tag color={colorMap[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" size="small">Ver</Button>
          <Button type="link" size="small">Editar</Button>
        </Space>
      ),
    },
  ];

  const fundData = [
    {
      key: '1',
      name: 'Alpha Capital Fund',
      manager: 'John Smith',
      aum: '25.5',
      nav: '127.85',
      performance: 12.5,
      status: 'active',
    },
    {
      key: '2',
      name: 'Beta Investments',
      manager: 'Sarah Johnson',
      aum: '18.2',
      nav: '98.42',
      performance: 8.3,
      status: 'active',
    },
    {
      key: '3',
      name: 'Gamma Fund',
      manager: 'Michael Chen',
      aum: '32.1',
      nav: '156.23',
      performance: -2.1,
      status: 'active',
    },
    {
      key: '4',
      name: 'Delta Partners',
      manager: 'Emily Davis',
      aum: '41.8',
      nav: '203.67',
      performance: 15.7,
      status: 'active',
    },
    {
      key: '5',
      name: 'Epsilon Ventures',
      manager: 'Robert Wilson',
      aum: '12.3',
      nav: '76.14',
      performance: 5.2,
      status: 'pending',
    },
  ];

  return (
    <DashboardLayout
      menuItems={menuItems}
      userRole="Super Admin"
      userName="Admin Naveo"
    >
      <div>
        <h1 style={{ marginBottom: 24 }}>Dashboard Admin Owner</h1>

        {/* Métricas principales */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="AUM Total"
              value={105000000}
              prefix="$"
              trend="up"
              trendValue={12.5}
              icon={<WalletOutlined />}
              color="#52c41a"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Fondos Activos"
              value={24}
              trend="up"
              trendValue={8.3}
              icon={<BankOutlined />}
              color="#1890ff"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Clientes Totales"
              value={1247}
              trend="up"
              trendValue={5.2}
              icon={<TeamOutlined />}
              color="#722ed1"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Volumen (30d)"
              value={45200000}
              prefix="$"
              trend="up"
              trendValue={18.7}
              icon={<RiseOutlined />}
              color="#fa8c16"
            />
          </Col>
        </Row>

        {/* Gráficos */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} lg={16}>
            <PerformanceChart
              title="Evolución del AUM Total"
              data={performanceData}
              height={350}
            />
          </Col>
          <Col xs={24} lg={8}>
            <AssetDistribution
              title="Distribución de Activos"
              data={assetDistributionData}
              height={350}
            />
          </Col>
        </Row>

        {/* Tabla de fondos y actividad reciente */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
              <h3 style={{ marginBottom: 16 }}>Fondos Activos</h3>
              <Table
                columns={fundColumns}
                dataSource={fundData}
                pagination={{ pageSize: 5 }}
              />
            </div>
          </Col>
          <Col xs={24} lg={8}>
            <RecentActivity activities={recentActivities} />
          </Col>
        </Row>
      </div>
    </DashboardLayout>
  );
};

export default AdminOwnerPortal;
