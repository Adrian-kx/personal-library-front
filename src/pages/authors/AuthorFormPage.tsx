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
import { getAuthorById, createAuthor, updateAuthor } from '../../api/authors';
import { Author } from '../../types/book';

const { Title } = Typography;
const { TextArea } = Input;

const AuthorFormPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id && id !== 'new';

  useEffect(() => {
    if (isEditing) {
      fetchAuthor();
    }
  }, [id, isEditing]);

  const fetchAuthor = async () => {
    try {
      setLoading(true);
      const data = await getAuthorById(Number(id));
      form.setFieldsValue(data);
    } catch (error) {
      notification.error({
        message: 'Erro',
        description: 'Falha ao carregar os dados do autor',
      });
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: Author) => {
    try {
      setSubmitting(true);
      if (isEditing) {
        await updateAuthor(Number(id), values);
        notification.success({
          message: 'Sucesso',
          description: 'Autor atualizado com sucesso',
        });
      } else {
        await createAuthor(values);
        notification.success({
          message: 'Sucesso',
          description: 'Autor criado com sucesso',
        });
      }
      navigate('/authors');
    } catch (error) {
      notification.error({
        message: 'Erro',
        description: 'Falha ao salvar o autor',
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
      <Title level={2}>{isEditing ? 'Editar Autor' : 'Adicionar Novo Autor'}</Title>
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="name"
            label="Nome"
            rules={[{ required: true, message: 'Por favor, insira o nome do autor' }]}
          >
            <Input placeholder="Insira o nome do autor" />
          </Form.Item>

          <Form.Item
            name="biography"
            label="Biografia"
          >
            <TextArea rows={4} placeholder="Insira a biografia do autor" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {isEditing ? 'Atualizar Autor' : 'Criar Autor'}
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => navigate('/authors')}
            >
              Cancelar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AuthorFormPage;