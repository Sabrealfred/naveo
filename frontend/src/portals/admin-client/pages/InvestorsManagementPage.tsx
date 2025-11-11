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
  List,
  InputNumber,
  Upload,
} from 'antd';
import {
  UserAddOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  TeamOutlined,
  DollarOutlined,
  DownloadOutlined,
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  HistoryOutlined,
  FileProtectOutlined,
  RiseOutlined,
  FallOutlined,
  TrophyOutlined,
  SafetyOutlined,
  WarningOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { Column, Pie, Line } from '@ant-design/charts';
import { StatCard } from '../../../components/common';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface Investor {
  id: string;
  name: string;
  email: string;
  phone: string;
  kycStatus: 'approved' | 'pending' | 'rejected' | 'under_review';
  investedAmount: number;
  portfolioValue: number;
  shares: number;
  joinDate: string;
  tier: 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
  kycSubmissionDate: string;
  kycApprovalDate?: string;
  documentsSubmitted: number;
  documentsPending: number;
  lastActivity: string;
  lastActivityType: string;
  roi: number;
  lastDeposit?: string;
  lastWithdrawal?: string;
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  accreditationStatus: 'accredited' | 'non-accredited' | 'pending';
  totalDeposits: number;
  totalWithdrawals: number;
  avatar?: string;
}

interface ActivityLog {
  timestamp: string;
  action: string;
  description: string;
  type: 'kyc' | 'deposit' | 'withdrawal' | 'document' | 'system';
}

export default function InvestorsManagementPage() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [kycForm] = Form.useForm();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [kycModalVisible, setKycModalVisible] = useState(false);
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);

  // Filter states
  const [searchText, setSearchText] = useState('');
  const [kycFilter, setKycFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

  // Mock data - expanded to 22 investors
  const investors: Investor[] = [
    {
      id: 'INV-001',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 (555) 100-1001',
      kycStatus: 'approved',
      investedAmount: 125000,
      portfolioValue: 147500,
      shares: 1250,
      joinDate: '2024-08-15',
      tier: 'Gold',
      kycSubmissionDate: '2024-08-16',
      kycApprovalDate: '2024-08-18',
      documentsSubmitted: 5,
      documentsPending: 0,
      lastActivity: '2024-11-10T14:30:00Z',
      lastActivityType: 'Portfolio Review',
      roi: 18.0,
      lastDeposit: '2024-10-15T10:00:00Z',
      riskProfile: 'moderate',
      accreditationStatus: 'accredited',
      totalDeposits: 125000,
      totalWithdrawals: 0,
    },
    {
      id: 'INV-002',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+1 (555) 200-2002',
      kycStatus: 'pending',
      investedAmount: 0,
      portfolioValue: 0,
      shares: 0,
      joinDate: '2024-11-10',
      tier: 'Silver',
      kycSubmissionDate: '2024-11-10',
      documentsSubmitted: 3,
      documentsPending: 2,
      lastActivity: '2024-11-10T16:20:00Z',
      lastActivityType: 'Document Upload',
      roi: 0,
      riskProfile: 'conservative',
      accreditationStatus: 'pending',
      totalDeposits: 0,
      totalWithdrawals: 0,
    },
    {
      id: 'INV-003',
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      phone: '+1 (555) 300-3003',
      kycStatus: 'approved',
      investedAmount: 250000,
      portfolioValue: 312500,
      shares: 2500,
      joinDate: '2024-06-20',
      tier: 'Platinum',
      kycSubmissionDate: '2024-06-21',
      kycApprovalDate: '2024-06-22',
      documentsSubmitted: 5,
      documentsPending: 0,
      lastActivity: '2024-11-11T09:15:00Z',
      lastActivityType: 'Deposit',
      roi: 25.0,
      lastDeposit: '2024-11-11T09:15:00Z',
      lastWithdrawal: '2024-09-05T11:20:00Z',
      riskProfile: 'aggressive',
      accreditationStatus: 'accredited',
      totalDeposits: 275000,
      totalWithdrawals: 25000,
    },
    {
      id: 'INV-004',
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      phone: '+1 (555) 400-4004',
      kycStatus: 'rejected',
      investedAmount: 0,
      portfolioValue: 0,
      shares: 0,
      joinDate: '2024-10-05',
      tier: 'Bronze',
      kycSubmissionDate: '2024-10-06',
      documentsSubmitted: 2,
      documentsPending: 3,
      lastActivity: '2024-10-08T15:30:00Z',
      lastActivityType: 'KYC Rejection',
      roi: 0,
      riskProfile: 'conservative',
      accreditationStatus: 'non-accredited',
      totalDeposits: 0,
      totalWithdrawals: 0,
    },
    {
      id: 'INV-005',
      name: 'Robert Wilson',
      email: 'robert.wilson@example.com',
      phone: '+1 (555) 500-5005',
      kycStatus: 'approved',
      investedAmount: 450000,
      portfolioValue: 562500,
      shares: 4500,
      joinDate: '2024-03-12',
      tier: 'Platinum',
      kycSubmissionDate: '2024-03-13',
      kycApprovalDate: '2024-03-14',
      documentsSubmitted: 5,
      documentsPending: 0,
      lastActivity: '2024-11-09T13:40:00Z',
      lastActivityType: 'Portfolio Rebalancing',
      roi: 25.0,
      lastDeposit: '2024-09-20T10:00:00Z',
      riskProfile: 'aggressive',
      accreditationStatus: 'accredited',
      totalDeposits: 450000,
      totalWithdrawals: 0,
    },
    {
      id: 'INV-006',
      name: 'Jennifer Martinez',
      email: 'jennifer.martinez@example.com',
      phone: '+1 (555) 600-6006',
      kycStatus: 'under_review',
      investedAmount: 0,
      portfolioValue: 0,
      shares: 0,
      joinDate: '2024-11-08',
      tier: 'Silver',
      kycSubmissionDate: '2024-11-08',
      documentsSubmitted: 4,
      documentsPending: 1,
      lastActivity: '2024-11-09T10:15:00Z',
      lastActivityType: 'KYC Under Review',
      roi: 0,
      riskProfile: 'moderate',
      accreditationStatus: 'pending',
      totalDeposits: 0,
      totalWithdrawals: 0,
    },
    {
      id: 'INV-007',
      name: 'David Brown',
      email: 'david.brown@example.com',
      phone: '+1 (555) 700-7007',
      kycStatus: 'approved',
      investedAmount: 175000,
      portfolioValue: 196000,
      shares: 1750,
      joinDate: '2024-05-18',
      tier: 'Gold',
      kycSubmissionDate: '2024-05-19',
      kycApprovalDate: '2024-05-20',
      documentsSubmitted: 5,
      documentsPending: 0,
      lastActivity: '2024-11-11T08:30:00Z',
      lastActivityType: 'Withdrawal Request',
      roi: 12.0,
      lastDeposit: '2024-07-22T14:00:00Z',
      lastWithdrawal: '2024-11-11T08:30:00Z',
      riskProfile: 'moderate',
      accreditationStatus: 'accredited',
      totalDeposits: 185000,
      totalWithdrawals: 10000,
    },
    {
      id: 'INV-008',
      name: 'Lisa Anderson',
      email: 'lisa.anderson@example.com',
      phone: '+1 (555) 800-8008',
      kycStatus: 'approved',
      investedAmount: 85000,
      portfolioValue: 92650,
      shares: 850,
      joinDate: '2024-07-25',
      tier: 'Silver',
      kycSubmissionDate: '2024-07-26',
      kycApprovalDate: '2024-07-27',
      documentsSubmitted: 5,
      documentsPending: 0,
      lastActivity: '2024-11-10T11:25:00Z',
      lastActivityType: 'Document Upload',
      roi: 9.0,
      lastDeposit: '2024-08-30T09:00:00Z',
      riskProfile: 'conservative',
      accreditationStatus: 'non-accredited',
      totalDeposits: 85000,
      totalWithdrawals: 0,
    },
    {
      id: 'INV-009',
      name: 'James Taylor',
      email: 'james.taylor@example.com',
      phone: '+1 (555) 900-9009',
      kycStatus: 'approved',
      investedAmount: 320000,
      portfolioValue: 400000,
      shares: 3200,
      joinDate: '2024-02-10',
      tier: 'Platinum',
      kycSubmissionDate: '2024-02-11',
      kycApprovalDate: '2024-02-12',
      documentsSubmitted: 5,
      documentsPending: 0,
      lastActivity: '2024-11-11T10:50:00Z',
      lastActivityType: 'Deposit',
      roi: 25.0,
      lastDeposit: '2024-11-11T10:50:00Z',
      riskProfile: 'aggressive',
      accreditationStatus: 'accredited',
      totalDeposits: 320000,
      totalWithdrawals: 0,
    },
    {
      id: 'INV-010',
      name: 'Patricia White',
      email: 'patricia.white@example.com',
      phone: '+1 (555) 101-0101',
      kycStatus: 'pending',
      investedAmount: 0,
      portfolioValue: 0,
      shares: 0,
      joinDate: '2024-11-09',
      tier: 'Bronze',
      kycSubmissionDate: '2024-11-09',
      documentsSubmitted: 2,
      documentsPending: 3,
      lastActivity: '2024-11-09T15:10:00Z',
      lastActivityType: 'Document Upload',
      roi: 0,
      riskProfile: 'conservative',
      accreditationStatus: 'pending',
      totalDeposits: 0,
      totalWithdrawals: 0,
    },
    {
      id: 'INV-011',
      name: 'Thomas Harris',
      email: 'thomas.harris@example.com',
      phone: '+1 (555) 111-1111',
      kycStatus: 'approved',
      investedAmount: 195000,
      portfolioValue: 224250,
      shares: 1950,
      joinDate: '2024-04-22',
      tier: 'Gold',
      kycSubmissionDate: '2024-04-23',
      kycApprovalDate: '2024-04-24',
      documentsSubmitted: 5,
      documentsPending: 0,
      lastActivity: '2024-11-08T12:20:00Z',
      lastActivityType: 'Portfolio Review',
      roi: 15.0,
      lastDeposit: '2024-06-15T11:30:00Z',
      riskProfile: 'moderate',
      accreditationStatus: 'accredited',
      totalDeposits: 195000,
      totalWithdrawals: 0,
    },
    {
      id: 'INV-012',
      name: 'Nancy Clark',
      email: 'nancy.clark@example.com',
      phone: '+1 (555) 122-2222',
      kycStatus: 'approved',
      investedAmount: 67000,
      portfolioValue: 70350,
      shares: 670,
      joinDate: '2024-08-30',
      tier: 'Bronze',
      kycSubmissionDate: '2024-08-31',
      kycApprovalDate: '2024-09-01',
      documentsSubmitted: 5,
      documentsPending: 0,
      lastActivity: '2024-11-07T09:45:00Z',
      lastActivityType: 'Login',
      roi: 5.0,
      lastDeposit: '2024-08-30T10:00:00Z',
      riskProfile: 'conservative',
      accreditationStatus: 'non-accredited',
      totalDeposits: 67000,
      totalWithdrawals: 0,
    },
    {
      id: 'INV-013',
      name: 'Daniel Lee',
      email: 'daniel.lee@example.com',
      phone: '+1 (555) 133-3333',
      kycStatus: 'approved',
      investedAmount: 540000,
      portfolioValue: 702000,
      shares: 5400,
      joinDate: '2024-01-15',
      tier: 'Platinum',
      kycSubmissionDate: '2024-01-16',
      kycApprovalDate: '2024-01-17',
      documentsSubmitted: 5,
      documentsPending: 0,
      lastActivity: '2024-11-11T11:10:00Z',
      lastActivityType: 'Withdrawal',
      roi: 30.0,
      lastDeposit: '2024-10-01T14:00:00Z',
      lastWithdrawal: '2024-11-11T11:10:00Z',
      riskProfile: 'aggressive',
      accreditationStatus: 'accredited',
      totalDeposits: 600000,
      totalWithdrawals: 60000,
    },
    {
      id: 'INV-014',
      name: 'Karen Lewis',
      email: 'karen.lewis@example.com',
      phone: '+1 (555) 144-4444',
      kycStatus: 'under_review',
      investedAmount: 0,
      portfolioValue: 0,
      shares: 0,
      joinDate: '2024-11-07',
      tier: 'Silver',
      kycSubmissionDate: '2024-11-07',
      documentsSubmitted: 3,
      documentsPending: 2,
      lastActivity: '2024-11-08T13:50:00Z',
      lastActivityType: 'KYC Under Review',
      roi: 0,
      riskProfile: 'moderate',
      accreditationStatus: 'pending',
      totalDeposits: 0,
      totalWithdrawals: 0,
    },
    {
      id: 'INV-015',
      name: 'Paul Walker',
      email: 'paul.walker@example.com',
      phone: '+1 (555) 155-5555',
      kycStatus: 'approved',
      investedAmount: 145000,
      portfolioValue: 159500,
      shares: 1450,
      joinDate: '2024-06-05',
      tier: 'Gold',
      kycSubmissionDate: '2024-06-06',
      kycApprovalDate: '2024-06-07',
      documentsSubmitted: 5,
      documentsPending: 0,
      lastActivity: '2024-11-10T10:30:00Z',
      lastActivityType: 'Deposit',
      roi: 10.0,
      lastDeposit: '2024-11-10T10:30:00Z',
      riskProfile: 'moderate',
      accreditationStatus: 'accredited',
      totalDeposits: 145000,
      totalWithdrawals: 0,
    },
    {
      id: 'INV-016',
      name: 'Betty King',
      email: 'betty.king@example.com',
      phone: '+1 (555) 166-6666',
      kycStatus: 'approved',
      investedAmount: 92000,
      portfolioValue: 101200,
      shares: 920,
      joinDate: '2024-07-12',
      tier: 'Silver',
      kycSubmissionDate: '2024-07-13',
      kycApprovalDate: '2024-07-14',
      documentsSubmitted: 5,
      documentsPending: 0,
      lastActivity: '2024-11-09T14:15:00Z',
      lastActivityType: 'Portfolio Review',
      roi: 10.0,
      lastDeposit: '2024-09-01T12:00:00Z',
      riskProfile: 'conservative',
      accreditationStatus: 'non-accredited',
      totalDeposits: 92000,
      totalWithdrawals: 0,
    },
    {
      id: 'INV-017',
      name: 'Steven Wright',
      email: 'steven.wright@example.com',
      phone: '+1 (555) 177-7777',
      kycStatus: 'approved',
      investedAmount: 385000,
      portfolioValue: 500500,
      shares: 3850,
      joinDate: '2024-03-08',
      tier: 'Platinum',
      kycSubmissionDate: '2024-03-09',
      kycApprovalDate: '2024-03-10',
      documentsSubmitted: 5,
      documentsPending: 0,
      lastActivity: '2024-11-11T09:40:00Z',
      lastActivityType: 'Deposit',
      roi: 30.0,
      lastDeposit: '2024-11-11T09:40:00Z',
      riskProfile: 'aggressive',
      accreditationStatus: 'accredited',
      totalDeposits: 385000,
      totalWithdrawals: 0,
    },
    {
      id: 'INV-018',
      name: 'Sandra Scott',
      email: 'sandra.scott@example.com',
      phone: '+1 (555) 188-8888',
      kycStatus: 'pending',
      investedAmount: 0,
      portfolioValue: 0,
      shares: 0,
      joinDate: '2024-11-11',
      tier: 'Bronze',
      kycSubmissionDate: '2024-11-11',
      documentsSubmitted: 1,
      documentsPending: 4,
      lastActivity: '2024-11-11T11:30:00Z',
      lastActivityType: 'Registration',
      roi: 0,
      riskProfile: 'conservative',
      accreditationStatus: 'pending',
      totalDeposits: 0,
      totalWithdrawals: 0,
    },
    {
      id: 'INV-019',
      name: 'Brian Green',
      email: 'brian.green@example.com',
      phone: '+1 (555) 199-9999',
      kycStatus: 'approved',
      investedAmount: 215000,
      portfolioValue: 247250,
      shares: 2150,
      joinDate: '2024-05-02',
      tier: 'Gold',
      kycSubmissionDate: '2024-05-03',
      kycApprovalDate: '2024-05-04',
      documentsSubmitted: 5,
      documentsPending: 0,
      lastActivity: '2024-11-10T15:20:00Z',
      lastActivityType: 'Withdrawal',
      roi: 15.0,
      lastDeposit: '2024-08-12T10:30:00Z',
      lastWithdrawal: '2024-11-10T15:20:00Z',
      riskProfile: 'moderate',
      accreditationStatus: 'accredited',
      totalDeposits: 220000,
      totalWithdrawals: 5000,
    },
    {
      id: 'INV-020',
      name: 'Donna Adams',
      email: 'donna.adams@example.com',
      phone: '+1 (555) 200-0000',
      kycStatus: 'approved',
      investedAmount: 78000,
      portfolioValue: 81900,
      shares: 780,
      joinDate: '2024-08-08',
      tier: 'Bronze',
      kycSubmissionDate: '2024-08-09',
      kycApprovalDate: '2024-08-10',
      documentsSubmitted: 5,
      documentsPending: 0,
      lastActivity: '2024-11-06T10:55:00Z',
      lastActivityType: 'Login',
      roi: 5.0,
      lastDeposit: '2024-08-08T14:00:00Z',
      riskProfile: 'conservative',
      accreditationStatus: 'non-accredited',
      totalDeposits: 78000,
      totalWithdrawals: 0,
    },
    {
      id: 'INV-021',
      name: 'Mark Baker',
      email: 'mark.baker@example.com',
      phone: '+1 (555) 211-1111',
      kycStatus: 'approved',
      investedAmount: 470000,
      portfolioValue: 611000,
      shares: 4700,
      joinDate: '2024-02-28',
      tier: 'Platinum',
      kycSubmissionDate: '2024-02-29',
      kycApprovalDate: '2024-03-01',
      documentsSubmitted: 5,
      documentsPending: 0,
      lastActivity: '2024-11-11T10:20:00Z',
      lastActivityType: 'Portfolio Rebalancing',
      roi: 30.0,
      lastDeposit: '2024-09-15T11:00:00Z',
      riskProfile: 'aggressive',
      accreditationStatus: 'accredited',
      totalDeposits: 470000,
      totalWithdrawals: 0,
    },
    {
      id: 'INV-022',
      name: 'Carol Hill',
      email: 'carol.hill@example.com',
      phone: '+1 (555) 222-2222',
      kycStatus: 'rejected',
      investedAmount: 0,
      portfolioValue: 0,
      shares: 0,
      joinDate: '2024-10-20',
      tier: 'Bronze',
      kycSubmissionDate: '2024-10-21',
      documentsSubmitted: 3,
      documentsPending: 2,
      lastActivity: '2024-10-23T14:50:00Z',
      lastActivityType: 'KYC Rejection',
      roi: 0,
      riskProfile: 'conservative',
      accreditationStatus: 'non-accredited',
      totalDeposits: 0,
      totalWithdrawals: 0,
    },
  ];

  const activityLogs: ActivityLog[] = [
    {
      timestamp: '2024-11-11T10:30:00Z',
      action: 'Deposit Confirmed',
      description: 'Deposited $50,000 to portfolio',
      type: 'deposit',
    },
    {
      timestamp: '2024-11-10T14:20:00Z',
      action: 'Document Uploaded',
      description: 'Uploaded updated tax documentation',
      type: 'document',
    },
    {
      timestamp: '2024-11-09T16:15:00Z',
      action: 'KYC Approved',
      description: 'KYC documentation reviewed and approved',
      type: 'kyc',
    },
    {
      timestamp: '2024-11-08T11:30:00Z',
      action: 'Withdrawal Requested',
      description: 'Requested withdrawal of $10,000',
      type: 'withdrawal',
    },
    {
      timestamp: '2024-11-07T09:45:00Z',
      action: 'Login',
      description: 'Logged in from IP 192.168.1.110',
      type: 'system',
    },
  ];

  // Calculated metrics
  const metrics = useMemo(() => {
    const total = investors.length;
    const approved = investors.filter((i) => i.kycStatus === 'approved').length;
    const pending = investors.filter((i) => i.kycStatus === 'pending').length;
    const underReview = investors.filter((i) => i.kycStatus === 'under_review').length;
    const rejected = investors.filter((i) => i.kycStatus === 'rejected').length;
    const totalInvested = investors.reduce((sum, i) => sum + i.investedAmount, 0);
    const totalPortfolioValue = investors.reduce((sum, i) => sum + i.portfolioValue, 0);
    const avgROI =
      investors.filter((i) => i.kycStatus === 'approved').reduce((sum, i) => sum + i.roi, 0) /
      (approved || 1);

    return {
      total,
      approved,
      pending,
      underReview,
      rejected,
      totalInvested,
      totalPortfolioValue,
      avgROI,
    };
  }, [investors]);

  // Filtered investors
  const filteredInvestors = useMemo(() => {
    return investors.filter((investor) => {
      // Search filter
      if (searchText) {
        const search = searchText.toLowerCase();
        if (
          !investor.name.toLowerCase().includes(search) &&
          !investor.email.toLowerCase().includes(search) &&
          !investor.id.toLowerCase().includes(search)
        ) {
          return false;
        }
      }

      // KYC status filter
      if (kycFilter !== 'all' && investor.kycStatus !== kycFilter) {
        return false;
      }

      // Tier filter
      if (tierFilter !== 'all' && investor.tier.toLowerCase() !== tierFilter) {
        return false;
      }

      // Risk profile filter
      if (riskFilter !== 'all' && investor.riskProfile !== riskFilter) {
        return false;
      }

      // Date range filter
      if (dateRange[0] && dateRange[1]) {
        const joinDate = dayjs(investor.joinDate);
        if (joinDate.isBefore(dateRange[0]) || joinDate.isAfter(dateRange[1])) {
          return false;
        }
      }

      return true;
    });
  }, [investors, searchText, kycFilter, tierFilter, riskFilter, dateRange]);

  // Chart data - KYC status distribution
  const kycStatusData = useMemo(() => {
    const statusCounts = investors.reduce((acc, investor) => {
      const status = investor.kycStatus;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
      status: status.replace('_', ' ').toUpperCase(),
      count,
    }));
  }, [investors]);

  // Chart data - Tier distribution
  const tierDistributionData = useMemo(() => {
    const tierCounts = investors
      .filter((i) => i.kycStatus === 'approved')
      .reduce((acc, investor) => {
        acc[investor.tier] = (acc[investor.tier] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(tierCounts).map(([tier, count]) => ({
      tier,
      count,
    }));
  }, [investors]);

  // Chart data - Top investors by portfolio value
  const topInvestorsData = useMemo(() => {
    return [...investors]
      .filter((i) => i.kycStatus === 'approved')
      .sort((a, b) => b.portfolioValue - a.portfolioValue)
      .slice(0, 10)
      .map((i) => ({
        name: i.name.split(' ')[0],
        value: i.portfolioValue / 1000, // Convert to thousands
      }));
  }, [investors]);

  const handleAddInvestor = () => {
    form.validateFields().then((values) => {
      console.log('Adding new investor:', values);
      setAddModalVisible(false);
      form.resetFields();
    });
  };

  const handleKycAction = (action: 'approve' | 'reject') => {
    kycForm.validateFields().then((values) => {
      console.log(`${action} KYC for:`, selectedInvestor?.id, values);
      setKycModalVisible(false);
      kycForm.resetFields();
    });
  };

  const openKycModal = (investor: Investor, action: 'approve' | 'reject') => {
    setSelectedInvestor(investor);
    setKycModalVisible(true);
  };

  const openDetailsDrawer = (investor: Investor) => {
    setSelectedInvestor(investor);
    setDetailsDrawerVisible(true);
  };

  const handleExportReport = () => {
    console.log('Exporting investors report...');
  };

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'under_review':
        return 'processing';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum':
        return 'purple';
      case 'Gold':
        return 'gold';
      case 'Silver':
        return 'default';
      case 'Bronze':
        return 'orange';
      default:
        return 'default';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'aggressive':
        return 'red';
      case 'moderate':
        return 'blue';
      case 'conservative':
        return 'green';
      default:
        return 'default';
    }
  };

  const getActionMenu = (record: Investor) => (
    <Menu>
      <Menu.Item key="view" icon={<EyeOutlined />} onClick={() => openDetailsDrawer(record)}>
        View Details
      </Menu.Item>
      <Menu.Item key="edit" icon={<EditOutlined />}>
        Edit Investor
      </Menu.Item>
      <Menu.Item key="history" icon={<HistoryOutlined />} onClick={() => openDetailsDrawer(record)}>
        Activity History
      </Menu.Item>
      {record.kycStatus === 'pending' && (
        <>
          <Menu.Divider />
          <Menu.Item
            key="approve"
            icon={<CheckCircleOutlined />}
            onClick={() => openKycModal(record, 'approve')}
          >
            Approve KYC
          </Menu.Item>
          <Menu.Item
            key="reject"
            icon={<CloseCircleOutlined />}
            danger
            onClick={() => openKycModal(record, 'reject')}
          >
            Reject KYC
          </Menu.Item>
        </>
      )}
    </Menu>
  );

  const columns: ColumnsType<Investor> = [
    {
      title: t('investors.investor'),
      dataIndex: 'name',
      key: 'name',
      width: 250,
      fixed: 'left',
      render: (name: string, record: Investor) => (
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
      title: t('investors.kycStatus'),
      dataIndex: 'kycStatus',
      key: 'kycStatus',
      width: 140,
      render: (status: string) => (
        <Badge
          status={getKycStatusColor(status) as any}
          text={status.replace('_', ' ').toUpperCase()}
        />
      ),
      sorter: (a, b) => a.kycStatus.localeCompare(b.kycStatus),
    },
    {
      title: t('investors.tier'),
      dataIndex: 'tier',
      key: 'tier',
      width: 120,
      render: (tier: string) => <Tag color={getTierColor(tier)}>{tier}</Tag>,
      sorter: (a, b) => a.tier.localeCompare(b.tier),
    },
    {
      title: 'Portfolio Value',
      dataIndex: 'portfolioValue',
      key: 'portfolioValue',
      width: 150,
      align: 'right',
      render: (value: number) => <Text strong>${(value / 1000).toFixed(1)}K</Text>,
      sorter: (a, b) => a.portfolioValue - b.portfolioValue,
    },
    {
      title: 'ROI',
      dataIndex: 'roi',
      key: 'roi',
      width: 120,
      align: 'center',
      render: (roi: number) => (
        <Space>
          {roi > 0 ? (
            <RiseOutlined style={{ color: '#52c41a' }} />
          ) : roi < 0 ? (
            <FallOutlined style={{ color: '#f5222d' }} />
          ) : null}
          <Text style={{ color: roi > 0 ? '#52c41a' : roi < 0 ? '#f5222d' : undefined }}>
            {roi.toFixed(1)}%
          </Text>
        </Space>
      ),
      sorter: (a, b) => a.roi - b.roi,
    },
    {
      title: 'Risk Profile',
      dataIndex: 'riskProfile',
      key: 'riskProfile',
      width: 130,
      render: (risk: string) => (
        <Tag color={getRiskColor(risk)}>{risk.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Documents',
      key: 'documents',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Badge count={record.documentsSubmitted} showZero color="#52c41a" />
          {record.documentsPending > 0 && (
            <Badge count={record.documentsPending} showZero color="#faad14" />
          )}
        </Space>
      ),
    },
    {
      title: 'Accreditation',
      dataIndex: 'accreditationStatus',
      key: 'accreditationStatus',
      width: 130,
      render: (status: string) => (
        <Tag color={status === 'accredited' ? 'green' : status === 'pending' ? 'orange' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: t('investors.joinDate'),
      dataIndex: 'joinDate',
      key: 'joinDate',
      width: 120,
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
      sorter: (a, b) => dayjs(a.joinDate).unix() - dayjs(b.joinDate).unix(),
    },
    {
      title: t('common.actions'),
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

  const kycStatusChartConfig = {
    data: kycStatusData,
    angleField: 'count',
    colorField: 'status',
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      type: 'spider',
      content: '{name}\n{percentage}',
    },
    legend: {
      position: 'bottom' as const,
    },
    color: ['#52c41a', '#faad14', '#1890ff', '#f5222d'],
  };

  const tierDistributionChartConfig = {
    data: tierDistributionData,
    angleField: 'count',
    colorField: 'tier',
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      type: 'spider',
      content: '{name}\n{percentage}',
    },
    legend: {
      position: 'bottom' as const,
    },
    color: ['#722ed1', '#faad14', '#d9d9d9', '#fa8c16'],
  };

  const topInvestorsChartConfig = {
    data: topInvestorsData,
    xField: 'name',
    yField: 'value',
    label: {
      position: 'top' as const,
      formatter: (datum: any) => `$${datum.value.toFixed(0)}K`,
    },
    columnStyle: {
      radius: [8, 8, 0, 0],
      fill: 'l(270) 0:#1890ff 1:#36cfc9',
    },
    xAxis: {
      label: {
        autoRotate: false,
      },
    },
    yAxis: {
      title: {
        text: 'Portfolio Value ($K)',
      },
    },
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
          <Title level={2}>{t('investors.title')}</Title>
          <Text type="secondary">{t('investors.subtitle')}</Text>
        </div>
        <Space>
          <Button icon={<DownloadOutlined />} onClick={handleExportReport}>
            Export Report
          </Button>
          <Button type="primary" icon={<UserAddOutlined />} onClick={() => setAddModalVisible(true)}>
            Add Investor
          </Button>
        </Space>
      </div>

      {/* Stats Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title={t('investors.totalInvestors')}
            value={metrics.total.toString()}
            icon={<TeamOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <StatCard
            title={t('investors.approved')}
            value={metrics.approved.toString()}
            icon={<CheckCircleOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <StatCard
            title={t('investors.pendingKYC')}
            value={`${metrics.pending + metrics.underReview}`}
            icon={<ClockCircleOutlined />}
            color="#faad14"
          />
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Rejected"
              value={metrics.rejected}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <StatCard
            title={t('investors.totalInvested')}
            value={`$${(metrics.totalInvested / 1000000).toFixed(1)}M`}
            icon={<DollarOutlined />}
            color="#722ed1"
          />
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Portfolio Value"
              value={`$${(metrics.totalPortfolioValue / 1000000).toFixed(1)}M`}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Avg ROI"
              value={metrics.avgROI.toFixed(1)}
              suffix="%"
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Under Review"
              value={metrics.underReview}
              prefix={<FileProtectOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title="KYC Status Distribution" bordered={false}>
            <Pie {...kycStatusChartConfig} height={280} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Investor Tier Distribution" bordered={false}>
            <Pie {...tierDistributionChartConfig} height={280} />
          </Card>
        </Col>
        <Col xs={24}>
          <Card title="Top Investors by Portfolio Value" bordered={false}>
            <Column {...topInvestorsChartConfig} height={300} />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: '16px' }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder={t('investors.searchPlaceholder')}
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                style={{ width: '100%' }}
                placeholder="KYC Status"
                value={kycFilter}
                onChange={setKycFilter}
              >
                <Select.Option value="all">All Status</Select.Option>
                <Select.Option value="approved">Approved</Select.Option>
                <Select.Option value="pending">Pending</Select.Option>
                <Select.Option value="under_review">Under Review</Select.Option>
                <Select.Option value="rejected">Rejected</Select.Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                style={{ width: '100%' }}
                placeholder={t('investors.filterByTier')}
                value={tierFilter}
                onChange={setTierFilter}
              >
                <Select.Option value="all">All Tiers</Select.Option>
                <Select.Option value="platinum">Platinum</Select.Option>
                <Select.Option value="gold">Gold</Select.Option>
                <Select.Option value="silver">Silver</Select.Option>
                <Select.Option value="bronze">Bronze</Select.Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={5}>
              <Select
                style={{ width: '100%' }}
                placeholder="Risk Profile"
                value={riskFilter}
                onChange={setRiskFilter}
              >
                <Select.Option value="all">All Profiles</Select.Option>
                <Select.Option value="aggressive">Aggressive</Select.Option>
                <Select.Option value="moderate">Moderate</Select.Option>
                <Select.Option value="conservative">Conservative</Select.Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={5}>
              <RangePicker
                style={{ width: '100%' }}
                value={dateRange}
                onChange={(dates: any) => setDateRange(dates || [null, null])}
              />
            </Col>
          </Row>
        </Space>
      </Card>

      {/* Investors Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredInvestors}
          rowKey="id"
          pagination={{
            pageSize: 15,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} investors`,
            pageSizeOptions: ['10', '15', '20', '50'],
          }}
          scroll={{ x: 1600 }}
        />
      </Card>

      {/* Add Investor Modal */}
      <Modal
        title="Add New Investor"
        open={addModalVisible}
        onOk={handleAddInvestor}
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
            <Input type="email" placeholder="john.doe@example.com" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: 'Please enter phone number' }]}
          >
            <Input placeholder="+1 (555) 123-4567" />
          </Form.Item>

          <Form.Item
            label="Investor Tier"
            name="tier"
            rules={[{ required: true, message: 'Please select tier' }]}
          >
            <Select placeholder="Select tier">
              <Select.Option value="Platinum">Platinum</Select.Option>
              <Select.Option value="Gold">Gold</Select.Option>
              <Select.Option value="Silver">Silver</Select.Option>
              <Select.Option value="Bronze">Bronze</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Initial Investment" name="investedAmount">
            <InputNumber
              style={{ width: '100%' }}
              prefix="$"
              placeholder="0"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Form.Item>

          <Form.Item label="Risk Profile" name="riskProfile" initialValue="moderate">
            <Select>
              <Select.Option value="conservative">Conservative</Select.Option>
              <Select.Option value="moderate">Moderate</Select.Option>
              <Select.Option value="aggressive">Aggressive</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* KYC Action Modal */}
      <Modal
        title={`KYC Review - ${selectedInvestor?.name}`}
        open={kycModalVisible}
        onOk={() => handleKycAction('approve')}
        onCancel={() => {
          setKycModalVisible(false);
          kycForm.resetFields();
        }}
        width={600}
        footer={[
          <Button key="cancel" onClick={() => setKycModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="reject" danger onClick={() => handleKycAction('reject')}>
            Reject
          </Button>,
          <Button key="approve" type="primary" onClick={() => handleKycAction('approve')}>
            Approve
          </Button>,
        ]}
      >
        <Form form={kycForm} layout="vertical" style={{ marginTop: '24px' }}>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Investor ID">{selectedInvestor?.id}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedInvestor?.email}</Descriptions.Item>
            <Descriptions.Item label="Documents Submitted">
              {selectedInvestor?.documentsSubmitted}
            </Descriptions.Item>
            <Descriptions.Item label="Documents Pending">
              {selectedInvestor?.documentsPending}
            </Descriptions.Item>
            <Descriptions.Item label="Submission Date">
              {dayjs(selectedInvestor?.kycSubmissionDate).format('MMMM DD, YYYY')}
            </Descriptions.Item>
          </Descriptions>

          <Form.Item
            label="Review Notes"
            name="notes"
            style={{ marginTop: '16px' }}
            rules={[{ required: true, message: 'Please enter review notes' }]}
          >
            <TextArea rows={4} placeholder="Enter review notes and observations..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Investor Details Drawer */}
      <Drawer
        title={
          <Space>
            <Avatar style={{ backgroundColor: '#1890ff' }}>
              {selectedInvestor?.name.charAt(0).toUpperCase()}
            </Avatar>
            <div>
              <div>{selectedInvestor?.name}</div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Investor Profile & Activity
              </Text>
            </div>
          </Space>
        }
        width={700}
        open={detailsDrawerVisible}
        onClose={() => setDetailsDrawerVisible(false)}
      >
        {selectedInvestor && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Investor ID">{selectedInvestor.id}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedInvestor.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selectedInvestor.phone}</Descriptions.Item>
              <Descriptions.Item label="KYC Status">
                <Badge
                  status={getKycStatusColor(selectedInvestor.kycStatus) as any}
                  text={selectedInvestor.kycStatus.replace('_', ' ').toUpperCase()}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Tier">
                <Tag color={getTierColor(selectedInvestor.tier)}>{selectedInvestor.tier}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Risk Profile">
                <Tag color={getRiskColor(selectedInvestor.riskProfile)}>
                  {selectedInvestor.riskProfile.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Accreditation">
                <Tag
                  color={
                    selectedInvestor.accreditationStatus === 'accredited'
                      ? 'green'
                      : selectedInvestor.accreditationStatus === 'pending'
                      ? 'orange'
                      : 'red'
                  }
                >
                  {selectedInvestor.accreditationStatus.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Join Date">
                {dayjs(selectedInvestor.joinDate).format('MMMM DD, YYYY')}
              </Descriptions.Item>
            </Descriptions>

            <Card title="Investment Overview" size="small">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title="Total Invested"
                    value={selectedInvestor.investedAmount}
                    prefix="$"
                    precision={0}
                    valueStyle={{ fontSize: '18px' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Portfolio Value"
                    value={selectedInvestor.portfolioValue}
                    prefix="$"
                    precision={0}
                    valueStyle={{ fontSize: '18px', color: '#1890ff' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Total Shares"
                    value={selectedInvestor.shares}
                    valueStyle={{ fontSize: '18px' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="ROI"
                    value={selectedInvestor.roi}
                    suffix="%"
                    precision={1}
                    valueStyle={{
                      fontSize: '18px',
                      color: selectedInvestor.roi > 0 ? '#52c41a' : '#f5222d',
                    }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Total Deposits"
                    value={selectedInvestor.totalDeposits}
                    prefix="$"
                    precision={0}
                    valueStyle={{ fontSize: '16px' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Total Withdrawals"
                    value={selectedInvestor.totalWithdrawals}
                    prefix="$"
                    precision={0}
                    valueStyle={{ fontSize: '16px' }}
                  />
                </Col>
              </Row>
            </Card>

            <Card title="KYC Information" size="small">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Submission Date
                  </Text>
                  <div>
                    <Text strong>
                      {dayjs(selectedInvestor.kycSubmissionDate).format('MMM DD, YYYY')}
                    </Text>
                  </div>
                </Col>
                {selectedInvestor.kycApprovalDate && (
                  <Col span={12}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      Approval Date
                    </Text>
                    <div>
                      <Text strong>
                        {dayjs(selectedInvestor.kycApprovalDate).format('MMM DD, YYYY')}
                      </Text>
                    </div>
                  </Col>
                )}
                <Col span={12}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Documents Submitted
                  </Text>
                  <div>
                    <Badge
                      count={selectedInvestor.documentsSubmitted}
                      showZero
                      color="#52c41a"
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Documents Pending
                  </Text>
                  <div>
                    <Badge
                      count={selectedInvestor.documentsPending}
                      showZero
                      color="#faad14"
                    />
                  </div>
                </Col>
              </Row>
            </Card>

            <Card title="Recent Activity" size="small">
              <Timeline
                items={activityLogs.map((log) => ({
                  color:
                    log.type === 'deposit'
                      ? 'green'
                      : log.type === 'withdrawal'
                      ? 'red'
                      : log.type === 'kyc'
                      ? 'blue'
                      : log.type === 'document'
                      ? 'orange'
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
          </Space>
        )}
      </Drawer>
    </div>
  );
}
