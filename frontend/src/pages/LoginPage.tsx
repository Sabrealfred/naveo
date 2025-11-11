import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Form,
  Input,
  Typography,
  message,
  Space,
} from 'antd';
import {
  MailOutlined,
  LockOutlined,
  ThunderboltOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { MiraLogo } from '../components/common';

const { Title, Text } = Typography;

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const roleOptions = [
    {
      value: 'admin_owner',
      label: t('roles.admin-owner', 'Platform Administrator'),
      path: '/admin-owner',
    },
    {
      value: 'admin_client',
      label: t('roles.admin-client', 'Fund Manager'),
      path: '/admin-client',
    },
    {
      value: 'investor',
      label: t('roles.investor', 'Investor'),
      path: '/investor',
    },
  ];

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    // Default to investor portal
    setTimeout(() => {
      setLoading(false);
      message.success(t('login.welcomeMessage', { role: t('roles.investor') }));
      navigate('/investor');
    }, 800);
  };

  const handleDemoLogin = (role: string) => {
    const targetRole = roleOptions.find((r) => r.value === role);
    if (targetRole) {
      message.success(t('login.demoLoginSuccess', { role: targetRole.label }));
      navigate(targetRole.path);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        background: '#ffffff',
      }}
    >
      {/* Left Side - Login Form */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          maxWidth: 600,
        }}
      >
        <div style={{ width: '100%', maxWidth: 380 }}>
          {/* Logo */}
          <div style={{ marginBottom: 48 }}>
            <MiraLogo variant="dark" size="md" />
          </div>

          {/* Title */}
          <div style={{ marginBottom: 40 }}>
            <Title
              level={1}
              style={{
                fontSize: 32,
                fontWeight: 600,
                marginBottom: 8,
                color: '#1a1a1a',
                letterSpacing: '-0.5px',
              }}
            >
              {t('login.title', 'Sign in')}
            </Title>
            <Text
              style={{
                fontSize: 15,
                color: '#86868b',
              }}
            >
              {t('login.subtitle', 'Enter your credentials to access your account')}
            </Text>
          </div>

          {/* Login Form */}
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: t('login.emailRequired', 'Email is required') },
                { type: 'email', message: t('login.emailInvalid', 'Invalid email address') },
              ]}
            >
              <Input
                size="large"
                prefix={<MailOutlined style={{ color: '#86868b', fontSize: 16 }} />}
                placeholder="email@example.com"
                style={{
                  height: 48,
                  fontSize: 15,
                  borderRadius: 10,
                  border: '1px solid #d2d2d7',
                  background: '#ffffff',
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: t('login.passwordRequired', 'Password is required') }]}
              style={{ marginBottom: 12 }}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined style={{ color: '#86868b', fontSize: 16 }} />}
                placeholder="Password"
                style={{
                  height: 48,
                  fontSize: 15,
                  borderRadius: 10,
                  border: '1px solid #d2d2d7',
                  background: '#ffffff',
                }}
              />
            </Form.Item>

            <div style={{ textAlign: 'right', marginBottom: 32 }}>
              <a
                href="#"
                style={{
                  fontSize: 13,
                  color: '#06c',
                  textDecoration: 'none',
                  fontWeight: 400,
                }}
              >
                {t('login.forgotPassword', 'Forgot password?')}
              </a>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              style={{
                height: 48,
                fontSize: 15,
                fontWeight: 500,
                background: '#1a1a1a',
                border: 'none',
                borderRadius: 10,
                marginBottom: 16,
              }}
            >
              {t('login.loginButton', 'Continue')}
            </Button>
          </Form>

          {/* Demo Access */}
          <div style={{ marginTop: 48 }}>
            <div
              style={{
                borderTop: '1px solid #d2d2d7',
                paddingTop: 32,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  color: '#86868b',
                  display: 'block',
                  marginBottom: 16,
                }}
              >
                {t('login.demoAccess', 'Quick demo access')}
              </Text>
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                {roleOptions.map((role) => (
                  <Button
                    key={role.value}
                    size="large"
                    block
                    onClick={() => handleDemoLogin(role.value)}
                    style={{
                      height: 44,
                      fontSize: 14,
                      fontWeight: 400,
                      background: '#f5f5f7',
                      border: '1px solid #d2d2d7',
                      color: '#1a1a1a',
                      borderRadius: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                    icon={<ThunderboltOutlined style={{ fontSize: 14 }} />}
                  >
                    <span style={{ flex: 1, textAlign: 'left', marginLeft: 8 }}>
                      {role.label}
                    </span>
                    <ArrowRightOutlined style={{ fontSize: 12, color: '#86868b' }} />
                  </Button>
                ))}
              </Space>
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: 48, textAlign: 'center' }}>
            <Text style={{ fontSize: 12, color: '#86868b' }}>
              {t('login.needHelp', 'Need help?')}{' '}
              <a
                href="mailto:support@miralabs.com"
                style={{
                  color: '#06c',
                  textDecoration: 'none',
                }}
              >
                {t('login.contactSupport', 'Contact support')}
              </a>
            </Text>
          </div>
        </div>
      </div>

      {/* Right Side - Hero */}
      <div
        style={{
          flex: 1,
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle geometric patterns */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            right: '10%',
            width: 300,
            height: 300,
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '50%',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '10%',
            width: 400,
            height: 400,
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '50%',
            filter: 'blur(80px)',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 480 }}>
          <Title
            level={1}
            style={{
              color: '#ffffff',
              fontSize: 48,
              fontWeight: 600,
              marginBottom: 24,
              lineHeight: 1.1,
              letterSpacing: '-1.5px',
            }}
          >
            Financial innovation, simplified
          </Title>
          <Text
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: 18,
              lineHeight: 1.6,
              display: 'block',
              marginBottom: 48,
            }}
          >
            Access institutional-grade tokenized assets and manage your portfolio with confidence.
          </Text>

          {/* Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 24,
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                padding: 24,
                borderRadius: 12,
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <Title
                level={2}
                style={{
                  color: '#ffffff',
                  fontSize: 36,
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                $500M+
              </Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 14 }}>
                Assets under management
              </Text>
            </div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                padding: 24,
                borderRadius: 12,
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <Title
                level={2}
                style={{
                  color: '#ffffff',
                  fontSize: 36,
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                10K+
              </Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 14 }}>
                Active investors
              </Text>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for responsive */}
      <style>{`
        @media (max-width: 1024px) {
          /* Hide right side on mobile/tablet */
          body > div > div:last-child {
            display: none !important;
          }
          body > div > div:first-child {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
