import { useMemo, useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Input,
  List,
  Modal,
  Row,
  Select,
  Space,
  Statistic,
  Tag,
  Typography,
} from 'antd';
import {
  ArrowRightOutlined,
  CalendarOutlined,
  FileTextOutlined,
  TeamOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

type Stage = 'sourcing' | 'evaluation' | 'due-diligence' | 'approved' | 'rejected';
type Priority = 'high' | 'medium' | 'low';

interface AssetOpportunity {
  id: string;
  name: string;
  assetClass: 'crypto' | 'real-estate' | 'commodities' | 'securities';
  sourceChannel: 'broker' | 'direct' | 'marketplace' | 'referral';
  estimatedValue: number;
  potentialYield: number;
  stage: Stage;
  priority: Priority;
  assignedAnalyst: string;
  analystInitials: string;
  sourcingDate: string;
  targetClosing: string;
  notes: string;
}

const mockOpportunities: AssetOpportunity[] = [
  {
    id: 'opp-001',
    name: 'Andes Renewable Fund',
    assetClass: 'real-estate',
    sourceChannel: 'broker',
    estimatedValue: 42000000,
    potentialYield: 11.2,
    stage: 'sourcing',
    priority: 'high',
    assignedAnalyst: 'Laura Chen',
    analystInitials: 'LC',
    sourcingDate: '2025-10-01',
    targetClosing: '2026-01-15',
    notes: 'Portfolio of solar plants in Chile + Peru',
  },
  {
    id: 'opp-002',
    name: 'Helios Mining Notes',
    assetClass: 'commodities',
    sourceChannel: 'direct',
    estimatedValue: 18000000,
    potentialYield: 14.5,
    stage: 'evaluation',
    priority: 'medium',
    assignedAnalyst: 'Mateo Ruiz',
    analystInitials: 'MR',
    sourcingDate: '2025-09-12',
    targetClosing: '2025-12-05',
    notes: 'Tokenized receivables from lithium extraction',
  },
  {
    id: 'opp-003',
    name: 'Atlas Digital Credit',
    assetClass: 'securities',
    sourceChannel: 'marketplace',
    estimatedValue: 25000000,
    potentialYield: 8.7,
    stage: 'due-diligence',
    priority: 'high',
    assignedAnalyst: 'Sara González',
    analystInitials: 'SG',
    sourcingDate: '2025-08-30',
    targetClosing: '2025-11-20',
    notes: 'Structured credit facility tokenization',
  },
  {
    id: 'opp-004',
    name: 'Meridian Stable Yield',
    assetClass: 'crypto',
    sourceChannel: 'direct',
    estimatedValue: 15000000,
    potentialYield: 6.1,
    stage: 'approved',
    priority: 'medium',
    assignedAnalyst: 'Noah Park',
    analystInitials: 'NP',
    sourcingDate: '2025-07-18',
    targetClosing: '2025-10-01',
    notes: 'Stablecoin lending program for fintech partners',
  },
  {
    id: 'opp-005',
    name: 'Aurora Logistics Token',
    assetClass: 'securities',
    sourceChannel: 'referral',
    estimatedValue: 12000000,
    potentialYield: 9.3,
    stage: 'rejected',
    priority: 'low',
    assignedAnalyst: 'Laura Chen',
    analystInitials: 'LC',
    sourcingDate: '2025-06-02',
    targetClosing: '2025-09-15',
    notes: 'Rejected due to counterparty risk',
  },
];

const stageColumns: { key: Stage; title: string; color: string }[] = [
  { key: 'sourcing', title: 'Sourcing', color: '#d9d9d9' },
  { key: 'evaluation', title: 'Evaluation', color: '#91caff' },
  { key: 'due-diligence', title: 'Due Diligence', color: '#ffd666' },
  { key: 'approved', title: 'Approved', color: '#95de64' },
  { key: 'rejected', title: 'Rejected', color: '#ffa39e' },
];

const priorityColors: Record<Priority, string> = {
  high: 'red',
  medium: 'orange',
  low: 'blue',
};

const AssetPipelinePage = () => {
  const [stageFilter, setStageFilter] = useState<Stage | 'all'>('all');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | Priority>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOpportunity, setSelectedOpportunity] = useState<AssetOpportunity | null>(null);

  const filteredOpportunities = useMemo(() => {
    return mockOpportunities.filter((op) => {
      const matchesStage = stageFilter === 'all' || op.stage === stageFilter;
      const matchesClass = classFilter === 'all' || op.assetClass === classFilter;
      const matchesPriority = priorityFilter === 'all' || op.priority === priorityFilter;
      const matchesSearch =
        op.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        op.assignedAnalyst.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStage && matchesClass && matchesPriority && matchesSearch;
    });
  }, [stageFilter, classFilter, priorityFilter, searchTerm]);

  const metrics = useMemo(() => {
    const totalValue = filteredOpportunities.reduce((sum, opp) => sum + opp.estimatedValue, 0);
    const avgYield =
      filteredOpportunities.reduce((sum, opp) => sum + opp.potentialYield, 0) /
      (filteredOpportunities.length || 1);
    const stageCounts = stageColumns.reduce<Record<string, number>>((acc, column) => {
      acc[column.key] = filteredOpportunities.filter((op) => op.stage === column.key).length;
      return acc;
    }, {});

    return {
      totalDeals: filteredOpportunities.length,
      totalValue,
      avgYield,
      stageCounts,
    };
  }, [filteredOpportunities]);

  const renderOpportunityCard = (opportunity: AssetOpportunity) => (
    <Card
      key={opportunity.id}
      size="small"
      style={{ marginBottom: 12 }}
      bordered
      onClick={() => setSelectedOpportunity(opportunity)}
      hoverable
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
          <Title level={5} style={{ margin: 0 }}>
            {opportunity.name}
          </Title>
          <Tag color={priorityColors[opportunity.priority]}>{opportunity.priority.toUpperCase()}</Tag>
        </Space>
        <Space size="small">
          <Tag>{opportunity.assetClass}</Tag>
          <Tag>{opportunity.sourceChannel}</Tag>
        </Space>
        <Space align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
          <Space>
            <Avatar size="small">{opportunity.analystInitials}</Avatar>
            <Text type="secondary">{opportunity.assignedAnalyst}</Text>
          </Space>
          <Text strong>${(opportunity.estimatedValue / 1_000_000).toFixed(1)}M</Text>
        </Space>
        <Space align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
          <Text type="secondary">
            <CalendarOutlined /> Close: {opportunity.targetClosing}
          </Text>
          <Badge
            status="processing"
            text={`${opportunity.potentialYield.toFixed(1)}% Yield`}
          />
        </Space>
      </Space>
    </Card>
  );

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={3}>Asset Pipeline</Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card>
            <Statistic title="Total Opportunities" value={metrics.totalDeals} />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Pipeline Value"
              value={metrics.totalValue}
              precision={0}
              prefix="$"
            />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Average Yield"
              value={metrics.avgYield}
              precision={1}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Deals in Due Diligence"
              value={metrics.stageCounts['due-diligence'] ?? 0}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}>
            <Select
              value={stageFilter}
              onChange={(value) => setStageFilter(value as Stage | 'all')}
              options={[
                { label: 'All Stages', value: 'all' },
                ...stageColumns.map((col) => ({ label: col.title, value: col.key })),
              ]}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} md={6}>
            <Select
              value={classFilter}
              onChange={(value) => setClassFilter(value)}
              options={[
                { label: 'All Asset Classes', value: 'all' },
                { label: 'Crypto', value: 'crypto' },
                { label: 'Real Estate', value: 'real-estate' },
                { label: 'Commodities', value: 'commodities' },
                { label: 'Securities', value: 'securities' },
              ]}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} md={6}>
            <Select
              value={priorityFilter}
              onChange={(value) => setPriorityFilter(value as 'all' | Priority)}
              options={[
                { label: 'All Priorities', value: 'all' },
                { label: 'High', value: 'high' },
                { label: 'Medium', value: 'medium' },
                { label: 'Low', value: 'low' },
              ]}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} md={6}>
            <Input.Search
              placeholder="Buscar por nombre o analista"
              allowClear
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </Col>
        </Row>
      </Card>

      <Row gutter={16}>
        {stageColumns.map((column) => (
          <Col xs={24} md={12} lg={6} key={column.key}>
            <Card
              title={
                <Space align="center">
                  <Badge color={column.color} />
                  <Text strong>{column.title}</Text>
                  <Tag>{metrics.stageCounts[column.key] ?? 0}</Tag>
                </Space>
              }
              bordered={false}
              style={{ minHeight: 400 }}
              extra={<ArrowRightOutlined />}
            >
              <List
                dataSource={filteredOpportunities.filter((op) => op.stage === column.key)}
                renderItem={(item) => renderOpportunityCard(item)}
                locale={{ emptyText: 'Sin oportunidades' }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        open={Boolean(selectedOpportunity)}
        title={selectedOpportunity?.name}
        width={720}
        onCancel={() => setSelectedOpportunity(null)}
        footer={
          <Space>
            <Button onClick={() => setSelectedOpportunity(null)}>Cerrar</Button>
            <Button type="primary">Ver Due Diligence</Button>
          </Space>
        }
      >
        {selectedOpportunity && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Asset Class">{selectedOpportunity.assetClass}</Descriptions.Item>
              <Descriptions.Item label="Source Channel">{selectedOpportunity.sourceChannel}</Descriptions.Item>
              <Descriptions.Item label="Estimated Value">
                ${selectedOpportunity.estimatedValue.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Potential Yield">
                {selectedOpportunity.potentialYield.toFixed(1)}%
              </Descriptions.Item>
              <Descriptions.Item label="Stage">{selectedOpportunity.stage}</Descriptions.Item>
              <Descriptions.Item label="Priority">
                <Tag color={priorityColors[selectedOpportunity.priority]}>
                  {selectedOpportunity.priority.toUpperCase()}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Card title="Analyst & Timeline" size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space>
                  <Avatar icon={<TeamOutlined />} />
                  <div>
                    <Text strong>{selectedOpportunity.assignedAnalyst}</Text>
                    <div>
                      <Text type="secondary">Assigned Analyst</Text>
                    </div>
                  </div>
                </Space>
                <Space>
                  <CalendarOutlined />
                  <Text type="secondary">
                    Sourcing: {selectedOpportunity.sourcingDate} · Target Close: {selectedOpportunity.targetClosing}
                  </Text>
                </Space>
              </Space>
            </Card>

            <Card title="Notes" size="small">
              <Space>
                <FileTextOutlined />
                <Text>{selectedOpportunity.notes}</Text>
              </Space>
            </Card>
          </Space>
        )}
      </Modal>
    </Space>
  );
};

export default AssetPipelinePage;
