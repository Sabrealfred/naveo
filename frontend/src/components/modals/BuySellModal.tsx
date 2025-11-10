import { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Form,
  InputNumber,
  Radio,
  Space,
  Typography,
  Divider,
  Steps,
  Result,
  Button,
  Tag,
} from 'antd';
import {
  DollarOutlined,
  SwapOutlined,
  ShoppingCartOutlined,
  CheckCircleTwoTone,
} from '@ant-design/icons';

const { Text, Title } = Typography;

type TransactionType = 'buy' | 'sell';

interface BuySellModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (values: BuySellConfirmation) => void;
  type: TransactionType;
  asset?: {
    name: string;
    symbol: string;
    currentNav: number;
  };
  availableBalance?: number;
  totalShares?: number;
}

interface BuySellFormValues {
  amount: number;
  paymentMethod?: 'wire' | 'card' | 'crypto';
}

interface BuySellConfirmation extends BuySellFormValues {
  type: TransactionType;
  asset?: {
    name: string;
    symbol: string;
    currentNav: number;
  };
  totalCost: number;
  fees: number;
  finalAmount: number;
}

const STEP_TITLES = ['Detalles', 'Revisión', 'Confirmación'];
const FEE_RATE = 0.005;

const BuySellModal = ({
  visible,
  onClose,
  onSubmit,
  type,
  asset,
  availableBalance = 0,
  totalShares = 0,
}: BuySellModalProps) => {
  const [form] = Form.useForm<BuySellFormValues>();
  const [currentStep, setCurrentStep] = useState(0);
  const [amount, setAmount] = useState<number>(0);
  const [processing, setProcessing] = useState(false);
  const [reviewData, setReviewData] = useState<BuySellConfirmation | null>(null);

  const currentNav = asset?.currentNav ?? 0;

  const totals = useMemo(() => {
    const totalCost = amount * currentNav;
    const fees = totalCost * FEE_RATE;
    const finalAmount = type === 'buy' ? totalCost + fees : Math.max(totalCost - fees, 0);
    return {
      totalCost,
      fees,
      finalAmount,
    };
  }, [amount, currentNav, type]);

  const resetState = () => {
    form.resetFields();
    setAmount(0);
    setCurrentStep(0);
    setProcessing(false);
    setReviewData(null);
  };

  useEffect(() => {
    if (!visible) {
      resetState();
    } else {
      form.setFieldsValue({ paymentMethod: 'wire' });
    }
  }, [visible]);

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload: BuySellConfirmation = {
        ...values,
        type,
        asset,
        totalCost: totals.totalCost,
        fees: totals.fees,
        finalAmount: totals.finalAmount,
      };
      setReviewData(payload);
      setCurrentStep(1);
    } catch {
      // validation errors handled by Form
    }
  };

  const handleConfirm = () => {
    if (!reviewData) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setCurrentStep(2);
      onSubmit?.(reviewData);
    }, 1200);
  };

  const handleSuccessClose = () => {
    handleClose();
  };

  const renderSummaryCard = (showDetails = true) => (
    <div
      style={{
        background: '#f5f5f5',
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Text type="secondary">Asset</Text>
            <Title level={4} style={{ margin: 0 }}>
              {asset ? `${asset.name} (${asset.symbol})` : 'Selecciona un asset'}
            </Title>
          </div>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: type === 'buy' ? '#e6f7ff' : '#fff2e8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
            }}
          >
            {type === 'buy' ? <DollarOutlined style={{ color: '#1890ff' }} /> : <SwapOutlined style={{ color: '#fa8c16' }} />}
          </div>
        </div>

        {showDetails && (
          <>
            <Divider style={{ margin: '12px 0' }} />
            <Space
              direction="vertical"
              style={{ width: '100%' }}
            >
              <SummaryRow label="Cantidad (units)" value={amount ? amount.toFixed(2) : '--'} />
              <SummaryRow label="NAV actual" value={`$${currentNav.toFixed(2)}`} />
              <SummaryRow label="Total Cost" value={`$${totals.totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
              <SummaryRow label="Fees (0.5%)" value={`$${totals.fees.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
              <SummaryRow
                label="Final Amount"
                value={`$${totals.finalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
                strong
              />
              {type === 'buy' ? (
                <SummaryRow label="Available Balance" value={`$${availableBalance.toLocaleString()}`} />
              ) : (
                <SummaryRow label="Total Shares" value={totalShares.toLocaleString()} />
              )}
            </Space>
          </>
        )}
      </Space>
    </div>
  );

  const stepsContent = [
    (
      <Form
        key="form"
        form={form}
        layout="vertical"
        initialValues={{ paymentMethod: 'wire' }}
      >
        {renderSummaryCard(false)}
        {asset && (
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
            <Text type="secondary">NAV actual:</Text>
            <Text strong>${currentNav.toFixed(2)}</Text>
          </div>
        )}
        <Form.Item
          label="Cantidad (units)"
          name="amount"
          rules={[
            { required: true, message: 'Por favor ingresa la cantidad' },
            {
              validator: (_, value) => {
                if (!value || value <= 0) {
                  return Promise.reject(new Error('La cantidad debe ser mayor a 0'));
                }
                if (type === 'buy' && availableBalance > 0) {
                  const projected = value * currentNav;
                  if (projected > availableBalance) {
                    return Promise.reject(new Error('Saldo insuficiente para completar la compra'));
                  }
                }
                if (type === 'sell' && totalShares > 0 && value > totalShares) {
                  return Promise.reject(new Error('No tienes suficientes unidades para vender'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            min={0.01}
            step={0.01}
            precision={2}
            style={{ width: '100%' }}
            prefix={<ShoppingCartOutlined />}
            onChange={(value) => setAmount(value ?? 0)}
          />
        </Form.Item>

        {type === 'buy' && (
          <Form.Item
            label="Método de Pago"
            name="paymentMethod"
            rules={[{ required: true, message: 'Selecciona un método de pago' }]}
          >
            <Radio.Group>
              <Space direction="vertical">
                <Radio value="wire">Wire Transfer</Radio>
                <Radio value="card">Tarjeta de Crédito/Débito</Radio>
                <Radio value="crypto">USDC / USDT</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
        )}

        <Divider />
        <div style={{ background: '#fafafa', borderRadius: 8, padding: 16 }}>
          <SummaryRow label="Total Cost" value={`$${totals.totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
          <SummaryRow label="Fees (0.5%)" value={`$${totals.fees.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
          <SummaryRow
            label={type === 'buy' ? 'Total a debitar' : 'Total a recibir'}
            value={`$${totals.finalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
            strong
          />
        </div>
      </Form>
    ),
    (
      <div key="review">
        {renderSummaryCard()}
        {reviewData && (
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">Resumen</Text>
            <div style={{ marginTop: 12 }}>
              <SummaryRow label="Cantidad" value={`${reviewData.amount} units`} />
              <SummaryRow label="Total Cost" value={`$${reviewData.totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
              <SummaryRow label="Fees" value={`$${reviewData.fees.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
              <SummaryRow
                label={type === 'buy' ? 'Total debitado' : 'Total recibido'}
                value={`$${reviewData.finalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
                strong
              />
              {type === 'buy' && reviewData.paymentMethod && (
                <SummaryRow
                  label="Payment Method"
                  value={reviewData.paymentMethod.toUpperCase()}
                />
              )}
            </div>
          </div>
        )}
      </div>
    ),
    (
      <Result
        key="result"
        status="success"
        title="Transacción enviada"
        subTitle="Recibirás una notificación cuando la operación haya sido liquidada."
        icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
        extra={[
          <Button type="primary" key="done" onClick={handleSuccessClose}>
            Cerrar
          </Button>,
        ]}
      />
    ),
  ];

  const renderFooter = () => {
    if (currentStep === 0) {
      return [
        <Button key="cancel" onClick={handleClose}>
          Cancelar
        </Button>,
        <Button key="next" type="primary" onClick={handleFormSubmit}>
          Continuar
        </Button>,
      ];
    }

    if (currentStep === 1) {
      return [
        <Button key="back" onClick={() => setCurrentStep(0)} disabled={processing}>
          Atrás
        </Button>,
        <Button key="confirm" type="primary" loading={processing} onClick={handleConfirm}>
          Confirmar
        </Button>,
      ];
    }

    return null;
  };

  return (
    <Modal
      title={type === 'buy' ? 'Comprar Tokens' : 'Vender Tokens'}
      open={visible}
      onCancel={handleClose}
      footer={currentStep === 2 ? null : renderFooter()}
      width={640}
      destroyOnClose
    >
      <Steps
        current={currentStep}
        items={STEP_TITLES.map((title) => ({ title }))}
        style={{ marginBottom: 24 }}
      />

      {!asset && (
        <Tag color="red" style={{ marginBottom: 16 }}>
          Selecciona primero un asset desde el marketplace
        </Tag>
      )}

      {stepsContent[currentStep]}
    </Modal>
  );
};

const SummaryRow = ({
  label,
  value,
  strong,
}: {
  label: string;
  value: string | number;
  strong?: boolean;
}) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
    <Text type="secondary">{label}</Text>
    <Text strong={strong}>{value}</Text>
  </div>
);

export default BuySellModal;
