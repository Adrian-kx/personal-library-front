import React from 'react';
import { Layout, Menu, theme } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  BookUser, 
  BookType, 
  Star, 
  ThumbsUp, 
  Home 
} from 'lucide-react';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();
  const { token } = theme.useToken();

  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path === '/') return ['home'];
    const mainPath = path.split('/')[1];
    return [mainPath];
  };

  const menuItems = [
    {
      key: 'home',
      icon: <Home size={18} />,
      label: <Link to="/">Início</Link>,
    },
    {
      key: 'books',
      icon: <BookOpen size={18} />,
      label: <Link to="/books">Livros</Link>,
    },
    {
      key: 'authors',
      icon: <BookUser size={18} />,
      label: <Link to="/authors">Autores</Link>,
    },
    {
      key: 'genres',
      icon: <BookType size={18} />,
      label: <Link to="/genres">Gêneros</Link>,
    },
    {
      key: 'users',
      icon: <Users size={18} />,
      label: <Link to="/users">Usuários</Link>,
    },
    {
      key: 'reviews',
      icon: <Star size={18} />,
      label: <Link to="/reviews">Avaliações</Link>,
    },
    {
      key: 'recommendations',
      icon: <ThumbsUp size={18} />,
      label: <Link to="/recommendations">Recomendações</Link>,
    },
  ];

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      theme="light"
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'sticky',
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '0' : '0 16px',
          color: token.colorPrimary,
          fontSize: 18,
          fontWeight: 'bold',
        }}
      >
        {!collapsed && 'Sistema de Biblioteca'}
        {collapsed && <BookOpen size={24} />}
      </div>
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={getSelectedKeys()}
        items={menuItems}
      />
    </Sider>
  );
};

export default Sidebar;