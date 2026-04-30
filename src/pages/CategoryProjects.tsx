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
  const category = (companyInfo.categories as any).find((cat: any) => cat.id === categoryId);

  if (!category) return null;

  return (
    <div style={{ padding: '16px', maxWidth: '1400px', margin: '0 auto', minHeight: '100vh' }}>
      {/* 顶部仅保留返回按钮，删除多余的分类大卡片 */}
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16, borderRadius: '6px' }}
      >
        {t('back')}
      </Button>

      {/* 💡 这里删除了原本显示“校园建筑”和图标的 headerSection */}

      <Row gutter={[16, 16]}>
        {category.projects?.map((project: any) => (
          <Col xs={24} sm={12} lg={8} key={project.id}>
            <Card
              className={styles.projectCard}
              hoverable
              onClick={() => navigate(`/product/${project.id}`)}
              /* 💡 仅展示第一张图片作为封面，不再使用轮播图 */
              cover={
                <img
                  alt={project.name[currentLang]}
                  src={project.details.images[0]}
                  style={{ height: 220, objectFit: 'cover', borderRadius: '8px 8px 0 0' }}
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

export default CategoryProjects;
