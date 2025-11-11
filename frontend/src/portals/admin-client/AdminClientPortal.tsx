import { Routes, Route } from 'react-router-dom';
import {
  DashboardOutlined,
  FundProjectionScreenOutlined,
  LineChartOutlined,
  AppstoreAddOutlined,
  TeamOutlined,
  FileTextOutlined,
  SafetyOutlined,
  SwapOutlined,
  UserSwitchOutlined,
  CalendarOutlined,
  DollarOutlined,
  SyncOutlined,
  BarChartOutlined,
  LockOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import {
  DashboardPage,
  NAVSystemPage,
  AssetsManagementPage,
  OfficersManagementPage,
  TradersManagementPage,
  SubscriptionCalendarPage,
  CapitalCallPage,
  RebalancingPage,
  TradingDashboardPage,
  RiskDashboardPage,
  GateManagementPage,
  AIStrategyManagementPage,
} from './pages';

const AdminClientPortal = () => {
  const menuItems = [
    {
      key: '/admin-client',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/admin-client/assets',
      icon: <AppstoreAddOutlined />,
      label: 'Activos del Fondo',
    },
    {
      key: '/admin-client/portfolio',
      icon: <FundProjectionScreenOutlined />,
      label: 'Mi Portafolio',
    },
    {
      key: '/admin-client/ai-strategy',
      icon: <RobotOutlined />,
      label: 'Estrategias AI',
    },
    {
      key: '/admin-client/nav',
      icon: <LineChartOutlined />,
      label: 'Sistema NAV',
    },
    {
      key: '/admin-client/rebalancing',
      icon: <SyncOutlined />,
      label: 'Portfolio Rebalancing',
    },
    {
      key: '/admin-client/trading',
      icon: <BarChartOutlined />,
      label: 'Trading Dashboard',
    },
    {
      key: '/admin-client/risk',
      icon: <SafetyOutlined />,
      label: 'Risk Dashboard',
    },
    {
      key: '/admin-client/investors',
      icon: <TeamOutlined />,
      label: 'Mis Inversionistas',
    },
    {
      key: '/admin-client/subscription-calendar',
      icon: <CalendarOutlined />,
      label: 'Subscription Calendar',
    },
    {
      key: '/admin-client/capital-calls',
      icon: <DollarOutlined />,
      label: 'Capital Calls',
    },
    {
      key: '/admin-client/gate-management',
      icon: <LockOutlined />,
      label: 'Gate Management',
    },
    {
      key: 'team',
      icon: <UserSwitchOutlined />,
      label: 'Equipo y Permisos',
      children: [
        { key: '/admin-client/traders', label: 'Traders' },
        { key: '/admin-client/officers', label: 'Compliance Officers' },
        { key: '/admin-client/admins', label: 'Sub-Admins' },
      ],
    },
    {
      key: '/admin-client/transactions',
      icon: <SwapOutlined />,
      label: 'Transacciones',
    },
    {
      key: '/admin-client/compliance',
      icon: <SafetyOutlined />,
      label: 'Compliance',
    },
    {
      key: '/admin-client/reports',
      icon: <FileTextOutlined />,
      label: 'Reportes',
    },
  ];

  return (
    <DashboardLayout
      menuItems={menuItems}
      userRole="Fund Manager"
      userName="Sarah Johnson"
    >
      <Routes>
        <Route index element={<DashboardPage />} />
        <Route path="nav" element={<NAVSystemPage />} />
        <Route path="rebalancing" element={<RebalancingPage />} />
        <Route path="trading" element={<TradingDashboardPage />} />
        <Route path="risk" element={<RiskDashboardPage />} />
        <Route path="assets" element={<AssetsManagementPage />} />
        <Route path="traders" element={<TradersManagementPage />} />
        {/* Temporary placeholder for missing pages */}
        <Route path="portfolio" element={<div style={{ padding: 24 }}><h2>Portfolio - Coming Soon</h2></div>} />
        <Route path="ai-strategy" element={<AIStrategyManagementPage />} />
        <Route path="investors" element={<div style={{ padding: 24 }}><h2>Investors Management - Coming Soon</h2></div>} />
        <Route path="subscription-calendar" element={<SubscriptionCalendarPage />} />
        <Route path="capital-calls" element={<CapitalCallPage />} />
        <Route path="gate-management" element={<GateManagementPage />} />
        <Route path="officers" element={<OfficersManagementPage />} />
        <Route path="admins" element={<div style={{ padding: 24 }}><h2>Sub-Admins - Coming Soon</h2></div>} />
        <Route path="transactions" element={<div style={{ padding: 24 }}><h2>Transactions - Coming Soon</h2></div>} />
        <Route path="compliance" element={<div style={{ padding: 24 }}><h2>Compliance - Coming Soon</h2></div>} />
        <Route path="reports" element={<div style={{ padding: 24 }}><h2>Reports - Coming Soon</h2></div>} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminClientPortal;
