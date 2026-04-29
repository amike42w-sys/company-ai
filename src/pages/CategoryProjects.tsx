import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { companyInfo } from '../data/companyInfo';
import styles from './CategoryProjects.module.css';

const { Title } = Typography;

const CategoryProjects: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const currentLang = (i18n.language.startsWith('zh') ? 'zh' : 'en') as 'zh' | 'en';
  const category = companyInfo.categories.find((cat) => cat.id === categoryId);

  if (!category) return null;

  return (
    <div style={{ padding: '16px', maxWidth: '1400px', margin: '0 auto' }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: 24 }}>
        {t('back')}
      </Button>

      <div className={styles.headerSection}>
        <div className={styles.categoryIcon}>{category.icon}</div>
        <div>
          {/* 💡 已删除小蓝框 Tag */}
          <Title level={2} style={{ margin: 0 }}>{category.name[currentLang]}</Title>
        </div>
      </div>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {category.projects?.map((project) => (
          <Col xs={24} sm={12} lg={8} key={project.id}>
            <Card
              className={styles.projectCard}
              hoverable
              onClick={() => navigate(`/product/${project.id}`)}
              /* 💡 关键：这里直接用 img 标签显示第一张图，不再使用 Carousel */
              cover={
                <img
                  alt={project.name[currentLang]}
                  src={project.details.images[0]}
                  style={{ height: 220, objectFit: 'cover' }}
                />
              }
            >
              {/* 💡 仅展示产品名字 */}
              <Card.Meta
                title={<div style={{ textAlign: 'center' }}>{project.name[currentLang]}</div>}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CategoryProjects;
