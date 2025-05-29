import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Space,
  Divider,
  Button,
  Spin,
  List,
  Empty,
} from "antd";
import {
  BookOpen,
  BookUser,
  BookType,
  Users,
  Star,
  ThumbsUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getBooks } from "../api/books";
import { getAuthors } from "../api/authors";
import { getGenres } from "../api/genres";
import { getUsers } from "../api/users";
import { getReviews } from "../api/reviews";
import { BookWithDetails } from "../types/book";

const { Title, Text } = Typography;

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    books: 0,
    authors: 0,
    genres: 0,
    users: 0,
    reviews: 0,
  });
  const [recentBooks, setRecentBooks] = useState<BookWithDetails[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [books, authors, genres, users, reviews] = await Promise.all([
          getBooks(),
          getAuthors(),
          getGenres(),
          getUsers(),
          getReviews(),
        ]);

        setStats({
          books: books.length,
          authors: authors.length,
          genres: genres.length,
          users: users.length,
          reviews: reviews.length,
        });

        setRecentBooks(books.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", margin: "50px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>Sistema de biblioteca pessoal</Title>
        <Text type="secondary">
          Bem-vindo ao painel de gerenciamento da biblioteca
        </Text>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="Livros"
              value={stats.books}
              prefix={<BookOpen size={20} />}
            />
            <div style={{ marginTop: 16 }}>
              <Button type="link" size="small">
                <Link to="/books">Ver mais</Link>
              </Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="Autores"
              value={stats.authors}
              prefix={<BookUser size={20} />}
            />
            <div style={{ marginTop: 16 }}>
              <Button type="link" size="small">
                <Link to="/authors">Ver mais</Link>
              </Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="Gêneros"
              value={stats.genres}
              prefix={<BookType size={20} />}
            />
            <div style={{ marginTop: 16 }}>
              <Button type="link" size="small">
                <Link to="/genres">Ver mais</Link>
              </Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="Usuários"
              value={stats.users}
              prefix={<Users size={20} />}
            />
            <div style={{ marginTop: 16 }}>
              <Button type="link" size="small">
                <Link to="/users">Ver mais</Link>
              </Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="Reviews"
              value={stats.reviews}
              prefix={<Star size={20} />}
            />
            <div style={{ marginTop: 16 }}>
              <Button type="link" size="small">
                <Link to="/reviews">Ver mais</Link>
              </Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="Recomendações"
              value="Available"
              prefix={<ThumbsUp size={20} />}
            />
            <div style={{ marginTop: 16 }}>
              <Button type="link" size="small">
                <Link to="/recommendations">Ver</Link>
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="Livros recentes">
            {recentBooks.length > 0 ? (
              <List
                dataSource={recentBooks}
                renderItem={(book) => (
                  <List.Item>
                    <Space style={{ width: "100%" }}>
                      <div
                        style={{
                          width: 60,
                          height: 80,
                          background: "#f0f2f5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {book.cover_image ? (
                          <img
                            src={book.cover_image}
                            alt={book.title}
                            style={{
                              maxWidth: "100%",
                              maxHeight: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <BookOpen size={24} color="#d9d9d9" />
                        )}
                      </div>
                      <Space direction="vertical" size={0} style={{ flex: 1 }}>
                        <Link to={`/books/${book.id}`}>
                          <Text strong>{book.title}</Text>
                        </Link>
                        <Text type="secondary">
                          Genre: {book.genre?.name || "Unknown"} | Authors:{" "}
                          {book.authors?.map((a) => a.name).join(", ") ||
                            "Unknown"}
                        </Text>
                      </Space>
                    </Space>
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No books available" />
            )}
            <Divider style={{ margin: "16px 0" }} />
            <div style={{ textAlign: "center" }}>
              <Button type="primary">
                <Link to="/books/new">Adicionar um livro</Link>
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;
