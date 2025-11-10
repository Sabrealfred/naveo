import { Routes, Route } from 'react-router-dom';
import {
  DashboardOutlined,
  TeamOutlined,
  BankOutlined,
  SettingOutlined,
  FileTextOutlined,
  SafetyOutlined,
  GlobalOutlined,
  UserOutlined,
  BellOutlined,
  AuditOutlined,
  ProjectOutlined,
} from '@ant-design/icons';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import {
  DashboardPage,
  FundsManagementPage,
  ClientsManagementPage,
  CompliancePage,
  ReportsPage,
  UsersPermissionsPage,
  ConfigurationPage,
  IntegrationsBlockchainPage,
  IntegrationsKYCPage,
  IntegrationsOnRampPage,
  PlatformAnalyticsPage,
  SmartContractsPage,
  FeeStructurePage,
  AuditLogsPage,
  NotificationsCenterPage,
  AssetPipelinePage,
} from './pages';

const AdminOwnerPortal = () => {
  // Menu items para el sidebar
  const menuItems = [
    {
      key: '/admin-owner',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/admin-owner/funds',
      icon: <BankOutlined />,
      label: 'Gestión de Fondos',
    },
    {
      key: '/admin-owner/asset-pipeline',
      icon: <ProjectOutlined />,
      label: 'Asset Pipeline',
    },
    {
      key: '/admin-owner/clients',
      icon: <TeamOutlined />,
      label: 'Gestión de Clientes',
    },
    {
      key: '/admin-owner/users',
      icon: <UserOutlined />,
      label: 'Usuarios y Permisos',
    },
    {
      key: 'integrations',
      icon: <GlobalOutlined />,
      label: 'Integraciones',
      children: [
        { key: '/admin-owner/integrations/kyc', label: 'KYC/KYB (Persona)' },
        { key: '/admin-owner/integrations/onramp', label: 'On/Off Ramp' },
        { key: '/admin-owner/integrations/blockchain', label: 'Blockchain' },
      ],
    },
    {
      key: '/admin-owner/compliance',
      icon: <SafetyOutlined />,
      label: 'Compliance y Auditoría',
    },
    {
      key: '/admin-owner/reports',
      icon: <FileTextOutlined />,
      label: 'Reporting',
    },
    {
      key: '/admin-owner/audit-logs',
      icon: <AuditOutlined />,
      label: 'Audit Logs',
    },
    {
      key: '/admin-owner/notifications',
      icon: <BellOutlined />,
      label: 'Notifications',
    },
    {
      key: '/admin-owner/settings',
      icon: <SettingOutlined />,
      label: 'Configuración',
    },
  ];

  return (
    <DashboardLayout
      menuItems={menuItems}
      userRole="Super Admin"
      userName="Admin Naveo"
    >
      <Routes>
        <Route index element={<DashboardPage />} />
        <Route path="funds" element={<FundsManagementPage />} />
        <Route path="asset-pipeline" element={<AssetPipelinePage />} />
        <Route path="clients" element={<ClientsManagementPage />} />
        <Route path="users" element={<UsersPermissionsPage />} />
        <Route path="integrations/kyc" element={<IntegrationsKYCPage />} />
        <Route path="integrations/onramp" element={<IntegrationsOnRampPage />} />
        <Route path="integrations/blockchain" element={<IntegrationsBlockchainPage />} />
        <Route path="compliance" element={<CompliancePage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="analytics" element={<PlatformAnalyticsPage />} />
        <Route path="smart-contracts" element={<SmartContractsPage />} />
        <Route path="fee-structure" element={<FeeStructurePage />} />
        <Route path="audit-logs" element={<AuditLogsPage />} />
        <Route path="notifications" element={<NotificationsCenterPage />} />
        <Route path="settings" element={<ConfigurationPage />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminOwnerPortal;
