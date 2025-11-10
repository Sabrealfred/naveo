import { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge, Space, Button } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;

interface DashboardLayoutProps {
  children: React.ReactNode;
  menuItems: MenuProps['items'];
  userRole: string;
  userName: string;
  onMenuClick?: (key: string) => void;
}

const DashboardLayout = ({
  children,
  menuItems,
  userRole,
  userName,
  onMenuClick
}: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Mi Perfil',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Configuración',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Cerrar Sesión',
      danger: true,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
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
        <div style={{
          height: '64px',
          margin: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#1890ff',
          fontSize: collapsed ? '20px' : '24px',
          fontWeight: 'bold',
          transition: 'all 0.2s'
        }}>
          {collapsed ? 'N' : 'NAVEO'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={menuItems}
          onClick={({ key }) => onMenuClick?.(key)}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
        <Header style={{
          padding: '0 24px',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />

          <Space size="large">
            <Badge count={5}>
              <BellOutlined style={{ fontSize: '18px', cursor: 'pointer' }} />
            </Badge>

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar style={{ backgroundColor: '#1890ff' }}>
                  {userName.charAt(0).toUpperCase()}
                </Avatar>
                <div style={{ lineHeight: 1.2 }}>
                  <div style={{ fontWeight: 500 }}>{userName}</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>{userRole}</div>
                </div>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content style={{
          margin: '24px 16px',
          padding: 24,
          minHeight: 280,
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
