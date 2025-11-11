import { useState, useEffect } from 'react';
import { Card, Col, Row, Statistic, Table, Tag, Progress, Spin, message } from 'antd';
import {
  DollarOutlined,
  UserOutlined,
  RiseOutlined,
  TeamOutlined,
  TrophyOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { Line, Column } from '@ant-design/charts';
import { StatCard } from '../../../components/common';
import { useTranslation } from 'react-i18next';
import { fundsService, transactionsService, portfolioService, kycService, supabaseClient } from '../../../services';
import type { Fund, FundPerformance, SystemEvent, KYCStatistics } from '../../../services/types';

interface PlatformStats {
  totalAUM: number;
  totalUsers: number;
  activeInvestors: number;
  totalFunds: number;
  monthlyVolume: number;
  platformGrowth: number;
}

export default function DashboardPage() {
  const { t } = useTranslation();

  // State
  const [loading, setLoading] = useState(true);
  const [platformStats, setPlatformStats] = useState<PlatformStats>({
    totalAUM: 0,
    totalUsers: 0,
    activeInvestors: 0,
    totalFunds: 0,
    monthlyVolume: 0,
    platformGrowth: 0,
  });
  const [topFunds, setTopFunds] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [monthlyVolumeData, setMonthlyVolumeData] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load all funds
      const funds = await fundsService.getAllFunds();
      const activeFunds = funds.filter(f => f.status === 'active');

      // Calculate total AUM
      const totalAUM = activeFunds.reduce((sum, fund) => sum + (fund.total_aum || 0), 0);

      // Get KYC statistics for total users
      const kycStats = await kycService.getKYCStatistics();

      // Get active investors count (users with portfolios)
      const { count: investorCount } = await supabaseClient
        .from('user_portfolios')
        .select('user_id', { count: 'exact', head: true });

      // Get unique investors
      const { data: uniqueInvestors } = await supabaseClient
        .from('user_portfolios')
        .select('user_id');
      const activeInvestors = new Set(uniqueInvestors?.map(p => p.user_id)).size;

      // Get monthly transaction volume (last 30 days)
      const volume = await transactionsService.getTransactionVolume(undefined, 30);

      // Calculate platform growth (mock for now - would need historical data)
      const platformGrowth = 23.5;

      setPlatformStats({
        totalAUM,
        totalUsers: kycStats.total_verifications,
        activeInvestors,
        totalFunds: activeFunds.length,
        monthlyVolume: volume.total_inflows + volume.total_outflows,
        platformGrowth,
      });

      // Load fund performance for top funds
      const fundsWithPerformance = await Promise.all(
        activeFunds.map(async (fund) => {
          try {
            const performance = await fundsService.getFundPerformance(fund.id) as FundPerformance;

            // Calculate performance percentage from NAV history
            const navChange = performance.latest_nav && performance.nav_30d_ago
              ? ((performance.latest_nav - performance.nav_30d_ago) / performance.nav_30d_ago) * 100
              : 0;

            return {
              key: fund.id,
              name: fund.name,
              aum: fund.total_aum || 0,
              nav: fund.current_nav || 0,
              performance: navChange,
              investors: performance.total_investors || 0,
              status: fund.status,
            };
          } catch (error) {
            console.error(`Error loading performance for fund ${fund.id}:`, error);
            return {
              key: fund.id,
              name: fund.name,
              aum: fund.total_aum || 0,
              nav: fund.current_nav || 0,
              performance: 0,
              investors: 0,
              status: fund.status,
            };
          }
        })
      );

      // Sort by AUM and take top 5
      const topFundsList = fundsWithPerformance
        .sort((a, b) => b.aum - a.aum)
        .slice(0, 5);
      setTopFunds(topFundsList);

      // Load recent system events
      const { data: events } = await supabaseClient
        .from('system_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      const activities = events?.map(event => ({
        key: event.id,
        activity: event.description || `${event.event_type}: ${event.action}`,
        time: formatTimeAgo(new Date(event.created_at)),
        type: event.event_category || 'system',
      })) || [];
      setRecentActivities(activities);

      // Generate monthly volume data (last 6 months)
      const volumeByMonth = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleDateString('es-ES', { month: 'short' });

        // Get transactions for this month
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const { data: monthTransactions } = await supabaseClient
          .from('transactions')
          .select('amount')
          .gte('created_at', startOfMonth.toISOString())
          .lte('created_at', endOfMonth.toISOString())
          .in('status', ['completed', 'settled']);

        const totalVolume = monthTransactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

        volumeByMonth.push({
          month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
          volume: totalVolume,
        });
      }
      setMonthlyVolumeData(volumeByMonth);

    } catch (error: any) {
      console.error('Error loading admin dashboard:', error);
      message.error('Failed to load dashboard data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'hace unos segundos';
    if (seconds < 3600) return `hace ${Math.floor(seconds / 60)} minutos`;
    if (seconds < 86400) return `hace ${Math.floor(seconds / 3600)} horas`;
    if (seconds < 604800) return `hace ${Math.floor(seconds / 86400)} días`;
    return date.toLocaleDateString();
  };

  const volumeChartConfig = {
    data: monthlyVolumeData,
    xField: 'month',
    yField: 'volume',
    label: {
      position: 'top' as const,
      formatter: (datum: any) => `$${(datum.volume / 1000000).toFixed(1)}M`,
    },
    meta: {
      volume: {
        alias: 'Volumen',
        formatter: (v: number) => `$${(v / 1000000).toFixed(2)}M`,
      },
    },
  };

  const fundColumns = [
    {
      title: t('adminOwner.funds.fundName'),
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: t('adminOwner.funds.aum'),
      dataIndex: 'aum',
      key: 'aum',
      render: (aum: number) => `$${(aum / 1000000).toFixed(2)}M`,
      sorter: (a: any, b: any) => a.aum - b.aum,
    },
    {
      title: t('adminOwner.funds.nav'),
      dataIndex: 'nav',
      key: 'nav',
      render: (nav: number) => `$${nav.toFixed(2)}`,
    },
    {
      title: t('adminOwner.funds.performance'),
      dataIndex: 'performance',
      key: 'performance',
      render: (perf: number) => (
        <Tag color={perf >= 0 ? 'green' : 'red'}>
          {perf >= 0 ? '+' : ''}{perf.toFixed(1)}%
        </Tag>
      ),
    },
    {
      title: t('adminOwner.funds.investors'),
      dataIndex: 'investors',
      key: 'investors',
    },
    {
      title: t('adminOwner.funds.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'orange'}>
          {status === 'active' ? t('adminOwner.funds.active').toUpperCase() : t('adminOwner.funds.review').toUpperCase()}
        </Tag>
      ),
    },
  ];

  const activityColumns = [
    {
      title: t('adminOwner.activity.activity'),
      dataIndex: 'activity',
      key: 'activity',
    },
    {
      title: t('adminOwner.activity.time'),
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: t('adminOwner.activity.type'),
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag>{type}</Tag>,
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" tip="Loading platform overview..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px', fontFamily: 'var(--font-heading)' }}>
        {t('adminOwner.dashboard.title')}
      </h1>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title={t('adminOwner.dashboard.totalAUM')}
            value={`$${(platformStats.totalAUM / 1000000).toFixed(2)}M`}
            icon={<DollarOutlined />}
            trend={{ value: platformStats.platformGrowth, isPositive: true }}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title={t('adminOwner.dashboard.totalUsers')}
            value={platformStats.totalUsers.toLocaleString()}
            icon={<UserOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title={t('adminOwner.dashboard.activeInvestors')}
            value={platformStats.activeInvestors.toLocaleString()}
            icon={<TeamOutlined />}
            color="#722ed1"
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title={t('adminOwner.dashboard.totalFunds')}
            value={platformStats.totalFunds.toString()}
            icon={<TrophyOutlined />}
            color="#fa8c16"
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title={t('adminOwner.dashboard.monthlyVolume')}
            value={`$${(platformStats.monthlyVolume / 1000000).toFixed(2)}M`}
            icon={<SwapOutlined />}
            trend={{ value: 15.3, isPositive: true }}
            color="#13c2c2"
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title={t('adminOwner.dashboard.platformGrowth')}
              value={platformStats.platformGrowth}
              precision={1}
              valueStyle={{ color: '#3f8600' }}
              prefix={<RiseOutlined />}
              suffix="%"
            />
            <Progress
              percent={platformStats.platformGrowth}
              strokeColor="#52c41a"
              showInfo={false}
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={16}>
          <Card title={t('adminOwner.dashboard.monthlyVolumeTrend')} bordered={false}>
            {monthlyVolumeData.length > 0 ? (
              <Column {...volumeChartConfig} />
            ) : (
              <p>No volume data available</p>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title={t('adminOwner.dashboard.recentActivity')} bordered={false}>
            <Table
              dataSource={recentActivities}
              columns={activityColumns}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* Top Funds Table */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title={t('adminOwner.dashboard.topFunds')} bordered={false}>
            <Table
              dataSource={topFunds}
              columns={fundColumns}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
