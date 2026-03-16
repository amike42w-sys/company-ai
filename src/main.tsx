import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider 
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#2f54eb', // 现代感的科技蓝紫
          colorInfo: '#2f54eb',
          borderRadius: 8, // 全局基础圆角变大，更柔和
          colorTextBase: '#333333', // 字体颜色略微加深，提升阅读体验
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        },
        components: {
          Menu: {
            itemBorderRadius: 8, // 菜单项圆角
            itemMarginInline: 12, // 菜单两侧留白
          },
          Card: {
            borderRadiusLG: 12, // 卡片圆角更大
            boxShadowTertiary: '0 2px 12px 0 rgba(0, 0, 0, 0.04)', // 极其柔和的悬浮阴影
          },
          Table: {
            headerBg: '#f8fafc', // 表头使用极浅的蓝灰色
            headerColor: '#475569', // 表头字体颜色柔和
            borderRadiusLG: 12,
          },
          Button: {
            controlHeight: 36, // 按钮稍微加高，更饱满
            fontWeight: 500,
          },
          Input: { controlHeight: 36 },
          Select: { controlHeight: 36 }
        }
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)