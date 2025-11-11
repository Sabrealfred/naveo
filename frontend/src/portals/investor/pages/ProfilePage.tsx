import { Card, Col, Row, Form, Input, Button, Select, Upload, message, Divider, Avatar, Space } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  UploadOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

export default function ProfilePage() {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    console.log('Profile updated:', values);
    message.success('Profile updated successfully!');
  };

  const userProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    country: 'United States',
    city: 'New York',
    address: '123 Main Street, Apt 4B',
    zipCode: '10001',
    investorType: 'Individual',
    riskTolerance: 'Moderate',
  };

  return (
    <div style={{ padding: '24px', background: 'var(--color-background)' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
          {t('profile.title', 'My Profile')}
        </h1>
        <p style={{ color: 'var(--color-secondary)', fontSize: '14px' }}>
          {t('profile.subtitle', 'Manage your account information and preferences')}
        </p>
      </div>

      <Row gutter={[16, 16]}>
        {/* Profile Summary Card */}
        <Col xs={24} lg={8}>
          <Card className="professional-card" style={{ textAlign: 'center' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Avatar
                size={120}
                icon={<UserOutlined />}
                style={{ backgroundColor: '#2d2d2d', margin: '0 auto' }}
              />
              <div>
                <h3 style={{ margin: 0 }}>{userProfile.name}</h3>
                <p style={{ color: '#999', margin: '8px 0' }}>{userProfile.email}</p>
                <Upload>
                  <Button icon={<UploadOutlined />}>{t('profile.changePhoto', 'Change Photo')}</Button>
                </Upload>
              </div>
              <Divider />
              <div style={{ textAlign: 'left', width: '100%' }}>
                <p><strong>{t('profile.investorType', 'Investor Type')}:</strong> {userProfile.investorType}</p>
                <p><strong>{t('profile.riskTolerance', 'Risk Tolerance')}:</strong> {userProfile.riskTolerance}</p>
                <p><strong>{t('profile.memberSince', 'Member Since')}:</strong> August 2024</p>
              </div>
            </Space>
          </Card>
        </Col>

        {/* Profile Form */}
        <Col xs={24} lg={16}>
          <Card title={t('profile.personalInfo', 'Personal Information')} bordered={false} className="professional-card">
            <Form
              form={form}
              layout="vertical"
              initialValues={userProfile}
              onFinish={handleSubmit}
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={t('profile.fullName', 'Full Name')}
                    name="name"
                    rules={[{ required: true, message: t('profile.nameRequired', 'Please enter your name') }]}
                  >
                    <Input prefix={<UserOutlined />} size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={t('profile.email', 'Email')}
                    name="email"
                    rules={[
                      { required: true, message: t('profile.emailRequired', 'Please enter your email') },
                      { type: 'email', message: t('profile.emailInvalid', 'Please enter a valid email') },
                    ]}
                  >
                    <Input prefix={<MailOutlined />} size="large" disabled />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={t('profile.phoneNumber', 'Phone Number')}
                    name="phone"
                  >
                    <Input prefix={<PhoneOutlined />} size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={t('profile.investorType', 'Investor Type')}
                    name="investorType"
                  >
                    <Select size="large">
                      <Select.Option value="Individual">{t('profile.individual', 'Individual')}</Select.Option>
                      <Select.Option value="Corporate">{t('profile.corporate', 'Corporate')}</Select.Option>
                      <Select.Option value="Institutional">{t('profile.institutional', 'Institutional')}</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Divider>{t('profile.addressInfo', 'Address Information')}</Divider>

              <Row gutter={16}>
                <Col xs={24}>
                  <Form.Item
                    label={t('profile.street', 'Street Address')}
                    name="address"
                  >
                    <Input prefix={<HomeOutlined />} size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item
                    label={t('profile.city', 'City')}
                    name="city"
                  >
                    <Input size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label={t('profile.country', 'Country')}
                    name="country"
                  >
                    <Select size="large">
                      <Select.Option value="United States">United States</Select.Option>
                      <Select.Option value="Canada">Canada</Select.Option>
                      <Select.Option value="United Kingdom">United Kingdom</Select.Option>
                      <Select.Option value="Other">Other</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label={t('profile.zipCode', 'Zip Code')}
                    name="zipCode"
                  >
                    <Input size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Divider>{t('profile.preferences', 'Preferences')}</Divider>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={t('profile.riskTolerance', 'Risk Tolerance')}
                    name="riskTolerance"
                  >
                    <Select size="large">
                      <Select.Option value="Conservative">{t('profile.conservative', 'Conservative')}</Select.Option>
                      <Select.Option value="Moderate">{t('profile.moderate', 'Moderate')}</Select.Option>
                      <Select.Option value="Aggressive">{t('profile.aggressive', 'Aggressive')}</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large">
                    {t('profile.saveChanges', 'Save Changes')}
                  </Button>
                  <Button size="large">{t('common.cancel', 'Cancel')}</Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
