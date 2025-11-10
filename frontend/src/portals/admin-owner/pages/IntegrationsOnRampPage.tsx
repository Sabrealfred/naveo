import { Card, Table, Button, Space, Row, Col, Statistic, Tag, Switch, Select, Descriptions, Modal, Form, Input, Checkbox } from 'antd';
import { DollarOutlined, CreditCardOutlined, BankOutlined, SettingOutlined, PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { PerformanceChart, ComparisonChart } from '../../../components/common';

const IntegrationsOnRampPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const providersColumns = [
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
        const colorMap: Record<string, string> = {
          active: 'green',
          inactive: 'default',
          testing: 'orange',
        };
        return <Tag color={colorMap[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Métodos de Pago',
      dataIndex: 'paymentMethods',
      key: 'paymentMethods',
      render: (methods: string[]) => (
        <Space wrap>
          {methods.map((method, idx) => {
            const icons: Record<string, any> = {
              card: <CreditCardOutlined />,
              bank: <BankOutlined />,
              crypto: <DollarOutlined />,
            };
            return (
              <Tag key={idx} icon={icons[method] || null}>
                {method}
              </Tag>
            );
          })}
        </Space>
      ),
    },
    {
      title: 'Volumen (30d)',
      dataIndex: 'volume30d',
      key: 'volume30d',
      render: (value: number) => `$${value.toLocaleString()}`,
      sorter: (a: any, b: any) => a.volume30d - b.volume30d,
    },
    {
      title: 'Transacciones (30d)',
      dataIndex: 'transactions30d',
      key: 'transactions30d',
      sorter: (a: any, b: any) => a.transactions30d - b.transactions30d,
    },
    {
      title: 'Fee',
      dataIndex: 'fee',
      key: 'fee',
      render: (fee: number) => `${fee}%`,
    },
    {
      title: 'Tasa Éxito',
      dataIndex: 'successRate',
      key: 'successRate',
      render: (rate: number) => (
        <Tag color={rate >= 95 ? 'green' : rate >= 85 ? 'orange' : 'red'}>
          {rate}%
        </Tag>
      ),
    },
    {
      title: 'Auto-Process',
      dataIndex: 'autoProcess',
      key: 'autoProcess',
      render: (enabled: boolean) => (
        <Switch checked={enabled} onChange={() => console.log('Toggle auto-process')} />
      ),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<SettingOutlined />}>
            Configurar
          </Button>
        </Space>
      ),
    },
  ];

  const providersData = [
    {
      key: '1',
      provider: 'Stripe',
      type: 'Card & Bank Transfers',
      status: 'active',
      paymentMethods: ['card', 'bank'],
      volume30d: 1250000,
      transactions30d: 342,
      fee: 2.9,
      successRate: 98.2,
      autoProcess: true,
      color: '#635BFF',
    },
    {
      key: '2',
      provider: 'Transak',
      type: 'Crypto On/Off Ramp',
      status: 'active',
      paymentMethods: ['card', 'bank', 'crypto'],
      volume30d: 850000,
      transactions30d: 189,
      fee: 1.5,
      successRate: 96.7,
      autoProcess: true,
      color: '#1890ff',
    },
    {
      key: '3',
      provider: 'MoonPay',
      type: 'Crypto Payment Gateway',
      status: 'testing',
      paymentMethods: ['card', 'crypto'],
      volume30d: 125000,
      transactions30d: 45,
      fee: 2.0,
      successRate: 94.5,
      autoProcess: false,
      color: '#7B61FF',
    },
    {
      key: '4',
      provider: 'Wyre',
      type: 'Fiat to Crypto',
      status: 'inactive',
      paymentMethods: ['card', 'bank'],
      volume30d: 0,
      transactions30d: 0,
      fee: 2.5,
      successRate: 0,
      autoProcess: false,
      color: '#52c41a',
    },
  ];

  const volumeData = [
    { date: '2024-01', value: 450000 },
    { date: '2024-02', value: 520000 },
    { date: '2024-03', value: 680000 },
    { date: '2024-04', value: 750000 },
    { date: '2024-05', value: 890000 },
    { date: '2024-06', value: 920000 },
    { date: '2024-07', value: 1050000 },
    { date: '2024-08', value: 1150000 },
    { date: '2024-09', value: 1280000 },
    { date: '2024-10', value: 1450000 },
    { date: '2024-11', value: 2225000 },
  ];

  const methodsDistribution = [
    { category: 'Payment Method', type: 'Card', value: 1200000 },
    { category: 'Payment Method', type: 'Bank Transfer', value: 750000 },
    { category: 'Payment Method', type: 'Crypto', value: 275000 },
  ];

  const recentTransactions = [
    {
      key: '1',
      date: '2024-11-09 16:45',
      user: 'John Investor',
      provider: 'Stripe',
      type: 'deposit',
      method: 'Card',
      amount: 50000,
      status: 'completed',
      fee: 1450,
    },
    {
      key: '2',
      date: '2024-11-09 15:30',
      user: 'Sarah Manager',
      provider: 'Transak',
      type: 'withdrawal',
      method: 'Bank',
      amount: 25000,
      status: 'completed',
      fee: 375,
    },
    {
      key: '3',
      date: '2024-11-09 14:15',
      user: 'Mike Analyst',
      provider: 'Stripe',
      type: 'deposit',
      method: 'Card',
      amount: 10000,
      status: 'pending',
      fee: 290,
    },
    {
      key: '4',
      date: '2024-11-09 12:00',
      user: 'Alpha Capital',
      provider: 'Transak',
      type: 'deposit',
      method: 'Crypto',
      amount: 100000,
      status: 'completed',
      fee: 1500,
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Integraciones On/Off Ramp</h1>
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
              value={2}
              suffix="/ 4"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Volumen Total (30d)"
              value={2225000}
              prefix="$"
              precision={0}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Transacciones (30d)"
              value={576}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Fees Totales (30d)"
              value={42750}
              prefix="$"
              precision={0}
            />
          </Card>
        </Col>
      </Row>

      {/* Gráficos */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <PerformanceChart
            title="Volumen de Transacciones (11 meses)"
            data={volumeData}
            height={300}
          />
        </Col>
        <Col xs={24} lg={12}>
          <ComparisonChart
            title="Distribución por Método de Pago"
            data={methodsDistribution}
            height={300}
          />
        </Col>
      </Row>

      {/* Tabla de Proveedores */}
      <Card title="Proveedores Configurados" style={{ marginBottom: 24 }}>
        <Table
          columns={providersColumns}
          dataSource={providersData}
          pagination={false}
          scroll={{ x: 1400 }}
        />
      </Card>

      {/* Transacciones Recientes */}
      <Card title="Transacciones Recientes">
        <Table
          columns={[
            { title: 'Fecha', dataIndex: 'date', key: 'date' },
            { title: 'Usuario', dataIndex: 'user', key: 'user' },
            { title: 'Proveedor', dataIndex: 'provider', key: 'provider' },
            {
              title: 'Tipo',
              dataIndex: 'type',
              key: 'type',
              render: (type: string) => (
                <Tag color={type === 'deposit' ? 'green' : 'orange'}>
                  {type.toUpperCase()}
                </Tag>
              ),
            },
            { title: 'Método', dataIndex: 'method', key: 'method' },
            {
              title: 'Monto',
              dataIndex: 'amount',
              key: 'amount',
              render: (value: number) => `$${value.toLocaleString()}`,
            },
            {
              title: 'Fee',
              dataIndex: 'fee',
              key: 'fee',
              render: (value: number) => `$${value.toLocaleString()}`,
            },
            {
              title: 'Estado',
              dataIndex: 'status',
              key: 'status',
              render: (status: string) => {
                const colorMap: Record<string, string> = {
                  completed: 'green',
                  pending: 'orange',
                  failed: 'red',
                };
                return <Tag color={colorMap[status]}>{status.toUpperCase()}</Tag>;
              },
            },
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
          dataSource={recentTransactions}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Modal Agregar Proveedor */}
      <Modal
        title="Agregar Proveedor On/Off Ramp"
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
              <Select.Option value="stripe">Stripe</Select.Option>
              <Select.Option value="transak">Transak</Select.Option>
              <Select.Option value="moonpay">MoonPay</Select.Option>
              <Select.Option value="wyre">Wyre</Select.Option>
              <Select.Option value="ramp">Ramp Network</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Métodos de Pago" name="paymentMethods" rules={[{ required: true }]}>
            <Checkbox.Group>
              <Space direction="vertical">
                <Checkbox value="card">Tarjetas (Credit/Debit)</Checkbox>
                <Checkbox value="bank">Transferencia Bancaria</Checkbox>
                <Checkbox value="crypto">Crypto</Checkbox>
                <Checkbox value="wire">Wire Transfer</Checkbox>
              </Space>
            </Checkbox.Group>
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
          <Form.Item label="Fee Percentage" name="fee" rules={[{ required: true }]}>
            <Input type="number" suffix="%" placeholder="2.9" />
          </Form.Item>
          <Form.Item label="Entorno" name="environment" rules={[{ required: true }]}>
            <Select placeholder="Seleccionar entorno">
              <Select.Option value="sandbox">Sandbox</Select.Option>
              <Select.Option value="production">Production</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="autoProcess" valuePropName="checked">
            <Checkbox>Habilitar procesamiento automático</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default IntegrationsOnRampPage;
