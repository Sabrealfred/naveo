import { useEffect, useMemo, useState } from 'react';
import { Card, Col, Row, Table, Tag, Typography, Space, Spin, message, Alert, Statistic, List } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { capitalPartnersService, type DistributionPlatform } from '../../../services';
import { distributionPartners as mockDistributionPartners } from '../../../mocks/capitalPartners';

const { Title, Text } = Typography;

type DistributionPartnerRow = {
  id: string;
  platform: string;
  region: string;
  coverage: string;
  channels: string[];
  integrationStatus: string;
};

const normalizeSupabasePartners = (records: DistributionPlatform[]): DistributionPartnerRow[] =>
  records.map((item, index) => ({
    id: item.id ?? `distribution-${index}`,
    platform: item.platform ?? 'Unnamed platform',
    region: item.region ?? 'Global',
    coverage: item.coverage ?? 'Coverage details coming soon',
    channels: item.channels ?? [],
    integrationStatus: item.integration_status ?? 'Planned',
  }));

const mockPartners: DistributionPartnerRow[] = mockDistributionPartners.map((partner, index) => ({
  id: `mock-${index}`,
  platform: partner.platform,
  region: partner.region,
  coverage: partner.coverage,
  channels: partner.channels ?? [],
  integrationStatus: partner.integrationStatus,
}));

const DistributionNetworkPage = () => {
  const [distributionPartners, setDistributionPartners] = useState<DistributionPartnerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingDemoData, setUsingDemoData] = useState(false);

  useEffect(() => {
    loadDistributionPlatforms();
  }, []);

  const loadDistributionPlatforms = async () => {
    try {
      setLoading(true);
      const data = await capitalPartnersService.getAllDistributionPlatforms();
      if (data && data.length > 0) {
        setDistributionPartners(normalizeSupabasePartners(data));
        setUsingDemoData(false);
      } else {
        setDistributionPartners(mockPartners);
        setUsingDemoData(true);
      }
    } catch (error) {
      console.error('Error loading distribution platforms:', error);
      message.error('Failed to load distribution platforms');
      setDistributionPartners(mockPartners);
      setUsingDemoData(true);
    } finally {
      setLoading(false);
    }
  };

  const statusSummary = useMemo(() => {
    const live = distributionPartners.filter((p) => p.integrationStatus === 'Live').length;
    const sandbox = distributionPartners.filter((p) => p.integrationStatus === 'Sandbox').length;
    const planned = distributionPartners.filter((p) => p.integrationStatus === 'Planned').length;
    const uniqueChannels = new Set(distributionPartners.flatMap((p) => p.channels ?? []));
    return { live, sandbox, planned, channels: uniqueChannels.size };
  }, [distributionPartners]);

  const channelInsights = useMemo(() => {
    const counts = new Map<string, number>();
    distributionPartners.forEach((partner) => {
      (partner.channels ?? []).forEach((channel) => {
        counts.set(channel, (counts.get(channel) ?? 0) + 1);
      });
    });
    return Array.from(counts.entries())
      .map(([channel, count]) => ({ channel, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [distributionPartners]);

  const getStatusColor = (status: string) => {
    if (status === 'Live') return 'green';
    if (status === 'Sandbox') return 'orange';
    if (status === 'Planned') return 'blue';
    return 'purple';
  };

  const columns: ColumnsType<DistributionPartnerRow> = [
    {
      title: 'Plataforma',
      dataIndex: 'platform',
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
    },
    {
      title: 'Canales',
      dataIndex: 'channels',
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
      render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={3}>Asset Distribution Network</Title>
      {usingDemoData && (
        <Alert
          type="info"
          showIcon
          message="Showing demo distribution data"
          description="We could not reach the live distribution APIs, so these metrics use curated demo partners to keep the UI populated."
        />
      )}

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Plataformas activas"
              value={statusSummary.live}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Integraciones sandbox"
              value={statusSummary.sandbox}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Integraciones planificadas"
              value={statusSummary.planned}
              valueStyle={{ color: '#2f54eb' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Canales cubiertos"
              value={statusSummary.channels}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Table
        dataSource={distributionPartners}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey="id"
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Top canales de distribución">
            <List
              dataSource={channelInsights}
              renderItem={(item) => (
                <List.Item>
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Text>{item.channel}</Text>
                    <Tag color="blue">{item.count} partners</Tag>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Cobertura clave">
            <ul>
              <li>
                <strong>NavFund Services:</strong> Fund admin, NAV calc, transfer agency, investor
                reporting → se alimenta del módulo Admin Client Reports y Compliance.
              </li>
              <li>
                <strong>Securitize / Plume:</strong> Primary issuance + investor registry → enlazado
                con Launchpad (Sprint futuro).
              </li>
              <li>
                <strong>Apex / Copper:</strong> Liquidez secundaria, custodia MPC → integra datos con
                Traders y Capital Partners Hub.
              </li>
              <li>
                <strong>Carta / Broker networks:</strong> Distribución a RIA y bancos privados vía APIs
                REST/GraphQL.
              </li>
            </ul>
          </Card>
        </Col>
      </Row>

      <Card title="Integración regional">
        <Row gutter={[16, 16]}>
          {['Americas', 'EMEA', 'APAC'].map((region) => {
            const count = distributionPartners.filter((partner) =>
              partner.region.toLowerCase().includes(region.toLowerCase())
            ).length;
            return (
              <Col xs={24} md={8} key={region}>
                <Card size="small">
                  <Text type="secondary">{region}</Text>
                  <Title level={4} style={{ margin: 0 }}>
                    {count} partners
                  </Title>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Card>
    </Space>
  );
};

export default DistributionNetworkPage;
