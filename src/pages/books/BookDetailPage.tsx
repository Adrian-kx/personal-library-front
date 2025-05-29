import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Descriptions, 
  Button, 
  Space, 
  Spin, 
  notification,
  Divider,
  Card,
  Tag,
  Row,
  Col,
  Tabs,
  TabsProps,
  Rate
} from 'antd';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Edit, Trash2, BookOpen, BookUser, Star, ThumbsUp } from 'lucide-react';
import { getBookById, deleteBook } from '../../api/books';
import { getReviewsByBookId } from '../../api/reviews';
import { BookWithDetails, Review } from '../../types/book';
import ReviewList from '../../components/reviews/ReviewList';

const { Title } = Typography;

const BookDetailPage: React.FC = () => {
  const [book, setBook] = useState<BookWithDetails | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (id) {
          const [bookData, reviewsData] = await Promise.all([
            getBookById(Number(id)),
            getReviewsByBookId(Number(id))
          ]);
          setBook(bookData);
          setReviews(reviewsData);
        }
      } catch (error) {
        notification.error({
          message: 'Erro',
          description: 'Falha ao carregar os detalhes do livro',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDelete = async () => {
    try {
      if (id) {
        await deleteBook(Number(id));
        notification.success({
          message: 'Sucesso',
          description: 'Livro excluído com sucesso',
        });
        navigate('/books');
      }
    } catch (error) {
      notification.error({
        message: 'Erro',
        description: 'Falha ao excluir o livro',
      });
    }
  };

  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const tabs: TabsProps['items'] = [
    {
      key: 'details',
      label: (
        <span>
          <BookOpen size={16} />
          Detalhes
        </span>
      ),
      children: book && (
        <Descriptions bordered column={{ xs: 1, sm: 2, md: 2 }}>
          <Descriptions.Item label="Título">{book.title}</Descriptions.Item>
          <Descriptions.Item label="Gênero">{book.genre?.name}</Descriptions.Item>
          <Descriptions.Item label="Autores">
            {book.authors?.map(author => (
              <Tag key={author.id} color="blue">
                <Link to={`/authors/${author.id}`}>{author.name}</Link>
              </Tag>
            ))}
          </Descriptions.Item>
          <Descriptions.Item label="Ano de Publicação">
            {book.published_year || 'Desconhecido'}
          </Descriptions.Item>
          <Descriptions.Item label="Descrição" span={2}>
            {book.description || 'Sem descrição disponível'}
          </Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: 'reviews',
      label: (
        <span>
          <Star size={16} />
          Avaliações ({reviews.length})
        </span>
      ),
      children: (
        <div>
          <Space style={{ marginBottom: 16 }}>
            <Button 
              type="primary" 
              onClick={() => navigate(`/books/${id}/reviews/new`)}
            >
              Adicionar Avaliação
            </Button>
          </Space>
          <ReviewList reviews={reviews} />
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', margin: '50px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!book) {
    return <div>Livro não encontrado</div>;
  }

  return (
    <div>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8} lg={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              {book.cover_image ? (
                <img 
                  src={book.cover_image} 
                  alt={book.title} 
                  style={{ maxWidth: '100%', maxHeight: 300 }} 
                />
              ) : (
                <div style={{ 
                  height: 300, 
                  background: '#f0f2f5', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <BookOpen size={64} color="#d9d9d9" />
                </div>
              )}
              
              <div style={{ marginTop: 16 }}>
                <Space size="middle">
                  <Button 
                    type="primary" 
                    icon={<Edit size={16} />}
                    onClick={() => navigate(`/books/${id}/edit`)}
                  >
                    Editar
                  </Button>
                  <Button 
                    danger 
                    icon={<Trash2 size={16} />} 
                    onClick={handleDelete}
                  >
                    Excluir
                  </Button>
                </Space>
              </div>
              
              {reviews.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <Rate disabled defaultValue={calculateAverageRating()} allowHalf />
                  <div>{calculateAverageRating().toFixed(1)} / 5 ({reviews.length} avaliações)</div>
                </div>
              )}
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={16} lg={18}>
          <Title level={2}>{book.title}</Title>
          <Tabs defaultActiveKey="details" items={tabs} />
        </Col>
      </Row>
    </div>
  );
};

export default BookDetailPage;