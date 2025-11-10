import { Card, Table, Button, Space, Row, Col, Statistic, Tag, Switch, Select, Descriptions, Modal, Form, Input } from 'antd';
import { ApiOutlined, CheckCircleOutlined, CloseCircleOutlined, SyncOutlined, SettingOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { ProgressRing } from '../../../components/common';

const IntegrationsKYCPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const kycProvidersColumns = [
    {
      title: 'Proveedor',
      dataIndex: 'provider',
      key: 'provider',
      render: (text: string, record: any) => (
        <Space>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: record.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 600
          }}>
            {text.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <div style={{ fontSize: 12, color: '#999' }}>{record.type}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config: Record<string, { color: string; icon: any }> = {
          active: { color: 'green', icon: <CheckCircleOutlined /> },
          inactive: { color: 'default', icon: <CloseCircleOutlined /> },
          testing: { color: 'orange', icon: <SyncOutlined spin /> },
        };
        return (
          <Tag color={config[status].color} icon={config[status].icon}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'API Key',
      dataIndex: 'apiKey',
      key: 'apiKey',
      render: (key: string) => (
        <span style={{ fontFamily: 'monospace', fontSize: 12 }}>
          {key.substring(0, 20)}...
        </span>
      ),
    },
    {
      title: 'Verificaciones (30d)',
      dataIndex: 'verifications30d',
      key: 'verifications30d',
      sorter: (a: any, b: any) => a.verifications30d - b.verifications30d,
    },
    {
      title: 'Tasa Aprobación',
      dataIndex: 'approvalRate',
      key: 'approvalRate',
      render: (rate: number) => (
        <Tag color={rate >= 90 ? 'green' : rate >= 70 ? 'orange' : 'red'}>
          {rate}%
        </Tag>
      ),
      sorter: (a: any, b: any) => a.approvalRate - b.approvalRate,
    },
    {
      title: 'Costo por Verificación',
      dataIndex: 'costPerVerification',
      key: 'costPerVerification',
      render: (cost: number) => `$${cost.toFixed(2)}`,
    },
    {
      title: 'Auto-Approve',
      dataIndex: 'autoApprove',
      key: 'autoApprove',
      render: (enabled: boolean) => (
        <Switch checked={enabled} onChange={() => console.log('Toggle auto-approve')} />
      ),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" size="small" icon={<SettingOutlined />}>
            Configurar
          </Button>
          <Button type="link" size="small" icon={<SyncOutlined />}>
            Test
          </Button>
        </Space>
      ),
    },
  ];

  const providersData = [
    {
      key: '1',
      provider: 'Persona',
      type: 'KYC/KYB Individual & Business',
      status: 'active',
      apiKey: 'persona_live_1234567890abcdefghijklmnopqrstuvwxyz',
      verifications30d: 247,
      approvalRate: 94.5,
      costPerVerification: 2.50,
      autoApprove: true,
      color: '#1890ff',
      webhookUrl: 'https://api.naveo.com/webhooks/persona',
      environment: 'production',
    },
    {
      key: '2',
      provider: 'Onfido',
      type: 'Document Verification',
      status: 'testing',
      apiKey: 'onfido_test_abcdefghijklmnopqrstuvwxyz1234567890',
      verifications30d: 42,
      approvalRate: 91.2,
      costPerVerification: 3.00,
      autoApprove: false,
      color: '#52c41a',
      webhookUrl: 'https://api.naveo.com/webhooks/onfido',
      environment: 'sandbox',
    },
    {
      key: '3',
      provider: 'Jumio',
      type: 'Identity Verification',
      status: 'inactive',
      apiKey: 'jumio_sandbox_xyz9876543210abcdefghijklmnopqrstuv',
      verifications30d: 0,
      approvalRate: 0,
      costPerVerification: 2.75,
      autoApprove: false,
      color: '#722ed1',
      webhookUrl: 'https://api.naveo.com/webhooks/jumio',
      environment: 'sandbox',
    },
  ];

  const progressItems = [
    { label: 'KYC Success Rate', value: 94.5, color: '#52c41a' },
    { label: 'KYB Success Rate', value: 89.3, color: '#1890ff' },
    { label: 'Auto-Approved', value: 78.2, color: '#722ed1' },
  ];

  const recentVerifications = [
    {
      key: '1',
      date: '2024-11-09 15:23',
      type: 'KYC',
      user: 'John Investor',
      provider: 'Persona',
      status: 'approved',
      processingTime: '2.3 min',
    },
    {
      key: '2',
      date: '2024-11-09 14:45',
      type: 'KYB',
      user: 'Alpha Capital LLC',
      provider: 'Persona',
      status: 'approved',
      processingTime: '5.1 min',
    },
    {
      key: '3',
      date: '2024-11-09 13:12',
      type: 'KYC',
      user: 'Sarah Manager',
      provider: 'Persona',
      status: 'pending',
      processingTime: '1.2 min',
    },
    {
      key: '4',
      date: '2024-11-09 11:30',
      type: 'KYC',
      user: 'Mike Analyst',
      provider: 'Onfido',
      status: 'rejected',
      processingTime: '3.5 min',
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Integraciones KYC/KYB</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          Agregar Proveedor
        </Button>
      </div>

      {/* Estadísticas */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Proveedores Activos"
              value={1}
              suffix="/ 3"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Verificaciones (30d)"
              value={289}
              suffix="checks"
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Costo Total (30d)"
              value={722.50}
              prefix="$"
              precision={2}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Tiempo Promedio"
              value={3.2}
              suffix="min"
              precision={1}
            />
          </Card>
        </Col>
      </Row>

      {/* Progress Rings */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <ProgressRing
            title="Métricas de Verificación"
            items={progressItems}
          />
        </Col>
      </Row>

      {/* Tabla de Proveedores */}
      <Card title="Proveedores Configurados" style={{ marginBottom: 24 }}>
        <Table
          columns={kycProvidersColumns}
          dataSource={providersData}
          pagination={false}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Verificaciones Recientes */}
      <Card title="Verificaciones Recientes">
        <Table
          columns={[
            { title: 'Fecha', dataIndex: 'date', key: 'date' },
            {
              title: 'Tipo',
              dataIndex: 'type',
              key: 'type',
              render: (type: string) => (
                <Tag color={type === 'KYC' ? 'blue' : 'purple'}>{type}</Tag>
              ),
            },
            { title: 'Usuario/Empresa', dataIndex: 'user', key: 'user' },
            { title: 'Proveedor', dataIndex: 'provider', key: 'provider' },
            {
              title: 'Estado',
              dataIndex: 'status',
              key: 'status',
              render: (status: string) => {
                const colorMap: Record<string, string> = {
                  approved: 'green',
                  pending: 'orange',
                  rejected: 'red',
                };
                return <Tag color={colorMap[status]}>{status.toUpperCase()}</Tag>;
              },
            },
            { title: 'Tiempo Proc.', dataIndex: 'processingTime', key: 'processingTime' },
            {
              title: 'Acciones',
              key: 'actions',
              render: () => (
                <Button type="link" size="small">
                  Ver Detalles
                </Button>
              ),
            },
          ]}
          dataSource={recentVerifications}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Modal Agregar Proveedor */}
      <Modal
        title="Agregar Proveedor KYC/KYB"
        open={isModalVisible}
        onOk={() => {
          form.validateFields().then(() => {
            setIsModalVisible(false);
            form.resetFields();
          });
        }}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Proveedor" name="provider" rules={[{ required: true }]}>
            <Select placeholder="Seleccionar proveedor">
              <Select.Option value="persona">Persona</Select.Option>
              <Select.Option value="onfido">Onfido</Select.Option>
              <Select.Option value="jumio">Jumio</Select.Option>
              <Select.Option value="sumsub">Sum&Substance</Select.Option>
              <Select.Option value="trulioo">Trulioo</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Tipo" name="type" rules={[{ required: true }]}>
            <Select placeholder="Seleccionar tipo">
              <Select.Option value="kyc">KYC Individual</Select.Option>
              <Select.Option value="kyb">KYB Business</Select.Option>
              <Select.Option value="both">KYC & KYB</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="API Key" name="apiKey" rules={[{ required: true }]}>
            <Input.Password placeholder="Ingresar API Key" />
          </Form.Item>
          <Form.Item label="API Secret" name="apiSecret" rules={[{ required: true }]}>
            <Input.Password placeholder="Ingresar API Secret" />
          </Form.Item>
          <Form.Item label="Webhook URL" name="webhookUrl">
            <Input placeholder="https://api.naveo.com/webhooks/provider" />
          </Form.Item>
          <Form.Item label="Entorno" name="environment" rules={[{ required: true }]}>
            <Select placeholder="Seleccionar entorno">
              <Select.Option value="sandbox">Sandbox</Select.Option>
              <Select.Option value="production">Production</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default IntegrationsKYCPage;
