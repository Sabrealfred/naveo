import { Row, Col, Card, Table, Tag, Button, Space, Progress, Tabs } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, WarningOutlined, FileTextOutlined } from '@ant-design/icons';
import { ActivityTimeline, ProgressRing } from '../../../components/common';
import type { TabsProps } from 'antd';

const CompliancePage = () => {
  const kycColumns = [
    {
      title: 'Usuario',
      dataIndex: 'user',
      key: 'user',
      render: (text: string, record: any) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{record.email}</div>
        </div>
      ),
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'individual' ? 'blue' : 'purple'}>
          {type === 'individual' ? 'Individual' : 'Empresa'}
        </Tag>
      ),
    },
    {
      title: 'Fondo',
      dataIndex: 'fund',
      key: 'fund',
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config: Record<string, { color: string; icon: any; label: string }> = {
          approved: { color: 'success', icon: <CheckCircleOutlined />, label: 'Aprobado' },
          pending: { color: 'warning', icon: <ClockCircleOutlined />, label: 'Pendiente' },
          rejected: { color: 'error', icon: <WarningOutlined />, label: 'Rechazado' },
          review: { color: 'processing', icon: <FileTextOutlined />, label: 'En Revisión' },
        };
        return <Tag color={config[status].color} icon={config[status].icon}>{config[status].label}</Tag>;
      },
    },
    {
      title: 'Fecha Envío',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
    },
    {
      title: 'Nivel de Riesgo',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      render: (level: string) => {
        const colorMap: Record<string, string> = {
          low: 'green',
          medium: 'orange',
          high: 'red',
        };
        return <Tag color={colorMap[level]}>{level.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" size="small">Revisar</Button>
          {record.status === 'pending' && (
            <>
              <Button type="link" size="small" style={{ color: '#52c41a' }}>Aprobar</Button>
              <Button type="link" size="small" danger>Rechazar</Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const kycData = [
    {
      key: '1',
      user: 'John Doe',
      email: 'john@example.com',
      type: 'individual',
      fund: 'Alpha Capital Fund',
      status: 'pending',
      submittedAt: '2024-11-09',
      riskLevel: 'low',
    },
    {
      key: '2',
      user: 'Acme Corp',
      email: 'legal@acme.com',
      type: 'business',
      fund: 'Beta Investments',
      status: 'review',
      submittedAt: '2024-11-08',
      riskLevel: 'medium',
    },
    {
      key: '3',
      user: 'Jane Smith',
      email: 'jane@example.com',
      type: 'individual',
      fund: 'Gamma Fund',
      status: 'approved',
      submittedAt: '2024-11-07',
      riskLevel: 'low',
    },
    {
      key: '4',
      user: 'Global Investments LLC',
      email: 'info@globalinv.com',
      type: 'business',
      fund: 'Delta Partners',
      status: 'pending',
      submittedAt: '2024-11-06',
      riskLevel: 'high',
    },
  ];

  const auditColumns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
    },
    {
      title: 'Usuario',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Acción',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'Detalles',
      dataIndex: 'details',
      key: 'details',
    },
    {
      title: 'IP Address',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
    },
    {
      title: 'Severidad',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: string) => {
        const colorMap: Record<string, string> = {
          low: 'default',
          medium: 'orange',
          high: 'red',
          critical: 'purple',
        };
        return <Tag color={colorMap[severity]}>{severity.toUpperCase()}</Tag>;
      },
    },
  ];

  const auditData = [
    {
      key: '1',
      timestamp: '2024-11-09 14:35:22',
      user: 'admin@naveo.com',
      action: 'USER_APPROVED',
      details: 'Aprobó KYC de John Doe',
      ipAddress: '192.168.1.100',
      severity: 'low',
    },
    {
      key: '2',
      timestamp: '2024-11-09 14:12:45',
      user: 'manager@naveo.com',
      action: 'FUND_CREATED',
      details: 'Creó nuevo fondo: Epsilon Ventures',
      ipAddress: '192.168.1.101',
      severity: 'medium',
    },
    {
      key: '3',
      timestamp: '2024-11-09 13:50:11',
      user: 'system',
      action: 'LARGE_TRANSACTION',
      details: 'Transacción de $500,000 detectada',
      ipAddress: 'N/A',
      severity: 'high',
    },
    {
      key: '4',
      timestamp: '2024-11-09 13:22:33',
      user: 'admin@naveo.com',
      action: 'CONFIG_CHANGED',
      details: 'Modificó fee structure',
      ipAddress: '192.168.1.100',
      severity: 'critical',
    },
  ];

  const timelineEvents = [
    {
      id: '1',
      title: 'KYC Aprobado',
      description: 'John Doe - Alpha Capital Fund',
      timestamp: '14:35',
      status: 'success' as const,
    },
    {
      id: '2',
      title: 'Nuevo Fondo Creado',
      description: 'Epsilon Ventures registrado',
      timestamp: '14:12',
      status: 'success' as const,
    },
    {
      id: '3',
      title: 'Alerta de Transacción',
      description: 'Transacción grande detectada - Requiere revisión',
      timestamp: '13:50',
      status: 'processing' as const,
    },
    {
      id: '4',
      title: 'Configuración Modificada',
      description: 'Fee structure actualizado',
      timestamp: '13:22',
      status: 'success' as const,
    },
  ];

  const progressItems = [
    { label: 'KYC Completados', value: 85, color: '#52c41a' },
    { label: 'Docs Verificados', value: 92, color: '#1890ff' },
    { label: 'Compliance Score', value: 98, color: '#722ed1' },
  ];

  const tabItems: TabsProps['items'] = [
    {
      key: 'kyc',
      label: 'KYC/KYB',
      children: (
        <div>
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col xs={24} md={12}>
              <Card>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span>Aprobados</span>
                    <span style={{ fontWeight: 600 }}>1,247</span>
                  </div>
                  <Progress percent={85} strokeColor="#52c41a" />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span>Pendientes</span>
                    <span style={{ fontWeight: 600 }}>42</span>
                  </div>
                  <Progress percent={10} strokeColor="#faad14" />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span>Rechazados</span>
                    <span style={{ fontWeight: 600 }}>18</span>
                  </div>
                  <Progress percent={5} strokeColor="#f5222d" />
                </div>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <ProgressRing
                title="Métricas de Compliance"
                items={progressItems}
              />
            </Col>
          </Row>
          <Table
            columns={kycColumns}
            dataSource={kycData}
            pagination={{ pageSize: 10 }}
          />
        </div>
      ),
    },
    {
      key: 'audit',
      label: 'Logs de Auditoría',
      children: (
        <Table
          columns={auditColumns}
          dataSource={auditData}
          pagination={{ pageSize: 10 }}
        />
      ),
    },
    {
      key: 'timeline',
      label: 'Timeline de Actividades',
      children: (
        <Row gutter={16}>
          <Col xs={24} lg={16}>
            <Card>
              <h3>Todas las Actividades</h3>
              <div style={{ maxHeight: 600, overflow: 'auto' }}>
                {[...timelineEvents, ...timelineEvents, ...timelineEvents].map((event, idx) => (
                  <div key={idx} style={{ marginBottom: 16, padding: 16, background: '#fafafa', borderRadius: 8 }}>
                    <div style={{ fontWeight: 500, marginBottom: 4 }}>{event.title}</div>
                    <div style={{ color: '#666', fontSize: 13 }}>{event.description}</div>
                    <div style={{ color: '#999', fontSize: 12, marginTop: 4 }}>{event.timestamp}</div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <ActivityTimeline
              title="Eventos Recientes"
              events={timelineEvents}
            />
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Compliance y Auditoría</h1>

      <Tabs defaultActiveKey="kyc" items={tabItems} />
    </div>
  );
};

export default CompliancePage;
