import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '../services/api'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  type?: 'company' | 'analysis'
  sessionId?: string
}

export interface ChatSession {
  id: string
  title: string
  type: 'company' | 'analysis'
  createdAt: number
  updatedAt: number
  messageCount: number
  userId: string
}

interface ChatState {
  messages: Message[]
  isLoading: boolean
  currentSessionId: string | null
  userSessions: ChatSession[]
  
  // Actions
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>, userId?: string) => Promise<void>
  setLoading: (loading: boolean) => void
  clearMessages: () => void
  getMessagesByType: (type: 'company' | 'analysis') => Message[]
  
  // 会话管理
  createSession: (userId: string, type: 'company' | 'analysis', title?: string) => Promise<string>
  loadSession: (sessionId: string) => Promise<void>
  getUserSessions: (userId: string) => ChatSession[]
  deleteSession: (sessionId: string, userId: string) => Promise<void>
  clearAllSessions: (userId: string) => Promise<void>
  updateSessionTitle: (sessionId: string, title: string) => void
  
  // 加载用户数据
  loadUserSessions: (userId: string, type?: 'company' | 'analysis') => Promise<void>
  loadSessionMessages: (sessionId: string) => Promise<void>
  
  // 上下文记忆
  getContextMessages: (sessionId: string, limit?: number) => Message[]
  getRecentContext: (type: 'company' | 'analysis', userId?: string, limit?: number) => Array<{ role: string; content: string }>
}

const generateSessionTitle = (firstMessage: string): string => {
  if (!firstMessage) return '新对话'
  const title = firstMessage.slice(0, 20)
  return title.length < firstMessage.length ? title + '...' : title
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      isLoading: false,
      currentSessionId: null,
      userSessions: [],

      addMessage: async (message, userId) => {
        const sessionIdValue = message.sessionId || get().currentSessionId
        
        const newMessage: Message = {
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
          ...message,
          sessionId: sessionIdValue || undefined,
        }

        set((state) => ({
          messages: [...state.messages, newMessage],
        }))

        // 保存到后端
        if (userId && sessionIdValue) {
          try {
            await api.saveMessage(sessionIdValue, userId, message.role, message.content, message.type)
            
            // 更新会话列表
            const sessions = get().userSessions
            const sessionIndex = sessions.findIndex(s => s.id === sessionIdValue)
            if (sessionIndex >= 0) {
              const updatedSessions = [...sessions]
              updatedSessions[sessionIndex] = {
                ...updatedSessions[sessionIndex],
                messageCount: (updatedSessions[sessionIndex].messageCount || 0) + 1,
                updatedAt: Date.now(),
              }
              if (message.role === 'user' && updatedSessions[sessionIndex].messageCount === 1) {
                updatedSessions[sessionIndex].title = generateSessionTitle(message.content)
              }
              set({ userSessions: updatedSessions })
            }
          } catch (error) {
            console.error('保存消息失败:', error)
          }
        }
      },

      setLoading: (loading) => set({ isLoading: loading }),

      clearMessages: () => set({ messages: [], currentSessionId: null }),

      getMessagesByType: (type) => {
        return get().messages.filter((msg) => msg.type === type)
      },

      createSession: async (userId, type, title) => {
        try {
          const result = await api.createSession(userId, type, title)
          
          if (result.success && result.sessionId) {
            const newSession: ChatSession = {
              id: result.sessionId,
              title: title || '新对话',
              type,
              createdAt: Date.now(),
              updatedAt: Date.now(),
              messageCount: 0,
              userId,
            }

            set((state) => ({
              userSessions: [newSession, ...state.userSessions],
              currentSessionId: result.sessionId,
              messages: [],
            }))

            return result.sessionId
          }
        } catch (error) {
          console.error('创建会话失败:', error)
        }

        // 如果后端失败，使用本地ID
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const newSession: ChatSession = {
          id: sessionId,
          title: title || '新对话',
          type,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          messageCount: 0,
          userId,
        }

        set((state) => ({
          userSessions: [newSession, ...state.userSessions],
          currentSessionId: sessionId,
          messages: [],
        }))

        return sessionId
      },

      loadSession: async (sessionId) => {
        set({ currentSessionId: sessionId, messages: [] })
        
        try {
          const result = await api.getSessionMessages(sessionId)
          if (result.success && result.messages) {
            set({
              messages: result.messages.map((m: any) => ({
                id: m.id,
                role: m.role,
                content: m.content,
                timestamp: m.timestamp,
                type: m.type,
                sessionId: m.sessionId,
              })),
            })
          }
        } catch (error) {
          console.error('加载会话消息失败:', error)
        }
      },

      getUserSessions: (userId) => {
        return get().userSessions.filter(s => s.userId === userId)
      },

      deleteSession: async (sessionId, _userId) => {
        try {
          await api.deleteSession(sessionId)
        } catch (error) {
          console.error('删除会话失败:', error)
        }

        set((state) => ({
          userSessions: state.userSessions.filter(s => s.id !== sessionId),
          messages: state.currentSessionId === sessionId ? [] : state.messages,
          currentSessionId: state.currentSessionId === sessionId ? null : state.currentSessionId,
        }))
      },

      clearAllSessions: async (userId) => {
        try {
          await api.clearSessions(userId)
        } catch (error) {
          console.error('清空会话失败:', error)
        }

        set((state) => ({
          userSessions: state.userSessions.filter(s => s.userId !== userId),
          messages: [],
          currentSessionId: null,
        }))
      },

      updateSessionTitle: (sessionId, title) => {
        set((state) => ({
          userSessions: state.userSessions.map(s =>
            s.id === sessionId ? { ...s, title, updatedAt: Date.now() } : s
          ),
        }))
      },

      loadUserSessions: async (userId, type) => {
        try {
          const result = await api.getSessions(userId, type)
          if (result.success && result.sessions) {
            set({
              userSessions: result.sessions.map((s: any) => ({
                id: s.id,
                title: s.title,
                type: s.type,
                createdAt: s.createdAt,
                updatedAt: s.updatedAt,
                messageCount: s.messageCount,
                userId: s.userId,
              })),
            })
          }
        } catch (error) {
          console.error('加载用户会话失败:', error)
        }
      },

      loadSessionMessages: async (sessionId) => {
        try {
          const result = await api.getSessionMessages(sessionId)
          if (result.success && result.messages) {
            set({
              messages: result.messages.map((m: any) => ({
                id: m.id,
                role: m.role,
                content: m.content,
                timestamp: m.timestamp,
                type: m.type,
                sessionId: m.sessionId,
              })),
              currentSessionId: sessionId,
            })
          }
        } catch (error) {
          console.error('加载会话消息失败:', error)
        }
      },

      getContextMessages: (sessionId, limit = 10) => {
        const messages = get().messages.filter(m => m.sessionId === sessionId)
        return messages.slice(-limit)
      },

      getRecentContext: (type, _userId, limit = 5) => {
        const { messages } = get()
        const typeMessages = messages
          .filter(msg => msg.type === type)
          .slice(-limit * 2)

        return typeMessages.map(msg => ({
          role: msg.role,
          content: msg.content,
        }))
      },
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        currentSessionId: state.currentSessionId,
      }),
    }
  )
)
