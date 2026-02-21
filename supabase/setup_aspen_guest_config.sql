-- Run in Supabase SQL Editor for project iahcjhxheacdssqybzaz
-- Purpose: create/repair guest-app config tables and seed Aspen config for tenant_id = '1'

begin;

create extension if not exists pgcrypto;

-- Canonical tenants table
create table if not exists public.tenants (
  tenant_id text primary key check (tenant_id ~ '^[0-9]+$'),
  slug text not null unique,
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Tenant config table used by the app home loader
create table if not exists public.tenant_configs (
  tenant_id text primary key,
  config jsonb not null,
  updated_at timestamptz not null default now()
);

-- Notifications table used by app/(tabs)/inbox.tsx
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  tenant_id text,
  title text,
  body text,
  created_at timestamptz not null default now()
);

-- If notifications table already existed from another schema version, normalize required columns.
alter table public.notifications add column if not exists tenant_id text;
alter table public.notifications add column if not exists title text;
alter table public.notifications add column if not exists body text;
alter table public.notifications add column if not exists created_at timestamptz not null default now();

-- Ensure all existing notification rows have a tenant_id
update public.notifications set tenant_id = '1' where tenant_id is null;

-- Ensure tenant_ids exist in tenants before enforcing FK
insert into public.tenants (tenant_id, slug, name)
values
  ('1', 'aspen-snowmass', 'Aspen Snowmass'),
  ('2', 'vail-mountain', 'Vail Mountain'),
  ('3', 'whistler-blackcomb', 'Whistler Blackcomb'),
  ('4', 'disneyland-park', 'Disneyland Park'),
  ('5', 'universal-studios', 'Universal Studios'),
  ('6', 'six-flags-magic-mountain', 'Six Flags Magic Mountain')
on conflict (tenant_id) do update
set slug = excluded.slug,
    name = excluded.name,
    is_active = true;

-- FKs (drop/recreate to avoid drift)
alter table public.tenant_configs
  drop constraint if exists tenant_configs_tenant_id_fkey;

alter table public.tenant_configs
  add constraint tenant_configs_tenant_id_fkey
  foreign key (tenant_id)
  references public.tenants(tenant_id)
  on delete cascade;

alter table public.notifications
  drop constraint if exists notifications_tenant_id_fkey;

alter table public.notifications
  add constraint notifications_tenant_id_fkey
  foreign key (tenant_id)
  references public.tenants(tenant_id)
  on delete cascade;

-- Basic indexes
create index if not exists notifications_tenant_created_idx
  on public.notifications (tenant_id, created_at desc);
create index if not exists tenants_slug_idx
  on public.tenants(slug);

-- RLS + read policies for guest app
alter table public.tenants enable row level security;
alter table public.tenant_configs enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "tenants read" on public.tenants;
create policy "tenants read"
  on public.tenants
  for select
  using (is_active = true);

drop policy if exists "tenant config read" on public.tenant_configs;
create policy "tenant config read"
  on public.tenant_configs
  for select
  using (true);

drop policy if exists "notifications read" on public.notifications;
create policy "notifications read"
  on public.notifications
  for select
  using (true);

-- Aspen/Snowmass-style white-label config for tenant 1
insert into public.tenant_configs (tenant_id, config)
values (
  '1',
  $json$
  {
    "name": "Snowmass",
    "theme": {
      "primary": "#111111",
      "secondary": "#5E5E5E",
      "background": "#F4F4F4",
      "surface": "#FFFFFF",
      "text": "#111111",
      "muted": "#5B5B5B",
      "border": "#DCDCDC",
      "success": "#2A7A3B",
      "warning": "#B36B12",
      "danger": "#B33A3A"
    },
    "enabledModules": {
      "ski": true,
      "park": true,
      "offers": true,
      "events": true,
      "commerce": false
    },
    "supportedLanguages": ["en", "zh", "ja", "ru", "ar"],
    "design": {
      "stylePreset": "aspen-editorial",
      "tokens": {
        "radius": { "lg": 4, "xl": 4, "xxl": 6 },
        "spacing": { "xs": 6, "sm": 8, "md": 12, "lg": 16, "xl": 20 },
        "typeScale": { "display": 38, "h1": 26, "h2": 20, "body": 15, "small": 12 }
      },
      "homeHeader": {
        "greeting": { "en": "Home", "zh": "首页", "ja": "ホーム", "ru": "Главная", "ar": "الرئيسية" },
        "subtitle": {
          "en": "Welcome to Snowmass",
          "zh": "欢迎来到 Snowmass",
          "ja": "Snowmassへようこそ",
          "ru": "Добро пожаловать в Snowmass",
          "ar": "مرحبًا بك في سنوماس"
        },
        "blurIntensity": 0,
        "useGlassEffect": false,
        "backgroundColor": "#F4F4F4",
        "textColor": "#111111",
        "mutedColor": "#111111"
      },
      "navigationBar": {
        "backgroundColor": "#111111",
        "borderTopColor": "#111111",
        "activeTintColor": "#FFFFFF",
        "inactiveTintColor": "#B8B8B8",
        "labelColor": "#FFFFFF",
        "height": 86
      },
      "widgets": {
        "aspenDashboard": {
          "cardRadius": 4,
          "leftCardBackground": "#FFFFFF",
          "rightCardBackground": "#111111",
          "leftNumberColor": "#111111",
          "rightTempColor": "#FFFFFF",
          "rightMetaColor": "#D2D2D2",
          "labelColor": "#333333",
          "borderColor": "#D6D6D6"
        },
        "quickActions": {
          "tileBackground": "#FFFFFF",
          "tileBorderColor": "#D8D8D8",
          "iconColor": "#111111",
          "labelColor": "#111111",
          "columns": 4,
          "tileRadius": 4
        },
        "cardCarousel": {
          "cardWidth": 240,
          "titleColor": "#111111",
          "subtitleColor": "#444444",
          "cardBackground": "#FFFFFF",
          "cardBorderColor": "#D9D9D9",
          "titleSize": 18
        },
        "list": {
          "titleColor": "#111111",
          "rowTitleColor": "#111111",
          "rowSubtitleColor": "#565656",
          "chevronColor": "#7A7A7A",
          "dividerColor": "#E3E3E3"
        },
        "infoBanner": {
          "titleColor": "#111111",
          "messageColor": "#4E4E4E",
          "badgeLabel": "Live"
        },
        "webEmbed": {
          "showUrlPreview": false,
          "buttonVariant": "primary"
        }
      }
    },
    "homePage": {
      "schemaVersion": 1,
      "title": "Guest Home",
      "sections": [
        {
          "id": "aspen-dashboard-main",
          "type": "aspenDashboard",
          "props": {
            "leftValue": "20",
            "leftLabel": { "en": "Summer Days", "zh": "夏季天数", "ja": "サマーデイズ", "ru": "Летние дни", "ar": "أيام الصيف" },
            "leftCta": { "en": "View Stats", "zh": "查看数据", "ja": "統計を見る", "ru": "Смотреть статистику", "ar": "عرض الإحصائيات" },
            "temperature": "85°",
            "condition": { "en": "Sunny", "zh": "晴", "ja": "晴れ", "ru": "Солнечно", "ar": "مشمس" },
            "high": "90°",
            "low": "82°",
            "updatedAt": {
              "en": "Last Update: 2:10pm",
              "zh": "最近更新：2:10pm",
              "ja": "最終更新：2:10pm",
              "ru": "Обновлено: 2:10pm",
              "ar": "آخر تحديث: 2:10pm"
            }
          }
        },
        {
          "id": "quick-actions",
          "type": "quickActions",
          "props": {
            "title": "",
            "actions": [
              { "id": "lift", "label": { "en": "Mtns", "zh": "山地", "ja": "山", "ru": "Горы", "ar": "الجبال" }, "icon": "mountain", "route": "/poi/lifts", "module": "ski" },
              { "id": "cams", "label": { "en": "Cams", "zh": "摄像头", "ja": "カメラ", "ru": "Камеры", "ar": "الكاميرات" }, "icon": "timer", "route": "/poi/wait-times", "module": "ski" },
              { "id": "map", "label": { "en": "Maps", "zh": "地图", "ja": "マップ", "ru": "Карты", "ar": "الخرائط" }, "icon": "flag", "route": "/poi/slopes", "module": "park" },
              { "id": "shop", "label": { "en": "Shop", "zh": "商店", "ja": "ショップ", "ru": "Магазин", "ar": "المتجر" }, "icon": "ticket", "route": "/event/shows", "module": "park" }
            ]
          }
        },
        {
          "id": "offers-carousel",
          "type": "cardCarousel",
          "props": {
            "title": "",
            "items": [
              {
                "id": "offer-1",
                "title": { "en": "Aspen Valley", "zh": "阿斯本山谷", "ja": "アスペンバレー", "ru": "Долина Аспен", "ar": "وادي أسبن" },
                "subtitle": { "en": "Sit Amet", "zh": "精选推荐", "ja": "おすすめ", "ru": "Рекомендация", "ar": "موصى به" },
                "image": "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=60",
                "route": "/offer/offer-1"
              },
              {
                "id": "offer-2",
                "title": { "en": "Snowmass Lodge", "zh": "斯诺马斯旅馆", "ja": "スノーマスロッジ", "ru": "Лодж Snowmass", "ar": "نُزل سنوماس" },
                "subtitle": { "en": "Sit Amet", "zh": "精选推荐", "ja": "おすすめ", "ru": "Рекомендация", "ar": "موصى به" },
                "image": "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=900&q=60",
                "route": "/offer/offer-2"
              },
              {
                "id": "offer-3",
                "title": { "en": "Mountain Trail", "zh": "山地步道", "ja": "マウンテントレイル", "ru": "Горная тропа", "ar": "مسار الجبل" },
                "subtitle": { "en": "Sit Amet", "zh": "精选推荐", "ja": "おすすめ", "ru": "Рекомендация", "ar": "موصى به" },
                "image": "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=900&q=60",
                "route": "/offer/offer-3"
              }
            ]
          }
        },
        {
          "id": "module-highlights",
          "type": "infoBanner",
          "props": {
            "title": { "en": "Lift Stats", "zh": "缆车状态", "ja": "リフト状況", "ru": "Статистика подъемников", "ar": "إحصائيات المصاعد" },
            "message": {
              "en": "Elk Camp Gondola · 5 min wait",
              "zh": "Elk Camp 缆车 · 等待 5 分钟",
              "ja": "Elk Camp ゴンドラ・待ち時間 5 分",
              "ru": "Гондола Elk Camp · ожидание 5 мин",
              "ar": "تلفريك Elk Camp · انتظار 5 دقائق"
            },
            "variant": "moduleHighlights"
          }
        },
        {
          "id": "web-conditions",
          "type": "webEmbed",
          "props": {
            "title": { "en": "Operating Dates", "zh": "开放日期", "ja": "営業日程", "ru": "Даты работы", "ar": "مواعيد التشغيل" },
            "url": "https://www.example.com/conditions",
            "buttonLabel": { "en": "Open", "zh": "打开", "ja": "開く", "ru": "Открыть", "ar": "فتح" }
          }
        }
      ]
    }
  }
  $json$::jsonb
)
on conflict (tenant_id)
do update set
  config = excluded.config,
  updated_at = now();

insert into public.tenant_configs (tenant_id, config)
values
(
  '2',
  $json2$
  {
    "name": "Vail Mountain",
    "theme": {
      "primary": "#0F172A",
      "secondary": "#1E3A8A",
      "background": "#F3F7FF",
      "surface": "#FFFFFF",
      "text": "#0F172A",
      "muted": "#475569",
      "border": "#D6E0F5"
    },
    "enabledModules": { "ski": true, "park": false, "offers": true, "events": true, "commerce": false },
    "supportedLanguages": ["en", "zh", "ja", "ru", "ar"],
    "design": {
      "stylePreset": "mountain-luxury",
      "homeHeader": {
        "greeting": { "en": "Vail Home", "zh": "Vail 首页", "ja": "Vail ホーム", "ru": "Главная Vail", "ar": "الرئيسية Vail" },
        "subtitle": { "en": "Colorado Conditions", "zh": "科罗拉多实况", "ja": "コロラド状況", "ru": "Состояние склонов Колорадо", "ar": "حالة كولورادو" },
        "useGlassEffect": false
      },
      "navigationBar": {
        "backgroundColor": "#0F172A",
        "borderTopColor": "#0F172A",
        "activeTintColor": "#FFFFFF",
        "inactiveTintColor": "#93A3BF",
        "height": 86
      },
      "widgets": { "cardCarousel": { "cardWidth": 240 } }
    },
    "homePage": {
      "schemaVersion": 1,
      "title": "Home",
      "sections": [
        { "id": "vail-dash", "type": "aspenDashboard", "props": { "leftValue": "18", "leftLabel": "Open Lifts", "leftCta": "View Lift Report", "temperature": "28°", "condition": "Snowing", "high": "31°", "low": "20°", "updatedAt": "Last Update: 7:45am" } },
        { "id": "vail-actions", "type": "quickActions", "props": { "actions": [
          { "id": "trails", "label": "Trails", "icon": "mountain", "route": "/poi/lifts", "module": "ski" },
          { "id": "waits", "label": "Lift Waits", "icon": "timer", "route": "/poi/wait-times", "module": "ski" },
          { "id": "weather", "label": "Weather", "icon": "flag", "route": "/poi/slopes", "module": "ski" },
          { "id": "events", "label": "Events", "icon": "ticket", "route": "/event/shows", "module": "ski" }
        ] } },
        { "id": "vail-carousel", "type": "cardCarousel", "props": { "title": "Vail Highlights", "items": [
          { "id": "v1", "title": "Back Bowls", "subtitle": "Fresh tracks", "image": "https://images.unsplash.com/photo-1551524164-6cf2ac3f1a9e?auto=format&fit=crop&w=900&q=60", "route": "/offer/offer-1" },
          { "id": "v2", "title": "Gondola One", "subtitle": "Village access", "image": "https://images.unsplash.com/photo-1534961165762-47a0e9f49d5b?auto=format&fit=crop&w=900&q=60", "route": "/offer/offer-2" }
        ] } },
        { "id": "vail-banner", "type": "infoBanner", "props": { "title": "Mountain Ops", "message": "Blue Sky Basin opens at 9:00 AM." } },
        { "id": "vail-web", "type": "webEmbed", "props": { "title": "Operations", "url": "https://www.vail.com", "buttonLabel": "Open" } }
      ]
    }
  }
  $json2$::jsonb
),
(
  '3',
  $json3$
  {
    "name": "Whistler Blackcomb",
    "theme": {
      "primary": "#1F2937",
      "secondary": "#065F46",
      "background": "#F4F7F8",
      "surface": "#FFFFFF",
      "text": "#111827",
      "muted": "#4B5563",
      "border": "#D8DEE5"
    },
    "enabledModules": { "ski": true, "park": false, "offers": true, "events": true, "commerce": false },
    "supportedLanguages": ["en", "zh", "ja", "ru", "ar"],
    "design": {
      "stylePreset": "mountain-luxury",
      "homeHeader": {
        "greeting": { "en": "Whistler Home", "zh": "Whistler 首页", "ja": "Whistler ホーム", "ru": "Главная Whistler", "ar": "الرئيسية Whistler" },
        "subtitle": { "en": "Blackcomb Peak", "zh": "Blackcomb 山峰", "ja": "ブラックコムピーク", "ru": "Пик Блэккомб", "ar": "قمة بلاككومب" },
        "useGlassEffect": false
      },
      "navigationBar": {
        "backgroundColor": "#1F2937",
        "borderTopColor": "#1F2937",
        "activeTintColor": "#FFFFFF",
        "inactiveTintColor": "#B7C0CA",
        "height": 86
      },
      "widgets": { "cardCarousel": { "cardWidth": 240 } }
    },
    "homePage": {
      "schemaVersion": 1,
      "title": "Home",
      "sections": [
        { "id": "whistler-dash", "type": "aspenDashboard", "props": { "leftValue": "25", "leftLabel": "Trails Open", "leftCta": "View Terrain", "temperature": "-2°", "condition": "Cloudy", "high": "1°", "low": "-6°", "updatedAt": "Last Update: 8:10am" } },
        { "id": "whistler-actions", "type": "quickActions", "props": { "actions": [
          { "id": "mountains", "label": "Mountains", "icon": "mountain", "route": "/poi/lifts", "module": "ski" },
          { "id": "cams", "label": "Cams", "icon": "timer", "route": "/poi/wait-times", "module": "ski" },
          { "id": "maps", "label": "Maps", "icon": "flag", "route": "/poi/slopes", "module": "ski" },
          { "id": "tickets", "label": "Tickets", "icon": "ticket", "route": "/event/shows", "module": "ski" }
        ] } },
        { "id": "whistler-carousel", "type": "cardCarousel", "props": { "title": "Guest Picks", "items": [
          { "id": "w1", "title": "Peak 2 Peak", "subtitle": "Scenic ride", "image": "https://images.unsplash.com/photo-1483366774565-c783b9f70e2c?auto=format&fit=crop&w=900&q=60", "route": "/offer/offer-1" },
          { "id": "w2", "title": "Village Stroll", "subtitle": "Dining and shops", "image": "https://images.unsplash.com/photo-1517659730-9a5f36fbc0d6?auto=format&fit=crop&w=900&q=60", "route": "/offer/offer-2" }
        ] } },
        { "id": "whistler-banner", "type": "infoBanner", "props": { "title": "Ops Update", "message": "Harmony chair delayed 10 minutes." } },
        { "id": "whistler-web", "type": "webEmbed", "props": { "title": "Conditions", "url": "https://www.whistlerblackcomb.com", "buttonLabel": "Open" } }
      ]
    }
  }
  $json3$::jsonb
),
(
  '4',
  $json4$
  {
    "name": "Disneyland Park",
    "theme": {
      "primary": "#111111",
      "secondary": "#E11D48",
      "background": "#FFF7F9",
      "surface": "#FFFFFF",
      "text": "#111111",
      "muted": "#5B5B5B",
      "border": "#F1D5DE"
    },
    "enabledModules": { "ski": false, "park": true, "offers": true, "events": true, "commerce": true },
    "supportedLanguages": ["en", "zh", "ja", "ru", "ar"],
    "design": {
      "stylePreset": "park-energy",
      "homeHeader": {
        "greeting": { "en": "Disneyland", "zh": "迪士尼乐园", "ja": "ディズニーランド", "ru": "Диснейленд", "ar": "ديزني لاند" },
        "subtitle": { "en": "Magic Today", "zh": "今日魔法", "ja": "今日のマジック", "ru": "Магия сегодня", "ar": "سحر اليوم" },
        "useGlassEffect": false
      },
      "navigationBar": {
        "backgroundColor": "#111111",
        "borderTopColor": "#111111",
        "activeTintColor": "#FFFFFF",
        "inactiveTintColor": "#BBBBBB",
        "height": 86
      },
      "widgets": { "cardCarousel": { "cardWidth": 240 } }
    },
    "homePage": {
      "schemaVersion": 1,
      "title": "Home",
      "sections": [
        { "id": "dl-dash", "type": "aspenDashboard", "props": { "leftValue": "32", "leftLabel": "Rides Open", "leftCta": "View Wait Times", "temperature": "76°", "condition": "Clear", "high": "82°", "low": "65°", "updatedAt": "Last Update: 11:30am" } },
        { "id": "dl-actions", "type": "quickActions", "props": { "actions": [
          { "id": "rides", "label": "Rides", "icon": "mountain", "route": "/poi/lifts", "module": "park" },
          { "id": "waits", "label": "Waits", "icon": "timer", "route": "/poi/wait-times", "module": "park" },
          { "id": "map", "label": "Map", "icon": "flag", "route": "/poi/slopes", "module": "park" },
          { "id": "shop", "label": "Shop", "icon": "ticket", "route": "/event/shows", "module": "park" }
        ] } },
        { "id": "dl-carousel", "type": "cardCarousel", "props": { "title": "Park Highlights", "items": [
          { "id": "d1", "title": "Castle Nights", "subtitle": "Evening show", "image": "https://images.unsplash.com/photo-1513883049090-d0b7439799bf?auto=format&fit=crop&w=900&q=60", "route": "/offer/offer-1" },
          { "id": "d2", "title": "Adventureland", "subtitle": "Family rides", "image": "https://images.unsplash.com/photo-1472437774355-71ab6752b434?auto=format&fit=crop&w=900&q=60", "route": "/offer/offer-2" }
        ] } },
        { "id": "dl-banner", "type": "infoBanner", "props": { "title": "Parade", "message": "Main Street parade begins at 4:00 PM." } },
        { "id": "dl-web", "type": "webEmbed", "props": { "title": "Plan Your Day", "url": "https://disneyland.disney.go.com", "buttonLabel": "Open" } }
      ]
    }
  }
  $json4$::jsonb
),
(
  '5',
  $json5$
  {
    "name": "Universal Studios",
    "theme": {
      "primary": "#111827",
      "secondary": "#0EA5E9",
      "background": "#F3F8FB",
      "surface": "#FFFFFF",
      "text": "#111827",
      "muted": "#5A6675",
      "border": "#D4E2EA"
    },
    "enabledModules": { "ski": false, "park": true, "offers": true, "events": true, "commerce": true },
    "supportedLanguages": ["en", "zh", "ja", "ru", "ar"],
    "design": {
      "stylePreset": "park-energy",
      "homeHeader": {
        "greeting": { "en": "Universal", "zh": "环球影城", "ja": "ユニバーサル", "ru": "Universal", "ar": "يونيفرسال" },
        "subtitle": { "en": "Studio Action", "zh": "影城体验", "ja": "スタジオ体験", "ru": "Студийное приключение", "ar": "تجربة الاستوديو" },
        "useGlassEffect": false
      },
      "navigationBar": {
        "backgroundColor": "#111827",
        "borderTopColor": "#111827",
        "activeTintColor": "#FFFFFF",
        "inactiveTintColor": "#B6C3D2",
        "height": 86
      },
      "widgets": { "cardCarousel": { "cardWidth": 240 } }
    },
    "homePage": {
      "schemaVersion": 1,
      "title": "Home",
      "sections": [
        { "id": "us-dash", "type": "aspenDashboard", "props": { "leftValue": "29", "leftLabel": "Rides Open", "leftCta": "Live Waits", "temperature": "81°", "condition": "Sunny", "high": "87°", "low": "70°", "updatedAt": "Last Update: 12:05pm" } },
        { "id": "us-actions", "type": "quickActions", "props": { "actions": [
          { "id": "rides", "label": "Rides", "icon": "mountain", "route": "/poi/lifts", "module": "park" },
          { "id": "shows", "label": "Shows", "icon": "timer", "route": "/poi/wait-times", "module": "park" },
          { "id": "map", "label": "Map", "icon": "flag", "route": "/poi/slopes", "module": "park" },
          { "id": "tickets", "label": "Tickets", "icon": "ticket", "route": "/event/shows", "module": "park" }
        ] } },
        { "id": "us-carousel", "type": "cardCarousel", "props": { "title": "Top Experiences", "items": [
          { "id": "u1", "title": "Night Spectacular", "subtitle": "Lagoon show", "image": "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=900&q=60", "route": "/offer/offer-1" },
          { "id": "u2", "title": "Studio Tour", "subtitle": "Behind the scenes", "image": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=60", "route": "/offer/offer-2" }
        ] } },
        { "id": "us-banner", "type": "infoBanner", "props": { "title": "Park Alert", "message": "WaterWorld show moved to 2:30 PM." } },
        { "id": "us-web", "type": "webEmbed", "props": { "title": "Daily Schedule", "url": "https://www.universalstudios.com", "buttonLabel": "Open" } }
      ]
    }
  }
  $json5$::jsonb
),
(
  '6',
  $json6$
  {
    "name": "Six Flags Magic Mountain",
    "theme": {
      "primary": "#1E1B4B",
      "secondary": "#EA580C",
      "background": "#F7F6FF",
      "surface": "#FFFFFF",
      "text": "#1F2937",
      "muted": "#5B6272",
      "border": "#DAD8F7"
    },
    "enabledModules": { "ski": false, "park": true, "offers": true, "events": true, "commerce": true },
    "supportedLanguages": ["en", "zh", "ja", "ru", "ar"],
    "design": {
      "stylePreset": "park-energy",
      "homeHeader": {
        "greeting": { "en": "Six Flags", "zh": "六旗乐园", "ja": "シックスフラッグス", "ru": "Six Flags", "ar": "سيكس فلاغز" },
        "subtitle": { "en": "Thrill Capital", "zh": "刺激之都", "ja": "スリルの都", "ru": "Столица адреналина", "ar": "عاصمة الإثارة" },
        "useGlassEffect": false
      },
      "navigationBar": {
        "backgroundColor": "#1E1B4B",
        "borderTopColor": "#1E1B4B",
        "activeTintColor": "#FFFFFF",
        "inactiveTintColor": "#BDB9E3",
        "height": 86
      },
      "widgets": { "cardCarousel": { "cardWidth": 240 } }
    },
    "homePage": {
      "schemaVersion": 1,
      "title": "Home",
      "sections": [
        { "id": "sf-dash", "type": "aspenDashboard", "props": { "leftValue": "21", "leftLabel": "Rides Open", "leftCta": "Ride Status", "temperature": "84°", "condition": "Sunny", "high": "90°", "low": "72°", "updatedAt": "Last Update: 1:10pm" } },
        { "id": "sf-actions", "type": "quickActions", "props": { "actions": [
          { "id": "coasters", "label": "Coasters", "icon": "mountain", "route": "/poi/lifts", "module": "park" },
          { "id": "waits", "label": "Waits", "icon": "timer", "route": "/poi/wait-times", "module": "park" },
          { "id": "map", "label": "Map", "icon": "flag", "route": "/poi/slopes", "module": "park" },
          { "id": "passes", "label": "Passes", "icon": "ticket", "route": "/event/shows", "module": "park" }
        ] } },
        { "id": "sf-carousel", "type": "cardCarousel", "props": { "title": "Featured Attractions", "items": [
          { "id": "s1", "title": "Night Ride", "subtitle": "After dark thrills", "image": "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=900&q=60", "route": "/offer/offer-1" },
          { "id": "s2", "title": "Family Zone", "subtitle": "Kid friendly", "image": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=60", "route": "/offer/offer-2" }
        ] } },
        { "id": "sf-banner", "type": "infoBanner", "props": { "title": "Event Notice", "message": "Fireworks tonight at 8:45 PM." } },
        { "id": "sf-web", "type": "webEmbed", "props": { "title": "Plan Visit", "url": "https://www.sixflags.com/magicmountain", "buttonLabel": "Open" } }
      ]
    }
  }
  $json6$::jsonb
)
on conflict (tenant_id)
do update set
  config = excluded.config,
  updated_at = now();

-- Ensure every tenant has webcam widget defaults and at least one webcam grid section.
update public.tenant_configs tc
set config = jsonb_set(
  tc.config,
  '{design,widgets,webcamGrid}',
  coalesce(tc.config #> '{design,widgets,webcamGrid}', '{}'::jsonb) ||
    jsonb_build_object(
      'titleColor', '#111111',
      'subtitleColor', '#5B5B5B',
      'cardBackground', '#FFFFFF',
      'cardBorderColor', '#D9D9D9',
      'badgeLiveBackground', '#16A34A',
      'badgeOfflineBackground', '#6B7280',
      'badgeTextColor', '#FFFFFF',
      'cardRadius', 8,
      'imageHeight', 180
    ),
  true
);

update public.tenant_configs tc
set config = jsonb_set(
  tc.config,
  '{homePage,sections}',
  coalesce(tc.config #> '{homePage,sections}', '[]'::jsonb) ||
    jsonb_build_array(
      jsonb_build_object(
        'id', 'webcams-main',
        'type', 'webcamGrid',
        'props', jsonb_build_object(
          'title', 'Webcams',
          'subtitle', case
            when coalesce((tc.config #>> '{enabledModules,park}')::boolean, false) and not coalesce((tc.config #>> '{enabledModules,ski}')::boolean, false)
              then 'Live park views'
            else 'Live mountain and base views'
          end,
          'items', jsonb_build_array(
            jsonb_build_object(
              'id', 'cam-base-village',
              'title', 'Base Village',
              'subtitle', 'Main plaza',
              'image', 'https://images.unsplash.com/photo-1489447068241-b3490214e879?auto=format&fit=crop&w=1400&q=60',
              'status', 'live',
              'updatedAt', 'Updated 2 min ago',
              'route', '/poi/base-village-cam'
            ),
            jsonb_build_object(
              'id', 'cam-summit',
              'title', 'Summit View',
              'subtitle', 'Peak conditions',
              'image', 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1400&q=60',
              'status', 'live',
              'updatedAt', 'Updated 1 min ago',
              'route', '/poi/summit-cam'
            ),
            jsonb_build_object(
              'id', 'cam-park',
              'title', case
                when coalesce((tc.config #>> '{enabledModules,park}')::boolean, false)
                  then 'Park Zone'
                else 'North Ridge'
              end,
              'subtitle', case
                when coalesce((tc.config #>> '{enabledModules,park}')::boolean, false)
                  then 'Feature line'
                else 'Tree line cam'
              end,
              'image', 'https://images.unsplash.com/photo-1513883049090-d0b7439799bf?auto=format&fit=crop&w=1400&q=60',
              'status', 'offline',
              'updatedAt', 'Last available 18 min ago',
              'route', '/poi/park-cam'
            )
          )
        )
      )
    ),
  true
)
where not exists (
  select 1
  from jsonb_array_elements(coalesce(tc.config #> '{homePage,sections}', '[]'::jsonb)) as section
  where section ->> 'type' = 'webcamGrid'
);

insert into public.notifications (tenant_id, title, body)
values
  ('1', 'Road access update', 'Expect 10 min delays near North Gate.'),
  ('1', 'Evening lights show', 'Starts at 19:00 in Park Plaza.'),
  ('2', 'Lift wind hold', 'Blue Sky lift delayed due to gusts.'),
  ('3', 'Fresh snow alert', '12cm overnight on alpine terrain.'),
  ('4', 'Parade reminder', 'Main Street parade at 4:00 PM.'),
  ('5', 'Show update', 'WaterWorld moved to 2:30 PM.'),
  ('6', 'Ride alert', 'X2 wait time currently 45 minutes.')
on conflict do nothing;

commit;
