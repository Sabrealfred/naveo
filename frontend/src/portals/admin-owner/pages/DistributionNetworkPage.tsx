import { useEffect, useMemo, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Table,
  Tag,
  Typography,
  Space,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Tabs,
  Statistic,
  Progress,
  Badge,
  Alert,
  Timeline,
  Descriptions,
  Switch,
  Divider,
  Tooltip,
  message,
  Spin,
} from 'antd';
import {
  ShareAltOutlined,
  PlusOutlined,
  ApiOutlined,
  TeamOutlined,
  GlobalOutlined,
  LinkOutlined,
  KeyOutlined,
  DollarOutlined,
  RiseOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  BankOutlined,
  SafetyOutlined,
  LineChartOutlined,
  PercentageOutlined,
  UserOutlined,
  FileTextOutlined,
  SettingOutlined,
  TrophyOutlined,
  ThunderboltOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Line, Column, Pie, DualAxes } from '@ant-design/charts';
import type { ColumnsType } from 'antd/es/table';
import { capitalPartnersService, type DistributionPlatform } from '../../../services';
import { distributionPartners as mockDistributionPlatforms } from '../../../mocks/capitalPartners';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface DistributionPartner {
  id: string;
  name: string;
  type: 'broker-dealer' | 'affiliate' | 'api-partner' | 'white-label' | 'exchange' | 'platform';
  status: 'active' | 'inactive' | 'pending' | 'integration';
  region: string;
  volumeMTD: number;
  volumeTotal: number;
  commission: number;
  investors: number;
  avgTicketSize: number;
  conversionRate: number;
  joinDate: string;
  integration: 'live' | 'sandbox' | 'testing' | 'planned';
  channels: string[];
  rating?: string;
}

interface APIKey {
  id: string;
  partner: string;
  key: string;
  environment: 'production' | 'sandbox';
  created: string;
  lastUsed: string;
  requests: number;
  rateLimit: number;
  status: 'active' | 'revoked' | 'expired';
}

interface OnboardingTask {
  id: string;
  partner: string;
  phase: string;
  task: string;
  status: 'completed' | 'in-progress' | 'pending' | 'blocked';
  assignee: string;
  dueDate: string;
}

type DistributionPlatformRow = {
  id: string;
  platform: string;
  region: string;
  coverage: string;
  channels: string[];
  integrationStatus: string;
};

const normalizeSupabasePartners = (records: DistributionPlatform[]): DistributionPlatformRow[] =>
  records.map((item, index) => ({
    id: item.id ?? `distribution-${index}`,
    platform: item.platform ?? 'Unnamed platform',
    region: item.region ?? 'Global',
    coverage: item.coverage ?? 'Coverage details coming soon',
    channels: item.channels ?? [],
    integrationStatus: item.integration_status ?? 'Planned',
  }));

const mockPlatformPartners: DistributionPlatformRow[] = mockDistributionPlatforms.map((partner, index) => ({
  id: `mock-${index}`,
  platform: partner.platform,
  region: partner.region,
  coverage: partner.coverage,
  channels: partner.channels ?? [],
  integrationStatus: partner.integrationStatus,
}));

const DistributionNetworkPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [addPartnerModalVisible, setAddPartnerModalVisible] = useState(false);
  const [apiKeyModalVisible, setApiKeyModalVisible] = useState(false);
  const [onboardingModalVisible, setOnboardingModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [platformPartners, setPlatformPartners] = useState<DistributionPlatformRow[]>([]);
  const [platformLoading, setPlatformLoading] = useState(true);
  const [usingPlatformDemo, setUsingPlatformDemo] = useState(false);

  useEffect(() => {
    const loadDistributionPlatforms = async () => {
      try {
        setPlatformLoading(true);
        const data = await capitalPartnersService.getAllDistributionPlatforms();
        if (data && data.length > 0) {
          setPlatformPartners(normalizeSupabasePartners(data));
          setUsingPlatformDemo(false);
        } else {
          setPlatformPartners(mockPlatformPartners);
          setUsingPlatformDemo(true);
        }
      } catch (error) {
        console.error('Error loading distribution platforms:', error);
        message.error('Failed to load distribution platforms');
        setPlatformPartners(mockPlatformPartners);
        setUsingPlatformDemo(true);
      } finally {
        setPlatformLoading(false);
      }
    };

    loadDistributionPlatforms();
  }, []);

  // Enhanced mock data
const partners: DistributionPartner[] = [
    {
      id: 'dist-001',
      name: 'Securitize',
      type: 'platform',
      status: 'active',
      region: 'Global',
      volumeMTD: 8500000,
      volumeTotal: 125000000,
      commission: 127500,
      investors: 450,
      avgTicketSize: 189000,
      conversionRate: 68,
      joinDate: '2024-01-15',
      integration: 'live',
      channels: ['Primary Issuance', 'Investor Registry', 'Secondary Trading'],
      rating: 'AAA',
    },
    {
      id: 'dist-002',
      name: 'Plume Network',
      type: 'platform',
      status: 'active',
      region: 'Global',
      volumeMTD: 6200000,
      volumeTotal: 89000000,
      commission: 93000,
      investors: 320,
      avgTicketSize: 194000,
      conversionRate: 72,
      joinDate: '2024-02-01',
      integration: 'live',
      channels: ['RWA Tokenization', 'DeFi Integration', 'Compliance'],
      rating: 'AA+',
    },
    {
      id: 'dist-003',
      name: 'Morgan Stanley Wealth Management',
      type: 'broker-dealer',
      status: 'active',
      region: 'North America',
      volumeMTD: 12400000,
      volumeTotal: 185000000,
      commission: 186000,
      investors: 280,
      avgTicketSize: 443000,
      conversionRate: 45,
      joinDate: '2024-01-20',
      integration: 'live',
      channels: ['Private Wealth', 'UHNW', 'Family Office'],
      rating: 'AAA',
    },
    {
      id: 'dist-004',
      name: 'Goldman Sachs Private Wealth',
      type: 'broker-dealer',
      status: 'active',
      region: 'Global',
      volumeMTD: 15800000,
      volumeTotal: 245000000,
      commission: 237000,
      investors: 195,
      avgTicketSize: 810000,
      conversionRate: 52,
      joinDate: '2024-02-10',
      integration: 'live',
      channels: ['Private Banking', 'Investment Management', 'UHNW'],
      rating: 'AAA',
    },
    {
      id: 'dist-005',
      name: 'Apex Clearing',
      type: 'exchange',
      status: 'active',
      region: 'North America',
      volumeMTD: 4500000,
      volumeTotal: 68000000,
      commission: 67500,
      investors: 890,
      avgTicketSize: 76400,
      conversionRate: 38,
      joinDate: '2024-03-01',
      integration: 'live',
      channels: ['Secondary Liquidity', 'Clearing', 'Settlement'],
      rating: 'AA',
    },
    {
      id: 'dist-006',
      name: 'Copper.co',
      type: 'exchange',
      status: 'active',
      region: 'Europe',
      volumeMTD: 3800000,
      volumeTotal: 52000000,
      commission: 57000,
      investors: 420,
      avgTicketSize: 124000,
      conversionRate: 41,
      joinDate: '2024-03-15',
      integration: 'live',
      channels: ['MPC Custody', 'Prime Brokerage', 'OTC'],
      rating: 'AA',
    },
    {
      id: 'dist-007',
      name: 'Carta',
      type: 'platform',
      status: 'active',
      region: 'North America',
      volumeMTD: 5600000,
      volumeTotal: 78000000,
      commission: 84000,
      investors: 650,
      avgTicketSize: 120000,
      conversionRate: 55,
      joinDate: '2024-02-20',
      integration: 'live',
      channels: ['Cap Table Management', 'Fund Admin', 'Investor Portal'],
      rating: 'AA+',
    },
    {
      id: 'dist-008',
      name: 'CryptoWealth Advisors',
      type: 'affiliate',
      status: 'active',
      region: 'North America',
      volumeMTD: 1850000,
      volumeTotal: 24000000,
      commission: 27750,
      investors: 185,
      avgTicketSize: 130000,
      conversionRate: 62,
      joinDate: '2024-04-01',
      integration: 'live',
      channels: ['RIA Network', 'Referrals', 'Advisory'],
      rating: 'A+',
    },
    {
      id: 'dist-009',
      name: 'Digital Asset Partners',
      type: 'affiliate',
      status: 'active',
      region: 'Europe',
      volumeMTD: 2100000,
      volumeTotal: 31000000,
      commission: 31500,
      investors: 220,
      avgTicketSize: 141000,
      conversionRate: 58,
      joinDate: '2024-04-10',
      integration: 'live',
      channels: ['Institutional', 'Family Office', 'Referrals'],
      rating: 'A',
    },
    {
      id: 'dist-010',
      name: 'WealthTech API Solutions',
      type: 'api-partner',
      status: 'active',
      region: 'Global',
      volumeMTD: 3200000,
      volumeTotal: 45000000,
      commission: 48000,
      investors: 1200,
      avgTicketSize: 38000,
      conversionRate: 32,
      joinDate: '2024-03-05',
      integration: 'live',
      channels: ['REST API', 'GraphQL', 'Webhooks'],
      rating: 'AA-',
    },
    {
      id: 'dist-011',
      name: 'AlphaWealth Platform',
      type: 'white-label',
      status: 'active',
      region: 'Asia Pacific',
      volumeMTD: 7200000,
      volumeTotal: 98000000,
      commission: 108000,
      investors: 580,
      avgTicketSize: 169000,
      conversionRate: 47,
      joinDate: '2024-02-25',
      integration: 'live',
      channels: ['White Label Portal', 'Custom Branding', 'API'],
      rating: 'AA',
    },
    {
      id: 'dist-012',
      name: 'NavFund Services',
      type: 'platform',
      status: 'integration',
      region: 'Global',
      volumeMTD: 0,
      volumeTotal: 0,
      commission: 0,
      investors: 0,
      avgTicketSize: 0,
      conversionRate: 0,
      joinDate: '2025-10-01',
      integration: 'sandbox',
      channels: ['Fund Admin', 'NAV Calculation', 'Transfer Agency'],
      rating: 'AA+',
    },
  ];

  const apiKeys: APIKey[] = [
    {
      id: 'key-001',
      partner: 'WealthTech API Solutions',
      key: 'nav_live_sk_***************abc123',
      environment: 'production',
      created: '2024-03-05',
      lastUsed: '2025-11-11 10:45',
      requests: 1254300,
      rateLimit: 10000,
      status: 'active',
    },
    {
      id: 'key-002',
      partner: 'AlphaWealth Platform',
      key: 'nav_live_sk_***************def456',
      environment: 'production',
      created: '2024-02-25',
      lastUsed: '2025-11-11 09:30',
      requests: 892340,
      rateLimit: 5000,
      status: 'active',
    },
    {
      id: 'key-003',
      partner: 'Securitize',
      key: 'nav_live_sk_***************ghi789',
      environment: 'production',
      created: '2024-01-15',
      lastUsed: '2025-11-11 11:20',
      requests: 2345670,
      rateLimit: 15000,
      status: 'active',
    },
    {
      id: 'key-004',
      partner: 'NavFund Services',
      key: 'nav_sandbox_sk_***************test01',
      environment: 'sandbox',
      created: '2025-10-01',
      lastUsed: '2025-11-10 16:00',
      requests: 4523,
      rateLimit: 1000,
      status: 'active',
    },
    {
      id: 'key-005',
      partner: 'WealthTech API Solutions (deprecated)',
      key: 'nav_live_sk_***************old999',
      environment: 'production',
      created: '2024-03-05',
      lastUsed: '2024-08-15',
      requests: 345120,
      rateLimit: 5000,
      status: 'revoked',
    },
  ];

  const onboardingTasks: OnboardingTask[] = [
    {
      id: 'task-001',
      partner: 'NavFund Services',
      phase: 'Phase 1: Documentation',
      task: 'Complete partner agreement and MSA',
      status: 'completed',
      assignee: 'Legal Team',
      dueDate: '2025-10-05',
    },
    {
      id: 'task-002',
      partner: 'NavFund Services',
      phase: 'Phase 1: Documentation',
      task: 'Submit compliance documentation',
      status: 'completed',
      assignee: 'Compliance',
      dueDate: '2025-10-08',
    },
    {
      id: 'task-003',
      partner: 'NavFund Services',
      phase: 'Phase 2: Technical Integration',
      task: 'API credentials provisioning',
      status: 'completed',
      assignee: 'DevOps',
      dueDate: '2025-10-12',
    },
    {
      id: 'task-004',
      partner: 'NavFund Services',
      phase: 'Phase 2: Technical Integration',
      task: 'Sandbox environment setup',
      status: 'completed',
      assignee: 'Engineering',
      dueDate: '2025-10-15',
    },
    {
      id: 'task-005',
      partner: 'NavFund Services',
      phase: 'Phase 2: Technical Integration',
      task: 'API integration testing',
      status: 'in-progress',
      assignee: 'Engineering',
      dueDate: '2025-11-20',
    },
    {
      id: 'task-006',
      partner: 'NavFund Services',
      phase: 'Phase 3: Testing & Validation',
      task: 'UAT testing scenarios',
      status: 'pending',
      assignee: 'QA Team',
      dueDate: '2025-11-25',
    },
    {
      id: 'task-007',
      partner: 'NavFund Services',
      phase: 'Phase 3: Testing & Validation',
      task: 'Security audit',
      status: 'pending',
      assignee: 'Security',
      dueDate: '2025-11-30',
    },
    {
      id: 'task-008',
      partner: 'NavFund Services',
      phase: 'Phase 4: Go-Live',
      task: 'Production deployment approval',
      status: 'pending',
      assignee: 'CTO',
      dueDate: '2025-12-05',
    },
  ];

  // Analytics data
const monthlyVolumeData = [
    { month: '2025-05', volume: 42500000, partners: 8 },
    { month: '2025-06', volume: 48200000, partners: 9 },
    { month: '2025-07', volume: 51800000, partners: 10 },
    { month: '2025-08', volume: 56400000, partners: 10 },
    { month: '2025-09', volume: 62100000, partners: 11 },
    { month: '2025-10', volume: 68500000, partners: 11 },
    { month: '2025-11', volume: 70650000, partners: 11 },
  ];

  const channelDistribution = [
    { channel: 'Broker-Dealers', value: 28200000, percentage: 39.9 },
    { channel: 'Platforms', value: 20300000, percentage: 28.7 },
    { channel: 'White Label', value: 7200000, percentage: 10.2 },
    { channel: 'Exchanges', value: 8300000, percentage: 11.7 },
    { channel: 'Affiliates', value: 3950000, percentage: 5.6 },
    { channel: 'API Partners', value: 3200000, percentage: 4.5 },
  ];

const topPerformers = partners
  .filter((p) => p.status === 'active')
  .sort((a, b) => b.volumeMTD - a.volumeMTD)
  .slice(0, 5);

const totalVolumeMTD = partners.reduce((sum, p) => sum + p.volumeMTD, 0);
const totalCommissionMTD = partners.reduce((sum, p) => sum + p.commission, 0);
const totalInvestors = partners.reduce((sum, p) => sum + p.investors, 0);
const activePartnersCount = partners.filter((p) => p.status === 'active').length;
const avgConversionRate =
  partners.reduce((sum, p) => sum + p.conversionRate, 0) / partners.length;

const platformStatusSummary = useMemo(() => {
  const live = platformPartners.filter((p) => p.integrationStatus === 'Live').length;
  const sandbox = platformPartners.filter((p) => p.integrationStatus === 'Sandbox').length;
  const planned = platformPartners.filter((p) => p.integrationStatus === 'Planned').length;
  const channels = new Set(platformPartners.flatMap((p) => p.channels ?? [])).size;
  return { live, sandbox, planned, channels };
}, [platformPartners]);

const platformChannelInsights = useMemo(() => {
  const counts = new Map<string, number>();
  platformPartners.forEach((partner) => {
    (partner.channels ?? []).forEach((channel) => {
      counts.set(channel, (counts.get(channel) ?? 0) + 1);
    });
  });
  return Array.from(counts.entries())
    .map(([channel, count]) => ({ channel, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}, [platformPartners]);

const getPlatformStatusColor = (status: string) => {
  if (status === 'Live') return 'green';
  if (status === 'Sandbox') return 'orange';
  if (status === 'Planned') return 'blue';
  return 'purple';
};

const platformColumns: ColumnsType<DistributionPlatformRow> = [
  {
    title: 'Plataforma',
    dataIndex: 'platform',
    key: 'platform',
    render: (value, record) => (
      <Space direction="vertical" size={0}>
        <Text strong>{value}</Text>
        <Text type="secondary">{record.region}</Text>
      </Space>
    ),
  },
  {
    title: 'Cobertura',
    dataIndex: 'coverage',
    key: 'coverage',
  },
  {
    title: 'Canales',
    dataIndex: 'channels',
    key: 'channels',
    render: (channels: string[]) => (
      <Space wrap>
        {(channels || []).map((channel) => (
          <Tag key={channel}>{channel}</Tag>
        ))}
      </Space>
    ),
  },
  {
    title: 'Integración',
    dataIndex: 'integrationStatus',
    key: 'integrationStatus',
    render: (status: string) => <Tag color={getPlatformStatusColor(status)}>{status}</Tag>,
  },
];

const partnerColumns: ColumnsType<DistributionPartner> = [
    {
      title: 'Partner',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 250,
      render: (name, record) => (
        <Space direction="vertical" size={0}>
          <Space>
            {record.type === 'broker-dealer' && <BankOutlined style={{ color: '#1890ff' }} />}
            {record.type === 'platform' && <GlobalOutlined style={{ color: '#722ed1' }} />}
            {record.type === 'exchange' && <ThunderboltOutlined style={{ color: '#fa8c16' }} />}
            {record.type === 'affiliate' && <ShareAltOutlined style={{ color: '#52c41a' }} />}
            {record.type === 'api-partner' && <ApiOutlined style={{ color: '#eb2f96' }} />}
            {record.type === 'white-label' && <GlobalOutlined style={{ color: '#13c2c2' }} />}
            <Text strong>{name}</Text>
          </Space>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.region}
          </Text>
          {record.rating && (
            <Tag color="blue" style={{ fontSize: 10 }}>
              Rating: {record.rating}
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      render: (type) => {
        const config = {
          'broker-dealer': { color: 'blue', label: 'Broker/Dealer' },
          platform: { color: 'purple', label: 'Platform' },
          exchange: { color: 'orange', label: 'Exchange' },
          affiliate: { color: 'green', label: 'Affiliate' },
          'api-partner': { color: 'magenta', label: 'API Partner' },
          'white-label': { color: 'cyan', label: 'White Label' },
        };
        return <Tag color={config[type].color}>{config[type].label}</Tag>;
      },
    },
    {
      title: 'Volume (MTD)',
      dataIndex: 'volumeMTD',
      key: 'volumeMTD',
      width: 150,
      render: (vol) => (
        <Text strong style={{ color: '#1890ff' }}>
          ${(vol / 1000000).toFixed(2)}M
        </Text>
      ),
      sorter: (a, b) => a.volumeMTD - b.volumeMTD,
    },
    {
      title: 'Total Volume',
      dataIndex: 'volumeTotal',
      key: 'volumeTotal',
      width: 150,
      render: (vol) => <Text>${(vol / 1000000).toFixed(1)}M</Text>,
      sorter: (a, b) => a.volumeTotal - b.volumeTotal,
    },
    {
      title: 'Commission (MTD)',
      dataIndex: 'commission',
      key: 'commission',
      width: 150,
      render: (comm) => (
        <Text strong style={{ color: '#52c41a' }}>
          ${comm.toLocaleString()}
        </Text>
      ),
      sorter: (a, b) => a.commission - b.commission,
    },
    {
      title: 'Investors',
      dataIndex: 'investors',
      key: 'investors',
      width: 100,
      align: 'center',
      sorter: (a, b) => a.investors - b.investors,
    },
    {
      title: 'Avg Ticket',
      dataIndex: 'avgTicketSize',
      key: 'avgTicketSize',
      width: 120,
      render: (size) => (size > 0 ? `$${(size / 1000).toFixed(0)}K` : '-'),
      sorter: (a, b) => a.avgTicketSize - b.avgTicketSize,
    },
    {
      title: 'Conversion',
      dataIndex: 'conversionRate',
      key: 'conversionRate',
      width: 120,
      render: (rate) =>
        rate > 0 ? (
          <Space>
            <Progress
              type="circle"
              percent={rate}
              width={40}
              strokeColor={rate > 60 ? '#52c41a' : rate > 40 ? '#faad14' : '#ff4d4f'}
            />
          </Space>
        ) : (
          '-'
        ),
      sorter: (a, b) => a.conversionRate - b.conversionRate,
    },
    {
      title: 'Integration',
      dataIndex: 'integration',
      key: 'integration',
      width: 120,
      render: (integration) => {
        const config = {
          live: { color: 'success', icon: <CheckCircleOutlined />, label: 'Live' },
          sandbox: { color: 'warning', icon: <ClockCircleOutlined />, label: 'Sandbox' },
          testing: { color: 'processing', icon: <SyncOutlined spin />, label: 'Testing' },
          planned: { color: 'default', icon: <ClockCircleOutlined />, label: 'Planned' },
        };
        const cfg = config[integration];
        return (
          <Tag icon={cfg.icon} color={cfg.color}>
            {cfg.label}
          </Tag>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const colors = {
          active: 'success',
          inactive: 'error',
          pending: 'warning',
          integration: 'processing',
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (record) => (
        <Space size="small">
          <Button size="small" type="link">
            Details
          </Button>
          <Button size="small" type="link">
            Portal
          </Button>
        </Space>
      ),
    },
];

const platformStatusOptions = {
  Live: 'green',
  Sandbox: 'orange',
  Planned: 'blue',
};


  const apiColumns: ColumnsType<APIKey> = [
    {
      title: 'Partner',
      dataIndex: 'partner',
      key: 'partner',
      render: (partner) => (
        <Space>
          <ApiOutlined style={{ color: '#1890ff' }} />
          <Text>{partner}</Text>
        </Space>
      ),
    },
    {
      title: 'API Key',
      dataIndex: 'key',
      key: 'key',
      render: (key) => <code style={{ fontSize: 11, color: '#8c8c8c' }}>{key}</code>,
    },
    {
      title: 'Environment',
      dataIndex: 'environment',
      key: 'environment',
      render: (env) => (
        <Tag color={env === 'production' ? 'red' : 'orange'}>
          {env === 'production' ? 'PRODUCTION' : 'SANDBOX'}
        </Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'created',
      key: 'created',
    },
    {
      title: 'Last Used',
      dataIndex: 'lastUsed',
      key: 'lastUsed',
      render: (date) => <Text style={{ fontSize: 12 }}>{date}</Text>,
    },
    {
      title: 'Requests',
      dataIndex: 'requests',
      key: 'requests',
      render: (count) => (
        <Tooltip title={`${count.toLocaleString()} total requests`}>
          <Text>{(count / 1000).toFixed(0)}K</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Rate Limit',
      dataIndex: 'rateLimit',
      key: 'rateLimit',
      render: (limit) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {limit.toLocaleString()}/min
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = { active: 'green', revoked: 'red', expired: 'orange' };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record) => (
        <Space size="small">
          {record.status === 'active' && (
            <Button size="small" danger>
              Revoke
            </Button>
          )}
          <Button size="small" type="link">
            Logs
          </Button>
        </Space>
      ),
    },
  ];

  const onboardingColumns: ColumnsType<OnboardingTask> = [
    {
      title: 'Phase',
      dataIndex: 'phase',
      key: 'phase',
      render: (phase) => <Text strong>{phase}</Text>,
    },
    {
      title: 'Task',
      dataIndex: 'task',
      key: 'task',
    },
    {
      title: 'Assignee',
      dataIndex: 'assignee',
      key: 'assignee',
      render: (assignee) => (
        <Space>
          <UserOutlined style={{ fontSize: 12, color: '#8c8c8c' }} />
          <Text>{assignee}</Text>
        </Space>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config = {
          completed: { color: 'success', icon: <CheckCircleOutlined /> },
          'in-progress': { color: 'processing', icon: <SyncOutlined spin /> },
          pending: { color: 'default', icon: <ClockCircleOutlined /> },
          blocked: { color: 'error', icon: <WarningOutlined /> },
        };
        const cfg = config[status];
        return (
          <Tag icon={cfg.icon} color={cfg.color}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
  ];

  const volumeChartConfig = {
    data: monthlyVolumeData,
    xField: 'month',
    yField: 'volume',
    smooth: true,
    color: '#1890ff',
    point: {
      size: 5,
      shape: 'circle',
    },
    label: {
      style: {
        fill: '#1890ff',
      },
    },
    yAxis: {
      label: {
        formatter: (v: string) => `$${(parseFloat(v) / 1000000).toFixed(0)}M`,
      },
    },
  };

  const channelPieConfig = {
    data: channelDistribution,
    angleField: 'value',
    colorField: 'channel',
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      type: 'outer',
      content: '{name}\n{percentage}%',
    },
    interactions: [{ type: 'element-active' }],
  };

  const handleAddPartner = () => {
    form.validateFields().then((values) => {
      console.log('Add partner:', values);
      message.success('Partner added successfully');
      setAddPartnerModalVisible(false);
      form.resetFields();
    });
  };

  const handleGenerateAPIKey = () => {
    message.success('API key generated successfully. Make sure to copy it now!');
    setApiKeyModalVisible(false);
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Space direction="vertical" size={0}>
          <Title level={2}>
            <ShareAltOutlined /> Distribution Network & Channels
          </Title>
      <Paragraph type="secondary">
        Manage distribution partners, integrations, and channel performance across broker-dealers,
        platforms, exchanges, and affiliates
      </Paragraph>
    </Space>
  </div>

      {usingPlatformDemo && (
        <Alert
          type="info"
          showIcon
          message="Showing demo distribution data"
          description="We could not load the live distribution platforms, so demo partners are displayed to keep the analytics populated."
          style={{ marginBottom: 16 }}
        />
      )}

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Plataformas live"
              value={platformStatusSummary.live}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Integraciones sandbox"
              value={platformStatusSummary.sandbox}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Integraciones planificadas"
              value={platformStatusSummary.planned}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#2f54eb' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Canales cubiertos"
              value={platformStatusSummary.channels}
              prefix={<GlobalOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <LinkOutlined />
                <span>Live Distribution Platforms</span>
              </Space>
            }
          >
            {platformLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
                <Spin />
              </div>
            ) : (
              <Table
                dataSource={platformPartners}
                columns={platformColumns}
                pagination={{ pageSize: 5 }}
                rowKey="id"
              />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Top canales" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              {platformChannelInsights.map((item) => (
                <div key={item.channel} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>{item.channel}</Text>
                  <Tag color="blue">{item.count} partners</Tag>
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Volume (MTD)"
              value={totalVolumeMTD / 1000000}
              prefix={<RiseOutlined />}
              suffix="M"
              precision={2}
              valueStyle={{ color: '#1890ff' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Across {activePartnersCount} active partners
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Commission (MTD)"
              value={totalCommissionMTD}
              prefix={<DollarOutlined />}
              precision={0}
              valueStyle={{ color: '#52c41a' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Avg margin: {((totalCommissionMTD / totalVolumeMTD) * 100).toFixed(2)}%
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Investors"
              value={totalInvestors}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Avg conversion: {avgConversionRate.toFixed(1)}%
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Partners"
              value={activePartnersCount}
              suffix={`/ ${partners.length}`}
              prefix={<GlobalOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {partners.filter((p) => p.integration === 'live').length} fully integrated
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Main Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        tabBarExtraContent={
          <Space>
            <Button icon={<ApiOutlined />} onClick={() => setApiKeyModalVisible(true)}>
              Generate API Key
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddPartnerModalVisible(true)}>
              Add Partner
            </Button>
          </Space>
        }
        items={[
          {
            key: 'overview',
            label: (
              <span>
                <LineChartOutlined />
                Overview & Analytics
              </span>
            ),
            children: (
              <>
                <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                  <Col span={14}>
                    <Card title="Monthly Distribution Volume" size="small">
                      <Line {...volumeChartConfig} height={280} />
                    </Card>
                  </Col>
                  <Col span={10}>
                    <Card title="Channel Distribution" size="small">
                      <Pie {...channelPieConfig} height={280} />
                    </Card>
                  </Col>
                </Row>

                <Card
                  title={
                    <Space>
                      <TrophyOutlined style={{ color: '#faad14' }} />
                      <span>Top Performing Partners (MTD)</span>
                    </Space>
                  }
                  style={{ marginBottom: 16 }}
                >
                  <Table
                    dataSource={topPerformers}
                    columns={partnerColumns.filter((col) =>
                      ['name', 'type', 'volumeMTD', 'commission', 'investors', 'conversionRate'].includes(
                        col.key as string
                      )
                    )}
                    pagination={false}
                    rowKey="id"
                  />
                </Card>

                <Alert
                  message="Integration Coverage Overview"
                  description={
                    <div style={{ marginTop: 8 }}>
                      <Paragraph>
                        <strong>Primary Issuance & Registry:</strong> Securitize and Plume Network provide
                        tokenization, investor registry, and compliance automation. Integrated with product
                        structuring module.
                      </Paragraph>
                      <Paragraph>
                        <strong>Secondary Liquidity:</strong> Apex Clearing and Copper.co offer MPC custody,
                        OTC trading, and secondary market liquidity. Connected to trading platform.
                      </Paragraph>
                      <Paragraph>
                        <strong>Distribution Channels:</strong> Morgan Stanley, Goldman Sachs, and broker
                        networks provide access to UHNW clients, RIAs, and family offices via REST/GraphQL
                        APIs.
                      </Paragraph>
                      <Paragraph>
                        <strong>Fund Administration:</strong> NavFund Services (in integration) will handle NAV
                        calculation, transfer agency, and investor reporting. Links to admin-client portal.
                      </Paragraph>
                    </div>
                  }
                  type="info"
                  showIcon
                  icon={<GlobalOutlined />}
                />
              </>
            ),
          },
          {
            key: 'partners',
            label: (
              <span>
                <TeamOutlined />
                All Partners
                <Badge count={partners.length} offset={[10, 0]} style={{ backgroundColor: '#1890ff' }} />
              </span>
            ),
            children: (
              <Card>
                <Table
                  columns={partnerColumns}
                  dataSource={partners}
                  rowKey="id"
                  pagination={{ pageSize: 20 }}
                  scroll={{ x: 1800 }}
                />
              </Card>
            ),
          },
          {
            key: 'api-keys',
            label: (
              <span>
                <KeyOutlined />
                API Keys
                <Badge
                  count={apiKeys.filter((k) => k.status === 'active').length}
                  offset={[10, 0]}
                  style={{ backgroundColor: '#52c41a' }}
                />
              </span>
            ),
            children: (
              <>
                <Alert
                  message="API Key Management"
                  description="Manage API keys for partners with programmatic access. Production keys should be rotated regularly and revoked immediately if compromised."
                  type="warning"
                  showIcon
                  icon={<SafetyOutlined />}
                  style={{ marginBottom: 16 }}
                />
                <Card>
                  <Table columns={apiColumns} dataSource={apiKeys} rowKey="id" pagination={false} />
                </Card>
              </>
            ),
          },
          {
            key: 'onboarding',
            label: (
              <span>
                <ClockCircleOutlined />
                Onboarding Pipeline
              </span>
            ),
            children: (
              <>
                <Card
                  title={
                    <Space>
                      <SyncOutlined spin />
                      <span>NavFund Services - Integration in Progress</span>
                      <Tag color="processing">Phase 2/4</Tag>
                    </Space>
                  }
                  extra={
                    <Button type="primary" onClick={() => setOnboardingModalVisible(true)}>
                      View Timeline
                    </Button>
                  }
                  style={{ marginBottom: 16 }}
                >
                  <Row gutter={[16, 16]}>
                    <Col span={6}>
                      <Card size="small">
                        <Statistic
                          title="Phase 1: Documentation"
                          value={100}
                          suffix="%"
                          valueStyle={{ color: '#52c41a' }}
                        />
                        <Progress percent={100} showInfo={false} strokeColor="#52c41a" />
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card size="small">
                        <Statistic
                          title="Phase 2: Integration"
                          value={60}
                          suffix="%"
                          valueStyle={{ color: '#1890ff' }}
                        />
                        <Progress percent={60} showInfo={false} status="active" />
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card size="small">
                        <Statistic title="Phase 3: Testing" value={0} suffix="%" />
                        <Progress percent={0} showInfo={false} />
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card size="small">
                        <Statistic title="Phase 4: Go-Live" value={0} suffix="%" />
                        <Progress percent={0} showInfo={false} />
                      </Card>
                    </Col>
                  </Row>
                </Card>

                <Card title="Onboarding Tasks">
                  <Table
                    columns={onboardingColumns}
                    dataSource={onboardingTasks}
                    rowKey="id"
                    pagination={false}
                  />
                </Card>
              </>
            ),
          },
          {
            key: 'commission',
            label: (
              <span>
                <PercentageOutlined />
                Commission Structure
              </span>
            ),
            children: (
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card title="Commission Rates by Partner Type">
                  <Descriptions column={2} bordered>
                    <Descriptions.Item label="Broker/Dealer">
                      <Text strong>1.5%</Text> of transaction volume
                    </Descriptions.Item>
                    <Descriptions.Item label="Minimum Fee">$25,000/month</Descriptions.Item>
                    <Descriptions.Item label="Platform Partners">
                      <Text strong>1.5-2.0%</Text> based on services
                    </Descriptions.Item>
                    <Descriptions.Item label="Revenue Share">Yes, tiered structure</Descriptions.Item>
                    <Descriptions.Item label="Exchange Partners">
                      <Text strong>1.5%</Text> of volume
                    </Descriptions.Item>
                    <Descriptions.Item label="Clearing Fees">Included</Descriptions.Item>
                    <Descriptions.Item label="Affiliate Program">
                      <Text strong>1.5%</Text> lifetime commission
                    </Descriptions.Item>
                    <Descriptions.Item label="Referral Tracking">Yes, automated</Descriptions.Item>
                    <Descriptions.Item label="API Partner">
                      <Text strong>1.0%</Text> per transaction
                    </Descriptions.Item>
                    <Descriptions.Item label="Rate Limiting">Tiered by volume</Descriptions.Item>
                    <Descriptions.Item label="White Label">
                      <Text strong>1.5%</Text> + platform fee
                    </Descriptions.Item>
                    <Descriptions.Item label="Custom Branding">$10K setup + $2K/month</Descriptions.Item>
                  </Descriptions>
                </Card>

                <Card title="Volume-Based Performance Bonuses">
                  <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <div>
                      <Row justify="space-between" style={{ marginBottom: 8 }}>
                        <Col>
                          <Text strong>Tier 1: $0 - $5M (Monthly)</Text>
                        </Col>
                        <Col>
                          <Tag color="blue">Standard Rate</Tag>
                        </Col>
                      </Row>
                      <Progress percent={100} showInfo={false} />
                    </div>
                    <div>
                      <Row justify="space-between" style={{ marginBottom: 8 }}>
                        <Col>
                          <Text strong>Tier 2: $5M - $20M (Monthly)</Text>
                        </Col>
                        <Col>
                          <Tag color="green">+0.25% Bonus</Tag>
                        </Col>
                      </Row>
                      <Progress percent={75} showInfo={false} status="active" strokeColor="#52c41a" />
                    </div>
                    <div>
                      <Row justify="space-between" style={{ marginBottom: 8 }}>
                        <Col>
                          <Text strong>Tier 3: $20M - $50M (Monthly)</Text>
                        </Col>
                        <Col>
                          <Tag color="gold">+0.5% Bonus</Tag>
                        </Col>
                      </Row>
                      <Progress percent={40} showInfo={false} status="active" strokeColor="#faad14" />
                    </div>
                    <div>
                      <Row justify="space-between" style={{ marginBottom: 8 }}>
                        <Col>
                          <Text strong>Tier 4: $50M+ (Monthly)</Text>
                        </Col>
                        <Col>
                          <Tag color="red">+1.0% Bonus + Custom Incentives</Tag>
                        </Col>
                      </Row>
                      <Progress percent={0} showInfo={false} />
                    </div>
                  </Space>
                </Card>

                <Card title="Special Programs">
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div>
                      <Text strong>
                        <TrophyOutlined style={{ color: '#faad14', marginRight: 8 }} />
                        Top Producer Program
                      </Text>
                      <Paragraph type="secondary">
                        Top 3 partners by volume each quarter receive an additional 0.5% bonus on all
                        transactions plus priority support and co-marketing opportunities.
                      </Paragraph>
                    </div>
                    <Divider style={{ margin: '8px 0' }} />
                    <div>
                      <Text strong>
                        <UserOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                        New Partner Incentive
                      </Text>
                      <Paragraph type="secondary">
                        First 6 months: Additional 0.5% commission bonus to accelerate partnership growth and
                        integration.
                      </Paragraph>
                    </div>
                    <Divider style={{ margin: '8px 0' }} />
                    <div>
                      <Text strong>
                        <RiseOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                        Growth Acceleration Bonus
                      </Text>
                      <Paragraph type="secondary">
                        Partners who achieve 50%+ growth QoQ receive a one-time bonus of $50K plus extended
                        performance incentives.
                      </Paragraph>
                    </div>
                  </Space>
                </Card>
              </Space>
            ),
          },
          {
            key: 'settings',
            label: (
              <span>
                <SettingOutlined />
                Settings
              </span>
            ),
            children: (
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card title="Partner Portal Configuration">
                  <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Text strong>Enable Partner Portal</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Allow partners to access dedicated portal for reporting and analytics
                        </Text>
                      </Col>
                      <Col>
                        <Switch defaultChecked />
                      </Col>
                    </Row>
                    <Divider style={{ margin: 0 }} />
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Text strong>Self-Service Registration</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Allow new partners to apply through self-service workflow
                        </Text>
                      </Col>
                      <Col>
                        <Switch />
                      </Col>
                    </Row>
                    <Divider style={{ margin: 0 }} />
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Text strong>Require Manual Approval</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          All new partners must be approved by admin before activation
                        </Text>
                      </Col>
                      <Col>
                        <Switch defaultChecked />
                      </Col>
                    </Row>
                    <Divider style={{ margin: 0 }} />
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Text strong>Real-Time Commission Display</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Show real-time commission earnings in partner portal
                        </Text>
                      </Col>
                      <Col>
                        <Switch defaultChecked />
                      </Col>
                    </Row>
                    <Divider style={{ margin: 0 }} />
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Text strong>Automated Monthly Reporting</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Send automated performance reports to partners monthly
                        </Text>
                      </Col>
                      <Col>
                        <Switch defaultChecked />
                      </Col>
                    </Row>
                  </Space>
                </Card>

                <Card title="White Label Configuration">
                  <Form layout="vertical">
                    <Form.Item label="Custom Domain Support">
                      <Switch defaultChecked />
                      <Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 0 }}>
                        Allow white-label partners to use custom domains (e.g., invest.partnername.com)
                      </Paragraph>
                    </Form.Item>
                    <Form.Item label="Branding Customization Level">
                      <Select defaultValue="full" style={{ width: 300 }}>
                        <Option value="none">None - Standard Naveo Branding</Option>
                        <Option value="partial">Partial - Logo and Colors Only</Option>
                        <Option value="full">Full - Complete White Label</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item label="API Rate Limit (requests/minute)">
                      <Input type="number" defaultValue={10000} style={{ width: 200 }} suffix="req/min" />
                      <Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 0 }}>
                        Default rate limit for API partners. Can be customized per partner.
                      </Paragraph>
                    </Form.Item>
                    <Form.Item label="Webhook Configuration">
                      <Switch defaultChecked />
                      <Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 0 }}>
                        Enable webhook notifications for partner events (new investor, transaction, etc.)
                      </Paragraph>
                    </Form.Item>
                  </Form>
                </Card>

                <Card title="Compliance & Security">
                  <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Text strong>Require KYC/AML Documentation</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          All partners must provide compliance documentation
                        </Text>
                      </Col>
                      <Col>
                        <Switch defaultChecked disabled />
                      </Col>
                    </Row>
                    <Divider style={{ margin: 0 }} />
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Text strong>Annual Compliance Review</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Require annual compliance review for all active partners
                        </Text>
                      </Col>
                      <Col>
                        <Switch defaultChecked />
                      </Col>
                    </Row>
                    <Divider style={{ margin: 0 }} />
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Text strong>2FA for Partner Portal</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Require two-factor authentication for portal access
                        </Text>
                      </Col>
                      <Col>
                        <Switch defaultChecked />
                      </Col>
                    </Row>
                  </Space>
                </Card>
              </Space>
            ),
          },
        ]}
      />

      {/* Add Partner Modal */}
      <Modal
        title={
          <Space>
            <PlusOutlined />
            <span>Add Distribution Partner</span>
          </Space>
        }
        open={addPartnerModalVisible}
        onCancel={() => {
          setAddPartnerModalVisible(false);
          form.resetFields();
        }}
        onOk={handleAddPartner}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Partner Name" rules={[{ required: true }]}>
                <Input placeholder="e.g., Morgan Stanley Wealth Management" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="type" label="Partner Type" rules={[{ required: true }]}>
                <Select placeholder="Select partner type">
                  <Option value="broker-dealer">Broker/Dealer</Option>
                  <Option value="platform">Platform</Option>
                  <Option value="exchange">Exchange</Option>
                  <Option value="affiliate">Affiliate</Option>
                  <Option value="api-partner">API Partner</Option>
                  <Option value="white-label">White Label</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="region" label="Primary Region" rules={[{ required: true }]}>
                <Select placeholder="Select region">
                  <Option value="North America">North America</Option>
                  <Option value="Europe">Europe</Option>
                  <Option value="Asia Pacific">Asia Pacific</Option>
                  <Option value="Latin America">Latin America</Option>
                  <Option value="Middle East">Middle East</Option>
                  <Option value="Global">Global</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="commissionRate" label="Commission Rate (%)" rules={[{ required: true }]}>
                <Input type="number" step="0.1" placeholder="1.5" suffix="%" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="contactName" label="Primary Contact" rules={[{ required: true }]}>
                <Input placeholder="Full name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contactEmail"
                label="Contact Email"
                rules={[{ required: true, type: 'email' }]}
              >
                <Input placeholder="email@partner.com" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="channels" label="Distribution Channels" rules={[{ required: true }]}>
            <Select mode="multiple" placeholder="Select channels">
              <Option value="Private Wealth">Private Wealth</Option>
              <Option value="UHNW">UHNW</Option>
              <Option value="Family Office">Family Office</Option>
              <Option value="RIA Network">RIA Network</Option>
              <Option value="Institutional">Institutional</Option>
              <Option value="Retail">Retail</Option>
              <Option value="API">API</Option>
            </Select>
          </Form.Item>

          <Form.Item name="notes" label="Notes">
            <Input.TextArea placeholder="Additional information, special terms, etc." rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Generate API Key Modal */}
      <Modal
        title={
          <Space>
            <KeyOutlined />
            <span>Generate API Key</span>
          </Space>
        }
        open={apiKeyModalVisible}
        onCancel={() => setApiKeyModalVisible(false)}
        onOk={handleGenerateAPIKey}
        width={600}
      >
        <Alert
          message="Security Notice"
          description="API keys provide full access to partner functionality. Store them securely and never share them publicly. Production keys should be rotated every 90 days."
          type="warning"
          showIcon
          icon={<SafetyOutlined />}
          style={{ marginBottom: 16 }}
        />
        <Form layout="vertical">
          <Form.Item label="Partner" required>
            <Select placeholder="Select partner">
              {partners
                .filter((p) => ['api-partner', 'white-label', 'platform'].includes(p.type))
                .map((p) => (
                  <Option key={p.id} value={p.id}>
                    {p.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item label="Environment" required>
            <Select placeholder="Select environment" defaultValue="sandbox">
              <Option value="sandbox">Sandbox - For testing</Option>
              <Option value="production">Production - Live environment</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Key Name">
            <Input placeholder="e.g., Production API Key v2" />
          </Form.Item>

          <Form.Item label="Permissions" required>
            <Select mode="multiple" placeholder="Select permissions">
              <Option value="read">Read Access - View data only</Option>
              <Option value="trade">Trade Execution - Place orders</Option>
              <Option value="investor">Investor Management - Manage investors</Option>
              <Option value="reporting">Reporting - Generate reports</Option>
              <Option value="webhooks">Webhooks - Event notifications</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Rate Limit (requests/minute)">
            <Input type="number" defaultValue={10000} suffix="req/min" />
          </Form.Item>

          <Form.Item label="Expiration">
            <Select defaultValue="never">
              <Option value="30">30 days</Option>
              <Option value="90">90 days</Option>
              <Option value="180">180 days</Option>
              <Option value="365">1 year</Option>
              <Option value="never">Never (not recommended for production)</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Onboarding Timeline Modal */}
      <Modal
        title={
          <Space>
            <ClockCircleOutlined />
            <span>Partner Onboarding Timeline - NavFund Services</span>
          </Space>
        }
        open={onboardingModalVisible}
        onCancel={() => setOnboardingModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setOnboardingModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        <Timeline
          items={[
            {
              color: 'green',
              dot: <CheckCircleOutlined />,
              children: (
                <div>
                  <Text strong>Phase 1: Documentation & Legal (Week 1-2)</Text>
                  <div style={{ marginTop: 8 }}>
                    <Tag color="green">COMPLETED</Tag>
                  </div>
                  <ul style={{ marginTop: 8 }}>
                    <li>Master Services Agreement signed</li>
                    <li>Data Processing Agreement executed</li>
                    <li>Compliance documentation submitted</li>
                    <li>Insurance certificates verified</li>
                  </ul>
                </div>
              ),
            },
            {
              color: 'blue',
              dot: <SyncOutlined spin />,
              children: (
                <div>
                  <Text strong>Phase 2: Technical Integration (Week 3-4)</Text>
                  <div style={{ marginTop: 8 }}>
                    <Tag color="processing">IN PROGRESS - 60%</Tag>
                  </div>
                  <ul style={{ marginTop: 8 }}>
                    <li style={{ color: '#52c41a' }}>✓ Sandbox environment provisioned</li>
                    <li style={{ color: '#52c41a' }}>✓ API credentials generated</li>
                    <li style={{ color: '#1890ff' }}>⚙ API integration testing (in progress)</li>
                    <li style={{ color: '#8c8c8c' }}>○ Webhook configuration pending</li>
                  </ul>
                </div>
              ),
            },
            {
              color: 'gray',
              children: (
                <div>
                  <Text strong>Phase 3: Testing & Validation (Week 5-6)</Text>
                  <div style={{ marginTop: 8 }}>
                    <Tag>PENDING</Tag>
                  </div>
                  <ul style={{ marginTop: 8 }}>
                    <li>UAT test scenarios execution</li>
                    <li>Data migration testing</li>
                    <li>Security audit and penetration testing</li>
                    <li>Performance testing</li>
                  </ul>
                </div>
              ),
            },
            {
              color: 'gray',
              children: (
                <div>
                  <Text strong>Phase 4: Go-Live Preparation (Week 7-8)</Text>
                  <div style={{ marginTop: 8 }}>
                    <Tag>PENDING</Tag>
                  </div>
                  <ul style={{ marginTop: 8 }}>
                    <li>Production credentials issuance</li>
                    <li>Go-live approval from CTO</li>
                    <li>Production deployment</li>
                    <li>Post-launch monitoring (30 days)</li>
                  </ul>
                </div>
              ),
            },
          ]}
        />
        <Divider />
        <Alert
          message="Next Milestone"
          description="Complete API integration testing by November 20, 2025. QA team will begin UAT preparation immediately after."
          type="info"
          showIcon
        />
      </Modal>
    </div>
  );
};

export default DistributionNetworkPage;
