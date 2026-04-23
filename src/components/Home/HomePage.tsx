import React, { useRef } from 'react'
import { Card, Row, Col, Typography, Button, Tag, Carousel } from 'antd'
import {
  RocketOutlined,
  SafetyOutlined,
  MessageOutlined,
  ExperimentOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { companyInfo } from '../../data/companyInfo'
import { useAuthStore } from '../../store/authStore'
import styles from './HomePage.module.css'

const { Title, Paragraph } = Typography

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthenticated, role } = useAuthStore()
  const isMobile = window.innerWidth < 768;
  const carouselRef = useRef<any>(null);

  const bannerImages = [
    { src: '/images/banner/exterior.jpg', title: '公司外观' },
    { src: '/images/banner/factory1.jpg', title: '生产车间' },
    { src: '/images/banner/factory2.jpg', title: '加工细节' },
    { src: '/images/banner/factory3.jpg', title: '组装流水线' },
    { src: '/images/banner/aerial1.jpg', title: '工厂全景' },
    { src: '/images/banner/aerial2.jpg', title: '园区俯拍' },
    { src: '/images/banner/aerial3.jpg', title: '现代化生产基地' },
  ]

  return (
    <div className={styles.container}>
      {/* Hero Section with Carousel */}
      <div className={styles.bannerContainer}>
        {/* 左箭头按钮 */}
        <Button
          className={`${styles.arrowBtn} ${styles.arrowLeft}`}
          icon={<LeftOutlined />}
          shape="circle"
          onClick={() => carouselRef.current.prev()}
        />

        {/* 绑定 ref 到 Carousel */}
        <Carousel
          ref={carouselRef}
          autoplay
          effect="fade"
          autoplaySpeed={5000}
        >
          {bannerImages.map((img, index) => (
            <div key={index} className={styles.slideItem}>
              {/* 背景图片层 */}
              <div
                className={styles.slideImage}
                style={{ backgroundImage: `url(${img.src})` }}
              />
              {/* 文字遮罩层 - 保证文字清晰可见 */}
              <div className={styles.slideContent}>
                <div className={styles.iconWrapper}>
                  <RocketOutlined style={{ fontSize: '48px', color: '#fff' }} />
                </div>
                <Title 
                  level={isMobile ? 3 : 1} 
                  style={{ color: '#fff', margin: isMobile ? '8px 0' : '16px 0', fontSize: isMobile ? '20px' : '' }}
                >
                  欢迎来到 {companyInfo.name}
                </Title>
                <Title 
                  level={isMobile ? 5 : 3} 
                  style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 'normal', fontSize: isMobile ? '14px' : '' }}
                >
                  {companyInfo.slogan}
                </Title>
                <Paragraph 
                  style={{ 
                    color: 'rgba(255,255,255,0.8)', 
                    fontSize: isMobile ? '12px' : '18px', 
                    display: 'block', 
                    marginBottom: isMobile ? 12 : 24, 
                    lineHeight: 1.4 
                  }}
                >
                  {companyInfo.description}
                </Paragraph>
                {role === 'internal' && (
                  <Tag color="success" icon={<CheckCircleOutlined />}>
                    已登录内部账号
                  </Tag>
                )}
              </div>
            </div>
          ))}
        </Carousel>

        {/* 右箭头按钮 */}
        <Button
          className={`${styles.arrowBtn} ${styles.arrowRight}`}
          icon={<RightOutlined />}
          shape="circle"
          onClick={() => carouselRef.current.next()}
        />
      </div>

      {/* Features Section */}
      <Row gutter={[24, 24]} className={styles.features}>
        {/* 智能咨询卡片 */}
        <Col 
          xs={24} 
          md={isAuthenticated && role !== 'external' ? 12 : 24} 
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <Card
            className={styles.featureCard}
            hoverable
          >
            <div className={styles.featureContent}>
              <MessageOutlined className={styles.featureIcon} />
              <Title level={4}>智能咨询</Title>
              <Paragraph type="secondary">了解公司产品、服务、联系方式等信息</Paragraph>
              <Button
                type="primary"
                size="large"
                onClick={() => navigate('/public-chat')}
                icon={<ArrowRightOutlined />}
              >
                开始咨询 / Start Chat
              </Button>
            </div>
          </Card>
        </Col>
        
        {/* 只有内部员工登录后才能看到成分分析卡片 */}
        {isAuthenticated && role !== 'external' && (
          <Col xs={24} md={12}>
            <Card
              className={styles.featureCard}
              hoverable
            >
              <div className={styles.featureContent}>
                <ExperimentOutlined className={styles.featureIcon} />
                <Title level={4}>成分分析</Title>
                <Paragraph type="secondary">AI辅助分析物品材料成分（内部专用）</Paragraph>
                <Tag color="warning" style={{ marginBottom: 16 }}>
                  内部专用
                </Tag>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => navigate('/analysis')}
                  icon={<ArrowRightOutlined />}
                >
                  成分分析 / Material Analysis
                </Button>
              </div>
            </Card>
          </Col>
        )}
      </Row>

      {/* Company Info Section */}
      <Card className={styles.infoCard}>
        <Title level={4}>公司概况</Title>
        <Row gutter={[48, 24]}>
          <Col xs={24} sm={8}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{companyInfo.founded}</div>
              <div className={styles.statLabel}>成立时间</div>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{companyInfo.employees}</div>
              <div className={styles.statLabel}>员工规模</div>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>5+</div>
              <div className={styles.statLabel}>核心产品</div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Products Section */}
      <div className={styles.section}>
        <Title level={4}>核心产品</Title>
        <Row gutter={[16, 16]}>
          {companyInfo.products.map((product) => (
            <Col xs={24} sm={12} lg={6} key={product.id}>
              <Card 
                className={styles.productCard} 
                hoverable
                onClick={() => navigate(`/product/${product.id}`)} // 点击跳转
              >
                <div className={styles.productIcon}>{product.icon}</div>
                <div className={styles.productName}>{product.name}</div>
                <div className={styles.productSlogan}>{product.slogan}</div>
                <div className={styles.productDesc}>{product.description}</div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Supporting Services Section */}
      <div className={styles.section}>
        <Title level={4}>配套与定制服务</Title>
        <Row gutter={[16, 16]}>
          {companyInfo.supportingServices?.map((service, index) => (
            <Col xs={24} sm={12} key={index}>
              <Card className={styles.serviceCard} hoverable>
                <div className={styles.serviceIcon}>{service.icon}</div>
                <div className={styles.serviceName}>{service.name}</div>
                <div className={styles.serviceDesc}>{service.description}</div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  )
}

export default HomePage