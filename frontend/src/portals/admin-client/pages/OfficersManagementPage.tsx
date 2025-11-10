import { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Avatar,
  Tooltip,
  Badge,
  Row,
  Col,
  Statistic,
  Typography,
  Descriptions,
  Drawer,
  Timeline,
} from 'antd';
import {
  UserAddOutlined,
  EditOutlined,
  LockOutlined,
  UnlockOutlined,
  HistoryOutlined,
  TeamOutlined,
  SafetyOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface Officer {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Fund Officer' | 'Sub-Admin' | 'Compliance Officer' | 'Risk Officer';
  permissions: string[];
  status: 'active' | 'inactive' | 'suspended';
  department: string;
  joinedDate: string;
  lastLogin: string;
  avatar?: string;
}

interface ActivityLog {
  timestamp: string;
  action: string;
  description: string;
}

export default function OfficersManagementPage() {
  const [form] = Form.useForm();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [activityDrawerVisible, setActivityDrawerVisible] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);

  // Mock data - replace with API call
  const officers: Officer[] = [
    {
      id: 'OFF-001',
      name: 'Michael Chen',
      email: 'michael.chen@alphafund.com',
      phone: '+1 (555) 234-5678',
      role: 'Fund Officer',
      permissions: ['fund_management', 'nav_calculation', 'reporting', 'investor_approval'],
      status: 'active',
      department: 'Fund Operations',
      joinedDate: '2023-01-15',
      lastLogin: '2024-11-10T10:30:00Z',
    },
    {
      id: 'OFF-002',
      name: 'Sarah Williams',
      email: 'sarah.williams@alphafund.com',
      phone: '+1 (555) 345-6789',
      role: 'Compliance Officer',
      permissions: ['compliance_review', 'kyc_approval', 'audit_logs', 'reporting'],
      status: 'active',
      department: 'Compliance',
      joinedDate: '2023-03-20',
      lastLogin: '2024-11-10T09:15:00Z',
    },
    {
      id: 'OFF-003',
      name: 'David Martinez',
      email: 'david.martinez@alphafund.com',
      phone: '+1 (555) 456-7890',
      role: 'Sub-Admin',
      permissions: ['asset_management', 'trader_oversight', 'rebalancing'],
      status: 'active',
      department: 'Investment Team',
      joinedDate: '2023-06-10',
      lastLogin: '2024-11-10T11:45:00Z',
    },
    {
      id: 'OFF-004',
      name: 'Jennifer Park',
      email: 'jennifer.park@alphafund.com',
      phone: '+1 (555) 567-8901',
      role: 'Risk Officer',
      permissions: ['risk_assessment', 'compliance_review', 'reporting'],
      status: 'active',
      department: 'Risk Management',
      joinedDate: '2023-08-05',
      lastLogin: '2024-11-10T08:20:00Z',
    },
    {
      id: 'OFF-005',
      name: 'Robert Johnson',
      email: 'robert.johnson@alphafund.com',
      phone: '+1 (555) 678-9012',
      role: 'Sub-Admin',
      permissions: ['investor_support', 'transaction_review'],
      status: 'inactive',
      department: 'Client Services',
      joinedDate: '2022-11-12',
      lastLogin: '2024-10-15T14:30:00Z',
    },
  ];

  const activityLogs: ActivityLog[] = [
    {
      timestamp: '2024-11-10T10:30:00Z',
      action: 'Login',
      description: 'Logged in from IP 192.168.1.100',
    },
    {
      timestamp: '2024-11-10T10:35:00Z',
      action: 'NAV Calculation',
      description: 'Calculated NAV for all funds',
    },
    {
      timestamp: '2024-11-10T11:00:00Z',
      action: 'Report Generation',
      description: 'Generated monthly performance report',
    },
    {
      timestamp: '2024-11-09T15:20:00Z',
      action: 'Investor Approval',
      description: 'Approved investor INV-445 subscription request',
    },
  ];

  const permissionOptions = [
    { label: 'Fund Management', value: 'fund_management' },
    { label: 'NAV Calculation', value: 'nav_calculation' },
    { label: 'Asset Management', value: 'asset_management' },
    { label: 'Trader Oversight', value: 'trader_oversight' },
    { label: 'Rebalancing', value: 'rebalancing' },
    { label: 'Investor Approval', value: 'investor_approval' },
    { label: 'Compliance Review', value: 'compliance_review' },
    { label: 'KYC Approval', value: 'kyc_approval' },
    { label: 'Risk Assessment', value: 'risk_assessment' },
    { label: 'Reporting', value: 'reporting' },
    { label: 'Audit Logs', value: 'audit_logs' },
    { label: 'Transaction Review', value: 'transaction_review' },
    { label: 'Investor Support', value: 'investor_support' },
  ];

  const handleAddOfficer = () => {
    form.validateFields().then((values) => {
      console.log('Adding new officer:', values);
      setAddModalVisible(false);
      form.resetFields();
    });
  };

  const handleEditOfficer = () => {
    form.validateFields().then((values) => {
      console.log('Updating officer:', values);
      setEditModalVisible(false);
      form.resetFields();
    });
  };

  const openEditModal = (officer: Officer) => {
    setSelectedOfficer(officer);
    form.setFieldsValue(officer);
    setEditModalVisible(true);
  };

  const openActivityDrawer = (officer: Officer) => {
    setSelectedOfficer(officer);
    setActivityDrawerVisible(true);
  };

  const toggleOfficerStatus = (officer: Officer) => {
    console.log('Toggling status for:', officer.id);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Fund Officer':
        return 'blue';
      case 'Compliance Officer':
        return 'green';
      case 'Risk Officer':
        return 'orange';
      case 'Sub-Admin':
        return 'purple';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'suspended':
        return 'error';
      default:
        return 'default';
    }
  };

  const columns: ColumnsType<Officer> = [
    {
      title: 'Officer',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (name: string, record: Officer) => (
        <Space>
          <Avatar
            style={{ backgroundColor: '#1890ff' }}
            icon={record.avatar ? undefined : <UserOutlined />}
            src={record.avatar}
          >
            {!record.avatar && name.charAt(0).toUpperCase()}
          </Avatar>
          <Space direction="vertical" size={0}>
            <Text strong>{name}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.email}
            </Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 180,
      render: (role: string) => <Tag color={getRoleColor(role)}>{role}</Tag>,
      filters: [
        { text: 'Fund Officer', value: 'Fund Officer' },
        { text: 'Sub-Admin', value: 'Sub-Admin' },
        { text: 'Compliance Officer', value: 'Compliance Officer' },
        { text: 'Risk Officer', value: 'Risk Officer' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 150,
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      width: 200,
      render: (permissions: string[]) => (
        <Tooltip
          title={
            <div>
              {permissions.map((perm) => (
                <div key={perm}>{perm.replace(/_/g, ' ')}</div>
              ))}
            </div>
          }
        >
          <Tag color="blue">{permissions.length} permissions</Tag>
        </Tooltip>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Badge
          status={status === 'active' ? 'success' : status === 'suspended' ? 'error' : 'default'}
          text={status.charAt(0).toUpperCase() + status.slice(1)}
        />
      ),
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
        { text: 'Suspended', value: 'suspended' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      width: 180,
      render: (lastLogin: string) => (
        <Text style={{ fontSize: '13px' }}>
          {dayjs(lastLogin).format('MMM DD, YYYY HH:mm')}
        </Text>
      ),
      sorter: (a, b) => dayjs(a.lastLogin).unix() - dayjs(b.lastLogin).unix(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit Officer">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => openEditModal(record)}
            />
          </Tooltip>
          <Tooltip title="Activity History">
            <Button
              type="link"
              icon={<HistoryOutlined />}
              onClick={() => openActivityDrawer(record)}
            />
          </Tooltip>
          <Tooltip title={record.status === 'active' ? 'Suspend Access' : 'Activate Access'}>
            <Button
              type="link"
              icon={record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />}
              danger={record.status === 'active'}
              onClick={() => toggleOfficerStatus(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const stats = {
    total: officers.length,
    active: officers.filter((o) => o.status === 'active').length,
    inactive: officers.filter((o) => o.status === 'inactive').length,
    suspended: officers.filter((o) => o.status === 'suspended').length,
  };

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
          <Title level={2}>Officers & Sub-Admins</Title>
          <Text type="secondary">Manage fund officers, sub-admins, and their permissions</Text>
        </div>
        <Button type="primary" icon={<UserAddOutlined />} onClick={() => setAddModalVisible(true)}>
          Add Officer
        </Button>
      </div>

      {/* Stats Overview */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Officers"
              value={stats.total}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active"
              value={stats.active}
              prefix={<SafetyOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Inactive"
              value={stats.inactive}
              valueStyle={{ color: '#8c8c8c' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Suspended"
              value={stats.suspended}
              prefix={<LockOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Officers Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={officers}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} officers`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Add Officer Modal */}
      <Modal
        title="Add New Officer"
        open={addModalVisible}
        onOk={handleAddOfficer}
        onCancel={() => {
          setAddModalVisible(false);
          form.resetFields();
        }}
        width={600}
      >
        <Form form={form} layout="vertical" style={{ marginTop: '24px' }}>
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: 'Please enter full name' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="John Doe" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="john.doe@alphafund.com" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: 'Please enter phone number' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="+1 (555) 123-4567" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select placeholder="Select role">
              <Select.Option value="Fund Officer">Fund Officer</Select.Option>
              <Select.Option value="Sub-Admin">Sub-Admin</Select.Option>
              <Select.Option value="Compliance Officer">Compliance Officer</Select.Option>
              <Select.Option value="Risk Officer">Risk Officer</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Department"
            name="department"
            rules={[{ required: true, message: 'Please enter department' }]}
          >
            <Input placeholder="Fund Operations" />
          </Form.Item>

          <Form.Item
            label="Permissions"
            name="permissions"
            rules={[{ required: true, message: 'Please select at least one permission' }]}
          >
            <Select mode="multiple" placeholder="Select permissions" options={permissionOptions} />
          </Form.Item>

          <Form.Item label="Status" name="status" initialValue="active">
            <Select>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Notes" name="notes">
            <TextArea rows={3} placeholder="Additional notes or comments" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Officer Modal */}
      <Modal
        title="Edit Officer"
        open={editModalVisible}
        onOk={handleEditOfficer}
        onCancel={() => {
          setEditModalVisible(false);
          form.resetFields();
        }}
        width={600}
      >
        <Form form={form} layout="vertical" style={{ marginTop: '24px' }}>
          <Form.Item label="Full Name" name="name">
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item label="Phone" name="phone">
            <Input prefix={<PhoneOutlined />} />
          </Form.Item>

          <Form.Item label="Role" name="role">
            <Select>
              <Select.Option value="Fund Officer">Fund Officer</Select.Option>
              <Select.Option value="Sub-Admin">Sub-Admin</Select.Option>
              <Select.Option value="Compliance Officer">Compliance Officer</Select.Option>
              <Select.Option value="Risk Officer">Risk Officer</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Department" name="department">
            <Input />
          </Form.Item>

          <Form.Item label="Permissions" name="permissions">
            <Select mode="multiple" options={permissionOptions} />
          </Form.Item>

          <Form.Item label="Status" name="status">
            <Select>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
              <Select.Option value="suspended">Suspended</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Activity Drawer */}
      <Drawer
        title={
          <Space>
            <Avatar style={{ backgroundColor: '#1890ff' }}>
              {selectedOfficer?.name.charAt(0).toUpperCase()}
            </Avatar>
            <div>
              <div>{selectedOfficer?.name}</div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Activity History
              </Text>
            </div>
          </Space>
        }
        width={500}
        open={activityDrawerVisible}
        onClose={() => setActivityDrawerVisible(false)}
      >
        {selectedOfficer && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Officer ID">{selectedOfficer.id}</Descriptions.Item>
              <Descriptions.Item label="Role">
                <Tag color={getRoleColor(selectedOfficer.role)}>{selectedOfficer.role}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Department">
                {selectedOfficer.department}
              </Descriptions.Item>
              <Descriptions.Item label="Joined">
                {dayjs(selectedOfficer.joinedDate).format('MMMM DD, YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Last Login">
                {dayjs(selectedOfficer.lastLogin).format('MMMM DD, YYYY HH:mm')}
              </Descriptions.Item>
            </Descriptions>

            <Card title="Recent Activity" size="small">
              <Timeline
                items={activityLogs.map((log) => ({
                  children: (
                    <div>
                      <Text strong>{log.action}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {log.description}
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '11px' }}>
                        {dayjs(log.timestamp).format('MMM DD, YYYY HH:mm')}
                      </Text>
                    </div>
                  ),
                }))}
              />
            </Card>
          </Space>
        )}
      </Drawer>
    </div>
  );
}
