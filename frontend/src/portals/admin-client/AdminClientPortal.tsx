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
  BarChartOutlined,
  BellOutlined,
  LockOutlined,
  RobotOutlined,
  CommentOutlined,
  CalendarOutlined,
  DollarOutlined,
  SyncOutlined,
  BankOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import {
  DashboardPage,
  NAVSystemPage,
  AssetsManagementPage,
  OfficersManagementPage,
  TradersManagementPage,
  KYCManagementPage,
  AnalyticsPage,
  ReportsPage,
  NotificationsCenterPage,
  InvestorsManagementPage,
  TransactionsPage,
  CompliancePage,
  PortfolioManagementPage,
  SubAdminsManagementPage,
  SubscriptionCalendarPage,
  CapitalCallPage,
  RebalancingPage,
  TradingDashboardPage,
  RiskDashboardPage,
  GateManagementPage,
  AIStrategyManagementPage,
  AIAgentPage,
  BankingPaymentsPage,
  ClientOrderManagementPage,
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
      key: '/admin-client/ai-agent',
      icon: <CommentOutlined />,
      label: 'AI Agent Asistente',
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
      key: '/admin-client/analytics',
      icon: <BarChartOutlined />,
      label: 'Analytics',
    },
    {
      key: '/admin-client/investors',
      icon: <TeamOutlined />,
      label: 'Mis Inversionistas',
    },
    {
      key: '/admin-client/client-orders',
      icon: <ShoppingCartOutlined />,
      label: 'Client Orders',
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
      key: '/admin-client/banking',
      icon: <BankOutlined />,
      label: 'Banking & Payments',
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
    {
      key: '/admin-client/notifications',
      icon: <BellOutlined />,
      label: 'Notifications',
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
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="assets" element={<AssetsManagementPage />} />
        <Route path="traders" element={<TradersManagementPage />} />
        <Route path="portfolio" element={<PortfolioManagementPage />} />
        <Route path="ai-strategy" element={<AIStrategyManagementPage />} />
        <Route path="ai-agent" element={<AIAgentPage />} />
        <Route path="investors" element={<InvestorsManagementPage />} />
        <Route path="client-orders" element={<ClientOrderManagementPage />} />
        <Route path="subscription-calendar" element={<SubscriptionCalendarPage />} />
        <Route path="capital-calls" element={<CapitalCallPage />} />
        <Route path="gate-management" element={<GateManagementPage />} />
        <Route path="officers" element={<OfficersManagementPage />} />
        <Route path="admins" element={<SubAdminsManagementPage />} />
        <Route path="banking" element={<BankingPaymentsPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="compliance" element={<CompliancePage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="notifications" element={<NotificationsCenterPage />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminClientPortal;
