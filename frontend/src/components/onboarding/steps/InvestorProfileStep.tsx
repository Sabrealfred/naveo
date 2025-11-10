import { Form, Select, InputNumber, Radio, Typography, Space } from 'antd';
import { DollarOutlined, TrophyOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

export interface InvestorProfileData {
  investorType: 'individual' | 'institutional';
  investmentExperience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  investmentGoals: string[];
  expectedInvestmentAmount: number;
  investmentHorizon: '1-3' | '3-5' | '5-10' | '10+';
}

interface InvestorProfileStepProps {
  initialValues?: Partial<InvestorProfileData>;
  onComplete: (data: InvestorProfileData) => void;
}

export const InvestorProfileStep = ({ initialValues, onComplete }: InvestorProfileStepProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<InvestorProfileData>();

  const handleFinish = (values: InvestorProfileData) => {
    onComplete(values);
  };

  const investmentGoalOptions = [
    { label: t('onboarding.investorProfile.goals.capitalAppreciation'), value: 'capital_appreciation' },
    { label: t('onboarding.investorProfile.goals.income'), value: 'income' },
    { label: t('onboarding.investorProfile.goals.preservation'), value: 'preservation' },
    { label: t('onboarding.investorProfile.goals.diversification'), value: 'diversification' },
    { label: t('onboarding.investorProfile.goals.retirement'), value: 'retirement' },
  ];

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <Title level={3}>{t('onboarding.investorProfile.title')}</Title>
      <Text type="secondary">{t('onboarding.investorProfile.subtitle')}</Text>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={initialValues || { investorType: 'individual' }}
        style={{ marginTop: 24 }}
      >
        <Form.Item
          name="investorType"
          label={t('onboarding.investorProfile.investorType')}
          rules={[{ required: true }]}
        >
          <Radio.Group size="large" style={{ width: '100%' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Radio value="individual">
                <div>
                  <div style={{ fontWeight: 500 }}>{t('onboarding.investorProfile.individual')}</div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {t('onboarding.investorProfile.individualDesc')}
                  </Text>
                </div>
              </Radio>
              <Radio value="institutional">
                <div>
                  <div style={{ fontWeight: 500 }}>{t('onboarding.investorProfile.institutional')}</div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {t('onboarding.investorProfile.institutionalDesc')}
                  </Text>
                </div>
              </Radio>
            </Space>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="investmentExperience"
          label={t('onboarding.investorProfile.experience')}
          rules={[{ required: true, message: t('onboarding.investorProfile.experienceRequired') }]}
        >
          <Select
            size="large"
            placeholder={t('onboarding.investorProfile.experiencePlaceholder')}
            options={[
              { value: 'beginner', label: t('onboarding.investorProfile.beginner') },
              { value: 'intermediate', label: t('onboarding.investorProfile.intermediate') },
              { value: 'advanced', label: t('onboarding.investorProfile.advanced') },
              { value: 'expert', label: t('onboarding.investorProfile.expert') },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="riskTolerance"
          label={t('onboarding.investorProfile.riskTolerance')}
          rules={[{ required: true, message: t('onboarding.investorProfile.riskToleranceRequired') }]}
        >
          <Radio.Group size="large">
            <Radio.Button value="conservative">{t('onboarding.investorProfile.conservative')}</Radio.Button>
            <Radio.Button value="moderate">{t('onboarding.investorProfile.moderate')}</Radio.Button>
            <Radio.Button value="aggressive">{t('onboarding.investorProfile.aggressive')}</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="investmentGoals"
          label={t('onboarding.investorProfile.investmentGoals')}
          rules={[{ required: true, message: t('onboarding.investorProfile.investmentGoalsRequired') }]}
        >
          <Select
            mode="multiple"
            size="large"
            placeholder={t('onboarding.investorProfile.investmentGoalsPlaceholder')}
            options={investmentGoalOptions}
            maxTagCount={3}
          />
        </Form.Item>

        <Form.Item
          name="expectedInvestmentAmount"
          label={t('onboarding.investorProfile.expectedAmount')}
          rules={[{ required: true, message: t('onboarding.investorProfile.expectedAmountRequired') }]}
        >
          <InputNumber
            size="large"
            prefix={<DollarOutlined />}
            placeholder="50,000"
            min={1000}
            step={1000}
            style={{ width: '100%' }}
            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
          />
        </Form.Item>

        <Form.Item
          name="investmentHorizon"
          label={t('onboarding.investorProfile.investmentHorizon')}
          rules={[{ required: true, message: t('onboarding.investorProfile.investmentHorizonRequired') }]}
        >
          <Radio.Group size="large">
            <Radio.Button value="1-3">{t('onboarding.investorProfile.years1to3')}</Radio.Button>
            <Radio.Button value="3-5">{t('onboarding.investorProfile.years3to5')}</Radio.Button>
            <Radio.Button value="5-10">{t('onboarding.investorProfile.years5to10')}</Radio.Button>
            <Radio.Button value="10+">{t('onboarding.investorProfile.years10plus')}</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Form>
    </div>
  );
};

export default InvestorProfileStep;
