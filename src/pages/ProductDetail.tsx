import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, Typography, Space, Divider, Carousel, Tag } from 'antd';
import { ArrowLeftOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { companyInfo } from '../data/companyInfo';
import styles from './ProductDetail.module.css';

const { Title, Text, Paragraph } = Typography;

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = companyInfo.products.find(p => p.id === id);

  // 【关键修复】同时检查 product 和 product.details 是否存在
  if (!product || !product.details) {
    return (
      <div style={{ padding: 50, textAlign: 'center' }}>
        <Title level={4}>未找到该产品的详细信息</Title>
        <Button onClick={() => navigate('/')}>返回首页</Button>
      </div>
    );
  }

  // 此时 TypeScript 知道 details 肯定存在了
  const { details } = product;

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        // 修改为 navigate(-1)，这样会直接退回到你刚才点击卡片时的页面位置
        onClick={() => navigate(-1)}
        style={{ marginBottom: 24, borderRadius: '6px' }} 
      >
        返回
      </Button>
      
      <Card className={styles.mainCard} bordered={false} style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <Row gutter={[40, 32]}>
          {/* 左侧：多图轮播区域 */}
          <Col xs={24} lg={13}>
            <Carousel autoplay className={styles.imageCarousel}>
              {details.images.map((img, index) => (
                <div key={index}>
                  <img 
                    src={img} 
                    alt={`slide-${index}`}
                    style={{ 
                      width: '100%', 
                      height: '450px', 
                      objectFit: 'cover', 
                      borderRadius: '12px',
                      display: 'block'
                    }}
                    onError={(e) => {
                      console.error("图片加载失败:", img);
                      // 容错：如果加载失败显示一个占位图
                      e.currentTarget.src = "https://via.placeholder.com/800x450?text=Image+Not+Found";
                    }}
                  />
                </div>
              ))}
            </Carousel>
            <div style={{ marginTop: 12, textAlign: 'center', color: '#999' }}>
              <Text type="secondary">← 左右滑动查看更多实景图 →</Text>
            </div>
          </Col>
          
          {/* 右侧：文字介绍区域 */}
          <Col xs={24} lg={11}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Tag color="blue" style={{ marginBottom: 8 }}>项目案例 / Project Case</Tag>
                <Title level={2} style={{ marginTop: 0 }}>{details.title.split(' / ')[0]}</Title>
                <Title level={4} type="secondary" style={{ marginTop: -10, fontWeight: 400 }}>
                  {details.title.split(' / ')[1]}
                </Title>
              </div>

              <div className={styles.specsGrid}>
                {details.specs.map((item, index) => (
                  <div key={index} className={styles.specItem}>
                    <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>{item.label}</Text>
                    <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>{item.value}</Text>
                  </div>
                ))}
              </div>

              <Divider />

              <div>
                <Title level={5}><EnvironmentOutlined /> 项目简介</Title>
                <Paragraph style={{ fontSize: '15px', lineHeight: '1.8', textAlign: 'justify' }}>
                  {details.introZh}
                </Paragraph>
                <Paragraph type="secondary" style={{ fontSize: '13px', lineHeight: '1.6', fontStyle: 'italic' }}>
                  {details.introEn}
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