import { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Progress,
  Radio,
  Row,
  Select,
  Slider,
  Space,
  Statistic,
  Steps,
  Tag,
  Typography,
  message,
} from 'antd';
import type { RadioChangeEvent } from 'antd';
import dayjs from 'dayjs';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  SafetyOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { StatCard } from '../../../components/common';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

type RedemptionType = 'full' | 'partial';
type PaymentMethod = 'wire' | 'crypto';
type EligibilityStatus = 'eligible' | 'warning' | 'ineligible';

interface FundHolding {
  fundId: string;
  fundName: string;
  shares: number;
  currentNAV: number;
  totalValue: number;
  purchaseDate: string;
  lockupEndDate: string;
  isEligible: boolean;
}

interface EligibilityCheck {
  name: string;
  status: EligibilityStatus;
  message: string;
  passed: boolean;
}

interface RedemptionFees {
  redemptionFee: number;
  redemptionFeePercent: number;
  earlyRedemptionPenalty: number;
  earlyRedemptionPenaltyPercent: number;
  taxWithholding: number;
  taxWithholdingPercent: number;
  grossProceeds: number;
  netProceeds: number;
}

interface GateInfo {
  isActive: boolean;
  monthlyLimit: number;
  currentMonthRedemptions: number;
  remainingCapacity: number;
  queuePosition: number | null;
}

interface RedemptionSchedule {
  redemptionDate: string;
  navStrikeDate: string;
  paymentDate: string;
  noticePeriodDays: number;
}

const mockFundHoldings: FundHolding[] = [
  {
    fundId: 'fund-001',
    fundName: 'RWA Growth Fund',
    shares: 500,
    currentNAV: 105.5,
    totalValue: 52750,
    purchaseDate: '2025-06-15',
    lockupEndDate: '2025-09-15',
    isEligible: true,
  },
  {
    fundId: 'fund-002',
    fundName: 'DeFi Yield Fund',
    shares: 300,
    currentNAV: 98.2,
    totalValue: 29460,
    purchaseDate: '2025-10-01',
    lockupEndDate: '2026-01-01',
    isEligible: false,
  },
];

const mockGateInfo: GateInfo = {
  isActive: true,
  monthlyLimit: 1000000,
  currentMonthRedemptions: 750000,
  remainingCapacity: 250000,
  queuePosition: null,
};

const RedemptionPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedFund, setSelectedFund] = useState<FundHolding | null>(null);
  const [redemptionType, setRedemptionType] = useState<RedemptionType>('partial');
  const [sharesToRedeem, setSharesToRedeem] = useState<number>(0);
  const [percentToRedeem, setPercentToRedeem] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wire');
  const [eligibilityChecks, setEligibilityChecks] = useState<EligibilityCheck[]>([]);
  const [fees, setFees] = useState<RedemptionFees | null>(null);
  const [schedule, setSchedule] = useState<RedemptionSchedule | null>(null);
  const [confirmationNumber, setConfirmationNumber] = useState<string>('');
  const [form] = Form.useForm();

  const eligibilityStatusConfig: Record<EligibilityStatus, { color: string; icon: React.ReactNode }> = {
    eligible: { color: 'success', icon: <CheckCircleOutlined /> },
    warning: { color: 'warning', icon: <WarningOutlined /> },
    ineligible: { color: 'error', icon: <ExclamationCircleOutlined /> },
  };

  const handleFundSelect = (fundId: string) => {
    const fund = mockFundHoldings.find((f) => f.fundId === fundId);
    if (fund) {
      setSelectedFund(fund);
      runEligibilityChecks(fund);
      calculateSchedule(fund);
    }
  };

  const runEligibilityChecks = (fund: FundHolding): void => {
    const checks: EligibilityCheck[] = [];

    // Lock-up check
    const lockupEndDate = dayjs(fund.lockupEndDate);
    const today = dayjs();
    const lockupPassed = today.isAfter(lockupEndDate);

    checks.push({
      name: 'Lock-up Period',
      status: lockupPassed ? 'eligible' : 'ineligible',
      message: lockupPassed
        ? `Lock-up period ended on ${lockupEndDate.format('MMM DD, YYYY')}`
        : `Lock-up period ends on ${lockupEndDate.format('MMM DD, YYYY')} (${lockupEndDate.diff(today, 'day')} days remaining)`,
      passed: lockupPassed,
    });

    // Notice period check
    const noticePeriodDays = 30;
    const earliestRedemptionDate = today.add(noticePeriodDays, 'day');
    checks.push({
      name: 'Notice Period',
      status: 'eligible',
      message: `Earliest redemption date: ${earliestRedemptionDate.format('MMM DD, YYYY')} (${noticePeriodDays} days notice required)`,
      passed: true,
    });

    // Minimum holding period
    const purchaseDate = dayjs(fund.purchaseDate);
    const holdingPeriodDays = today.diff(purchaseDate, 'day');
    const minHoldingPeriod = 90;
    const holdingPeriodMet = holdingPeriodDays >= minHoldingPeriod;

    checks.push({
      name: 'Minimum Holding Period',
      status: holdingPeriodMet ? 'eligible' : 'ineligible',
      message: holdingPeriodMet
        ? `Holding period requirement met (${holdingPeriodDays} days)`
        : `Minimum holding period: 90 days (${minHoldingPeriod - holdingPeriodDays} days remaining)`,
      passed: holdingPeriodMet,
    });

    // Gate check
    if (mockGateInfo.isActive) {
      const hasCapacity = mockGateInfo.remainingCapacity > 0;
      checks.push({
        name: 'Gate Status',
        status: hasCapacity ? 'warning' : 'ineligible',
        message: hasCapacity
          ? `Gate is active. Remaining capacity: $${mockGateInfo.remainingCapacity.toLocaleString()}`
          : 'Gate is active with no remaining capacity. Your request will be queued.',
        passed: hasCapacity,
      });
    }

    setEligibilityChecks(checks);
  };

  const calculateFees = (shares: number): void => {
    if (!selectedFund) return;

    const grossProceeds = shares * selectedFund.currentNAV;

    // Redemption fee (standard)
    const redemptionFeePercent = 0.5; // 0.5%
    const redemptionFee = grossProceeds * (redemptionFeePercent / 100);

    // Early redemption penalty (if within 12 months)
    const purchaseDate = dayjs(selectedFund.purchaseDate);
    const today = dayjs();
    const monthsHeld = today.diff(purchaseDate, 'month');
    const earlyRedemptionPenaltyPercent = monthsHeld < 12 ? 2 : 0;
    const earlyRedemptionPenalty = grossProceeds * (earlyRedemptionPenaltyPercent / 100);

    // Tax withholding estimate
    const taxWithholdingPercent = 15; // 15% estimate
    const taxWithholding = grossProceeds * (taxWithholdingPercent / 100);

    const netProceeds = grossProceeds - redemptionFee - earlyRedemptionPenalty - taxWithholding;

    setFees({
      redemptionFee,
      redemptionFeePercent,
      earlyRedemptionPenalty,
      earlyRedemptionPenaltyPercent,
      taxWithholding,
      taxWithholdingPercent,
      grossProceeds,
      netProceeds,
    });
  };

  const calculateSchedule = (fund: FundHolding): void => {
    const noticePeriodDays = 30;
    const today = dayjs();
    const redemptionDate = today.add(noticePeriodDays, 'day');
    const navStrikeDate = redemptionDate.add(1, 'day');
    const paymentDate = navStrikeDate.add(5, 'day');

    setSchedule({
      redemptionDate: redemptionDate.format('YYYY-MM-DD'),
      navStrikeDate: navStrikeDate.format('YYYY-MM-DD'),
      paymentDate: paymentDate.format('YYYY-MM-DD'),
      noticePeriodDays,
    });
  };

  const handleRedemptionTypeChange = (e: RadioChangeEvent) => {
    const type = e.target.value as RedemptionType;
    setRedemptionType(type);
    if (type === 'full' && selectedFund) {
      setSharesToRedeem(selectedFund.shares);
      setPercentToRedeem(100);
      calculateFees(selectedFund.shares);
    }
  };

  const handleSharesChange = (value: number | null) => {
    if (value && selectedFund) {
      setSharesToRedeem(value);
      const percent = (value / selectedFund.shares) * 100;
      setPercentToRedeem(Math.round(percent));
      calculateFees(value);
    }
  };

  const handlePercentChange = (value: number) => {
    if (selectedFund) {
      setPercentToRedeem(value);
      const shares = Math.round((selectedFund.shares * value) / 100);
      setSharesToRedeem(shares);
      calculateFees(shares);
    }
  };

  const handleNext = () => {
    if (currentStep === 0 && !selectedFund) {
      message.error('Please select a fund');
      return;
    }
    if (currentStep === 1 && sharesToRedeem === 0) {
      message.error('Please specify shares to redeem');
      return;
    }
    const allEligible = eligibilityChecks.every((check) => check.passed);
    if (!allEligible && currentStep === 2) {
      message.warning('You have eligibility issues. Please review before proceeding.');
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    const confirmNum = `RED-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setConfirmationNumber(confirmNum);
    setCurrentStep(currentStep + 1);
    message.success('Redemption request submitted successfully!');
  };

  const isEligible = eligibilityChecks.every((check) => check.passed);

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3}>Redemption Management</Title>
          <Paragraph type="secondary">
            Request redemption of your fund shares
          </Paragraph>
        </Col>
      </Row>

      {/* Steps */}
      <Card>
        <Steps current={currentStep}>
          <Step title="Select Fund" icon={<DollarOutlined />} />
          <Step title="Redemption Details" icon={<FileTextOutlined />} />
          <Step title="Eligibility Check" icon={<SafetyOutlined />} />
          <Step title="Fees & Schedule" icon={<ClockCircleOutlined />} />
          <Step title="Review & Confirm" icon={<CheckCircleOutlined />} />
        </Steps>
      </Card>

      {/* Step Content */}
      <Card>
        {/* Step 0: Select Fund */}
        {currentStep === 0 && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Alert
              message="Select Fund for Redemption"
              description="Choose the fund from which you would like to redeem shares"
              type="info"
              showIcon
            />

            <Row gutter={[16, 16]}>
              {mockFundHoldings.map((fund) => (
                <Col xs={24} md={12} key={fund.fundId}>
                  <Card
                    hoverable
                    onClick={() => handleFundSelect(fund.fundId)}
                    style={{
                      border: selectedFund?.fundId === fund.fundId ? '2px solid #1890ff' : '1px solid #d9d9d9',
                    }}
                  >
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Row justify="space-between" align="middle">
                        <Text strong style={{ fontSize: 16 }}>{fund.fundName}</Text>
                        {fund.isEligible ? (
                          <Tag color="success" icon={<CheckCircleOutlined />}>Eligible</Tag>
                        ) : (
                          <Tag color="error" icon={<ExclamationCircleOutlined />}>Not Eligible</Tag>
                        )}
                      </Row>
                      <Divider style={{ margin: '8px 0' }} />
                      <Descriptions column={2} size="small">
                        <Descriptions.Item label="Shares">{fund.shares}</Descriptions.Item>
                        <Descriptions.Item label="NAV">${fund.currentNAV}</Descriptions.Item>
                        <Descriptions.Item label="Total Value" span={2}>
                          <Text strong>${fund.totalValue.toLocaleString()}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Purchase Date" span={2}>
                          {dayjs(fund.purchaseDate).format('MMM DD, YYYY')}
                        </Descriptions.Item>
                        <Descriptions.Item label="Lock-up Ends" span={2}>
                          {dayjs(fund.lockupEndDate).format('MMM DD, YYYY')}
                        </Descriptions.Item>
                      </Descriptions>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </Space>
        )}

        {/* Step 1: Redemption Details */}
        {currentStep === 1 && selectedFund && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Alert
              message={`Redeeming from: ${selectedFund.fundName}`}
              description={`Available shares: ${selectedFund.shares} | Current NAV: $${selectedFund.currentNAV}`}
              type="info"
              showIcon
            />

            <Form form={form} layout="vertical">
              <Form.Item label="Redemption Type">
                <Radio.Group value={redemptionType} onChange={handleRedemptionTypeChange} size="large">
                  <Radio.Button value="partial">Partial Redemption</Radio.Button>
                  <Radio.Button value="full">Full Redemption</Radio.Button>
                </Radio.Group>
              </Form.Item>

              {redemptionType === 'partial' && (
                <>
                  <Form.Item label={`Shares to Redeem (Max: ${selectedFund.shares})`}>
                    <InputNumber
                      min={1}
                      max={selectedFund.shares}
                      value={sharesToRedeem}
                      onChange={handleSharesChange}
                      style={{ width: '100%' }}
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item label="Percentage to Redeem">
                    <Slider
                      min={0}
                      max={100}
                      value={percentToRedeem}
                      onChange={handlePercentChange}
                      marks={{
                        0: '0%',
                        25: '25%',
                        50: '50%',
                        75: '75%',
                        100: '100%',
                      }}
                    />
                  </Form.Item>
                </>
              )}

              {redemptionType === 'full' && (
                <Alert
                  message="Full Redemption"
                  description={`You will redeem all ${selectedFund.shares} shares from this fund.`}
                  type="warning"
                  showIcon
                />
              )}

              <Form.Item label="Payment Method">
                <Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  <Radio value="wire">Wire Transfer</Radio>
                  <Radio value="crypto">Cryptocurrency</Radio>
                </Radio.Group>
              </Form.Item>

              {paymentMethod === 'wire' && (
                <Alert
                  message="Wire Transfer Details"
                  description="Funds will be wired to your registered bank account on file."
                  type="info"
                  showIcon
                />
              )}

              {paymentMethod === 'crypto' && (
                <Form.Item label="Cryptocurrency Wallet Address">
                  <Input placeholder="Enter your wallet address" />
                </Form.Item>
              )}
            </Form>

            <Card size="small" style={{ background: '#f5f5f5' }}>
              <Statistic
                title="Estimated Gross Proceeds"
                value={sharesToRedeem * selectedFund.currentNAV}
                prefix="$"
                precision={2}
              />
            </Card>
          </Space>
        )}

        {/* Step 2: Eligibility Check */}
        {currentStep === 2 && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {!isEligible && (
              <Alert
                message="Eligibility Issues Detected"
                description="Your redemption request has one or more eligibility issues. Please review below."
                type="error"
                showIcon
                icon={<ExclamationCircleOutlined />}
              />
            )}

            {isEligible && (
              <Alert
                message="All Eligibility Checks Passed"
                description="Your redemption request meets all requirements."
                type="success"
                showIcon
                icon={<CheckCircleOutlined />}
              />
            )}

            {eligibilityChecks.map((check, index) => (
              <Card key={index} size="small">
                <Row justify="space-between" align="middle">
                  <Col>
                    <Space>
                      {eligibilityStatusConfig[check.status].icon}
                      <Text strong>{check.name}</Text>
                    </Space>
                  </Col>
                  <Col>
                    <Tag color={eligibilityStatusConfig[check.status].color}>
                      {check.status.toUpperCase()}
                    </Tag>
                  </Col>
                </Row>
                <Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 0 }}>
                  {check.message}
                </Paragraph>
              </Card>
            ))}

            {mockGateInfo.isActive && (
              <Card title="Gate Information" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Alert
                    message="Redemption Gate Active"
                    description="A redemption gate is currently in effect for this fund."
                    type="warning"
                    showIcon
                  />
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title="Monthly Limit"
                        value={mockGateInfo.monthlyLimit}
                        prefix="$"
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Current Month Redemptions"
                        value={mockGateInfo.currentMonthRedemptions}
                        prefix="$"
                      />
                    </Col>
                  </Row>
                  <div>
                    <Text type="secondary">Remaining Capacity</Text>
                    <Progress
                      percent={(mockGateInfo.remainingCapacity / mockGateInfo.monthlyLimit) * 100}
                      status="active"
                      format={(percent) => `$${mockGateInfo.remainingCapacity.toLocaleString()} (${percent?.toFixed(0)}%)`}
                    />
                  </div>
                  {mockGateInfo.queuePosition && (
                    <Alert
                      message={`Queue Position: #${mockGateInfo.queuePosition}`}
                      description="Your request will be processed on a first-in-first-out basis."
                      type="info"
                      showIcon
                    />
                  )}
                </Space>
              </Card>
            )}
          </Space>
        )}

        {/* Step 3: Fees & Schedule */}
        {currentStep === 3 && fees && schedule && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card title="Fee Breakdown" size="small">
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Gross Proceeds">
                  ${fees.grossProceeds.toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label={`Redemption Fee (${fees.redemptionFeePercent}%)`}>
                  -${fees.redemptionFee.toLocaleString()}
                </Descriptions.Item>
                {fees.earlyRedemptionPenalty > 0 && (
                  <Descriptions.Item label={`Early Redemption Penalty (${fees.earlyRedemptionPenaltyPercent}%)`}>
                    -${fees.earlyRedemptionPenalty.toLocaleString()}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label={`Tax Withholding (${fees.taxWithholdingPercent}% estimate)`}>
                  -${fees.taxWithholding.toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Net Proceeds">
                  <Text strong style={{ fontSize: 18, color: '#52c41a' }}>
                    ${fees.netProceeds.toLocaleString()}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="Redemption Schedule" size="small">
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Redemption Date">
                  {dayjs(schedule.redemptionDate).format('MMMM DD, YYYY')}
                </Descriptions.Item>
                <Descriptions.Item label="NAV Strike Date">
                  {dayjs(schedule.navStrikeDate).format('MMMM DD, YYYY')}
                </Descriptions.Item>
                <Descriptions.Item label="Payment Date">
                  {dayjs(schedule.paymentDate).format('MMMM DD, YYYY')}
                </Descriptions.Item>
                <Descriptions.Item label="Notice Period">
                  {schedule.noticePeriodDays} days
                </Descriptions.Item>
              </Descriptions>

              <Alert
                message="Important Timeline Information"
                description={`Your redemption will be processed on ${dayjs(schedule.redemptionDate).format('MMMM DD, YYYY')}. The NAV will be calculated on ${dayjs(schedule.navStrikeDate).format('MMMM DD, YYYY')}, and you will receive payment by ${dayjs(schedule.paymentDate).format('MMMM DD, YYYY')}.`}
                type="info"
                showIcon
                style={{ marginTop: 16 }}
              />
            </Card>
          </Space>
        )}

        {/* Step 4: Review & Confirm */}
        {currentStep === 4 && selectedFund && fees && schedule && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {!confirmationNumber ? (
              <>
                <Alert
                  message="Review Your Redemption Request"
                  description="Please review all details carefully before submitting your redemption request."
                  type="warning"
                  showIcon
                />

                <Card title="Redemption Summary" size="small">
                  <Descriptions column={2} bordered>
                    <Descriptions.Item label="Fund" span={2}>
                      {selectedFund.fundName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Redemption Type">
                      {redemptionType === 'full' ? 'Full Redemption' : 'Partial Redemption'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Shares to Redeem">
                      {sharesToRedeem}
                    </Descriptions.Item>
                    <Descriptions.Item label="Current NAV">
                      ${selectedFund.currentNAV}
                    </Descriptions.Item>
                    <Descriptions.Item label="Gross Proceeds">
                      ${fees.grossProceeds.toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="Total Fees & Taxes">
                      -${(fees.redemptionFee + fees.earlyRedemptionPenalty + fees.taxWithholding).toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="Net Proceeds" span={2}>
                      <Text strong style={{ fontSize: 18, color: '#52c41a' }}>
                        ${fees.netProceeds.toLocaleString()}
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Payment Method" span={2}>
                      {paymentMethod === 'wire' ? 'Wire Transfer' : 'Cryptocurrency'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Expected Payment Date" span={2}>
                      {dayjs(schedule.paymentDate).format('MMMM DD, YYYY')}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>

                <Card size="small">
                  <Form.Item label="E-Signature" required>
                    <Input placeholder="Type your full name to sign" />
                  </Form.Item>
                  <Alert
                    message="Legal Agreement"
                    description="By submitting this redemption request, I confirm that I have read and agree to the fund's redemption terms and conditions."
                    type="info"
                    showIcon
                  />
                </Card>
              </>
            ) : (
              <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
                <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a' }} />
                <Title level={3}>Redemption Request Submitted</Title>
                <Card>
                  <Statistic
                    title="Confirmation Number"
                    value={confirmationNumber}
                    valueStyle={{ color: '#1890ff', fontSize: 24 }}
                  />
                </Card>
                <Alert
                  message="What's Next?"
                  description={
                    <Space direction="vertical">
                      <Text>1. You will receive an email confirmation shortly</Text>
                      <Text>2. Your request will be processed on {dayjs(schedule.redemptionDate).format('MMMM DD, YYYY')}</Text>
                      <Text>3. Payment will be sent by {dayjs(schedule.paymentDate).format('MMMM DD, YYYY')}</Text>
                      <Text>4. You can track your redemption status in the Transactions page</Text>
                    </Space>
                  }
                  type="success"
                  showIcon
                />
              </Space>
            )}
          </Space>
        )}
      </Card>

      {/* Navigation Buttons */}
      {currentStep < 4 && (
        <Row justify="end">
          <Space>
            {currentStep > 0 && (
              <Button onClick={handlePrevious}>Previous</Button>
            )}
            {currentStep < 3 && (
              <Button type="primary" onClick={handleNext}>
                Next
              </Button>
            )}
            {currentStep === 3 && (
              <Button type="primary" onClick={handleNext}>
                Review & Confirm
              </Button>
            )}
          </Space>
        </Row>
      )}

      {currentStep === 4 && !confirmationNumber && (
        <Row justify="end">
          <Space>
            <Button onClick={handlePrevious}>Previous</Button>
            <Button type="primary" size="large" onClick={handleSubmit}>
              Submit Redemption Request
            </Button>
          </Space>
        </Row>
      )}
    </Space>
  );
};

export default RedemptionPage;
