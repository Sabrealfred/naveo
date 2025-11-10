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
} from '@ant-design/icons';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import {
  DashboardPage,
  NAVSystemPage,
  AssetsManagementPage,
  OfficersManagementPage,
  TradersManagementPage,
  PortfolioManagementPage,
  InvestorsManagementPage,
  SubAdminsManagementPage,
  TransactionsPage,
  CompliancePage,
  FundReportsPage,
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
      key: '/admin-client/nav',
      icon: <LineChartOutlined />,
      label: 'Sistema NAV',
    },
    {
      key: '/admin-client/investors',
      icon: <TeamOutlined />,
      label: 'Mis Inversionistas',
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
        <Route path="assets" element={<AssetsManagementPage />} />
        <Route path="portfolio" element={<PortfolioManagementPage />} />
        <Route path="investors" element={<InvestorsManagementPage />} />
        <Route path="traders" element={<TradersManagementPage />} />
        <Route path="officers" element={<OfficersManagementPage />} />
        <Route path="admins" element={<SubAdminsManagementPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="compliance" element={<CompliancePage />} />
        <Route path="reports" element={<FundReportsPage />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminClientPortal;
