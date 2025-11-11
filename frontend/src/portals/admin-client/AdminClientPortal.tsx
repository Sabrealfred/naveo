import { useMemo } from 'react';
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
  LinkOutlined,
} from '@ant-design/icons';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useTranslation } from 'react-i18next';
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
  IntegrationsPage,
} from './pages';

const AdminClientPortal = () => {
  const { t } = useTranslation();

  const menuItems = useMemo(() => [
    {
      key: '/admin-client',
      icon: <DashboardOutlined />,
      label: t('menu.adminClient.dashboard'),
    },
    {
      key: '/admin-client/assets',
      icon: <AppstoreAddOutlined />,
      label: t('menu.adminClient.assets'),
    },
    {
      key: '/admin-client/portfolio',
      icon: <FundProjectionScreenOutlined />,
      label: t('menu.adminClient.portfolio'),
    },
    {
      key: '/admin-client/ai-strategy',
      icon: <RobotOutlined />,
      label: t('menu.adminClient.aiStrategy'),
    },
    {
      key: '/admin-client/ai-agent',
      icon: <CommentOutlined />,
      label: t('menu.adminClient.aiAgent'),
    },
    {
      key: '/admin-client/nav',
      icon: <LineChartOutlined />,
      label: t('menu.adminClient.nav'),
    },
    {
      key: '/admin-client/rebalancing',
      icon: <SyncOutlined />,
      label: t('menu.adminClient.rebalancing'),
    },
    {
      key: '/admin-client/trading',
      icon: <BarChartOutlined />,
      label: t('menu.adminClient.trading'),
    },
    {
      key: '/admin-client/risk',
      icon: <SafetyOutlined />,
      label: t('menu.adminClient.risk'),
    },
    {
      key: '/admin-client/analytics',
      icon: <BarChartOutlined />,
      label: t('menu.adminClient.analytics'),
    },
    {
      key: '/admin-client/investors',
      icon: <TeamOutlined />,
      label: t('menu.adminClient.investors'),
    },
    {
      key: '/admin-client/subscription-calendar',
      icon: <CalendarOutlined />,
      label: t('menu.adminClient.subscriptionCalendar'),
    },
    {
      key: '/admin-client/capital-calls',
      icon: <DollarOutlined />,
      label: t('menu.adminClient.capitalCalls'),
    },
    {
      key: '/admin-client/gate-management',
      icon: <LockOutlined />,
      label: t('menu.adminClient.gateManagement'),
    },
    {
      key: 'team',
      icon: <UserSwitchOutlined />,
      label: t('menu.adminClient.team'),
      children: [
        { key: '/admin-client/traders', label: t('menu.adminClient.traders') },
        { key: '/admin-client/officers', label: t('menu.adminClient.officers') },
        { key: '/admin-client/admins', label: t('menu.adminClient.admins') },
      ],
    },
    {
      key: '/admin-client/transactions',
      icon: <SwapOutlined />,
      label: t('menu.adminClient.transactions'),
    },
    {
      key: '/admin-client/compliance',
      icon: <SafetyOutlined />,
      label: t('menu.adminClient.compliance'),
    },
    {
      key: '/admin-client/integrations',
      icon: <LinkOutlined />,
      label: t('menu.adminClient.integrations'),
    },
    {
      key: '/admin-client/reports',
      icon: <FileTextOutlined />,
      label: t('menu.adminClient.reports'),
    },
    {
      key: '/admin-client/notifications',
      icon: <BellOutlined />,
      label: t('menu.adminClient.notifications'),
    },
  ], [t]);

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
        <Route path="subscription-calendar" element={<SubscriptionCalendarPage />} />
        <Route path="capital-calls" element={<CapitalCallPage />} />
        <Route path="gate-management" element={<GateManagementPage />} />
        <Route path="officers" element={<OfficersManagementPage />} />
        <Route path="admins" element={<SubAdminsManagementPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="compliance" element={<CompliancePage />} />
        <Route path="integrations" element={<IntegrationsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="notifications" element={<NotificationsCenterPage />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminClientPortal;
