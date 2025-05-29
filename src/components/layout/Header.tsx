import React from 'react';
import { Layout, Button, theme, Flex, Breadcrumb } from 'antd';
import { useLocation, Link } from 'react-router-dom';
import { BiMenu, BiMenuAltRight } from 'react-icons/bi';

const { Header } = Layout;

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const HeaderComponent: React.FC<HeaderProps> = ({ collapsed, setCollapsed }) => {
  const { token } = theme.useToken();
  const location = useLocation();

  const pathSnippets = location.pathname.split('/').filter((i) => i);
  const breadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    const title = pathSnippets[index].charAt(0).toUpperCase() + pathSnippets[index].slice(1);
    return {
      title: <Link to={url}>{title}</Link>,
    };
  });

  breadcrumbItems.unshift({
    title: <Link to="/">Home</Link>,
  });

  return (
    <Header
      style={{
        padding: 0,
        background: token.colorBgContainer,
        position: 'sticky',
        top: 0,
        zIndex: 1,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <BiMenuAltRight /> : <BiMenu />}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
        }}
      />
      <Flex justify="space-between" align="center" style={{ width: '100%', paddingRight: 24 }}>
        <Breadcrumb items={breadcrumbItems} style={{ margin: '16px 0' }} />
      </Flex>
    </Header>
  );
};

export default HeaderComponent;