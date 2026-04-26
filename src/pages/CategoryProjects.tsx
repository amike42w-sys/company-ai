import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Typography, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { companyInfo } from '../data/companyInfo';

const { Title } = Typography;

const CategoryProjects: React.FC = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language.startsWith('zh') ? 'zh' : 'en') as 'zh' | 'en';

  const category = companyInfo.categories.find(c => c.id === categoryId);

  if (!category) return <div>Category Not Found</div>;

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/')} style={{ marginBottom: 20 }}>
        {t('back')}
      </Button>
      <Title level={2}>{category.name[currentLang]}</Title>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {category.projects.length > 0 ? (
          category.projects.map((project) => (
            <Col xs={24} sm={12} md={8} key={project.id}>
              <Card
                hoverable
                cover={<img alt="project" src={project.details.images[0]} style={{ height: 200, objectFit: 'cover' }} />}
                onClick={() => navigate(`/product/${project.id}`)}
              >
                <Card.Meta title={project.name[currentLang]} />
              </Card>
            </Col>
          ))
        ) : (
          <Col span={24} style={{ textAlign: 'center', padding: 50 }}>
            <Title level={4} type="secondary">内容正在更新中 / Coming Soon</Title>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default CategoryProjects;