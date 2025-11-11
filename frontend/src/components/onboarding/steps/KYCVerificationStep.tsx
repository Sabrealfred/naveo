import { useState } from 'react';
import { Upload, Button, Alert, Typography, Space, Progress, Result } from 'antd';
import { UploadOutlined, CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

export interface KYCVerificationData {
  idDocumentFront: UploadFile | null;
  idDocumentBack: UploadFile | null;
  selfiePhoto: UploadFile | null;
  verified: boolean;
}

interface KYCVerificationStepProps {
  initialValues?: Partial<KYCVerificationData>;
  onComplete: (data: KYCVerificationData) => void;
}

export const KYCVerificationStep = ({ initialValues, onComplete }: KYCVerificationStepProps) => {
  const { t } = useTranslation();
  const [idFront, setIdFront] = useState<UploadFile | null>(initialValues?.idDocumentFront || null);
  const [idBack, setIdBack] = useState<UploadFile | null>(initialValues?.idDocumentBack || null);
  const [selfie, setSelfie] = useState<UploadFile | null>(initialValues?.selfiePhoto || null);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(initialValues?.verified || false);
  const [progress, setProgress] = useState(0);

  const handleVerify = () => {
    if (!idFront || !idBack || !selfie) {
      return;
    }

    setVerifying(true);
    setProgress(0);

    // Simulate verification process
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setVerifying(false);
          setVerified(true);
          onComplete({
            idDocumentFront: idFront,
            idDocumentBack: idBack,
            selfiePhoto: selfie,
            verified: true,
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const canVerify = idFront && idBack && selfie && !verifying && !verified;

  if (verified) {
    return (
      <div style={{ maxWidth: 500, margin: '0 auto' }}>
        <Result
          status="success"
          title={t('onboarding.kycVerification.successTitle')}
          subTitle={t('onboarding.kycVerification.successSubtitle')}
          icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <Title level={3}>{t('onboarding.kycVerification.title')}</Title>
      <Text type="secondary">{t('onboarding.kycVerification.subtitle')}</Text>

      <Alert
        message={t('onboarding.kycVerification.infoTitle')}
        description={t('onboarding.kycVerification.infoDesc')}
        type="info"
        showIcon
        style={{ marginTop: 24, marginBottom: 24 }}
      />

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Text strong>{t('onboarding.kycVerification.idFront')}</Text>
          <Upload
            accept="image/*"
            maxCount={1}
            fileList={idFront ? [idFront] : []}
            beforeUpload={(file) => {
              setIdFront(file as any);
              return false;
            }}
            onRemove={() => setIdFront(null)}
            disabled={verifying}
          >
            <Button icon={<UploadOutlined />} block size="large" disabled={verifying}>
              {t('onboarding.kycVerification.uploadButton')}
            </Button>
          </Upload>
        </div>

        <div>
          <Text strong>{t('onboarding.kycVerification.idBack')}</Text>
          <Upload
            accept="image/*"
            maxCount={1}
            fileList={idBack ? [idBack] : []}
            beforeUpload={(file) => {
              setIdBack(file as any);
              return false;
            }}
            onRemove={() => setIdBack(null)}
            disabled={verifying}
          >
            <Button icon={<UploadOutlined />} block size="large" disabled={verifying}>
              {t('onboarding.kycVerification.uploadButton')}
            </Button>
          </Upload>
        </div>

        <div>
          <Text strong>{t('onboarding.kycVerification.selfie')}</Text>
          <Upload
            accept="image/*"
            maxCount={1}
            fileList={selfie ? [selfie] : []}
            beforeUpload={(file) => {
              setSelfie(file as any);
              return false;
            }}
            onRemove={() => setSelfie(null)}
            disabled={verifying}
          >
            <Button icon={<UploadOutlined />} block size="large" disabled={verifying}>
              {t('onboarding.kycVerification.uploadButton')}
            </Button>
          </Upload>
        </div>

        {verifying && (
          <div>
            <Progress percent={progress} status="active" />
            <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
              {t('onboarding.kycVerification.verifying')}
            </Text>
          </div>
        )}

        <Button
          type="primary"
          size="large"
          block
          onClick={handleVerify}
          disabled={!canVerify}
          loading={verifying}
          icon={verifying ? <LoadingOutlined /> : null}
        >
          {t('onboarding.kycVerification.startVerification')}
        </Button>
      </Space>
    </div>
  );
};

export default KYCVerificationStep;
