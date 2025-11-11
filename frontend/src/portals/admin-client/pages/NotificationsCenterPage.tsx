import { useState, useMemo } from 'react';
import {
  Card,
  List,
  Badge,
  Button,
  Space,
  Tabs,
  Tag,
  Select,
  Input,
  Row,
  Col,
  Statistic,
  Modal,
  Form,
  Radio,
  Checkbox,
  Switch,
  Typography,
  Divider,
  Tooltip,
  message,
} from 'antd';
import {
  BellOutlined,
  CheckOutlined,
  DeleteOutlined,
  SettingOutlined,
  FilterOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  DollarOutlined,
  SwapOutlined,
  FundOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;
const { TextArea } = Input;

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  category: 'investors' | 'nav' | 'trades' | 'compliance' | 'performance' | 'system';
  priority: 'low' | 'medium' | 'high' | 'critical';
  read: boolean;
  timestamp: string;
  actionRequired: boolean;
  actionUrl?: string;
}

export default function NotificationsCenterPage() {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [searchText, setSearchText] = useState('');
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  // Mock notifications for fund manager - replace with API call
  const notifications: Notification[] = [
    {
      id: 'NOT-001',
      title: 'New Investor Subscription',
      message: 'Michael Chen (INV-042) has subscribed for $150,000 in your fund',
      type: 'success',
      category: 'investors',
      priority: 'medium',
      read: false,
      timestamp: dayjs().subtract(10, 'minutes').toISOString(),
      actionRequired: true,
      actionUrl: '/admin-client/investors',
    },
    {
      id: 'NOT-002',
      title: 'NAV Calculation Complete',
      message: 'Daily NAV has been calculated: $127.85 per token (+0.45%)',
      type: 'info',
      category: 'nav',
      priority: 'low',
      read: false,
      timestamp: dayjs().subtract(1, 'hour').toISOString(),
      actionRequired: false,
      actionUrl: '/admin-client/nav',
    },
    {
      id: 'NOT-003',
      title: 'Large Trade Alert',
      message: 'BTC purchase order for $2.5M has been executed by Trader John',
      type: 'warning',
      category: 'trades',
      priority: 'high',
      read: false,
      timestamp: dayjs().subtract(2, 'hours').toISOString(),
      actionRequired: true,
      actionUrl: '/admin-client/traders',
    },
    {
      id: 'NOT-004',
      title: 'KYC Review Needed',
      message: 'Venture Capital Partners LLC requires KYC approval (High Net Worth)',
      type: 'warning',
      category: 'compliance',
      priority: 'high',
      read: false,
      timestamp: dayjs().subtract(3, 'hours').toISOString(),
      actionRequired: true,
      actionUrl: '/admin-client/compliance',
    },
    {
      id: 'NOT-005',
      title: 'Fund Performance Milestone',
      message: 'Your fund has reached 20% YTD return, outperforming benchmark by 7.5%',
      type: 'success',
      category: 'performance',
      priority: 'medium',
      read: true,
      timestamp: dayjs().subtract(1, 'day').toISOString(),
      actionRequired: false,
      actionUrl: '/admin-client/analytics',
    },
    {
      id: 'NOT-006',
      title: 'Redemption Request',
      message: 'Sarah Williams (INV-003) has requested redemption of $75,000',
      type: 'warning',
      category: 'investors',
      priority: 'high',
      read: false,
      timestamp: dayjs().subtract(4, 'hours').toISOString(),
      actionRequired: true,
      actionUrl: '/admin-client/investors',
    },
    {
      id: 'NOT-007',
      title: 'Monthly Report Generated',
      message: 'October 2024 Performance Report is ready for download',
      type: 'info',
      category: 'system',
      priority: 'low',
      read: true,
      timestamp: dayjs().subtract(1, 'day').toISOString(),
      actionRequired: false,
      actionUrl: '/admin-client/reports',
    },
    {
      id: 'NOT-008',
      title: 'AML Alert',
      message: 'PEP match detected for new investor Alexandra Petrov (INV-006)',
      type: 'error',
      category: 'compliance',
      priority: 'critical',
      read: false,
      timestamp: dayjs().subtract(5, 'hours').toISOString(),
      actionRequired: true,
      actionUrl: '/admin-client/compliance',
    },
    {
      id: 'NOT-009',
      title: 'Asset Rebalancing Recommended',
      message: 'BTC allocation has drifted 5% above target. Consider rebalancing.',
      type: 'info',
      category: 'trades',
      priority: 'medium',
      read: true,
      timestamp: dayjs().subtract(6, 'hours').toISOString(),
      actionRequired: false,
      actionUrl: '/admin-client/assets',
    },
    {
      id: 'NOT-010',
      title: 'Investor Limit Approaching',
      message: 'You have 245 investors. Approaching SEC limit of 250 for this fund structure.',
      type: 'warning',
      category: 'compliance',
      priority: 'medium',
      read: false,
      timestamp: dayjs().subtract(1, 'day').toISOString(),
      actionRequired: true,
      actionUrl: '/admin-client/investors',
    },
  ];

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'unread' && !notif.read) ||
        (activeTab === 'important' && notif.priority === 'high') ||
        (activeTab === 'action' && notif.actionRequired);

      const matchesType = selectedType === 'all' || notif.type === selectedType;
      const matchesPriority = selectedPriority === 'all' || notif.priority === selectedPriority;
      const matchesSearch =
        searchText === '' ||
        notif.title.toLowerCase().includes(searchText.toLowerCase()) ||
        notif.message.toLowerCase().includes(searchText.toLowerCase());

      return matchesTab && matchesType && matchesPriority && matchesSearch;
    });
  }, [notifications, activeTab, selectedType, selectedPriority, searchText]);

  // Stats
  const stats = {
    total: notifications.length,
    unread: notifications.filter((n) => !n.read).length,
    actionRequired: notifications.filter((n) => n.actionRequired && !n.read).length,
    critical: notifications.filter((n) => n.priority === 'critical' && !n.read).length,
  };

  const handleMarkAsRead = (id: string) => {
    message.success('Notification marked as read');
  };

  const handleMarkAllAsRead = () => {
    message.success('All notifications marked as read');
  };

  const handleDelete = (id: string) => {
    message.success('Notification deleted');
  };

  const handleBulkDelete = () => {
    if (selectedNotifications.length === 0) {
      message.warning('Please select notifications to delete');
      return;
    }
    message.success(`${selectedNotifications.length} notifications deleted`);
    setSelectedNotifications([]);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'warning':
        return <WarningOutlined style={{ color: '#faad14' }} />;
      case 'error':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'investors':
        return <UserOutlined />;
      case 'nav':
        return <LineChartOutlined />;
      case 'trades':
        return <SwapOutlined />;
      case 'compliance':
        return <CheckCircleOutlined />;
      case 'performance':
        return <FundOutlined />;
      default:
        return <BellOutlined />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'red';
      case 'high':
        return 'orange';
      case 'medium':
        return 'blue';
      default:
        return 'default';
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <BellOutlined style={{ marginRight: 8 }} />
          Notifications Center
        </Title>
        <Text type="secondary">
          Stay updated with fund activities, investor actions, and system alerts
        </Text>
      </div>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Notifications"
              value={stats.total}
              prefix={<BellOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Unread"
              value={stats.unread}
              valueStyle={{ color: '#1890ff' }}
              prefix={<InfoCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Action Required"
              value={stats.actionRequired}
              valueStyle={{ color: '#faad14' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Critical"
              value={stats.critical}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters and Actions */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Search notifications..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="Type"
              value={selectedType}
              onChange={setSelectedType}
            >
              <Select.Option value="all">All Types</Select.Option>
              <Select.Option value="info">Info</Select.Option>
              <Select.Option value="success">Success</Select.Option>
              <Select.Option value="warning">Warning</Select.Option>
              <Select.Option value="error">Error</Select.Option>
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="Priority"
              value={selectedPriority}
              onChange={setSelectedPriority}
            >
              <Select.Option value="all">All Priority</Select.Option>
              <Select.Option value="critical">Critical</Select.Option>
              <Select.Option value="high">High</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="low">Low</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={10}>
            <Space wrap>
              <Button icon={<CheckOutlined />} onClick={handleMarkAllAsRead}>
                Mark All Read
              </Button>
              <Button
                icon={<DeleteOutlined />}
                danger
                disabled={selectedNotifications.length === 0}
                onClick={handleBulkDelete}
              >
                Delete Selected ({selectedNotifications.length})
              </Button>
              <Button
                icon={<SettingOutlined />}
                onClick={() => setSettingsModalVisible(true)}
              >
                Settings
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Notification Tabs */}
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'all',
              label: `All (${notifications.length})`,
              children: null,
            },
            {
              key: 'unread',
              label: (
                <Badge count={stats.unread} offset={[10, 0]}>
                  Unread
                </Badge>
              ),
              children: null,
            },
            {
              key: 'important',
              label: 'Important',
              children: null,
            },
            {
              key: 'action',
              label: (
                <Badge count={stats.actionRequired} offset={[10, 0]}>
                  Action Required
                </Badge>
              ),
              children: null,
            },
          ]}
        />

        <List
          itemLayout="horizontal"
          dataSource={filteredNotifications}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} notifications`,
          }}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              style={{
                background: !item.read ? '#f0f7ff' : undefined,
                padding: '16px',
                marginBottom: 8,
                borderRadius: 4,
              }}
              actions={[
                <Tooltip title="Mark as read">
                  <Button
                    type="link"
                    icon={<CheckOutlined />}
                    size="small"
                    disabled={item.read}
                    onClick={() => handleMarkAsRead(item.id)}
                  />
                </Tooltip>,
                <Tooltip title="Delete">
                  <Button
                    type="link"
                    icon={<DeleteOutlined />}
                    size="small"
                    danger
                    onClick={() => handleDelete(item.id)}
                  />
                </Tooltip>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <div style={{ fontSize: 24 }}>
                    {getTypeIcon(item.type)}
                  </div>
                }
                title={
                  <Space>
                    {!item.read && <Badge status="processing" />}
                    <span style={{ fontWeight: item.read ? 400 : 600 }}>
                      {item.title}
                    </span>
                    {item.actionRequired && (
                      <Tag color="orange" style={{ marginLeft: 8 }}>
                        Action Required
                      </Tag>
                    )}
                    <Tag color={getPriorityColor(item.priority)} icon={getCategoryIcon(item.category)}>
                      {item.category.toUpperCase()}
                    </Tag>
                    <Tag color={getPriorityColor(item.priority)}>
                      {item.priority.toUpperCase()}
                    </Tag>
                  </Space>
                }
                description={
                  <div>
                    <div style={{ marginBottom: 8 }}>{item.message}</div>
                    <Space size="small">
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {dayjs(item.timestamp).fromNow()}
                      </Text>
                      {item.actionUrl && (
                        <Button type="link" size="small" style={{ padding: 0, height: 'auto' }}>
                          View Details →
                        </Button>
                      )}
                    </Space>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      {/* Settings Modal */}
      <Modal
        title="Notification Settings"
        open={settingsModalVisible}
        onCancel={() => setSettingsModalVisible(false)}
        onOk={() => {
          message.success('Settings saved');
          setSettingsModalVisible(false);
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Title level={5}>Email Notifications</Title>
          <Form.Item name="emailInvestors" valuePropName="checked">
            <Checkbox>New investor subscriptions and redemptions</Checkbox>
          </Form.Item>
          <Form.Item name="emailNAV" valuePropName="checked">
            <Checkbox>Daily NAV calculations</Checkbox>
          </Form.Item>
          <Form.Item name="emailTrades" valuePropName="checked">
            <Checkbox>Large trades (over $1M)</Checkbox>
          </Form.Item>
          <Form.Item name="emailCompliance" valuePropName="checked">
            <Checkbox>Compliance alerts and KYC reviews</Checkbox>
          </Form.Item>

          <Divider />

          <Title level={5}>Push Notifications</Title>
          <Form.Item name="pushCritical" valuePropName="checked">
            <Checkbox>Critical alerts only</Checkbox>
          </Form.Item>
          <Form.Item name="pushAll" valuePropName="checked">
            <Checkbox>All notifications</Checkbox>
          </Form.Item>

          <Divider />

          <Title level={5}>Notification Frequency</Title>
          <Form.Item name="frequency">
            <Radio.Group defaultValue="realtime">
              <Radio value="realtime">Real-time</Radio>
              <Radio value="hourly">Hourly digest</Radio>
              <Radio value="daily">Daily summary</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
