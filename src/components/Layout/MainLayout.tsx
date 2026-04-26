import React from 'react'
import { Layout, Menu, Button, Avatar, Dropdown, Badge, Space } from 'antd'
import type { MenuProps } from 'antd'
import { 
  HomeOutlined, 
  MessageOutlined, 
  ExperimentOutlined, 
  LoginOutlined, 
  LogoutOutlined,
  UserOutlined,
  SafetyOutlined,
  CustomerServiceOutlined,
  TeamOutlined,
  DollarOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../store/authStore'
import LanguageSwitcher from './LanguageSwitcher'
import styles from './MainLayout.module.css'

const { Header, Content, Sider } = Layout

const MainLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, role, logout } = useAuthStore()
  const { t } = useTranslation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const userMenuItems: MenuProps['items'] =[
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: t('profile'),
      onClick: () => navigate('/profile'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('logout'),
      danger: true,
      onClick: handleLogout,
    },
  ]

  // 根据权限生成菜单
  const getMenuItems = () => {
    const items: any[] =[
      {
        key: '/',
        icon: <HomeOutlined />,
        label: t('menu_home'),
      },
      {
        key: '/public-chat',
        icon: <MessageOutlined />,
        label: t('menu_chat'),
      },
    ]

    if (role === 'internal') {
      items.push({ 
        key: '/analysis',
        icon: <ExperimentOutlined />,
        label: t('menu_analysis'),
      })
    }
    
    if (role === 'internal' || role === 'certificate_admin' || role === 'certificate_viewer') {
      items.push({ 
        key: 'supplier',
        icon: <BankOutlined />,
        label: t('menu_supplier'),
        children:[
          {
            key: '/suppliers',
            icon: <BankOutlined />,
            label: t('menu_supplier_list'),
          },
          {
            key: '/supplier-certificates',
            icon: <SafetyCertificateOutlined />,
            label: t('menu_cert'),
          },
        ],
      })
    }
    
    if (role === 'internal') {
      items.push({ 
        key: '/customers',
        icon: <CustomerServiceOutlined />,
        label: t('menu_customers'),
      })
      items.push({ 
        key: '/employees',
        icon: <TeamOutlined />,
        label: t('menu_employees'),
      })
      items.push({ 
        key: '/quotations',
        icon: <DollarOutlined />,
        label: t('menu_quotations'),
      })
      items.push({ 
        key: '/chat-monitor',
        icon: <EyeOutlined />,
        label: t('menu_monitor'),
      })
    }

    return items
  }

  const menuItems = getMenuItems()

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.logo}>
          <SafetyOutlined className={styles.logoIcon} />
          <span className={styles.logoText}>
            <span className={styles.fullText}>{t('app_name')}智能助手</span>
            <span className={styles.shortText}>{t('app_name')}</span>
          </span>
          {(role === 'internal' || role === 'certificate_admin' || role === 'certificate_viewer') && (
            <Badge 
              count={t('internal_badge')} 
              color="#2f54eb" 
              className={styles.internalBadge} 
              style={{ marginLeft: 4, boxShadow: 'none', scale: '0.8' }}
            />
          )}
        </div>
        <div className={styles.headerRight}>
          <LanguageSwitcher />
          {isAuthenticated ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <div className={styles.userInfo}>
                <Avatar src={user?.avatar} icon={<UserOutlined />} style={{ backgroundColor: '#2f54eb' }} />
                <span className={styles.username}>{user?.username}</span>
              </div>
            </Dropdown>
          ) : (
            <Space size={window.innerWidth < 768 ? 4 : 8}>
              <Button 
                type="default" 
                icon={<CustomerServiceOutlined />} 
                onClick={() => navigate('/login')} 
                className={styles.navBtn} 
              >
                <span className={styles.btnText}>{t('login_client')}</span>
                <span className={styles.mobileBtnLabel}>{t('btn_client_short')}</span>
              </Button>
              <Button 
                type="primary" 
                icon={<LoginOutlined />} 
                onClick={() => navigate('/login?tab=internal')} 
                className={styles.navBtn} 
              >
                <span className={styles.btnText}>{t('login_staff')}</span>
                <span className={styles.mobileBtnLabel}>{t('btn_internal_short')}</span>
              </Button>
            </Space>
          )}
        </div>
      </Header>
      <Layout className={styles.contentLayout}>
        <Sider width={220} className={styles.sider}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            defaultOpenKeys={['supplier']}
            style={{ height: '100%', borderRight: 0, padding: '12px 0' }}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
          />
        </Sider>
        <Content className={styles.content}>
          <div className="fade-in">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout