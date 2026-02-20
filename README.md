# Experiences Guest App (Expo + Supabase)

Premium white-label guest app starter for ski resorts + parks/attractions.

## Stack

- Expo + TypeScript + expo-router
- NativeWind (Tailwind-style classes)
- TanStack Query + AsyncStorage cache
- Supabase (tenant config, notifications, storage)
- i18next (language skeleton + RTL hook)
- FlashList for performant list rendering

## Run

1. Install deps:

```bash
npm install
```

2. Set environment variables in `.env`:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_TENANT_ID` (example: `1`)
- `SUPABASE_SERVICE_ROLE_KEY` (required for server jobs/edge functions)
- `SUPABASE_PROJECT_ID` (used by Supabase CLI)
- `SUPABASE_DB_PASSWORD` and `SUPABASE_ACCESS_TOKEN` (used by Supabase CLI commands)

3. Apply Supabase SQL migrations (`supabase/migrations/*.sql`) in your Supabase project.

4. Add tenant rows:

- `tenants.tenant_id`: numeric string (`1`, `2`, `3`, ...)
- `tenants.slug`: stable brand slug (`aspen-snowmass`, `whistler-blackcomb`, `vail`, `moreys-piers`)
- `tenants.name`: display name

5. Add at least one row to `tenant_configs` where:

- `tenant_id` matches `EXPO_PUBLIC_TENANT_ID`
- `config` stores the JSON payload matching `TenantConfigSchema` in `/src/config/types.ts`

5. Start app:

```bash
npm run start
```

## Architecture Notes

- Server-side config and storage are Supabase-based (`tenant_configs`, `notifications`, `guest-assets`).
- Home screen is CMS/page-builder driven with typed schema + section registry (`/src/cms`).
- Unknown CMS section types render safe fallback cards.
- Runtime module gating uses `enabledModules` in tenant config.
- Language selector is in Account; Arabic triggers RTL best-effort via `I18nManager`.
