import { Card, Col, Row, Table, Tag, Typography, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { distributionPartners } from '../../../mocks/capitalPartners';

const { Title, Text } = Typography;

const DistributionNetworkPage = () => {
  const columns: ColumnsType<typeof distributionPartners[number]> = [
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
          {channels.map((channel) => (
            <Tag key={channel}>{channel}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Integración',
      dataIndex: 'integrationStatus',
      render: (status) => {
        const color = status === 'Live' ? 'green' : status === 'Sandbox' ? 'orange' : 'blue';
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={3}>Asset Distribution Network</Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Text type="secondary">Plataformas activas</Text>
            <Title level={3} style={{ margin: 0 }}>
              {distributionPartners.filter((p) => p.integrationStatus === 'Live').length}
            </Title>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Text type="secondary">Integraciones sandbox</Text>
            <Title level={3} style={{ margin: 0 }}>
              {distributionPartners.filter((p) => p.integrationStatus === 'Sandbox').length}
            </Title>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Text type="secondary">Canales cubiertos</Text>
            <Title level={3} style={{ margin: 0 }}>
              {new Set(distributionPartners.flatMap((p) => p.channels)).size}
            </Title>
          </Card>
        </Col>
      </Row>

      <Table
        dataSource={distributionPartners}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey="platform"
      />

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
    </Space>
  );
};

export default DistributionNetworkPage;
