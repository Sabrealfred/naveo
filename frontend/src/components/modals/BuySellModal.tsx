import { Modal, Form, Input, Select, InputNumber, Radio, Space, Typography, Divider } from 'antd';
import { DollarOutlined, SwapOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Text } = Typography;

interface BuySellModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  mode: 'buy' | 'sell';
  availableTokens?: Array<{ label: string; value: string; nav: number }>;
}

const BuySellModal = ({
  visible,
  onClose,
  onSubmit,
  mode,
  availableTokens = []
}: BuySellModalProps) => {
  const [form] = Form.useForm();
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0);

  const token = availableTokens.find(t => t.value === selectedToken);
  const estimatedUnits = token ? (amount / token.nav).toFixed(2) : '0';
  const estimatedTotal = token ? (amount).toFixed(2) : '0';

  const handleOk = () => {
    form.validateFields().then(values => {
      onSubmit({ ...values, estimatedUnits, estimatedTotal });
      form.resetFields();
      onClose();
    });
  };

  return (
    <Modal
      title={mode === 'buy' ? 'Comprar Tokens' : 'Vender Tokens'}
      open={visible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      okText={mode === 'buy' ? 'Comprar' : 'Vender'}
      cancelText="Cancelar"
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ paymentMethod: 'wire' }}
      >
        <Form.Item
          label="Seleccionar Token/Fondo"
          name="token"
          rules={[{ required: true, message: 'Por favor selecciona un token' }]}
        >
          <Select
            size="large"
            placeholder="Selecciona un token"
            onChange={(value) => setSelectedToken(value)}
            options={availableTokens}
          />
        </Form.Item>

        {token && (
          <div style={{
            background: '#f0f2f5',
            padding: 16,
            borderRadius: 8,
            marginBottom: 16
          }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>NAV Actual:</Text>
                <Text strong>${token.nav.toFixed(2)}</Text>
              </div>
            </Space>
          </div>
        )}

        <Form.Item
          label={mode === 'buy' ? 'Monto a Invertir (USD)' : 'Cantidad de Units'}
          name="amount"
          rules={[{ required: true, message: 'Por favor ingresa el monto' }]}
        >
          <InputNumber
            size="large"
            style={{ width: '100%' }}
            prefix={<DollarOutlined />}
            min={0}
            precision={2}
            onChange={(value) => setAmount(value || 0)}
          />
        </Form.Item>

        {mode === 'buy' && (
          <Form.Item
            label="Método de Pago"
            name="paymentMethod"
            rules={[{ required: true }]}
          >
            <Radio.Group>
              <Space direction="vertical">
                <Radio value="wire">Wire Transfer</Radio>
                <Radio value="card">Tarjeta de Crédito/Débito</Radio>
                <Radio value="crypto">Crypto (USDC/USDT)</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
        )}

        <Divider />

        <div style={{ background: '#e6f7ff', padding: 16, borderRadius: 8 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>Units Estimadas:</Text>
              <Text strong style={{ fontSize: 18 }}>{estimatedUnits}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>Total:</Text>
              <Text strong style={{ fontSize: 18 }}>${estimatedTotal}</Text>
            </div>
          </Space>
        </div>

        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 12 }}>
          * El NAV final puede variar al momento de la ejecución de la transacción
        </Text>
      </Form>
    </Modal>
  );
};

export default BuySellModal;
