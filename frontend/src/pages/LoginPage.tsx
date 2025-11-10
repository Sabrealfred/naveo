import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Space,
  Typography,
  message,
} from 'antd';
import {
  LockOutlined,
  MailOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/common/LanguageSwitcher';

const { Title, Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const roleOptions = [
    {
      label: t('roles.admin-owner'),
      value: 'admin-owner',
      description: t('roleDescriptions.admin-owner'),
      path: '/admin-owner',
    },
    {
      label: t('roles.admin-client'),
      value: 'admin-client',
      description: t('roleDescriptions.admin-client'),
      path: '/admin-client',
    },
    {
      label: t('roles.investor'),
      value: 'investor',
      description: t('roleDescriptions.investor'),
      path: '/investor',
    },
  ];

  const handleSubmit = async (values: { email: string; password: string; role: string }) => {
    const targetRole = roleOptions.find((role) => role.value === values.role);
    if (!targetRole) {
      message.error(t('login.invalidRole'));
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success(t('login.welcomeMessage', { role: targetRole.label }));
      navigate(targetRole.path);
    }, 800);
  };

  const handleDemoLogin = (roleValue: string) => {
    const targetRole = roleOptions.find((role) => role.value === roleValue);
    if (!targetRole) return;
    message.success(`${t('login.demoButton', { role: '' })}${targetRole.label}`);
    navigate(targetRole.path);
  };

  return (
    <Row
      justify="center"
      align="middle"
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at top, #102040, #05060a 70%)',
        padding: 24,
      }}
    >
      <Col xs={24} sm={20} md={14} lg={10} xl={8}>
        <Card
          style={{ borderRadius: 16, boxShadow: '0 15px 45px rgba(0,0,0,0.35)' }}
          bodyStyle={{ padding: 32 }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ position: 'absolute', top: 20, right: 20 }}>
              <LanguageSwitcher />
            </div>
            <div>
              <Badge.Ribbon text={t('login.alphaAccess')} color="purple">
                <div style={{ padding: '0 8px 24px 8px' }}>
                  <Text type="secondary">{t('login.platformName')}</Text>
                  <Title level={2} style={{ marginTop: 4, marginBottom: 0 }}>
                    {t('login.title')}
                  </Title>
                  <Text type="secondary">
                    {t('login.subtitle')}
                  </Text>
                </div>
              </Badge.Ribbon>
            </div>

            <Form
              layout="vertical"
              form={form}
              onFinish={handleSubmit}
              initialValues={{ role: 'investor' }}
            >
              <Form.Item
                label={t('login.emailLabel')}
                name="email"
                rules={[
                  { required: true, message: t('login.emailRequired') },
                  { type: 'email', message: t('login.emailInvalid') },
                ]}
              >
                <Input
                  size="large"
                  prefix={<MailOutlined />}
                  placeholder="you@navlabs.com"
                />
              </Form.Item>

              <Form.Item
                label={t('login.passwordLabel')}
                name="password"
                rules={[{ required: true, message: t('login.passwordRequired') }]}
              >
                <Input.Password
                  size="large"
                  prefix={<LockOutlined />}
                  placeholder="••••••••"
                />
              </Form.Item>

              <Form.Item
                label={t('login.roleLabel')}
                name="role"
                rules={[{ required: true, message: t('login.roleRequired') }]}
              >
                <Select
                  size="large"
                  options={roleOptions.map((role) => ({
                    label: (
                      <Space direction="vertical" size={0}>
                        <Text strong>{role.label}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {role.description}
                        </Text>
                      </Space>
                    ),
                    value: role.value,
                  }))}
                />
              </Form.Item>

              <Button
                type="primary"
                size="large"
                htmlType="submit"
                block
                loading={loading}
              >
                {t('login.loginButton')}
              </Button>
            </Form>

            <Divider>{t('login.demoLoginDivider')}</Divider>

            <Space direction="vertical" style={{ width: '100%' }}>
              {roleOptions.map((role) => (
                <Button
                  key={role.value}
                  icon={<ThunderboltOutlined />}
                  size="large"
                  block
                  onClick={() => handleDemoLogin(role.value)}
                >
                  {t('login.demoButton', { role: role.label })}
                </Button>
              ))}
            </Space>

            <Space direction="vertical" style={{ width: '100%' }}>
              <Text type="secondary">
                {t('login.needAccess')}{' '}
                <a href="mailto:support@naveo.io">
                  {t('login.contactSupport')}
                </a>
              </Text>
              <Space>
                <UserOutlined />
                <Text type="secondary">{t('login.platformInfo')}</Text>
              </Space>
            </Space>
          </Space>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginPage;