import { useState } from 'react';
import {
  Card,
  Steps,
  Button,
  Form,
  Input,
  Select,
  Row,
  Col,
  Alert,
  Upload,
  Checkbox,
  Radio,
  DatePicker,
  InputNumber,
  Table,
  Tag,
  Space,
  Divider,
  message,
  Progress,
  Timeline,
  Statistic,
  Modal,
} from 'antd';
import {
  RocketOutlined,
  CheckCircleOutlined,
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  SaveOutlined,
  SendOutlined,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

interface AssetItem {
  key: string;
  assetType: string;
  description: string;
  valuation: number;
  location: string;
}

export default function TokenizationWizardPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [assetItems, setAssetItems] = useState<AssetItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedDraft, setSavedDraft] = useState(false);

  // Form data storage for all steps
  const [formData, setFormData] = useState({
    // Step 1: Asset Identification
    assetOriginCountry: '',
    assetType: '',
    assetDescription: '',
    totalValuation: 0,
    assets: [] as AssetItem[],

    // Step 2: Legal Structure
    targetJurisdictions: [] as string[],
    spvFormation: false,
    spvName: '',
    spvCountry: '',
    legalCounselEngaged: false,

    // Step 3: Regulatory Compliance
    regulatoryFramework: '',
    secRegDFiling: false,
    spkApproval: false,
    securityTokenStandard: '',
    transferRestrictions: [] as string[],

    // Step 4: Token Economics
    tokenSymbol: '',
    tokenName: '',
    totalSupply: 0,
    pricePerToken: 0,
    minimumInvestment: 0,
    lockupPeriod: 0,

    // Step 5: Smart Contract
    blockchain: '',
    contractStandard: '',
    auditFirm: '',
    complianceFeatures: [] as string[],

    // Step 6: Documentation
    ppmCompleted: false,
    subscriptionAgreement: false,
    tokenPurchaseAgreement: false,
    riskDisclosures: false,

    // Step 7: Investor Onboarding
    kycProvider: '',
    accreditationRequirement: '',
    investorCategories: [] as string[],

    // Step 8: Review & Launch
    estimatedLaunchDate: '',
    complianceChecklist: [] as string[],
  });

  const steps = [
    {
      title: 'Asset Identification',
      icon: <InfoCircleOutlined />,
      description: 'Identify and value real-world assets',
    },
    {
      title: 'Legal Structure',
      icon: <CheckCircleOutlined />,
      description: 'SPV formation and legal setup',
    },
    {
      title: 'Regulatory Compliance',
      icon: <WarningOutlined />,
      description: 'Regulatory approvals and filings',
    },
    {
      title: 'Token Economics',
      icon: <DollarCircleOutlined />,
      description: 'Define token structure and pricing',
    },
    {
      title: 'Smart Contract',
      icon: <CodeOutlined />,
      description: 'Deploy and audit smart contracts',
    },
    {
      title: 'Documentation',
      icon: <FileTextOutlined />,
      description: 'Prepare legal documents',
    },
    {
      title: 'Investor Onboarding',
      icon: <UserAddOutlined />,
      description: 'Set up KYC and accreditation',
    },
    {
      title: 'Review & Launch',
      icon: <RocketOutlined />,
      description: 'Final review and launch',
    },
  ];

  const handleNext = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();

      // Update form data with current step values
      setFormData({ ...formData, ...values });

      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        message.success('Progress saved. Moving to next step.');
      }
    } catch (error) {
      message.error('Please complete all required fields before proceeding.');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSaveDraft = () => {
    const values = form.getFieldsValue();
    setFormData({ ...formData, ...values });
    setSavedDraft(true);
    message.success('Draft saved successfully!');
    setTimeout(() => setSavedDraft(false), 3000);
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      const finalData = { ...formData, ...values };

      setLoading(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      Modal.success({
        title: 'Tokenization Process Initiated!',
        content: (
          <div>
            <p>Your tokenization request has been submitted successfully.</p>
            <p><strong>Fund:</strong> {finalData.tokenName}</p>
            <p><strong>Token Symbol:</strong> {finalData.tokenSymbol}</p>
            <p><strong>Estimated Launch:</strong> {finalData.estimatedLaunchDate}</p>
            <p>You will receive notifications as each milestone is completed.</p>
          </div>
        ),
        onOk: () => {
          form.resetFields();
          setCurrentStep(0);
          setFormData({
            assetOriginCountry: '',
            assetType: '',
            assetDescription: '',
            totalValuation: 0,
            assets: [],
            targetJurisdictions: [],
            spvFormation: false,
            spvName: '',
            spvCountry: '',
            legalCounselEngaged: false,
            regulatoryFramework: '',
            secRegDFiling: false,
            spkApproval: false,
            securityTokenStandard: '',
            transferRestrictions: [],
            tokenSymbol: '',
            tokenName: '',
            totalSupply: 0,
            pricePerToken: 0,
            minimumInvestment: 0,
            lockupPeriod: 0,
            blockchain: '',
            contractStandard: '',
            auditFirm: '',
            complianceFeatures: [],
            ppmCompleted: false,
            subscriptionAgreement: false,
            tokenPurchaseAgreement: false,
            riskDisclosures: false,
            kycProvider: '',
            accreditationRequirement: '',
            investorCategories: [],
            estimatedLaunchDate: '',
            complianceChecklist: [],
          });
        },
      });

      setLoading(false);
    } catch (error) {
      message.error('Please complete all required fields.');
      setLoading(false);
    }
  };

  // Add asset to table
  const handleAddAsset = () => {
    form.validateFields(['assetType', 'description', 'valuation', 'location']).then(values => {
      const newAsset: AssetItem = {
        key: `asset-${Date.now()}`,
        assetType: values.assetType,
        description: values.description,
        valuation: values.valuation,
        location: values.location,
      };
      setAssetItems([...assetItems, newAsset]);
      form.setFieldsValue({
        assetType: '',
        description: '',
        valuation: 0,
        location: '',
      });
      message.success('Asset added to portfolio');
    });
  };

  const handleDeleteAsset = (key: string) => {
    setAssetItems(assetItems.filter(item => item.key !== key));
  };

  const assetColumns = [
    {
      title: 'Asset Type',
      dataIndex: 'assetType',
      key: 'assetType',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Valuation',
      dataIndex: 'valuation',
      key: 'valuation',
      render: (val: number) => `$${val.toLocaleString()}`,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: AssetItem) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteAsset(record.key)}
        >
          Remove
        </Button>
      ),
    },
  ];

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      const isPDF = file.type === 'application/pdf';
      if (!isPDF) {
        message.error('You can only upload PDF files!');
      }
      return isPDF || Upload.LIST_IGNORE;
    },
    onChange: (info) => {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        // Step 1: Asset Identification
        return (
          <div>
            <Alert
              message="Asset Identification"
              description="Identify and document all real-world assets that will be tokenized. Ensure accurate valuation and proper documentation."
              type="info"
              icon={<InfoCircleOutlined />}
              showIcon
              style={{ marginBottom: 24 }}
            />
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Origin Country"
                    name="assetOriginCountry"
                    rules={[{ required: true, message: 'Please select origin country' }]}
                  >
                    <Select placeholder="Select country">
                      <Option value="Turkey">Turkey</Option>
                      <Option value="UAE">United Arab Emirates</Option>
                      <Option value="Singapore">Singapore</Option>
                      <Option value="Switzerland">Switzerland</Option>
                      <Option value="USA">United States</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Primary Asset Class"
                    name="primaryAssetClass"
                    rules={[{ required: true, message: 'Please select asset class' }]}
                  >
                    <Select placeholder="Select asset class">
                      <Option value="real-estate">Real Estate</Option>
                      <Option value="private-equity">Private Equity</Option>
                      <Option value="commodities">Commodities</Option>
                      <Option value="art">Art & Collectibles</Option>
                      <Option value="infrastructure">Infrastructure</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Asset Portfolio Description"
                name="assetDescription"
                rules={[{ required: true, message: 'Please describe the asset portfolio' }]}
              >
                <TextArea rows={4} placeholder="Provide detailed description of assets to be tokenized..." />
              </Form.Item>

              <Divider>Add Individual Assets</Divider>

              <Row gutter={16}>
                <Col xs={24} md={6}>
                  <Form.Item label="Asset Type" name="assetType">
                    <Input placeholder="e.g., Commercial Property" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Description" name="description">
                    <Input placeholder="Brief description" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item label="Valuation ($)" name="valuation">
                    <InputNumber
                      style={{ width: '100%' }}
                      formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as any}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={4}>
                  <Form.Item label=" ">
                    <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddAsset} block>
                      Add
                    </Button>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Location" name="location">
                <Input placeholder="City, Country" />
              </Form.Item>

              {assetItems.length > 0 && (
                <>
                  <Table
                    columns={assetColumns}
                    dataSource={assetItems}
                    pagination={false}
                    size="small"
                    style={{ marginTop: 16 }}
                  />
                  <Card size="small" style={{ marginTop: 16 }}>
                    <Statistic
                      title="Total Portfolio Valuation"
                      value={assetItems.reduce((sum, item) => sum + item.valuation, 0)}
                      prefix="$"
                      precision={2}
                    />
                  </Card>
                </>
              )}

              <Divider />

              <Form.Item label="Valuation Report" name="valuationReport">
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>Upload Valuation Report (PDF)</Button>
                </Upload>
              </Form.Item>
            </Form>
          </div>
        );

      case 1:
        // Step 2: Legal Structure
        return (
          <div>
            <Alert
              message="Legal Structure Setup"
              description="Establish the legal framework for tokenization including SPV formation and cross-border structuring."
              type="info"
              icon={<InfoCircleOutlined />}
              showIcon
              style={{ marginBottom: 24 }}
            />
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Target Investor Jurisdictions"
                    name="targetJurisdictions"
                    rules={[{ required: true, message: 'Please select at least one jurisdiction' }]}
                  >
                    <Select mode="multiple" placeholder="Select jurisdictions">
                      <Option value="USA">United States</Option>
                      <Option value="EU">European Union</Option>
                      <Option value="UK">United Kingdom</Option>
                      <Option value="UAE">United Arab Emirates</Option>
                      <Option value="Singapore">Singapore</Option>
                      <Option value="Hong Kong">Hong Kong</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="SPV Formation Country"
                    name="spvCountry"
                    rules={[{ required: true, message: 'Please select SPV country' }]}
                  >
                    <Select placeholder="Select SPV jurisdiction">
                      <Option value="Cayman Islands">Cayman Islands</Option>
                      <Option value="Delaware">Delaware, USA</Option>
                      <Option value="BVI">British Virgin Islands</Option>
                      <Option value="Luxembourg">Luxembourg</Option>
                      <Option value="Turkey">Turkey</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="SPV Name"
                name="spvName"
                rules={[{ required: true, message: 'Please enter SPV name' }]}
              >
                <Input placeholder="e.g., Turkish Real Estate Fund SPV I" />
              </Form.Item>

              <Form.Item label="SPV Formation">
                <Checkbox.Group>
                  <Row>
                    <Col span={24}><Checkbox value="formation">SPV Formation Completed</Checkbox></Col>
                    <Col span={24}><Checkbox value="registration">Company Registration Filed</Checkbox></Col>
                    <Col span={24}><Checkbox value="bylaws">Articles of Association Drafted</Checkbox></Col>
                    <Col span={24}><Checkbox value="directors">Directors Appointed</Checkbox></Col>
                  </Row>
                </Checkbox.Group>
              </Form.Item>

              <Divider>Legal Counsel</Divider>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Legal Counsel (Origin Country)"
                    name="legalCounselOrigin"
                    rules={[{ required: true, message: 'Please enter legal counsel' }]}
                  >
                    <Input placeholder="Law firm name" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Legal Counsel (Target Jurisdiction)"
                    name="legalCounselTarget"
                  >
                    <Input placeholder="Law firm name (if different)" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Legal Opinion Letter" name="legalOpinion">
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>Upload Legal Opinion (PDF)</Button>
                </Upload>
              </Form.Item>
            </Form>
          </div>
        );

      case 2:
        // Step 3: Regulatory Compliance
        return (
          <div>
            <Alert
              message="Regulatory Compliance"
              description="Ensure compliance with all applicable securities regulations in origin and target jurisdictions."
              type="warning"
              icon={<WarningOutlined />}
              showIcon
              style={{ marginBottom: 24 }}
            />
            <Form form={form} layout="vertical">
              <Form.Item
                label="Primary Regulatory Framework"
                name="regulatoryFramework"
                rules={[{ required: true, message: 'Please select regulatory framework' }]}
              >
                <Radio.Group>
                  <Space direction="vertical">
                    <Radio value="sec-reg-d">SEC Regulation D (506(b) or 506(c)) - USA</Radio>
                    <Radio value="mifid-ii">MiFID II - EU</Radio>
                    <Radio value="fca">FCA Regulation - UK</Radio>
                    <Radio value="mas">MAS Framework - Singapore</Radio>
                    <Radio value="spk">Turkish SPK Approval</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>

              <Divider>Regulatory Filings</Divider>

              <Form.Item label="Required Filings">
                <Checkbox.Group>
                  <Row>
                    <Col span={24}>
                      <Checkbox value="sec-form-d">SEC Form D Filed</Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox value="blue-sky">Blue Sky Laws Compliance (State-by-State)</Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox value="spk-approval">Turkish SPK Approval Obtained</Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox value="fincen">FinCEN BSA/AML Registration</Checkbox>
                    </Col>
                  </Row>
                </Checkbox.Group>
              </Form.Item>

              <Form.Item
                label="Security Token Standard"
                name="securityTokenStandard"
                rules={[{ required: true, message: 'Please select token standard' }]}
              >
                <Select placeholder="Select standard">
                  <Option value="ERC-3643">ERC-3643 (T-REX Protocol)</Option>
                  <Option value="ERC-1400">ERC-1400 (Security Token Standard)</Option>
                  <Option value="DS Protocol">DS Protocol (Polymath)</Option>
                  <Option value="R-Token">R-Token (Harbor)</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Transfer Restrictions"
                name="transferRestrictions"
                rules={[{ required: true, message: 'Please select applicable restrictions' }]}
              >
                <Select mode="multiple" placeholder="Select applicable restrictions">
                  <Option value="accredited-only">Accredited Investors Only</Option>
                  <Option value="qualified-purchaser">Qualified Purchasers Only</Option>
                  <Option value="lockup">Lock-up Period (Rule 144)</Option>
                  <Option value="whitelist">Whitelist Required</Option>
                  <Option value="jurisdictional">Jurisdictional Restrictions</Option>
                  <Option value="sanctions">OFAC Sanctions Screening</Option>
                </Select>
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="SEC Form D" name="secFormD">
                    <Upload {...uploadProps}>
                      <Button icon={<UploadOutlined />}>Upload SEC Form D (PDF)</Button>
                    </Upload>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="SPK Approval Letter" name="spkApproval">
                    <Upload {...uploadProps}>
                      <Button icon={<UploadOutlined />}>Upload SPK Approval (PDF)</Button>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        );

      case 3:
        // Step 4: Token Economics
        return (
          <div>
            <Alert
              message="Token Economics"
              description="Define the economic structure of your security token including pricing, supply, and investor terms."
              type="info"
              icon={<InfoCircleOutlined />}
              showIcon
              style={{ marginBottom: 24 }}
            />
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Token Name"
                    name="tokenName"
                    rules={[{ required: true, message: 'Please enter token name' }]}
                  >
                    <Input placeholder="e.g., Turkish Real Estate Fund I" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Token Symbol"
                    name="tokenSymbol"
                    rules={[
                      { required: true, message: 'Please enter token symbol' },
                      { max: 6, message: 'Symbol must be 6 characters or less' },
                    ]}
                  >
                    <Input placeholder="e.g., TREFI" maxLength={6} style={{ textTransform: 'uppercase' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Total Token Supply"
                    name="totalSupply"
                    rules={[{ required: true, message: 'Please enter total supply' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as any}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Price Per Token ($)"
                    name="pricePerToken"
                    rules={[{ required: true, message: 'Please enter price' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      prefix="$"
                      precision={2}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as any}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Total Offering Size">
                    <Statistic
                      value={
                        (form.getFieldValue('totalSupply') || 0) *
                        (form.getFieldValue('pricePerToken') || 0)
                      }
                      prefix="$"
                      precision={2}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Divider>Investor Terms</Divider>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Minimum Investment ($)"
                    name="minimumInvestment"
                    rules={[{ required: true, message: 'Please enter minimum investment' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      prefix="$"
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as any}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Lock-up Period (Months)"
                    name="lockupPeriod"
                    rules={[{ required: true, message: 'Please enter lock-up period' }]}
                  >
                    <InputNumber style={{ width: '100%' }} min={0} max={60} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Expected Dividend Yield (%)"
                    name="dividendYield"
                  >
                    <InputNumber style={{ width: '100%' }} min={0} max={100} precision={2} suffix="%" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Distribution Frequency"
                    name="distributionFrequency"
                  >
                    <Select placeholder="Select frequency">
                      <Option value="monthly">Monthly</Option>
                      <Option value="quarterly">Quarterly</Option>
                      <Option value="semi-annual">Semi-Annual</Option>
                      <Option value="annual">Annual</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Token Rights & Features" name="tokenRights">
                <Checkbox.Group>
                  <Row>
                    <Col span={24}><Checkbox value="dividend">Dividend Rights</Checkbox></Col>
                    <Col span={24}><Checkbox value="voting">Voting Rights</Checkbox></Col>
                    <Col span={24}><Checkbox value="liquidation">Liquidation Preference</Checkbox></Col>
                    <Col span={24}><Checkbox value="redemption">Redemption Rights</Checkbox></Col>
                  </Row>
                </Checkbox.Group>
              </Form.Item>
            </Form>
          </div>
        );

      case 4:
        // Step 5: Smart Contract
        return (
          <div>
            <Alert
              message="Smart Contract Deployment"
              description="Deploy and audit your security token smart contract with compliance features built-in."
              type="info"
              icon={<InfoCircleOutlined />}
              showIcon
              style={{ marginBottom: 24 }}
            />
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Blockchain Network"
                    name="blockchain"
                    rules={[{ required: true, message: 'Please select blockchain' }]}
                  >
                    <Select placeholder="Select blockchain">
                      <Option value="Ethereum">Ethereum Mainnet</Option>
                      <Option value="Polygon">Polygon</Option>
                      <Option value="Arbitrum">Arbitrum</Option>
                      <Option value="Optimism">Optimism</Option>
                      <Option value="Base">Base</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Contract Standard"
                    name="contractStandard"
                    rules={[{ required: true, message: 'Please select standard' }]}
                  >
                    <Select placeholder="Select standard">
                      <Option value="ERC-3643">ERC-3643 (T-REX)</Option>
                      <Option value="ERC-1400">ERC-1400</Option>
                      <Option value="ERC-1404">ERC-1404</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Compliance Features"
                name="complianceFeatures"
                rules={[{ required: true, message: 'Please select compliance features' }]}
              >
                <Checkbox.Group>
                  <Row>
                    <Col span={24}><Checkbox value="kyc">On-chain KYC Verification</Checkbox></Col>
                    <Col span={24}><Checkbox value="whitelist">Investor Whitelist</Checkbox></Col>
                    <Col span={24}><Checkbox value="transfer-rules">Automated Transfer Rules</Checkbox></Col>
                    <Col span={24}><Checkbox value="jurisdictional">Jurisdictional Restrictions</Checkbox></Col>
                    <Col span={24}><Checkbox value="lockup">Lock-up Period Enforcement</Checkbox></Col>
                    <Col span={24}><Checkbox value="pausable">Emergency Pause Function</Checkbox></Col>
                    <Col span={24}><Checkbox value="role-based">Role-Based Access Control</Checkbox></Col>
                  </Row>
                </Checkbox.Group>
              </Form.Item>

              <Divider>Security Audit</Divider>

              <Form.Item
                label="Audit Firm"
                name="auditFirm"
                rules={[{ required: true, message: 'Please select or enter audit firm' }]}
              >
                <Select placeholder="Select audit firm">
                  <Option value="CertiK">CertiK</Option>
                  <Option value="OpenZeppelin">OpenZeppelin</Option>
                  <Option value="Trail of Bits">Trail of Bits</Option>
                  <Option value="Quantstamp">Quantstamp</Option>
                  <Option value="ConsenSys Diligence">ConsenSys Diligence</Option>
                </Select>
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="Audit Report" name="auditReport">
                    <Upload {...uploadProps}>
                      <Button icon={<UploadOutlined />}>Upload Audit Report (PDF)</Button>
                    </Upload>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Contract Source Code" name="sourceCode">
                    <Upload>
                      <Button icon={<UploadOutlined />}>Upload Source Code (.sol)</Button>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Contract Address (After Deployment)" name="contractAddress">
                <Input placeholder="0x..." disabled style={{ fontFamily: 'monospace' }} />
              </Form.Item>

              <Alert
                message="Note"
                description="Smart contract deployment will be executed after final review. Ensure all parameters are correct before proceeding."
                type="info"
                showIcon
                style={{ marginTop: 16 }}
              />
            </Form>
          </div>
        );

      case 5:
        // Step 6: Documentation
        return (
          <div>
            <Alert
              message="Legal Documentation"
              description="Prepare all required legal documents for offering to investors."
              type="info"
              icon={<InfoCircleOutlined />}
              showIcon
              style={{ marginBottom: 24 }}
            />
            <Form form={form} layout="vertical">
              <h3>Private Placement Memorandum (PPM)</h3>
              <Form.Item label="PPM Status">
                <Checkbox.Group>
                  <Row>
                    <Col span={24}><Checkbox value="executive-summary">Executive Summary Completed</Checkbox></Col>
                    <Col span={24}><Checkbox value="investment-overview">Investment Overview Completed</Checkbox></Col>
                    <Col span={24}><Checkbox value="risk-factors">Risk Factors Disclosed</Checkbox></Col>
                    <Col span={24}><Checkbox value="token-structure">Token Structure Documented</Checkbox></Col>
                    <Col span={24}><Checkbox value="use-of-proceeds">Use of Proceeds Outlined</Checkbox></Col>
                    <Col span={24}><Checkbox value="legal-compliance">Legal & Compliance Sections Completed</Checkbox></Col>
                    <Col span={24}><Checkbox value="tax-considerations">Tax Considerations Included</Checkbox></Col>
                  </Row>
                </Checkbox.Group>
              </Form.Item>

              <Form.Item label="PPM Document" name="ppmDocument">
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>Upload PPM (PDF)</Button>
                </Upload>
              </Form.Item>

              <Divider />

              <h3>Subscription & Purchase Agreements</h3>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="Subscription Agreement" name="subscriptionAgreement">
                    <Upload {...uploadProps}>
                      <Button icon={<UploadOutlined />}>Upload Subscription Agreement</Button>
                    </Upload>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Token Purchase Agreement" name="tokenPurchaseAgreement">
                    <Upload {...uploadProps}>
                      <Button icon={<UploadOutlined />}>Upload Token Purchase Agreement</Button>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              <h3>Additional Documents</h3>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="Risk Disclosure Statement" name="riskDisclosure">
                    <Upload {...uploadProps}>
                      <Button icon={<UploadOutlined />}>Upload Risk Disclosure</Button>
                    </Upload>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Operating Agreement" name="operatingAgreement">
                    <Upload {...uploadProps}>
                      <Button icon={<UploadOutlined />}>Upload Operating Agreement</Button>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="Investor Questionnaire" name="investorQuestionnaire">
                    <Upload {...uploadProps}>
                      <Button icon={<UploadOutlined />}>Upload Investor Questionnaire</Button>
                    </Upload>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="W-8/W-9 Forms" name="taxForms">
                    <Upload {...uploadProps}>
                      <Button icon={<UploadOutlined />}>Upload Tax Forms</Button>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>

              <Alert
                message="Document Review"
                description="All documents will be reviewed by legal counsel before being made available to investors. Ensure accuracy and completeness."
                type="warning"
                showIcon
                style={{ marginTop: 16 }}
              />
            </Form>
          </div>
        );

      case 6:
        // Step 7: Investor Onboarding
        return (
          <div>
            <Alert
              message="Investor Onboarding Setup"
              description="Configure KYC/AML processes and investor accreditation requirements."
              type="info"
              icon={<InfoCircleOutlined />}
              showIcon
              style={{ marginBottom: 24 }}
            />
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="KYC/AML Provider"
                    name="kycProvider"
                    rules={[{ required: true, message: 'Please select KYC provider' }]}
                  >
                    <Select placeholder="Select KYC provider">
                      <Option value="Persona">Persona</Option>
                      <Option value="Onfido">Onfido</Option>
                      <Option value="Sumsub">Sumsub</Option>
                      <Option value="Jumio">Jumio</Option>
                      <Option value="Shufti Pro">Shufti Pro</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Accreditation Verification Provider"
                    name="accreditationProvider"
                  >
                    <Select placeholder="Select accreditation provider">
                      <Option value="VerifyInvestor">VerifyInvestor</Option>
                      <Option value="North Capital">North Capital</Option>
                      <Option value="Parallel Markets">Parallel Markets</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Accreditation Requirement"
                name="accreditationRequirement"
                rules={[{ required: true, message: 'Please select requirement' }]}
              >
                <Radio.Group>
                  <Space direction="vertical">
                    <Radio value="506b">Reg D 506(b) - Accredited + Up to 35 Non-Accredited</Radio>
                    <Radio value="506c">Reg D 506(c) - Accredited Investors Only (Verified)</Radio>
                    <Radio value="reg-a">Regulation A+ - Non-Accredited Allowed</Radio>
                    <Radio value="reg-s">Regulation S - Non-US Investors</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label="Eligible Investor Categories"
                name="investorCategories"
                rules={[{ required: true, message: 'Please select at least one category' }]}
              >
                <Checkbox.Group>
                  <Row>
                    <Col span={24}><Checkbox value="individual-accredited">Individual Accredited Investors</Checkbox></Col>
                    <Col span={24}><Checkbox value="institutional">Institutional Investors</Checkbox></Col>
                    <Col span={24}><Checkbox value="qualified-purchaser">Qualified Purchasers</Checkbox></Col>
                    <Col span={24}><Checkbox value="family-office">Family Offices</Checkbox></Col>
                    <Col span={24}><Checkbox value="non-us">Non-US Investors (Reg S)</Checkbox></Col>
                  </Row>
                </Checkbox.Group>
              </Form.Item>

              <Divider>KYC Requirements</Divider>

              <Form.Item label="Required Documents for KYC">
                <Checkbox.Group>
                  <Row>
                    <Col span={24}><Checkbox value="government-id">Government-Issued ID</Checkbox></Col>
                    <Col span={24}><Checkbox value="proof-address">Proof of Address</Checkbox></Col>
                    <Col span={24}><Checkbox value="selfie">Selfie Verification</Checkbox></Col>
                    <Col span={24}><Checkbox value="tax-id">Tax ID Number</Checkbox></Col>
                    <Col span={24}><Checkbox value="income-proof">Proof of Income (Accreditation)</Checkbox></Col>
                    <Col span={24}><Checkbox value="net-worth">Net Worth Documentation</Checkbox></Col>
                  </Row>
                </Checkbox.Group>
              </Form.Item>

              <Form.Item label="Additional Compliance Checks">
                <Checkbox.Group>
                  <Row>
                    <Col span={24}><Checkbox value="sanctions">OFAC Sanctions Screening</Checkbox></Col>
                    <Col span={24}><Checkbox value="pep">PEP (Politically Exposed Persons) Check</Checkbox></Col>
                    <Col span={24}><Checkbox value="adverse-media">Adverse Media Screening</Checkbox></Col>
                    <Col span={24}><Checkbox value="source-of-funds">Source of Funds Verification</Checkbox></Col>
                  </Row>
                </Checkbox.Group>
              </Form.Item>

              <Form.Item
                label="Suitability Assessment"
                name="suitabilityAssessment"
              >
                <Select placeholder="Select assessment type">
                  <Option value="standard">Standard Investment Questionnaire</Option>
                  <Option value="enhanced">Enhanced Due Diligence</Option>
                  <Option value="fiduciary">Fiduciary Standard</Option>
                </Select>
              </Form.Item>
            </Form>
          </div>
        );

      case 7:
        // Step 8: Review & Launch
        return (
          <div>
            <Alert
              message="Final Review & Launch"
              description="Review all information and launch your tokenization offering."
              type="success"
              icon={<RocketOutlined />}
              showIcon
              style={{ marginBottom: 24 }}
            />

            <h3 style={{ marginBottom: 16 }}>Tokenization Summary</h3>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Card size="small">
                  <Statistic
                    title="Token Name"
                    value={formData.tokenName || 'Not Set'}
                    valueStyle={{ fontSize: '18px' }}
                  />
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card size="small">
                  <Statistic
                    title="Token Symbol"
                    value={formData.tokenSymbol || 'N/A'}
                    valueStyle={{ fontSize: '18px', color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card size="small">
                  <Statistic
                    title="Total Offering"
                    value={(formData.totalSupply || 0) * (formData.pricePerToken || 0)}
                    prefix="$"
                    precision={2}
                    valueStyle={{ fontSize: '18px', color: '#52c41a' }}
                  />
                </Card>
              </Col>
            </Row>

            <Divider />

            <Timeline
              items={[
                {
                  color: 'green',
                  dot: <CheckCircleOutlined />,
                  children: (
                    <div>
                      <strong>Asset Identification</strong>
                      <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                        {formData.assetOriginCountry} • {assetItems.length} assets
                      </div>
                    </div>
                  ),
                },
                {
                  color: 'green',
                  dot: <CheckCircleOutlined />,
                  children: (
                    <div>
                      <strong>Legal Structure</strong>
                      <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                        SPV: {formData.spvName || 'Not configured'}
                      </div>
                    </div>
                  ),
                },
                {
                  color: 'green',
                  dot: <CheckCircleOutlined />,
                  children: (
                    <div>
                      <strong>Regulatory Compliance</strong>
                      <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                        Framework: {formData.regulatoryFramework || 'Not selected'}
                      </div>
                    </div>
                  ),
                },
                {
                  color: 'green',
                  dot: <CheckCircleOutlined />,
                  children: (
                    <div>
                      <strong>Token Economics</strong>
                      <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                        {formData.totalSupply?.toLocaleString()} tokens @ ${formData.pricePerToken}
                      </div>
                    </div>
                  ),
                },
                {
                  color: 'green',
                  dot: <CheckCircleOutlined />,
                  children: (
                    <div>
                      <strong>Smart Contract</strong>
                      <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                        {formData.blockchain} • {formData.contractStandard}
                      </div>
                    </div>
                  ),
                },
                {
                  color: 'green',
                  dot: <CheckCircleOutlined />,
                  children: (
                    <div>
                      <strong>Documentation</strong>
                      <div style={{ fontSize: 12, color: '#8c8c8c' }}>PPM and legal agreements prepared</div>
                    </div>
                  ),
                },
                {
                  color: 'green',
                  dot: <CheckCircleOutlined />,
                  children: (
                    <div>
                      <strong>Investor Onboarding</strong>
                      <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                        KYC: {formData.kycProvider || 'Not configured'}
                      </div>
                    </div>
                  ),
                },
              ]}
            />

            <Divider />

            <Form form={form} layout="vertical">
              <Form.Item
                label="Estimated Launch Date"
                name="estimatedLaunchDate"
                rules={[{ required: true, message: 'Please select launch date' }]}
              >
                <DatePicker style={{ width: '100%' }} disabledDate={(current) => current && current < dayjs()} />
              </Form.Item>

              <Form.Item label="Pre-Launch Checklist">
                <Checkbox.Group>
                  <Row>
                    <Col span={24}><Checkbox value="legal-review">Final legal review completed</Checkbox></Col>
                    <Col span={24}><Checkbox value="smart-contract-audit">Smart contract audit passed</Checkbox></Col>
                    <Col span={24}><Checkbox value="kyc-setup">KYC system configured and tested</Checkbox></Col>
                    <Col span={24}><Checkbox value="payment-rails">Payment rails established</Checkbox></Col>
                    <Col span={24}><Checkbox value="investor-portal">Investor portal ready</Checkbox></Col>
                    <Col span={24}><Checkbox value="compliance-sign-off">Compliance officer sign-off received</Checkbox></Col>
                    <Col span={24}><Checkbox value="marketing-materials">Marketing materials approved</Checkbox></Col>
                  </Row>
                </Checkbox.Group>
              </Form.Item>

              <Alert
                message="Ready to Launch"
                description="By submitting this form, you confirm that all information is accurate and you are ready to initiate the tokenization process. Our team will review your submission and contact you within 2 business days."
                type="success"
                showIcon
                style={{ marginTop: 24 }}
              />
            </Form>
          </div>
        );

      default:
        return null;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 8, fontFamily: 'var(--font-heading)' }}>
          <RocketOutlined style={{ marginRight: 12 }} />
          Cross-Border Tokenization Wizard
        </h1>
        <p style={{ color: '#8c8c8c', fontSize: '14px' }}>
          Step-by-step guide to tokenize your real-world assets for cross-border offerings
        </p>
      </div>

      {savedDraft && (
        <Alert
          message="Draft Saved"
          description="Your progress has been saved. You can return to this wizard anytime."
          type="success"
          showIcon
          closable
          style={{ marginBottom: 24 }}
        />
      )}

      <Card>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: '#8c8c8c' }}>Overall Progress</span>
            <span style={{ fontSize: 12, fontWeight: 500 }}>{progress.toFixed(0)}%</span>
          </div>
          <Progress percent={progress} strokeColor="#52c41a" showInfo={false} />
        </div>

        <Steps current={currentStep} items={steps} style={{ marginBottom: 32 }} />

        <div style={{ minHeight: 400 }}>{renderStepContent()}</div>

        <Divider />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            {currentStep > 0 && (
              <Button onClick={handlePrevious}>Previous</Button>
            )}
            <Button icon={<SaveOutlined />} onClick={handleSaveDraft}>
              Save Draft
            </Button>
          </Space>

          <Space>
            {currentStep < steps.length - 1 && (
              <Button type="primary" onClick={handleNext}>
                Next Step
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSubmit}
                loading={loading}
              >
                Submit for Review
              </Button>
            )}
          </Space>
        </div>
      </Card>
    </div>
  );
}

// Missing icon imports - add these to the imports at the top
import { DollarCircleOutlined, CodeOutlined, FileTextOutlined, UserAddOutlined } from '@ant-design/icons';
