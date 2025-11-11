import { useMemo, useState } from 'react';
import { Card, Col, Row, Tabs, Tag, Table, Statistic, Space, Typography, Input, Segmented } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { capitalPartners } from '../../../mocks/capitalPartners';

const { Title, Text } = Typography;

const CapitalPartnersPage = () => {
  const [typeFilter, setTypeFilter] = useState<'all' | 'lender' | 'liquidity' | 'leverage'>('all');
  const [search, setSearch] = useState('');

  const filteredPartners = useMemo(() => {
    return capitalPartners.filter((partner) => {
      const matchesType = typeFilter === 'all' || partner.type === typeFilter;
      const matchesSearch =
        partner.name.toLowerCase().includes(search.toLowerCase()) ||
        partner.region.toLowerCase().includes(search.toLowerCase()) ||
        partner.focusAssets.some((asset) => asset.toLowerCase().includes(search.toLowerCase()));
      return matchesType && matchesSearch;
    });
  }, [typeFilter, search]);

  const columns: ColumnsType<typeof capitalPartners[number]> = [
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
      dataIndex: 'ticketSize',
    },
    {
      title: 'LTV Range',
      dataIndex: 'ltvRange',
      render: (value) => value || 'N/A',
    },
    {
      title: 'Enfoque',
      dataIndex: 'focusAssets',
      render: (focus: string[]) => (
        <Space wrap>
          {focus.map((item) => (
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

  const totals = useMemo(() => {
    const active = capitalPartners.filter((p) => p.status === 'Active').length;
    const negotiation = capitalPartners.filter((p) => p.status === 'Negotiation').length;
    const prospect = capitalPartners.filter((p) => p.status === 'Prospect').length;
    return { active, negotiation, prospect };
  }, []);

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={3}>Capital Partners & Liquidity Desk</Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Partners activos" value={totals.active} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="En negociación" value={totals.negotiation} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Pipeline prospectos" value={totals.prospect} />
          </Card>
        </Col>
      </Row>

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
                {capitalPartners.map((partner) => (
                  <Col xs={24} md={12} key={`${partner.name}-ltv`}>
                    <Card>
                      <Space direction="vertical">
                        <Text strong>{partner.name}</Text>
                        <Text type="secondary">{partner.region}</Text>
                        <Text>LTV: {partner.ltvRange || 'Según negociación'}</Text>
                        <Text>Ticket: {partner.ticketSize}</Text>
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
