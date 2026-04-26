import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      zh: {
        translation: {
          "app_name": "公司AI",
          "login_client": "客户登录",
          "login_staff": "内部登录",
          "welcome_prefix": "欢迎来到",
          "ai_consult_title": "智能咨询",
          "ai_consult_desc": "了解公司产品、服务、联系方式等信息",
          "start_chat_btn": "开始咨询 / Start Chat",
          "company_overview": "公司概况",
          "founded_label": "成立时间",
          "employees_label": "员工规模",
          "core_products_label": "核心产品",
          "supporting_services": "配套与定制服务",
          "back": "返回",
          "nav_home": "首页",
          "nav_chat": "智能咨询"
        }
      },
      en: {
        translation: {
          "app_name": "Matrix AI",
          "login_client": "Client Login",
          "login_staff": "Staff Login",
          "welcome_prefix": "Welcome to",
          "ai_consult_title": "AI Consultation",
          "ai_consult_desc": "Learn about our products, services, and contact info",
          "start_chat_btn": "Start Chat",
          "company_overview": "Company Overview",
          "founded_label": "Founded",
          "employees_label": "Employees",
          "core_products_label": "Core Products",
          "supporting_services": "Supporting & Custom Services",
          "back": "Back",
          "nav_home": "Home",
          "nav_chat": "AI Chat"
        }
      }
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;