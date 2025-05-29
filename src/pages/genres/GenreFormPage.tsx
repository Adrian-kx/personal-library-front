import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Typography, 
  Card, 
  Spin, 
  notification 
} from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { getGenreById, createGenre, updateGenre } from '../../api/genres';
import { Genre } from '../../types/book';

const { Title } = Typography;

const GenreFormPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id && id !== 'new';

  useEffect(() => {
    if (isEditing) {
      fetchGenre();
    }
  }, [id, isEditing]);

  const fetchGenre = async () => {
    try {
      setLoading(true);
      const data = await getGenreById(Number(id));
      form.setFieldsValue(data);
    } catch (error) {
      notification.error({
        message: 'Erro',
        description: 'Falha ao carregar os dados do gênero',
      });
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: Genre) => {
    try {
      setSubmitting(true);
      if (isEditing) {
        await updateGenre(Number(id), values);
        notification.success({
          message: 'Sucesso',
          description: 'Gênero atualizado com sucesso',
        });
      } else {
        await createGenre(values);
        notification.success({
          message: 'Sucesso',
          description: 'Gênero criado com sucesso',
        });
      }
      navigate('/genres');
    } catch (error) {
      notification.error({
        message: 'Erro',
        description: 'Falha ao salvar o gênero',
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
      <Title level={2}>{isEditing ? 'Editar Gênero' : 'Adicionar Novo Gênero'}</Title>
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="name"
            label="Nome"
            rules={[{ required: true, message: 'Por favor, insira o nome do gênero' }]}
          >
            <Input placeholder="Insira o nome do gênero" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {isEditing ? 'Atualizar Gênero' : 'Criar Gênero'}
            </Button>
            <Button 
              style={{ marginLeft: 8 }} 
              onClick={() => navigate('/genres')}
            >
              Cancelar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default GenreFormPage;