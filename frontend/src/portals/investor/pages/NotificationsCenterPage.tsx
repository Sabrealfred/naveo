import { Card, List, Badge, Button, Space, Tag, Tabs, Switch, Row, Col, Divider, Empty, Avatar, Select } from 'antd';
import {
  BellOutlined,
  MailOutlined,
  CheckOutlined,
  DeleteOutlined,
  SettingOutlined,
  DollarOutlined,
  TrophyOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function NotificationsCenterPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock data for notifications
  const notifications = [
    {
      id: 1,
      type: 'transaction',
      title: 'Purchase Confirmed',
      message: 'Your purchase of 78.2 shares in Alpha Growth Fund has been confirmed.',
      timestamp: '2024-11-10T14:30:00',
      read: false,
      icon: <DollarOutlined />,
      color: '#52c41a',
    },
    {
      id: 2,
      type: 'performance',
      title: 'Portfolio Milestone',
      message: 'Congratulations! Your portfolio value has reached $150,000.',
      timestamp: '2024-11-09T09:15:00',
      read: false,
      icon: <TrophyOutlined />,
      color: '#faad14',
    },
    {
      id: 3,
      type: 'alert',
      title: 'Market Volatility Alert',
      message: 'High volatility detected in Beta Stable Fund. Review your holdings.',
      timestamp: '2024-11-08T16:45:00',
      read: true,
      icon: <WarningOutlined />,
      color: '#ff4d4f',
    },
    {
      id: 4,
      type: 'document',
      title: 'New Statement Available',
      message: 'Your October 2024 monthly statement is now available for download.',
      timestamp: '2024-11-01T08:00:00',
      read: true,
      icon: <FileTextOutlined />,
      color: '#1890ff',
    },
    {
      id: 5,
      type: 'info',
      title: 'NAV Update',
      message: 'Alpha Growth Fund NAV updated to $127.85 (+ 2.3%)',
      timestamp: '2024-10-31T18:00:00',
      read: true,
      icon: <InfoCircleOutlined />,
      color: '#722ed1',
    },
    {
      id: 6,
      type: 'transaction',
      title: 'Dividend Distribution',
      message: 'You received $245.50 in dividends from your holdings.',
      timestamp: '2024-10-30T10:00:00',
      read: true,
      icon: <DollarOutlined />,
      color: '#52c41a',
    },
  ];

  const [notificationList, setNotificationList] = useState(notifications);
  const unreadCount = notificationList.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotificationList(notificationList.map(n => ({ ...n, read: true })));
  };

  const handleMarkRead = (id: number) => {
    setNotificationList(notificationList.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleDelete = (id: number) => {
    setNotificationList(notificationList.filter(n => n.id !== id));
  };

  const filteredNotifications = selectedFilter === 'all'
    ? notificationList
    : selectedFilter === 'unread'
    ? notificationList.filter(n => !n.read)
    : notificationList.filter(n => n.type === selectedFilter);

  const NotificationItem = ({ notification }: { notification: any }) => (
    <List.Item
      style={{
        backgroundColor: notification.read ? 'transparent' : '#f0f5ff',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '8px',
      }}
      actions={[
        !notification.read && (
          <Button
            type="text"
            size="small"
            icon={<CheckOutlined />}
            onClick={() => handleMarkRead(notification.id)}
          >
            Mark Read
          </Button>
        ),
        <Button
          type="text"
          size="small"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(notification.id)}
        >
          Delete
        </Button>,
      ].filter(Boolean)}
    >
      <List.Item.Meta
        avatar={
          <Avatar
            style={{ backgroundColor: notification.color }}
            icon={notification.icon}
          />
        }
        title={
          <Space>
            {notification.title}
            {!notification.read && <Badge status="processing" />}
          </Space>
        }
        description={
          <>
            <div style={{ marginBottom: 4 }}>{notification.message}</div>
            <span style={{ fontSize: '12px', color: '#999' }}>
              {dayjs(notification.timestamp).fromNow()}
            </span>
          </>
        }
      />
    </List.Item>
  );

  // Notification preferences
  const notificationPreferences = [
    {
      category: 'Transactions',
      items: [
        { label: 'Purchase confirmations', email: true, push: true },
        { label: 'Redemption confirmations', email: true, push: true },
        { label: 'Dividend distributions', email: true, push: false },
        { label: 'Fee deductions', email: true, push: false },
      ],
    },
    {
      category: 'Performance',
      items: [
        { label: 'Daily performance updates', email: false, push: false },
        { label: 'Weekly performance summary', email: true, push: false },
        { label: 'Portfolio milestones', email: true, push: true },
        { label: 'NAV updates', email: false, push: false },
      ],
    },
    {
      category: 'Alerts',
      items: [
        { label: 'Market volatility alerts', email: true, push: true },
        { label: 'Price target alerts', email: true, push: true },
        { label: 'Significant price changes', email: true, push: false },
      ],
    },
    {
      category: 'Documents',
      items: [
        { label: 'New statements available', email: true, push: false },
        { label: 'Tax documents ready', email: true, push: true },
        { label: 'Important announcements', email: true, push: true },
      ],
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '28px' }}>
            <BellOutlined style={{ marginRight: 12 }} />
            Notifications
            {unreadCount > 0 && (
              <Badge count={unreadCount} style={{ marginLeft: 12 }} />
            )}
          </h1>
          <p style={{ margin: '8px 0 0 0', color: '#666' }}>
            Stay updated with your investment activity
          </p>
        </div>
        <Button type="primary" onClick={handleMarkAllRead} disabled={unreadCount === 0}>
          Mark All as Read
        </Button>
      </div>

      <Tabs
        defaultActiveKey="notifications"
        items={[
          {
            key: 'notifications',
            label: 'Notifications',
            children: (
              <Card>
                {/* Filters */}
                <div style={{ marginBottom: 16 }}>
                  <Space wrap>
                    <Select
                      value={selectedFilter}
                      style={{ width: 180 }}
                      onChange={setSelectedFilter}
                      options={[
                        { value: 'all', label: 'All Notifications' },
                        { value: 'unread', label: `Unread (${unreadCount})` },
                        { value: 'transaction', label: 'Transactions' },
                        { value: 'performance', label: 'Performance' },
                        { value: 'alert', label: 'Alerts' },
                        { value: 'document', label: 'Documents' },
                        { value: 'info', label: 'Info' },
                      ]}
                    />
                  </Space>
                </div>

                {/* Notifications List */}
                {filteredNotifications.length > 0 ? (
                  <List
                    dataSource={filteredNotifications}
                    renderItem={(notification) => (
                      <NotificationItem notification={notification} />
                    )}
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: false,
                    }}
                  />
                ) : (
                  <Empty
                    description={
                      selectedFilter === 'unread'
                        ? 'No unread notifications'
                        : 'No notifications to display'
                    }
                    style={{ padding: '48px 0' }}
                  />
                )}
              </Card>
            ),
          },
          {
            key: 'preferences',
            label: (
              <Space>
                <SettingOutlined />
                Preferences
              </Space>
            ),
            children: (
              <Card>
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ marginBottom: 8 }}>Notification Preferences</h3>
                  <p style={{ color: '#666' }}>
                    Choose how you want to receive notifications
                  </p>
                </div>

                {notificationPreferences.map((category, index) => (
                  <div key={index}>
                    <h4 style={{ marginBottom: 16, fontWeight: 600 }}>
                      {category.category}
                    </h4>
                    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                      {category.items.map((item, itemIndex) => (
                        <Col span={24} key={itemIndex}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px 16px',
                            backgroundColor: '#fafafa',
                            borderRadius: '8px',
                          }}>
                            <span>{item.label}</span>
                            <Space size="large">
                              <Space>
                                <MailOutlined />
                                <Switch defaultChecked={item.email} />
                              </Space>
                              <Space>
                                <BellOutlined />
                                <Switch defaultChecked={item.push} />
                              </Space>
                            </Space>
                          </div>
                        </Col>
                      ))}
                    </Row>
                    {index < notificationPreferences.length - 1 && (
                      <Divider />
                    )}
                  </div>
                ))}

                <Divider />

                <div style={{ marginTop: 24 }}>
                  <h4 style={{ marginBottom: 16, fontWeight: 600 }}>
                    Notification Frequency
                  </h4>
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        backgroundColor: '#fafafa',
                        borderRadius: '8px',
                      }}>
                        <div>
                          <div style={{ fontWeight: 500 }}>Daily Digest</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            Receive a daily summary of all notifications
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </Col>
                    <Col span={24}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        backgroundColor: '#fafafa',
                        borderRadius: '8px',
                      }}>
                        <div>
                          <div style={{ fontWeight: 500 }}>Do Not Disturb</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            Pause all non-critical notifications
                          </div>
                        </div>
                        <Switch />
                      </div>
                    </Col>
                  </Row>
                </div>

                <div style={{ marginTop: 32, textAlign: 'right' }}>
                  <Space>
                    <Button>Reset to Defaults</Button>
                    <Button type="primary">Save Preferences</Button>
                  </Space>
                </div>
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
}
