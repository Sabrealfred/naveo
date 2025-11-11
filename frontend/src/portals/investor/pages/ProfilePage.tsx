import { useState, useEffect } from 'react';
import {
  Card,
  Col,
  Row,
  Form,
  Input,
  Button,
  Upload,
  message,
  Avatar,
  Space,
  Typography,
  Spin,
  Tabs,
  Select,
  DatePicker,
  Switch,
  Divider,
} from 'antd';
import {
  UserOutlined,
  UploadOutlined,
  SaveOutlined,
  PhoneOutlined,
  HomeOutlined,
  IdcardOutlined,
  BellOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { profileService, type UserProfile } from '../../../services';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function ProfilePage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getCurrentUserProfile();
      setProfile(data);

      // Set form values
      form.setFieldsValue({
        ...data,
        date_of_birth: data.date_of_birth ? dayjs(data.date_of_birth) : null,
        notification_preferences: data.notification_preferences || {
          email: true,
          sms: false,
          push: true,
          marketing: false,
        },
      });
    } catch (error: any) {
      console.error('Error loading profile:', error);
      message.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    if (!profile) return;

    try {
      setSaving(true);
      const updates = {
        ...values,
        date_of_birth: values.date_of_birth ? dayjs(values.date_of_birth).format('YYYY-MM-DD') : null,
      };

      await profileService.updateUserProfile(profile.id, updates);
      message.success(t('profile.updateSuccess', 'Profile updated successfully'));
      await loadProfile();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      message.error(t('profile.updateError', 'Failed to update profile'));
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!profile) return false;

    try {
      await profileService.uploadAvatar(profile.id, file);
      message.success(t('profile.avatarSuccess', 'Avatar uploaded successfully'));
      await loadProfile();
      return false;
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      message.error(t('profile.avatarError', 'Failed to upload avatar'));
      return false;
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!profile) {
    return (
      <Card>
        <Text>{t('profile.notFound', 'No profile found. Please contact support.')}</Text>
      </Card>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={3}>{t('profile.title', 'My Profile')}</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        {t('profile.subtitle', 'Manage your account information and preferences')}
      </Text>

      <Row gutter={[24, 24]}>
        {/* Profile Picture Card */}
        <Col xs={24} md={8}>
          <Card>
            <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
              <Avatar
                size={120}
                src={profile.avatar_url}
                icon={!profile.avatar_url && <UserOutlined />}
                style={{ backgroundColor: '#1890ff' }}
              />
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={(file) => {
                  handleAvatarUpload(file);
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />}>
                  {t('profile.changePhoto', 'Change Avatar')}
                </Button>
              </Upload>
              <Divider />
              <div style={{ textAlign: 'left', width: '100%' }}>
                <Text type="secondary">{t('profile.displayName', 'Display Name')}</Text>
                <Title level={4} style={{ margin: '8px 0' }}>
                  {profile.display_name || profile.full_name || t('profile.notSet', 'Not set')}
                </Title>
                <Text type="secondary">{t('profile.memberSince', 'Member since')}</Text>
                <div style={{ marginTop: 4 }}>
                  <Text>{dayjs(profile.created_at).format('MMMM YYYY')}</Text>
                </div>
              </div>
            </Space>
          </Card>

          {/* Quick Stats Card */}
          <Card style={{ marginTop: 16 }} title={t('profile.accountStats', 'Account Stats')}>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">{t('profile.loginCount', 'Login Count')}:</Text>
                <Text strong>{profile.login_count || 0}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">{t('profile.lastLogin', 'Last Login')}:</Text>
                <Text>{profile.last_login_at ? dayjs(profile.last_login_at).format('MMM D, YYYY') : t('profile.never', 'Never')}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">{t('profile.profileCompleted', 'Profile Completed')}:</Text>
                <Text>{profile.onboarding_completed ? t('common.yes', 'Yes') : t('common.no', 'No')}</Text>
              </div>
            </Space>
          </Card>
        </Col>

        {/* Profile Form */}
        <Col xs={24} md={16}>
          <Card>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              autoComplete="off"
            >
              <Tabs
                items={[
                  {
                    key: 'personal',
                    label: (
                      <span>
                        <UserOutlined /> {t('profile.personalInfo', 'Personal Info')}
                      </span>
                    ),
                    children: (
                      <>
                        <Row gutter={16}>
                          <Col xs={24} md={12}>
                            <Form.Item
                              label={t('profile.fullName', 'Full Name')}
                              name="full_name"
                              rules={[{ required: true, message: t('profile.nameRequired', 'Please enter your full name') }]}
                            >
                              <Input prefix={<UserOutlined />} placeholder="John Doe" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12}>
                            <Form.Item label={t('profile.displayName', 'Display Name')} name="display_name">
                              <Input prefix={<UserOutlined />} placeholder="John" />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row gutter={16}>
                          <Col xs={24} md={12}>
                            <Form.Item
                              label={t('profile.phone', 'Phone')}
                              name="phone"
                              rules={[{ required: true, message: t('profile.phoneRequired', 'Please enter your phone number') }]}
                            >
                              <Input prefix={<PhoneOutlined />} placeholder="+1 (555) 123-4567" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12}>
                            <Form.Item label={t('profile.dateOfBirth', 'Date of Birth')} name="date_of_birth">
                              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                            </Form.Item>
                          </Col>
                        </Row>
                      </>
                    ),
                  },
                  {
                    key: 'address',
                    label: (
                      <span>
                        <HomeOutlined /> {t('profile.address', 'Address')}
                      </span>
                    ),
                    children: (
                      <>
                        <Form.Item label={t('profile.street', 'Street Address')} name="street_address">
                          <Input placeholder="123 Main Street" />
                        </Form.Item>

                        <Row gutter={16}>
                          <Col xs={24} md={8}>
                            <Form.Item label={t('profile.city', 'City')} name="city">
                              <Input placeholder="New York" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={8}>
                            <Form.Item label={t('profile.state', 'State/Province')} name="state_province">
                              <Input placeholder="NY" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={8}>
                            <Form.Item label={t('profile.postalCode', 'Postal Code')} name="postal_code">
                              <Input placeholder="10001" />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Form.Item label={t('profile.country', 'Country')} name="country">
                          <Select
                            showSearch
                            placeholder={t('profile.selectCountry', 'Select country')}
                            options={[
                              { label: 'United States', value: 'United States' },
                              { label: 'Canada', value: 'Canada' },
                              { label: 'United Kingdom', value: 'United Kingdom' },
                              { label: 'Germany', value: 'Germany' },
                              { label: 'France', value: 'France' },
                              { label: 'Spain', value: 'Spain' },
                              { label: 'Mexico', value: 'Mexico' },
                              { label: 'Brazil', value: 'Brazil' },
                            ]}
                          />
                        </Form.Item>
                      </>
                    ),
                  },
                  {
                    key: 'investor',
                    label: (
                      <span>
                        <IdcardOutlined /> {t('profile.investorInfo', 'Investor Info')}
                      </span>
                    ),
                    children: (
                      <>
                        <Row gutter={16}>
                          <Col xs={24} md={12}>
                            <Form.Item label={t('profile.investorType', 'Investor Type')} name="investor_type">
                              <Select
                                placeholder={t('profile.selectType', 'Select type')}
                                options={[
                                  { label: t('profile.individual', 'Individual'), value: 'individual' },
                                  { label: t('profile.corporate', 'Corporate'), value: 'corporate' },
                                  { label: t('profile.institutional', 'Institutional'), value: 'institutional' },
                                  { label: t('profile.trust', 'Trust'), value: 'trust' },
                                  { label: t('profile.other', 'Other'), value: 'other' },
                                ]}
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12}>
                            <Form.Item label={t('profile.riskTolerance', 'Risk Tolerance')} name="risk_tolerance">
                              <Select
                                placeholder={t('profile.selectRisk', 'Select risk tolerance')}
                                options={[
                                  { label: t('profile.conservative', 'Conservative'), value: 'conservative' },
                                  { label: t('profile.moderate', 'Moderate'), value: 'moderate' },
                                  { label: t('profile.aggressive', 'Aggressive'), value: 'aggressive' },
                                  { label: t('profile.veryAggressive', 'Very Aggressive'), value: 'very_aggressive' },
                                ]}
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row gutter={16}>
                          <Col xs={24} md={12}>
                            <Form.Item label={t('profile.investmentExperience', 'Investment Experience')} name="investment_experience">
                              <Select
                                placeholder={t('profile.selectExperience', 'Select experience')}
                                options={[
                                  { label: t('profile.none', 'None'), value: 'none' },
                                  { label: t('profile.limited', 'Limited'), value: 'limited' },
                                  { label: t('profile.intermediate', 'Intermediate'), value: 'intermediate' },
                                  { label: t('profile.advanced', 'Advanced'), value: 'advanced' },
                                  { label: t('profile.expert', 'Expert'), value: 'expert' },
                                ]}
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12}>
                            <Form.Item label={t('profile.accreditedInvestor', 'Accredited Investor')} name="accredited_investor" valuePropName="checked">
                              <Switch />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row gutter={16}>
                          <Col xs={24} md={12}>
                            <Form.Item label={t('profile.annualIncome', 'Annual Income Range')} name="annual_income_range">
                              <Select
                                placeholder={t('profile.selectRange', 'Select range')}
                                options={[
                                  { label: 'Under $50,000', value: '<50k' },
                                  { label: '$50,000 - $100,000', value: '50k-100k' },
                                  { label: '$100,000 - $250,000', value: '100k-250k' },
                                  { label: '$250,000 - $500,000', value: '250k-500k' },
                                  { label: '$500,000+', value: '500k+' },
                                ]}
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12}>
                            <Form.Item label={t('profile.netWorth', 'Net Worth Range')} name="net_worth_range">
                              <Select
                                placeholder={t('profile.selectRange', 'Select range')}
                                options={[
                                  { label: 'Under $100,000', value: '<100k' },
                                  { label: '$100,000 - $500,000', value: '100k-500k' },
                                  { label: '$500,000 - $1M', value: '500k-1m' },
                                  { label: '$1M - $5M', value: '1m-5m' },
                                  { label: '$5M+', value: '5m+' },
                                ]}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </>
                    ),
                  },
                  {
                    key: 'preferences',
                    label: (
                      <span>
                        <BellOutlined /> {t('profile.preferences', 'Preferences')}
                      </span>
                    ),
                    children: (
                      <>
                        <Row gutter={16}>
                          <Col xs={24} md={8}>
                            <Form.Item label={t('profile.language', 'Language')} name="language">
                              <Select
                                options={[
                                  { label: 'English', value: 'en' },
                                  { label: 'Español', value: 'es' },
                                  { label: 'Français', value: 'fr' },
                                  { label: 'Deutsch', value: 'de' },
                                ]}
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={8}>
                            <Form.Item label={t('profile.timezone', 'Timezone')} name="timezone">
                              <Select
                                showSearch
                                options={[
                                  { label: 'America/New_York', value: 'America/New_York' },
                                  { label: 'America/Chicago', value: 'America/Chicago' },
                                  { label: 'America/Los_Angeles', value: 'America/Los_Angeles' },
                                  { label: 'Europe/London', value: 'Europe/London' },
                                  { label: 'Europe/Paris', value: 'Europe/Paris' },
                                  { label: 'Asia/Tokyo', value: 'Asia/Tokyo' },
                                ]}
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={8}>
                            <Form.Item label={t('profile.currency', 'Currency')} name="currency">
                              <Select
                                options={[
                                  { label: 'USD', value: 'USD' },
                                  { label: 'EUR', value: 'EUR' },
                                  { label: 'GBP', value: 'GBP' },
                                  { label: 'JPY', value: 'JPY' },
                                  { label: 'CAD', value: 'CAD' },
                                ]}
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Divider>{t('profile.notifications', 'Notification Preferences')}</Divider>

                        <Row gutter={[16, 16]}>
                          <Col xs={24} md={12}>
                            <Form.Item label={t('profile.emailNotifications', 'Email Notifications')} name={['notification_preferences', 'email']} valuePropName="checked">
                              <Switch />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12}>
                            <Form.Item label={t('profile.smsNotifications', 'SMS Notifications')} name={['notification_preferences', 'sms']} valuePropName="checked">
                              <Switch />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12}>
                            <Form.Item label={t('profile.pushNotifications', 'Push Notifications')} name={['notification_preferences', 'push']} valuePropName="checked">
                              <Switch />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12}>
                            <Form.Item label={t('profile.marketingEmails', 'Marketing Emails')} name={['notification_preferences', 'marketing']} valuePropName="checked">
                              <Switch />
                            </Form.Item>
                          </Col>
                        </Row>
                      </>
                    ),
                  },
                ]}
              />

              <Divider />

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saving}>
                    {t('profile.saveChanges', 'Save Changes')}
                  </Button>
                  <Button onClick={() => form.resetFields()}>
                    {t('common.reset', 'Reset')}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
