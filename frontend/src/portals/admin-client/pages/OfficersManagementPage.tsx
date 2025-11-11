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
  Progress,
  DatePicker,
  Dropdown,
  Menu,
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
  CheckCircleOutlined,
  FileProtectOutlined,
  AuditOutlined,
  SearchOutlined,
  DownloadOutlined,
  MoreOutlined,
  EyeOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { Column, Pie } from '@ant-design/charts';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface Officer {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Fund Officer' | 'Sub-Admin' | 'Compliance Officer' | 'Risk Officer';
  permissions: string[];
  status: 'active' | 'inactive' | 'suspended';
  department: string;
  joinedDate: string;
  lastLogin: string;
  avatar?: string;
  complianceReviews: number;
  kycApprovals: number;
  riskAssessments: number;
  auditLogsAccessed: number;
  avgApprovalTime: number; // in hours
  complianceScore: number; // 0-100
  activeInvestigations: number;
  pendingReviews: number;
  documentsReviewed: number;
  alertsHandled: number;
}

interface ActivityLog {
  timestamp: string;
  action: string;
  description: string;
  type: 'compliance' | 'kyc' | 'risk' | 'audit' | 'system';
}

export default function OfficersManagementPage() {
  const [form] = Form.useForm();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [activityDrawerVisible, setActivityDrawerVisible] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);

  // Filter states
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

  // Mock data - expanded to 18 officers
  const officers: Officer[] = [
    {
      id: 'OFF-001',
      name: 'Michael Chen',
      email: 'michael.chen@alphafund.com',
      phone: '+1 (555) 234-5678',
      role: 'Fund Officer',
      permissions: ['fund_management', 'nav_calculation', 'reporting', 'investor_approval'],
      status: 'active',
      department: 'Fund Operations',
      joinedDate: '2023-01-15',
      lastLogin: '2024-11-11T10:30:00Z',
      complianceReviews: 245,
      kycApprovals: 156,
      riskAssessments: 89,
      auditLogsAccessed: 423,
      avgApprovalTime: 2.4,
      complianceScore: 95,
      activeInvestigations: 2,
      pendingReviews: 8,
      documentsReviewed: 1245,
      alertsHandled: 67,
    },
    {
      id: 'OFF-002',
      name: 'Sarah Williams',
      email: 'sarah.williams@alphafund.com',
      phone: '+1 (555) 345-6789',
      role: 'Compliance Officer',
      permissions: ['compliance_review', 'kyc_approval', 'audit_logs', 'reporting'],
      status: 'active',
      department: 'Compliance',
      joinedDate: '2023-03-20',
      lastLogin: '2024-11-11T09:15:00Z',
      complianceReviews: 412,
      kycApprovals: 287,
      riskAssessments: 156,
      auditLogsAccessed: 678,
      avgApprovalTime: 1.8,
      complianceScore: 98,
      activeInvestigations: 5,
      pendingReviews: 12,
      documentsReviewed: 2134,
      alertsHandled: 145,
    },
    {
      id: 'OFF-003',
      name: 'David Martinez',
      email: 'david.martinez@alphafund.com',
      phone: '+1 (555) 456-7890',
      role: 'Sub-Admin',
      permissions: ['asset_management', 'trader_oversight', 'rebalancing'],
      status: 'active',
      department: 'Investment Team',
      joinedDate: '2023-06-10',
      lastLogin: '2024-11-11T11:45:00Z',
      complianceReviews: 134,
      kycApprovals: 78,
      riskAssessments: 45,
      auditLogsAccessed: 234,
      avgApprovalTime: 3.2,
      complianceScore: 88,
      activeInvestigations: 1,
      pendingReviews: 5,
      documentsReviewed: 567,
      alertsHandled: 34,
    },
    {
      id: 'OFF-004',
      name: 'Jennifer Park',
      email: 'jennifer.park@alphafund.com',
      phone: '+1 (555) 567-8901',
      role: 'Risk Officer',
      permissions: ['risk_assessment', 'compliance_review', 'reporting'],
      status: 'active',
      department: 'Risk Management',
      joinedDate: '2023-08-05',
      lastLogin: '2024-11-11T08:20:00Z',
      complianceReviews: 198,
      kycApprovals: 98,
      riskAssessments: 312,
      auditLogsAccessed: 445,
      avgApprovalTime: 2.1,
      complianceScore: 96,
      activeInvestigations: 4,
      pendingReviews: 15,
      documentsReviewed: 1567,
      alertsHandled: 89,
    },
    {
      id: 'OFF-005',
      name: 'Robert Johnson',
      email: 'robert.johnson@alphafund.com',
      phone: '+1 (555) 678-9012',
      role: 'Sub-Admin',
      permissions: ['investor_support', 'transaction_review'],
      status: 'inactive',
      department: 'Client Services',
      joinedDate: '2022-11-12',
      lastLogin: '2024-10-15T14:30:00Z',
      complianceReviews: 89,
      kycApprovals: 45,
      riskAssessments: 23,
      auditLogsAccessed: 156,
      avgApprovalTime: 4.5,
      complianceScore: 82,
      activeInvestigations: 0,
      pendingReviews: 2,
      documentsReviewed: 345,
      alertsHandled: 18,
    },
    {
      id: 'OFF-006',
      name: 'Emily Thompson',
      email: 'emily.thompson@alphafund.com',
      phone: '+1 (555) 789-0123',
      role: 'Compliance Officer',
      permissions: ['compliance_review', 'kyc_approval', 'audit_logs', 'risk_assessment'],
      status: 'active',
      department: 'Compliance',
      joinedDate: '2023-02-28',
      lastLogin: '2024-11-11T12:05:00Z',
      complianceReviews: 367,
      kycApprovals: 234,
      riskAssessments: 145,
      auditLogsAccessed: 589,
      avgApprovalTime: 1.9,
      complianceScore: 97,
      activeInvestigations: 3,
      pendingReviews: 9,
      documentsReviewed: 1876,
      alertsHandled: 123,
    },
    {
      id: 'OFF-007',
      name: 'Alexander Lee',
      email: 'alexander.lee@alphafund.com',
      phone: '+1 (555) 890-1234',
      role: 'Fund Officer',
      permissions: ['fund_management', 'nav_calculation', 'reporting'],
      status: 'active',
      department: 'Fund Operations',
      joinedDate: '2023-04-18',
      lastLogin: '2024-11-11T10:55:00Z',
      complianceReviews: 189,
      kycApprovals: 112,
      riskAssessments: 67,
      auditLogsAccessed: 334,
      avgApprovalTime: 2.6,
      complianceScore: 93,
      activeInvestigations: 2,
      pendingReviews: 6,
      documentsReviewed: 934,
      alertsHandled: 52,
    },
    {
      id: 'OFF-008',
      name: 'Maria Rodriguez',
      email: 'maria.rodriguez@alphafund.com',
      phone: '+1 (555) 901-2345',
      role: 'Risk Officer',
      permissions: ['risk_assessment', 'compliance_review', 'audit_logs'],
      status: 'active',
      department: 'Risk Management',
      joinedDate: '2023-05-22',
      lastLogin: '2024-11-11T09:40:00Z',
      complianceReviews: 223,
      kycApprovals: 134,
      riskAssessments: 289,
      auditLogsAccessed: 478,
      avgApprovalTime: 2.3,
      complianceScore: 94,
      activeInvestigations: 3,
      pendingReviews: 11,
      documentsReviewed: 1423,
      alertsHandled: 78,
    },
    {
      id: 'OFF-009',
      name: 'James Wilson',
      email: 'james.wilson@alphafund.com',
      phone: '+1 (555) 012-3456',
      role: 'Sub-Admin',
      permissions: ['asset_management', 'trader_oversight', 'transaction_review'],
      status: 'active',
      department: 'Investment Team',
      joinedDate: '2023-07-11',
      lastLogin: '2024-11-11T11:20:00Z',
      complianceReviews: 156,
      kycApprovals: 89,
      riskAssessments: 56,
      auditLogsAccessed: 267,
      avgApprovalTime: 3.1,
      complianceScore: 89,
      activeInvestigations: 1,
      pendingReviews: 4,
      documentsReviewed: 678,
      alertsHandled: 41,
    },
    {
      id: 'OFF-010',
      name: 'Linda Brown',
      email: 'linda.brown@alphafund.com',
      phone: '+1 (555) 123-4567',
      role: 'Compliance Officer',
      permissions: ['compliance_review', 'kyc_approval', 'reporting'],
      status: 'active',
      department: 'Compliance',
      joinedDate: '2023-09-08',
      lastLogin: '2024-11-11T08:50:00Z',
      complianceReviews: 298,
      kycApprovals: 198,
      riskAssessments: 112,
      auditLogsAccessed: 534,
      avgApprovalTime: 2.0,
      complianceScore: 96,
      activeInvestigations: 4,
      pendingReviews: 10,
      documentsReviewed: 1654,
      alertsHandled: 98,
    },
    {
      id: 'OFF-011',
      name: 'Christopher Davis',
      email: 'christopher.davis@alphafund.com',
      phone: '+1 (555) 234-5678',
      role: 'Fund Officer',
      permissions: ['fund_management', 'investor_approval', 'reporting'],
      status: 'active',
      department: 'Fund Operations',
      joinedDate: '2023-10-14',
      lastLogin: '2024-11-11T10:15:00Z',
      complianceReviews: 167,
      kycApprovals: 98,
      riskAssessments: 54,
      auditLogsAccessed: 298,
      avgApprovalTime: 2.8,
      complianceScore: 91,
      activeInvestigations: 1,
      pendingReviews: 7,
      documentsReviewed: 823,
      alertsHandled: 46,
    },
    {
      id: 'OFF-012',
      name: 'Patricia Garcia',
      email: 'patricia.garcia@alphafund.com',
      phone: '+1 (555) 345-6789',
      role: 'Risk Officer',
      permissions: ['risk_assessment', 'audit_logs', 'reporting'],
      status: 'suspended',
      department: 'Risk Management',
      joinedDate: '2022-08-25',
      lastLogin: '2024-11-05T16:45:00Z',
      complianceReviews: 145,
      kycApprovals: 67,
      riskAssessments: 234,
      auditLogsAccessed: 389,
      avgApprovalTime: 3.5,
      complianceScore: 75,
      activeInvestigations: 0,
      pendingReviews: 0,
      documentsReviewed: 1123,
      alertsHandled: 58,
    },
    {
      id: 'OFF-013',
      name: 'Daniel Moore',
      email: 'daniel.moore@alphafund.com',
      phone: '+1 (555) 456-7890',
      role: 'Sub-Admin',
      permissions: ['investor_support', 'transaction_review', 'reporting'],
      status: 'active',
      department: 'Client Services',
      joinedDate: '2023-11-30',
      lastLogin: '2024-11-11T09:30:00Z',
      complianceReviews: 123,
      kycApprovals: 76,
      riskAssessments: 43,
      auditLogsAccessed: 234,
      avgApprovalTime: 3.4,
      complianceScore: 87,
      activeInvestigations: 2,
      pendingReviews: 5,
      documentsReviewed: 589,
      alertsHandled: 35,
    },
    {
      id: 'OFF-014',
      name: 'Nancy Taylor',
      email: 'nancy.taylor@alphafund.com',
      phone: '+1 (555) 567-8901',
      role: 'Compliance Officer',
      permissions: ['compliance_review', 'kyc_approval', 'audit_logs', 'risk_assessment'],
      status: 'active',
      department: 'Compliance',
      joinedDate: '2024-01-15',
      lastLogin: '2024-11-11T12:30:00Z',
      complianceReviews: 187,
      kycApprovals: 123,
      riskAssessments: 89,
      auditLogsAccessed: 423,
      avgApprovalTime: 2.2,
      complianceScore: 92,
      activeInvestigations: 3,
      pendingReviews: 8,
      documentsReviewed: 967,
      alertsHandled: 67,
    },
    {
      id: 'OFF-015',
      name: 'Kevin Anderson',
      email: 'kevin.anderson@alphafund.com',
      phone: '+1 (555) 678-9012',
      role: 'Fund Officer',
      permissions: ['fund_management', 'nav_calculation', 'asset_management'],
      status: 'active',
      department: 'Fund Operations',
      joinedDate: '2024-02-20',
      lastLogin: '2024-11-11T11:10:00Z',
      complianceReviews: 98,
      kycApprovals: 56,
      riskAssessments: 34,
      auditLogsAccessed: 189,
      avgApprovalTime: 2.9,
      complianceScore: 90,
      activeInvestigations: 1,
      pendingReviews: 4,
      documentsReviewed: 456,
      alertsHandled: 28,
    },
    {
      id: 'OFF-016',
      name: 'Michelle White',
      email: 'michelle.white@alphafund.com',
      phone: '+1 (555) 789-0123',
      role: 'Risk Officer',
      permissions: ['risk_assessment', 'compliance_review', 'reporting'],
      status: 'active',
      department: 'Risk Management',
      joinedDate: '2024-03-12',
      lastLogin: '2024-11-11T08:35:00Z',
      complianceReviews: 134,
      kycApprovals: 78,
      riskAssessments: 198,
      auditLogsAccessed: 356,
      avgApprovalTime: 2.4,
      complianceScore: 93,
      activeInvestigations: 2,
      pendingReviews: 9,
      documentsReviewed: 876,
      alertsHandled: 54,
    },
    {
      id: 'OFF-017',
      name: 'Brian Thomas',
      email: 'brian.thomas@alphafund.com',
      phone: '+1 (555) 890-1234',
      role: 'Sub-Admin',
      permissions: ['asset_management', 'trader_oversight'],
      status: 'inactive',
      department: 'Investment Team',
      joinedDate: '2022-12-05',
      lastLogin: '2024-10-28T15:20:00Z',
      complianceReviews: 76,
      kycApprovals: 43,
      riskAssessments: 28,
      auditLogsAccessed: 167,
      avgApprovalTime: 4.1,
      complianceScore: 79,
      activeInvestigations: 0,
      pendingReviews: 1,
      documentsReviewed: 312,
      alertsHandled: 19,
    },
    {
      id: 'OFF-018',
      name: 'Sandra Harris',
      email: 'sandra.harris@alphafund.com',
      phone: '+1 (555) 901-2345',
      role: 'Compliance Officer',
      permissions: ['compliance_review', 'kyc_approval', 'audit_logs'],
      status: 'active',
      department: 'Compliance',
      joinedDate: '2024-04-08',
      lastLogin: '2024-11-11T09:55:00Z',
      complianceReviews: 156,
      kycApprovals: 98,
      riskAssessments: 67,
      auditLogsAccessed: 389,
      avgApprovalTime: 2.1,
      complianceScore: 94,
      activeInvestigations: 2,
      pendingReviews: 7,
      documentsReviewed: 789,
      alertsHandled: 49,
    },
  ];

  const activityLogs: ActivityLog[] = [
    {
      timestamp: '2024-11-11T10:30:00Z',
      action: 'Login',
      description: 'Logged in from IP 192.168.1.100',
      type: 'system',
    },
    {
      timestamp: '2024-11-11T10:35:00Z',
      action: 'KYC Review',
      description: 'Approved KYC documentation for investor INV-789',
      type: 'kyc',
    },
    {
      timestamp: '2024-11-11T11:00:00Z',
      action: 'Compliance Check',
      description: 'Completed quarterly compliance review',
      type: 'compliance',
    },
    {
      timestamp: '2024-11-11T11:15:00Z',
      action: 'Risk Assessment',
      description: 'Evaluated risk profile for new trading strategy',
      type: 'risk',
    },
    {
      timestamp: '2024-11-10T15:20:00Z',
      action: 'Audit Access',
      description: 'Accessed audit logs for transaction review',
      type: 'audit',
    },
    {
      timestamp: '2024-11-10T14:45:00Z',
      action: 'Document Review',
      description: 'Reviewed 23 compliance documents',
      type: 'compliance',
    },
  ];

  const permissionOptions = [
    { label: 'Fund Management', value: 'fund_management' },
    { label: 'NAV Calculation', value: 'nav_calculation' },
    { label: 'Asset Management', value: 'asset_management' },
    { label: 'Trader Oversight', value: 'trader_oversight' },
    { label: 'Rebalancing', value: 'rebalancing' },
    { label: 'Investor Approval', value: 'investor_approval' },
    { label: 'Compliance Review', value: 'compliance_review' },
    { label: 'KYC Approval', value: 'kyc_approval' },
    { label: 'Risk Assessment', value: 'risk_assessment' },
    { label: 'Reporting', value: 'reporting' },
    { label: 'Audit Logs', value: 'audit_logs' },
    { label: 'Transaction Review', value: 'transaction_review' },
    { label: 'Investor Support', value: 'investor_support' },
  ];

  // Calculated metrics
  const metrics = useMemo(() => {
    const total = officers.length;
    const active = officers.filter((o) => o.status === 'active').length;
    const inactive = officers.filter((o) => o.status === 'inactive').length;
    const suspended = officers.filter((o) => o.status === 'suspended').length;
    const totalComplianceReviews = officers.reduce((sum, o) => sum + o.complianceReviews, 0);
    const totalKycApprovals = officers.reduce((sum, o) => sum + o.kycApprovals, 0);
    const totalRiskAssessments = officers.reduce((sum, o) => sum + o.riskAssessments, 0);
    const avgComplianceScore =
      officers.reduce((sum, o) => sum + o.complianceScore, 0) / (total || 1);
    const activeInvestigations = officers.reduce((sum, o) => sum + o.activeInvestigations, 0);
    const pendingReviews = officers.reduce((sum, o) => sum + o.pendingReviews, 0);

    return {
      total,
      active,
      inactive,
      suspended,
      totalComplianceReviews,
      totalKycApprovals,
      totalRiskAssessments,
      avgComplianceScore,
      activeInvestigations,
      pendingReviews,
    };
  }, [officers]);

  // Filtered officers
  const filteredOfficers = useMemo(() => {
    return officers.filter((officer) => {
      // Search filter
      if (searchText) {
        const search = searchText.toLowerCase();
        if (
          !officer.name.toLowerCase().includes(search) &&
          !officer.email.toLowerCase().includes(search) &&
          !officer.id.toLowerCase().includes(search)
        ) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'all' && officer.status !== statusFilter) {
        return false;
      }

      // Role filter
      if (roleFilter !== 'all' && officer.role !== roleFilter) {
        return false;
      }

      // Department filter
      if (departmentFilter !== 'all' && officer.department !== departmentFilter) {
        return false;
      }

      // Date range filter
      if (dateRange[0] && dateRange[1]) {
        const joinDate = dayjs(officer.joinedDate);
        if (joinDate.isBefore(dateRange[0]) || joinDate.isAfter(dateRange[1])) {
          return false;
        }
      }

      return true;
    });
  }, [officers, searchText, statusFilter, roleFilter, departmentFilter, dateRange]);

  // Chart data - Top performers by compliance reviews
  const topPerformersData = useMemo(() => {
    return [...officers]
      .sort((a, b) => b.complianceReviews - a.complianceReviews)
      .slice(0, 10)
      .map((o) => ({
        name: o.name.split(' ')[0],
        reviews: o.complianceReviews,
      }));
  }, [officers]);

  // Chart data - Role distribution
  const roleDistributionData = useMemo(() => {
    const roleCounts = officers.reduce((acc, officer) => {
      acc[officer.role] = (acc[officer.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(roleCounts).map(([role, count]) => ({
      role,
      count,
    }));
  }, [officers]);

  // Chart data - Department distribution
  const departmentDistributionData = useMemo(() => {
    const deptCounts = officers.reduce((acc, officer) => {
      acc[officer.department] = (acc[officer.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(deptCounts).map(([department, count]) => ({
      department,
      count,
    }));
  }, [officers]);

  // Get unique departments
  const departments = useMemo(() => {
    return Array.from(new Set(officers.map((o) => o.department)));
  }, [officers]);

  const handleAddOfficer = () => {
    form.validateFields().then((values) => {
      console.log('Adding new officer:', values);
      setAddModalVisible(false);
      form.resetFields();
    });
  };

  const handleEditOfficer = () => {
    form.validateFields().then((values) => {
      console.log('Updating officer:', values);
      setEditModalVisible(false);
      form.resetFields();
    });
  };

  const openEditModal = (officer: Officer) => {
    setSelectedOfficer(officer);
    form.setFieldsValue(officer);
    setEditModalVisible(true);
  };

  const openActivityDrawer = (officer: Officer) => {
    setSelectedOfficer(officer);
    setActivityDrawerVisible(true);
  };

  const toggleOfficerStatus = (officer: Officer) => {
    console.log('Toggling status for:', officer.id);
  };

  const handleExportReport = () => {
    console.log('Exporting officers report...');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Fund Officer':
        return 'blue';
      case 'Compliance Officer':
        return 'green';
      case 'Risk Officer':
        return 'orange';
      case 'Sub-Admin':
        return 'purple';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'suspended':
        return 'error';
      default:
        return 'default';
    }
  };

  const getActionMenu = (record: Officer) => (
    <Menu>
      <Menu.Item key="view" icon={<EyeOutlined />} onClick={() => openActivityDrawer(record)}>
        View Details
      </Menu.Item>
      <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => openEditModal(record)}>
        Edit Officer
      </Menu.Item>
      <Menu.Item key="history" icon={<HistoryOutlined />} onClick={() => openActivityDrawer(record)}>
        Activity History
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="suspend"
        icon={record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />}
        danger={record.status === 'active'}
        onClick={() => toggleOfficerStatus(record)}
      >
        {record.status === 'active' ? 'Suspend Access' : 'Activate Access'}
      </Menu.Item>
    </Menu>
  );

  const columns: ColumnsType<Officer> = [
    {
      title: 'Officer',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      fixed: 'left',
      render: (name: string, record: Officer) => (
        <Space>
          <Avatar
            style={{ backgroundColor: '#1890ff' }}
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
      title: 'Compliance Reviews',
      dataIndex: 'complianceReviews',
      key: 'complianceReviews',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.complianceReviews - b.complianceReviews,
      render: (reviews: number) => (
        <Badge count={reviews} showZero color="#52c41a" overflowCount={999} />
      ),
    },
    {
      title: 'KYC Approvals',
      dataIndex: 'kycApprovals',
      key: 'kycApprovals',
      width: 140,
      align: 'center',
      sorter: (a, b) => a.kycApprovals - b.kycApprovals,
      render: (approvals: number) => (
        <Badge count={approvals} showZero color="#1890ff" overflowCount={999} />
      ),
    },
    {
      title: 'Risk Assessments',
      dataIndex: 'riskAssessments',
      key: 'riskAssessments',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.riskAssessments - b.riskAssessments,
      render: (assessments: number) => (
        <Badge count={assessments} showZero color="#fa8c16" overflowCount={999} />
      ),
    },
    {
      title: 'Compliance Score',
      dataIndex: 'complianceScore',
      key: 'complianceScore',
      width: 180,
      sorter: (a, b) => a.complianceScore - b.complianceScore,
      render: (score: number) => (
        <Space direction="vertical" size={0} style={{ width: '100%' }}>
          <Progress
            percent={score}
            size="small"
            strokeColor={
              score >= 95 ? '#52c41a' : score >= 90 ? '#1890ff' : score >= 80 ? '#faad14' : '#f5222d'
            }
            format={(percent) => `${percent}%`}
          />
        </Space>
      ),
    },
    {
      title: 'Active Cases',
      dataIndex: 'activeInvestigations',
      key: 'activeInvestigations',
      width: 120,
      align: 'center',
      sorter: (a, b) => a.activeInvestigations - b.activeInvestigations,
      render: (investigations: number) =>
        investigations > 0 ? (
          <Badge count={investigations} showZero color="#ff4d4f" />
        ) : (
          <Text type="secondary">0</Text>
        ),
    },
    {
      title: 'Pending Reviews',
      dataIndex: 'pendingReviews',
      key: 'pendingReviews',
      width: 140,
      align: 'center',
      sorter: (a, b) => a.pendingReviews - b.pendingReviews,
      render: (pending: number) =>
        pending > 0 ? (
          <Badge count={pending} showZero color="#faad14" />
        ) : (
          <Text type="secondary">0</Text>
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
    yField: 'reviews',
    label: {
      position: 'top' as const,
      formatter: (datum: any) => datum.reviews,
    },
    columnStyle: {
      radius: [8, 8, 0, 0],
      fill: 'l(270) 0:#52c41a 1:#73d13d',
    },
    xAxis: {
      label: {
        autoRotate: false,
      },
    },
    yAxis: {
      title: {
        text: 'Compliance Reviews',
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
    color: ['#1890ff', '#52c41a', '#fa8c16', '#9254de'],
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
          <Title level={2}>Officers & Compliance Management</Title>
          <Text type="secondary">Manage fund officers, compliance, and permissions</Text>
        </div>
        <Space>
          <Button icon={<DownloadOutlined />} onClick={handleExportReport}>
            Export Report
          </Button>
          <Button type="primary" icon={<UserAddOutlined />} onClick={() => setAddModalVisible(true)}>
            Add Officer
          </Button>
        </Space>
      </div>

      {/* Stats Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Officers"
              value={metrics.total}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active"
              value={metrics.active}
              prefix={<SafetyOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Compliance Reviews"
              value={metrics.totalComplianceReviews}
              prefix={<FileProtectOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card>
            <Statistic
              title="KYC Approvals"
              value={metrics.totalKycApprovals}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Risk Assessments"
              value={metrics.totalRiskAssessments}
              prefix={<AuditOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Avg Compliance Score"
              value={metrics.avgComplianceScore.toFixed(1)}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Investigations"
              value={metrics.activeInvestigations}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending Reviews"
              value={metrics.pendingReviews}
              prefix={<HistoryOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={16}>
          <Card title="Top Performers by Compliance Reviews" bordered={false}>
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
                <Select.Option value="Fund Officer">Fund Officer</Select.Option>
                <Select.Option value="Compliance Officer">Compliance Officer</Select.Option>
                <Select.Option value="Risk Officer">Risk Officer</Select.Option>
                <Select.Option value="Sub-Admin">Sub-Admin</Select.Option>
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

      {/* Officers Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredOfficers}
          rowKey="id"
          pagination={{
            pageSize: 15,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} officers`,
            pageSizeOptions: ['10', '15', '20', '50'],
          }}
          scroll={{ x: 1800 }}
        />
      </Card>

      {/* Add Officer Modal */}
      <Modal
        title="Add New Officer"
        open={addModalVisible}
        onOk={handleAddOfficer}
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
              <Select.Option value="Fund Officer">Fund Officer</Select.Option>
              <Select.Option value="Sub-Admin">Sub-Admin</Select.Option>
              <Select.Option value="Compliance Officer">Compliance Officer</Select.Option>
              <Select.Option value="Risk Officer">Risk Officer</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Department"
            name="department"
            rules={[{ required: true, message: 'Please enter department' }]}
          >
            <Input placeholder="Fund Operations" />
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

      {/* Edit Officer Modal */}
      <Modal
        title="Edit Officer"
        open={editModalVisible}
        onOk={handleEditOfficer}
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
              <Select.Option value="Fund Officer">Fund Officer</Select.Option>
              <Select.Option value="Sub-Admin">Sub-Admin</Select.Option>
              <Select.Option value="Compliance Officer">Compliance Officer</Select.Option>
              <Select.Option value="Risk Officer">Risk Officer</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Department" name="department">
            <Input />
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
            <Avatar style={{ backgroundColor: '#1890ff' }}>
              {selectedOfficer?.name.charAt(0).toUpperCase()}
            </Avatar>
            <div>
              <div>{selectedOfficer?.name}</div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Activity History & Compliance
              </Text>
            </div>
          </Space>
        }
        width={600}
        open={activityDrawerVisible}
        onClose={() => setActivityDrawerVisible(false)}
      >
        {selectedOfficer && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Officer ID">{selectedOfficer.id}</Descriptions.Item>
              <Descriptions.Item label="Role">
                <Tag color={getRoleColor(selectedOfficer.role)}>{selectedOfficer.role}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Department">
                {selectedOfficer.department}
              </Descriptions.Item>
              <Descriptions.Item label="Joined">
                {dayjs(selectedOfficer.joinedDate).format('MMMM DD, YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Last Login">
                {dayjs(selectedOfficer.lastLogin).format('MMMM DD, YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Compliance Score">
                <Progress
                  percent={selectedOfficer.complianceScore}
                  size="small"
                  strokeColor={
                    selectedOfficer.complianceScore >= 95
                      ? '#52c41a'
                      : selectedOfficer.complianceScore >= 90
                      ? '#1890ff'
                      : '#faad14'
                  }
                />
              </Descriptions.Item>
            </Descriptions>

            <Card title="Compliance Metrics" size="small">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title="Compliance Reviews"
                    value={selectedOfficer.complianceReviews}
                    prefix={<FileProtectOutlined />}
                    valueStyle={{ fontSize: '18px' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="KYC Approvals"
                    value={selectedOfficer.kycApprovals}
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ fontSize: '18px' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Risk Assessments"
                    value={selectedOfficer.riskAssessments}
                    prefix={<AuditOutlined />}
                    valueStyle={{ fontSize: '18px' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Documents Reviewed"
                    value={selectedOfficer.documentsReviewed}
                    valueStyle={{ fontSize: '18px' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Active Cases"
                    value={selectedOfficer.activeInvestigations}
                    prefix={<WarningOutlined />}
                    valueStyle={{ fontSize: '18px', color: '#ff4d4f' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Pending Reviews"
                    value={selectedOfficer.pendingReviews}
                    valueStyle={{ fontSize: '18px', color: '#faad14' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Avg Approval Time"
                    value={selectedOfficer.avgApprovalTime}
                    suffix="hrs"
                    valueStyle={{ fontSize: '18px' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Alerts Handled"
                    value={selectedOfficer.alertsHandled}
                    valueStyle={{ fontSize: '18px' }}
                  />
                </Col>
              </Row>
            </Card>

            <Card title="Recent Activity" size="small">
              <Timeline
                items={activityLogs.map((log) => ({
                  color:
                    log.type === 'compliance'
                      ? 'green'
                      : log.type === 'kyc'
                      ? 'blue'
                      : log.type === 'risk'
                      ? 'orange'
                      : log.type === 'audit'
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
              <Space wrap>
                {selectedOfficer.permissions.map((perm) => (
                  <Tag key={perm} color="blue">
                    {perm.replace(/_/g, ' ').toUpperCase()}
                  </Tag>
                ))}
              </Space>
            </Card>
          </Space>
        )}
      </Drawer>
    </div>
  );
}
