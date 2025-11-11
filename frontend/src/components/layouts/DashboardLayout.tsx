import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Badge, Space, Button, Drawer, Grid, Modal, Input, List, Tag, Tooltip } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  SearchOutlined,
  BulbOutlined,
  BulbFilled,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { MiraLogo } from '../common';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { SEARCH_INDEX } from '../../mocks/searchIndex';
import type { SearchItem } from '../../mocks/searchIndex';

const { Header, Sider, Content, Footer } = Layout;
const { useBreakpoint } = Grid;

interface DashboardLayoutProps {
  children: React.ReactNode;
  menuItems: MenuProps['items'];
  userRole: string;
  userName: string;
}

const palette = {
  sidebarStart: '#050C18',
  sidebarEnd: '#0B1F33',
  sidebarBorder: '#142036',
  menuText: '#A5B4CF',
  menuActiveBg: 'rgba(76, 130, 251, 0.18)',
  menuActiveColor: '#F8FBFF',
  headerBg: '#FFFFFF',
  headerBorder: '#E4E7EC',
  layoutBg: '#F6F7FB',
  accent: '#4C82FB',
  accentSoft: '#1C2B44',
  mutedText: '#94A3B8',
  footerBg: '#050C18',
  footerBorder: '#101F32',
};

const footerLinks = [
  {
    title: 'Platform',
    links: [
      { label: 'Overview', path: '/investor' },
      { label: 'AI Agent', path: '/admin-client/ai-agent' },
      { label: 'Tokenization', path: '/admin-owner/token-lifecycle' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Insights', path: '/reports' },
      { label: 'Compliance', path: '/admin-owner/compliance' },
      { label: 'Support', path: '/notifications' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Team', path: '/team' },
      { label: 'Partners', path: '/admin-owner/capital-partners' },
      { label: 'Contact', path: '/contact' },
    ],
  },
];

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
  const { theme, toggleTheme, isDark } = useTheme();

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

  // Keyboard shortcut for search (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Handle menu navigation
  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'profile') {
      navigate('/profile');
    } else if (key === 'settings') {
      navigate('/settings');
    } else if (key === 'logout') {
      // Handle logout
      console.log('Logout clicked');
      navigate('/login');
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

  const notificationsMenuItems: MenuProps['items'] = [
    {
      key: 'notif1',
      label: (
        <div style={{ width: 280 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>New transaction completed</div>
          <div style={{ fontSize: '12px', color: '#999' }}>Your purchase of $5,000 was successful</div>
          <div style={{ fontSize: '11px', color: '#bbb', marginTop: 4 }}>2 minutes ago</div>
        </div>
      ),
    },
    {
      key: 'notif2',
      label: (
        <div style={{ width: 280 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>NAV update available</div>
          <div style={{ fontSize: '12px', color: '#999' }}>Alpha Growth Fund NAV updated to $127.85</div>
          <div style={{ fontSize: '11px', color: '#bbb', marginTop: 4 }}>1 hour ago</div>
        </div>
      ),
    },
    {
      key: 'notif3',
      label: (
        <div style={{ width: 280 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Monthly report ready</div>
          <div style={{ fontSize: '12px', color: '#999' }}>Your October portfolio report is available</div>
          <div style={{ fontSize: '11px', color: '#bbb', marginTop: 4 }}>3 hours ago</div>
        </div>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'viewAll',
      label: <div style={{ textAlign: 'center', color: '#1890ff' }}>View all notifications</div>,
    },
  ];

  const handleNotificationClick = ({ key }: { key: string }) => {
    if (key === 'viewAll') {
      navigate('/notifications');
    }
  };

  // Logo component for sidebar
  const logoContent = (
    <div
      style={{
        height: 60,
        padding: collapsed ? '16px 6px' : '16px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        borderBottom: `1px solid ${palette.sidebarBorder}`,
      }}
    >
      {collapsed && !isMobile ? (
        <div
          style={{
            color: palette.menuActiveColor,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: '0.08em',
          }}
        >
          M
        </div>
      ) : (
        <MiraLogo variant="light" tone="gradient" size="xs" />
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
    <>
      <style>{`
        .mira-dashboard-menu.ant-menu {
          background: transparent !important;
          border-inline-end: none !important;
        }
        .mira-dashboard-menu .ant-menu-item {
          color: ${palette.menuText};
          margin: 4px 12px;
          border-radius: 10px;
          height: 44px;
          display: flex;
          align-items: center;
        }
        .mira-dashboard-menu .ant-menu-item:hover {
          color: #ffffff;
          background: rgba(255,255,255,0.06);
        }
        .mira-dashboard-menu .ant-menu-item-selected {
          color: ${palette.menuActiveColor} !important;
          background: ${palette.menuActiveBg} !important;
          box-shadow: 0 10px 24px rgba(5,12,24,0.45);
        }
        .mira-dashboard-menu .ant-menu-item::after {
          display: none;
        }
        .mira-dashboard-menu .ant-menu-submenu-title {
          color: ${palette.menuText};
        }
        .mira-dashboard-menu .ant-menu-submenu-title:hover {
          color: #ffffff;
        }
      `}</style>
      <Layout style={{ minHeight: '100vh', background: palette.layoutBg }}>
      {/* Mobile: Drawer menu */}
      {isMobile && (
        <Drawer
          placement="left"
          onClose={() => setMobileMenuOpen(false)}
          open={mobileMenuOpen}
          styles={{
            body: {
              padding: 0,
              background: `linear-gradient(180deg, ${palette.sidebarStart} 0%, ${palette.sidebarEnd} 100%)`,
            },
          }}
          width={200}
        >
          {logoContent}
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            className="mira-dashboard-menu"
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
            background: `linear-gradient(180deg, ${palette.sidebarStart} 0%, ${palette.sidebarEnd} 100%)`,
            borderRight: `1px solid ${palette.sidebarBorder}`,
            boxShadow: '0 20px 50px rgba(3,7,18,0.6)',
          }}
        >
          {logoContent}
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            className="mira-dashboard-menu"
          />
        </Sider>
      )}

      <Layout
        style={{
          marginLeft: isMobile ? 0 : collapsed ? 80 : 200,
          transition: 'all 0.2s ease',
          background: palette.layoutBg,
        }}
      >
        <Header style={{
          padding: isMobile ? '0 12px' : '0 24px',
          background: palette.headerBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${palette.headerBorder}`,
          boxShadow: '0 12px 24px rgba(15,23,42,0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 999,
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => isMobile ? setMobileMenuOpen(!mobileMenuOpen) : setCollapsed(!collapsed)}
            style={{ fontSize: 16, width: 54, height: 54, color: palette.accentSoft }}
          />

          <Space size={isMobile ? 'middle' : 'large'}>
            <Button
              icon={<SearchOutlined />}
              type="text"
              onClick={() => setSearchOpen(true)}
              style={{ color: palette.accentSoft }}
            >
              {!isMobile && (
                <span>
                  {t('layout.search')}{' '}
                  <kbd style={{
                    padding: '2px 6px',
                    fontSize: '11px',
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #d9d9d9',
                    borderRadius: '3px',
                    marginLeft: '8px'
                  }}>
                    ⌘K
                  </kbd>
                </span>
              )}
            </Button>

            <Tooltip title={isDark ? t('layout.lightMode', 'Light Mode') : t('layout.darkMode', 'Dark Mode')}>
              <Button
                icon={isDark ? <BulbFilled /> : <BulbOutlined />}
                type="text"
                onClick={toggleTheme}
                style={{ fontSize: '16px' }}
              />
            </Tooltip>

            {!isMobile && <LanguageSwitcher />}

            <Dropdown
              menu={{ items: notificationsMenuItems, onClick: handleNotificationClick }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Badge
                count={5}
                style={{ cursor: 'pointer', backgroundColor: palette.accent, color: '#fff' }}
              >
                <BellOutlined style={{ fontSize: 18, cursor: 'pointer', color: palette.accentSoft }} />
              </Badge>
            </Dropdown>

            <Dropdown
              menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar
                  style={{
                    background: 'linear-gradient(135deg, #4C82FB 0%, #7BD8FF 100%)',
                    color: '#fff',
                  }}
                >
                  {userName.charAt(0).toUpperCase()}
                </Avatar>
                {!isMobile && (
                  <div style={{ lineHeight: 1.2 }}>
                    <div style={{ fontWeight: 500 }}>{userName}</div>
                    <div style={{ fontSize: 12, color: palette.mutedText }}>{userRole}</div>
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
          background: '#FFFFFF',
          borderRadius: 16,
          boxShadow: '0 20px 45px rgba(15,23,42,0.06)',
        }}>
          {children}
        </Content>
        <Footer
          style={{
            background: palette.footerBg,
            borderTop: `1px solid ${palette.footerBorder}`,
            padding: isMobile ? '28px 16px' : '32px 48px',
            color: '#F8FBFF',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(140px, 1fr))',
              gap: 24,
            }}
          >
            {footerLinks.map((section) => (
              <div key={section.title}>
                <div style={{ fontWeight: 600, marginBottom: 12, color: '#fff' }}>{section.title}</div>
                <Space direction="vertical">
                  {section.links.map((link) => (
                    <Button
                      key={link.label}
                      type="link"
                      onClick={() => navigate(link.path)}
                      style={{ padding: 0, color: palette.mutedText }}
                    >
                      {link.label}
                    </Button>
                  ))}
                </Space>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 24,
              paddingTop: 16,
              borderTop: `1px solid ${palette.footerBorder}`,
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center',
              justifyContent: 'space-between',
              gap: 12,
              color: palette.mutedText,
              fontSize: 12,
            }}
          >
            <span>© {new Date().getFullYear()} Mira Labs. All rights reserved.</span>
            <Space size="middle">
              <Button type="link" style={{ padding: 0, color: palette.mutedText }} onClick={() => navigate('/legal/privacy')}>
                Privacy
              </Button>
              <Button type="link" style={{ padding: 0, color: palette.mutedText }} onClick={() => navigate('/legal/terms')}>
                Terms
              </Button>
              <Button type="link" style={{ padding: 0, color: palette.mutedText }} onClick={() => navigate('/contact')}>
                Contact
              </Button>
            </Space>
          </div>
        </Footer>
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
    </>
  );
};

export default DashboardLayout;
