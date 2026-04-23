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
  message,
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
import { useChatStore, type ChatSession } from '../../store/chatStore'
import { useAuthStore } from '../../store/authStore'
import { AIService } from '../../services/aiService'
import { api } from '../../services/api'
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
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 定义加载函数（解决第一个报错）
  const loadUserSessions = async () => {
    if (!user?.id) return; // 如果没登录，直接返回
    
    try {
      // 调用接口获取当前用户的真实会话
      const result = await api.getSessions(user.id, 'company');
      if (result.success) {
        setSessions(result.sessions); // 将数据库里的真数据塞进状态
      }
    } catch (error) {
      console.error("加载历史会话失败:", error);
    }
  };

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
    } else {
      loadUserSessions();
    }
  }, [isAuthenticated])

  // 获取当前用户的会话历史
  const userSessions = isAuthenticated ? sessions : []

  // 开始新会话
  const handleNewSession = async () => {
    if (isAuthenticated && user) {
      await createSession(user.id, 'company');
      await loadUserSessions();
      message.success('已开启新对话');
    } else {
      clearMessages();
    }
  }

  // 加载历史会话 - 增强版
  const handleLoadSession = async (sessionId: string) => {
    // 1. 先切换 ID
    loadSession(sessionId);
    
    setLoading(true);
    try {
      const result = await api.getSessionMessages(sessionId);
      if (result.success && result.messages) {
        // 2. 【关键】强制校准数据字段，确保它们能通过下面的 filter 检查
        const calibratedMessages = result.messages.map((m: any) => ({
          ...m,
          // 强制确保有 sessionId，如果后端返回的是 session_id 也能兼容
          sessionId: m.sessionId || m.session_id || sessionId,
          // 强制确保 type 是 company，防止被 filter 过滤掉
          type: m.type || 'company',
          // 确保时间戳存在，防止渲染报错
          timestamp: m.createdAt || m.timestamp || new Date().getTime()
        }));

        // 3. 更新全局状态
        useChatStore.setState({ messages: calibratedMessages });
      }
    } catch (error) {
      console.error("加载会话消息失败:", error);
      message.error("无法加载历史记录");
    } finally {
      setLoading(false);
      setHistoryDrawerOpen(false);
    }
  }

  // 删除单个会话
  const handleDeleteSession = async (sessionId: string) => {
    if (!user) return;
    
    try {
      // 1. 调用 API 真正删除数据库数据
      const result = await api.deleteSession(sessionId);
      if (result.success) {
        message.success('对话已删除');
        
        // 2. 如果删除的是当前正在看的会话，清空屏幕
        if (sessionId === currentSessionId) {
          clearMessages();
        }
        
        // 3. 【关键】重新拉取列表，刷新侧边栏
        await loadUserSessions();
      }
    } catch (error) {
      console.error("删除失败:", error);
      message.error('删除失败，请稍后再试');
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
      loadUserSessions(); // 【新增】发送完后刷一下侧边栏，让新对话标题跳出来
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // 显示当前用户的消息 - 宽容模式
  const publicMessages = messages.filter(m => {
    // 检查1：如果是 null 或者 company，都允许通过
    const isCorrectType = !m.type || m.type === 'company';
    if (!isCorrectType) return false;

    // 检查2：如果有当前选中会话，必须 ID 匹配
    if (currentSessionId) {
       // 这里加一个强制转换和打印，方便你调试
       return String(m.sessionId) === String(currentSessionId);
    }
    
    // 检查3：没登录且没会话时，显示临时消息（无 sessionId 的）
    return !m.sessionId;
  });

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
                onClick={() => {
                  loadUserSessions();
                  setHistoryDrawerOpen(true);
                }}
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
            onConfirm={async () => { // 加上 async
              if (user) {
                try {
                  // 修改这里：由 clearAllSessions 改为 clearSessions
                  const result = await api.clearSessions(user.id);
                  if (result.success) {
                    message.success('所有历史已清空');
                    clearMessages(); // 清空当前屏幕
                    await loadUserSessions(); // 【关键】刷新侧边栏
                  }
                } catch (error) {
                  message.error('清空失败');
                }
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