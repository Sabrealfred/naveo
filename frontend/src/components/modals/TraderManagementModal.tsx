import { useState } from 'react';
import {
  Modal,
  Tabs,
  Form,
  Input,
  InputNumber,
  Switch,
  Select,
  Button,
  Table,
  Tag,
  Space,
  Card,
  Row,
  Col,
  Statistic,
  Alert,
  Divider,
  message,
  Progress,
  Timeline,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Option } = Select;
const { TextArea } = Input;

interface TraderManagementModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (values: any) => void;
  trader?: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'suspended' | 'inactive';
    joinDate: string;
    totalTrades: number;
    successRate: number;
    pnl: number;
    assignedAssets: string[];
    tradingLimit: {
      daily: number;
      monthly: number;
    };
  };
}

const TraderManagementModal: React.FC<TraderManagementModalProps> = ({
  visible,
  onClose,
  onSubmit,
  trader,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('overview');
  const [tradingEnabled, setTradingEnabled] = useState(trader?.status === 'active');

  // Mock data for trader activity
  const recentTrades = [
    { id: 'T001', asset: 'BTC', type: 'Buy', amount: 50000, date: '2024-11-10 14:30', status: 'completed' },
    { id: 'T002', asset: 'ETH', type: 'Sell', amount: 30000, date: '2024-11-10 12:15', status: 'completed' },
    { id: 'T003', asset: 'SOL', type: 'Buy', amount: 15000, date: '2024-11-09 16:45', status: 'completed' },
    { id: 'T004', asset: 'MATIC', type: 'Sell', amount: 10000, date: '2024-11-09 11:20', status: 'pending' },
    { id: 'T005', asset: 'LINK', type: 'Buy', amount: 8000, date: '2024-11-08 09:00', status: 'failed' },
  ];

  const availableAssets = [
    { value: 'BTC', label: 'Bitcoin (BTC)', currentPrice: 43500 },
    { value: 'ETH', label: 'Ethereum (ETH)', currentPrice: 2300 },
    { value: 'SOL', label: 'Solana (SOL)', currentPrice: 95 },
    { value: 'MATIC', label: 'Polygon (MATIC)', currentPrice: 0.85 },
    { value: 'LINK', label: 'Chainlink (LINK)', currentPrice: 14.5 },
    { value: 'AVAX', label: 'Avalanche (AVAX)', currentPrice: 35 },
  ];

  const activityTimeline = [
    { date: '2024-11-10 14:30', action: 'Executed BTC buy order', amount: '$50,000', status: 'success' },
    { date: '2024-11-10 12:15', action: 'Executed ETH sell order', amount: '$30,000', status: 'success' },
    { date: '2024-11-09 18:00', action: 'Trading limit increased to $500K/day', amount: null, status: 'info' },
    { date: '2024-11-09 16:45', action: 'Executed SOL buy order', amount: '$15,000', status: 'success' },
    { date: '2024-11-09 11:20', action: 'Pending MATIC sell order', amount: '$10,000', status: 'warning' },
    { date: '2024-11-08 09:00', action: 'Failed LINK buy order - Limit exceeded', amount: '$8,000', status: 'error' },
  ];

  const tradeColumns = [
    {
      title: t('transactions.transactionId'),
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <span style={{ fontFamily: 'monospace' }}>{text}</span>,
    },
    {
      title: t('common.asset'),
      dataIndex: 'asset',
      key: 'asset',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: t('transactions.type'),
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'Buy' ? 'green' : 'orange'}>{type}</Tag>
      ),
    },
    {
      title: t('transactions.amount'),
      dataIndex: 'amount',
      key: 'amount',
      render: (val: number) => `$${val.toLocaleString()}`,
    },
    {
      title: t('transactions.dateTime'),
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: { [key: string]: string } = {
          completed: 'success',
          pending: 'processing',
          failed: 'error',
        };
        return <Tag color={colors[status]}>{t(`transactions.${status}`)}</Tag>;
      },
    },
  ];

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (onSubmit) {
        onSubmit({
          ...values,
          traderId: trader?.id,
          tradingEnabled,
          timestamp: new Date().toISOString(),
        });
      }
      message.success(t('traders.settingsUpdated'));
      handleClose();
    }).catch((error) => {
      console.error('Validation error:', error);
    });
  };

  const handleClose = () => {
    form.resetFields();
    setActiveTab('overview');
    onClose();
  };

  const handleToggleTrading = (checked: boolean) => {
    setTradingEnabled(checked);
    if (!checked) {
      Modal.confirm({
        title: t('traders.suspendTrading'),
        content: t('traders.suspendTradingConfirm', { name: trader?.name }),
        okText: t('common.yes'),
        cancelText: t('common.no'),
        okButtonProps: { danger: true },
        onOk: () => {
          message.warning(t('traders.tradingSuspended'));
        },
        onCancel: () => {
          setTradingEnabled(true);
        },
      });
    } else {
      message.success(t('traders.tradingEnabled'));
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={handleClose}
      width={1000}
      footer={null}
      destroyOnClose
      title={
        <Space>
          <UserOutlined style={{ color: '#722ed1' }} />
          <span>{t('traders.manageTrader')}: {trader?.name}</span>
          <Tag color={trader?.status === 'active' ? 'green' : 'red'}>
            {trader?.status?.toUpperCase()}
          </Tag>
        </Space>
      }
    >
      {/* Trader Overview Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('traders.totalTrades')}
              value={trader?.totalTrades}
              prefix={<ThunderboltOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('traders.successRate')}
              value={trader?.successRate}
              suffix="%"
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('traders.totalPnL')}
              value={trader?.pnl}
              prefix={trader && trader.pnl >= 0 ? '+$' : '-$'}
              valueStyle={{ color: trader && trader.pnl >= 0 ? '#52c41a' : '#f5222d' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('traders.assignedAssets')}
              value={trader?.assignedAssets?.length || 0}
              suffix={`/ ${availableAssets.length}`}
            />
          </Card>
        </Col>
      </Row>

      {/* Status Alert */}
      {trader?.status === 'suspended' && (
        <Alert
          message={t('traders.accountSuspended')}
          description={t('traders.accountSuspendedDescription')}
          type="error"
          showIcon
          icon={<CloseCircleOutlined />}
          style={{ marginBottom: '24px' }}
        />
      )}

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'overview',
            label: (
              <span>
                <UserOutlined />
                {t('traders.overview')}
              </span>
            ),
            children: (
              <div>
                <Card title={t('traders.traderInformation')} style={{ marginBottom: '16px' }}>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <p><strong>{t('profile.fullName')}:</strong> {trader?.name}</p>
                      <p><strong>{t('profile.email')}:</strong> {trader?.email}</p>
                      <p><strong>{t('admins.role')}:</strong> {trader?.role}</p>
                    </Col>
                    <Col span={12}>
                      <p><strong>{t('investors.joinDate')}:</strong> {trader?.joinDate}</p>
                      <p><strong>{t('common.status')}:</strong> <Tag color={trader?.status === 'active' ? 'green' : 'red'}>{trader?.status}</Tag></p>
                    </Col>
                  </Row>
                </Card>

                <Card title={t('traders.currentLimits')}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title={t('traders.dailyLimit')}
                        value={trader?.tradingLimit?.daily || 0}
                        prefix="$"
                      />
                      <Progress
                        percent={65}
                        status="active"
                        format={(percent) => `${percent}% ${t('traders.used')}`}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title={t('traders.monthlyLimit')}
                        value={trader?.tradingLimit?.monthly || 0}
                        prefix="$"
                      />
                      <Progress
                        percent={45}
                        status="active"
                        format={(percent) => `${percent}% ${t('traders.used')}`}
                      />
                    </Col>
                  </Row>
                </Card>
              </div>
            ),
          },
          {
            key: 'permissions',
            label: (
              <span>
                <LockOutlined />
                {t('traders.permissions')}
              </span>
            ),
            children: (
              <Form
                form={form}
                layout="vertical"
                initialValues={{
                  tradingEnabled: trader?.status === 'active',
                  dailyLimit: trader?.tradingLimit?.daily || 100000,
                  monthlyLimit: trader?.tradingLimit?.monthly || 2000000,
                  assignedAssets: trader?.assignedAssets || ['BTC', 'ETH'],
                  requireApproval: false,
                  notifyOnTrade: true,
                }}
              >
                <Alert
                  message={t('traders.permissionsInfo')}
                  description={t('traders.permissionsDescription')}
                  type="info"
                  showIcon
                  style={{ marginBottom: '24px' }}
                />

                <Card title={t('traders.tradingAccess')} style={{ marginBottom: '16px' }}>
                  <Form.Item
                    name="tradingEnabled"
                    valuePropName="checked"
                    label={t('traders.enableTrading')}
                  >
                    <Switch
                      checked={tradingEnabled}
                      onChange={handleToggleTrading}
                      checkedChildren={<CheckCircleOutlined />}
                      unCheckedChildren={<CloseCircleOutlined />}
                    />
                  </Form.Item>
                </Card>

                <Card title={t('traders.tradingLimits')} style={{ marginBottom: '16px' }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="dailyLimit"
                        label={t('traders.dailyLimit')}
                        rules={[{ required: true, message: t('traders.dailyLimitRequired') }]}
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          prefix="$"
                          min={0}
                          max={1000000}
                          step={10000}
                          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="monthlyLimit"
                        label={t('traders.monthlyLimit')}
                        rules={[{ required: true, message: t('traders.monthlyLimitRequired') }]}
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          prefix="$"
                          min={0}
                          max={10000000}
                          step={100000}
                          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>

                <Card title={t('traders.assetAccess')} style={{ marginBottom: '16px' }}>
                  <Form.Item
                    name="assignedAssets"
                    label={t('traders.allowedAssets')}
                    rules={[{ required: true, message: t('traders.selectAssets') }]}
                  >
                    <Select
                      mode="multiple"
                      placeholder={t('traders.selectAssetsPlaceholder')}
                      style={{ width: '100%' }}
                    >
                      {availableAssets.map(asset => (
                        <Option key={asset.value} value={asset.value}>
                          {asset.label} - ${asset.currentPrice.toLocaleString()}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Card>

                <Card title={t('traders.additionalSettings')}>
                  <Form.Item
                    name="requireApproval"
                    valuePropName="checked"
                    label={t('traders.requireApproval')}
                  >
                    <Switch />
                  </Form.Item>
                  <Form.Item
                    name="notifyOnTrade"
                    valuePropName="checked"
                    label={t('traders.notifyOnTrade')}
                  >
                    <Switch defaultChecked />
                  </Form.Item>
                  <Form.Item
                    name="notes"
                    label={t('traders.notes')}
                  >
                    <TextArea
                      rows={4}
                      placeholder={t('traders.notesPlaceholder')}
                    />
                  </Form.Item>
                </Card>
              </Form>
            ),
          },
          {
            key: 'activity',
            label: (
              <span>
                <HistoryOutlined />
                {t('traders.recentActivity')}
              </span>
            ),
            children: (
              <div>
                <Card title={t('traders.recentTrades')} style={{ marginBottom: '16px' }}>
                  <Table
                    columns={tradeColumns}
                    dataSource={recentTrades}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                    size="small"
                  />
                </Card>

                <Card title={t('traders.activityLog')}>
                  <Timeline
                    items={activityTimeline.map(item => ({
                      color: item.status === 'success' ? 'green' : item.status === 'error' ? 'red' : item.status === 'warning' ? 'orange' : 'blue',
                      children: (
                        <div>
                          <p style={{ margin: 0, fontWeight: 600 }}>{item.action}</p>
                          {item.amount && <p style={{ margin: 0, color: '#666' }}>{item.amount}</p>}
                          <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>{item.date}</p>
                        </div>
                      ),
                    }))}
                  />
                </Card>
              </div>
            ),
          },
        ]}
      />

      {/* Footer Actions */}
      <Divider />
      <div style={{ textAlign: 'right' }}>
        <Space>
          <Button onClick={handleClose}>{t('common.cancel')}</Button>
          {trader?.status === 'active' && (
            <Button
              danger
              icon={<WarningOutlined />}
              onClick={() => {
                Modal.confirm({
                  title: t('traders.suspendAccount'),
                  content: t('traders.suspendAccountConfirm', { name: trader.name }),
                  okText: t('common.yes'),
                  cancelText: t('common.no'),
                  okButtonProps: { danger: true },
                  onOk: () => {
                    message.warning(t('traders.accountSuspendedSuccess'));
                    handleClose();
                  },
                });
              }}
            >
              {t('traders.suspend')}
            </Button>
          )}
          {activeTab === 'permissions' && (
            <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleSubmit}>
              {t('traders.saveSettings')}
            </Button>
          )}
        </Space>
      </div>
    </Modal>
  );
};

export default TraderManagementModal;
