import { useMemo } from 'react';
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
  LinkOutlined,
  BankOutlined,
} from '@ant-design/icons';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useTranslation } from 'react-i18next';
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
  IntegrationsPage,
  LendingPage,
} from './pages';

const InvestorPortal = () => {
  const { t } = useTranslation();

  const menuItems = useMemo(() => [
    {
      key: '/investor',
      icon: <DashboardOutlined />,
      label: t('menu.investor.dashboard'),
    },
    {
      key: '/investor/portfolio',
      icon: <WalletOutlined />,
      label: t('menu.investor.portfolio'),
    },
    {
      key: '/investor/performance',
      icon: <LineChartOutlined />,
      label: t('menu.investor.performance'),
    },
    {
      key: '/investor/lending',
      icon: <BankOutlined />,
      label: 'Lending & Borrowing',
    },
    {
      key: '/investor/marketplace',
      icon: <ShoppingOutlined />,
      label: t('menu.investor.marketplace'),
    },
    {
      key: '/investor/transactions',
      icon: <SwapOutlined />,
      label: t('menu.investor.transactions'),
    },
    {
      key: '/investor/reports',
      icon: <FileTextOutlined />,
      label: t('menu.investor.reports'),
    },
    {
      key: '/investor/statements',
      icon: <FilePdfOutlined />,
      label: t('menu.investor.statements'),
    },
    {
      key: '/investor/tax-documents',
      icon: <AuditOutlined />,
      label: t('menu.investor.taxDocuments'),
    },
    {
      key: '/investor/notifications',
      icon: <BellOutlined />,
      label: t('menu.investor.notifications'),
    },
    {
      key: '/investor/integrations',
      icon: <LinkOutlined />,
      label: t('menu.investor.integrations'),
    },
    {
      key: '/investor/profile',
      icon: <UserOutlined />,
      label: t('menu.investor.profile'),
    },
    {
      key: '/investor/onboarding',
      icon: <UserAddOutlined />,
      label: t('menu.investor.onboarding'),
    },
  ], [t]);

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
        <Route path="lending" element={<LendingPage />} />
        <Route path="marketplace" element={<MarketplacePage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="reports" element={<InvestorReportsPage />} />
        <Route path="statements" element={<StatementsPage />} />
        <Route path="tax-documents" element={<TaxDocumentsPage />} />
        <Route path="notifications" element={<NotificationsCenterPage />} />
        <Route path="integrations" element={<IntegrationsPage />} />
        <Route path="onboarding" element={<OnboardingFlowPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="kyc-status" element={<KYCStatusPage />} />
      </Routes>
    </DashboardLayout>
  );
};

export default InvestorPortal;
