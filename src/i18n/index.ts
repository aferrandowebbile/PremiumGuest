import i18n from "i18next";
import { initReactI18next } from "react-i18next";

void i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: {
      common: {
        home: "Home",
        map: "Map",
        inbox: "Inbox",
        account: "Account",
        mapSubtitle: "Interactive map module placeholder",
        mapComingSoon: "Map coming soon",
        mapProviderHint: "Connect this screen to your destination map provider.",
        inboxSubtitle: "Updates and guest-facing alerts",
        allCaughtUp: "All caught up",
        noNotificationsDetail: "No notifications yet. New alerts from Supabase will appear here.",
        accountSubtitle: "Language and tenant settings",
        destination: "Destination",
        loadingDestinations: "Loading destinations...",
        destinationHint: "Switch destination to load a different white-label config.",
        language: "Language",
        rtlHint: "RTL is applied when switching to Arabic. Full layout mirroring may require app restart on some platforms.",
        welcome: "Welcome",
        retry: "Retry",
        unableToLoadHome: "Unable to load home content",
        tenantUnavailable: "Tenant configuration is unavailable.",
        ski: "Ski",
        park: "Park"
      }
    },
    zh: {
      common: {
        home: "主页",
        map: "地图",
        inbox: "收件箱",
        account: "账户",
        mapSubtitle: "交互地图模块占位",
        mapComingSoon: "地图即将上线",
        mapProviderHint: "请将此页面连接到你的地图服务提供商。",
        inboxSubtitle: "更新与面向游客的通知",
        allCaughtUp: "已全部查看",
        noNotificationsDetail: "暂时没有通知。来自 Supabase 的新提醒会显示在这里。",
        accountSubtitle: "语言和租户设置",
        destination: "目的地",
        loadingDestinations: "正在加载目的地...",
        destinationHint: "切换目的地以加载不同的白标配置。",
        language: "语言",
        rtlHint: "切换到阿拉伯语时会启用 RTL。某些平台可能需要重启应用才能完全生效。",
        welcome: "欢迎",
        retry: "重试",
        unableToLoadHome: "无法加载首页内容",
        tenantUnavailable: "租户配置不可用。",
        ski: "滑雪",
        park: "乐园"
      }
    },
    ja: {
      common: {
        home: "ホーム",
        map: "マップ",
        inbox: "受信箱",
        account: "アカウント",
        mapSubtitle: "インタラクティブマップのプレースホルダー",
        mapComingSoon: "マップは近日公開",
        mapProviderHint: "この画面をマッププロバイダーに接続してください。",
        inboxSubtitle: "更新情報とゲスト向け通知",
        allCaughtUp: "最新です",
        noNotificationsDetail: "通知はまだありません。Supabase の新着通知がここに表示されます。",
        accountSubtitle: "言語とテナント設定",
        destination: "目的地",
        loadingDestinations: "目的地を読み込み中...",
        destinationHint: "目的地を切り替えると別のホワイトラベル設定を読み込みます。",
        language: "言語",
        rtlHint: "アラビア語に切り替えると RTL が適用されます。環境によっては再起動が必要です。",
        welcome: "ようこそ",
        retry: "再試行",
        unableToLoadHome: "ホームを読み込めません",
        tenantUnavailable: "テナント設定を取得できません。",
        ski: "スキー",
        park: "パーク"
      }
    },
    ru: {
      common: {
        home: "Главная",
        map: "Карта",
        inbox: "Входящие",
        account: "Аккаунт",
        mapSubtitle: "Заглушка интерактивной карты",
        mapComingSoon: "Карта скоро появится",
        mapProviderHint: "Подключите этот экран к вашему провайдеру карт.",
        inboxSubtitle: "Обновления и уведомления для гостей",
        allCaughtUp: "Все просмотрено",
        noNotificationsDetail: "Пока нет уведомлений. Новые оповещения из Supabase появятся здесь.",
        accountSubtitle: "Язык и настройки тенанта",
        destination: "Курорт",
        loadingDestinations: "Загрузка курортов...",
        destinationHint: "Смените курорт, чтобы загрузить другой white-label конфиг.",
        language: "Язык",
        rtlHint: "При переключении на арабский включается RTL. На некоторых платформах может потребоваться перезапуск приложения.",
        welcome: "Добро пожаловать",
        retry: "Повторить",
        unableToLoadHome: "Не удалось загрузить главную",
        tenantUnavailable: "Конфигурация тенанта недоступна.",
        ski: "Лыжи",
        park: "Парк"
      }
    },
    ar: {
      common: {
        home: "الرئيسية",
        map: "الخريطة",
        inbox: "الوارد",
        account: "الحساب",
        mapSubtitle: "عنصر نائب لخريطة تفاعلية",
        mapComingSoon: "الخريطة قريباً",
        mapProviderHint: "اربط هذه الشاشة بمزوّد الخرائط لديك.",
        inboxSubtitle: "تحديثات وتنبيهات موجهة للضيف",
        allCaughtUp: "كل شيء محدث",
        noNotificationsDetail: "لا توجد إشعارات بعد. ستظهر التنبيهات الجديدة من Supabase هنا.",
        accountSubtitle: "إعدادات اللغة والمستأجر",
        destination: "الوجهة",
        loadingDestinations: "جاري تحميل الوجهات...",
        destinationHint: "بدّل الوجهة لتحميل إعداد white-label مختلف.",
        language: "اللغة",
        rtlHint: "يتم تفعيل اتجاه RTL عند اختيار العربية. قد يلزم إعادة تشغيل التطبيق على بعض المنصات.",
        welcome: "مرحباً",
        retry: "إعادة المحاولة",
        unableToLoadHome: "تعذر تحميل الصفحة الرئيسية",
        tenantUnavailable: "إعدادات المستأجر غير متاحة.",
        ski: "التزلج",
        park: "المنتزه"
      }
    }
  },
  ns: ["common"],
  defaultNS: "common",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
