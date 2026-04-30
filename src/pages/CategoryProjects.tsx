import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { companyInfo } from '../data/companyInfo';
import styles from './CategoryProjects.module.css';
import KeepAlive from 'react-activation'; // 💡 引入保活插件

const { Title } = Typography;

const CategoryProjectsContent: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const currentLang = (i18n.language.startsWith('zh') ? 'zh' : 'en') as 'zh' | 'en';
  const category = (companyInfo.categories as any).find((cat: any) => cat.id === categoryId);

  if (!category) return null;

  return (
    <div style={{ padding: '16px', maxWidth: '1400px', margin: '0 auto', minHeight: '100vh' }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16, borderRadius: '6px' }}
      >
        {t('back')}
      </Button>

      <Row gutter={[16, 16]}>
        {category.projects?.map((project: any) => (
          <Col xs={24} sm={12} lg={8} key={project.id}>
            <Card
              className={styles.projectCard}
              hoverable
              onClick={() => navigate(`/product/${project.id}`)}
              cover={
                <img
                  alt={project.name[currentLang]}
                  src={project.details.images[0]}
                  style={{ height: 220, objectFit: 'cover', borderRadius: '8px 8px 0 0' }}
                  loading="lazy" // 💡 优化：浏览器原生懒加载
                />
              }
            >
              <Card.Meta
                title={<div style={{ textAlign: 'center', fontSize: '16px' }}>{project.name[currentLang]}</div>}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

// 💡 导出时包裹 KeepAlive，并设置唯一的 cacheKey
const CategoryProjects = () => {
  const { categoryId } = useParams();
  return (
    <KeepAlive cacheKey={`Category-${categoryId}`} saveScrollPosition="screen">
      <CategoryProjectsContent />
    </KeepAlive>
  )
}

export default CategoryProjects;
