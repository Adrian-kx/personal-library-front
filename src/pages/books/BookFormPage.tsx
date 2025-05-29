import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Select, 
  Typography, 
  Spin, 
  notification,
  InputNumber, 
  Card,
  Row,
  Col
} from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookById, createBook, updateBook } from '../../api/books';
import { getGenres } from '../../api/genres';
import { getAuthors } from '../../api/authors';
import { Book, Genre, Author } from '../../types/book';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const BookFormPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id && id !== 'new';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [genresData, authorsData] = await Promise.all([
          getGenres(),
          getAuthors()
        ]);
        setGenres(genresData);
        setAuthors(authorsData);

        if (isEditing) {
          const bookData = await getBookById(Number(id));
          form.setFieldsValue({
            ...bookData,
            author_ids: bookData.authors.map((author: Author) => author.id)
          });
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
  }, [id, isEditing, form]);

  const onFinish = async (values: Book) => {
    try {
      setSubmitting(true);
      if (isEditing) {
        await updateBook(Number(id), values);
        notification.success({
          message: 'Sucesso',
          description: 'Livro atualizado com sucesso',
        });
      } else {
        await createBook(values);
        notification.success({
          message: 'Sucesso',
          description: 'Livro criado com sucesso',
        });
      }
      navigate('/books');
    } catch (error) {
      notification.error({
        message: 'Erro',
        description: 'Falha ao salvar o livro',
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
      <Title level={2}>{isEditing ? 'Editar Livro' : 'Adicionar Novo Livro'}</Title>
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ published_year: new Date().getFullYear() }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="title"
                label="Título"
                rules={[{ required: true, message: 'Por favor, insira o título do livro' }]}
              >
                <Input placeholder="Insira o título do livro" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="genre_id"
                label="Gênero"
                rules={[{ required: true, message: 'Por favor, selecione um gênero' }]}
              >
                <Select placeholder="Selecione um gênero">
                  {genres.map(genre => (
                    <Option key={genre.id} value={genre.id}>{genre.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="author_ids"
            label="Autores"
            rules={[{ required: true, message: 'Por favor, selecione ao menos um autor' }]}
          >
            <Select 
              mode="multiple" 
              placeholder="Selecione autores"
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {authors.map(author => (
                <Option key={author.id} value={author.id}>{author.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="published_year"
                label="Ano de Publicação"
              >
                <InputNumber style={{ width: '100%' }} placeholder="Insira o ano de publicação" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="cover_image"
                label="URL da Capa"
              >
                <Input placeholder="Insira a URL da capa" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Descrição"
          >
            <TextArea rows={4} placeholder="Insira a descrição do livro" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {isEditing ? 'Atualizar Livro' : 'Criar Livro'}
            </Button>
            <Button 
              style={{ marginLeft: 8 }} 
              onClick={() => navigate('/books')}
            >
              Cancelar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default BookFormPage;