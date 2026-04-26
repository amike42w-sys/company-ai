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
          "btn_client_short": "客户",
          "btn_internal_short": "内部",
          "internal_badge": "内部版",
          "profile": "个人资料",
          "logout": "退出登录",
          "menu_home": "首页",
          "menu_chat": "公司咨询",
          "menu_analysis": "成分分析",
          "menu_supplier": "供应商管理",
          "menu_supplier_list": "供应商列表",
          "menu_cert": "证书管理",
          "menu_customers": "客户管理",
          "menu_employees": "员工管理",
          "menu_quotations": "报价管理",
          "menu_monitor": "聊天监控",
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
          "btn_client_short": "Client",
          "btn_internal_short": "Staff",
          "internal_badge": "Staff Ed.",
          "profile": "Profile",
          "logout": "Logout",
          "menu_home": "Home",
          "menu_chat": "AI Chat",
          "menu_analysis": "Analysis",
          "menu_supplier": "Suppliers",
          "menu_supplier_list": "Supplier List",
          "menu_cert": "Certificates",
          "menu_customers": "Customers",
          "menu_employees": "Employees",
          "menu_quotations": "Quotations",
          "menu_monitor": "Monitor",
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