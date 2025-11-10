import { useState } from 'react';
import {
  Badge,
  Button,
  Calendar,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Form,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  TimePicker,
  Typography,
  message,
} from 'antd';
import type { CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import {
  BellOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { StatCard } from '../../../components/common';

const { Title, Text } = Typography;

type WindowStatus = 'open' | 'closed' | 'upcoming';
type Frequency = 'daily' | 'weekly' | 'monthly' | 'quarterly';

interface SubscriptionWindow {
  date: string;
  status: WindowStatus;
  cutoffTime: string;
  navTime: string;
  settlementDate: string;
  subscriptions: number;
  amount: number;
}

interface MarketHoliday {
  date: string;
  name: string;
  country: string;
}

interface Deadline {
  type: 'subscription' | 'nav-strike' | 'settlement' | 'redemption';
  date: string;
  description: string;
}

const mockSubscriptionWindows: SubscriptionWindow[] = [
  {
    date: '2025-11-15',
    status: 'open',
    cutoffTime: '16:00',
    navTime: '18:00',
    settlementDate: '2025-11-18',
    subscriptions: 12,
    amount: 2500000,
  },
  {
    date: '2025-11-20',
    status: 'upcoming',
    cutoffTime: '16:00',
    navTime: '18:00',
    settlementDate: '2025-11-23',
    subscriptions: 0,
    amount: 0,
  },
  {
    date: '2025-11-25',
    status: 'upcoming',
    cutoffTime: '16:00',
    navTime: '18:00',
    settlementDate: '2025-11-28',
    subscriptions: 0,
    amount: 0,
  },
  {
    date: '2025-11-05',
    status: 'closed',
    cutoffTime: '16:00',
    navTime: '18:00',
    settlementDate: '2025-11-08',
    subscriptions: 8,
    amount: 1800000,
  },
];

const mockHolidays: MarketHoliday[] = [
  { date: '2025-11-28', name: 'Thanksgiving Day', country: 'US' },
  { date: '2025-12-25', name: 'Christmas Day', country: 'US' },
  { date: '2026-01-01', name: 'New Year\'s Day', country: 'US' },
  { date: '2026-01-20', name: 'Martin Luther King Jr. Day', country: 'US' },
];

const mockDeadlines: Deadline[] = [
  {
    type: 'subscription',
    date: '2025-11-15',
    description: 'Monthly subscription window closes at 4:00 PM EST',
  },
  {
    type: 'nav-strike',
    date: '2025-11-15',
    description: 'NAV calculation at 6:00 PM EST',
  },
  {
    type: 'settlement',
    date: '2025-11-18',
    description: 'Settlement date for Nov 15 subscriptions (T+3)',
  },
  {
    type: 'redemption',
    date: '2025-11-30',
    description: 'Redemption requests due for Dec 31 window',
  },
];

const SubscriptionCalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [form] = Form.useForm();

  const statusColors: Record<WindowStatus, 'success' | 'default' | 'processing'> = {
    open: 'success',
    closed: 'default',
    upcoming: 'processing',
  };

  const deadlineColors: Record<Deadline['type'], string> = {
    subscription: 'blue',
    'nav-strike': 'purple',
    settlement: 'green',
    redemption: 'orange',
  };

  const getWindowsForDate = (date: Dayjs): SubscriptionWindow | undefined => {
    return mockSubscriptionWindows.find((w) => dayjs(w.date).isSame(date, 'day'));
  };

  const getHolidayForDate = (date: Dayjs): MarketHoliday | undefined => {
    return mockHolidays.find((h) => dayjs(h.date).isSame(date, 'day'));
  };

  const dateCellRender = (date: Dayjs) => {
    const window = getWindowsForDate(date);
    const holiday = getHolidayForDate(date);

    return (
      <div style={{ minHeight: 60 }}>
        {window && (
          <Badge status={statusColors[window.status]} text={window.status.toUpperCase()} />
        )}
        {holiday && (
          <div>
            <Tag color="red" style={{ fontSize: 10, marginTop: 4 }}>
              {holiday.name}
            </Tag>
          </div>
        )}
      </div>
    );
  };

  const onDateSelect: CalendarProps<Dayjs>['onSelect'] = (date) => {
    setSelectedDate(date);
  };

  const handleSaveConfig = () => {
    form.validateFields().then(() => {
      message.success('Subscription window configuration saved!');
      setConfigModalOpen(false);
    });
  };

  const upcomingDeadlinesColumns: ColumnsType<Deadline> = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: Deadline['type']) => (
        <Tag color={deadlineColors[type]}>{type.replace('-', ' ').toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Days Until',
      key: 'daysUntil',
      render: (_: unknown, record: Deadline) => {
        const days = dayjs(record.date).diff(dayjs(), 'day');
        return (
          <Text strong style={{ color: days <= 3 ? '#ff4d4f' : '#52c41a' }}>
            {days} days
          </Text>
        );
      },
      sorter: (a, b) => dayjs(a.date).diff(dayjs(), 'day') - dayjs(b.date).diff(dayjs(), 'day'),
    },
  ];

  const holidaysColumns: ColumnsType<MarketHoliday> = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: 'Holiday',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      render: (country: string) => <Tag>{country}</Tag>,
    },
  ];

  const selectedWindow = getWindowsForDate(selectedDate);
  const selectedHoliday = getHolidayForDate(selectedDate);

  const nextWindow = mockSubscriptionWindows
    .filter((w) => dayjs(w.date).isAfter(dayjs()))
    .sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix())[0];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3}>Subscription Calendar</Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<SettingOutlined />}
            onClick={() => setConfigModalOpen(true)}
          >
            Configure Windows
          </Button>
        </Col>
      </Row>

      {/* Metrics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <StatCard
            title="Next Window"
            value={nextWindow ? dayjs(nextWindow.date).format('MMM DD') : 'N/A'}
            icon={<CalendarOutlined />}
          />
        </Col>
        <Col xs={24} md={6}>
          <StatCard
            title="Days Until Deadline"
            value={nextWindow ? dayjs(nextWindow.date).diff(dayjs(), 'day') : 0}
            icon={<ClockCircleOutlined />}
          />
        </Col>
        <Col xs={24} md={6}>
          <StatCard
            title="Open Subscriptions"
            value={mockSubscriptionWindows.filter((w) => w.status === 'open').length}
            trend="up"
            trendValue={12}
          />
        </Col>
        <Col xs={24} md={6}>
          <StatCard
            title="MTD Subscriptions"
            value={`$${(4300000 / 1000000).toFixed(1)}M`}
            trend="up"
            trendValue={15}
          />
        </Col>
      </Row>

      {/* Calendar */}
      <Card>
        <Calendar
          value={selectedDate}
          onSelect={onDateSelect}
          cellRender={dateCellRender}
        />
      </Card>

      {/* Selected Date Details */}
      {(selectedWindow || selectedHoliday) && (
        <Card title={`Details for ${selectedDate.format('MMMM DD, YYYY')}`}>
          {selectedWindow && (
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Status">
                <Badge status={statusColors[selectedWindow.status]} text={selectedWindow.status.toUpperCase()} />
              </Descriptions.Item>
              <Descriptions.Item label="Cutoff Time">
                {selectedWindow.cutoffTime} EST
              </Descriptions.Item>
              <Descriptions.Item label="NAV Calculation Time">
                {selectedWindow.navTime} EST
              </Descriptions.Item>
              <Descriptions.Item label="Settlement Date">
                {dayjs(selectedWindow.settlementDate).format('MMM DD, YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Subscriptions">
                {selectedWindow.subscriptions}
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount">
                ${selectedWindow.amount.toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
          )}
          {selectedHoliday && (
            <Tag color="red" style={{ fontSize: 16, padding: '8px 16px' }}>
              Market Holiday: {selectedHoliday.name} ({selectedHoliday.country})
            </Tag>
          )}
        </Card>
      )}

      {/* Upcoming Deadlines */}
      <Card title={<Space><BellOutlined />Upcoming Deadlines</Space>}>
        <Table
          dataSource={mockDeadlines}
          columns={upcomingDeadlinesColumns}
          rowKey={(record) => `${record.type}-${record.date}`}
          pagination={false}
        />
      </Card>

      {/* Market Holidays */}
      <Card title="Market Holidays">
        <Table
          dataSource={mockHolidays}
          columns={holidaysColumns}
          rowKey="date"
          pagination={false}
        />
      </Card>

      {/* Configuration Modal */}
      <Modal
        title="Subscription Window Configuration"
        open={configModalOpen}
        onCancel={() => setConfigModalOpen(false)}
        onOk={handleSaveConfig}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="frequency"
                label="Subscription Frequency"
                initialValue="monthly"
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option value="daily">Daily</Select.Option>
                  <Select.Option value="weekly">Weekly</Select.Option>
                  <Select.Option value="monthly">Monthly</Select.Option>
                  <Select.Option value="quarterly">Quarterly</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="windowDay"
                label="Window Day of Month"
                initialValue={15}
                rules={[{ required: true }]}
              >
                <InputNumber min={1} max={31} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="cutoffTime"
                label="Cutoff Time (EST)"
                initialValue={dayjs('16:00', 'HH:mm')}
                rules={[{ required: true }]}
              >
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="navTime"
                label="NAV Calculation Time (EST)"
                initialValue={dayjs('18:00', 'HH:mm')}
                rules={[{ required: true }]}
              >
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="settlementPeriod"
                label="Settlement Period"
                initialValue="T+3"
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option value="T+0">T+0 (Same Day)</Select.Option>
                  <Select.Option value="T+1">T+1 (Next Day)</Select.Option>
                  <Select.Option value="T+2">T+2 (2 Days)</Select.Option>
                  <Select.Option value="T+3">T+3 (3 Days)</Select.Option>
                  <Select.Option value="T+5">T+5 (5 Days)</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="autoAdjustHolidays"
                label="Auto-Adjust for Holidays"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
            </Col>
          </Row>

          <Card title="Notification Settings" size="small" style={{ marginTop: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Form.Item
                name="emailReminders"
                label="Email Reminders"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" />
              </Form.Item>
              <Form.Item
                name="reminderDays"
                label="Send Reminder (Days Before)"
                initialValue={3}
              >
                <InputNumber min={1} max={14} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name="smsAlerts"
                label="SMS Alerts"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" />
              </Form.Item>
            </Space>
          </Card>
        </Form>
      </Modal>
    </Space>
  );
};

export default SubscriptionCalendarPage;
