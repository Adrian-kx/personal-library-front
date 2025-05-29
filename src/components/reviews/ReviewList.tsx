import React from 'react';
import { List, Avatar, Rate, Typography, Card, Space, Popconfirm } from 'antd';
import { Trash2, Edit } from 'lucide-react';
import { Review } from '../../types/book';
import { useNavigate } from 'react-router-dom';
import { deleteReview } from '../../api/reviews';

const { Text, Paragraph } = Typography;

interface ReviewListProps {
  reviews: Review[];
  onDelete?: (id: number) => void;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = async (id: number) => {
    try {
      await deleteReview(id);
      if (onDelete) {
        onDelete(id);
      }
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  if (reviews.length === 0) {
    return <div>Nenhuma avaliação ainda. Seja o primeiro a avaliar!</div>;
  }

  return (
    <List
      itemLayout="vertical"
      dataSource={reviews}
      renderItem={(review) => (
        <Card style={{ marginBottom: 16 }}>
          <List.Item
            key={review.id}
            actions={[
              <Space>
                <Popconfirm
                  title="Excluir esta avaliação?"
                  description="Tem certeza que deseja excluir esta avaliação?"
                  onConfirm={() => handleDelete(review.id)}
                  okText="Sim"
                  cancelText="Não"
                >
                  <Trash2 size={16} />
                </Popconfirm>
                <Edit 
                  size={16} 
                  onClick={() => navigate(`/reviews/${review.id}/edit`)} 
                  style={{ cursor: 'pointer' }}
                />
              </Space>
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar style={{ backgroundColor: '#1890ff' }}>
                  {review.user?.name.charAt(0).toUpperCase() || 'U'}
                </Avatar>
              }
              title={
                <Space>
                  <Text strong>{review.user?.name || 'Anonymous'}</Text>
                  <Rate disabled defaultValue={review.rating} />
                </Space>
              }
              description={
                <Text type="secondary">
                  {review.created_at 
                    ? new Date(review.created_at).toLocaleDateString() 
                    : 'Data desconhecida'}
                </Text>
              }
            />
            <Paragraph style={{ marginTop: 16 }}>{review.comment}</Paragraph>
          </List.Item>
        </Card>
      )}
    />
  );
};

export default ReviewList;