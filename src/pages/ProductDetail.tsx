import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, Typography, Space, Divider } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { companyInfo } from '../data/companyInfo';
import styles from './ProductDetail.module.css';

const { Title, Text, Paragraph } = Typography;

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = companyInfo.products.find(p => p.id === id);

  if (!product) return <div>未找到该产品信息</div>;

  const { detailInfo } = product;

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>
        返回首页
      </Button>
      
      <Card className={styles.detailCard}>
        <Title level={2}>{detailInfo.title}</Title>
        
        <Row gutter={[24, 24]}>
          {/* 左侧大图 */}
          <Col xs={24} md={14}>
            <img src={detailInfo.images[0]} alt="project" style={{ width: '100%', borderRadius: '8px' }} />
          </Col>
          
          {/* 右侧参数和介绍 */}
          <Col xs={24} md={10}>
            <div className={styles.statsBox}>
              {detailInfo.stats.map((item, index) => (
                <div key={index} style={{ marginBottom: '12px' }}>
                  <Text strong style={{ fontSize: '16px' }}>{item.label}：</Text>
                  <Text style={{ fontSize: '16px' }}>{item.value}</Text>
                </div>
              ))}
            </div>
            <Divider />
            <Paragraph style={{ fontSize: '15px' }}>{detailInfo.descZh}</Paragraph>
            <Paragraph type="secondary" style={{ fontSize: '14px' }}>{detailInfo.descEn}</Paragraph>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ProductDetail;