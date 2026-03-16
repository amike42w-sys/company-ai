import React from 'react'
import { Card, Row, Col, Typography, Button, Tag } from 'antd'
import {
  RocketOutlined,
  SafetyOutlined,
  MessageOutlined,
  ExperimentOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { companyInfo } from '../../data/companyInfo'
import { useAuthStore } from '../../store/authStore'
import styles from './HomePage.module.css'

const { Title, Paragraph } = Typography

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthenticated, role } = useAuthStore()

  const features = [
    {
      icon: <MessageOutlined className={styles.featureIcon} />,
      title: '智能咨询',
      desc: '了解公司产品、服务、联系方式等信息',
      action: () => navigate('/public-chat'),
      btnText: '开始咨询',
      public: true,
    },
    {
      icon: <ExperimentOutlined className={styles.featureIcon} />,
      title: '成分分析',
      desc: 'AI辅助分析物品材料成分（内部专用）',
      action: () => navigate(isAuthenticated ? '/analysis' : '/login?tab=internal'),
      btnText: isAuthenticated ? '进入分析' : '内部登录',
      public: false,
    },
  ]

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <RocketOutlined className={styles.heroIcon} />
        <Title level={2} className={styles.heroTitle}>
          欢迎来到 {companyInfo.name}
        </Title>
        <Paragraph className={styles.heroSubtitle}>
          {companyInfo.slogan}
        </Paragraph>
        <Paragraph className={styles.heroDesc}>
          {companyInfo.description}
        </Paragraph>
        
        {role === 'internal' && (
          <Tag color="success" icon={<SafetyOutlined />} className={styles.internalTag}>
            已登录内部账号
          </Tag>
        )}
      </div>

      {/* Features Section */}
      <Row gutter={[24, 24]} className={styles.features}>
        {features.map((feature, index) => (
          <Col xs={24} md={12} key={index}>
            <Card
              className={styles.featureCard}
              hoverable
            >
              <div className={styles.featureContent}>
                {feature.icon}
                <Title level={4}>{feature.title}</Title>
                <Paragraph type="secondary">{feature.desc}</Paragraph>
                {!feature.public && (
                  <Tag color="warning" style={{ marginBottom: 16 }}>
                    内部专用
                  </Tag>
                )}
                <Button
                  type="primary"
                  size="large"
                  onClick={feature.action}
                  icon={<ArrowRightOutlined />}
                >
                  {feature.btnText}
                </Button>
              </div>
            </Card>
          </Col>
        ))}
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
          {companyInfo.products.map((product, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card className={styles.productCard} hoverable>
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