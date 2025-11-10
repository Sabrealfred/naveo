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
  WalletOutlined,
  DollarCircleOutlined,
  ShareAltOutlined,
  FireOutlined,
  ApartmentOutlined,
  CheckCircleOutlined,
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
  WalletManagementPage,
  BankingIntegrationsPage,
  DistributionChannelsPage,
  TokenLifecyclePage,
  BusinessRulesPage,
  ApprovalWorkflowsPage,
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
      key: 'tokenization',
      icon: <DollarCircleOutlined />,
      label: 'Tokenization',
      children: [
        { key: '/admin-owner/token-lifecycle', label: 'Token Lifecycle', icon: <FireOutlined /> },
        { key: '/admin-owner/smart-contracts', label: 'Smart Contracts', icon: <ApartmentOutlined /> },
        { key: '/admin-owner/business-rules', label: 'Business Rules', icon: <SettingOutlined /> },
        { key: '/admin-owner/approval-workflows', label: 'Approval Workflows', icon: <CheckCircleOutlined /> },
      ],
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
        { key: '/admin-owner/integrations/wallets', label: 'Wallets', icon: <WalletOutlined /> },
        { key: '/admin-owner/integrations/banking', label: 'Banking', icon: <BankOutlined /> },
        { key: '/admin-owner/integrations/distribution', label: 'Distribution Channels', icon: <ShareAltOutlined /> },
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

        {/* Tokenization Routes */}
        <Route path="token-lifecycle" element={<TokenLifecyclePage />} />
        <Route path="smart-contracts" element={<SmartContractsPage />} />
        <Route path="business-rules" element={<BusinessRulesPage />} />
        <Route path="approval-workflows" element={<ApprovalWorkflowsPage />} />

        <Route path="clients" element={<ClientsManagementPage />} />
        <Route path="users" element={<UsersPermissionsPage />} />

        {/* Integrations Routes */}
        <Route path="integrations/wallets" element={<WalletManagementPage />} />
        <Route path="integrations/banking" element={<BankingIntegrationsPage />} />
        <Route path="integrations/distribution" element={<DistributionChannelsPage />} />
        <Route path="integrations/kyc" element={<IntegrationsKYCPage />} />
        <Route path="integrations/onramp" element={<IntegrationsOnRampPage />} />
        <Route path="integrations/blockchain" element={<IntegrationsBlockchainPage />} />

        <Route path="compliance" element={<CompliancePage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="analytics" element={<PlatformAnalyticsPage />} />
        <Route path="fee-structure" element={<FeeStructurePage />} />
        <Route path="audit-logs" element={<AuditLogsPage />} />
        <Route path="notifications" element={<NotificationsCenterPage />} />
        <Route path="settings" element={<ConfigurationPage />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminOwnerPortal;
