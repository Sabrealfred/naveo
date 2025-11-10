import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Badge, Space, Button, Drawer, Grid } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../common/LanguageSwitcher';

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

  // Reusable menu component
  const menuContent = (
    <div style={{
      height: '64px',
      margin: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#1890ff',
      fontSize: collapsed && !isMobile ? '20px' : '24px',
      fontWeight: 'bold',
      transition: 'all 0.2s'
    }}>
      {collapsed && !isMobile ? 'N' : 'NAVEO'}
    </div>
  );

  const menu = (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]}
      items={menuItems}
      onClick={handleMenuClick}
    />
  );

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
          {menuContent}
          {menu}
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
          {menuContent}
          {menu}
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
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
