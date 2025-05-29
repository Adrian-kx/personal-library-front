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
  Tag
} from 'antd';
import { PlusCircle, Search, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getGenres, deleteGenre } from '../../api/genres';
import { Genre } from '../../types/book';

const { Title } = Typography;

const GenreListPage: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      setLoading(true);
      const data = await getGenres();
      setGenres(data);
    } catch (error) {
      notification.error({
        message: 'Erro',
        description: 'Falha ao buscar gêneros',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteGenre(id);
      setGenres(genres.filter(genre => genre.id !== id));
      notification.success({
        message: 'Sucesso',
        description: 'Gênero excluído com sucesso',
      });
    } catch (error) {
      notification.error({
        message: 'Erro',
        description: 'Falha ao excluir o gênero',
      });
    }
  };

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Genre, b: Genre) => a.name.localeCompare(b.name),
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: Genre) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<Edit size={16} />} 
            onClick={() => navigate(`/genres/${record.id}/edit`)}
          />
          <Popconfirm
            title="Excluir este gênero?"
            description="Tem certeza que deseja excluir este gênero?"
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

  const filteredGenres = genres.filter(genre => 
    genre.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
        <Title level={2}>Gêneros</Title>
        <Button 
          type="primary" 
          icon={<PlusCircle size={18} />} 
          onClick={() => navigate('/genres/new')}
        >
          Adicionar Novo Gênero
        </Button>
      </Flex>

      <Card>
        <Input
          placeholder="Pesquisar gêneros"
          prefix={<Search size={16} />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginBottom: 16 }}
        />

        <Table
          columns={columns}
          dataSource={filteredGenres}
          rowKey="id"
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default GenreListPage;