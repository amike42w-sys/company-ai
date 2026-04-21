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
  Drawer,
  Tooltip,
  Badge,
  Popconfirm,
} from 'antd'
import {
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  ClearOutlined,
  GlobalOutlined,
  HistoryOutlined,
  PlusOutlined,
  DeleteOutlined,
  LoginOutlined,
  MessageOutlined,
} from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'
import { useNavigate } from 'react-router-dom'
import { useChatStore } from '../../store/chatStore'
import { useAuthStore } from '../../store/authStore'
import { AIService } from '../../services/aiService'
import styles from './PublicChat.module.css'

const { TextArea } = Input
const { Text } = Typography

const PublicChat: React.FC = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, role } = useAuthStore()
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
    getContextMessages,
  } = useChatStore()
  
  const [inputValue, setInputValue] = useState('')
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!isAuthenticated) {
      let guestId = localStorage.getItem('guest_id')
      if (!guestId) {
        guestId = 'guest_' + Math.random().toString(36).slice(2, 10)
        localStorage.setItem('guest_id', guestId)
      }
    }
  }, [isAuthenticated])

  // 获取当前用户的会话历史
  const userSessions = isAuthenticated && user ? getUserSessions(user.id) : []

  // 开始新会话
  const handleNewSession = () => {
    if (isAuthenticated && user) {
      createSession(user.id, 'company')
    } else {
      clearMessages()
    }
  }

  // 加载历史会话
  const handleLoadSession = (sessionId: string) => {
    loadSession(sessionId)
    setHistoryDrawerOpen(false)
  }

  // 删除会话
  const handleDeleteSession = (sessionId: string) => {
    if (user) {
      deleteSession(sessionId, user.id)
    }
  }

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    const question = inputValue.trim()
    setInputValue('')
    
    // 如果没有当前会话，创建一个新会话
    if (!currentSessionId && isAuthenticated && user) {
      createSession(user.id, 'company')
    }
    
    // 添加用户消息
    addMessage({
      role: 'user',
      content: question,
      type: 'company',
    }, user?.id)

    setLoading(true)

    try {
      // 获取上下文消息（用于AI记忆）
      const contextMessages = currentSessionId
        ? getContextMessages(currentSessionId, 6).map(m => ({
            role: m.role,
            content: m.content,
          }))
        : []

      // 调用AI服务（传入上下文）
      const answer = await AIService.askCompanyQuestion(question, contextMessages)
      
      addMessage({
        role: 'assistant',
        content: answer,
        type: 'company',
      }, user?.id)
    } catch (error) {
      addMessage({
        role: 'assistant',
        content: '抱歉，我暂时无法回答您的问题，请稍后再试。',
        type: 'company',
      }, user?.id)
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

  // 显示当前用户的消息或未登录时的临时消息
  const publicMessages = isAuthenticated && user
    ? messages.filter(m => m.type === 'company' && m.sessionId && getUserSessions(user.id).some(session => session.id === m.sessionId))
    : messages.filter(m => m.type === 'company' && !m.sessionId)

  return (
    <div className={styles.container}>
      <div className={styles.chatHeader}>
        <div className={styles.headerTitle}>
          <GlobalOutlined />
          <span className={styles.titleText}>公司信息咨询</span>
          <Tag color="blue">公开访问</Tag>
          {isAuthenticated && role === 'external' && (
            <Badge dot color="green">
              <Tag color="success">已登录</Tag>
            </Badge>
          )}
        </div>
        
        <div className={styles.headerActions}>
          {isAuthenticated && (
            <Tooltip title="历史记录">
              <Button
                icon={<HistoryOutlined />}
                onClick={() => setHistoryDrawerOpen(true)}
                className={styles.actionBtn}
              >
                <span className={styles.btnText}>历史</span>
              </Button>
            </Tooltip>
          )}
          <Tooltip title="新对话">
            <Button
              icon={<PlusOutlined />}
              onClick={handleNewSession}
              className={styles.actionBtn}
            >
              <span className={styles.btnText}>新对话</span>
            </Button>
          </Tooltip>
          {publicMessages.length > 0 && (
            <Tooltip title="清空对话">
              <Button
                icon={<ClearOutlined />}
                onClick={clearMessages}
                className={styles.actionBtn}
              >
                <span className={styles.btnText}>清空</span>
              </Button>
            </Tooltip>
          )}
          {!isAuthenticated && (
            <Button
              type="primary"
              icon={<LoginOutlined />}
              onClick={() => navigate('/login')}
              className={styles.mobileHide}
            >
              登录/注册
            </Button>
          )}
        </div>
      </div>
      
      <Card
        className={styles.chatCard}
      >
        {/* Messages Area */}
        <div className={styles.messagesArea}>
          {!isAuthenticated && publicMessages.length === 0 && (
            <div className={styles.guestBanner}>
              <Text type="secondary">
                <LoginOutlined style={{ marginRight: 8 }} />
                提示：登录后可保存聊天记录，AI会记住上下文让对话更连贯
              </Text>
              <Button
                type="link"
                size="small"
                onClick={() => navigate('/login')}
              >
                立即登录
              </Button>
            </div>
          )}
          
          {publicMessages.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Space direction="vertical" align="center">
                  <Text type="secondary">您可以询问以下问题：</Text>
                  <div className={styles.suggestions}>
                    {['你们公司是做什么的？', '怎么联系你们？', '有什么产品？', '公司成立多久了？'].map((q, i) => (
                      <Tag
                        key={i}
                        className={styles.suggestionTag}
                        onClick={() => setInputValue(q)}
                      >
                        {q}
                      </Tag>
                    ))}
                  </div>
                </Space>
              }
            />
          ) : (
            <List
              dataSource={publicMessages}
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
              <Text type="secondary" style={{ marginLeft: 8 }}>AI正在思考...</Text>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className={styles.inputArea}>
          <TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isAuthenticated
              ? "请输入您想了解的公司信息..."
              : "请输入您想了解的公司信息（登录后可保存记录）..."
            }
            autoSize={{ minRows: 2, maxRows: 4 }}
            disabled={isLoading}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={isLoading}
            disabled={!inputValue.trim()}
            className={styles.sendButton}
          >
            发送
          </Button>
        </div>
      </Card>

      {/* History Drawer */}
      <Drawer
        title="对话历史"
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
          开始新对话
        </Button>
        {userSessions.length > 0 && (
          <Popconfirm
            title="确定清空所有对话历史？此操作不可恢复。"
            onConfirm={() => {
              if (user) {
                clearAllSessions(user.id)
              }
            }}
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
                    title="确定删除此对话？"
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

export default PublicChat