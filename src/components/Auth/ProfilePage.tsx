import React, { useState, useEffect } from 'react'
import { Card, Form, Input, Button, Alert, Typography, Avatar, Space, Divider, message } from 'antd'
import { UserOutlined, MailOutlined, PhoneOutlined, SaveOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import styles from './Login.module.css'

const { Title, Text } = Typography

const ProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const { user, logout, updateProfile, sendVerificationEmail, verifyEmail } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [showVerification, setShowVerification] = useState(false)
  const [form] = Form.useForm()

  // 初始化表单数据
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email || '',
        phone: user.phone || '',
      })
    }
  }, [user, form])

  // 处理表单提交
  const handleSubmit = async (values: { username: string; email: string; phone: string; currentPassword: string; newPassword: string }) => {
    setLoading(true)
    setSuccessMsg('')

    try {
      if (!user) {
        throw new Error('用户信息不存在')
      }

      // 准备更新数据
      const updateData: { email?: string; phone?: string; password?: string } = {
        email: values.email || undefined,
        phone: values.phone || undefined,
      }

      // 如果提供了新密码，添加到更新数据中
      if (values.newPassword) {
        updateData.password = values.newPassword
      }

      // 调用更新接口
      const result = await updateProfile(user.id, updateData)

      if (result.success) {
        // 显示成功消息
        message.success(result.message)
        setSuccessMsg(result.message)
      } else {
        message.error(result.message)
      }
    } catch (error) {
      message.error('更新失败，请稍后再试')
    } finally {
      setLoading(false)
    }
  }

  // 处理退出登录
  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <UserOutlined className={styles.icon} />
          <Title level={3} className={styles.title}>个人资料</Title>
          <Text type="secondary">编辑您的个人信息</Text>
        </div>

        {successMsg && (
          <Alert
            message={successMsg}
            type="success"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        <Form
          form={form}
          onFinish={handleSubmit}
          autoComplete="off"
          size="large"
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, justifyContent: 'center' }}>
            <Avatar
              src={user.avatar}
              icon={<UserOutlined />}
              size={80}
              style={{ marginBottom: 16 }}
            />
            <div>
              <Title level={4} style={{ margin: 0 }}>{user.username}</Title>
              <Text type="secondary">{user.role === 'internal' ? '内部员工' : '外部客户'}</Text>
            </div>
          </div>

          <Divider orientation="left">基本信息</Divider>

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
              disabled
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
              placeholder="邮箱"
            />
          </Form.Item>

          {user?.email && (
            <div style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                onClick={async () => {
                  if (!user) return
                  setLoading(true)
                  try {
                    const result = await sendVerificationEmail(user.id)
                    if (result.success) {
                      message.success(result.message)
                      setShowVerification(true)
                    } else {
                      message.error(result.message)
                    }
                  } catch (error) {
                    message.error('发送验证码失败')
                  } finally {
                    setLoading(false)
                  }
                }}
                loading={loading}
              >
                发送验证邮件
              </Button>
              
              {showVerification && (
                <div style={{ marginTop: 12 }}>
                  <Input
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="请输入验证码"
                    style={{ marginBottom: 8, width: '70%', marginRight: 8 }}
                  />
                  <Button type="primary" onClick={async () => {
                    if (!user) return
                    setLoading(true)
                    try {
                      const result = await verifyEmail(user.id, verificationCode)
                      if (result.success) {
                        message.success(result.message)
                        setShowVerification(false)
                        setVerificationCode('')
                      } else {
                        message.error(result.message)
                      }
                    } catch (error) {
                      message.error('验证失败')
                    } finally {
                      setLoading(false)
                    }
                  }} loading={loading}>
                    验证邮箱
                  </Button>
                  <Text type="secondary" style={{ display: 'block', marginTop: 4, fontSize: 12 }}>测试验证码：123456</Text>
                </div>
              )}
            </div>
          )}

          <Form.Item
            name="phone"
            rules={[
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
            ]}
          >
            <Input 
              prefix={<PhoneOutlined />} 
              placeholder="手机号"
            />
          </Form.Item>

          <Divider orientation="left">账号安全</Divider>

          <Form.Item
            name="currentPassword"
            rules={[
              { required: false, message: '请输入当前密码' },
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="当前密码（修改密码时必填）"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            rules={[
              { required: false, message: '请输入新密码' },
              { min: 6, message: '密码至少6个字符' },
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="新密码（选填）"
            />
          </Form.Item>

          <Form.Item>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                icon={<SaveOutlined />}
              >
                保存修改
              </Button>
              <Button
                danger
                onClick={handleLogout}
                block
                size="large"
              >
                退出登录
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default ProfilePage
