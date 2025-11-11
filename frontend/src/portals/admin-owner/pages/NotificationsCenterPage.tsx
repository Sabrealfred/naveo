import { useState, useMemo } from 'react';
import {
  Card,
  List,
  Avatar,
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
} from 'antd';
import {
  BellOutlined,
  CheckOutlined,
  DeleteOutlined,
  SettingOutlined,
  SendOutlined,
  FilterOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  TeamOutlined,
  BankOutlined,
  SafetyOutlined,
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
  category: 'system' | 'compliance' | 'funds' | 'users' | 'transactions' | 'tokenization';
  priority: 'low' | 'medium' | 'high' | 'critical';
  read: boolean;
  timestamp: string;
  actionRequired: boolean;
  recipient: string;
}

export default function NotificationsCenterPage() {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [searchText, setSearchText] = useState('');
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  // Mock notifications - replace with API call
  const notifications: Notification[] = [
    {
      id: 'NOT-TOK-001',
      title: 'Investor Suitability Assessment Pending',
      message: 'Turkish Real Estate Fund I: 5 US investors need to complete suitability assessment questionnaire',
      type: 'warning',
      category: 'tokenization',
      priority: 'high',
      read: false,
      timestamp: '2024-11-12T15:45:00Z',
      actionRequired: true,
      recipient: 'Tokenization Team',
    },
    {
      id: 'NOT-TOK-002',
      title: 'SPK Approval Received',
      message: 'Ankara Industrial Portfolio: Turkish SPK approval received for cross-border tokenization',
      type: 'success',
      category: 'tokenization',
      priority: 'high',
      read: false,
      timestamp: '2024-11-12T14:20:00Z',
      actionRequired: false,
      recipient: 'Admin Owner',
    },
    {
      id: 'NOT-TOK-003',
      title: 'Smart Contract Audit Completed',
      message: 'Istanbul Commercial Properties: ERC-3643 security audit completed by CertiK with 0 critical issues',
      type: 'success',
      category: 'tokenization',
      priority: 'medium',
      read: false,
      timestamp: '2024-11-12T11:30:00Z',
      actionRequired: false,
      recipient: 'Technical Team',
    },
    {
      id: 'NOT-TOK-004',
      title: 'PPM Documents Updated',
      message: 'Turkish Real Estate Fund I: PPM v2.1 approved and ready for investor distribution',
      type: 'info',
      category: 'tokenization',
      priority: 'medium',
      read: false,
      timestamp: '2024-11-12T09:15:00Z',
      actionRequired: false,
      recipient: 'Legal Team',
    },
    {
      id: 'NOT-TOK-005',
      title: 'Accreditation Verification Completed',
      message: '15 new US accredited investors verified and approved for token purchase',
      type: 'success',
      category: 'tokenization',
      priority: 'medium',
      read: true,
      timestamp: '2024-11-10T16:00:00Z',
      actionRequired: false,
      recipient: 'Compliance Team',
    },
    {
      id: 'NOT-TOK-006',
      title: 'SEC Form D Filing Due',
      message: 'Turkish Real Estate Fund I: SEC Form D amendment due within 5 business days',
      type: 'warning',
      category: 'tokenization',
      priority: 'critical',
      read: false,
      timestamp: '2024-11-11T08:00:00Z',
      actionRequired: true,
      recipient: 'Compliance Team',
    },
    {
      id: 'NOT-001',
      title: 'KYC Approval Required',
      message: 'Investor INV-445 has submitted KYC documents for review',
      type: 'warning',
      category: 'compliance',
      priority: 'high',
      read: false,
      timestamp: '2024-11-10T14:30:00Z',
      actionRequired: true,
      recipient: 'Compliance Team',
    },
    {
      id: 'NOT-002',
      title: 'Smart Contract Upgraded Successfully',
      message: 'ERC-20 Token Contract upgraded to v2.1.0 on Polygon network',
      type: 'success',
      category: 'system',
      priority: 'medium',
      read: false,
      timestamp: '2024-11-10T13:15:00Z',
      actionRequired: false,
      recipient: 'All Admins',
    },
    {
      id: 'NOT-003',
      title: 'Large Withdrawal Request',
      message: 'Investor Alice Johnson requested withdrawal of $250,000 from Alpha Growth Fund',
      type: 'warning',
      category: 'transactions',
      priority: 'high',
      read: false,
      timestamp: '2024-11-10T12:45:00Z',
      actionRequired: true,
      recipient: 'Fund Officers',
    },
    {
      id: 'NOT-004',
      title: 'System Maintenance Scheduled',
      message: 'Scheduled system maintenance on November 15, 2024 from 2:00 AM - 4:00 AM UTC',
      type: 'info',
      category: 'system',
      priority: 'low',
      read: true,
      timestamp: '2024-11-10T10:00:00Z',
      actionRequired: false,
      recipient: 'All Users',
    },
    {
      id: 'NOT-005',
      title: 'Failed Login Attempts Detected',
      message: 'Multiple failed login attempts detected from IP 203.45.67.89',
      type: 'error',
      category: 'system',
      priority: 'critical',
      read: false,
      timestamp: '2024-11-10T09:30:00Z',
      actionRequired: true,
      recipient: 'Security Team',
    },
    {
      id: 'NOT-006',
      title: 'New Fund Created',
      message: 'Delta Stable Fund has been successfully created and is ready for configuration',
      type: 'success',
      category: 'funds',
      priority: 'medium',
      read: true,
      timestamp: '2024-11-10T08:00:00Z',
      actionRequired: false,
      recipient: 'Fund Managers',
    },
    {
      id: 'NOT-007',
      title: 'User Access Suspended',
      message: 'User account USR-234 has been suspended due to policy violation',
      type: 'warning',
      category: 'users',
      priority: 'high',
      read: true,
      timestamp: '2024-11-09T16:20:00Z',
      actionRequired: false,
      recipient: 'Admin Team',
    },
    {
      id: 'NOT-008',
      title: 'Monthly Report Ready',
      message: 'October 2024 performance report is ready for download',
      type: 'info',
      category: 'system',
      priority: 'low',
      read: true,
      timestamp: '2024-11-01T00:00:00Z',
      actionRequired: false,
      recipient: 'All Admins',
    },
  ];

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'unread' && !notification.read) ||
        (activeTab === 'action' && notification.actionRequired);

      const matchesType = selectedType === 'all' || notification.type === selectedType;

      const matchesPriority =
        selectedPriority === 'all' || notification.priority === selectedPriority;

      const matchesSearch =
        searchText === '' ||
        notification.title.toLowerCase().includes(searchText.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchText.toLowerCase());

      return matchesTab && matchesType && matchesPriority && matchesSearch;
    });
  }, [notifications, activeTab, selectedType, selectedPriority, searchText]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: notifications.length,
      unread: notifications.filter((n) => !n.read).length,
      actionRequired: notifications.filter((n) => n.actionRequired).length,
      critical: notifications.filter((n) => n.priority === 'critical').length,
    };
  }, [notifications]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
      case 'success':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'warning':
        return <WarningOutlined style={{ color: '#faad14' }} />;
      case 'error':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <BellOutlined />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'users':
        return <UserOutlined />;
      case 'funds':
        return <BankOutlined />;
      case 'compliance':
        return <SafetyOutlined />;
      case 'transactions':
        return <TeamOutlined />;
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
      case 'low':
        return 'default';
      default:
        return 'default';
    }
  };

  const markAsRead = (id: string) => {
    console.log('Marking as read:', id);
  };

  const markAllAsRead = () => {
    console.log('Marking all as read');
  };

  const deleteNotification = (id: string) => {
    console.log('Deleting notification:', id);
  };

  const handleSendNotification = () => {
    form.validateFields().then((values) => {
      console.log('Sending notification:', values);
      setSendModalVisible(false);
      form.resetFields();
    });
  };

  const tabItems = [
    {
      key: 'all',
      label: (
        <Badge count={stats.total} offset={[10, 0]}>
          <span>All Notifications</span>
        </Badge>
      ),
    },
    {
      key: 'unread',
      label: (
        <Badge count={stats.unread} offset={[10, 0]}>
          <span>Unread</span>
        </Badge>
      ),
    },
    {
      key: 'action',
      label: (
        <Badge count={stats.actionRequired} offset={[10, 0]} color="orange">
          <span>Action Required</span>
        </Badge>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <div>
          <Title level={2}>Notifications Center</Title>
          <Text type="secondary">Manage system notifications and alerts</Text>
        </div>
        <Space>
          <Button icon={<SettingOutlined />} onClick={() => setSettingsModalVisible(true)}>
            Settings
          </Button>
          <Button type="primary" icon={<SendOutlined />} onClick={() => setSendModalVisible(true)}>
            Send Notification
          </Button>
        </Space>
      </div>

      {/* Stats Overview */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Total Notifications"
              value={stats.total}
              prefix={<BellOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Unread"
              value={stats.unread}
              prefix={<BellOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Action Required"
              value={stats.actionRequired}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#ff7a45' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Critical"
              value={stats.critical}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: '16px' }}>
        <Space wrap style={{ width: '100%' }}>
          <Input
            placeholder="Search notifications..."
            prefix={<BellOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          <Select
            placeholder="Filter by type"
            style={{ width: 150 }}
            value={selectedType}
            onChange={setSelectedType}
          >
            <Select.Option value="all">All Types</Select.Option>
            <Select.Option value="info">Info</Select.Option>
            <Select.Option value="success">Success</Select.Option>
            <Select.Option value="warning">Warning</Select.Option>
            <Select.Option value="error">Error</Select.Option>
          </Select>
          <Select
            placeholder="Filter by priority"
            style={{ width: 150 }}
            value={selectedPriority}
            onChange={setSelectedPriority}
          >
            <Select.Option value="all">All Priorities</Select.Option>
            <Select.Option value="low">Low</Select.Option>
            <Select.Option value="medium">Medium</Select.Option>
            <Select.Option value="high">High</Select.Option>
            <Select.Option value="critical">Critical</Select.Option>
          </Select>
          <Button
            icon={<FilterOutlined />}
            onClick={() => {
              setSearchText('');
              setSelectedType('all');
              setSelectedPriority('all');
            }}
          >
            Clear Filters
          </Button>
          <Button icon={<CheckOutlined />} onClick={markAllAsRead}>
            Mark All as Read
          </Button>
        </Space>
      </Card>

      {/* Notifications List */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
        <List
          itemLayout="horizontal"
          dataSource={filteredNotifications}
          renderItem={(notification) => (
            <List.Item
              style={{
                backgroundColor: notification.read ? 'transparent' : '#f0f5ff',
                padding: '16px',
                borderRadius: '4px',
                marginBottom: '8px',
              }}
              actions={[
                <Tooltip title="Mark as read">
                  <Button
                    type="link"
                    icon={<CheckOutlined />}
                    onClick={() => markAsRead(notification.id)}
                    disabled={notification.read}
                  />
                </Tooltip>,
                <Tooltip title="Delete">
                  <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => deleteNotification(notification.id)}
                  />
                </Tooltip>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Badge dot={!notification.read}>
                    <Avatar
                      style={{
                        backgroundColor:
                          notification.type === 'error'
                            ? '#ff4d4f'
                            : notification.type === 'warning'
                            ? '#faad14'
                            : notification.type === 'success'
                            ? '#52c41a'
                            : '#1890ff',
                      }}
                      icon={getCategoryIcon(notification.category)}
                    />
                  </Badge>
                }
                title={
                  <Space>
                    {getTypeIcon(notification.type)}
                    <Text strong={!notification.read}>{notification.title}</Text>
                    <Tag color={getPriorityColor(notification.priority)}>
                      {notification.priority.toUpperCase()}
                    </Tag>
                    {notification.actionRequired && (
                      <Tag color="orange" icon={<WarningOutlined />}>
                        ACTION REQUIRED
                      </Tag>
                    )}
                  </Space>
                }
                description={
                  <Space direction="vertical" size={4} style={{ width: '100%' }}>
                    <Text>{notification.message}</Text>
                    <Space size="large">
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {dayjs(notification.timestamp).fromNow()}
                      </Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        To: {notification.recipient}
                      </Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Category: {notification.category}
                      </Text>
                    </Space>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      {/* Send Notification Modal */}
      <Modal
        title="Send New Notification"
        open={sendModalVisible}
        onOk={handleSendNotification}
        onCancel={() => {
          setSendModalVisible(false);
          form.resetFields();
        }}
        width={600}
      >
        <Form form={form} layout="vertical" style={{ marginTop: '24px' }}>
          <Form.Item
            label="Recipient"
            name="recipient"
            rules={[{ required: true, message: 'Please select recipient' }]}
          >
            <Select placeholder="Select recipient group">
              <Select.Option value="all">All Users</Select.Option>
              <Select.Option value="admins">All Admins</Select.Option>
              <Select.Option value="fund_officers">Fund Officers</Select.Option>
              <Select.Option value="compliance">Compliance Team</Select.Option>
              <Select.Option value="investors">All Investors</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please enter title' }]}
          >
            <Input placeholder="Notification title" />
          </Form.Item>

          <Form.Item
            label="Message"
            name="message"
            rules={[{ required: true, message: 'Please enter message' }]}
          >
            <TextArea rows={4} placeholder="Notification message" />
          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            initialValue="info"
            rules={[{ required: true }]}
          >
            <Radio.Group>
              <Radio value="info">Info</Radio>
              <Radio value="success">Success</Radio>
              <Radio value="warning">Warning</Radio>
              <Radio value="error">Error</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Priority"
            name="priority"
            initialValue="medium"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="low">Low</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="high">High</Select.Option>
              <Select.Option value="critical">Critical</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Action Required" name="actionRequired" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      {/* Settings Modal */}
      <Modal
        title="Notification Settings"
        open={settingsModalVisible}
        onOk={() => setSettingsModalVisible(false)}
        onCancel={() => setSettingsModalVisible(false)}
        width={600}
      >
        <Space direction="vertical" size="large" style={{ width: '100%', marginTop: '24px' }}>
          <div>
            <Title level={5}>Email Notifications</Title>
            <Divider style={{ margin: '12px 0' }} />
            <Space direction="vertical" style={{ width: '100%' }}>
              <Checkbox defaultChecked>Send email for critical notifications</Checkbox>
              <Checkbox defaultChecked>Send email for high priority notifications</Checkbox>
              <Checkbox>Send email for medium priority notifications</Checkbox>
              <Checkbox>Send daily digest</Checkbox>
            </Space>
          </div>

          <div>
            <Title level={5}>Push Notifications</Title>
            <Divider style={{ margin: '12px 0' }} />
            <Space direction="vertical" style={{ width: '100%' }}>
              <Checkbox defaultChecked>Enable push notifications</Checkbox>
              <Checkbox defaultChecked>Play sound for notifications</Checkbox>
              <Checkbox defaultChecked>Show desktop notifications</Checkbox>
            </Space>
          </div>

          <div>
            <Title level={5}>Notification Categories</Title>
            <Divider style={{ margin: '12px 0' }} />
            <Space direction="vertical" style={{ width: '100%' }}>
              <Checkbox defaultChecked>System notifications</Checkbox>
              <Checkbox defaultChecked>Compliance alerts</Checkbox>
              <Checkbox defaultChecked>Fund updates</Checkbox>
              <Checkbox defaultChecked>User activity</Checkbox>
              <Checkbox defaultChecked>Transaction alerts</Checkbox>
            </Space>
          </div>
        </Space>
      </Modal>
    </div>
  );
}
