import React, { useState, useRef, useEffect } from 'react'
import { 
  Card, 
  Input, 
  Button, 
  List, 
  Avatar, 
  Typography, 
  Space,
  Tag,
  Spin,
  Empty,
  Alert,
  Upload,
  Tabs,
  Drawer,
  Tooltip,
  Popconfirm,
} from 'antd'
import { 
  SendOutlined, 
  RobotOutlined, 
  UserOutlined,
  ClearOutlined,
  ExperimentOutlined,
  UploadOutlined,
  SafetyOutlined,
  FileTextOutlined,
  HistoryOutlined,
  PlusOutlined,
  DeleteOutlined,
  MessageOutlined,
} from '@ant-design/icons'
import type { UploadProps } from 'antd'
import ReactMarkdown from 'react-markdown'
import { useChatStore } from '../../store/chatStore'
import { useAuthStore } from '../../store/authStore'
import { AIService } from '../../services/aiService'
import styles from './AnalysisPage.module.css'

const { TextArea } = Input
const { Text } = Typography
const { TabPane } = Tabs

const AnalysisPage: React.FC = () => {
  const { user } = useAuthStore()
  const { 
    messages, 
    isLoading, 
    addMessage, 
    setLoading, 
    clearMessages,
    createSession,
    loadSession,
    getUserSessions,
    deleteSession,
    clearAllSessions,
    currentSessionId,
  } = useChatStore()
  const [inputValue, setInputValue] = useState('')
  const [description, setDescription] = useState('')
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return
    if (!user?.id) return

    const itemName = inputValue.trim()
    setInputValue('')
    const userId = user.id
    
    // 如果没有当前会话，创建一个新会话
    let sessionId = currentSessionId
    if (!sessionId) {
      sessionId = await createSession(userId, 'analysis')
    }
    
    // 添加用户消息
    addMessage({
      role: 'user',
      content: `分析物品：${itemName}${description ? '\n描述：' + description : ''}`,
      type: 'analysis',
      sessionId: sessionId || undefined,
    }, userId)

    setLoading(true)

    try {
      // 调用AI分析服务
      const result = await AIService.analyzeItem(itemName, description)
      
      addMessage({
        role: 'assistant',
        content: result,
        type: 'analysis',
        sessionId: sessionId || undefined,
      }, userId)
      
      // 清空描述
      setDescription('')
    } catch (error) {
      addMessage({
        role: 'assistant',
        content: '抱歉，分析过程中出现错误，请稍后再试。',
        type: 'analysis',
        sessionId: sessionId || undefined,
      }, userId)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const uploadProps: UploadProps = {
    name: 'file',
    // 限制文件大小和格式
    beforeUpload: (file) => {
      const isAllowedType = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)
      const isLt20M = file.size / 1024 / 1024 < 20
      
      if (!isAllowedType) {
        alert('请上传 JPG、PNG、WEBP 或 GIF 格式的图片！')
        return false
      }
      if (!isLt20M) {
        alert('图片大小不能超过 20MB！')
        return false
      }
      return true
    },
    // 使用本地处理，不发送到服务器
    customRequest: async (options) => {
      const { file, onSuccess, onError } = options
      if (!user?.id) return
      
      const userId = user.id
      
      try {
        // 如果没有当前会话，创建一个新会话
        let sessionId = currentSessionId
        if (!sessionId) {
          sessionId = await createSession(userId, 'analysis')
        }
        
        // 读取图片文件
        const reader = new FileReader()
        reader.onload = async (e) => {
          const base64Image = e.target?.result as string
          
          // 添加用户消息
          addMessage({
            role: 'user',
            content: `分析图片：[图片]`,
            type: 'analysis',
            sessionId: sessionId || undefined,
          }, userId)
          
          setLoading(true)
          
          try {
            // 调用AI分析服务
            const result = await AIService.analyzeImage(base64Image)
            
            addMessage({
              role: 'assistant',
              content: result,
              type: 'analysis',
              sessionId: sessionId || undefined,
            }, userId)
          } catch (error) {
            addMessage({
              role: 'assistant',
              content: '抱歉，分析过程中出现错误，请稍后再试。',
              type: 'analysis',
              sessionId: sessionId || undefined,
            }, userId)
          } finally {
            setLoading(false)
          }
          
          onSuccess?.(file as any)
        }
        reader.onerror = () => {
          onError?.(new Error('文件读取失败'))
        }
        reader.readAsDataURL(file as any)
      } catch (error) {
        onError?.(error as any)
      }
    },
    onChange(info) {
      if (info.file.status === 'done') {
        console.log('上传成功')
      }
    },
  }

  // 获取当前用户的会话历史
  const userId = user?.id
  const userSessions = userId ? getUserSessions(userId) : []

  // 开始新会话
  const handleNewSession = () => {
    if (userId) {
      createSession(userId, 'analysis')
    }
  }

  // 加载历史会话
  const handleLoadSession = (sessionId: string) => {
    loadSession(sessionId)
    setHistoryDrawerOpen(false)
  }

  // 删除会话
  const handleDeleteSession = (sessionId: string) => {
    if (userId) {
      deleteSession(sessionId, userId)
    }
  }

  // 一键清空所有会话
  const handleClearAllSessions = () => {
    if (userId) {
      clearAllSessions(userId)
    }
  }

  const analysisMessages = messages.filter(m => m.type === 'analysis')

  const exampleItems = [
    '手机',
    '电脑',
    '塑料瓶',
    '锂电池',
    '铝合金门窗',
    '电路板',
  ]

  return (
    <div className={styles.container}>
      <Alert
        message="内部系统 - 成分分析"
        description="此功能仅限授权员工使用，分析结果涉及公司机密，请勿外传。"
        type="warning"
        showIcon
        icon={<SafetyOutlined />}
        style={{ marginBottom: 24 }}
      />

      <Card 
        className={styles.chatCard}
        title={
          <Space>
            <ExperimentOutlined />
            <span>AI成分分析</span>
            <Tag color="red">内部专用</Tag>
          </Space>
        }
        extra={
          <Space>
            <Tooltip title="历史记录">
              <Button
                icon={<HistoryOutlined />}
                onClick={() => setHistoryDrawerOpen(true)}
              >
                历史
              </Button>
            </Tooltip>
            {analysisMessages.length > 0 && (
              <Button 
                icon={<ClearOutlined />} 
                onClick={clearMessages}
                size="small"
                danger
              >
                清空
              </Button>
            )}
          </Space>
        }
      >
        <Tabs defaultActiveKey="text">
          <TabPane 
            tab={<span><FileTextOutlined /> 文本输入</span>} 
            key="text"
          >
            {/* Messages Area */}
            <div className={styles.messagesArea}>
              {analysisMessages.length === 0 ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <Space direction="vertical" align="center">
                      <Text type="secondary">输入物品名称进行成分分析</Text>
                      <div className={styles.suggestions}>
                        {exampleItems.map((item, i) => (
                          <Tag 
                            key={i} 
                            className={styles.suggestionTag}
                            onClick={() => setInputValue(item)}
                          >
                            {item}
                          </Tag>
                        ))}
                      </div>
                    </Space>
                  }
                />
              ) : (
                <List
                  dataSource={analysisMessages}
                  renderItem={(message) => (
                    <List.Item
                      className={`${styles.messageItem} ${
                        message.role === 'user' ? styles.userMessage : styles.aiMessage
                      }`}
                    >
                      <div className={styles.messageContent}>
                        <Avatar
                          icon={message.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
                          className={message.role === 'user' ? styles.userAvatar : styles.aiAvatar}
                        />
                        <div className={styles.messageBubble}>
                          <div className={styles.messageText}>
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>
                          <Text type="secondary" className={styles.messageTime}>
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </Text>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              )}
              {isLoading && (
                <div className={styles.loadingIndicator}>
                  <Spin size="small" />
                  <Text type="secondary" style={{ marginLeft: 8 }}>AI正在分析成分...</Text>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className={styles.inputArea}>
              <div className={styles.inputWrapper}>
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="输入物品名称（如：手机、塑料瓶等）"
                  disabled={isLoading}
                  size="large"
                  style={{ marginBottom: 8 }}
                />
                <TextArea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="补充描述（可选）：品牌、型号、外观特征等"
                  autoSize={{ minRows: 2, maxRows: 3 }}
                  disabled={isLoading}
                />
              </div>
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSend}
                loading={isLoading}
                disabled={!inputValue.trim()}
                className={styles.sendButton}
                size="large"
              >
                分析
              </Button>
            </div>
          </TabPane>
          
          <TabPane 
            tab={<span><UploadOutlined /> 图片上传</span>} 
            key="image"
          >
            <div className={styles.uploadArea}>
              <Upload.Dragger {...uploadProps} className={styles.uploader}>
                <p className="ant-upload-drag-icon">
                  <UploadOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                </p>
                <p className="ant-upload-text">点击或拖拽图片到此处上传</p>
                <p className="ant-upload-hint">
                  支持 JPG、PNG、WEBP、GIF 格式，单个文件不超过 20MB
                </p>
              </Upload.Dragger>
              <Alert
                message="图片分析功能已上线"
                description="上传图片后，AI将自动分析物品成分。"
                type="success"
                showIcon
                style={{ marginTop: 16 }}
              />
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* History Drawer */}
      <Drawer
        title="分析历史"
        placement="left"
        onClose={() => setHistoryDrawerOpen(false)}
        open={historyDrawerOpen}
        width={320}
      >
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          block
          onClick={() => {
            handleNewSession()
            setHistoryDrawerOpen(false)
          }}
          style={{ marginBottom: 8 }}
        >
          开始新分析
        </Button>
        {userSessions.length > 0 && (
          <Popconfirm
            title="确定清空所有分析历史？此操作不可恢复。"
            onConfirm={handleClearAllSessions}
            okText="确定"
            cancelText="取消"
            okType="danger"
          >
            <Button
              type="dashed"
              danger
              icon={<DeleteOutlined />}
              block
              style={{ marginBottom: 16 }}
            >
              一键清空所有历史
            </Button>
          </Popconfirm>
        )}
        
        {userSessions.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="暂无历史记录"
          />
        ) : (
          <List
            dataSource={userSessions}
            renderItem={(session) => (
              <List.Item
                className={`${styles.sessionItem} ${currentSessionId === session.id ? styles.activeSession : ''}`}
                onClick={() => handleLoadSession(session.id)}
                actions={[
                  <Popconfirm
                    title="确定删除此分析记录？"
                    onConfirm={(e) => {
                      e?.stopPropagation()
                      handleDeleteSession(session.id)
                    }}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      size="small"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<MessageOutlined />} size="small" />}
                  title={
                    <Text ellipsis style={{ maxWidth: 180 }}>
                      {session.title}
                    </Text>
                  }
                  description={
                    <Space direction="vertical" size={0}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {session.messageCount} 条消息
                      </Text>
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        {new Date(session.updatedAt).toLocaleDateString()}
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Drawer>
    </div>
  )
}

export default AnalysisPage
