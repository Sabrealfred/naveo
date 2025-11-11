import { useMemo, useState, useEffect } from 'react';
import { Card, Col, Row, Tabs, Tag, Table, Statistic, Space, Typography, Input, Segmented, Progress, Button, Badge, Divider, Alert, Timeline, Spin, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { capitalPartnersService, type StrategicPartner } from '../../../services';
import { DollarOutlined, RiseOutlined, BankOutlined, CheckCircleOutlined, ClockCircleOutlined, TeamOutlined, GlobalOutlined, LineChartOutlined, FileTextOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { Pie, Column } from '@ant-design/charts';

const { Title, Text } = Typography;

const CapitalPartnersPage = () => {
  const [typeFilter, setTypeFilter] = useState<'all' | 'lender' | 'liquidity' | 'leverage'>('all');
  const [search, setSearch] = useState('');
  const [partners, setPartners] = useState<StrategicPartner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCapitalPartners();
  }, []);

  const loadCapitalPartners = async () => {
    try {
      setLoading(true);
      const data = await capitalPartnersService.getAllStrategicPartners();
      setPartners(data);
    } catch (error) {
      console.error('Error loading capital partners:', error);
      message.error('Failed to load capital partners');
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

      <Tabs
        items={[
          {
            key: 'ltv',
            label: 'Matrix de LTV',
            children: (
              <Row gutter={[16, 16]}>
                {partners.map((partner) => (
                  <Col xs={24} md={12} key={`${partner.name}-ltv`}>
                    <Card>
                      <Space direction="vertical">
                        <Text strong>{partner.name}</Text>
                        <Text type="secondary">{partner.region}</Text>
                        <Text>LTV: {partner.ltv_range || 'Según negociación'}</Text>
                        <Text>Ticket: {partner.ticket_size || 'N/A'}</Text>
                        <Text>Notas: {partner.notes}</Text>
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            ),
          },
          {
            key: 'requirements',
            label: 'Requisitos de Onboarding',
            children: (
              <Card>
                <ul>
                  <li>Estados financieros auditados + NAV diario.</li>
                  <li>Reportes AML/KYC de clientes finales (según región).</li>
                  <li>Feed en tiempo real de posición colateralizada.</li>
                  <li>Contacto operativo 24/7 para liquidaciones.</li>
                </ul>
              </Card>
            ),
          },
        ]}
      />
    </Space>
  );
};

export default CapitalPartnersPage;
