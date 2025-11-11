import { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Tabs,
  Switch,
  Checkbox,
  Divider,
  Typography,
  Avatar,
  Row,
  Col,
  message,
  Badge,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  BankOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface FundRole {
  id: string;
  roleName: string;
  fundId: string;
  fundName: string;
  description: string;
  permissions: string[];
  userCount: number;
  isActive: boolean;
  createdAt: string;
}

interface RoleUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  assignedDate: string;
  status: 'active' | 'inactive';
}

const FundRolesManagementPage = () => {
  const { t } = useTranslation();
  const [selectedFund, setSelectedFund] = useState<string>('all');
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<FundRole | null>(null);
  const [selectedRole, setSelectedRole] = useState<FundRole | null>(null);
  const [form] = Form.useForm();
  const [assignForm] = Form.useForm();

  // Mock data - fondos disponibles
  const funds = [
    { id: 'fund-001', name: 'Naveo Growth Fund I', color: '#1890ff' },
    { id: 'fund-002', name: 'Naveo Stable Yield', color: '#52c41a' },
    { id: 'fund-003', name: 'Naveo Emerging Markets', color: '#fa8c16' },
  ];

  // Permisos disponibles por categoría
  const permissionCategories = {
    trading: {
      name: 'Trading Operations',
      permissions: [
        'trade.execute',
        'trade.view',
        'trade.approve',
        'trade.cancel',
        'trade.reports',
      ],
    },
    portfolio: {
      name: 'Portfolio Management',
      permissions: [
        'portfolio.view',
        'portfolio.edit',
        'portfolio.rebalance',
        'portfolio.analytics',
      ],
    },
    investors: {
      name: 'Investor Management',
      permissions: [
        'investors.view',
        'investors.add',
        'investors.edit',
        'investors.remove',
        'investors.kyc',
      ],
    },
    compliance: {
      name: 'Compliance & Risk',
      permissions: [
        'compliance.view',
        'compliance.audit',
        'risk.view',
        'risk.limits',
        'risk.alerts',
      ],
    },
    reports: {
      name: 'Reports & Analytics',
      permissions: [
        'reports.view',
        'reports.generate',
        'reports.export',
        'reports.schedule',
      ],
    },
  };

  // Mock data - roles por fondo
  const [roles, setRoles] = useState<FundRole[]>([
    {
      id: 'role-001',
      roleName: 'Senior Portfolio Manager',
      fundId: 'fund-001',
      fundName: 'Naveo Growth Fund I',
      description: 'Full portfolio management and trading authority',
      permissions: ['trade.execute', 'portfolio.edit', 'portfolio.rebalance', 'reports.generate'],
      userCount: 3,
      isActive: true,
      createdAt: '2024-01-15',
    },
    {
      id: 'role-002',
      roleName: 'Junior Trader',
      fundId: 'fund-001',
      fundName: 'Naveo Growth Fund I',
      description: 'Trading execution with approval required',
      permissions: ['trade.execute', 'trade.view', 'portfolio.view'],
      userCount: 5,
      isActive: true,
      createdAt: '2024-02-01',
    },
    {
      id: 'role-003',
      roleName: 'Compliance Officer',
      fundId: 'fund-001',
      fundName: 'Naveo Growth Fund I',
      description: 'Compliance monitoring and risk oversight',
      permissions: ['compliance.view', 'compliance.audit', 'risk.view', 'risk.alerts'],
      userCount: 2,
      isActive: true,
      createdAt: '2024-01-20',
    },
    {
      id: 'role-004',
      roleName: 'Fund Analyst',
      fundId: 'fund-001',
      fundName: 'Naveo Growth Fund I',
      description: 'Read-only access for analysis and reporting',
      permissions: ['portfolio.view', 'portfolio.analytics', 'reports.view'],
      userCount: 4,
      isActive: true,
      createdAt: '2024-03-01',
    },
    {
      id: 'role-005',
      roleName: 'Portfolio Manager',
      fundId: 'fund-002',
      fundName: 'Naveo Stable Yield',
      description: 'Conservative fund management',
      permissions: ['trade.view', 'portfolio.edit', 'investors.view'],
      userCount: 2,
      isActive: true,
      createdAt: '2024-01-10',
    },
  ]);

  // Mock data - usuarios asignados a un rol
  const roleUsers: Record<string, RoleUser[]> = {
    'role-001': [
      {
        id: 'user-001',
        name: 'Sarah Johnson',
        email: 'sarah.j@naveo.com',
        assignedDate: '2024-01-15',
        status: 'active',
      },
      {
        id: 'user-002',
        name: 'Michael Chen',
        email: 'michael.c@naveo.com',
        assignedDate: '2024-02-01',
        status: 'active',
      },
    ],
  };

  const filteredRoles = selectedFund === 'all'
    ? roles
    : roles.filter(role => role.fundId === selectedFund);

  const columns = [
    {
      title: t('roles.roleName', 'Role Name'),
      dataIndex: 'roleName',
      key: 'roleName',
      render: (text: string, record: FundRole) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.description}
          </Text>
        </div>
      ),
    },
    {
      title: t('roles.fund', 'Fund'),
      dataIndex: 'fundName',
      key: 'fundName',
      render: (text: string, record: FundRole) => {
        const fund = funds.find(f => f.id === record.fundId);
        return (
          <Tag color={fund?.color || 'blue'}>
            <BankOutlined /> {text}
          </Tag>
        );
      },
    },
    {
      title: t('roles.permissions', 'Permissions'),
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: string[]) => (
        <Space size={[0, 4]} wrap>
          {permissions.slice(0, 3).map((perm, idx) => (
            <Tag key={idx} style={{ fontSize: 11 }}>
              {perm.split('.')[1]}
            </Tag>
          ))}
          {permissions.length > 3 && (
            <Tag color="blue">+{permissions.length - 3} more</Tag>
          )}
        </Space>
      ),
    },
    {
      title: t('roles.users', 'Users'),
      dataIndex: 'userCount',
      key: 'userCount',
      render: (count: number, record: FundRole) => (
        <Space>
          <Badge count={count} showZero style={{ backgroundColor: '#52c41a' }}>
            <Avatar icon={<TeamOutlined />} size="small" />
          </Badge>
          <Button
            type="link"
            size="small"
            onClick={() => handleViewUsers(record)}
          >
            {t('roles.viewUsers', 'View')}
          </Button>
        </Space>
      ),
    },
    {
      title: t('roles.status', 'Status'),
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'default'}>
          {isActive ? t('roles.active', 'Active') : t('roles.inactive', 'Inactive')}
        </Tag>
      ),
    },
    {
      title: t('common.actions', 'Actions'),
      key: 'actions',
      render: (_: any, record: FundRole) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditRole(record)}
          >
            {t('common.edit', 'Edit')}
          </Button>
          <Button
            type="link"
            icon={<UserOutlined />}
            onClick={() => handleAssignUsers(record)}
          >
            {t('roles.assign', 'Assign')}
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteRole(record)}
          >
            {t('common.delete', 'Delete')}
          </Button>
        </Space>
      ),
    },
  ];

  const handleCreateRole = () => {
    setEditingRole(null);
    form.resetFields();
    setIsRoleModalVisible(true);
  };

  const handleEditRole = (role: FundRole) => {
    setEditingRole(role);
    form.setFieldsValue(role);
    setIsRoleModalVisible(true);
  };

  const handleDeleteRole = (role: FundRole) => {
    Modal.confirm({
      title: t('roles.confirmDelete', 'Delete Role'),
      content: t('roles.confirmDeleteMessage', `Are you sure you want to delete the role "${role.roleName}"?`),
      okText: t('common.yes', 'Yes'),
      cancelText: t('common.no', 'No'),
      okButtonProps: { danger: true },
      onOk: () => {
        setRoles(roles.filter(r => r.id !== role.id));
        message.success(t('roles.deleted', 'Role deleted successfully'));
      },
    });
  };

  const handleViewUsers = (role: FundRole) => {
    setSelectedRole(role);
    // Here you would navigate to a user list or show a modal
    message.info(`Viewing users for role: ${role.roleName}`);
  };

  const handleAssignUsers = (role: FundRole) => {
    setSelectedRole(role);
    assignForm.resetFields();
    setIsAssignModalVisible(true);
  };

  const handleSaveRole = async () => {
    try {
      const values = await form.validateFields();

      if (editingRole) {
        // Update existing role
        setRoles(roles.map(r =>
          r.id === editingRole.id
            ? { ...r, ...values }
            : r
        ));
        message.success(t('roles.updated', 'Role updated successfully'));
      } else {
        // Create new role
        const newRole: FundRole = {
          id: `role-${Date.now()}`,
          ...values,
          fundName: funds.find(f => f.id === values.fundId)?.name || '',
          userCount: 0,
          isActive: true,
          createdAt: new Date().toISOString().split('T')[0],
        };
        setRoles([...roles, newRole]);
        message.success(t('roles.created', 'Role created successfully'));
      }

      setIsRoleModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleAssignUser = async () => {
    try {
      const values = await assignForm.validateFields();
      message.success(t('roles.userAssigned', `Users assigned to role successfully`));
      setIsAssignModalVisible(false);
      assignForm.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>{t('roles.title', 'Fund Roles Management')}</Title>
        <Text type="secondary">
          {t('roles.subtitle', 'Create and manage fund-specific roles with granular permissions')}
        </Text>
      </div>

      {/* Fund Filter and Actions */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Space size="large">
              <div>
                <Text strong>{t('roles.filterByFund', 'Filter by Fund')}:</Text>
                <Select
                  value={selectedFund}
                  onChange={setSelectedFund}
                  style={{ width: 250, marginLeft: 12 }}
                >
                  <Select.Option value="all">
                    {t('roles.allFunds', 'All Funds')}
                  </Select.Option>
                  {funds.map(fund => (
                    <Select.Option key={fund.id} value={fund.id}>
                      <Tag color={fund.color} style={{ marginRight: 8 }}>●</Tag>
                      {fund.name}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <Badge count={filteredRoles.length} showZero>
                <Tag icon={<SafetyOutlined />}>
                  {t('roles.totalRoles', 'Total Roles')}
                </Tag>
              </Badge>
            </Space>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateRole}
            >
              {t('roles.createRole', 'Create New Role')}
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Roles Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredRoles}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `${total} ${t('roles.roles', 'roles')}`,
          }}
        />
      </Card>

      {/* Create/Edit Role Modal */}
      <Modal
        title={editingRole ? t('roles.editRole', 'Edit Role') : t('roles.createNewRole', 'Create New Role')}
        open={isRoleModalVisible}
        onCancel={() => setIsRoleModalVisible(false)}
        onOk={handleSaveRole}
        width={800}
        okText={editingRole ? t('common.update', 'Update') : t('common.create', 'Create')}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fundId"
                label={t('roles.fund', 'Fund')}
                rules={[{ required: true, message: t('roles.selectFund', 'Please select a fund') }]}
              >
                <Select placeholder={t('roles.selectFundPlaceholder', 'Select fund')}>
                  {funds.map(fund => (
                    <Select.Option key={fund.id} value={fund.id}>
                      <Tag color={fund.color} style={{ marginRight: 8 }}>●</Tag>
                      {fund.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="roleName"
                label={t('roles.roleName', 'Role Name')}
                rules={[{ required: true, message: t('roles.enterRoleName', 'Please enter role name') }]}
              >
                <Input placeholder={t('roles.roleNamePlaceholder', 'e.g., Senior Portfolio Manager')} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label={t('roles.description', 'Description')}
            rules={[{ required: true, message: t('roles.enterDescription', 'Please enter description') }]}
          >
            <Input.TextArea
              rows={3}
              placeholder={t('roles.descriptionPlaceholder', 'Describe the role responsibilities and scope')}
            />
          </Form.Item>

          <Divider>{t('roles.selectPermissions', 'Select Permissions')}</Divider>

          <Form.Item
            name="permissions"
            rules={[{ required: true, message: t('roles.selectPermissions', 'Please select at least one permission') }]}
          >
            <Checkbox.Group style={{ width: '100%' }}>
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                {Object.entries(permissionCategories).map(([key, category]) => (
                  <Card key={key} size="small" title={category.name}>
                    <Row>
                      {category.permissions.map(perm => (
                        <Col span={12} key={perm}>
                          <Checkbox value={perm} style={{ marginBottom: 8 }}>
                            {perm.replace(/\./g, ' > ')}
                          </Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Card>
                ))}
              </Space>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>

      {/* Assign Users Modal */}
      <Modal
        title={t('roles.assignUsers', 'Assign Users to Role')}
        open={isAssignModalVisible}
        onCancel={() => setIsAssignModalVisible(false)}
        onOk={handleAssignUser}
        okText={t('roles.assign', 'Assign')}
      >
        {selectedRole && (
          <div style={{ marginBottom: 16 }}>
            <Text strong>{selectedRole.roleName}</Text>
            <br />
            <Text type="secondary">{selectedRole.fundName}</Text>
          </div>
        )}
        <Form form={assignForm} layout="vertical">
          <Form.Item
            name="userIds"
            label={t('roles.selectUsers', 'Select Users')}
            rules={[{ required: true, message: t('roles.selectUsersMessage', 'Please select at least one user') }]}
          >
            <Select
              mode="multiple"
              placeholder={t('roles.searchUsers', 'Search and select users')}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={[
                { value: 'user-001', label: 'Sarah Johnson (sarah.j@naveo.com)' },
                { value: 'user-002', label: 'Michael Chen (michael.c@naveo.com)' },
                { value: 'user-003', label: 'Emily Rodriguez (emily.r@naveo.com)' },
                { value: 'user-004', label: 'David Kim (david.k@naveo.com)' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FundRolesManagementPage;
