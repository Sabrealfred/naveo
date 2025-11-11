import { useState } from 'react';
import { Row, Col, Card, List, Avatar, Tag, Button, Space, Input, Select } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { BuySellModal } from '../../../components/modals';
import { useTranslation } from 'react-i18next';

const MarketplacePage = () => {
  const { t } = useTranslation();
  const [buyModalVisible, setBuyModalVisible] = useState(false);
  const [selectedToken, setSelectedToken] = useState<any>(null);

  const availableTokens = [
    {
      key: '1',
      name: 'Alpha Capital Fund',
      description: 'Diversified crypto fund with focus on blue-chip assets',
      nav: 135.45,
      navValue: '135.45',
      minInvestment: '10,000',
      performance30d: '+18.5%',
      performanceYTD: '+45.2%',
      aum: '$25.5M',
      risk: 'Alto',
      category: 'Crypto Fund',
      manager: 'Alpha Capital LLC',
    },
    {
      key: '2',
      name: 'Beta Real Estate Token',
      description: 'Tokenized commercial real estate portfolio',
      nav: 203.67,
      navValue: '203.67',
      minInvestment: '25,000',
      performance30d: '+12.3%',
      performanceYTD: '+28.9%',
      aum: '$42.8M',
      risk: 'Medio',
      category: 'Real Estate',
      manager: 'Beta Properties',
    },
    {
      key: '3',
      name: 'Gamma DeFi Yield',
      description: 'Automated DeFi yield farming strategies',
      nav: 98.42,
      navValue: '98.42',
      minInvestment: '5,000',
      performance30d: '+22.1%',
      performanceYTD: '+67.4%',
      aum: '$18.2M',
      risk: 'Muy Alto',
      category: 'DeFi',
      manager: 'Gamma Protocol',
    },
    {
      key: '4',
      name: 'Delta Stable Fund',
      description: 'Conservative stablecoin yield strategy',
      nav: 76.14,
      navValue: '76.14',
      minInvestment: '1,000',
      performance30d: '+5.2%',
      performanceYTD: '+18.3%',
      aum: '$52.1M',
      risk: 'Bajo',
      category: 'Yield',
      manager: 'Delta Capital',
    },
    {
      key: '5',
      name: 'Epsilon NFT Fund',
      description: 'Curated blue-chip NFT collection',
      nav: 156.23,
      navValue: '156.23',
      minInvestment: '50,000',
      performance30d: '+8.7%',
      performanceYTD: '+102.5%',
      aum: '$8.9M',
      risk: 'Muy Alto',
      category: 'NFT',
      manager: 'Epsilon Arts',
    },
    {
      key: '6',
      name: 'Zeta Index Fund',
      description: 'Market-cap weighted crypto index',
      nav: 112.89,
      navValue: '112.89',
      minInvestment: '5,000',
      performance30d: '+14.6%',
      performanceYTD: '+38.1%',
      aum: '$67.3M',
      risk: 'Medio',
      category: 'Index',
      manager: 'Zeta Indexes',
    },
  ];

  const handleBuy = (token: any) => {
    setSelectedToken(token);
    setBuyModalVisible(true);
  };

  const handleBuySubmit = (values: any) => {
    console.log('Buy order:', values);
    // Aquí se implementaría la lógica de compra
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>{t('marketplace.title', 'Asset Marketplace')}</h1>
        <p style={{ color: '#8c8c8c', fontSize: '14px', marginTop: 8 }}>{t('marketplace.subtitle', 'Explore and invest in tokenized funds and assets')}</p>
      </div>

      {/* Filtros */}
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Input
              size="large"
              placeholder={t('marketplace.searchPlaceholder', 'Search funds and assets...')}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
          <Col xs={24} md={8}>
            <Select
              size="large"
              placeholder={t('marketplace.category', 'Category')}
              style={{ width: '100%' }}
              allowClear
            >
              <Select.Option value="all">{t('marketplace.allCategories', 'All Categories')}</Select.Option>
              <Select.Option value="crypto">{t('marketplace.cryptoFund', 'Crypto Fund')}</Select.Option>
              <Select.Option value="realestate">{t('marketplace.realEstate', 'Real Estate')}</Select.Option>
              <Select.Option value="defi">{t('marketplace.defi', 'DeFi')}</Select.Option>
              <Select.Option value="nft">{t('marketplace.nft', 'NFT')}</Select.Option>
              <Select.Option value="yield">{t('marketplace.yield', 'Yield')}</Select.Option>
            </Select>
          </Col>
          <Col xs={24} md={8}>
            <Select
              size="large"
              placeholder={t('marketplace.riskLevel', 'Risk Level')}
              style={{ width: '100%' }}
              allowClear
            >
              <Select.Option value="low">{t('marketplace.low', 'Low')}</Select.Option>
              <Select.Option value="medium">{t('marketplace.medium', 'Medium')}</Select.Option>
              <Select.Option value="high">{t('marketplace.high', 'High')}</Select.Option>
              <Select.Option value="very-high">{t('marketplace.veryHigh', 'Very High')}</Select.Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Lista de tokens */}
      <Row gutter={[16, 16]}>
        {availableTokens.map((token) => (
          <Col xs={24} lg={12} key={token.key}>
            <Card bordered={false}>
              <div style={{ display: 'flex', marginBottom: 16 }}>
                <Avatar
                  size={64}
                  style={{
                    backgroundColor: '#1890ff',
                    fontSize: 24,
                    fontWeight: 'bold',
                  }}
                >
                  {token.name.charAt(0)}
                </Avatar>
                <div style={{ marginLeft: 16, flex: 1 }}>
                  <h3 style={{ margin: 0, marginBottom: 4 }}>{token.name}</h3>
                  <div style={{ color: '#666', fontSize: 14, marginBottom: 8 }}>
                    {token.description}
                  </div>
                  <Space size={[0, 8]} wrap>
                    <Tag>{token.category}</Tag>
                    <Tag
                      color={
                        token.risk === 'Bajo'
                          ? 'blue'
                          : token.risk === 'Medio'
                          ? 'orange'
                          : 'red'
                      }
                    >
                      {t('marketplace.riskLevel', 'Risk Level')}: {
                        token.risk === 'Bajo' ? t('marketplace.low', 'Low') :
                        token.risk === 'Medio' ? t('marketplace.medium', 'Medium') :
                        token.risk === 'Alto' ? t('marketplace.high', 'High') :
                        t('marketplace.veryHigh', 'Very High')
                      }
                    </Tag>
                  </Space>
                </div>
              </div>

              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={12}>
                  <div style={{ color: '#666', fontSize: 12 }}>{t('marketplace.currentNav', 'Current NAV')}</div>
                  <div style={{ fontSize: 18, fontWeight: 600 }}>${token.navValue}</div>
                </Col>
                <Col span={12}>
                  <div style={{ color: '#666', fontSize: 12 }}>{t('marketplace.totalAum', 'Total AUM')}</div>
                  <div style={{ fontSize: 18, fontWeight: 600 }}>{token.aum}</div>
                </Col>
                <Col span={12}>
                  <div style={{ color: '#666', fontSize: 12 }}>{t('marketplace.performance30d', '30d Performance')}</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#52c41a' }}>
                    {token.performance30d}
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ color: '#666', fontSize: 12 }}>{t('marketplace.minInv', 'Min. Investment')}</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>${token.minInvestment}</div>
                </Col>
              </Row>

              <div style={{ color: '#999', fontSize: 12, marginBottom: 12 }}>
                {t('marketplace.fundManager', 'Fund Manager')}: {token.manager}
              </div>

              <Space style={{ width: '100%' }}>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => handleBuy(token)}
                  style={{ flex: 1 }}
                >
                  {t('marketplace.invest', 'Invest')}
                </Button>
                <Button size="large">{t('marketplace.viewDetails', 'View Details')}</Button>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <BuySellModal
        visible={buyModalVisible}
        onClose={() => setBuyModalVisible(false)}
        onSubmit={handleBuySubmit}
        type="buy"
        asset={
          selectedToken
            ? {
              name: selectedToken.name,
              symbol: selectedToken.key,
              currentNav: selectedToken.nav,
            }
            : undefined
        }
        availableBalance={75000}
      />
    </div>
  );
};

export default MarketplacePage;
