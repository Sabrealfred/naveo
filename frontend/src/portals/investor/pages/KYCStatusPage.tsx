import { Card, Steps, Tag, Button, Alert, Descriptions, Timeline, Upload } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, WarningOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';

export default function KYCStatusPage() {
  const kycStatus = {
    status: 'approved', // 'pending', 'approved', 'rejected', 'incomplete'
    level: 'Level 2',
    submittedAt: '2024-10-15',
    approvedAt: '2024-10-18',
    verificationId: 'KYC-2024-1015-892',
  };

  const currentStep = kycStatus.status === 'approved' ? 3 : kycStatus.status === 'pending' ? 1 : 0;

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
            <Tag color={kycStatus.status === 'approved' ? 'green' : 'orange'}>
              {kycStatus.status.toUpperCase()}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Verification Level">
            {kycStatus.level}
          </Descriptions.Item>
          <Descriptions.Item label="Verification ID">
            {kycStatus.verificationId}
          </Descriptions.Item>
          <Descriptions.Item label="Submitted">
            {kycStatus.submittedAt}
          </Descriptions.Item>
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
              children: 'Account created - 2024-10-10',
            },
            {
              color: 'green',
              children: 'Personal information submitted - 2024-10-15',
            },
            {
              color: 'green',
              children: 'Documents uploaded - 2024-10-15',
            },
            {
              color: kycStatus.status === 'approved' ? 'green' : 'blue',
              children: kycStatus.status === 'approved'
                ? `Verification approved - ${kycStatus.approvedAt}`
                : 'Under review...',
            },
          ]}
        />
      </Card>
    </div>
  );
}
