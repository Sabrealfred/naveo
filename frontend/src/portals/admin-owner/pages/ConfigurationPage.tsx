import { Card, Form, Input, Switch, Select, Button, Space, Row, Col, Divider, InputNumber, TimePicker, Tabs } from 'antd';
import { SaveOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { TabPane } = Tabs;
const { TextArea } = Input;

const ConfigurationPage = () => {
  const [form] = Form.useForm();
  const [generalForm] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [notificationsForm] = Form.useForm();

  const handleSave = () => {
    form.validateFields().then((values) => {
      console.log('Saving configuration:', values);
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Configuración de la Plataforma</h1>
        <Space>
          <Button icon={<ReloadOutlined />}>
            Resetear
          </Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
            Guardar Cambios
          </Button>
        </Space>
      </div>

      <Tabs defaultActiveKey="general">
        {/* General */}
        <TabPane tab="General" key="general" icon={<SettingOutlined />}>
          <Card>
            <Form
              form={generalForm}
              layout="vertical"
              initialValues={{
                platformName: 'Naveo',
                platformUrl: 'https://naveo.com',
                supportEmail: 'support@naveo.com',
                timezone: 'America/New_York',
                currency: 'USD',
                language: 'es',
                enableMaintenance: false,
                maintenanceMessage: '',
              }}
            >
              <Divider>Información de la Plataforma</Divider>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="Nombre de la Plataforma" name="platformName" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="URL de la Plataforma" name="platformUrl" rules={[{ required: true, type: 'url' }]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="Email de Soporte" name="supportEmail" rules={[{ required: true, type: 'email' }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Teléfono de Soporte" name="supportPhone">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Divider>Configuración Regional</Divider>

              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item label="Zona Horaria" name="timezone" rules={[{ required: true }]}>
                    <Select>
                      <Select.Option value="America/New_York">Eastern Time (ET)</Select.Option>
                      <Select.Option value="America/Chicago">Central Time (CT)</Select.Option>
                      <Select.Option value="America/Denver">Mountain Time (MT)</Select.Option>
                      <Select.Option value="America/Los_Angeles">Pacific Time (PT)</Select.Option>
                      <Select.Option value="Europe/London">London (GMT)</Select.Option>
                      <Select.Option value="Europe/Zurich">Zurich (CET)</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Moneda Principal" name="currency" rules={[{ required: true }]}>
                    <Select>
                      <Select.Option value="USD">USD - US Dollar</Select.Option>
                      <Select.Option value="EUR">EUR - Euro</Select.Option>
                      <Select.Option value="GBP">GBP - British Pound</Select.Option>
                      <Select.Option value="CHF">CHF - Swiss Franc</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Idioma" name="language" rules={[{ required: true }]}>
                    <Select>
                      <Select.Option value="es">Español</Select.Option>
                      <Select.Option value="en">English</Select.Option>
                      <Select.Option value="fr">Français</Select.Option>
                      <Select.Option value="de">Deutsch</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Divider>Modo Mantenimiento</Divider>

              <Form.Item name="enableMaintenance" valuePropName="checked">
                <Space>
                  <Switch />
                  <span>Habilitar modo mantenimiento</span>
                </Space>
              </Form.Item>

              <Form.Item label="Mensaje de Mantenimiento" name="maintenanceMessage">
                <TextArea rows={3} placeholder="La plataforma está en mantenimiento programado. Volveremos pronto." />
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        {/* Seguridad */}
        <TabPane tab="Seguridad" key="security">
          <Card>
            <Form
              form={securityForm}
              layout="vertical"
              initialValues={{
                requireMFA: true,
                sessionTimeout: 30,
                passwordMinLength: 12,
                passwordRequireSpecial: true,
                passwordRequireNumber: true,
                passwordRequireUppercase: true,
                maxLoginAttempts: 5,
                lockoutDuration: 15,
                ipWhitelist: false,
                apiRateLimit: 1000,
              }}
            >
              <Divider>Autenticación</Divider>

              <Form.Item name="requireMFA" valuePropName="checked">
                <Space>
                  <Switch />
                  <span>Requerir autenticación de dos factores (MFA)</span>
                </Space>
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="Timeout de Sesión (minutos)" name="sessionTimeout" rules={[{ required: true }]}>
                    <InputNumber min={5} max={480} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Intentos Máximos de Login" name="maxLoginAttempts" rules={[{ required: true }]}>
                    <InputNumber min={3} max={10} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Divider>Políticas de Contraseña</Divider>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="Longitud Mínima" name="passwordMinLength" rules={[{ required: true }]}>
                    <InputNumber min={8} max={32} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Duración de Bloqueo (minutos)" name="lockoutDuration" rules={[{ required: true }]}>
                    <InputNumber min={5} max={60} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="passwordRequireSpecial" valuePropName="checked">
                <Space>
                  <Switch />
                  <span>Requerir caracteres especiales</span>
                </Space>
              </Form.Item>

              <Form.Item name="passwordRequireNumber" valuePropName="checked">
                <Space>
                  <Switch />
                  <span>Requerir números</span>
                </Space>
              </Form.Item>

              <Form.Item name="passwordRequireUppercase" valuePropName="checked">
                <Space>
                  <Switch />
                  <span>Requerir mayúsculas</span>
                </Space>
              </Form.Item>

              <Divider>Seguridad de API</Divider>

              <Form.Item name="ipWhitelist" valuePropName="checked">
                <Space>
                  <Switch />
                  <span>Habilitar whitelist de IPs</span>
                </Space>
              </Form.Item>

              <Form.Item label="Rate Limit (requests/hora)" name="apiRateLimit" rules={[{ required: true }]}>
                <InputNumber min={100} max={10000} style={{ width: '100%' }} />
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        {/* Notificaciones */}
        <TabPane tab="Notificaciones" key="notifications">
          <Card>
            <Form
              form={notificationsForm}
              layout="vertical"
              initialValues={{
                emailNotifications: true,
                smsNotifications: false,
                pushNotifications: true,
                notifyNewInvestor: true,
                notifyLargeTransaction: true,
                notifyKYCStatus: true,
                notifyComplianceAlert: true,
                largeTransactionThreshold: 50000,
                emailProvider: 'sendgrid',
                smtpHost: 'smtp.sendgrid.net',
                smtpPort: 587,
              }}
            >
              <Divider>Canales de Notificación</Divider>

              <Form.Item name="emailNotifications" valuePropName="checked">
                <Space>
                  <Switch />
                  <span>Habilitar notificaciones por Email</span>
                </Space>
              </Form.Item>

              <Form.Item name="smsNotifications" valuePropName="checked">
                <Space>
                  <Switch />
                  <span>Habilitar notificaciones por SMS</span>
                </Space>
              </Form.Item>

              <Form.Item name="pushNotifications" valuePropName="checked">
                <Space>
                  <Switch />
                  <span>Habilitar notificaciones Push</span>
                </Space>
              </Form.Item>

              <Divider>Eventos de Notificación</Divider>

              <Form.Item name="notifyNewInvestor" valuePropName="checked">
                <Space>
                  <Switch />
                  <span>Nuevo inversionista registrado</span>
                </Space>
              </Form.Item>

              <Form.Item name="notifyLargeTransaction" valuePropName="checked">
                <Space>
                  <Switch />
                  <span>Transacciones grandes</span>
                </Space>
              </Form.Item>

              <Form.Item label="Umbral de Transacción Grande (USD)" name="largeTransactionThreshold">
                <InputNumber
                  min={1000}
                  max={1000000}
                  style={{ width: '100%' }}
                  formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>

              <Form.Item name="notifyKYCStatus" valuePropName="checked">
                <Space>
                  <Switch />
                  <span>Cambios de estado KYC/KYB</span>
                </Space>
              </Form.Item>

              <Form.Item name="notifyComplianceAlert" valuePropName="checked">
                <Space>
                  <Switch />
                  <span>Alertas de compliance</span>
                </Space>
              </Form.Item>

              <Divider>Configuración Email</Divider>

              <Form.Item label="Proveedor de Email" name="emailProvider">
                <Select>
                  <Select.Option value="sendgrid">SendGrid</Select.Option>
                  <Select.Option value="ses">Amazon SES</Select.Option>
                  <Select.Option value="smtp">SMTP Custom</Select.Option>
                </Select>
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} md={16}>
                  <Form.Item label="SMTP Host" name="smtpHost">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="SMTP Port" name="smtpPort">
                    <InputNumber min={25} max={587} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="SMTP Username" name="smtpUsername">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="SMTP Password" name="smtpPassword">
                    <Input.Password />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </TabPane>

        {/* Features */}
        <TabPane tab="Features" key="features">
          <Card>
            <Form
              layout="vertical"
              initialValues={{
                enableMarketplace: true,
                enableStaking: false,
                enableGovernance: false,
                enableTokenization: true,
                enableSecondaryMarket: false,
                enableAutomatedReporting: true,
                enableAdvancedAnalytics: true,
                enableWhiteLabel: false,
              }}
            >
              <Divider>Características de la Plataforma</Divider>

              <Form.Item name="enableMarketplace" valuePropName="checked">
                <Space>
                  <Switch />
                  <div>
                    <div style={{ fontWeight: 500 }}>Marketplace</div>
                    <div style={{ fontSize: 12, color: '#999' }}>Habilitar marketplace de tokens/fondos</div>
                  </div>
                </Space>
              </Form.Item>

              <Form.Item name="enableTokenization" valuePropName="checked">
                <Space>
                  <Switch />
                  <div>
                    <div style={{ fontWeight: 500 }}>Tokenización de Activos</div>
                    <div style={{ fontSize: 12, color: '#999' }}>Permitir crear tokens ERC-20 para fondos</div>
                  </div>
                </Space>
              </Form.Item>

              <Form.Item name="enableStaking" valuePropName="checked">
                <Space>
                  <Switch />
                  <div>
                    <div style={{ fontWeight: 500 }}>Staking</div>
                    <div style={{ fontSize: 12, color: '#999' }}>Habilitar staking de tokens</div>
                  </div>
                </Space>
              </Form.Item>

              <Form.Item name="enableGovernance" valuePropName="checked">
                <Space>
                  <Switch />
                  <div>
                    <div style={{ fontWeight: 500 }}>Governance/DAO</div>
                    <div style={{ fontSize: 12, color: '#999' }}>Sistema de votación y governance</div>
                  </div>
                </Space>
              </Form.Item>

              <Form.Item name="enableSecondaryMarket" valuePropName="checked">
                <Space>
                  <Switch />
                  <div>
                    <div style={{ fontWeight: 500 }}>Mercado Secundario</div>
                    <div style={{ fontSize: 12, color: '#999' }}>Permitir trading de tokens entre usuarios</div>
                  </div>
                </Space>
              </Form.Item>

              <Divider>Herramientas y Analytics</Divider>

              <Form.Item name="enableAutomatedReporting" valuePropName="checked">
                <Space>
                  <Switch />
                  <div>
                    <div style={{ fontWeight: 500 }}>Reportes Automatizados</div>
                    <div style={{ fontSize: 12, color: '#999' }}>Generación automática de reportes</div>
                  </div>
                </Space>
              </Form.Item>

              <Form.Item name="enableAdvancedAnalytics" valuePropName="checked">
                <Space>
                  <Switch />
                  <div>
                    <div style={{ fontWeight: 500 }}>Analytics Avanzado</div>
                    <div style={{ fontSize: 12, color: '#999' }}>Dashboards y métricas avanzadas</div>
                  </div>
                </Space>
              </Form.Item>

              <Form.Item name="enableWhiteLabel" valuePropName="checked">
                <Space>
                  <Switch />
                  <div>
                    <div style={{ fontWeight: 500 }}>White Label</div>
                    <div style={{ fontSize: 12, color: '#999' }}>Personalización completa de marca</div>
                  </div>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ConfigurationPage;
