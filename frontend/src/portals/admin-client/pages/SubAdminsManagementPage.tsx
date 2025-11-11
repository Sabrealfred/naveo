import { useState, useMemo } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Avatar,
  Tooltip,
  Badge,
  Row,
  Col,
  Statistic,
  Typography,
  Descriptions,
  Drawer,
  Timeline,
  Switch,
  DatePicker,
  Dropdown,
  Menu,
  List,
  Divider,
} from 'antd';
import {
  UserAddOutlined,
  EditOutlined,
  LockOutlined,
  UnlockOutlined,
  HistoryOutlined,
  TeamOutlined,
  SafetyOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  SearchOutlined,
  DownloadOutlined,
  MoreOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  KeyOutlined,
  AuditOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { Column, Pie } from '@ant-design/charts';
import { StatCard } from '../../../components/common';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface SubAdmin {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Portfolio Manager' | 'Operations Manager' | 'Compliance Officer' | 'Risk Manager' | 'Client Relations';
  permissions: string[];
  status: 'active' | 'inactive' | 'suspended';
  department: string;
  joinedDate: string;
  lastLogin: string;
  avatar?: string;
  managedInvestors: number;
  managedTraders: number;
  managedAssets: number;
  actionsPerformed: number;
  accessLogsCount: number;
  lastActivity: string;
  lastActivityType: string;
  approvalAuthority: 'low' | 'medium' | 'high' | 'full';
  sessionsThisMonth: number;
  documentsProcessed: number;
}

interface ActivityLog {
  timestamp: string;
  action: string;
  description: string;
  type: 'system' | 'management' | 'approval' | 'configuration' | 'report';
}

export default function SubAdminsManagementPage() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [activityDrawerVisible, setActivityDrawerVisible] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<SubAdmin | null>(null);

  // Filter states
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

  // Mock data - expanded to 16 sub-admins
  const subAdmins: SubAdmin[] = [
    {
      id: 'ADM-001',
      name: 'Alice Cooper',
      email: 'alice.cooper@alphafund.com',
      phone: '+1 (555) 111-2222',
      role: 'Portfolio Manager',
      permissions: ['view_assets', 'manage_assets', 'view_investors', 'rebalance_portfolio', 'execute_trades'],
      status: 'active',
      department: 'Investment Management',
      joinedDate: '2023-01-10',
      lastLogin: '2024-11-11T10:30:00Z',
      managedInvestors: 45,
      managedTraders: 12,
      managedAssets: 8,
      actionsPerformed: 1234,
      accessLogsCount: 3456,
      lastActivity: '2024-11-11T10:25:00Z',
      lastActivityType: 'Portfolio Rebalancing',
      approvalAuthority: 'high',
      sessionsThisMonth: 78,
      documentsProcessed: 234,
    },
    {
      id: 'ADM-002',
      name: 'Bob Williams',
      email: 'bob.williams@alphafund.com',
      phone: '+1 (555) 222-3333',
      role: 'Compliance Officer',
      permissions: ['view_compliance', 'approve_kyc', 'view_reports', 'audit_logs', 'suspend_users'],
      status: 'active',
      department: 'Compliance & Risk',
      joinedDate: '2023-02-15',
      lastLogin: '2024-11-11T09:15:00Z',
      managedInvestors: 78,
      managedTraders: 8,
      managedAssets: 0,
      actionsPerformed: 2145,
      accessLogsCount: 4321,
      lastActivity: '2024-11-11T09:10:00Z',
      lastActivityType: 'KYC Approval',
      approvalAuthority: 'full',
      sessionsThisMonth: 92,
      documentsProcessed: 567,
    },
    {
      id: 'ADM-003',
      name: 'Charlie Davis',
      email: 'charlie.davis@alphafund.com',
      phone: '+1 (555) 333-4444',
      role: 'Operations Manager',
      permissions: ['view_transactions', 'reconcile', 'view_reports', 'manage_nav', 'process_withdrawals'],
      status: 'suspended',
      department: 'Operations',
      joinedDate: '2022-10-20',
      lastLogin: '2024-10-28T16:45:00Z',
      managedInvestors: 34,
      managedTraders: 5,
      managedAssets: 6,
      actionsPerformed: 876,
      accessLogsCount: 2234,
      lastActivity: '2024-10-28T16:40:00Z',
      lastActivityType: 'Transaction Reconciliation',
      approvalAuthority: 'medium',
      sessionsThisMonth: 12,
      documentsProcessed: 145,
    },
    {
      id: 'ADM-004',
      name: 'Diana Prince',
      email: 'diana.prince@alphafund.com',
      phone: '+1 (555) 444-5555',
      role: 'Client Relations',
      permissions: ['view_investors', 'investor_support', 'view_reports', 'send_notifications'],
      status: 'active',
      department: 'Client Services',
      joinedDate: '2023-04-12',
      lastLogin: '2024-11-11T11:20:00Z',
      managedInvestors: 92,
      managedTraders: 0,
      managedAssets: 0,
      actionsPerformed: 1567,
      accessLogsCount: 3789,
      lastActivity: '2024-11-11T11:15:00Z',
      lastActivityType: 'Investor Communication',
      approvalAuthority: 'low',
      sessionsThisMonth: 85,
      documentsProcessed: 312,
    },
    {
      id: 'ADM-005',
      name: 'Edward Norton',
      email: 'edward.norton@alphafund.com',
      phone: '+1 (555) 555-6666',
      role: 'Portfolio Manager',
      permissions: ['view_assets', 'manage_assets', 'view_investors', 'rebalance_portfolio'],
      status: 'active',
      department: 'Investment Management',
      joinedDate: '2023-06-08',
      lastLogin: '2024-11-11T08:45:00Z',
      managedInvestors: 56,
      managedTraders: 15,
      managedAssets: 10,
      actionsPerformed: 1890,
      accessLogsCount: 4123,
      lastActivity: '2024-11-11T08:40:00Z',
      lastActivityType: 'Asset Allocation',
      approvalAuthority: 'high',
      sessionsThisMonth: 94,
      documentsProcessed: 289,
    },
    {
      id: 'ADM-006',
      name: 'Fiona Green',
      email: 'fiona.green@alphafund.com',
      phone: '+1 (555) 666-7777',
      role: 'Risk Manager',
      permissions: ['risk_assessment', 'view_reports', 'set_limits', 'monitor_positions'],
      status: 'active',
      department: 'Compliance & Risk',
      joinedDate: '2023-07-22',
      lastLogin: '2024-11-11T09:30:00Z',
      managedInvestors: 0,
      managedTraders: 20,
      managedAssets: 12,
      actionsPerformed: 1234,
      accessLogsCount: 2987,
      lastActivity: '2024-11-11T09:25:00Z',
      lastActivityType: 'Risk Assessment',
      approvalAuthority: 'high',
      sessionsThisMonth: 76,
      documentsProcessed: 198,
    },
    {
      id: 'ADM-007',
      name: 'George Miller',
      email: 'george.miller@alphafund.com',
      phone: '+1 (555) 777-8888',
      role: 'Operations Manager',
      permissions: ['view_transactions', 'reconcile', 'view_reports', 'manage_nav'],
      status: 'active',
      department: 'Operations',
      joinedDate: '2023-09-14',
      lastLogin: '2024-11-11T10:15:00Z',
      managedInvestors: 67,
      managedTraders: 8,
      managedAssets: 7,
      actionsPerformed: 1456,
      accessLogsCount: 3245,
      lastActivity: '2024-11-11T10:10:00Z',
      lastActivityType: 'NAV Calculation',
      approvalAuthority: 'medium',
      sessionsThisMonth: 81,
      documentsProcessed: 267,
    },
    {
      id: 'ADM-008',
      name: 'Hannah Lee',
      email: 'hannah.lee@alphafund.com',
      phone: '+1 (555) 888-9999',
      role: 'Client Relations',
      permissions: ['view_investors', 'investor_support', 'view_reports'],
      status: 'active',
      department: 'Client Services',
      joinedDate: '2023-11-03',
      lastLogin: '2024-11-11T11:05:00Z',
      managedInvestors: 104,
      managedTraders: 0,
      managedAssets: 0,
      actionsPerformed: 1678,
      accessLogsCount: 3912,
      lastActivity: '2024-11-11T11:00:00Z',
      lastActivityType: 'Client Onboarding',
      approvalAuthority: 'low',
      sessionsThisMonth: 89,
      documentsProcessed: 345,
    },
    {
      id: 'ADM-009',
      name: 'Ian Malcolm',
      email: 'ian.malcolm@alphafund.com',
      phone: '+1 (555) 999-0000',
      role: 'Portfolio Manager',
      permissions: ['view_assets', 'manage_assets', 'rebalance_portfolio'],
      status: 'active',
      department: 'Investment Management',
      joinedDate: '2024-01-18',
      lastLogin: '2024-11-11T09:50:00Z',
      managedInvestors: 38,
      managedTraders: 10,
      managedAssets: 6,
      actionsPerformed: 789,
      accessLogsCount: 1876,
      lastActivity: '2024-11-11T09:45:00Z',
      lastActivityType: 'Portfolio Review',
      approvalAuthority: 'medium',
      sessionsThisMonth: 67,
      documentsProcessed: 156,
    },
    {
      id: 'ADM-010',
      name: 'Julia Roberts',
      email: 'julia.roberts@alphafund.com',
      phone: '+1 (555) 000-1111',
      role: 'Compliance Officer',
      permissions: ['view_compliance', 'approve_kyc', 'audit_logs'],
      status: 'active',
      department: 'Compliance & Risk',
      joinedDate: '2024-02-25',
      lastLogin: '2024-11-11T08:30:00Z',
      managedInvestors: 61,
      managedTraders: 6,
      managedAssets: 0,
      actionsPerformed: 1123,
      accessLogsCount: 2654,
      lastActivity: '2024-11-11T08:25:00Z',
      lastActivityType: 'Compliance Review',
      approvalAuthority: 'high',
      sessionsThisMonth: 73,
      documentsProcessed: 423,
    },
    {
      id: 'ADM-011',
      name: 'Kevin Hart',
      email: 'kevin.hart@alphafund.com',
      phone: '+1 (555) 111-2223',
      role: 'Operations Manager',
      permissions: ['view_transactions', 'reconcile', 'process_withdrawals'],
      status: 'inactive',
      department: 'Operations',
      joinedDate: '2022-08-30',
      lastLogin: '2024-10-20T15:30:00Z',
      managedInvestors: 23,
      managedTraders: 3,
      managedAssets: 4,
      actionsPerformed: 567,
      accessLogsCount: 1432,
      lastActivity: '2024-10-20T15:25:00Z',
      lastActivityType: 'Transaction Processing',
      approvalAuthority: 'low',
      sessionsThisMonth: 8,
      documentsProcessed: 89,
    },
    {
      id: 'ADM-012',
      name: 'Laura Palmer',
      email: 'laura.palmer@alphafund.com',
      phone: '+1 (555) 222-3334',
      role: 'Risk Manager',
      permissions: ['risk_assessment', 'set_limits', 'monitor_positions'],
      status: 'active',
      department: 'Compliance & Risk',
      joinedDate: '2024-03-15',
      lastLogin: '2024-11-11T10:40:00Z',
      managedInvestors: 0,
      managedTraders: 18,
      managedAssets: 9,
      actionsPerformed: 956,
      accessLogsCount: 2345,
      lastActivity: '2024-11-11T10:35:00Z',
      lastActivityType: 'Limit Adjustment',
      approvalAuthority: 'medium',
      sessionsThisMonth: 69,
      documentsProcessed: 187,
    },
    {
      id: 'ADM-013',
      name: 'Mark Spencer',
      email: 'mark.spencer@alphafund.com',
      phone: '+1 (555) 333-4445',
      role: 'Client Relations',
      permissions: ['view_investors', 'investor_support'],
      status: 'active',
      department: 'Client Services',
      joinedDate: '2024-04-20',
      lastLogin: '2024-11-11T11:25:00Z',
      managedInvestors: 87,
      managedTraders: 0,
      managedAssets: 0,
      actionsPerformed: 1345,
      accessLogsCount: 3123,
      lastActivity: '2024-11-11T11:20:00Z',
      lastActivityType: 'Support Ticket Resolution',
      approvalAuthority: 'low',
      sessionsThisMonth: 82,
      documentsProcessed: 298,
    },
    {
      id: 'ADM-014',
      name: 'Nancy Drew',
      email: 'nancy.drew@alphafund.com',
      phone: '+1 (555) 444-5556',
      role: 'Portfolio Manager',
      permissions: ['view_assets', 'manage_assets', 'view_investors'],
      status: 'active',
      department: 'Investment Management',
      joinedDate: '2024-05-08',
      lastLogin: '2024-11-11T09:20:00Z',
      managedInvestors: 42,
      managedTraders: 11,
      managedAssets: 7,
      actionsPerformed: 823,
      accessLogsCount: 1987,
      lastActivity: '2024-11-11T09:15:00Z',
      lastActivityType: 'Investment Analysis',
      approvalAuthority: 'medium',
      sessionsThisMonth: 64,
      documentsProcessed: 176,
    },
    {
      id: 'ADM-015',
      name: 'Oscar Wilde',
      email: 'oscar.wilde@alphafund.com',
      phone: '+1 (555) 555-6667',
      role: 'Operations Manager',
      permissions: ['view_transactions', 'reconcile', 'view_reports'],
      status: 'active',
      department: 'Operations',
      joinedDate: '2024-06-12',
      lastLogin: '2024-11-11T10:50:00Z',
      managedInvestors: 51,
      managedTraders: 7,
      managedAssets: 5,
      actionsPerformed: 1089,
      accessLogsCount: 2567,
      lastActivity: '2024-11-11T10:45:00Z',
      lastActivityType: 'Reconciliation Report',
      approvalAuthority: 'medium',
      sessionsThisMonth: 75,
      documentsProcessed: 234,
    },
    {
      id: 'ADM-016',
      name: 'Patricia Hill',
      email: 'patricia.hill@alphafund.com',
      phone: '+1 (555) 666-7778',
      role: 'Compliance Officer',
      permissions: ['view_compliance', 'approve_kyc'],
      status: 'active',
      department: 'Compliance & Risk',
      joinedDate: '2024-07-19',
      lastLogin: '2024-11-11T08:55:00Z',
      managedInvestors: 49,
      managedTraders: 4,
      managedAssets: 0,
      actionsPerformed: 734,
      accessLogsCount: 1876,
      lastActivity: '2024-11-11T08:50:00Z',
      lastActivityType: 'KYC Documentation Review',
      approvalAuthority: 'medium',
      sessionsThisMonth: 61,
      documentsProcessed: 321,
    },
  ];

  const activityLogs: ActivityLog[] = [
    {
      timestamp: '2024-11-11T10:30:00Z',
      action: 'Login',
      description: 'Logged in from IP 192.168.1.105',
      type: 'system',
    },
    {
      timestamp: '2024-11-11T10:35:00Z',
      action: 'Portfolio Rebalancing',
      description: 'Rebalanced portfolio for 5 investors',
      type: 'management',
    },
    {
      timestamp: '2024-11-11T11:00:00Z',
      action: 'Approval',
      description: 'Approved withdrawal request for INV-234',
      type: 'approval',
    },
    {
      timestamp: '2024-11-11T11:15:00Z',
      action: 'Configuration',
      description: 'Updated trader limits for TDR-567',
      type: 'configuration',
    },
    {
      timestamp: '2024-11-10T16:20:00Z',
      action: 'Report Generation',
      description: 'Generated monthly performance report',
      type: 'report',
    },
  ];

  const permissionOptions = [
    { label: 'View Assets', value: 'view_assets' },
    { label: 'Manage Assets', value: 'manage_assets' },
    { label: 'View Investors', value: 'view_investors' },
    { label: 'Rebalance Portfolio', value: 'rebalance_portfolio' },
    { label: 'Execute Trades', value: 'execute_trades' },
    { label: 'View Compliance', value: 'view_compliance' },
    { label: 'Approve KYC', value: 'approve_kyc' },
    { label: 'View Reports', value: 'view_reports' },
    { label: 'Audit Logs', value: 'audit_logs' },
    { label: 'Suspend Users', value: 'suspend_users' },
    { label: 'View Transactions', value: 'view_transactions' },
    { label: 'Reconcile', value: 'reconcile' },
    { label: 'Manage NAV', value: 'manage_nav' },
    { label: 'Process Withdrawals', value: 'process_withdrawals' },
    { label: 'Investor Support', value: 'investor_support' },
    { label: 'Send Notifications', value: 'send_notifications' },
    { label: 'Risk Assessment', value: 'risk_assessment' },
    { label: 'Set Limits', value: 'set_limits' },
    { label: 'Monitor Positions', value: 'monitor_positions' },
  ];

  // Calculated metrics
  const metrics = useMemo(() => {
    const total = subAdmins.length;
    const active = subAdmins.filter((a) => a.status === 'active').length;
    const inactive = subAdmins.filter((a) => a.status === 'inactive').length;
    const suspended = subAdmins.filter((a) => a.status === 'suspended').length;
    const totalManagedInvestors = subAdmins.reduce((sum, a) => sum + a.managedInvestors, 0);
    const totalManagedTraders = subAdmins.reduce((sum, a) => sum + a.managedTraders, 0);
    const totalActionsPerformed = subAdmins.reduce((sum, a) => sum + a.actionsPerformed, 0);
    const totalSessions = subAdmins.reduce((sum, a) => sum + a.sessionsThisMonth, 0);

    return {
      total,
      active,
      inactive,
      suspended,
      totalManagedInvestors,
      totalManagedTraders,
      totalActionsPerformed,
      totalSessions,
    };
  }, [subAdmins]);

  // Filtered sub-admins
  const filteredAdmins = useMemo(() => {
    return subAdmins.filter((admin) => {
      // Search filter
      if (searchText) {
        const search = searchText.toLowerCase();
        if (
          !admin.name.toLowerCase().includes(search) &&
          !admin.email.toLowerCase().includes(search) &&
          !admin.id.toLowerCase().includes(search)
        ) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'all' && admin.status !== statusFilter) {
        return false;
      }

      // Role filter
      if (roleFilter !== 'all' && admin.role !== roleFilter) {
        return false;
      }

      // Department filter
      if (departmentFilter !== 'all' && admin.department !== departmentFilter) {
        return false;
      }

      // Date range filter
      if (dateRange[0] && dateRange[1]) {
        const joinDate = dayjs(admin.joinedDate);
        if (joinDate.isBefore(dateRange[0]) || joinDate.isAfter(dateRange[1])) {
          return false;
        }
      }

      return true;
    });
  }, [subAdmins, searchText, statusFilter, roleFilter, departmentFilter, dateRange]);

  // Chart data - Top performers by actions
  const topPerformersData = useMemo(() => {
    return [...subAdmins]
      .sort((a, b) => b.actionsPerformed - a.actionsPerformed)
      .slice(0, 10)
      .map((a) => ({
        name: a.name.split(' ')[0],
        actions: a.actionsPerformed,
      }));
  }, [subAdmins]);

  // Chart data - Role distribution
  const roleDistributionData = useMemo(() => {
    const roleCounts = subAdmins.reduce((acc, admin) => {
      acc[admin.role] = (acc[admin.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(roleCounts).map(([role, count]) => ({
      role,
      count,
    }));
  }, [subAdmins]);

  // Get unique departments
  const departments = useMemo(() => {
    return Array.from(new Set(subAdmins.map((a) => a.department)));
  }, [subAdmins]);

  const handleAddAdmin = () => {
    form.validateFields().then((values) => {
      console.log('Adding new sub-admin:', values);
      setAddModalVisible(false);
      form.resetFields();
    });
  };

  const handleEditAdmin = () => {
    form.validateFields().then((values) => {
      console.log('Updating sub-admin:', values);
      setEditModalVisible(false);
      form.resetFields();
    });
  };

  const openEditModal = (admin: SubAdmin) => {
    setSelectedAdmin(admin);
    form.setFieldsValue(admin);
    setEditModalVisible(true);
  };

  const openActivityDrawer = (admin: SubAdmin) => {
    setSelectedAdmin(admin);
    setActivityDrawerVisible(true);
  };

  const toggleAdminStatus = (admin: SubAdmin) => {
    console.log('Toggling status for:', admin.id);
  };

  const handleExportReport = () => {
    console.log('Exporting sub-admins report...');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Portfolio Manager':
        return 'blue';
      case 'Compliance Officer':
        return 'green';
      case 'Risk Manager':
        return 'orange';
      case 'Operations Manager':
        return 'purple';
      case 'Client Relations':
        return 'cyan';
      default:
        return 'default';
    }
  };

  const getAuthorityColor = (authority: string) => {
    switch (authority) {
      case 'full':
        return 'red';
      case 'high':
        return 'orange';
      case 'medium':
        return 'blue';
      case 'low':
        return 'green';
      default:
        return 'default';
    }
  };

  const getActionMenu = (record: SubAdmin) => (
    <Menu>
      <Menu.Item key="view" icon={<EyeOutlined />} onClick={() => openActivityDrawer(record)}>
        View Details
      </Menu.Item>
      <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => openEditModal(record)}>
        Edit Sub-Admin
      </Menu.Item>
      <Menu.Item key="permissions" icon={<KeyOutlined />}>
        Manage Permissions
      </Menu.Item>
      <Menu.Item key="history" icon={<HistoryOutlined />} onClick={() => openActivityDrawer(record)}>
        Activity History
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="suspend"
        icon={record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />}
        danger={record.status === 'active'}
        onClick={() => toggleAdminStatus(record)}
      >
        {record.status === 'active' ? 'Suspend Access' : 'Activate Access'}
      </Menu.Item>
    </Menu>
  );

  const columns: ColumnsType<SubAdmin> = [
    {
      title: 'Sub-Admin',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      fixed: 'left',
      render: (name: string, record: SubAdmin) => (
        <Space>
          <Avatar
            style={{ backgroundColor: '#722ed1' }}
            icon={record.avatar ? undefined : <UserOutlined />}
            src={record.avatar}
          >
            {!record.avatar && name.charAt(0).toUpperCase()}
          </Avatar>
          <Space direction="vertical" size={0}>
            <Text strong>{name}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.email}
            </Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 180,
      render: (role: string) => <Tag color={getRoleColor(role)}>{role}</Tag>,
      sorter: (a, b) => a.role.localeCompare(b.role),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 180,
      sorter: (a, b) => a.department.localeCompare(b.department),
    },
    {
      title: 'Authority Level',
      dataIndex: 'approvalAuthority',
      key: 'approvalAuthority',
      width: 140,
      render: (authority: string) => (
        <Tag color={getAuthorityColor(authority)}>{authority.toUpperCase()}</Tag>
      ),
      sorter: (a, b) => {
        const order = { full: 4, high: 3, medium: 2, low: 1 };
        return order[a.approvalAuthority] - order[b.approvalAuthority];
      },
    },
    {
      title: 'Managed Investors',
      dataIndex: 'managedInvestors',
      key: 'managedInvestors',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.managedInvestors - b.managedInvestors,
      render: (count: number) => (
        <Badge count={count} showZero color="#1890ff" overflowCount={999} />
      ),
    },
    {
      title: 'Managed Traders',
      dataIndex: 'managedTraders',
      key: 'managedTraders',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.managedTraders - b.managedTraders,
      render: (count: number) => (
        <Badge count={count} showZero color="#722ed1" overflowCount={999} />
      ),
    },
    {
      title: 'Actions Performed',
      dataIndex: 'actionsPerformed',
      key: 'actionsPerformed',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.actionsPerformed - b.actionsPerformed,
      render: (count: number) => (
        <Badge count={count} showZero color="#52c41a" overflowCount={9999} />
      ),
    },
    {
      title: 'Sessions (Month)',
      dataIndex: 'sessionsThisMonth',
      key: 'sessionsThisMonth',
      width: 140,
      align: 'center',
      sorter: (a, b) => a.sessionsThisMonth - b.sessionsThisMonth,
      render: (count: number) => <Text>{count}</Text>,
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      width: 150,
      render: (permissions: string[]) => (
        <Tooltip
          title={
            <div>
              {permissions.map((perm) => (
                <div key={perm}>{perm.replace(/_/g, ' ')}</div>
              ))}
            </div>
          }
        >
          <Tag color="purple">{permissions.length} permissions</Tag>
        </Tooltip>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Badge
          status={status === 'active' ? 'success' : status === 'suspended' ? 'error' : 'default'}
          text={status.charAt(0).toUpperCase() + status.slice(1)}
        />
      ),
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      width: 180,
      render: (lastLogin: string) => (
        <Text style={{ fontSize: '13px' }}>{dayjs(lastLogin).format('MMM DD, YYYY HH:mm')}</Text>
      ),
      sorter: (a, b) => dayjs(a.lastLogin).unix() - dayjs(b.lastLogin).unix(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <Dropdown overlay={getActionMenu(record)} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const topPerformersChartConfig = {
    data: topPerformersData,
    xField: 'name',
    yField: 'actions',
    label: {
      position: 'top' as const,
      formatter: (datum: any) => datum.actions,
    },
    columnStyle: {
      radius: [8, 8, 0, 0],
      fill: 'l(270) 0:#722ed1 1:#9254de',
    },
    xAxis: {
      label: {
        autoRotate: false,
      },
    },
    yAxis: {
      title: {
        text: 'Actions Performed',
      },
    },
  };

  const roleDistributionChartConfig = {
    data: roleDistributionData,
    angleField: 'count',
    colorField: 'role',
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      type: 'spider',
      content: '{name}\n{percentage}',
    },
    legend: {
      position: 'bottom' as const,
    },
    color: ['#1890ff', '#52c41a', '#fa8c16', '#9254de', '#13c2c2'],
  };

  return (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <div>
          <Title level={2}>{t('admins.title')}</Title>
          <Text type="secondary">{t('admins.subtitle')}</Text>
        </div>
        <Space>
          <Button icon={<DownloadOutlined />} onClick={handleExportReport}>
            Export Report
          </Button>
          <Button type="primary" icon={<UserAddOutlined />} onClick={() => setAddModalVisible(true)}>
            {t('admins.addAdmin')}
          </Button>
        </Space>
      </div>

      {/* Stats Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title={t('admins.totalAdmins')}
            value={metrics.total.toString()}
            icon={<TeamOutlined />}
            color="#722ed1"
          />
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <StatCard
            title={t('admins.activeAdmins')}
            value={metrics.active.toString()}
            icon={<UnlockOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Managed Investors"
              value={metrics.totalManagedInvestors}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Managed Traders"
              value={metrics.totalManagedTraders}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Actions Performed"
              value={metrics.totalActionsPerformed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Sessions (Month)"
              value={metrics.totalSessions}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <StatCard
            title={t('admins.suspended')}
            value={metrics.suspended.toString()}
            icon={<LockOutlined />}
            color="#f5222d"
          />
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Inactive"
              value={metrics.inactive}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#8c8c8c' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={16}>
          <Card title="Top Performers by Actions" bordered={false}>
            <Column {...topPerformersChartConfig} height={300} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Role Distribution" bordered={false}>
            <Pie {...roleDistributionChartConfig} height={300} />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: '16px' }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder="Search by name, email, or ID"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                style={{ width: '100%' }}
                placeholder="Status"
                value={statusFilter}
                onChange={setStatusFilter}
              >
                <Select.Option value="all">All Status</Select.Option>
                <Select.Option value="active">Active</Select.Option>
                <Select.Option value="inactive">Inactive</Select.Option>
                <Select.Option value="suspended">Suspended</Select.Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={5}>
              <Select
                style={{ width: '100%' }}
                placeholder="Role"
                value={roleFilter}
                onChange={setRoleFilter}
              >
                <Select.Option value="all">All Roles</Select.Option>
                <Select.Option value="Portfolio Manager">Portfolio Manager</Select.Option>
                <Select.Option value="Compliance Officer">Compliance Officer</Select.Option>
                <Select.Option value="Risk Manager">Risk Manager</Select.Option>
                <Select.Option value="Operations Manager">Operations Manager</Select.Option>
                <Select.Option value="Client Relations">Client Relations</Select.Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={5}>
              <Select
                style={{ width: '100%' }}
                placeholder="Department"
                value={departmentFilter}
                onChange={setDepartmentFilter}
              >
                <Select.Option value="all">All Departments</Select.Option>
                {departments.map((dept) => (
                  <Select.Option key={dept} value={dept}>
                    {dept}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <RangePicker
                style={{ width: '100%' }}
                value={dateRange}
                onChange={(dates: any) => setDateRange(dates || [null, null])}
              />
            </Col>
          </Row>
        </Space>
      </Card>

      {/* Sub-Admins Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredAdmins}
          rowKey="id"
          pagination={{
            pageSize: 15,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} sub-admins`,
            pageSizeOptions: ['10', '15', '20', '50'],
          }}
          scroll={{ x: 1800 }}
        />
      </Card>

      {/* Add Sub-Admin Modal */}
      <Modal
        title="Add New Sub-Admin"
        open={addModalVisible}
        onOk={handleAddAdmin}
        onCancel={() => {
          setAddModalVisible(false);
          form.resetFields();
        }}
        width={600}
      >
        <Form form={form} layout="vertical" style={{ marginTop: '24px' }}>
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: 'Please enter full name' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="John Doe" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="john.doe@alphafund.com" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: 'Please enter phone number' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="+1 (555) 123-4567" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select placeholder="Select role">
              <Select.Option value="Portfolio Manager">Portfolio Manager</Select.Option>
              <Select.Option value="Compliance Officer">Compliance Officer</Select.Option>
              <Select.Option value="Risk Manager">Risk Manager</Select.Option>
              <Select.Option value="Operations Manager">Operations Manager</Select.Option>
              <Select.Option value="Client Relations">Client Relations</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Department"
            name="department"
            rules={[{ required: true, message: 'Please enter department' }]}
          >
            <Input placeholder="Investment Management" />
          </Form.Item>

          <Form.Item
            label="Approval Authority"
            name="approvalAuthority"
            rules={[{ required: true, message: 'Please select authority level' }]}
          >
            <Select placeholder="Select authority level">
              <Select.Option value="low">Low</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="high">High</Select.Option>
              <Select.Option value="full">Full</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Permissions"
            name="permissions"
            rules={[{ required: true, message: 'Please select at least one permission' }]}
          >
            <Select mode="multiple" placeholder="Select permissions" options={permissionOptions} />
          </Form.Item>

          <Form.Item label="Status" name="status" initialValue="active">
            <Select>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Notes" name="notes">
            <TextArea rows={3} placeholder="Additional notes or comments" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Sub-Admin Modal */}
      <Modal
        title="Edit Sub-Admin"
        open={editModalVisible}
        onOk={handleEditAdmin}
        onCancel={() => {
          setEditModalVisible(false);
          form.resetFields();
        }}
        width={600}
      >
        <Form form={form} layout="vertical" style={{ marginTop: '24px' }}>
          <Form.Item label="Full Name" name="name">
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item label="Phone" name="phone">
            <Input prefix={<PhoneOutlined />} />
          </Form.Item>

          <Form.Item label="Role" name="role">
            <Select>
              <Select.Option value="Portfolio Manager">Portfolio Manager</Select.Option>
              <Select.Option value="Compliance Officer">Compliance Officer</Select.Option>
              <Select.Option value="Risk Manager">Risk Manager</Select.Option>
              <Select.Option value="Operations Manager">Operations Manager</Select.Option>
              <Select.Option value="Client Relations">Client Relations</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Department" name="department">
            <Input />
          </Form.Item>

          <Form.Item label="Approval Authority" name="approvalAuthority">
            <Select>
              <Select.Option value="low">Low</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="high">High</Select.Option>
              <Select.Option value="full">Full</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Permissions" name="permissions">
            <Select mode="multiple" options={permissionOptions} />
          </Form.Item>

          <Form.Item label="Status" name="status">
            <Select>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
              <Select.Option value="suspended">Suspended</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Activity Drawer */}
      <Drawer
        title={
          <Space>
            <Avatar style={{ backgroundColor: '#722ed1' }}>
              {selectedAdmin?.name.charAt(0).toUpperCase()}
            </Avatar>
            <div>
              <div>{selectedAdmin?.name}</div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Activity History & Management
              </Text>
            </div>
          </Space>
        }
        width={600}
        open={activityDrawerVisible}
        onClose={() => setActivityDrawerVisible(false)}
      >
        {selectedAdmin && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Admin ID">{selectedAdmin.id}</Descriptions.Item>
              <Descriptions.Item label="Role">
                <Tag color={getRoleColor(selectedAdmin.role)}>{selectedAdmin.role}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Department">
                {selectedAdmin.department}
              </Descriptions.Item>
              <Descriptions.Item label="Authority Level">
                <Tag color={getAuthorityColor(selectedAdmin.approvalAuthority)}>
                  {selectedAdmin.approvalAuthority.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Joined">
                {dayjs(selectedAdmin.joinedDate).format('MMMM DD, YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Last Login">
                {dayjs(selectedAdmin.lastLogin).format('MMMM DD, YYYY HH:mm')}
              </Descriptions.Item>
            </Descriptions>

            <Card title="Management Metrics" size="small">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title="Managed Investors"
                    value={selectedAdmin.managedInvestors}
                    prefix={<TeamOutlined />}
                    valueStyle={{ fontSize: '18px' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Managed Traders"
                    value={selectedAdmin.managedTraders}
                    prefix={<UserOutlined />}
                    valueStyle={{ fontSize: '18px' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Managed Assets"
                    value={selectedAdmin.managedAssets}
                    prefix={<AuditOutlined />}
                    valueStyle={{ fontSize: '18px' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Actions Performed"
                    value={selectedAdmin.actionsPerformed}
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ fontSize: '18px' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Access Logs"
                    value={selectedAdmin.accessLogsCount}
                    valueStyle={{ fontSize: '18px' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Sessions (Month)"
                    value={selectedAdmin.sessionsThisMonth}
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ fontSize: '18px' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Documents Processed"
                    value={selectedAdmin.documentsProcessed}
                    valueStyle={{ fontSize: '18px' }}
                  />
                </Col>
                <Col span={12}>
                  <div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      Last Activity
                    </Text>
                    <div style={{ marginTop: '4px' }}>
                      <Text strong style={{ fontSize: '14px' }}>
                        {selectedAdmin.lastActivityType}
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '11px' }}>
                        {dayjs(selectedAdmin.lastActivity).format('MMM DD, HH:mm')}
                      </Text>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>

            <Card title="Recent Activity" size="small">
              <Timeline
                items={activityLogs.map((log) => ({
                  color:
                    log.type === 'management'
                      ? 'blue'
                      : log.type === 'approval'
                      ? 'green'
                      : log.type === 'configuration'
                      ? 'orange'
                      : log.type === 'report'
                      ? 'purple'
                      : 'gray',
                  children: (
                    <div>
                      <Text strong>{log.action}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {log.description}
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '11px' }}>
                        {dayjs(log.timestamp).format('MMM DD, YYYY HH:mm')}
                      </Text>
                    </div>
                  ),
                }))}
              />
            </Card>

            <Card title="Permissions" size="small">
              <List
                size="small"
                dataSource={selectedAdmin.permissions}
                renderItem={(perm) => (
                  <List.Item>
                    <Space>
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      <Text>{perm.replace(/_/g, ' ').toUpperCase()}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          </Space>
        )}
      </Drawer>
    </div>
  );
}
