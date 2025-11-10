import { useState } from 'react';
import { Card, Row, Col, Button, Steps, Form, Input, Select, Radio, InputNumber, Switch, Table, Tag, Space, Modal, message, Tabs, Collapse, Divider } from 'antd';
import { AppstoreOutlined, PlusOutlined, BankOutlined, HomeOutlined, FundOutlined, FileTextOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface ShareClass {
  id: string;
  name: string;
  symbol: string;
  type: 'common' | 'preferred' | 'convertible';
  votingRights: boolean;
  dividendPriority: number;
  liquidationPreference: string;
  conversionRatio?: string;
  minInvestment: string;
}

interface SmartContractLayer {
  id: string;
  layer: string;
  name: string;
  standard: string;
  functions: string[];
  enabled: boolean;
}

/**
 * ProductStructuringPage - Complete product configuration studio
 *
 * Features inspired by Securitize.io:
 * - Multi-asset type support (funds, real estate, private equity, fixed income)
 * - Multiple share classes (Class A/B/C, Preferred, Convertible)
 * - Layered smart contract architecture (5 layers: Core, Governance, Economic, Compliance, Oracle)
 * - Token economics configuration
 * - Compliance policy builder
 * - Cross-chain deployment options
 */
const ProductStructuringPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [selectedAssetType, setSelectedAssetType] = useState('fund');
  const [shareClasses, setShareClasses] = useState<ShareClass[]>([]);
  const [addShareClassModalVisible, setAddShareClassModalVisible] = useState(false);

  const contractLayers: SmartContractLayer[] = [
    { id: '1', layer: 'Layer 1', name: 'Core Token Contract', standard: 'ERC-3643', functions: ['transfer', 'approve', 'freeze', 'forceTransfer'], enabled: true },
    { id: '2', layer: 'Layer 2', name: 'Governance & Voting', standard: 'Custom', functions: ['propose', 'vote', 'execute', 'delegate'], enabled: true },
    { id: '3', layer: 'Layer 3', name: 'Economic Rights', standard: 'Custom', functions: ['distribute', 'waterfall', 'fees', 'redeem'], enabled: true },
    { id: '4', layer: 'Layer 4', name: 'Compliance Engine', standard: 'Custom', functions: ['verifyKYC', 'checkLimits', 'enforceLockup', 'whitelist'], enabled: true },
    { id: '5', layer: 'Layer 5', name: 'NAV Oracle Integration', standard: 'Chainlink', functions: ['updateNAV', 'priceDiscovery', 'settlement'], enabled: false },
  ];

  const shareClassColumns: ColumnsType<ShareClass> = [
    { title: 'Class Name', dataIndex: 'name', key: 'name', render: (name) => <strong>{name}</strong> },
    { title: 'Symbol', dataIndex: 'symbol', key: 'symbol', render: (s) => <Tag>{s}</Tag> },
    { title: 'Type', dataIndex: 'type', key: 'type', render: (type) => <Tag color={type === 'common' ? 'blue' : type === 'preferred' ? 'green' : 'purple'}>{type.toUpperCase()}</Tag> },
    { title: 'Voting', dataIndex: 'votingRights', key: 'votingRights', render: (v) => v ? '✓' : '✗' },
    { title: 'Dividend Priority', dataIndex: 'dividendPriority', key: 'dividendPriority' },
    { title: 'Liquidation Pref', dataIndex: 'liquidationPreference', key: 'liquidationPreference' },
    { title: 'Min Investment', dataIndex: 'minInvestment', key: 'minInvestment' },
    { title: 'Actions', key: 'actions', render: () => <Space><Button size="small">Edit</Button><Button size="small" danger>Delete</Button></Space> },
  ];

  const handleAddShareClass = () => {
    const classLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const newClass: ShareClass = {
      id: String(shareClasses.length + 1),
      name: `Class ${classLetters[shareClasses.length] || shareClasses.length + 1}`,
      symbol: `NAV-${classLetters[shareClasses.length] || shareClasses.length + 1}`,
      type: 'common',
      votingRights: true,
      dividendPriority: shareClasses.length + 1,
      liquidationPreference: '1x',
      minInvestment: '$10,000',
    };
    setShareClasses([...shareClasses, newClass]);
    setAddShareClassModalVisible(false);
    message.success('Share class added');
  };

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card>
            <Row align="middle" gutter={24}>
              <Col flex="auto">
                <Space direction="vertical" size={0}>
                  <h2 style={{ margin: 0 }}><AppstoreOutlined /> Product Structuring Studio</h2>
                  <p style={{ margin: 0, color: '#8c8c8c' }}>Configure tokenized products with multi-layer smart contracts and share classes (Securitize-inspired)</p>
                </Space>
              </Col>
              <Col><Button type="primary" icon={<PlusOutlined />}>Create New Product</Button></Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Card>
        <Steps current={currentStep} onChange={setCurrentStep} style={{ marginBottom: 32 }}>
          <Steps.Step title="Asset Type" description="Select asset class" />
          <Steps.Step title="Share Classes" description="Configure classes" />
          <Steps.Step title="Smart Contracts" description="Setup layers" />
          <Steps.Step title="Token Economics" description="Define terms" />
          <Steps.Step title="Compliance" description="Set policies" />
        </Steps>

        {currentStep === 0 && (
          <div>
            <h3>Select Asset Type</h3>
            <p style={{ color: '#8c8c8c', marginBottom: 24 }}>Choose the type of asset you want to tokenize</p>
            <Row gutter={[16, 16]}>
              {[
                { type: 'fund', icon: <FundOutlined />, name: 'Investment Fund', desc: 'Hedge fund, venture fund, index fund' },
                { type: 'real-estate', icon: <HomeOutlined />, name: 'Real Estate', desc: 'Commercial, residential, REITs' },
                { type: 'private-equity', icon: <BankOutlined />, name: 'Private Equity', desc: 'GP/LP interests, carried interest' },
                { type: 'fixed-income', icon: <FileTextOutlined />, name: 'Fixed Income', desc: 'Bonds, notes, structured products' },
              ].map((asset) => (
                <Col xs={24} sm={12} lg={6} key={asset.type}>
                  <Card
                    hoverable
                    style={{ border: selectedAssetType === asset.type ? '2px solid #1890ff' : undefined }}
                    onClick={() => setSelectedAssetType(asset.type)}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }}>{asset.icon}</div>
                      <h4>{asset.name}</h4>
                      <p style={{ fontSize: 12, color: '#8c8c8c', margin: 0 }}>{asset.desc}</p>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

            <Divider />

            <Form layout="vertical" form={form}>
              <Row gutter={16}>
                <Col span={12}><Form.Item label="Product Name" name="productName" rules={[{ required: true }]}><Input placeholder="e.g., Naveo Growth Fund" /></Form.Item></Col>
                <Col span={12}><Form.Item label="Token Symbol" name="tokenSymbol" rules={[{ required: true }]}><Input placeholder="e.g., NGF" /></Form.Item></Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}><Form.Item label="Legal Structure" name="legalStructure"><Select><Select.Option value="spv">SPV</Select.Option><Select.Option value="trust">Trust</Select.Option><Select.Option value="llc">LLC</Select.Option></Select></Form.Item></Col>
                <Col span={12}><Form.Item label="Jurisdiction" name="jurisdiction"><Select><Select.Option value="us">United States</Select.Option><Select.Option value="cayman">Cayman Islands</Select.Option><Select.Option value="delaware">Delaware</Select.Option></Select></Form.Item></Col>
              </Row>
            </Form>
          </div>
        )}

        {currentStep === 1 && (
          <div>
            <Row gutter={24} align="middle" style={{ marginBottom: 16 }}>
              <Col flex="auto"><h3>Configure Share Classes</h3></Col>
              <Col><Button type="primary" icon={<PlusOutlined />} onClick={() => setAddShareClassModalVisible(true)}>Add Share Class</Button></Col>
            </Row>
            <p style={{ color: '#8c8c8c', marginBottom: 24 }}>
              Create multiple share classes with different rights and preferences (inspired by Securitize multi-class architecture with Wormhole)
            </p>
            <Table columns={shareClassColumns} dataSource={shareClasses} rowKey="id" pagination={false} />

            {shareClasses.length === 0 && (
              <div style={{ textAlign: 'center', padding: 48, background: '#fafafa', borderRadius: 8 }}>
                <p style={{ color: '#8c8c8c' }}>No share classes configured yet. Add your first share class to begin.</p>
                <Button type="dashed" icon={<PlusOutlined />} onClick={() => setAddShareClassModalVisible(true)}>Add Share Class</Button>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h3>Smart Contract Layer Configuration</h3>
            <p style={{ color: '#8c8c8c', marginBottom: 24 }}>Enable and configure multi-layer smart contract architecture (based on Securitize layered design)</p>
            <Collapse accordion>
              {contractLayers.map((layer) => (
                <Collapse.Panel
                  header={
                    <Space>
                      <Switch checked={layer.enabled} />
                      <strong>{layer.layer}: {layer.name}</strong>
                      <Tag>{layer.standard}</Tag>
                    </Space>
                  }
                  key={layer.id}
                >
                  <p><strong>Functions:</strong></p>
                  <Space wrap>
                    {layer.functions.map((func) => <Tag key={func} color="blue">{func}()</Tag>)}
                  </Space>
                  <Divider />
                  <Form layout="vertical" size="small">
                    <Form.Item label="Contract Template"><Select defaultValue="standard"><Select.Option value="standard">Standard Template</Select.Option><Select.Option value="custom">Custom Implementation</Select.Option></Select></Form.Item>
                    <Form.Item label="Upgrade Strategy"><Radio.Group defaultValue="diamond"><Radio value="diamond">Diamond Proxy</Radio><Radio value="transparent">Transparent Proxy</Radio><Radio value="immutable">Immutable</Radio></Radio.Group></Form.Item>
                  </Form>
                </Collapse.Panel>
              ))}
            </Collapse>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h3>Token Economics & Terms</h3>
            <p style={{ color: '#8c8c8c', marginBottom: 24 }}>Define the economic parameters and distribution mechanics</p>
            <Form layout="vertical">
              <Row gutter={16}>
                <Col span={8}><Form.Item label="Total Token Supply"><InputNumber style={{ width: '100%' }} defaultValue={10000000} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} /></Form.Item></Col>
                <Col span={8}><Form.Item label="Initial NAV per Token"><InputNumber style={{ width: '100%' }} prefix="$" defaultValue={10} /></Form.Item></Col>
                <Col span={8}><Form.Item label="Management Fee (Annual)"><InputNumber style={{ width: '100%' }} suffix="%" defaultValue={2} step={0.1} /></Form.Item></Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}><Form.Item label="Performance Fee (Carry)"><InputNumber style={{ width: '100%' }} suffix="%" defaultValue={20} /></Form.Item></Col>
                <Col span={12}><Form.Item label="Hurdle Rate"><InputNumber style={{ width: '100%' }} suffix="%" defaultValue={8} /></Form.Item></Col>
              </Row>
              <Form.Item label="Distribution Frequency"><Select defaultValue="quarterly"><Select.Option value="monthly">Monthly</Select.Option><Select.Option value="quarterly">Quarterly</Select.Option><Select.Option value="annually">Annually</Select.Option></Select></Form.Item>
              <Form.Item label="Waterfall Structure"><Radio.Group defaultValue="european"><Radio value="american">American (Deal-by-Deal)</Radio><Radio value="european">European (Portfolio)</Radio></Radio.Group></Form.Item>
            </Form>
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <h3>Compliance Policies</h3>
            <p style={{ color: '#8c8c8c', marginBottom: 24 }}>Configure regulatory compliance and transfer restrictions</p>
            <Tabs items={[
              {
                key: 'investor',
                label: 'Investor Requirements',
                children: (
                  <Form layout="vertical">
                    <Form.Item label="Investor Type"><Radio.Group defaultValue="accredited"><Radio value="any">Any Investor</Radio><Radio value="accredited">Accredited Only</Radio><Radio value="qualified">Qualified Purchaser</Radio></Radio.Group></Form.Item>
                    <Form.Item label="Minimum Net Worth"><InputNumber style={{ width: 300 }} prefix="$" defaultValue={1000000} /></Form.Item>
                    <Form.Item label="KYC/AML Provider"><Select style={{ width: 300 }} defaultValue="persona"><Select.Option value="persona">Persona</Select.Option><Select.Option value="onfido">Onfido</Select.Option><Select.Option value="jumio">Jumio</Select.Option></Select></Form.Item>
                  </Form>
                ),
              },
              {
                key: 'transfer',
                label: 'Transfer Restrictions',
                children: (
                  <Form layout="vertical">
                    <Form.Item label="Lock-up Period"><InputNumber style={{ width: 200 }} suffix="months" defaultValue={12} /></Form.Item>
                    <Form.Item label="Transfer Whitelist"><Switch defaultChecked /> <span style={{ marginLeft: 8 }}>Only allow transfers to whitelisted addresses</span></Form.Item>
                    <Form.Item label="Max Holders Per Jurisdiction"><InputNumber style={{ width: 200 }} defaultValue={2000} /></Form.Item>
                    <Form.Item label="Concentration Limit"><InputNumber style={{ width: 200 }} suffix="%" defaultValue={10} /> <span style={{ marginLeft: 8 }}>per investor</span></Form.Item>
                  </Form>
                ),
              },
              {
                key: 'regulatory',
                label: 'Regulatory Framework',
                children: (
                  <Form layout="vertical">
                    <Form.Item label="Securities Exemption"><Select style={{ width: 300 }} defaultValue="reg-d"><Select.Option value="reg-d">Regulation D (506c)</Select.Option><Select.Option value="reg-s">Regulation S</Select.Option><Select.Option value="reg-a">Regulation A+</Select.Option></Select></Form.Item>
                    <Form.Item label="Jurisdictions"><Select mode="multiple" style={{ width: '100%' }} defaultValue={['US']}><Select.Option value="US">United States</Select.Option><Select.Option value="EU">European Union</Select.Option><Select.Option value="UK">United Kingdom</Select.Option><Select.Option value="SG">Singapore</Select.Option></Select></Form.Item>
                    <Form.Item label="Audit Frequency"><Select style={{ width: 200 }} defaultValue="annual"><Select.Option value="quarterly">Quarterly</Select.Option><Select.Option value="annual">Annual</Select.Option></Select></Form.Item>
                  </Form>
                ),
              },
            ]} />
          </div>
        )}

        <Divider />

        <Row justify="space-between">
          <Col>{currentStep > 0 && <Button onClick={() => setCurrentStep(currentStep - 1)}>Previous</Button>}</Col>
          <Col>
            {currentStep < 4 ? (
              <Button type="primary" onClick={() => setCurrentStep(currentStep + 1)}>Next</Button>
            ) : (
              <Button type="primary" onClick={() => message.success('Product structured successfully!')}>Complete Structure</Button>
            )}
          </Col>
        </Row>
      </Card>

      <Modal
        title="Add Share Class"
        open={addShareClassModalVisible}
        onCancel={() => setAddShareClassModalVisible(false)}
        onOk={handleAddShareClass}
        width={600}
      >
        <Form layout="vertical">
          <Form.Item label="Class Name"><Input placeholder="e.g., Class A" /></Form.Item>
          <Form.Item label="Class Type"><Select><Select.Option value="common">Common</Select.Option><Select.Option value="preferred">Preferred</Select.Option><Select.Option value="convertible">Convertible</Select.Option></Select></Form.Item>
          <Row gutter={16}>
            <Col span={12}><Form.Item label="Voting Rights"><Switch defaultChecked /></Form.Item></Col>
            <Col span={12}><Form.Item label="Dividend Priority"><InputNumber min={1} defaultValue={1} /></Form.Item></Col>
          </Row>
          <Form.Item label="Liquidation Preference"><Input placeholder="e.g., 1x, 2x, 1.5x" defaultValue="1x" /></Form.Item>
          <Form.Item label="Minimum Investment"><Input prefix="$" defaultValue="10,000" /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductStructuringPage;
