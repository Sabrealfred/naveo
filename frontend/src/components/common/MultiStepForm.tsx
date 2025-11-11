import { ReactNode, useState } from 'react';
import { Steps, Button, Space, Card } from 'antd';
import { useTranslation } from 'react-i18next';

export interface Step {
  title: string;
  description?: string;
  content: ReactNode;
  icon?: ReactNode;
}

export interface MultiStepFormProps {
  steps: Step[];
  onFinish: (values: any) => void | Promise<void>;
  onStepChange?: (step: number) => void;
  initialStep?: number;
  showStepNumber?: boolean;
  submitText?: string;
  nextText?: string;
  prevText?: string;
}

export const MultiStepForm = ({
  steps,
  onFinish,
  onStepChange,
  initialStep = 0,
  showStepNumber = true,
  submitText,
  nextText,
  prevText,
}: MultiStepFormProps) => {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(initialStep);
  const [loading, setLoading] = useState(false);

  const next = () => {
    const nextStep = current + 1;
    setCurrent(nextStep);
    if (onStepChange) {
      onStepChange(nextStep);
    }
  };

  const prev = () => {
    const prevStep = current - 1;
    setCurrent(prevStep);
    if (onStepChange) {
      onStepChange(prevStep);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await onFinish({});
    } finally {
      setLoading(false);
    }
  };

  const items = steps.map((step, index) => ({
    key: String(index),
    title: step.title,
    description: step.description,
    icon: step.icon,
  }));

  return (
    <Card>
      <Steps
        current={current}
        items={items}
        style={{ marginBottom: 24 }}
        type={showStepNumber ? 'default' : 'navigation'}
      />

      <div style={{ minHeight: 300, padding: '24px 0' }}>{steps[current].content}</div>

      <Space style={{ width: '100%', justifyContent: 'flex-end', marginTop: 24 }}>
        {current > 0 && (
          <Button onClick={prev} disabled={loading}>
            {prevText || t('common.previous')}
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button type="primary" onClick={next}>
            {nextText || t('common.next')}
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={handleFinish} loading={loading}>
            {submitText || t('common.submit')}
          </Button>
        )}
      </Space>
    </Card>
  );
};

export default MultiStepForm;
