import { Routes, Route } from 'react-router-dom';
import {
  DashboardOutlined,
  ShoppingOutlined,
  WalletOutlined,
  SwapOutlined,
  FileTextOutlined,
  UserOutlined,
  LineChartOutlined,
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
        <Route path="profile" element={<ProfilePage />} />
        <Route path="kyc-status" element={<KYCStatusPage />} />
      </Routes>
    </DashboardLayout>
  );
};

export default InvestorPortal;
