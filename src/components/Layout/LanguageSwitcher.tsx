import React from 'react'
import { Button } from 'antd'
import { GlobalOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh'
    i18n.changeLanguage(newLang)
  }

  return (
    <Button
      icon={<GlobalOutlined />}
      onClick={toggleLanguage}
      size="small"
      style={{ marginRight: 16 }}
    >
      {i18n.language === 'zh' ? 'English' : '中文'}
    </Button>
  )
}

export default LanguageSwitcher