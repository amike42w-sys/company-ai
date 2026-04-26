import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, Typography, Space, Divider, Carousel, Tag, Image } from 'antd';
import { ArrowLeftOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { companyInfo } from '../data/companyInfo';
import styles from './ProductDetail.module.css';

const { Title, Text, Paragraph } = Typography;

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const currentLang = (i18n.language.startsWith('zh') ? 'zh' : 'en') as 'zh' | 'en';

  const product = companyInfo.products.find(p => p.id === id);

  if (!product || !product.details) {
    return (
      <div style={{ padding: 50, textAlign: 'center' }}>
        <Title level={4}>未找到该产品的详细信息</Title>
        <Button onClick={() => navigate('/')}>返回首页</Button>
      </div>
    );
  }

  const { details } = product;

  return (
    <div style={{ padding: '16px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate(-1)} 
        style={{ marginBottom: 16, borderRadius: '6px' }} 
      >
        {t('back')}
      </Button>
      
      <Card className={styles.mainCard} bordered={false}>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={13}>
            <Image.PreviewGroup>
              <Carousel autoplay className={styles.imageCarousel} adaptiveHeight>
                {details.images.map((img, index) => (
                  <div key={index} className={styles.carouselItem}>
                    <Image 
                      src={img} 
                      alt={`slide-${index}`} 
                      className={styles.detailImage} 
                      preview={{ mask: null }} 
                    />
                  </div>
                ))}
              </Carousel>
            </Image.PreviewGroup>
            <div className={styles.carouselHint}>
              {t('swipe_hint')}
            </div>
          </Col>
          
          <Col xs={24} lg={11}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Tag color="blue" style={{ marginBottom: 8 }}>{t('project_case')}</Tag>
                <Title level={2} style={{ marginTop: 0 }}>
                  {details.title[currentLang]}
                </Title>
              </div>

              <div className={styles.specsGrid}>
                {details.specs.map((item, index) => (
                  <div key={index} className={styles.specItem}>
                    <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>
                      {item.label[currentLang]}
                    </Text>
                    <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
                      {item.value[currentLang]}
                    </Text>
                  </div>
                ))}
              </div>

              <Divider />

              <div>
                <Title level={5}><EnvironmentOutlined /> {t('project_intro')}</Title>
                <Paragraph style={{ fontSize: '15px', lineHeight: '1.8' }}>
                  {details.intro[currentLang]}
                </Paragraph>
              </div>
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ProductDetail;