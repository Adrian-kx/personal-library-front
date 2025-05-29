import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Table, 
  Button, 
  Space, 
  Rate, 
  Popconfirm, 
  notification, 
  Card,
  Flex,
  Tag,
  Input,
  Select
} from 'antd';
import { PlusCircle, Search, Edit, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getReviews, deleteReview } from '../../api/reviews';
import { getBooks } from '../../api/books';
import { getUsers } from '../../api/users';
import { Review, Book, User } from '../../types/book';

const { Title, Text } = Typography;
const { Option } = Select;

const ReviewListPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [bookFilter, setBookFilter] = useState<number | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reviewsData, booksData, usersData] = await Promise.all([
        getReviews(),
        getBooks(),
        getUsers()
      ]);
      setReviews(reviewsData);
      setBooks(booksData);
      setUsers(usersData);
    } catch (error) {
      notification.error({
        message: 'Erro',
        description: 'Falha ao buscar dados das avaliações',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteReview(id);
      setReviews(reviews.filter(review => review.id !== id));
      notification.success({
        message: 'Sucesso',
        description: 'Avaliação excluída com sucesso',
      });
    } catch (error) {
      notification.error({
        message: 'Erro',
        description: 'Falha ao excluir avaliação',
      });
    }
  };

  const getBookTitle = (bookId: number) => {
    const book = books.find(b => b.id === bookId);
    return book ? book.title : 'Livro desconhecido';
  };

  const getUserName = (userId: number) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Usuário desconhecido';
  };

  const columns = [
    {
      title: 'Livro',
      dataIndex: 'book_id',
      key: 'book',
      render: (bookId: number) => (
        <Link to={`/books/${bookId}`}>{getBookTitle(bookId)}</Link>
      ),
      sorter: (a: Review, b: Review) => {
        const titleA = getBookTitle(a.book_id);
        const titleB = getBookTitle(b.book_id);
        return titleA.localeCompare(titleB);
      },
    },
    {
      title: 'Usuário',
      dataIndex: 'user_id',
      key: 'user',
      render: (userId: number) => getUserName(userId),
      sorter: (a: Review, b: Review) => {
        const nameA = getUserName(a.user_id);
        const nameB = getUserName(b.user_id);
        return nameA.localeCompare(nameB);
      },
    },
    {
      title: 'Avaliação',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => <Rate disabled defaultValue={rating} />,
      sorter: (a: Review, b: Review) => a.rating - b.rating,
    },
    {
      title: 'Comentário',
      dataIndex: 'comment',
      key: 'comment',
      ellipsis: true,
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: Review) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<Edit size={16} />} 
            onClick={() => navigate(`/reviews/${record.id}/edit`)}
          />
          <Popconfirm
            title="Excluir esta avaliação?"
            description="Tem certeza que deseja excluir esta avaliação?"
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

  const filteredReviews = reviews.filter(review => {
    const matchesBook = bookFilter ? review.book_id === bookFilter : true;
    const bookTitle = getBookTitle(review.book_id).toLowerCase();
    const userName = getUserName(review.user_id).toLowerCase();
    const comment = review.comment.toLowerCase();
    const matchesSearch = searchText === '' || 
      bookTitle.includes(searchText.toLowerCase()) ||
      userName.includes(searchText.toLowerCase()) ||
      comment.includes(searchText.toLowerCase());
    
    return matchesBook && matchesSearch;
  });

  return (
    <div>
      <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
        <Title level={2}>Avaliações</Title>
        <Button 
          type="primary" 
          icon={<PlusCircle size={18} />} 
          onClick={() => navigate('/reviews/new')}
        >
          Adicionar Nova Avaliação
        </Button>
      </Flex>

      <Card style={{ marginBottom: 24 }}>
        <Flex gap={16} wrap="wrap" style={{ marginBottom: 16 }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <Input
              placeholder="Pesquisar avaliações"
              prefix={<Search size={16} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <Select
              placeholder="Filtrar por livro"
              style={{ width: '100%' }}
              allowClear
              value={bookFilter}
              onChange={(value) => setBookFilter(value)}
            >
              {books.map(book => (
                <Option key={book.id} value={book.id}>{book.title}</Option>
              ))}
            </Select>
          </div>
        </Flex>

        <Table
          columns={columns}
          dataSource={filteredReviews}
          rowKey="id"
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default ReviewListPage;