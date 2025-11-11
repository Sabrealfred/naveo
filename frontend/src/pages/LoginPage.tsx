import { useState } from 'react';
import {
  Button,
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
  RocketOutlined,
  SafetyOutlined,
  GlobalOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import { MiraLogo } from '../components/common';

const { Title, Text, Paragraph } = Typography;

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
    <Row style={{ minHeight: '100vh', overflow: 'hidden' }}>
      {/* Left Side - Login Form */}
      <Col
        xs={24}
        lg={12}
        style={{
          background: 'linear-gradient(135deg, #0a0e27 0%, #1a1d3a 100%)',
          padding: '40px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          minHeight: '100vh',
        }}
      >
        {/* Language Switcher */}
        <div
          style={{
            position: 'absolute',
            top: 24,
            right: 24,
            zIndex: 10,
          }}
        >
          <LanguageSwitcher />
        </div>

        {/* Login Container */}
        <div
          style={{
            width: '100%',
            maxWidth: 480,
            padding: '0 24px',
          }}
        >
          {/* Logo */}
          <div
            style={{
              textAlign: 'center',
              marginBottom: 48,
              animation: 'fadeInDown 0.6s ease-out',
            }}
          >
            <MiraLogo variant="light" size="lg" />
            <Title
              level={2}
              style={{
                color: '#ffffff',
                marginTop: 24,
                marginBottom: 8,
                fontSize: 32,
                fontWeight: 700,
              }}
            >
              {t('login.title')}
            </Title>
            <Text
              style={{
                color: 'rgba(255, 255, 255, 0.65)',
                fontSize: 16,
              }}
            >
              {t('login.subtitle')}
            </Text>
          </div>

          {/* Login Form */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: 16,
              padding: '32px 28px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              animation: 'fadeInUp 0.6s ease-out 0.2s both',
            }}
          >
            <Form
              layout="vertical"
              form={form}
              onFinish={handleSubmit}
              initialValues={{ role: 'investor' }}
            >
              <Form.Item
                label={
                  <span style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 14 }}>
                    {t('login.emailLabel')}
                  </span>
                }
                name="email"
                rules={[
                  { required: true, message: t('login.emailRequired') },
                  { type: 'email', message: t('login.emailInvalid') },
                ]}
              >
                <Input
                  size="large"
                  prefix={<MailOutlined style={{ color: 'rgba(255, 255, 255, 0.45)' }} />}
                  placeholder="you@miralabs.com"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    fontSize: 15,
                  }}
                />
              </Form.Item>

              <Form.Item
                label={
                  <span style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 14 }}>
                    {t('login.passwordLabel')}
                  </span>
                }
                name="password"
                rules={[{ required: true, message: t('login.passwordRequired') }]}
              >
                <Input.Password
                  size="large"
                  prefix={<LockOutlined style={{ color: 'rgba(255, 255, 255, 0.45)' }} />}
                  placeholder="••••••••"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    fontSize: 15,
                  }}
                />
              </Form.Item>

              <Form.Item
                label={
                  <span style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 14 }}>
                    {t('login.roleLabel')}
                  </span>
                }
                name="role"
                rules={[{ required: true, message: t('login.roleRequired') }]}
              >
                <Select
                  size="large"
                  style={{
                    width: '100%',
                  }}
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
                style={{
                  height: 48,
                  fontSize: 16,
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: 8,
                  marginTop: 8,
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                }}
              >
                {t('login.loginButton')}
              </Button>
            </Form>

            <Divider
              style={{
                borderColor: 'rgba(255, 255, 255, 0.15)',
                margin: '24px 0',
              }}
            >
              <span style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: 13 }}>
                {t('login.demoLoginDivider')}
              </span>
            </Divider>

            {/* Demo Buttons */}
            <Space direction="vertical" style={{ width: '100%' }} size={10}>
              {roleOptions.map((role, index) => (
                <Button
                  key={role.value}
                  icon={<ThunderboltOutlined />}
                  size="large"
                  block
                  onClick={() => handleDemoLogin(role.value)}
                  style={{
                    height: 44,
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: 'rgba(255, 255, 255, 0.85)',
                    borderRadius: 8,
                    fontWeight: 500,
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  }}
                >
                  {t('login.demoButton', { role: role.label })}
                </Button>
              ))}
            </Space>
          </div>

          {/* Footer */}
          <div
            style={{
              textAlign: 'center',
              marginTop: 32,
              animation: 'fadeIn 0.6s ease-out 0.4s both',
            }}
          >
            <Text
              style={{
                color: 'rgba(255, 255, 255, 0.55)',
                fontSize: 14,
              }}
            >
              {t('login.needAccess')}{' '}
              <a
                href="mailto:support@miralabs.com"
                style={{
                  color: '#667eea',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                {t('login.contactSupport')}
              </a>
            </Text>
          </div>
        </div>
      </Col>

      {/* Right Side - Branding */}
      <Col
        xs={0}
        lg={12}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '60px 80px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '100vh',
        }}
      >
        {/* Decorative Elements */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            filter: 'blur(80px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -150,
            left: -150,
            width: 500,
            height: 500,
            background: 'rgba(0, 0, 0, 0.1)',
            borderRadius: '50%',
            filter: 'blur(100px)',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            animation: 'fadeInRight 0.8s ease-out',
          }}
        >
          {/* Alpha Badge */}
          <div
            style={{
              display: 'inline-block',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              padding: '8px 16px',
              borderRadius: 20,
              marginBottom: 32,
            }}
          >
            <Text
              style={{
                color: '#ffffff',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              {t('login.alphaAccess')}
            </Text>
          </div>

          <Title
            level={1}
            style={{
              color: '#ffffff',
              fontSize: 48,
              fontWeight: 800,
              marginBottom: 24,
              lineHeight: 1.2,
            }}
          >
            Tokenización de<br />Activos del Futuro
          </Title>

          <Paragraph
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: 18,
              marginBottom: 48,
              lineHeight: 1.6,
            }}
          >
            MiraLabs es la plataforma líder en tokenización de activos financieros.
            Conectamos inversores con oportunidades únicas a través de tecnología blockchain.
          </Paragraph>

          {/* Stats Grid */}
          <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
            <Col span={12}>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  padding: 24,
                  borderRadius: 12,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Title level={2} style={{ color: '#ffffff', margin: 0, fontSize: 36 }}>
                  $500M+
                </Title>
                <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 14 }}>
                  Activos Tokenizados
                </Text>
              </div>
            </Col>
            <Col span={12}>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  padding: 24,
                  borderRadius: 12,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Title level={2} style={{ color: '#ffffff', margin: 0, fontSize: 36 }}>
                  50+
                </Title>
                <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 14 }}>
                  Fondos Activos
                </Text>
              </div>
            </Col>
            <Col span={12}>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  padding: 24,
                  borderRadius: 12,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Title level={2} style={{ color: '#ffffff', margin: 0, fontSize: 36 }}>
                  10K+
                </Title>
                <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 14 }}>
                  Inversores Globales
                </Text>
              </div>
            </Col>
            <Col span={12}>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  padding: 24,
                  borderRadius: 12,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Title level={2} style={{ color: '#ffffff', margin: 0, fontSize: 36 }}>
                  24/7
                </Title>
                <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 14 }}>
                  Mercado Disponible
                </Text>
              </div>
            </Col>
          </Row>

          {/* Features */}
          <Space direction="vertical" size={20}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SafetyOutlined style={{ fontSize: 24, color: '#ffffff' }} />
              </div>
              <div>
                <Title level={5} style={{ color: '#ffffff', margin: 0, fontSize: 16 }}>
                  Seguridad Blockchain
                </Title>
                <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 14 }}>
                  Transacciones seguras y transparentes
                </Text>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <GlobalOutlined style={{ fontSize: 24, color: '#ffffff' }} />
              </div>
              <div>
                <Title level={5} style={{ color: '#ffffff', margin: 0, fontSize: 16 }}>
                  Acceso Global
                </Title>
                <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 14 }}>
                  Invierte desde cualquier lugar del mundo
                </Text>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <RocketOutlined style={{ fontSize: 24, color: '#ffffff' }} />
              </div>
              <div>
                <Title level={5} style={{ color: '#ffffff', margin: 0, fontSize: 16 }}>
                  Liquidez Instantánea
                </Title>
                <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 14 }}>
                  Compra y vende tokens en tiempo real
                </Text>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TrophyOutlined style={{ fontSize: 24, color: '#ffffff' }} />
              </div>
              <div>
                <Title level={5} style={{ color: '#ffffff', margin: 0, fontSize: 16 }}>
                  Oportunidades Exclusivas
                </Title>
                <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 14 }}>
                  Acceso a inversiones de alto rendimiento
                </Text>
              </div>
            </div>
          </Space>

          {/* Testimonial */}
          <div
            style={{
              marginTop: 48,
              padding: 28,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: 12,
              borderLeft: '4px solid rgba(255, 255, 255, 0.5)',
            }}
          >
            <Paragraph
              style={{
                color: '#ffffff',
                fontSize: 16,
                fontStyle: 'italic',
                marginBottom: 12,
                lineHeight: 1.6,
              }}
            >
              "MiraLabs ha revolucionado la manera en que invertimos. La plataforma es intuitiva,
              segura y me ha dado acceso a oportunidades que antes eran imposibles."
            </Paragraph>
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 14, fontWeight: 600 }}>
              — María González, Inversionista
            </Text>
          </div>
        </div>
      </Col>

      {/* Global Styles for Animations */}
      <style>
        {`
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes fadeInRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          /* Custom Select Dropdown Styling */
          .ant-select-dropdown {
            background: rgba(30, 30, 50, 0.95) !important;
            backdrop-filter: blur(20px);
          }

          .ant-select-item {
            color: rgba(255, 255, 255, 0.85) !important;
          }

          .ant-select-item-option-selected {
            background: rgba(102, 126, 234, 0.2) !important;
          }

          .ant-select-item-option-active {
            background: rgba(102, 126, 234, 0.1) !important;
          }

          /* Input Placeholder Color */
          .ant-input::placeholder,
          .ant-input-password input::placeholder {
            color: rgba(255, 255, 255, 0.35) !important;
          }

          /* Password Icon Color */
          .ant-input-password-icon {
            color: rgba(255, 255, 255, 0.45) !important;
          }

          /* Responsive adjustments */
          @media (max-width: 991px) {
            .ant-col-lg-12:last-child {
              display: none !important;
            }
          }
        `}
      </style>
    </Row>
  );
};

export default LoginPage;
