import { Modal, Form, Input, Select, Upload, DatePicker, Button, Steps } from 'antd';
import { UploadOutlined, UserOutlined, IdcardOutlined, BankOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Step } = Steps;

interface KYCFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  type: 'individual' | 'business';
}

const KYCFormModal = ({
  visible,
  onClose,
  onSubmit,
  type
}: KYCFormModalProps) => {
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);

  const handleNext = () => {
    form.validateFields().then(() => {
      setCurrent(current + 1);
    });
  };

  const handlePrev = () => {
    setCurrent(current - 1);
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      onSubmit(values);
      form.resetFields();
      setCurrent(0);
      onClose();
    });
  };

  const steps = [
    {
      title: 'Información Personal',
      icon: <UserOutlined />,
      content: (
        <>
          <Form.Item
            label="Nombre Completo"
            name="fullName"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Campo requerido' },
              { type: 'email', message: 'Email inválido' }
            ]}
          >
            <Input size="large" type="email" />
          </Form.Item>
          <Form.Item
            label="Teléfono"
            name="phone"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label="Fecha de Nacimiento"
            name="birthDate"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <DatePicker size="large" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Nacionalidad"
            name="nationality"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <Select size="large">
              <Select.Option value="US">Estados Unidos</Select.Option>
              <Select.Option value="MX">México</Select.Option>
              <Select.Option value="CO">Colombia</Select.Option>
              <Select.Option value="AR">Argentina</Select.Option>
              <Select.Option value="other">Otro</Select.Option>
            </Select>
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Documentos',
      icon: <IdcardOutlined />,
      content: (
        <>
          <Form.Item
            label="Tipo de Documento"
            name="docType"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <Select size="large">
              <Select.Option value="passport">Pasaporte</Select.Option>
              <Select.Option value="national_id">Cédula Nacional</Select.Option>
              <Select.Option value="drivers_license">Licencia de Conducir</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Número de Documento"
            name="docNumber"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label="Frente del Documento"
            name="docFront"
            rules={[{ required: true, message: 'Por favor sube el documento' }]}
          >
            <Upload maxCount={1}>
              <Button icon={<UploadOutlined />}>Subir Archivo</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            label="Reverso del Documento"
            name="docBack"
          >
            <Upload maxCount={1}>
              <Button icon={<UploadOutlined />}>Subir Archivo</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            label="Prueba de Domicilio (últimos 3 meses)"
            name="proofOfAddress"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <Upload maxCount={1}>
              <Button icon={<UploadOutlined />}>Subir Archivo</Button>
            </Upload>
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Información Financiera',
      icon: <BankOutlined />,
      content: (
        <>
          <Form.Item
            label="Fuente de Fondos"
            name="sourceOfFunds"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <Select size="large">
              <Select.Option value="employment">Empleo/Salario</Select.Option>
              <Select.Option value="business">Negocio Propio</Select.Option>
              <Select.Option value="investments">Inversiones</Select.Option>
              <Select.Option value="inheritance">Herencia</Select.Option>
              <Select.Option value="other">Otro</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Ingreso Anual Estimado"
            name="annualIncome"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <Select size="large">
              <Select.Option value="0-50k">$0 - $50,000</Select.Option>
              <Select.Option value="50k-100k">$50,000 - $100,000</Select.Option>
              <Select.Option value="100k-250k">$100,000 - $250,000</Select.Option>
              <Select.Option value="250k-500k">$250,000 - $500,000</Select.Option>
              <Select.Option value="500k+">$500,000+</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="¿Es usted una Persona Políticamente Expuesta (PEP)?"
            name="isPEP"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <Select size="large">
              <Select.Option value="no">No</Select.Option>
              <Select.Option value="yes">Sí</Select.Option>
            </Select>
          </Form.Item>
        </>
      ),
    },
  ];

  return (
    <Modal
      title={`KYC - ${type === 'individual' ? 'Individual' : 'Empresa'}`}
      open={visible}
      onCancel={() => {
        form.resetFields();
        setCurrent(0);
        onClose();
      }}
      footer={null}
      width={700}
    >
      <Steps current={current} style={{ marginBottom: 24 }}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} icon={item.icon} />
        ))}
      </Steps>

      <Form form={form} layout="vertical">
        {steps[current].content}
      </Form>

      <div style={{ marginTop: 24, textAlign: 'right' }}>
        {current > 0 && (
          <Button style={{ marginRight: 8 }} onClick={handlePrev}>
            Anterior
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button type="primary" onClick={handleNext}>
            Siguiente
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={handleSubmit}>
            Enviar
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default KYCFormModal;
