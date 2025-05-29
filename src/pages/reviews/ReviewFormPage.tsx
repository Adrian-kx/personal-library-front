import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Rate, 
  Select, 
  Typography, 
  Card, 
  Spin, 
  notification 
} from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { createReview, getReviewById, updateReview } from '../../api/reviews';
import { getUsers } from '../../api/users';
import { getBooks } from '../../api/books';
import { Review, User, BookWithDetails } from '../../types/book';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ReviewFormPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<BookWithDetails[]>([]);
  const { id, bookId } = useParams();
  const navigate = useNavigate();
  
  const isEditing = !!id && id !== 'new';
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersData, booksData] = await Promise.all([
          getUsers(),
          getBooks()
        ]);
        setUsers(usersData);
        setBooks(booksData);
        
        if (isEditing && id) {
          const reviewData = await getReviewById(Number(id));
          form.setFieldsValue(reviewData);
        } else if (bookId) {
          form.setFieldsValue({ book_id: Number(bookId) });
        }
      } catch (error) {
        notification.error({
          message: 'Erro',
          description: 'Falha ao carregar os dados do formulário',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, bookId, isEditing, form]);
  
  const onFinish = async (values: Review) => {
    try {
      setSubmitting(true);
      
      if (isEditing && id) {
        await updateReview(Number(id), values);
        notification.success({
          message: 'Sucesso',
          description: 'Avaliação atualizada com sucesso',
        });
      } else {
        await createReview(values);
        notification.success({
          message: 'Sucesso',
          description: 'Avaliação criada com sucesso',
        });
      }
      
      if (bookId) {
        navigate(`/books/${bookId}`);
      } else {
        navigate('/reviews');
      }
    } catch (error) {
      notification.error({
        message: 'Erro',
        description: 'Falha ao salvar a avaliação',
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div style={{ textAlign: 'center', margin: '50px 0' }}>
        <Spin size="large" />
      </div>
    );
  }
  
  return (
    <div>
      <Title level={2}>{isEditing ? 'Editar Avaliação' : 'Adicionar Nova Avaliação'}</Title>
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ rating: 5 }}
        >
          <Form.Item
            name="rating"
            label="Avaliação"
            rules={[{ required: true, message: 'Por favor, avalie o livro' }]}
          >
            <Rate allowHalf />
          </Form.Item>
          
          <Form.Item
            name="comment"
            label="Comentário"
            rules={[{ required: true, message: 'Por favor, escreva sua avaliação' }]}
          >
            <TextArea rows={4} placeholder="Escreva sua avaliação aqui" />
          </Form.Item>
          
          <Form.Item
            name="user_id"
            label="Usuário"
            rules={[{ required: true, message: 'Por favor, selecione um usuário' }]}
          >
            <Select placeholder="Selecione um usuário">
              {users.map(user => (
                <Option key={user.id} value={user.id}>{user.name}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="book_id"
            label="Livro"
            rules={[{ required: true, message: 'Por favor, selecione um livro' }]}
          >
            <Select 
              placeholder="Selecione um livro"
              disabled={!!bookId}
            >
              {books.map(book => (
                <Option key={book.id} value={book.id}>{book.title}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {isEditing ? 'Atualizar Avaliação' : 'Enviar Avaliação'}
            </Button>
            <Button 
              style={{ marginLeft: 8 }} 
              onClick={() => bookId ? navigate(`/books/${bookId}`) : navigate('/reviews')}
            >
              Cancelar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ReviewFormPage;