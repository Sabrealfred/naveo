import { useMemo, useState, useEffect } from 'react';
import { Card, Col, Row, Tabs, Tag, Table, Statistic, Space, Typography, Input, Segmented, Progress, Button, Badge, Divider, Alert, Timeline, Spin, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { capitalPartnersService, type StrategicPartner } from '../../../services';
import { capitalPartners as mockCapitalPartners } from '../../../mocks/capitalPartners';
import { DollarOutlined, RiseOutlined, BankOutlined, CheckCircleOutlined, ClockCircleOutlined, TeamOutlined, GlobalOutlined, LineChartOutlined, FileTextOutlined, PhoneOutlined, MailOutlined, SafetyOutlined } from '@ant-design/icons';
import { Pie, Column } from '@ant-design/charts';

const { Title, Text } = Typography;

const mockStrategicPartners: StrategicPartner[] = mockCapitalPartners.map((partner, index) => ({
  id: `mock-partner-${index}`,
  name: partner.name,
  type: partner.type,
  region: partner.region,
  ticket_size: partner.ticketSize,
  ltv_range: partner.ltvRange ?? null,
  focus_assets: partner.focusAssets,
  status: partner.status,
  notes: partner.notes,
  primary_contact_name: null,
  primary_contact_email: null,
  primary_contact_phone: null,
  website_url: null,
  api_endpoint: null,
  api_key_encrypted: null,
  webhook_url: null,
  integration_status: partner.status === 'Active' ? 'Live' : partner.status === 'Negotiation' ? 'Testing' : 'Planned',
  last_sync_at: null,
  hubspot_deal_id: null,
  notion_page_id: null,
  metadata: null,
  created_at: '',
  updated_at: '',
  created_by: null,
}));

const CapitalPartnersPage = () => {
  const [typeFilter, setTypeFilter] = useState<'all' | 'lender' | 'liquidity' | 'leverage'>('all');
  const [search, setSearch] = useState('');
  const [partners, setPartners] = useState<StrategicPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingDemoData, setUsingDemoData] = useState(false);

  useEffect(() => {
    loadCapitalPartners();
  }, []);

  const loadCapitalPartners = async () => {
    try {
      setLoading(true);
      const data = await capitalPartnersService.getAllStrategicPartners();
      if (data && data.length > 0) {
        setPartners(data);
        setUsingDemoData(false);
      } else {
        setPartners(mockStrategicPartners);
        setUsingDemoData(true);
      }
    } catch (error) {
      console.error('Error loading capital partners:', error);
      message.error('Failed to load capital partners');
      setPartners(mockStrategicPartners);
      setUsingDemoData(true);
    } finally {
      setLoading(false);
    }
  };

  const filteredPartners = useMemo(() => {
    return partners.filter((partner) => {
      const matchesType = typeFilter === 'all' || partner.type === typeFilter;
      const matchesSearch =
        partner.name.toLowerCase().includes(search.toLowerCase()) ||
        partner.region.toLowerCase().includes(search.toLowerCase()) ||
        (partner.focus_assets || []).some((asset) => asset.toLowerCase().includes(search.toLowerCase()));
      return matchesType && matchesSearch;
    });
  }, [typeFilter, search, partners]);

  const columns: ColumnsType<StrategicPartner> = [
    {
      title: 'Partner',
      dataIndex: 'name',
      render: (value, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{value}</Text>
          <Text type="secondary">{record.region}</Text>
        </Space>
      ),
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      render: (value) => value.charAt(0).toUpperCase() + value.slice(1),
    },
    {
      title: 'Ticket Size',
      dataIndex: 'ticket_size',
    },
    {
      title: 'LTV Range',
      dataIndex: 'ltv_range',
      render: (value: string | null) => value || 'N/A',
    },
    {
      title: 'Enfoque',
      dataIndex: 'focus_assets',
      render: (focus: string[] | null) => (
        <Space wrap>
          {(focus || []).map((item) => (
            <Tag key={item}>{item}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      render: (status) => {
        const color =
          status === 'Active' ? 'green' : status === 'Negotiation' ? 'orange' : 'blue';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Notas',
      dataIndex: 'notes',
    },
  ];

  // Additional Mock Data
  const creditFacilities = [
    { partner: 'Marathon Digital', totalLimit: 50000000, utilized: 32500000, available: 17500000, rate: '8.5%', utilization: 65 },
    { partner: 'Galaxy Digital', totalLimit: 75000000, utilized: 48000000, available: 27000000, rate: '7.2%', utilization: 64 },
    { partner: 'BlockFi', totalLimit: 30000000, utilized: 18500000, available: 11500000, rate: '9.1%', utilization: 62 },
    { partner: 'Genesis Trading', totalLimit: 100000000, utilized: 72000000, available: 28000000, rate: '6.8%', utilization: 72 },
    { partner: 'Amber Group', totalLimit: 45000000, utilized: 22000000, available: 23000000, rate: '8.0%', utilization: 49 },
  ];

  const dealPipeline = [
    { stage: 'Prospecting', count: 8, value: 145000000 },
    { stage: 'Initial Contact', count: 5, value: 95000000 },
    { stage: 'Due Diligence', count: 3, value: 75000000 },
    { stage: 'Negotiation', count: 2, value: 50000000 },
    { stage: 'Closed Won', count: 6, value: 300000000 },
  ];

  const historicalDeals = [
    { date: '2024-11-01', partner: 'Marathon Digital', amount: 25000000, type: 'Loan', status: 'Active' },
    { date: '2024-10-15', partner: 'Galaxy Digital', amount: 50000000, type: 'Credit Line', status: 'Active' },
    { date: '2024-09-22', partner: 'Genesis Trading', amount: 75000000, type: 'Credit Line', status: 'Active' },
    { date: '2024-08-10', partner: 'Amber Group', amount: 20000000, type: 'Loan', status: 'Repaid' },
  ];

  const geographicDistribution = [
    { region: 'North America', count: 8, value: 150000000 },
    { region: 'Europe', count: 4, value: 85000000 },
    { region: 'Asia Pacific', count: 3, value: 65000000 },
    { region: 'Middle East', count: 1, value: 20000000 },
  ];

  const assetFocus = partners.reduce((acc, partner) => {
    (partner.focus_assets || []).forEach((asset) => {
      const existing = acc.find((item) => item.asset === asset);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ asset, count: 1 });
      }
    });
    return acc;
  }, [] as Array<{ asset: string; count: number }>);

  const keyContacts = [
    { partner: 'Marathon Digital', name: 'Sarah Johnson', role: 'Head of Lending', email: 's.johnson@marathon.com', phone: '+1-415-555-0123', lastContact: '2 days ago' },
    { partner: 'Galaxy Digital', name: 'Michael Chen', role: 'Director, Capital Markets', email: 'm.chen@galaxy.io', phone: '+1-212-555-0456', lastContact: '1 week ago' },
    { partner: 'BlockFi', name: 'Jessica Martinez', role: 'VP, Institutional Sales', email: 'j.martinez@blockfi.com', phone: '+1-646-555-0789', lastContact: '3 days ago' },
  ];

  const totals = useMemo(() => {
    const active = partners.filter((p) => p.status === 'Active').length;
    const negotiation = partners.filter((p) => p.status === 'Negotiation').length;
    const prospect = partners.filter((p) => p.status === 'Prospect').length;
    const totalCreditLimit = creditFacilities.reduce((sum, f) => sum + f.totalLimit, 0);
    const totalUtilized = creditFacilities.reduce((sum, f) => sum + f.utilized, 0);
    const avgUtilization = (totalUtilized / totalCreditLimit) * 100;
    return { active, negotiation, prospect, totalCreditLimit, totalUtilized, avgUtilization };
  }, [partners]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={3}>Capital Partners & Liquidity Desk</Title>
      {usingDemoData && (
        <Alert
          type="info"
          showIcon
          message="Mostrando datos demo"
          description="No pudimos cargar los partners desde Supabase, así que se muestran partners de referencia para mantener la experiencia completa."
        />
      )}

      {/* Enhanced Metrics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Partners activos"
              value={totals.active}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="En negociación"
              value={totals.negotiation}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pipeline prospectos"
              value={totals.prospect}
              prefix={<LineChartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Líneas de crédito totales"
              value={`$${(totals.totalCreditLimit / 1000000).toFixed(0)}M`}
              prefix={<BankOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Credit Facility Utilization */}
      <Card
        title={
          <Space>
            <DollarOutlined style={{ color: '#1890ff' }} />
            <span>Utilización de Líneas de Crédito</span>
            <Tag color="blue">Utilización Promedio: {totals.avgUtilization.toFixed(1)}%</Tag>
          </Space>
        }
        bordered={false}
      >
        <Alert
          message="Total Disponible"
          description={`$${((totals.totalCreditLimit - totals.totalUtilized) / 1000000).toFixed(1)}M de $${(totals.totalCreditLimit / 1000000).toFixed(0)}M en líneas de crédito`}
          type="success"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Table
          dataSource={creditFacilities}
          columns={[
            {
              title: 'Partner',
              dataIndex: 'partner',
              key: 'partner',
              render: (text: string) => <strong>{text}</strong>,
            },
            {
              title: 'Límite Total',
              dataIndex: 'totalLimit',
              key: 'totalLimit',
              render: (val: number) => `$${(val / 1000000).toFixed(1)}M`,
            },
            {
              title: 'Utilizado',
              dataIndex: 'utilized',
              key: 'utilized',
              render: (val: number) => `$${(val / 1000000).toFixed(1)}M`,
            },
            {
              title: 'Disponible',
              dataIndex: 'available',
              key: 'available',
              render: (val: number) => (
                <Tag color="green">${(val / 1000000).toFixed(1)}M</Tag>
              ),
            },
            {
              title: 'Tasa',
              dataIndex: 'rate',
              key: 'rate',
              render: (rate: string) => <Tag color="blue">{rate}</Tag>,
            },
            {
              title: 'Utilización',
              dataIndex: 'utilization',
              key: 'utilization',
              render: (val: number) => (
                <div>
                  <Progress
                    percent={val}
                    size="small"
                    strokeColor={val > 80 ? '#ff4d4f' : val > 60 ? '#faad14' : '#52c41a'}
                  />
                </div>
              ),
            },
          ]}
          pagination={false}
          size="small"
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Deal Pipeline & Analytics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <LineChartOutlined style={{ color: '#722ed1' }} />
                <span>Pipeline de Oportunidades</span>
              </Space>
            }
            bordered={false}
          >
            <Column
              data={dealPipeline}
              xField="stage"
              yField="value"
              label={{
                position: 'top',
                formatter: (datum: any) => `$${(datum.value / 1000000).toFixed(0)}M`,
              }}
              meta={{
                value: {
                  alias: 'Value',
                  formatter: (v: number) => `$${(v / 1000000).toFixed(1)}M`,
                },
              }}
              height={280}
            />
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ fontSize: '12px', color: '#8c8c8c', textAlign: 'center' }}>
              Total Pipeline Value: $665M • Win Rate: 25%
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <GlobalOutlined style={{ color: '#13c2c2' }} />
                <span>Distribución Geográfica</span>
              </Space>
            }
            bordered={false}
          >
            <Pie
              data={geographicDistribution}
              angleField="value"
              colorField="region"
              radius={0.8}
              innerRadius={0.6}
              label={{
                type: 'outer',
                content: '{name}\n{percentage}',
              }}
              height={280}
            />
          </Card>
        </Col>
      </Row>

      {/* Asset Focus & Historical Deals */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <RiseOutlined style={{ color: '#52c41a' }} />
                <span>Enfoque de Activos</span>
              </Space>
            }
            bordered={false}
          >
            <Column
              data={assetFocus}
              xField="asset"
              yField="count"
              label={{
                position: 'top',
              }}
              height={250}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <FileTextOutlined style={{ color: '#faad14' }} />
                <span>Deals Recientes</span>
              </Space>
            }
            bordered={false}
          >
            <Timeline
              items={historicalDeals.map((deal) => ({
                color: deal.status === 'Active' ? 'green' : 'blue',
                children: (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <strong>{deal.partner}</strong>
                      <Tag color={deal.status === 'Active' ? 'green' : 'blue'}>
                        {deal.status}
                      </Tag>
                    </div>
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      {deal.type} • ${(deal.amount / 1000000).toFixed(1)}M
                    </div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{deal.date}</div>
                  </div>
                ),
              }))}
            />
          </Card>
        </Col>
      </Row>

      {/* Key Contacts */}
      <Card
        title={
          <Space>
            <TeamOutlined style={{ color: '#1890ff' }} />
            <span>Contactos Clave</span>
            <Badge count={keyContacts.length} style={{ backgroundColor: '#52c41a' }} />
          </Space>
        }
        bordered={false}
      >
        <Row gutter={[16, 16]}>
          {keyContacts.map((contact, index) => (
            <Col xs={24} lg={8} key={index}>
              <Card size="small" style={{ background: '#fafafa' }}>
                <Space direction="vertical" style={{ width: '100%' }} size={8}>
                  <div>
                    <Text strong style={{ fontSize: '15px' }}>{contact.name}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>{contact.role}</Text>
                  </div>
                  <Divider style={{ margin: '8px 0' }} />
                  <div style={{ fontSize: '13px' }}>
                    <Text strong>{contact.partner}</Text>
                  </div>
                  <Space direction="vertical" size={4} style={{ width: '100%' }}>
                    <div style={{ fontSize: '12px' }}>
                      <MailOutlined /> {contact.email}
                    </div>
                    <div style={{ fontSize: '12px' }}>
                      <PhoneOutlined /> {contact.phone}
                    </div>
                    <div style={{ fontSize: '11px', color: '#8c8c8c' }}>
                      Last contact: {contact.lastContact}
                    </div>
                  </Space>
                  <Button type="primary" size="small" block style={{ marginTop: 8 }}>
                    Contact
                  </Button>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      <Card>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Segmented
              options={[
                { label: 'Todos', value: 'all' },
                { label: 'Lenders', value: 'lender' },
                { label: 'Liquidity', value: 'liquidity' },
                { label: 'Leverage', value: 'leverage' },
              ]}
              value={typeFilter}
              onChange={(val) => setTypeFilter(val as typeof typeFilter)}
            />
          </Col>
          <Col xs={24} md={12}>
            <Input.Search
              placeholder="Buscar por partner, región o activo"
              onChange={(event) => setSearch(event.target.value)}
              allowClear
            />
          </Col>
        </Row>
      </Card>

      <Table
        dataSource={filteredPartners}
        columns={columns}
        rowKey="name"
        pagination={{ pageSize: 5 }}
      />

      {/* Lending Providers Section */}
      <Card
        title={
          <Space>
            <BankOutlined style={{ color: '#1890ff' }} />
            <span>Proveedores de Lending</span>
            <Tag color="blue">5 Activos</Tag>
          </Space>
        }
        bordered={false}
        style={{ marginTop: 24 }}
      >
        <Table
          dataSource={[
            {
              provider: 'Galaxy Digital',
              type: 'Secured Lending',
              minTicket: 10000000,
              maxTicket: 100000000,
              rate: '6.8% - 9.2%',
              term: '30-180 days',
              ltv: '60-75%',
              collateral: 'BTC, ETH, Stablecoins',
              status: 'Active',
              avgDrawdown: '45 days',
              totalDeployed: 72000000,
            },
            {
              provider: 'BlockFi',
              type: 'Asset-Backed Lending',
              minTicket: 5000000,
              maxTicket: 30000000,
              rate: '8.5% - 11.0%',
              term: '60-365 days',
              ltv: '50-65%',
              collateral: 'BTC, ETH',
              status: 'Active',
              avgDrawdown: '90 days',
              totalDeployed: 18500000,
            },
            {
              provider: 'Genesis Trading',
              type: 'Prime Brokerage',
              minTicket: 25000000,
              maxTicket: 200000000,
              rate: '5.5% - 8.0%',
              term: '90-365 days',
              ltv: '70-80%',
              collateral: 'Multi-asset',
              status: 'Active',
              avgDrawdown: '120 days',
              totalDeployed: 72000000,
            },
            {
              provider: 'Amber Group',
              type: 'Trade Financing',
              minTicket: 5000000,
              maxTicket: 50000000,
              rate: '7.0% - 10.5%',
              term: '30-90 days',
              ltv: '55-70%',
              collateral: 'BTC, ETH, SOL',
              status: 'Active',
              avgDrawdown: '60 days',
              totalDeployed: 22000000,
            },
            {
              provider: 'Wintermute',
              type: 'Market Making Credit',
              minTicket: 10000000,
              maxTicket: 75000000,
              rate: '6.0% - 8.5%',
              term: '30-180 days',
              ltv: '65-75%',
              collateral: 'Major pairs',
              status: 'Negotiation',
              avgDrawdown: '-',
              totalDeployed: 0,
            },
          ]}
          columns={[
            {
              title: 'Proveedor',
              dataIndex: 'provider',
              key: 'provider',
              render: (text: string, record: any) => (
                <Space direction="vertical" size={0}>
                  <Text strong>{text}</Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>{record.type}</Text>
                </Space>
              ),
            },
            {
              title: 'Ticket Size',
              key: 'ticket',
              render: (_: any, record: any) => (
                <div>
                  <div style={{ fontSize: '13px' }}>Min: ${(record.minTicket / 1000000).toFixed(0)}M</div>
                  <div style={{ fontSize: '13px' }}>Max: ${(record.maxTicket / 1000000).toFixed(0)}M</div>
                </div>
              ),
            },
            {
              title: 'Tasa',
              dataIndex: 'rate',
              key: 'rate',
              render: (rate: string) => <Tag color="blue">{rate}</Tag>,
            },
            {
              title: 'Plazo',
              dataIndex: 'term',
              key: 'term',
            },
            {
              title: 'LTV',
              dataIndex: 'ltv',
              key: 'ltv',
              render: (ltv: string) => <Tag color="green">{ltv}</Tag>,
            },
            {
              title: 'Colateral Aceptado',
              dataIndex: 'collateral',
              key: 'collateral',
              render: (text: string) => (
                <Text style={{ fontSize: '12px' }}>{text}</Text>
              ),
            },
            {
              title: 'Deployed',
              dataIndex: 'totalDeployed',
              key: 'totalDeployed',
              render: (val: number) => (
                val > 0 ? `$${(val / 1000000).toFixed(1)}M` : '-'
              ),
            },
            {
              title: 'Estado',
              dataIndex: 'status',
              key: 'status',
              render: (status: string) => (
                <Tag color={status === 'Active' ? 'green' : 'orange'}>{status}</Tag>
              ),
            },
          ]}
          pagination={false}
          size="small"
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Liquidity Providers Section */}
      <Card
        title={
          <Space>
            <GlobalOutlined style={{ color: '#52c41a' }} />
            <span>Proveedores de Liquidez</span>
            <Tag color="green">4 Activos</Tag>
          </Space>
        }
        bordered={false}
        style={{ marginTop: 24 }}
      >
        <Alert
          message="Liquidez Total Disponible"
          description="$180M+ en liquidez agregada a través de todos los proveedores"
          type="success"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Table
          dataSource={[
            {
              provider: 'B2C2',
              type: 'OTC Liquidity',
              assets: ['BTC', 'ETH', 'USDC', 'USDT'],
              minSize: 100000,
              maxSize: 50000000,
              spread: '0.05% - 0.15%',
              settlement: 'T+0',
              availability: '24/7',
              avgVolume: 125000000,
              status: 'Active',
            },
            {
              provider: 'Cumberland',
              type: 'Principal Liquidity',
              assets: ['BTC', 'ETH', 'Major Alts'],
              minSize: 250000,
              maxSize: 75000000,
              spread: '0.08% - 0.20%',
              settlement: 'T+0',
              availability: '24/7',
              avgVolume: 98000000,
              status: 'Active',
            },
            {
              provider: 'Wintermute',
              type: 'Market Making',
              assets: ['Multi-asset'],
              minSize: 500000,
              maxSize: 100000000,
              spread: '0.10% - 0.25%',
              settlement: 'T+0',
              availability: 'Market Hours',
              avgVolume: 156000000,
              status: 'Active',
            },
            {
              provider: 'Jump Trading',
              type: 'HFT Liquidity',
              assets: ['BTC', 'ETH', '100+ pairs'],
              minSize: 1000000,
              maxSize: 200000000,
              spread: '0.03% - 0.12%',
              settlement: 'Instant',
              availability: '24/7',
              avgVolume: 285000000,
              status: 'Negotiation',
            },
          ]}
          columns={[
            {
              title: 'Proveedor',
              dataIndex: 'provider',
              key: 'provider',
              render: (text: string, record: any) => (
                <Space direction="vertical" size={0}>
                  <Text strong>{text}</Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>{record.type}</Text>
                </Space>
              ),
            },
            {
              title: 'Activos',
              dataIndex: 'assets',
              key: 'assets',
              render: (assets: string[]) => (
                <Space wrap size={4}>
                  {assets.slice(0, 3).map((asset, i) => (
                    <Tag key={i} style={{ fontSize: '11px' }}>{asset}</Tag>
                  ))}
                  {assets.length > 3 && <Tag>+{assets.length - 3}</Tag>}
                </Space>
              ),
            },
            {
              title: 'Trade Size',
              key: 'size',
              render: (_: any, record: any) => (
                <div style={{ fontSize: '12px' }}>
                  <div>${(record.minSize / 1000).toFixed(0)}K - ${(record.maxSize / 1000000).toFixed(0)}M</div>
                </div>
              ),
            },
            {
              title: 'Spread',
              dataIndex: 'spread',
              key: 'spread',
              render: (spread: string) => <Tag color="cyan">{spread}</Tag>,
            },
            {
              title: 'Settlement',
              dataIndex: 'settlement',
              key: 'settlement',
            },
            {
              title: 'Disponibilidad',
              dataIndex: 'availability',
              key: 'availability',
              render: (text: string) => (
                <Badge
                  status={text === '24/7' ? 'success' : 'processing'}
                  text={text}
                />
              ),
            },
            {
              title: 'Vol. Promedio (30d)',
              dataIndex: 'avgVolume',
              key: 'avgVolume',
              render: (val: number) => `$${(val / 1000000).toFixed(0)}M`,
            },
            {
              title: 'Estado',
              dataIndex: 'status',
              key: 'status',
              render: (status: string) => (
                <Tag color={status === 'Active' ? 'green' : 'orange'}>{status}</Tag>
              ),
            },
          ]}
          pagination={false}
          size="small"
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Active Negotiations & Term Sheets */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <FileTextOutlined style={{ color: '#faad14' }} />
                <span>Negociaciones Activas</span>
                <Badge count={3} style={{ backgroundColor: '#faad14' }} />
              </Space>
            }
            bordered={false}
          >
            <Timeline
              items={[
                {
                  color: 'blue',
                  children: (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <strong>Jump Trading - Liquidity Agreement</strong>
                        <Tag color="blue">Due Diligence</Tag>
                      </div>
                      <div style={{ fontSize: '13px', color: '#666', marginBottom: 8 }}>
                        $200M facility • 0.03-0.12% spread • Instant settlement
                      </div>
                      <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                        Next: Legal review scheduled for Dec 5
                      </div>
                      <Progress percent={65} size="small" style={{ marginTop: 8 }} />
                    </div>
                  ),
                },
                {
                  color: 'orange',
                  children: (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <strong>Wintermute - Market Making</strong>
                        <Tag color="orange">Term Sheet Review</Tag>
                      </div>
                      <div style={{ fontSize: '13px', color: '#666', marginBottom: 8 }}>
                        $75M credit line • 6.0-8.5% rate • 30-180 days
                      </div>
                      <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                        Pending: Collateral framework approval
                      </div>
                      <Progress percent={45} size="small" style={{ marginTop: 8 }} status="active" />
                    </div>
                  ),
                },
                {
                  color: 'green',
                  children: (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <strong>Coinbase Prime - Custody + Lending</strong>
                        <Tag color="green">Final Review</Tag>
                      </div>
                      <div style={{ fontSize: '13px', color: '#666', marginBottom: 8 }}>
                        $50M facility • Institutional custody included
                      </div>
                      <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                        Expected close: This week
                      </div>
                      <Progress percent={90} size="small" style={{ marginTop: 8 }} status="success" />
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <SafetyOutlined style={{ color: '#722ed1' }} />
                <span>Evaluación de Riesgo por Partner</span>
              </Space>
            }
            bordered={false}
          >
            <Table
              dataSource={[
                { partner: 'Galaxy Digital', creditRating: 'A+', counterpartyRisk: 'Low', operationalRisk: 'Low', overall: 'Excellent' },
                { partner: 'Genesis Trading', creditRating: 'A', counterpartyRisk: 'Low', operationalRisk: 'Medium', overall: 'Good' },
                { partner: 'BlockFi', creditRating: 'A-', counterpartyRisk: 'Medium', operationalRisk: 'Low', overall: 'Good' },
                { partner: 'Wintermute', creditRating: 'A', counterpartyRisk: 'Low', operationalRisk: 'Low', overall: 'Excellent' },
                { partner: 'Amber Group', creditRating: 'BBB+', counterpartyRisk: 'Medium', operationalRisk: 'Medium', overall: 'Acceptable' },
              ]}
              columns={[
                {
                  title: 'Partner',
                  dataIndex: 'partner',
                  key: 'partner',
                  render: (text: string) => <strong style={{ fontSize: '13px' }}>{text}</strong>,
                },
                {
                  title: 'Rating',
                  dataIndex: 'creditRating',
                  key: 'creditRating',
                  render: (rating: string) => (
                    <Tag color={rating.startsWith('A') ? 'green' : 'orange'}>{rating}</Tag>
                  ),
                },
                {
                  title: 'Riesgo Contraparte',
                  dataIndex: 'counterpartyRisk',
                  key: 'counterpartyRisk',
                  render: (risk: string) => (
                    <Tag color={risk === 'Low' ? 'green' : 'orange'}>{risk}</Tag>
                  ),
                },
                {
                  title: 'Overall',
                  dataIndex: 'overall',
                  key: 'overall',
                  render: (overall: string) => (
                    <Badge
                      status={overall === 'Excellent' ? 'success' : overall === 'Good' ? 'processing' : 'warning'}
                      text={overall}
                    />
                  ),
                },
              ]}
              pagination={false}
              size="small"
            />
            <Divider style={{ margin: '12px 0' }} />
            <Alert
              message="Risk Assessment Summary"
              description="Portfolio weighted average risk score: 8.7/10 (Excellent)"
              type="success"
              showIcon
              style={{ fontSize: '12px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Comprehensive Tabs */}
      <Tabs
        defaultActiveKey="ltv"
        style={{ marginTop: 24 }}
        items={[
          {
            key: 'ltv',
            label: 'Matrix de LTV',
            children: (
              <Row gutter={[16, 16]}>
                {partners.map((partner) => (
                  <Col xs={24} md={12} lg={8} key={`${partner.id || partner.name}-ltv`}>
                    <Card size="small" style={{ background: '#fafafa' }}>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text strong>{partner.name}</Text>
                          <Tag color="blue">{partner.type}</Tag>
                        </div>
                        <Divider style={{ margin: '8px 0' }} />
                        <div style={{ fontSize: '13px' }}>
                          <div style={{ marginBottom: 4 }}>
                            <Text type="secondary">Región:</Text> <Text>{partner.region}</Text>
                          </div>
                          <div style={{ marginBottom: 4 }}>
                            <Text type="secondary">LTV:</Text>{' '}
                            <Tag color="green">{partner.ltv_range || 'Negociación'}</Tag>
                          </div>
                          <div style={{ marginBottom: 4 }}>
                            <Text type="secondary">Ticket:</Text>{' '}
                            <Text>{partner.ticket_size || 'N/A'}</Text>
                          </div>
                          <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: 8 }}>
                            {partner.notes || 'Sin notas registradas'}
                          </div>
                        </div>
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            ),
          },
          {
            key: 'onboarding',
            label: 'Proceso de Onboarding',
            children: (
              <Card>
                <Timeline
                  items={[
                    {
                      dot: <CheckCircleOutlined style={{ fontSize: '16px', color: '#52c41a' }} />,
                      children: (
                        <div>
                          <Text strong>Fase 1: Documentación Inicial (5-7 días)</Text>
                          <ul style={{ marginTop: 8, fontSize: '13px' }}>
                            <li>Estados financieros auditados (últimos 2 años)</li>
                            <li>Certificado de incorporación y estatutos</li>
                            <li>Estructura de propiedad y UBO disclosure</li>
                            <li>Licencias y permisos regulatorios aplicables</li>
                          </ul>
                        </div>
                      ),
                    },
                    {
                      dot: <CheckCircleOutlined style={{ fontSize: '16px', color: '#52c41a' }} />,
                      children: (
                        <div>
                          <Text strong>Fase 2: Due Diligence (10-14 días)</Text>
                          <ul style={{ marginTop: 8, fontSize: '13px' }}>
                            <li>KYC/AML compliance check</li>
                            <li>Credit risk assessment</li>
                            <li>Operational capacity review</li>
                            <li>Technology infrastructure audit</li>
                            <li>Legal entity verification</li>
                          </ul>
                        </div>
                      ),
                    },
                    {
                      dot: <ClockCircleOutlined style={{ fontSize: '16px', color: '#1890ff' }} />,
                      children: (
                        <div>
                          <Text strong>Fase 3: Integración Técnica (7-10 días)</Text>
                          <ul style={{ marginTop: 8, fontSize: '13px' }}>
                            <li>API integration y testing</li>
                            <li>NAV feed setup en tiempo real</li>
                            <li>Collateral monitoring system connection</li>
                            <li>Settlement procedures establishment</li>
                            <li>Reporting infrastructure setup</li>
                          </ul>
                        </div>
                      ),
                    },
                    {
                      dot: <ClockCircleOutlined style={{ fontSize: '16px', color: '#1890ff' }} />,
                      children: (
                        <div>
                          <Text strong>Fase 4: Legal & Contractual (14-21 días)</Text>
                          <ul style={{ marginTop: 8, fontSize: '13px' }}>
                            <li>Master Service Agreement (MSA)</li>
                            <li>Securities Lending Agreement (SLA)</li>
                            <li>Collateral Management Agreement</li>
                            <li>ISDA Master Agreement (si aplica)</li>
                            <li>Data Protection Agreement (DPA)</li>
                          </ul>
                        </div>
                      ),
                    },
                    {
                      children: (
                        <div>
                          <Text strong>Fase 5: Go-Live & Monitoring (Ongoing)</Text>
                          <ul style={{ marginTop: 8, fontSize: '13px' }}>
                            <li>Pilot transaction execution</li>
                            <li>Full operational launch</li>
                            <li>Continuous performance monitoring</li>
                            <li>Quarterly business reviews</li>
                            <li>Annual contract renewals</li>
                          </ul>
                        </div>
                      ),
                    },
                  ]}
                />
                <Divider />
                <Alert
                  message="Tiempo Total de Onboarding"
                  description="Promedio: 6-8 semanas desde contacto inicial hasta operación completa"
                  type="info"
                  showIcon
                />
              </Card>
            ),
          },
          {
            key: 'requirements',
            label: 'Requisitos Operacionales',
            children: (
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <Card title="Requisitos Técnicos" size="small">
                    <ul style={{ fontSize: '13px' }}>
                      <li><strong>NAV Feed:</strong> Actualización en tiempo real (cada 15 min mínimo)</li>
                      <li><strong>API Integration:</strong> REST + WebSocket para real-time updates</li>
                      <li><strong>Collateral Monitoring:</strong> Sistema automático de margin calls</li>
                      <li><strong>Reporting:</strong> Daily positions, P&L, exposure reports</li>
                      <li><strong>Security:</strong> SOC 2 Type II, ISO 27001 certified</li>
                      <li><strong>Uptime SLA:</strong> 99.9% availability requirement</li>
                    </ul>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card title="Requisitos Financieros" size="small">
                    <ul style={{ fontSize: '13px' }}>
                      <li><strong>Capital Mínimo:</strong> $25M AUM (varía por partner)</li>
                      <li><strong>Track Record:</strong> Mínimo 12 meses de historial auditable</li>
                      <li><strong>Liquidez:</strong> Mantener 20%+ en assets líquidos</li>
                      <li><strong>Auditoría:</strong> Estados financieros por Big 4 preferred</li>
                      <li><strong>Insurance:</strong> Fidelity bond $5M+ y D&O coverage</li>
                      <li><strong>Banking:</strong> Tier 1 bank relationships establecidas</li>
                    </ul>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card title="Requisitos de Compliance" size="small">
                    <ul style={{ fontSize: '13px' }}>
                      <li><strong>Licencias:</strong> Registro regulatorio en jurisdicción principal</li>
                      <li><strong>AML/KYC:</strong> Programa completo documentado y auditado</li>
                      <li><strong>Sanctions Screening:</strong> Real-time OFAC/UN/EU checks</li>
                      <li><strong>Transaction Monitoring:</strong> Sistema automatizado 24/7</li>
                      <li><strong>SAR Filing:</strong> Proceso documentado de reportes sospechosos</li>
                      <li><strong>Recordkeeping:</strong> 7+ años de registros auditables</li>
                    </ul>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card title="Requisitos Operacionales" size="small">
                    <ul style={{ fontSize: '13px' }}>
                      <li><strong>Equipo:</strong> Minimum 3 FTE para operations/compliance</li>
                      <li><strong>Custodio:</strong> Institutional grade custody (Coinbase, Fireblocks, etc)</li>
                      <li><strong>Disaster Recovery:</strong> BCP documented y tested anualmente</li>
                      <li><strong>Support:</strong> 24/7 operational contact availability</li>
                      <li><strong>Settlement:</strong> T+0 settlement capability requerida</li>
                      <li><strong>Jurisdicción:</strong> Clear legal entity en jurisdicción friendly</li>
                    </ul>
                  </Card>
                </Col>
              </Row>
            ),
          },
          {
            key: 'compliance',
            label: 'Matriz de Compliance',
            children: (
              <Card>
                <Table
                  dataSource={[
                    {
                      jurisdiction: 'United States',
                      registration: 'SEC Registered',
                      amlRequirements: 'FinCEN BSA/AML',
                      capitalReq: '$25M',
                      licensing: 'Money Transmitter (varies by state)',
                      reporting: 'Form PF, SAR, CTR',
                      complexity: 'High',
                    },
                    {
                      jurisdiction: 'Cayman Islands',
                      registration: 'CIMA Registration',
                      amlRequirements: 'CIMA AML Regulations',
                      capitalReq: '$10M',
                      licensing: 'Virtual Asset Service Provider',
                      reporting: 'Annual returns, audited financials',
                      complexity: 'Medium',
                    },
                    {
                      jurisdiction: 'Singapore',
                      registration: 'MAS Licensed',
                      amlRequirements: 'MAS AML/CFT',
                      capitalReq: 'SGD $250K',
                      licensing: 'Capital Markets Services',
                      reporting: 'Quarterly returns to MAS',
                      complexity: 'Medium',
                    },
                    {
                      jurisdiction: 'Switzerland',
                      registration: 'FINMA Authorization',
                      amlRequirements: 'Swiss AML Act',
                      capitalReq: 'CHF 1.5M',
                      licensing: 'Asset Manager License',
                      reporting: 'Annual report to FINMA',
                      complexity: 'High',
                    },
                    {
                      jurisdiction: 'British Virgin Islands',
                      registration: 'BVI FSC',
                      amlRequirements: 'BVI AML/CFT Code',
                      capitalReq: '$5M',
                      licensing: 'Investment Business License',
                      reporting: 'Annual returns, AML report',
                      complexity: 'Low',
                    },
                  ]}
                  columns={[
                    {
                      title: 'Jurisdicción',
                      dataIndex: 'jurisdiction',
                      key: 'jurisdiction',
                      render: (text: string) => <strong>{text}</strong>,
                    },
                    {
                      title: 'Registro',
                      dataIndex: 'registration',
                      key: 'registration',
                    },
                    {
                      title: 'AML Requirements',
                      dataIndex: 'amlRequirements',
                      key: 'amlRequirements',
                    },
                    {
                      title: 'Capital Req.',
                      dataIndex: 'capitalReq',
                      key: 'capitalReq',
                    },
                    {
                      title: 'Licensing',
                      dataIndex: 'licensing',
                      key: 'licensing',
                    },
                    {
                      title: 'Complejidad',
                      dataIndex: 'complexity',
                      key: 'complexity',
                      render: (complexity: string) => (
                        <Tag color={complexity === 'Low' ? 'green' : complexity === 'Medium' ? 'orange' : 'red'}>
                          {complexity}
                        </Tag>
                      ),
                    },
                  ]}
                  pagination={false}
                  size="small"
                  scroll={{ x: 1200 }}
                />
              </Card>
            ),
          },
        ]}
      />
    </Space>
  );
};

export default CapitalPartnersPage;
