import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Button, 
  Input, 
  Row, 
  Col, 
  Card, 
  Select, 
  Flex, 
  Space, 
  Spin, 
  Empty, 
  notification,
  Popconfirm,
  Tooltip
} from 'antd';
import { 
  PlusCircle, 
  Search, 
  Edit, 
  Trash2, 
  BookOpen, 
  Star 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getBooks, deleteBook } from '../../api/books';
import { getGenres } from '../../api/genres';
import { BookWithDetails, Genre } from '../../types/book';

const { Title } = Typography;
const { Option } = Select;

const BookListPage: React.FC = () => {
  const [books, setBooks] = useState<BookWithDetails[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [titleFilter, setTitleFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState<number | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [booksData, genresData] = await Promise.all([
          getBooks(),
          getGenres()
        ]);
        setBooks(booksData);
        setGenres(genresData);
      } catch (error) {
        notification.error({
          message: 'Erro',
          description: 'Falha ao buscar livros e gêneros',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteBook(id);
      setBooks(books.filter(book => book.id !== id));
      notification.success({
        message: 'Sucesso',
        description: 'Livro excluído com sucesso',
      });
    } catch (error) {
      notification.error({
        message: 'Erro',
        description: 'Falha ao excluir o livro',
      });
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesTitle = book.title.toLowerCase().includes(titleFilter.toLowerCase());
    const matchesGenre = genreFilter ? book.genre_id === genreFilter : true;
    return matchesTitle && matchesGenre;
  });

  return (
    <div>
      <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
        <Title level={2}>Livros</Title>
        <Button 
          type="primary" 
          icon={<PlusCircle size={18} />} 
          onClick={() => navigate('/books/new')}
        >
          Adicionar Novo Livro
        </Button>
      </Flex>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Input 
            placeholder="Pesquisar por título" 
            prefix={<Search size={16} />} 
            value={titleFilter}
            onChange={(e) => setTitleFilter(e.target.value)}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Select
            placeholder="Filtrar por gênero"
            style={{ width: '100%' }}
            allowClear
            value={genreFilter}
            onChange={(value) => setGenreFilter(value)}
          >
            {genres.map(genre => (
              <Option key={genre.id} value={genre.id}>{genre.name}</Option>
            ))}
          </Select>
        </Col>
      </Row>

      {loading ? (
        <div style={{ textAlign: 'center', margin: '50px 0' }}>
          <Spin size="large" />
        </div>
      ) : filteredBooks.length === 0 ? (
        <Empty description="Nenhum livro encontrado" />
      ) : (
        <Row gutter={[16, 16]}>
          {filteredBooks.map(book => (
            <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
              <Card
                hoverable
                cover={
                  <div style={{ 
                    height: 200, 
                    background: '#f0f2f5', 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {book.cover_image ? (
                      <img 
                        alt={book.title} 
                        src={book.cover_image} 
                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <BookOpen size={64} color="#d9d9d9" />
                    )}
                  </div>
                }
                actions={[
                  <Tooltip title="Ver Detalhes">
                    <Link to={`/books/${book.id}`}>
                      <BookOpen size={16} />
                    </Link>
                  </Tooltip>,
                  <Tooltip title="Editar">
                    <Link to={`/books/${book.id}/edit`}>
                      <Edit size={16} />
                    </Link>
                  </Tooltip>,
                  <Tooltip title="Excluir">
                    <Popconfirm
                      title="Excluir este livro?"
                      description="Tem certeza que deseja excluir este livro?"
                      onConfirm={() => book.id && handleDelete(book.id)}
                      okText="Sim"
                      cancelText="Não"
                    >
                      <Trash2 size={16} />
                    </Popconfirm>
                  </Tooltip>,
                  <Tooltip title="Avaliações">
                    <Link to={`/books/${book.id}/reviews`}>
                      <Star size={16} />
                    </Link>
                  </Tooltip>
                ]}
              >
                <Card.Meta
                  title={book.title}
                  description={
                    <Space size={0}>
                      <div>Gênero: {book.genre?.name || 'Desconhecido'}</div>
                      <div>
                        Autores: {book.authors?.map(a => a.name).join(', ') || 'Desconhecido'}
                      </div>
                    </Space>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default BookListPage;