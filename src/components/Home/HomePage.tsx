import React, { useRef } from 'react'
import KeepAlive from 'react-activation' // 💡 引入 KeepAlive
import { Card, Row, Col, Typography, Button, Tag, Carousel, Image } from 'antd'
import {
  RocketOutlined,
  SafetyOutlined,
  MessageOutlined,
  ExperimentOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  LeftOutlined,
  RightOutlined,
  GlobalOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { companyInfo } from '../../data/companyInfo'
import { useAuthStore } from '../../store/authStore'
import styles from './HomePage.module.css'

const { Title, Paragraph } = Typography

// 💡 【优化】将静态资源数组移到组件外部，防止重新定义
const bannerImages = [
  { src: '/images/banner/exterior.jpg', title: '公司外观' },
  { src: '/images/banner/factory1.jpg', title: '生产车间' },
  { src: '/images/banner/factory2.jpg', title: '加工细节' },
  { src: '/images/banner/factory3.jpg', title: '组装流水线' },
  { src: '/images/banner/aerial1.jpg', title: '工厂全景' },
  { src: '/images/banner/aerial2.jpg', title: '园区俯拍' },
  { src: '/images/banner/aerial3.jpg', title: '现代化生产基地' },
]

const HomePageContent: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthenticated, role } = useAuthStore()
  const { i18n, t } = useTranslation()
  const isMobile = window.innerWidth < 768;
  const carouselRef = useRef<any>(null);
  const currentLang = (i18n.language.startsWith('zh') ? 'zh' : 'en') as 'zh' | 'en';

  const toggleLanguage = () => {
    i18n.changeLanguage(currentLang === 'zh' ? 'en' : 'zh');
  };

  // 💡 【修复】把指纹打印移到这里！
  console.log("HomePage Version: [Perf-Optimized-V4]");

  return (
    <div className={styles.container}>
      <Button icon={<GlobalOutlined />} onClick={toggleLanguage} style={{ marginBottom: 20 }}>
        {currentLang === 'zh' ? 'Switch to English' : '切换至中文'}
      </Button>

      <div className={styles.bannerContainer}>

        <Image.PreviewGroup>
          <Carousel
            ref={carouselRef} // 💡 绑定 Ref
            autoplay
            effect="fade"
            autoplaySpeed={5000}
            arrows={false} // 💡 彻底关闭自带箭头，解决4个箭头的重影
            dots={true}
            className={styles.homeCarousel}
          >
            {bannerImages.map((img, index) => (
              <div key={index} className={styles.carouselItem}>
                <Image
                  src={img.src}
                  alt={`banner-${index}`}
                  className={styles.bannerImage}
                  preview={{ mask: null }} // 去掉默认遮罩
                />
                <div className={styles.carouselContent} style={{ pointerEvents: 'none' }}>
                   <div className={styles.textWrapper}>
                      <div className={styles.iconWrapper}>
                        <RocketOutlined style={{ fontSize: '48px', color: '#fff' }} />
                      </div>
                      <Title level={isMobile ? 3 : 1} style={{ color: '#fff', margin: isMobile ? '8px 0' : '16px 0' }}>
                        {t('welcome_prefix')} {companyInfo.name[currentLang]}
                      </Title>
                      <Title level={isMobile ? 5 : 3} style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 'normal' }}>
                        {companyInfo.slogan[currentLang]}
                      </Title>
                      <Paragraph style={{ color: 'rgba(255,255,255,0.8)', fontSize: isMobile ? '12px' : '18px' }}>
                        {companyInfo.description[currentLang]}
                      </Paragraph>
                   </div>
                </div>
              </div>
            ))}
          </Carousel>
        </Image.PreviewGroup>

        {/* 💡 2. 手动编写两个完全独立的按钮，放在 Carousel 外面 */}
        <div className={styles.customPrevBtn} onClick={() => carouselRef.current.prev()}>
          <LeftOutlined />
        </div>
        <div className={styles.customNextBtn} onClick={() => carouselRef.current.next()}>
          <RightOutlined />
        </div>
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
              <Title level={4}>{t('ai_consult_title')}</Title>
              <Paragraph type="secondary">{t('ai_consult_desc')}</Paragraph>
              <Button
                type="primary"
                size="large"
                onClick={() => navigate('/public-chat')}
                icon={<ArrowRightOutlined />}
              >
                {t('start_chat_btn')}
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
      <Title level={3} style={{ marginTop: 40, marginBottom: 20 }}>
        {t('company_overview')}
      </Title>
      
      <Card className={styles.infoCard} bordered={false}>
        <Row gutter={[48, 24]}>
          <Col xs={24} sm={8}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{companyInfo.founded[currentLang]}</div>
              <div className={styles.statLabel}>{t('founded_label')}</div>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{companyInfo.employees[currentLang]}</div>
              <div className={styles.statLabel}>{t('employees_label')}</div>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>5+</div>
              <div className={styles.statLabel}>{t('core_products_label')}</div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Products Section */}
      <div className={styles.section}>
        <Title level={4} id="products-section">{t('core_products_label')}</Title>
        <Row gutter={[16, 16]}>
          {companyInfo.categories.map((cat) => (
            <Col xs={24} sm={12} lg={6} key={cat.id}>
              <Card
                className={styles.productCard}
                hoverable
                onClick={() => navigate(`/category/${cat.id}`)}
              >
                <div className={styles.productIcon}>{cat.icon}</div>
                <div className={styles.productName}>{cat.name[currentLang]}</div>
                <div className={styles.productSlogan}>{cat.description ? cat.description[currentLang] : ""}</div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Supporting Services Section */}
      <div className={styles.section}>
        <Title level={4}>{t('supporting_services')}</Title>
        <Row gutter={[16, 16]}>
          {companyInfo.supportingServices?.map((service, index) => (
            <Col xs={24} sm={12} key={index}>
              <Card className={styles.serviceCard} hoverable>
                <div className={styles.serviceIcon}>{service.icon}</div>
                <div className={styles.serviceName}>{service.name[currentLang]}</div>
                <div className={styles.serviceDesc}>{service.description[currentLang]}</div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  )
}

// 💡 导出时使用 KeepAlive 包裹
const HomePage = () => (
  <KeepAlive cacheKey="HomePage" saveScrollPosition="screen">
    <HomePageContent />
  </KeepAlive>
)

export default HomePage