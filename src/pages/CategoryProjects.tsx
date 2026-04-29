import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, Typography, Tag, Carousel, Image } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { companyInfo } from '../data/companyInfo';
import styles from './CategoryProjects.module.css';

const { Title, Text } = Typography;

const CategoryProjects: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const currentLang = (i18n.language.startsWith('zh') ? 'zh' : 'en') as 'zh' | 'en';

  const category = companyInfo.categories.find((cat) => cat.id === categoryId);

  if (!category) {
    return (
      <div style={{ padding: 50, textAlign: 'center' }}>
        <Title level={4}>未找到该分类</Title>
        <Button onClick={() => navigate('/')}>返回首页</Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px', maxWidth: '1400px', margin: '0 auto', minHeight: '100vh' }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate(-1)} 
        style={{ marginBottom: 24, borderRadius: '6px' }} 
      >
        {t('back')}
      </Button>

      <div className={styles.headerSection}>
        <div className={styles.categoryIcon}>{category.icon}</div>
        <div>
          <Tag color="blue" style={{ marginBottom: 8 }}>{t('product_category')}</Tag>
          <Title level={2}>{category.name[currentLang]}</Title>
          <Text type="secondary">{category.description[currentLang]}</Text>
        </div>
      </div>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {category.projects?.map((project) => (
          <Col xs={24} lg={12} key={project.id}>
            <Card 
              className={styles.projectCard} 
              hoverable 
              onClick={() => navigate(`/product/${project.id}`)}
            >
              <Image.PreviewGroup>
                <Carousel autoplay className={styles.projectCarousel}>
                  {project.details.images.slice(0, 5).map((img: string, index: number) => (
                    <div key={index}>
                      <Image 
                        src={img} 
                        alt={`${project.name[currentLang]}-${index}`} 
                        className={styles.projectImage}
                        preview={{ mask: null }}
                      />
                    </div>
                  ))}
                </Carousel>
              </Image.PreviewGroup>
              <div className={styles.projectInfo}>
                <Title level={4} className={styles.projectName}>
                  {project.name[currentLang]}
                </Title>
                <div className={styles.projectSpecs}>
                  {project.details.specs.slice(0, 2).map((spec: any, index: number) => (
                    <div key={index} className={styles.specItem}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {spec.label[currentLang]}
                      </Text>
                      <Text strong style={{ fontSize: '14px', color: '#1890ff' }}>
                        {spec.value[currentLang]}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CategoryProjects;
