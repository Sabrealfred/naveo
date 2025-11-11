import { Routes, Route } from 'react-router-dom';
import {
  DashboardOutlined,
  ShoppingOutlined,
  WalletOutlined,
  SwapOutlined,
  FileTextOutlined,
  UserOutlined,
  LineChartOutlined,
  BellOutlined,
  FilePdfOutlined,
  AuditOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import {
  DashboardPage,
  PortfolioPage,
  MarketplacePage,
  TransactionsPage,
  KYCStatusPage,
  PerformanceAnalyticsPage,
  InvestorReportsPage,
  ProfilePage,
  OnboardingFlowPage,
  StatementsPage,
  TaxDocumentsPage,
  NotificationsCenterPage,
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
      key: '/investor/statements',
      icon: <FilePdfOutlined />,
      label: 'Statements',
    },
    {
      key: '/investor/tax-documents',
      icon: <AuditOutlined />,
      label: 'Tax Documents',
    },
    {
      key: '/investor/notifications',
      icon: <BellOutlined />,
      label: 'Notifications',
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
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="reports" element={<InvestorReportsPage />} />
        <Route path="statements" element={<StatementsPage />} />
        <Route path="tax-documents" element={<TaxDocumentsPage />} />
        <Route path="notifications" element={<NotificationsCenterPage />} />
        <Route path="onboarding" element={<OnboardingFlowPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="kyc-status" element={<KYCStatusPage />} />
      </Routes>
    </DashboardLayout>
  );
};

export default InvestorPortal;
