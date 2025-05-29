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
import { getUserById, createUser, updateUser } from '../../api/users';
import { User } from '../../types/book';

const { Title } = Typography;

const UserFormPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id && id !== 'new';

  useEffect(() => {
    if (isEditing) {
      fetchUser();
    }
  }, [id, isEditing]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await getUserById(Number(id));
      form.setFieldsValue(data);
    } catch (error) {
      notification.error({
        message: 'Erro',
        description: 'Falha ao buscar os dados do usuário',
      });
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: User) => {
    try {
      setSubmitting(true);
      if (isEditing) {
        await updateUser(Number(id), values);
        notification.success({
          message: 'Sucesso',
          description: 'Usuário atualizado com sucesso',
        });
      } else {
        await createUser(values);
        notification.success({
          message: 'Sucesso',
          description: 'Usuário criado com sucesso',
        });
      }
      navigate('/users');
    } catch (error) {
      notification.error({
        message: 'Erro',
        description: 'Falha ao salvar o usuário',
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
      <Title level={2}>{isEditing ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</Title>
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="name"
            label="Nome"
            rules={[{ required: true, message: 'Por favor, insira o nome do usuário' }]}
          >
            <Input placeholder="Insira o nome do usuário" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Por favor, insira o email do usuário' },
              { type: 'email', message: 'Por favor, insira um email válido' }
            ]}
          >
            <Input placeholder="Insira o email do usuário" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {isEditing ? 'Atualizar Usuário' : 'Criar Usuário'}
            </Button>
            <Button 
              style={{ marginLeft: 8 }} 
              onClick={() => navigate('/users')}
            >
              Cancelar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UserFormPage;