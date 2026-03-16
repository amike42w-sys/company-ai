import type React from 'react'
import { useAuthStore, UserRole } from '../../store/authStore'
import { Alert, Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: UserRole[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = ['internal'] 
}) => {
  const { isAuthenticated, hasPermission } = useAuthStore()
  const navigate = useNavigate()

  // 未登录
  if (!isAuthenticated) {
    return (
      <Result
        status="403"
        title="访问受限"
        subTitle="此功能仅限内部员工使用，请先登录"
        extra={[
          <Button type="primary" key="login" onClick={() => navigate('/login')}>
            去登录
          </Button>,
          <Button key="home" onClick={() => navigate('/')}>
            返回首页
          </Button>,
        ]}
      />
    )
  }

  // 已登录但无权限
  if (!hasPermission(requiredRoles)) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          message="权限不足"
          description="您没有访问此功能的权限"
          type="error"
          showIcon
          action={
            <Button onClick={() => navigate('/')}>
              返回首页
            </Button>
          }
        />
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute