import { Routes, Route } from 'react-router-dom';
import {
  DashboardOutlined,
  DollarOutlined,
  ShoppingOutlined,
  WalletOutlined,
  SwapOutlined,
  FileTextOutlined,
  UserOutlined,
  LineChartOutlined,
  BarChartOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import {
  DashboardPage,
  PortfolioPage,
  MarketplacePage,
  TransactionsPage,
  KYCStatusPage,
  PerformanceAnalyticsPage,
  OnboardingPage,
  SuitabilityQuestionnairePage,
  SubscriptionWorkflowPage,
  TradingPlatformPage,
  RedemptionPage,
} from './pages';

const InvestorPortal = () => {
  const menuItems = [
    {
      key: '/investor',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/investor/portfolio',
      icon: <WalletOutlined />,
      label: 'Mi Portafolio',
    },
    {
      key: '/investor/performance',
      icon: <LineChartOutlined />,
      label: 'Performance Analytics',
    },
    {
      key: '/investor/marketplace',
      icon: <ShoppingOutlined />,
      label: 'Marketplace',
    },
    {
      key: '/investor/trading',
      icon: <BarChartOutlined />,
      label: 'Trading Platform',
    },
    {
      key: '/investor/subscription',
      icon: <DollarOutlined />,
      label: 'Subscribe to Fund',
    },
    {
      key: '/investor/redemption',
      icon: <RollbackOutlined />,
      label: 'Redemption',
    },
    {
      key: '/investor/onboarding',
      icon: <UserOutlined />,
      label: 'Onboarding',
    },
    {
      key: '/investor/suitability',
      icon: <FileTextOutlined />,
      label: 'Suitability Assessment',
    },
    {
      key: '/investor/transactions',
      icon: <SwapOutlined />,
      label: 'Transacciones',
    },
    {
      key: '/investor/reports',
      icon: <FileTextOutlined />,
      label: 'Reportes',
    },
    {
      key: '/investor/profile',
      icon: <UserOutlined />,
      label: 'Mi Perfil',
    },
  ];

  return (
    <DashboardLayout
      menuItems={menuItems}
      userRole="Investor"
      userName="John Doe"
    >
      <Routes>
        <Route index element={<DashboardPage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="performance" element={<PerformanceAnalyticsPage />} />
        <Route path="marketplace" element={<MarketplacePage />} />
        <Route path="trading" element={<TradingPlatformPage />} />
        <Route path="subscription" element={<SubscriptionWorkflowPage />} />
        <Route path="redemption" element={<RedemptionPage />} />
        <Route path="onboarding" element={<OnboardingPage />} />
        <Route path="suitability" element={<SuitabilityQuestionnairePage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="kyc-status" element={<KYCStatusPage />} />
        {/* Temporary placeholder for missing pages */}
        <Route path="reports" element={<div style={{ padding: 24 }}><h2>Reports - Coming Soon</h2></div>} />
        <Route path="profile" element={<div style={{ padding: 24 }}><h2>Profile - Coming Soon</h2></div>} />
      </Routes>
    </DashboardLayout>
  );
};

export default InvestorPortal;
