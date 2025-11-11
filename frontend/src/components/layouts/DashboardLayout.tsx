import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Badge, Space, Button, Drawer, Grid, Modal, Input, List, Tag } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { MiraLogo } from '../common';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { SEARCH_INDEX } from '../../mocks/searchIndex';
import type { SearchItem } from '../../mocks/searchIndex';

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

interface DashboardLayoutProps {
  children: React.ReactNode;
  menuItems: MenuProps['items'];
  userRole: string;
  userName: string;
}

const DashboardLayout = ({
  children,
  menuItems,
  userRole,
  userName,
}: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation();

  // Check if we're on mobile (xs or sm breakpoints)
  const isMobile = !screens.md;

  // Auto-collapse sidebar on smaller screens
  useEffect(() => {
    if (screens.md && !screens.lg) {
      setCollapsed(true);
    } else if (screens.lg) {
      setCollapsed(false);
    }
  }, [screens.md, screens.lg]);

  // Handle menu navigation
  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: t('layout.profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: t('layout.settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('layout.logout'),
      danger: true,
    },
  ];

  // Logo component for sidebar
  const logoContent = (
    <div style={{
      height: '64px',
      padding: collapsed ? '16px 8px' : '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s'
    }}>
      {collapsed && !isMobile ? (
        <div style={{
          color: '#fff',
          fontSize: '18px',
          fontWeight: 'bold',
          fontFamily: 'Sansation, sans-serif',
          letterSpacing: '0.05em'
        }}>M</div>
      ) : (
        <MiraLogo variant="dark" size="xs" />
      )}
    </div>
  );

  const filteredSearch = useMemo(() => {
    if (!searchQuery) {
      return SEARCH_INDEX.slice(0, 8);
    }
    const normalized = searchQuery.toLowerCase();
    return SEARCH_INDEX.filter((item) => {
      const matchesLabel = item.label.toLowerCase().includes(normalized);
      const matchesDesc = item.description.toLowerCase().includes(normalized);
      const matchesTags = item.tags?.some((tag) => tag.toLowerCase().includes(normalized));
      return matchesLabel || matchesDesc || matchesTags;
    });
  }, [searchQuery]);

  const handleSearchSelect = (item: SearchItem) => {
    navigate(item.route);
    setSearchOpen(false);
    setSearchQuery('');
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  const renderCategoryTag = (category: SearchItem['category']) => {
    const colorMap: Record<SearchItem['category'], string> = {
      asset: 'blue',
      portfolio: 'green',
      client: 'purple',
      partner: 'volcano',
      report: 'gold',
      distribution: 'cyan',
    };
    return <Tag color={colorMap[category]}>{category.toUpperCase()}</Tag>;
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Mobile: Drawer menu */}
      {isMobile && (
        <Drawer
          placement="left"
          onClose={() => setMobileMenuOpen(false)}
          open={mobileMenuOpen}
          bodyStyle={{ padding: 0, background: '#001529' }}
          width={200}
        >
          {logoContent}
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
          />
        </Drawer>
      )}

      {/* Desktop: Fixed Sider */}
      {!isMobile && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          {logoContent}
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
          />
        </Sider>
      )}

      <Layout style={{ marginLeft: isMobile ? 0 : (collapsed ? 80 : 200), transition: 'all 0.2s' }}>
        <Header style={{
          padding: isMobile ? '0 12px' : '0 24px',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          position: 'sticky',
          top: 0,
          zIndex: 999,
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => isMobile ? setMobileMenuOpen(!mobileMenuOpen) : setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />

          <Space size={isMobile ? 'middle' : 'large'}>
            <Button
              icon={<SearchOutlined />}
              type="text"
              onClick={() => setSearchOpen(true)}
            >
              {!isMobile && t('layout.search')}
            </Button>
            {!isMobile && <LanguageSwitcher />}

            <Badge count={5}>
              <BellOutlined style={{ fontSize: '18px', cursor: 'pointer' }} />
            </Badge>

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar style={{ backgroundColor: '#1890ff' }}>
                  {userName.charAt(0).toUpperCase()}
                </Avatar>
                {!isMobile && (
                  <div style={{ lineHeight: 1.2 }}>
                    <div style={{ fontWeight: 500 }}>{userName}</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>{userRole}</div>
                  </div>
                )}
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content style={{
          margin: isMobile ? '12px 8px' : '24px 16px',
          padding: isMobile ? 12 : 24,
          minHeight: 280,
        }}>
          {children}
        </Content>
        <Modal
          open={searchOpen}
          onCancel={() => setSearchOpen(false)}
          footer={null}
          width={isMobile ? '90%' : 640}
          title={t('layout.search')}
        >
          <Input
            placeholder="Busca activos, portafolios, reportes..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            allowClear
            size="large"
            autoFocus
            prefix={<SearchOutlined />}
          />
          <List
            style={{ marginTop: 16, maxHeight: 360, overflowY: 'auto' }}
            dataSource={filteredSearch}
            locale={{ emptyText: 'No hay resultados' }}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                style={{ cursor: 'pointer' }}
                onClick={() => handleSearchSelect(item)}
              >
                <List.Item.Meta
                  title={
                    <Space>
                      {renderCategoryTag(item.category)}
                      <span>{item.label}</span>
                    </Space>
                  }
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </Modal>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
