import { useState } from 'react';
import { Card, Steps, Tag, Button, Alert, Descriptions, Timeline, message } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, WarningOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { KYCFormModal } from '../../../components/modals';

export default function KYCStatusPage() {
  const [kycModalVisible, setKycModalVisible] = useState(false);

  // Mock data - In production, fetch from Supabase
  const kycStatus = {
    status: 'incomplete', // 'pending', 'approved', 'rejected', 'incomplete'
    level: 'Level 0',
    submittedAt: null,
    approvedAt: null,
    verificationId: null,
  };

  const currentStep = kycStatus.status === 'approved' ? 3 : kycStatus.status === 'pending' ? 1 : 0;

  const handleKYCSubmit = (values: any) => {
    console.log('KYC Form submitted:', values);
    message.success('KYC verification submitted successfully! We will review your documents within 1-2 business days.');
    // In production: Send to Supabase, update status to 'pending'
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px', fontFamily: 'var(--font-heading)' }}>
        KYC Verification Status
      </h1>

      {kycStatus.status === 'approved' && (
        <Alert
          message="Verification Complete"
          description="Your identity has been successfully verified. You can now access all platform features."
          type="success"
          showIcon
          icon={<CheckCircleOutlined />}
          style={{ marginBottom: '24px' }}
        />
      )}

      {kycStatus.status === 'pending' && (
        <Alert
          message="Verification in Progress"
          description="Your documents are being reviewed. This typically takes 1-2 business days."
          type="info"
          showIcon
          icon={<ClockCircleOutlined />}
          style={{ marginBottom: '24px' }}
        />
      )}

      {kycStatus.status === 'incomplete' && (
        <Alert
          message="KYC Verification Required"
          description="To access all platform features and increase your investment limits, please complete the KYC verification process."
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          style={{ marginBottom: '24px' }}
          action={
            <Button type="primary" size="large" onClick={() => setKycModalVisible(true)}>
              Start KYC Verification
            </Button>
          }
        />
      )}

      <Card style={{ marginBottom: '24px' }}>
        <Steps
          current={currentStep}
          items={[
            {
              title: 'Personal Info',
              description: 'Basic information',
              icon: <UserOutlined />,
            },
            {
              title: 'Document Upload',
              description: 'ID verification',
              icon: <UploadOutlined />,
            },
            {
              title: 'Review',
              description: 'Verification pending',
              icon: <ClockCircleOutlined />,
            },
            {
              title: 'Approved',
              description: 'All set!',
              icon: <CheckCircleOutlined />,
            },
          ]}
        />
      </Card>

      <Card title="Verification Details" style={{ marginBottom: '24px' }}>
        <Descriptions column={2}>
          <Descriptions.Item label="Status">
            <Tag color={
              kycStatus.status === 'approved' ? 'green' :
              kycStatus.status === 'pending' ? 'blue' :
              kycStatus.status === 'rejected' ? 'red' : 'orange'
            }>
              {kycStatus.status.toUpperCase()}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Verification Level">
            {kycStatus.level}
          </Descriptions.Item>
          {kycStatus.verificationId && (
            <Descriptions.Item label="Verification ID">
              {kycStatus.verificationId}
            </Descriptions.Item>
          )}
          {kycStatus.submittedAt && (
            <Descriptions.Item label="Submitted">
              {kycStatus.submittedAt}
            </Descriptions.Item>
          )}
          {kycStatus.approvedAt && (
            <Descriptions.Item label="Approved">
              {kycStatus.approvedAt}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      <Card title="Verification Timeline">
        <Timeline
          items={[
            {
              color: 'green',
              children: 'Account created - 2024-11-01',
            },
            {
              color: kycStatus.status === 'incomplete' ? 'gray' : 'green',
              children: kycStatus.status === 'incomplete'
                ? 'Waiting for KYC submission...'
                : `Personal information submitted - ${kycStatus.submittedAt}`,
            },
            ...(kycStatus.status !== 'incomplete' ? [{
              color: kycStatus.status === 'approved' ? 'green' : 'blue',
              children: kycStatus.status === 'approved'
                ? `Verification approved - ${kycStatus.approvedAt}`
                : 'Under review...',
            }] : []),
          ]}
        />
      </Card>

      <KYCFormModal
        visible={kycModalVisible}
        onClose={() => setKycModalVisible(false)}
        onSubmit={handleKYCSubmit}
        type="individual"
      />
    </div>
  );
}
