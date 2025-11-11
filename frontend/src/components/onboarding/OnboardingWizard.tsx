import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Result, Button } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { MultiStepForm } from '../common';
import type { Step } from '../common/MultiStepForm';
import { AccountCreationStep, type AccountCreationData } from './steps/AccountCreationStep';
import { InvestorProfileStep, type InvestorProfileData } from './steps/InvestorProfileStep';
import { KYCVerificationStep, type KYCVerificationData } from './steps/KYCVerificationStep';

export interface OnboardingData {
  accountCreation?: AccountCreationData;
  investorProfile?: InvestorProfileData;
  kycVerification?: KYCVerificationData;
  completedAt?: string;
}

const STORAGE_KEY = 'naveo_onboarding_data';

export const OnboardingWizard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(() => {
    // Load saved data from localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });
  const [isComplete, setIsComplete] = useState(false);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (Object.keys(onboardingData).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(onboardingData));
    }
  }, [onboardingData]);

  const handleAccountCreation = (data: AccountCreationData) => {
    setOnboardingData((prev) => ({ ...prev, accountCreation: data }));
  };

  const handleInvestorProfile = (data: InvestorProfileData) => {
    setOnboardingData((prev) => ({ ...prev, investorProfile: data }));
  };

  const handleKYCVerification = (data: KYCVerificationData) => {
    setOnboardingData((prev) => ({ ...prev, kycVerification: data }));
  };

  const handleFinish = async () => {
    try {
      // Complete onboarding
      const completedData: OnboardingData = {
        ...onboardingData,
        completedAt: new Date().toISOString(),
      };

      // Save completed data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedData));

      message.success(t('onboarding.success'));
      setIsComplete(true);

      // Clear after 3 seconds and redirect
      setTimeout(() => {
        localStorage.removeItem(STORAGE_KEY);
        navigate('/investor/dashboard');
      }, 3000);
    } catch (error) {
      message.error(t('onboarding.error'));
    }
  };

  if (isComplete) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Result
          status="success"
          title={t('onboarding.completeTitle')}
          subTitle={t('onboarding.completeSubtitle')}
          icon={<CheckCircleOutlined style={{ fontSize: 72, color: '#52c41a' }} />}
          extra={[
            <Button type="primary" key="dashboard" onClick={() => navigate('/investor/dashboard')}>
              {t('onboarding.goToDashboard')}
            </Button>,
          ]}
        />
      </div>
    );
  }

  const steps: Step[] = [
    {
      title: t('onboarding.steps.accountCreation'),
      description: t('onboarding.steps.accountCreationDesc'),
      content: (
        <AccountCreationStep
          initialValues={onboardingData.accountCreation}
          onComplete={handleAccountCreation}
        />
      ),
    },
    {
      title: t('onboarding.steps.investorProfile'),
      description: t('onboarding.steps.investorProfileDesc'),
      content: (
        <InvestorProfileStep
          initialValues={onboardingData.investorProfile}
          onComplete={handleInvestorProfile}
        />
      ),
    },
    {
      title: t('onboarding.steps.kycVerification'),
      description: t('onboarding.steps.kycVerificationDesc'),
      content: (
        <KYCVerificationStep
          initialValues={onboardingData.kycVerification}
          onComplete={handleKYCVerification}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      <MultiStepForm
        steps={steps}
        onFinish={handleFinish}
        onStepChange={setCurrentStep}
        initialStep={currentStep}
        showStepNumber
        submitText={t('onboarding.complete')}
        nextText={t('common.next')}
        prevText={t('common.previous')}
      />
    </div>
  );
};

export default OnboardingWizard;
