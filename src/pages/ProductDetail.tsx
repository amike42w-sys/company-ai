import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, Typography, Space, Divider, Carousel, Image } from 'antd';
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

  const product = (companyInfo as any).categories
    .flatMap((cat: any) => cat.projects)
    .find((p: any) => p.id === id);

  if (!product || !product.details) return null;

  const { details } = product;
  // 过滤掉空路径，确保图片数量准确
  const currentImages = details.images.filter((img: any) => !!img);

  return (
    <div className={styles.detailContainer}>
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
            {/* 修复点 1：使用 items 锁定预览范围，解决 3/11 问题 */}
            <Image.PreviewGroup
              items={currentImages.map((src: string) => ({ src }))}
            >
              <Carousel autoplay className={styles.imageCarousel} dots={true}>
                {currentImages.map((img: string, index: number) => (
                  <div key={index} className={styles.carouselItem}>
                    {/* 修复点 2：去掉 preview={false}，改用 mask:null 允许点击放大 */}
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
            <div className={styles.carouselHint}>{t('swipe_hint')}</div>
          </Col>
          
          <Col xs={24} lg={11}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                {/* 修复点 3：删除了原本在这里的“项目案例”小蓝框 */}
                <Title level={2} style={{ marginTop: 0 }}>
                  {details.title[currentLang]}
                </Title>
              </div>

              <div className={styles.specsGrid}>
                {details.specs.map((item: any, index: number) => (
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
