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
} from '@ant-design/icons'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import styles from './MainLayout.module.css'

const { Header, Content, Sider } = Layout

const MainLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, role, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const userMenuItems: MenuProps['items'] =[
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
      onClick: () => navigate('/profile'),
    },
    {
      type: 'divider', // 增加一条分割线，更精致
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true, // 退出按钮变成红色警示，细节拉满
      onClick: handleLogout,
    },
  ]

  // 根据权限生成菜单
  const getMenuItems = () => {
    const items: any[] =[
      {
        key: '/',
        icon: <HomeOutlined />,
        label: '首页',
      },
      {
        key: '/public-chat',
        icon: <MessageOutlined />,
        label: '公司咨询',
      },
    ]

    if (role === 'internal') {
      items.push({ 
        key: '/analysis',
        icon: <ExperimentOutlined />,
        label: '成分分析',
      })
    }
    
    if (role === 'internal' || role === 'certificate_admin' || role === 'certificate_viewer') {
      items.push({ 
        key: 'supplier',
        icon: <BankOutlined />,
        label: '供应商管理',
        children:[
          {
            key: '/suppliers',
            icon: <BankOutlined />,
            label: '供应商列表',
          },
          {
            key: '/supplier-certificates',
            icon: <SafetyCertificateOutlined />,
            label: '证书管理',
          },
        ],
      })
    }
    
    if (role === 'internal') {
      items.push({ 
        key: '/customers',
        icon: <CustomerServiceOutlined />,
        label: '客户管理',
      })
      items.push({ 
        key: '/employees',
        icon: <TeamOutlined />,
        label: '员工管理',
      })
      items.push({ 
        key: '/quotations',
        icon: <DollarOutlined />,
        label: '报价管理',
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
          <span className={styles.logoText}>公司AI智能助手</span>
          {(role === 'internal' || role === 'certificate_admin' || role === 'certificate_viewer') && (
            <Badge 
              count="内部版" 
              color="#2f54eb" // 标签颜色也换成高级的蓝色
              style={{ marginLeft: 8, boxShadow: 'none' }}
            />
          )}
        </div>
        <div className={styles.headerRight}>
          {isAuthenticated ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <div className={styles.userInfo}>
                <Avatar src={user?.avatar} icon={<UserOutlined />} style={{ backgroundColor: '#2f54eb' }} />
                <span className={styles.username}>{user?.username}</span>
              </div>
            </Dropdown>
          ) : (
            <Space>
              <Button 
                type="default"
                icon={<CustomerServiceOutlined />}
                onClick={() => navigate('/login')}
              >
                客户登录
              </Button>
              <Button 
                type="primary" 
                icon={<LoginOutlined />}
                onClick={() => navigate('/login?tab=internal')}
              >
                内部登录
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