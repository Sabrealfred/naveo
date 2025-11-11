import { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  Button,
  Steps,
  message,
  Card,
  Space,
  Divider,
  Checkbox,
  Row,
  Col,
  Tag,
  Alert,
} from 'antd';
import {
  UploadOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
  FileProtectOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { UploadFile } from 'antd';

interface KYBVerificationModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  organizationId?: string;
  existingData?: any;
}

const KYBVerificationModal = ({
  visible,
  onClose,
  onSubmit,
  organizationId,
  existingData,
}: KYBVerificationModalProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Document upload states
  const [businessLicense, setBusinessLicense] = useState<UploadFile[]>([]);
  const [articlesOfIncorp, setArticlesOfIncorp] = useState<UploadFile[]>([]);
  const [proofOfAddress, setProofOfAddress] = useState<UploadFile[]>([]);
  const [shareholderDocs, setShareholderDocs] = useState<UploadFile[]>([]);
  const [uboDocuments, setUboDocuments] = useState<UploadFile[]>([]);

  const steps = [
    {
      title: t('kyb.steps.businessInfo', 'Business Information'),
      icon: <BankOutlined />,
    },
    {
      title: t('kyb.steps.documents', 'Documents'),
      icon: <FileProtectOutlined />,
    },
    {
      title: t('kyb.steps.ubo', 'Beneficial Owners'),
      icon: <SafetyCertificateOutlined />,
    },
    {
      title: t('kyb.steps.review', 'Review & Submit'),
      icon: <CheckCircleOutlined />,
    },
  ];

  const handleNext = async () => {
    try {
      await form.validateFields();
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    } catch (error) {
      message.error(t('kyb.errors.completeFields', 'Please complete all required fields'));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = form.getFieldsValue();

      // Combine all data including documents
      const submissionData = {
        ...values,
        documents: {
          businessLicense,
          articlesOfIncorp,
          proofOfAddress,
          shareholderDocs,
          uboDocuments,
        },
        organizationId,
        submittedAt: new Date().toISOString(),
      };

      await onSubmit(submissionData);
      message.success(t('kyb.success', 'KYB verification submitted successfully!'));
      handleClose();
    } catch (error) {
      message.error(t('kyb.errors.submission', 'Failed to submit KYB verification'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setCurrentStep(0);
    setBusinessLicense([]);
    setArticlesOfIncorp([]);
    setProofOfAddress([]);
    setShareholderDocs([]);
    setUboDocuments([]);
    onClose();
  };

  return (
    <Modal
      title={t('kyb.title', 'Know Your Business (KYB) Verification')}
      open={visible}
      onCancel={handleClose}
      width={900}
      footer={null}
      destroyOnClose
    >
      <Alert
        message={t('kyb.info.title', 'Business Verification Required')}
        description={t(
          'kyb.info.description',
          'Complete KYB verification to enable your organization for investments. This process typically takes 2-3 business days.'
        )}
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Steps current={currentStep} items={steps} style={{ marginBottom: 32 }} />

      <Form
        form={form}
        layout="vertical"
        initialValues={existingData}
      >
        {/* Step 0: Business Information */}
        {currentStep === 0 && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="organizationName"
                  label={t('kyb.fields.orgName', 'Organization Name')}
                  rules={[{ required: true, message: t('kyb.errors.orgNameRequired', 'Organization name is required') }]}
                >
                  <Input size="large" placeholder="Acme Corporation Ltd." />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="organizationType"
                  label={t('kyb.fields.orgType', 'Organization Type')}
                  rules={[{ required: true }]}
                >
                  <Select size="large" placeholder={t('kyb.placeholders.selectType', 'Select type')}>
                    <Select.Option value="fund">{t('kyb.types.fund', 'Fund')}</Select.Option>
                    <Select.Option value="corporation">{t('kyb.types.corporation', 'Corporation')}</Select.Option>
                    <Select.Option value="llc">{t('kyb.types.llc', 'LLC')}</Select.Option>
                    <Select.Option value="partnership">{t('kyb.types.partnership', 'Partnership')}</Select.Option>
                    <Select.Option value="trust">{t('kyb.types.trust', 'Trust')}</Select.Option>
                    <Select.Option value="other">{t('kyb.types.other', 'Other')}</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="jurisdiction"
                  label={t('kyb.fields.jurisdiction', 'Jurisdiction')}
                  rules={[{ required: true }]}
                >
                  <Select size="large" placeholder={t('kyb.placeholders.selectCountry', 'Select country')}>
                    <Select.Option value="US">United States</Select.Option>
                    <Select.Option value="GB">United Kingdom</Select.Option>
                    <Select.Option value="SG">Singapore</Select.Option>
                    <Select.Option value="AE">UAE</Select.Option>
                    <Select.Option value="TR">Turkey</Select.Option>
                    <Select.Option value="DE">Germany</Select.Option>
                    <Select.Option value="CH">Switzerland</Select.Option>
                    <Select.Option value="OTHER">Other</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="incorporationDate"
                  label={t('kyb.fields.incorporationDate', 'Incorporation Date')}
                  rules={[{ required: true }]}
                >
                  <DatePicker size="large" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="registrationNumber"
                  label={t('kyb.fields.registrationNumber', 'Registration Number')}
                  rules={[{ required: true }]}
                >
                  <Input size="large" placeholder="12345678" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="taxId"
                  label={t('kyb.fields.taxId', 'Tax ID / EIN / VAT')}
                  rules={[{ required: true }]}
                >
                  <Input size="large" placeholder="XX-XXXXXXX" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="businessAddress"
              label={t('kyb.fields.businessAddress', 'Business Address')}
              rules={[{ required: true }]}
            >
              <Input.TextArea
                rows={2}
                placeholder="123 Business Street, Suite 100, City, Country"
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="contactEmail"
                  label={t('kyb.fields.contactEmail', 'Contact Email')}
                  rules={[
                    { required: true },
                    { type: 'email', message: t('kyb.errors.invalidEmail', 'Invalid email') },
                  ]}
                >
                  <Input size="large" type="email" placeholder="contact@company.com" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="contactPhone"
                  label={t('kyb.fields.contactPhone', 'Contact Phone')}
                  rules={[{ required: true }]}
                >
                  <Input size="large" placeholder="+1 (555) 123-4567" />
                </Form.Item>
              </Col>
            </Row>
          </div>
        )}

        {/* Step 1: Documents */}
        {currentStep === 1 && (
          <div>
            <Card title={t('kyb.documents.businessLicense', 'Business License')} size="small" style={{ marginBottom: 16 }}>
              <Form.Item
                name="businessLicenseUpload"
                rules={[{ required: true, message: t('kyb.errors.businessLicenseRequired', 'Business license is required') }]}
              >
                <Upload
                  fileList={businessLicense}
                  onChange={({ fileList }) => setBusinessLicense(fileList)}
                  beforeUpload={() => false}
                  maxCount={1}
                  accept=".pdf,.jpg,.png"
                >
                  <Button icon={<UploadOutlined />}>
                    {t('kyb.actions.uploadDocument', 'Upload Document')}
                  </Button>
                </Upload>
              </Form.Item>
              <p style={{ color: '#999', fontSize: 12, marginTop: 8 }}>
                {t('kyb.documents.licenseInfo', 'Valid business license or certificate of good standing')}
              </p>
            </Card>

            <Card title={t('kyb.documents.articlesOfIncorporation', 'Articles of Incorporation')} size="small" style={{ marginBottom: 16 }}>
              <Form.Item
                name="articlesUpload"
                rules={[{ required: true, message: t('kyb.errors.articlesRequired', 'Articles of incorporation required') }]}
              >
                <Upload
                  fileList={articlesOfIncorp}
                  onChange={({ fileList }) => setArticlesOfIncorp(fileList)}
                  beforeUpload={() => false}
                  maxCount={1}
                  accept=".pdf,.jpg,.png"
                >
                  <Button icon={<UploadOutlined />}>
                    {t('kyb.actions.uploadDocument', 'Upload Document')}
                  </Button>
                </Upload>
              </Form.Item>
              <p style={{ color: '#999', fontSize: 12, marginTop: 8 }}>
                {t('kyb.documents.articlesInfo', 'Certificate of incorporation or formation documents')}
              </p>
            </Card>

            <Card title={t('kyb.documents.proofOfAddress', 'Proof of Business Address')} size="small" style={{ marginBottom: 16 }}>
              <Form.Item
                name="addressProofUpload"
                rules={[{ required: true, message: t('kyb.errors.addressProofRequired', 'Proof of address required') }]}
              >
                <Upload
                  fileList={proofOfAddress}
                  onChange={({ fileList }) => setProofOfAddress(fileList)}
                  beforeUpload={() => false}
                  maxCount={1}
                  accept=".pdf,.jpg,.png"
                >
                  <Button icon={<UploadOutlined />}>
                    {t('kyb.actions.uploadDocument', 'Upload Document')}
                  </Button>
                </Upload>
              </Form.Item>
              <p style={{ color: '#999', fontSize: 12, marginTop: 8 }}>
                {t('kyb.documents.addressInfo', 'Utility bill, lease agreement, or bank statement (less than 3 months old)')}
              </p>
            </Card>

            <Card title={t('kyb.documents.shareholderDisclosure', 'Shareholder Disclosure')} size="small">
              <Form.Item name="shareholderDocsUpload">
                <Upload
                  fileList={shareholderDocs}
                  onChange={({ fileList }) => setShareholderDocs(fileList)}
                  beforeUpload={() => false}
                  accept=".pdf,.jpg,.png"
                >
                  <Button icon={<UploadOutlined />}>
                    {t('kyb.actions.uploadDocument', 'Upload Document')}
                  </Button>
                </Upload>
              </Form.Item>
              <p style={{ color: '#999', fontSize: 12, marginTop: 8 }}>
                {t('kyb.documents.shareholderInfo', 'List of shareholders owning 25% or more (optional for Tier 1)')}
              </p>
            </Card>
          </div>
        )}

        {/* Step 2: Ultimate Beneficial Owners (UBO) */}
        {currentStep === 2 && (
          <div>
            <Alert
              message={t('kyb.ubo.title', 'Ultimate Beneficial Owner Disclosure')}
              description={t(
                'kyb.ubo.description',
                'List all individuals who ultimately own or control 25% or more of the organization.'
              )}
              type="warning"
              showIcon
              style={{ marginBottom: 24 }}
            />

            <Form.Item
              name="uboCount"
              label={t('kyb.fields.uboCount', 'Number of Beneficial Owners (25%+ ownership)')}
              rules={[{ required: true }]}
            >
              <Select size="large">
                <Select.Option value="0">{t('kyb.ubo.none', 'None (publicly traded)')}</Select.Option>
                <Select.Option value="1">1</Select.Option>
                <Select.Option value="2">2</Select.Option>
                <Select.Option value="3">3</Select.Option>
                <Select.Option value="4">4</Select.Option>
                <Select.Option value="5+">{t('kyb.ubo.fivePlus', '5 or more')}</Select.Option>
              </Select>
            </Form.Item>

            <Divider>{t('kyb.ubo.primaryOwner', 'Primary Beneficial Owner')}</Divider>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={['ubo1', 'fullName']}
                  label={t('kyb.fields.fullName', 'Full Name')}
                  rules={[{ required: true }]}
                >
                  <Input size="large" placeholder="John Doe" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={['ubo1', 'ownership']}
                  label={t('kyb.fields.ownership', 'Ownership %')}
                  rules={[{ required: true }]}
                >
                  <Input size="large" type="number" min={0} max={100} suffix="%" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={['ubo1', 'nationality']}
                  label={t('kyb.fields.nationality', 'Nationality')}
                  rules={[{ required: true }]}
                >
                  <Select size="large" placeholder={t('kyb.placeholders.selectCountry', 'Select country')}>
                    <Select.Option value="US">United States</Select.Option>
                    <Select.Option value="GB">United Kingdom</Select.Option>
                    <Select.Option value="TR">Turkey</Select.Option>
                    <Select.Option value="OTHER">Other</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={['ubo1', 'idNumber']}
                  label={t('kyb.fields.idNumber', 'ID Number')}
                  rules={[{ required: true }]}
                >
                  <Input size="large" placeholder="ID/Passport number" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="uboDocumentsUpload"
              label={t('kyb.fields.uboDocuments', 'UBO Documentation')}
              rules={[{ required: true, message: t('kyb.errors.uboDocsRequired', 'UBO documents required') }]}
            >
              <Upload
                fileList={uboDocuments}
                onChange={({ fileList }) => setUboDocuments(fileList)}
                beforeUpload={() => false}
                accept=".pdf,.jpg,.png"
                multiple
              >
                <Button icon={<UploadOutlined />}>
                  {t('kyb.actions.uploadDocuments', 'Upload Documents')}
                </Button>
              </Upload>
            </Form.Item>
            <p style={{ color: '#999', fontSize: 12 }}>
              {t('kyb.ubo.docsInfo', 'ID documents for each beneficial owner (passport, national ID, driver\'s license)')}
            </p>

            <Divider />

            <Form.Item name="pepDeclaration" valuePropName="checked">
              <Checkbox>
                {t(
                  'kyb.declarations.pep',
                  'I confirm that no beneficial owner is a Politically Exposed Person (PEP) or family member of a PEP'
                )}
              </Checkbox>
            </Form.Item>

            <Form.Item name="sanctionsDeclaration" valuePropName="checked">
              <Checkbox>
                {t(
                  'kyb.declarations.sanctions',
                  'I confirm that the organization and all beneficial owners are not subject to any sanctions'
                )}
              </Checkbox>
            </Form.Item>
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {currentStep === 3 && (
          <div>
            <Card title={t('kyb.review.businessInfo', 'Business Information')} style={{ marginBottom: 16 }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div>
                    <div style={{ color: '#999', fontSize: 12 }}>{t('kyb.fields.orgName', 'Organization Name')}</div>
                    <div style={{ fontWeight: 500 }}>{form.getFieldValue('organizationName')}</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <div style={{ color: '#999', fontSize: 12 }}>{t('kyb.fields.orgType', 'Organization Type')}</div>
                    <div style={{ fontWeight: 500 }}>{form.getFieldValue('organizationType')}</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <div style={{ color: '#999', fontSize: 12 }}>{t('kyb.fields.jurisdiction', 'Jurisdiction')}</div>
                    <div style={{ fontWeight: 500 }}>{form.getFieldValue('jurisdiction')}</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <div style={{ color: '#999', fontSize: 12 }}>{t('kyb.fields.taxId', 'Tax ID')}</div>
                    <div style={{ fontWeight: 500 }}>{form.getFieldValue('taxId')}</div>
                  </div>
                </Col>
              </Row>
            </Card>

            <Card title={t('kyb.review.documents', 'Uploaded Documents')} style={{ marginBottom: 16 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Tag color="green">{businessLicense.length} {t('kyb.documents.businessLicense', 'Business License')}</Tag>
                  <Tag color="green">{articlesOfIncorp.length} {t('kyb.documents.articlesOfIncorporation', 'Articles')}</Tag>
                  <Tag color="green">{proofOfAddress.length} {t('kyb.documents.proofOfAddress', 'Address Proof')}</Tag>
                  {shareholderDocs.length > 0 && (
                    <Tag color="blue">{shareholderDocs.length} {t('kyb.documents.shareholderDisclosure', 'Shareholder Docs')}</Tag>
                  )}
                  {uboDocuments.length > 0 && (
                    <Tag color="blue">{uboDocuments.length} {t('kyb.fields.uboDocuments', 'UBO Documents')}</Tag>
                  )}
                </div>
              </Space>
            </Card>

            <Card title={t('kyb.review.compliance', 'Compliance Status')}>
              <Space direction="vertical">
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  {t('kyb.status.businessInfoComplete', 'Business information complete')}
                </div>
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  {t('kyb.status.documentsUploaded', 'All required documents uploaded')}
                </div>
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  {t('kyb.status.uboDisclosed', 'Beneficial owners disclosed')}
                </div>
              </Space>
            </Card>

            <Alert
              message={t('kyb.submit.title', 'Ready to Submit')}
              description={t(
                'kyb.submit.description',
                'Your KYB application will be reviewed by our compliance team within 2-3 business days. You will receive email notifications about the status.'
              )}
              type="success"
              showIcon
              style={{ marginTop: 16 }}
            />
          </div>
        )}
      </Form>

      <Divider />

      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <Button onClick={handleClose}>
          {t('common.cancel', 'Cancel')}
        </Button>
        <Space>
          {currentStep > 0 && (
            <Button onClick={handlePrevious}>
              {t('common.previous', 'Previous')}
            </Button>
          )}
          <Button
            type="primary"
            onClick={handleNext}
            loading={loading}
          >
            {currentStep === steps.length - 1
              ? t('kyb.actions.submit', 'Submit KYB Verification')
              : t('common.next', 'Next')}
          </Button>
        </Space>
      </Space>
    </Modal>
  );
};

export default KYBVerificationModal;
