import { Card, Table, Button, Space, Row, Col, Statistic, Tag, Switch, Select, Descriptions, Modal, Form, Input, Divider } from 'antd';
import { ApiOutlined, LinkOutlined, SafetyOutlined, SettingOutlined, PlusOutlined, CheckCircleOutlined, CloseCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { ProgressRing } from '../../../components/common';

const IntegrationsBlockchainPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const chainsColumns = [
    {
      title: 'Blockchain',
      dataIndex: 'chain',
      key: 'chain',
      render: (text: string, record: any) => (
        <Space>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
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
            <div style={{ fontSize: 12, color: '#999' }}>{record.network}</div>
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
          syncing: { color: 'orange', icon: <SyncOutlined spin /> },
        };
        return (
          <Tag color={config[status].color} icon={config[status].icon}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'RPC Endpoint',
      dataIndex: 'rpcEndpoint',
      key: 'rpcEndpoint',
      render: (endpoint: string) => (
        <span style={{ fontFamily: 'monospace', fontSize: 11 }}>
          {endpoint.substring(0, 40)}...
        </span>
      ),
    },
    {
      title: 'Chain ID',
      dataIndex: 'chainId',
      key: 'chainId',
    },
    {
      title: 'Block Height',
      dataIndex: 'blockHeight',
      key: 'blockHeight',
      render: (height: number) => height.toLocaleString(),
    },
    {
      title: 'Latencia',
      dataIndex: 'latency',
      key: 'latency',
      render: (latency: number) => (
        <Tag color={latency < 100 ? 'green' : latency < 300 ? 'orange' : 'red'}>
          {latency}ms
        </Tag>
      ),
    },
    {
      title: 'Gas Price',
      dataIndex: 'gasPrice',
      key: 'gasPrice',
    },
    {
      title: 'Activo',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean) => (
        <Switch checked={enabled} onChange={() => console.log('Toggle chain')} />
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
          <Button type="link" size="small" icon={<SyncOutlined />}>
            Sync
          </Button>
        </Space>
      ),
    },
  ];

  const chainsData = [
    {
      key: '1',
      chain: 'Ethereum',
      network: 'Mainnet',
      status: 'active',
      rpcEndpoint: 'https://eth-mainnet.g.alchemy.com/v2/your-api-key',
      chainId: 1,
      blockHeight: 18542341,
      latency: 85,
      gasPrice: '25 Gwei',
      enabled: true,
      color: '#627EEA',
    },
    {
      key: '2',
      chain: 'Polygon',
      network: 'Mainnet',
      status: 'active',
      rpcEndpoint: 'https://polygon-mainnet.g.alchemy.com/v2/your-api-key',
      chainId: 137,
      blockHeight: 49832145,
      latency: 42,
      gasPrice: '120 Gwei',
      enabled: true,
      color: '#8247E5',
    },
    {
      key: '3',
      chain: 'Arbitrum',
      network: 'One',
      status: 'active',
      rpcEndpoint: 'https://arb-mainnet.g.alchemy.com/v2/your-api-key',
      chainId: 42161,
      blockHeight: 145234567,
      latency: 68,
      gasPrice: '0.1 Gwei',
      enabled: true,
      color: '#28A0F0',
    },
    {
      key: '4',
      chain: 'Base',
      network: 'Mainnet',
      status: 'syncing',
      rpcEndpoint: 'https://base-mainnet.g.alchemy.com/v2/your-api-key',
      chainId: 8453,
      blockHeight: 7234561,
      latency: 125,
      gasPrice: '0.5 Gwei',
      enabled: false,
      color: '#0052FF',
    },
    {
      key: '5',
      chain: 'Optimism',
      network: 'Mainnet',
      status: 'inactive',
      rpcEndpoint: 'https://opt-mainnet.g.alchemy.com/v2/your-api-key',
      chainId: 10,
      blockHeight: 0,
      latency: 0,
      gasPrice: 'N/A',
      enabled: false,
      color: '#FF0420',
    },
  ];

  const contractsColumns = [
    {
      title: 'Contrato',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: 11, color: '#999', fontFamily: 'monospace' }}>
            {record.address.substring(0, 10)}...{record.address.substring(record.address.length - 8)}
          </div>
        </div>
      ),
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color="blue">{type}</Tag>
      ),
    },
    {
      title: 'Blockchain',
      dataIndex: 'chain',
      key: 'chain',
    },
    {
      title: 'Versión',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          deployed: 'green',
          pending: 'orange',
          deprecated: 'red',
        };
        return <Tag color={colorMap[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Tx (30d)',
      dataIndex: 'transactions30d',
      key: 'transactions30d',
      sorter: (a: any, b: any) => a.transactions30d - b.transactions30d,
    },
    {
      title: 'Verificado',
      dataIndex: 'verified',
      key: 'verified',
      render: (verified: boolean) => (
        <Tag color={verified ? 'green' : 'orange'} icon={verified ? <SafetyOutlined /> : null}>
          {verified ? 'SÍ' : 'NO'}
        </Tag>
      ),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<LinkOutlined />}>
            Explorer
          </Button>
          <Button type="link" size="small">
            ABI
          </Button>
        </Space>
      ),
    },
  ];

  const contractsData = [
    {
      key: '1',
      name: 'Diamond Proxy',
      address: '0x1234567890abcdef1234567890abcdef12345678',
      type: 'EIP-2535',
      chain: 'Ethereum',
      version: 'v1.2.0',
      status: 'deployed',
      transactions30d: 1247,
      verified: true,
    },
    {
      key: '2',
      name: 'TokenFactory',
      address: '0xabcdef1234567890abcdef1234567890abcdef12',
      type: 'Factory',
      chain: 'Polygon',
      version: 'v2.0.1',
      status: 'deployed',
      transactions30d: 523,
      verified: true,
    },
    {
      key: '3',
      name: 'NAV Oracle',
      address: '0x7890abcdef1234567890abcdef1234567890abcd',
      type: 'Oracle',
      chain: 'Arbitrum',
      version: 'v1.0.5',
      status: 'deployed',
      transactions30d: 8942,
      verified: true,
    },
    {
      key: '4',
      name: 'Governance',
      address: '0xdef1234567890abcdef1234567890abcdef12345',
      type: 'DAO',
      chain: 'Ethereum',
      version: 'v1.1.0',
      status: 'deployed',
      transactions30d: 89,
      verified: false,
    },
    {
      key: '5',
      name: 'Staking Pool',
      address: '0x4567890abcdef1234567890abcdef1234567890a',
      type: 'Staking',
      chain: 'Base',
      version: 'v0.9.0',
      status: 'pending',
      transactions30d: 0,
      verified: false,
    },
  ];

  const progressItems = [
    { label: 'Chains Active', value: 75, color: '#52c41a' },
    { label: 'Contracts Verified', value: 60, color: '#1890ff' },
    { label: 'Uptime (30d)', value: 99.8, color: '#722ed1' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Integraciones Blockchain</h1>
        <Space>
          <Button icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
            Agregar Chain
          </Button>
          <Button type="primary" icon={<ApiOutlined />}>
            Deploy Contract
          </Button>
        </Space>
      </div>

      {/* Estadísticas */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Chains Conectadas"
              value={3}
              suffix="/ 5"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Smart Contracts"
              value={5}
              suffix="deployed"
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Transacciones (30d)"
              value={10801}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Latencia Promedio"
              value={65}
              suffix="ms"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Progress Rings */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <ProgressRing
            title="Métricas Blockchain"
            items={progressItems}
          />
        </Col>
      </Row>

      {/* Tabla de Blockchains */}
      <Card title="Blockchains Configuradas" style={{ marginBottom: 24 }}>
        <Table
          columns={chainsColumns}
          dataSource={chainsData}
          pagination={false}
          scroll={{ x: 1400 }}
        />
      </Card>

      {/* Tabla de Smart Contracts */}
      <Card title="Smart Contracts Desplegados">
        <Table
          columns={contractsColumns}
          dataSource={contractsData}
          pagination={false}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Modal Agregar Chain */}
      <Modal
        title="Agregar Blockchain"
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
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Blockchain" name="chain" rules={[{ required: true }]}>
            <Select placeholder="Seleccionar blockchain">
              <Select.Option value="ethereum">Ethereum Mainnet</Select.Option>
              <Select.Option value="polygon">Polygon</Select.Option>
              <Select.Option value="arbitrum">Arbitrum One</Select.Option>
              <Select.Option value="optimism">Optimism</Select.Option>
              <Select.Option value="base">Base</Select.Option>
              <Select.Option value="avalanche">Avalanche C-Chain</Select.Option>
              <Select.Option value="bsc">Binance Smart Chain</Select.Option>
            </Select>
          </Form.Item>

          <Divider>Configuración RPC</Divider>

          <Form.Item label="RPC Endpoint" name="rpcEndpoint" rules={[{ required: true }]}>
            <Input placeholder="https://eth-mainnet.g.alchemy.com/v2/your-api-key" />
          </Form.Item>
          <Form.Item label="RPC Endpoint (Backup)" name="rpcEndpointBackup">
            <Input placeholder="https://mainnet.infura.io/v3/your-project-id" />
          </Form.Item>
          <Form.Item label="Chain ID" name="chainId" rules={[{ required: true }]}>
            <Input type="number" placeholder="1" />
          </Form.Item>

          <Divider>Explorer & Monitoring</Divider>

          <Form.Item label="Block Explorer URL" name="explorerUrl">
            <Input placeholder="https://etherscan.io" />
          </Form.Item>
          <Form.Item label="WebSocket Endpoint" name="wsEndpoint">
            <Input placeholder="wss://eth-mainnet.g.alchemy.com/v2/your-api-key" />
          </Form.Item>

          <Divider>Configuración Avanzada</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Max Request Timeout" name="timeout">
                <Input type="number" suffix="ms" placeholder="5000" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Max Retry Attempts" name="maxRetries">
                <Input type="number" placeholder="3" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default IntegrationsBlockchainPage;
