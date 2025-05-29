import React, { useState } from 'react';
import { Layout, theme } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import HeaderComponent from './Header';

const { Content, Footer } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { token } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} />
      <Layout>
        <HeaderComponent collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: token.colorBgContainer,
            borderRadius: token.borderRadiusLG,
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center', padding: '12px 50px' }}>
          Library Management System ©{new Date().getFullYear()} Created with Ant Design
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;