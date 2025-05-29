import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Table, 
  Button, 
  Space, 
  Input, 
  Popconfirm, 
  notification, 
  Card,
  Flex,
  Avatar
} from 'antd';
import { PlusCircle, Search, Edit, Trash2, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUsers, deleteUser } from '../../api/users';
import { User as UserType } from '../../types/book';

const { Title } = Typography;

const UserListPage: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      notification.error({
        message: 'Erro',
        description: 'Falha ao buscar usuários',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
      notification.success({
        message: 'Sucesso',
        description: 'Usuário excluído com sucesso',
      });
    } catch (error) {
      notification.error({
        message: 'Erro',
        description: 'Falha ao excluir o usuário',
      });
    }
  };

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: UserType, b: UserType) => a.name.localeCompare(b.name),
      render: (text: string) => (
        <Space>
          <Avatar style={{ backgroundColor: '#1890ff' }}>
            {text.charAt(0).toUpperCase()}
          </Avatar>
          {text}
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: UserType) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<Edit size={16} />} 
            onClick={() => navigate(`/users/${record.id}/edit`)}
          />
          <Popconfirm
            title="Excluir este usuário?"
            description="Tem certeza que deseja excluir este usuário?"
            onConfirm={() => record.id && handleDelete(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button type="text" danger icon={<Trash2 size={16} />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
        <Title level={2}>Usuários</Title>
        <Button 
          type="primary" 
          icon={<PlusCircle size={18} />} 
          onClick={() => navigate('/users/new')}
        >
          Adicionar Novo Usuário
        </Button>
      </Flex>

      <Card>
        <Input
          placeholder="Pesquisar usuários por nome ou email"
          prefix={<Search size={16} />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginBottom: 16 }}
        />

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default UserListPage;