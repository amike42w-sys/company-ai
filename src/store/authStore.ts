import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { api } from '../services/api'

export type UserRole = 'guest' | 'external' | 'internal' | 'certificate_admin' | 'certificate_viewer' | null

export interface User {
  id: string
  username: string
  role: UserRole
  avatar?: string
  email?: string
  phone?: string
  createdAt?: number
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  role: UserRole
  token: string | null
  
  // Actions
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, password: string, email?: string, phone?: string) => Promise<{ success: boolean; message: string }>
  updateProfile: (userId: string, data: { email?: string; phone?: string; password?: string }) => Promise<{ success: boolean; message: string }>
  sendVerificationEmail: (userId: string) => Promise<{ success: boolean; message: string }>
  verifyEmail: (userId: string, code: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
  hasPermission: (requiredRole: UserRole[]) => boolean
  loadUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      role: null,
      token: null,

      loadUser: async () => {
        const { user } = get()
        if (user && user.id) {
          try {
            const result = await api.getUser(user.id)
            if (result.success && result.user) {
              set({ user: result.user })
            }
          } catch (error) {
            console.error('加载用户信息失败:', error)
          }
        }
      },

      login: async (username: string, password: string) => {
        try {
          const result = await api.login(username, password)
          
          if (result.success && result.user) {
            set({ 
              user: result.user, 
              isAuthenticated: true, 
              role: result.user.role 
            })
            return true
          }
          
          return false
        } catch (error) {
          console.error('登录失败:', error)
          return false
        }
      },

      register: async (username: string, password: string, email?: string, phone?: string) => {
        try {
          const result = await api.register(username, password, email, phone)
          
          if (result.success && result.user) {
            set({ 
              user: result.user, 
              isAuthenticated: true, 
              role: 'external' 
            })
            return { success: true, message: '注册成功' }
          }
          
          return { success: false, message: result.message || '注册失败' }
        } catch (error) {
          console.error('注册失败:', error)
          return { success: false, message: '注册失败，请稍后重试' }
        }
      },

      logout: async () => {
        set({ user: null, isAuthenticated: false, role: null, token: null })
        
        try {
          const { useChatStore } = await import('./chatStore')
          const chatStore = useChatStore.getState()
          if (chatStore && chatStore.clearMessages) {
            chatStore.clearMessages()
          }
        } catch (error) {
          console.warn('清空聊天记录失败:', error)
        }
      },

      hasPermission: (requiredRole: UserRole[]) => {
        const { role } = get()
        if (!role) return false
        return requiredRole.includes(role)
      },

      updateProfile: async (userId: string, data: { email?: string; phone?: string; password?: string }) => {
        try {
          const result = await api.updateUser(userId, data)
          
          if (result.success && result.user) {
            set({ user: result.user })
            return { success: true, message: '个人资料更新成功' }
          }
          
          return { success: false, message: result.message || '更新失败' }
        } catch (error) {
          console.error('更新用户信息失败:', error)
          return { success: false, message: '更新失败，请稍后重试' }
        }
      },

      sendVerificationEmail: async (_userId: string) => {
        const { user } = get()
        
        if (!user || !user.email) {
          return { success: false, message: '用户邮箱不存在' }
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log(`向 ${user.email} 发送验证码`)
        
        return { success: true, message: '验证邮件已发送' }
      },

      verifyEmail: async (_userId: string, code: string) => {
        await new Promise(resolve => setTimeout(resolve, 500))
        
        if (code === '123456') {
          return { success: true, message: '邮箱验证成功' }
        } else {
          return { success: false, message: '验证码错误' }
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated, 
        role: state.role 
      }),
    }
  )
)
