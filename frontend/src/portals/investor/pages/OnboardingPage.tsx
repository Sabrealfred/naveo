import { Card } from 'antd';
import { OnboardingWizard } from '../../../components/onboarding/OnboardingWizard';

/**
 * OnboardingPage - Full-page investor onboarding flow
 *
 * This page renders the complete onboarding wizard for new investors.
 * It includes account creation, investor profile setup, and KYC verification.
 */
const OnboardingPage = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f0f2f5',
      padding: '24px'
    }}>
      <Card
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <OnboardingWizard />
      </Card>
    </div>
  );
};

export default OnboardingPage;
