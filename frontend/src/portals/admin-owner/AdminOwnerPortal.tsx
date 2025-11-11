import { useMemo } from 'react';
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
  ClusterOutlined,
} from '@ant-design/icons';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useTranslation } from 'react-i18next';
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
  AssetApprovalPage,
  CapitalPartnersPage,
  WalletManagementPage,
  BankingIntegrationsPage,
  TokenLifecyclePage,
  BusinessRulesPage,
  ApprovalWorkflowsPage,
  ProductStructuringPage,
  FundRolesManagementPage,
  DistributionNetworkPage,
} from './pages';

const AdminOwnerPortal = () => {
  const { t } = useTranslation();

  const menuItems = useMemo(() => [
    {
      key: '/admin-owner',
      icon: <DashboardOutlined />,
      label: t('menu.adminOwner.dashboard'),
    },
    {
      key: '/admin-owner/funds',
      icon: <BankOutlined />,
      label: t('menu.adminOwner.funds'),
    },
    {
      key: '/admin-owner/asset-pipeline',
      icon: <ProjectOutlined />,
      label: t('menu.adminOwner.assetPipeline'),
    },
    {
      key: '/admin-owner/asset-approval',
      icon: <CheckCircleOutlined />,
      label: 'Asset Approval',
    },
    {
      key: '/admin-owner/capital-partners',
      icon: <ClusterOutlined />,
      label: t('menu.adminOwner.capitalPartners'),
    },
    {
      key: 'tokenization',
      icon: <DollarCircleOutlined />,
      label: t('menu.adminOwner.tokenization'),
      children: [
        { key: '/admin-owner/product-structuring', label: t('menu.adminOwner.productStructuring'), icon: <ProjectOutlined /> },
        { key: '/admin-owner/token-lifecycle', label: t('menu.adminOwner.tokenLifecycle'), icon: <FireOutlined /> },
        { key: '/admin-owner/smart-contracts', label: t('menu.adminOwner.smartContracts'), icon: <ApartmentOutlined /> },
        { key: '/admin-owner/business-rules', label: t('menu.adminOwner.businessRules'), icon: <SettingOutlined /> },
        { key: '/admin-owner/approval-workflows', label: t('menu.adminOwner.approvalWorkflows'), icon: <CheckCircleOutlined /> },
      ],
    },
    {
      key: '/admin-owner/clients',
      icon: <TeamOutlined />,
      label: t('menu.adminOwner.clients'),
    },
    {
      key: 'users-and-roles',
      icon: <UserOutlined />,
      label: t('menu.adminOwner.usersAndRoles'),
      children: [
        { key: '/admin-owner/users', label: t('menu.adminOwner.platformUsers'), icon: <UserOutlined /> },
        { key: '/admin-owner/fund-roles', label: t('menu.adminOwner.fundRoles'), icon: <SafetyOutlined /> },
      ],
    },
    {
      key: 'integrations',
      icon: <GlobalOutlined />,
      label: t('menu.adminOwner.integrations'),
      children: [
        { key: '/admin-owner/integrations/wallets', label: t('menu.adminOwner.wallets'), icon: <WalletOutlined /> },
        { key: '/admin-owner/integrations/banking', label: t('menu.adminOwner.banking'), icon: <BankOutlined /> },
        { key: '/admin-owner/integrations/distribution', label: t('menu.adminOwner.distribution'), icon: <ShareAltOutlined /> },
        { key: '/admin-owner/integrations/kyc', label: t('menu.adminOwner.kyc') },
        { key: '/admin-owner/integrations/onramp', label: t('menu.adminOwner.onramp') },
        { key: '/admin-owner/integrations/blockchain', label: t('menu.adminOwner.blockchain') },
      ],
    },
    {
      key: '/admin-owner/compliance',
      icon: <SafetyOutlined />,
      label: t('menu.adminOwner.compliance'),
    },
    {
      key: '/admin-owner/reports',
      icon: <FileTextOutlined />,
      label: t('menu.adminOwner.reports'),
    },
    {
      key: '/admin-owner/audit-logs',
      icon: <AuditOutlined />,
      label: t('menu.adminOwner.auditLogs'),
    },
    {
      key: '/admin-owner/notifications',
      icon: <BellOutlined />,
      label: t('menu.adminOwner.notifications'),
    },
    {
      key: '/admin-owner/settings',
      icon: <SettingOutlined />,
      label: t('menu.adminOwner.settings'),
    },
  ], [t]);

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
        <Route path="asset-approval" element={<AssetApprovalPage />} />
        <Route path="capital-partners" element={<CapitalPartnersPage />} />

        {/* Tokenization Routes */}
        <Route path="product-structuring" element={<ProductStructuringPage />} />
        <Route path="token-lifecycle" element={<TokenLifecyclePage />} />
        <Route path="smart-contracts" element={<SmartContractsPage />} />
        <Route path="business-rules" element={<BusinessRulesPage />} />
        <Route path="approval-workflows" element={<ApprovalWorkflowsPage />} />

        <Route path="clients" element={<ClientsManagementPage />} />
        <Route path="users" element={<UsersPermissionsPage />} />
        <Route path="fund-roles" element={<FundRolesManagementPage />} />

        {/* Integrations Routes */}
        <Route path="integrations/wallets" element={<WalletManagementPage />} />
        <Route path="integrations/banking" element={<BankingIntegrationsPage />} />
        <Route path="integrations/distribution" element={<DistributionNetworkPage />} />
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
