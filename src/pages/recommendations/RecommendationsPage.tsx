import React, { useState } from 'react';
import { 
  Typography, 
  Card, 
  Input, 
  Select, 
  Button, 
  Row, 
  Col, 
  Empty, 
  Spin, 
  notification,
  Form,
  Flex,
  InputNumber
} from 'antd';
import { Search, BookOpen } from 'lucide-react';
import { getRecommendations } from '../../api/recommendations';
import { getGenres } from '../../api/genres';
import { Genre, RecommendedBook } from '../../types/book';
import { useEffect } from 'react';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const RecommendationsPage: React.FC = () => {
  const [form] = Form.useForm();
  const [recommendations, setRecommendations] = useState<RecommendedBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
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

    fetchGenres();
  }, []);

  const onFinish = async (values: { title?: string; genre?: string; limit?: number }) => {
    try {
      setSearching(true);
      setRecommendations([]);
      
      const data = await getRecommendations({
        title: values.title,
        genre: values.genre,
        limit: values.limit || 10,
      });
      
      setRecommendations(data);
    } catch (error) {
      notification.error({
        message: 'Erro',
        description: 'Falha ao buscar recomendações',
      });
    } finally {
      setSearching(false);
    }
  };

  return (
    <div>
      <Title level={2}>Recomendações de Livros</Title>
      <Card style={{ marginBottom: 24 }}>
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={onFinish}
          initialValues={{ limit: 10 }}
        >
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item name="title" label="Título do Livro">
                <Input 
                  placeholder="Digite o título do livro" 
                  prefix={<Search size={16} />} 
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="genre" label="Gênero">
                <Select 
                  placeholder="Selecione um gênero" 
                  allowClear
                  loading={loading}
                >
                  {genres.map(genre => (
                    <Option key={genre.id} value={genre.name}>{genre.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="limit" label="Número de Resultados">
                <InputNumber min={1} max={20} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={searching}>
              Obter Recomendações
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {searching ? (
        <div style={{ textAlign: 'center', margin: '50px 0' }}>
          <Spin size="large" />
        </div>
      ) : recommendations.length > 0 ? (
        <Row gutter={[16, 16]}>
          {recommendations.map((book) => (
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
                    {book.thumbnail ? (
                      <img 
                        alt={book.title} 
                        src={book.thumbnail} 
                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <BookOpen size={64} color="#d9d9d9" />
                    )}
                  </div>
                }
              >
                <Card.Meta
                  title={book.title}
                  description={
                    <div>
                      <div>Por: {book.authors?.join(', ') || 'Unknown'}</div>
                      <div>Publicado: {book.publishedDate || 'Unknown'}</div>
                      <div>Categorias: {book.categories?.join(', ') || 'Uncategorized'}</div>
                      <Paragraph ellipsis={{ rows: 3 }}>
                        {book.description || 'Sem descrição disponível'}
                      </Paragraph>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty 
          description="Pesquise por recomendações de livros acima" 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
        />
      )}
    </div>
  );
};

export default RecommendationsPage;