import React, { useState, useEffect, useCallback } from 'react'
import { Card, Form, Input, Button, Alert, Typography, Space, Tabs, Divider, Progress, Tooltip, message } from 'antd'
import { UserOutlined, LockOutlined, SafetyOutlined, CustomerServiceOutlined, MailOutlined, PhoneOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import styles from './Login.module.css'

const { Title, Text } = Typography
const { TabPane } = Tabs

const Login: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login, register } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [activeTab, setActiveTab] = useState('external')
  const [subTab, setSubTab] = useState('login')

  // 根据URL参数设置默认标签页
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'internal') {
      setActiveTab('internal')
    } else if (tab === 'external') {
      setActiveTab('external')
    }
  }, [searchParams])

  const [loginForm] = Form.useForm()
  const [registerForm] = Form.useForm()
  const [resetForm] = Form.useForm()
  const [internalForm] = Form.useForm()
  
  // 密码强度状态
  const [passwordStrength, setPasswordStrength] = useState<{ percent: number; text: string; color: string } | null>(null)
  
  // 使用useCallback避免重复创建函数
  const calculatePasswordStrength = useCallback((password: string) => {
    // 密码为空时隐藏强度条
    if (!password || password.length === 0) {
      setPasswordStrength(null)
      return
    }
    
    if (password.length < 6) {
      setPasswordStrength({ percent: 30, text: '弱', color: '#fa541c' })
      return
    }
    
    let strength = 0
    if (password.length >= 6) strength += 20
    if (password.length >= 8) strength += 20
    if (/[a-z]/.test(password)) strength += 15
    if (/[A-Z]/.test(password)) strength += 15
    if (/[0-9]/.test(password)) strength += 15
    if (/[^a-zA-Z0-9]/.test(password)) strength += 15
    
    const percent = Math.min(strength, 100)
    
    if (percent < 40) {
      setPasswordStrength({ percent, text: '弱', color: '#fa541c' })
    } else if (percent < 70) {
      setPasswordStrength({ percent, text: '中', color: '#faad14' })
    } else {
      setPasswordStrength({ percent, text: '强', color: '#52c41a' })
    }
  }, [])

  // 内部员工登录
  const handleInternalLogin = async (values: { username: string; password: string }) => {
    setLoading(true)
    setError('')
    
    const success = await login(values.username, values.password)
    
    if (success) {
      const { role } = useAuthStore.getState()
      if (role === 'internal') {
        navigate('/analysis')
      } else if (role === 'certificate_admin' || role === 'certificate_viewer') {
        navigate('/certificates')
      } else {
        navigate('/')
      }
    } else {
      const errorMsg = '用户名或密码错误'
      setError(errorMsg)
      // 两秒后自动清除错误消息
      setTimeout(() => {
        const alertElement = document.querySelector('.ant-alert-error') as HTMLElement
        if (alertElement) {
          alertElement.style.opacity = '0'
          setTimeout(() => {
            setError('')
          }, 500)
        } else {
          setError('')
        }
      }, 2000)
    }
    
    setLoading(false)
  }

  // 外部用户登录
  const handleExternalLogin = async (values: { username: string; password: string }) => {
    setLoading(true)
    setError('')
    
    const success = await login(values.username, values.password)
    
    if (success) {
      navigate('/public-chat')
    } else {
      const errorMsg = '用户名或密码错误'
      setError(errorMsg)
      // 两秒后自动清除错误消息
      setTimeout(() => {
        const alertElement = document.querySelector('.ant-alert-error') as HTMLElement
        if (alertElement) {
          alertElement.style.opacity = '0'
          setTimeout(() => {
            setError('')
          }, 500)
        } else {
          setError('')
        }
      }, 2000)
    }
    
    setLoading(false)
  }

  // 外部用户注册
  const handleRegister = async (values: { username: string; password: string; email?: string; phone?: string; confirmPassword?: string }) => {
    setLoading(true)
    setError('')
    setSuccessMsg('')
    
    console.log('表单提交值:', values)
    console.log('密码长度:', values.password?.length)
    console.log('确认密码:', values.confirmPassword)
    console.log('密码是否一致:', values.password === values.confirmPassword)
    
    const result = await register(values.username, values.password, values.email, values.phone)
    
    if (result.success) {
      setSuccessMsg('注册成功！请使用您的账号密码登录')
      // 清空注册表单
      registerForm.resetFields()
      // 切换到登录标签页
      setSubTab('login')
    } else {
      setError(result.message)
    }
    
    setLoading(false)
  }

  // 发送重置密码验证码
  const sendResetCode = async () => {
    // 获取所有字段值
    const values = resetForm.getFieldsValue()
    
    let contact, type
    
    if (values.email) {
      contact = values.email
      type = '邮箱'
    } else if (values.phone) {
      contact = values.phone
      type = '手机'
    } else {
      // 尝试直接从DOM获取输入值
      const phoneInput = document.querySelector('input[placeholder="手机号"]') as HTMLInputElement
      const emailInput = document.querySelector('input[placeholder="邮箱"]') as HTMLInputElement
      
      if (phoneInput && phoneInput.value) {
        contact = phoneInput.value
        type = '手机'
      } else if (emailInput && emailInput.value) {
        contact = emailInput.value
        type = '邮箱'
      } else {
        message.error('请先输入邮箱或手机号')
        return
      }
    }
    
    setLoading(true)
    try {
      // 模拟发送验证码
      await new Promise(resolve => setTimeout(resolve, 1000))
      message.success(`验证码已发送到您的${type}`)
      console.log(`向 ${contact} 发送重置密码验证码`)
    } catch (error) {
      message.error('发送验证码失败')
    } finally {
      setLoading(false)
    }
  }

  // 处理密码重置
  const handlePasswordReset = async (values: any) => {
    setLoading(true)
    setError('')
    
    try {
      // 简单的验证码验证
      if (values.verificationCode !== '123456') {
        setError('验证码错误')
        return
      }
      
      // 模拟密码重置过程
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 密码重置成功
      message.success('密码重置成功，请使用新密码登录')
      setActiveTab('external')
    } catch (error) {
      setError('密码重置失败，请稍后再试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <SafetyOutlined className={styles.icon} />
          <Title level={3} className={styles.title}>账号登录</Title>
          <Text type="secondary">外部客户可注册账号保存聊天记录</Text>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ 
              marginBottom: 24,
              transition: 'opacity 0.5s ease-out'
            }}
          />
        )}

        {successMsg && (
          <Alert
            message={successMsg}
            type="success"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          centered
          className={styles.tabs}
        >
          <TabPane 
            tab={<span><CustomerServiceOutlined /> 外部客户</span>} 
            key="external"
          >
            <Tabs activeKey={subTab} onChange={setSubTab} centered size="small">
              <TabPane tab="登录" key="login">
                <Form
                  name="external-login"
                  onFinish={handleExternalLogin}
                  autoComplete="off"
                  size="large"
                  form={loginForm}
                >
                  <Form.Item
                    name="username"
                    rules={[{ required: true, message: '请输入用户名' }]}
                  >
                    <Input 
                      prefix={<UserOutlined />} 
                      placeholder="用户名"
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    rules={[{ required: true, message: '请输入密码' }]}
                  >
                    <Input.Password 
                      prefix={<LockOutlined />} 
                      placeholder="密码"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={loading}
                      block
                      size="large"
                    >
                      登录
                    </Button>
                    <div style={{ marginTop: 12, textAlign: 'right' }}>
                      <a href="#" onClick={(e) => {
                        e.preventDefault()
                        setSubTab('reset')
                      }}>忘记密码？</a>
                    </div>
                  </Form.Item>
                </Form>
              </TabPane>
              
              <TabPane tab="注册" key="register">
                <Form
                  name="external-register"
                  onFinish={handleRegister}
                  autoComplete="off"
                  size="large"
                  form={registerForm}
                >
                  <Form.Item
                    name="username"
                    rules={[
                      { required: true, message: '请输入用户名' },
                      { min: 3, message: '用户名至少3个字符' },
                      { max: 20, message: '用户名最多20个字符' },
                    ]}
                  >
                    <Input 
                      prefix={<UserOutlined />} 
                      placeholder="用户名"
                    />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    rules={[
                      { type: 'email', message: '请输入有效的邮箱地址' },
                    ]}
                  >
                    <Input 
                      prefix={<MailOutlined />} 
                      placeholder="邮箱（可选）"
                    />
                  </Form.Item>

                  <Form.Item
                    name="phone"
                    rules={[
                      { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
                    ]}
                  >
                    <Input 
                      prefix={<PhoneOutlined />} 
                      placeholder="手机号（可选）"
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    rules={[
                      { required: true, message: '请输入密码' },
                      { min: 6, message: '密码至少6个字符' },
                    ]}
                    validateTrigger={['blur']}
                  >
                    <Input.Password 
                      prefix={<LockOutlined />} 
                      placeholder="密码"
                      onChange={(e) => calculatePasswordStrength(e.target.value)}
                    />
                  </Form.Item>
                  
                  {passwordStrength && (
                    <div style={{ marginTop: -16, marginBottom: 16, paddingLeft: 4 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>密码强度</Text>
                        <Text style={{ 
                          color: passwordStrength.color, 
                          fontWeight: 'bold',
                          fontSize: 12 
                        }}>
                          {passwordStrength.text}
                        </Text>
                      </div>
                      <Progress 
                        percent={passwordStrength.percent} 
                        size="small" 
                        strokeColor={passwordStrength.color}
                        showInfo={false}
                      />
                      {passwordStrength.percent < 70 && (
                        <Tooltip title="建议使用8位以上密码，包含数字、大小写字母和特殊字符">
                          <div style={{ display: 'flex', alignItems: 'center', marginTop: 4, fontSize: 12, color: passwordStrength.color }}>
                            <ExclamationCircleOutlined style={{ marginRight: 4 }} />
                            <Text type="danger">建议使用更复杂的密码</Text>
                          </div>
                        </Tooltip>
                      )}
                    </div>
                  )}

                  <Form.Item
                    name="confirmPassword"
                    validateTrigger={['blur']}
                    rules={[
                      { required: true, message: '请确认密码' },
                      {
                        validator(_, value) {
                          const form = registerForm.getFieldsValue()
                          const password = form.password
                          console.log('验证密码:', password, '确认密码:', value)
                          console.log('密码长度:', password?.length)
                          console.log('密码是否一致:', password === value)
                          if (!value || password === value) {
                            return Promise.resolve()
                          }
                          return Promise.reject(new Error('两次输入的密码不一致'))
                        }
                      },
                    ]}
                  >
                    <Input.Password 
                      prefix={<LockOutlined />} 
                      placeholder="确认密码"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={loading}
                      block
                      size="large"
                    >
                      注册
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>

              <TabPane tab="忘记密码" key="reset">
                <Form
                  name="external-reset-password"
                  layout="vertical"
                  onFinish={handlePasswordReset}
                  autoComplete="off"
                  size="large"
                  form={resetForm}
                >
                  <Tabs defaultActiveKey="email" size="small" style={{ marginBottom: 16 }}>
                    <TabPane tab="邮箱找回" key="email">
                      <Form.Item
                        name="email"
                        rules={[
                          () => ({
                            validator(_, value) {
                              // 只有在邮箱找回标签页时才要求邮箱
                              const currentTab = document.querySelector('.ant-tabs-tab.ant-tabs-tab-active')?.getAttribute('aria-controls')
                              if (currentTab?.includes('email') && !value) {
                                return Promise.reject(new Error('请输入邮箱'))
                              }
                              if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                                return Promise.reject(new Error('请输入有效的邮箱地址'))
                              }
                              return Promise.resolve()
                            },
                          }),
                        ]}
                      >
                        <Input 
                          prefix={<MailOutlined />} 
                          placeholder="邮箱"
                        />
                      </Form.Item>

                      <Form.Item
                        name="verificationCode"
                        rules={[
                          { required: true, message: '请输入验证码' },
                        ]}
                      >
                        <Input 
                          prefix={<SafetyOutlined />} 
                          placeholder="验证码"
                          addonAfter={
                            <Button 
                              type="link" 
                              onClick={sendResetCode}
                              disabled={loading}
                            >
                              发送验证码
                            </Button>
                          }
                        />
                      </Form.Item>
                    </TabPane>
                    <TabPane tab="手机找回" key="phone">
                      <Form.Item
                        name="phone"
                        rules={[
                          () => ({
                            validator(_, value) {
                              // 只有在手机找回标签页时才要求手机号
                              const currentTab = document.querySelector('.ant-tabs-tab.ant-tabs-tab-active')?.getAttribute('aria-controls')
                              if (currentTab?.includes('phone') && !value) {
                                return Promise.reject(new Error('请输入手机号'))
                              }
                              if (value && !/^1[3-9]\d{9}$/.test(value)) {
                                return Promise.reject(new Error('请输入有效的手机号'))
                              }
                              return Promise.resolve()
                            },
                          }),
                        ]}
                      >
                        <Input 
                          prefix={<PhoneOutlined />} 
                          placeholder="手机号"
                        />
                      </Form.Item>

                      <Form.Item
                        name="verificationCode"
                        rules={[
                          { required: true, message: '请输入验证码' },
                        ]}
                      >
                        <Input 
                          prefix={<SafetyOutlined />} 
                          placeholder="验证码"
                          addonAfter={
                            <Button 
                              type="link" 
                              onClick={sendResetCode}
                              disabled={loading}
                            >
                              发送验证码
                            </Button>
                          }
                        />
                      </Form.Item>
                    </TabPane>
                  </Tabs>

                  <Form.Item
                    name="newPassword"
                    rules={[
                      { required: true, message: '请输入新密码' },
                      { min: 6, message: '密码至少6个字符' },
                    ]}
                  >
                    <Input.Password 
                      prefix={<LockOutlined />} 
                      placeholder="新密码"
                    />
                  </Form.Item>

                  <Form.Item
                    name="confirmPassword"
                    dependencies={['newPassword']}
                    rules={[
                      { required: true, message: '请确认密码' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newPassword') === value) {
                            return Promise.resolve()
                          }
                          return Promise.reject(new Error('两次输入的密码不一致'))
                        },
                      }),
                    ]}
                  >
                    <Input.Password 
                      prefix={<LockOutlined />} 
                      placeholder="确认密码"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      block
                      size="large"
                    >
                      重置密码
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>
            </Tabs>
            
            <div className={styles.benefits}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                注册账号后可享受：
              </Text>
              <ul style={{ fontSize: 12, color: '#8c8c8c', paddingLeft: 16, marginTop: 8 }}>
                <li>保存聊天记录，随时查看</li>
                <li>AI记住上下文，对话更连贯</li>
                <li>多设备同步历史记录</li>
              </ul>
            </div>
          </TabPane>



          <TabPane 
            tab={<span><SafetyOutlined /> 内部员工</span>} 
            key="internal"
          >
            <Form
              name="internal-login"
              onFinish={handleInternalLogin}
              autoComplete="off"
              size="large"
              form={internalForm}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="用户名"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="密码"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                >
                  登录
                </Button>
                <div style={{ marginTop: 12, textAlign: 'right' }}>
                  <a href="#" onClick={(e) => {
                    e.preventDefault()
                    setActiveTab('external')
                    setSubTab('reset')
                  }}>忘记密码？</a>
                </div>
              </Form.Item>
            </Form>

            <div className={styles.demoAccounts}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                测试账号：
              </Text>
              <Space direction="vertical" size="small" style={{ marginTop: 8 }}>
                <Text code style={{ fontSize: 11 }}>admin / admin123</Text>
                <Text code style={{ fontSize: 11 }}>analyst / analyst123</Text>
                <Text code style={{ fontSize: 11 }}>engineer / engineer123</Text>
              </Space>
            </div>
          </TabPane>
        </Tabs>

        <Divider />

        <Button 
          type="link" 
          block 
          onClick={() => navigate('/public-chat')}
          style={{ marginBottom: 8 }}
        >
          暂不登录，直接咨询
        </Button>
        
        <Button 
          type="link" 
          block 
          onClick={() => navigate('/')}
        >
          返回首页
        </Button>
      </Card>
    </div>
  )
}

export default Login
