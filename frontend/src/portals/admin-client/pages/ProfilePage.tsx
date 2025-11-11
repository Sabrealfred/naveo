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
      message.success('Profile updated successfully');
      await loadProfile();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      message.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!profile) return false;

    try {
      await profileService.uploadAvatar(profile.id, file);
      message.success('Avatar uploaded successfully');
      await loadProfile();
      return false;
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      message.error('Failed to upload avatar');
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
        <Text>No profile found. Please contact support.</Text>
      </Card>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={3}>My Profile</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        Manage your account information and preferences
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
                <Button icon={<UploadOutlined />}>Change Avatar</Button>
              </Upload>
              <Divider />
              <div style={{ textAlign: 'left', width: '100%' }}>
                <Text type="secondary">Display Name</Text>
                <Title level={4} style={{ margin: '8px 0' }}>
                  {profile.display_name || profile.full_name || 'Not set'}
                </Title>
                <Text type="secondary">Member since</Text>
                <div style={{ marginTop: 4 }}>
                  <Text>{dayjs(profile.created_at).format('MMMM YYYY')}</Text>
                </div>
              </div>
            </Space>
          </Card>

          {/* Quick Stats Card */}
          <Card style={{ marginTop: 16 }} title="Account Stats">
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">Login Count:</Text>
                <Text strong>{profile.login_count || 0}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">Last Login:</Text>
                <Text>{profile.last_login_at ? dayjs(profile.last_login_at).format('MMM D, YYYY') : 'Never'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">Role:</Text>
                <Text strong>Fund Administrator</Text>
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
                        <UserOutlined /> Personal Info
                      </span>
                    ),
                    children: (
                      <>
                        <Row gutter={16}>
                          <Col xs={24} md={12}>
                            <Form.Item
                              label="Full Name"
                              name="full_name"
                              rules={[{ required: true, message: 'Please enter your full name' }]}
                            >
                              <Input prefix={<UserOutlined />} placeholder="John Doe" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12}>
                            <Form.Item label="Display Name" name="display_name">
                              <Input prefix={<UserOutlined />} placeholder="John" />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row gutter={16}>
                          <Col xs={24} md={12}>
                            <Form.Item
                              label="Phone"
                              name="phone"
                              rules={[{ required: true, message: 'Please enter your phone number' }]}
                            >
                              <Input prefix={<PhoneOutlined />} placeholder="+1 (555) 123-4567" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12}>
                            <Form.Item label="Date of Birth" name="date_of_birth">
                              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                            </Form.Item>
                          </Col>
                        </Row>
                      </>
                    ),
                  },
                  {
                    key: 'professional',
                    label: (
                      <span>
                        <IdcardOutlined /> Professional Info
                      </span>
                    ),
                    children: (
                      <>
                        <Form.Item label="Job Title" name="job_title">
                          <Input prefix={<IdcardOutlined />} placeholder="Fund Administrator" />
                        </Form.Item>

                        <Row gutter={16}>
                          <Col xs={24} md={12}>
                            <Form.Item label="Department" name="department">
                              <Input placeholder="Operations" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12}>
                            <Form.Item label="Company" name="company_name">
                              <Input placeholder="Acme Fund Management" />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Form.Item label="Professional Bio" name="professional_bio">
                          <TextArea rows={4} placeholder="Brief description about your role..." />
                        </Form.Item>

                        <Form.Item label="LinkedIn URL" name="linkedin_url">
                          <Input prefix={<GlobalOutlined />} placeholder="https://linkedin.com/in/..." />
                        </Form.Item>
                      </>
                    ),
                  },
                  {
                    key: 'address',
                    label: (
                      <span>
                        <HomeOutlined /> Address
                      </span>
                    ),
                    children: (
                      <>
                        <Form.Item label="Street Address" name="street_address">
                          <Input placeholder="123 Main Street" />
                        </Form.Item>

                        <Row gutter={16}>
                          <Col xs={24} md={8}>
                            <Form.Item label="City" name="city">
                              <Input placeholder="New York" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={8}>
                            <Form.Item label="State/Province" name="state_province">
                              <Input placeholder="NY" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={8}>
                            <Form.Item label="Postal Code" name="postal_code">
                              <Input placeholder="10001" />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Form.Item label="Country" name="country">
                          <Select
                            showSearch
                            placeholder="Select country"
                            options={[
                              { label: 'United States', value: 'United States' },
                              { label: 'Canada', value: 'Canada' },
                              { label: 'United Kingdom', value: 'United Kingdom' },
                              { label: 'Germany', value: 'Germany' },
                              { label: 'France', value: 'France' },
                            ]}
                          />
                        </Form.Item>
                      </>
                    ),
                  },
                  {
                    key: 'preferences',
                    label: (
                      <span>
                        <BellOutlined /> Preferences
                      </span>
                    ),
                    children: (
                      <>
                        <Row gutter={16}>
                          <Col xs={24} md={8}>
                            <Form.Item label="Language" name="language">
                              <Select
                                options={[
                                  { label: 'English', value: 'en' },
                                  { label: 'Español', value: 'es' },
                                  { label: 'Français', value: 'fr' },
                                ]}
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={8}>
                            <Form.Item label="Timezone" name="timezone">
                              <Select
                                showSearch
                                options={[
                                  { label: 'America/New_York', value: 'America/New_York' },
                                  { label: 'America/Chicago', value: 'America/Chicago' },
                                  { label: 'America/Los_Angeles', value: 'America/Los_Angeles' },
                                  { label: 'Europe/London', value: 'Europe/London' },
                                ]}
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={8}>
                            <Form.Item label="Currency" name="currency">
                              <Select
                                options={[
                                  { label: 'USD', value: 'USD' },
                                  { label: 'EUR', value: 'EUR' },
                                  { label: 'GBP', value: 'GBP' },
                                ]}
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Divider>Notification Preferences</Divider>

                        <Row gutter={[16, 16]}>
                          <Col xs={24} md={12}>
                            <Form.Item label="Email Notifications" name={['notification_preferences', 'email']} valuePropName="checked">
                              <Switch />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12}>
                            <Form.Item label="SMS Notifications" name={['notification_preferences', 'sms']} valuePropName="checked">
                              <Switch />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12}>
                            <Form.Item label="Push Notifications" name={['notification_preferences', 'push']} valuePropName="checked">
                              <Switch />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12}>
                            <Form.Item label="Marketing Emails" name={['notification_preferences', 'marketing']} valuePropName="checked">
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
                    Save Changes
                  </Button>
                  <Button onClick={() => form.resetFields()}>
                    Reset
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
