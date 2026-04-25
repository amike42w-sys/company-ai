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
          "nav_home": "首页",
          "nav_chat": "智能咨询",
          "start_chat": "开始咨询",
          "company_stats": "公司概况",
          "core_products": "核心产品",
          "back": "返回"
        }
      },
      en: {
        translation: {
          "nav_home": "Home",
          "nav_chat": "AI Chat",
          "start_chat": "Start Chat",
          "company_stats": "Company Overview",
          "core_products": "Core Products",
          "back": "Back"
        }
      }
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;