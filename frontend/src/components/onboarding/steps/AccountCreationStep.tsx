import { Form, Input, Select, Checkbox, Typography } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Text, Link } = Typography;

export interface AccountCreationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  country: string;
  termsAccepted: boolean;
}

interface AccountCreationStepProps {
  initialValues?: Partial<AccountCreationData>;
  onComplete: (data: AccountCreationData) => void;
}

export const AccountCreationStep = ({ initialValues, onComplete }: AccountCreationStepProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<AccountCreationData>();

  const handleFinish = (values: AccountCreationData) => {
    onComplete(values);
  };

  const countries = [
    { value: 'US', label: 'United States' },
    { value: 'MX', label: 'Mexico' },
    { value: 'ES', label: 'Spain' },
    { value: 'AR', label: 'Argentina' },
    { value: 'CL', label: 'Chile' },
    { value: 'CO', label: 'Colombia' },
  ];

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <Title level={3}>{t('onboarding.accountCreation.title')}</Title>
      <Text type="secondary">{t('onboarding.accountCreation.subtitle')}</Text>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={initialValues}
        style={{ marginTop: 24 }}
      >
        <Form.Item
          name="firstName"
          label={t('onboarding.accountCreation.firstName')}
          rules={[{ required: true, message: t('onboarding.accountCreation.firstNameRequired') }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder={t('onboarding.accountCreation.firstNamePlaceholder')}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="lastName"
          label={t('onboarding.accountCreation.lastName')}
          rules={[{ required: true, message: t('onboarding.accountCreation.lastNameRequired') }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder={t('onboarding.accountCreation.lastNamePlaceholder')}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="email"
          label={t('onboarding.accountCreation.email')}
          rules={[
            { required: true, message: t('onboarding.accountCreation.emailRequired') },
            { type: 'email', message: t('login.emailInvalid') },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder={t('onboarding.accountCreation.emailPlaceholder')}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="phone"
          label={t('onboarding.accountCreation.phone')}
          rules={[{ required: true, message: t('onboarding.accountCreation.phoneRequired') }]}
        >
          <Input
            prefix={<PhoneOutlined />}
            placeholder="+1 (555) 123-4567"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="country"
          label={t('onboarding.accountCreation.country')}
          rules={[{ required: true, message: t('onboarding.accountCreation.countryRequired') }]}
        >
          <Select
            placeholder={t('onboarding.accountCreation.countryPlaceholder')}
            options={countries}
            size="large"
            showSearch
          />
        </Form.Item>

        <Form.Item
          name="password"
          label={t('onboarding.accountCreation.password')}
          rules={[
            { required: true, message: t('onboarding.accountCreation.passwordRequired') },
            { min: 8, message: t('onboarding.accountCreation.passwordMin') },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t('onboarding.accountCreation.passwordPlaceholder')}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label={t('onboarding.accountCreation.confirmPassword')}
          dependencies={['password']}
          rules={[
            { required: true, message: t('onboarding.accountCreation.confirmPasswordRequired') },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t('onboarding.accountCreation.passwordMismatch')));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t('onboarding.accountCreation.confirmPasswordPlaceholder')}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="termsAccepted"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error(t('onboarding.accountCreation.termsRequired'))),
            },
          ]}
        >
          <Checkbox>
            {t('onboarding.accountCreation.termsAccept')}{' '}
            <Link href="/terms" target="_blank">{t('onboarding.accountCreation.termsLink')}</Link>
            {' '}{t('common.and')}{' '}
            <Link href="/privacy" target="_blank">{t('onboarding.accountCreation.privacyLink')}</Link>
          </Checkbox>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AccountCreationStep;
