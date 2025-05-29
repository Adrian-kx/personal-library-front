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
  Flex
} from 'antd';
import { PlusCircle, Search, Edit, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuthors, deleteAuthor } from '../../api/authors';
import { Author } from '../../types/book';

const { Title } = Typography;

const AuthorListPage: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const data = await getAuthors();
      setAuthors(data);
    } catch (error) {
      notification.error({
        message: 'Erro',
        description: 'Falha ao buscar autores',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAuthor(id);
      setAuthors(authors.filter(author => author.id !== id));
      notification.success({
        message: 'Sucesso',
        description: 'Autor excluído com sucesso',
      });
    } catch (error) {
      notification.error({
        message: 'Erro',
        description: 'Falha ao excluir autor',
      });
    }
  };

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Author, b: Author) => a.name.localeCompare(b.name),
      render: (text: string, record: Author) => (
        <Link to={`/authors/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: 'Biografia',
      dataIndex: 'biography',
      key: 'biography',
      render: (text: string) => text || 'Sem biografia disponível',
      ellipsis: true,
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: Author) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<Edit size={16} />} 
            onClick={() => navigate(`/authors/${record.id}/edit`)}
          />
          <Popconfirm
            title="Excluir este autor?"
            description="Tem certeza que deseja excluir este autor?"
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

  const filteredAuthors = authors.filter(author => 
    author.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
        <Title level={2}>Autores</Title>
        <Button 
          type="primary" 
          icon={<PlusCircle size={18} />} 
          onClick={() => navigate('/authors/new')}
        >
          Adicionar Novo Autor
        </Button>
      </Flex>

      <Card style={{ marginBottom: 24 }}>
        <Input
          placeholder="Pesquisar autores"
          prefix={<Search size={16} />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginBottom: 16 }}
        />

        <Table
          columns={columns}
          dataSource={filteredAuthors}
          rowKey="id"
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default AuthorListPage;