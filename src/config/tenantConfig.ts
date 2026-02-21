import AsyncStorage from "@react-native-async-storage/async-storage";
import mockTenantConfig from "@/config/mockTenantConfig.json";
import { env } from "@/config/env";
import { supabaseClient } from "@/config/supabaseClient";
import { TenantConfigSchema, type TenantConfig } from "@/config/types";
import { KnownSectionSchema } from "@/cms/schema";

const CACHE_KEY_PREFIX = "tenant-config";

type TenantConfigRow = {
  tenant_id: string;
  config: unknown;
};

type TenantRow = {
  tenant_id: string;
  slug: string;
  name: string;
};

const getCacheKey = (tenantId: string) => `${CACHE_KEY_PREFIX}:${tenantId}`;
const TENANT_OPTIONS_CACHE_KEY = "tenant-options";

export type TenantConfigLoadSource = "supabase" | "cache" | "mock" | "emergency";

export type TenantConfigLoadMeta = {
  tenantId: string;
  source: TenantConfigLoadSource;
  sections: number;
  loadedAt: string;
  error?: string;
};

export type TenantOption = {
  id: string;
  slug: string;
  name: string;
};

let lastLoadMeta: TenantConfigLoadMeta = {
  tenantId: "unknown",
  source: "emergency",
  sections: 0,
  loadedAt: new Date(0).toISOString()
};

function setLoadMeta(config: TenantConfig, source: TenantConfigLoadSource, error?: string) {
  lastLoadMeta = {
    tenantId: config.tenantId,
    source,
    sections: config.homePage.sections.length,
    loadedAt: new Date().toISOString(),
    error
  };
}

export function getTenantConfigLoadMeta(): TenantConfigLoadMeta {
  return lastLoadMeta;
}

function unwrapCandidate(candidate: unknown): unknown {
  if (candidate && typeof candidate === "object" && "default" in (candidate as Record<string, unknown>)) {
    return (candidate as { default: unknown }).default;
  }
  return candidate;
}

function normalizeFallbackConfig(candidate: unknown, tenantId: string): TenantConfig {
  const unwrapped = unwrapCandidate(candidate);
  const direct = TenantConfigSchema.safeParse(unwrapped);
  if (direct.success) return direct.data;

  const record = unwrapped && typeof unwrapped === "object" ? (unwrapped as Record<string, unknown>) : {};
  const pageRecord =
    record.homePage && typeof record.homePage === "object" ? (record.homePage as Record<string, unknown>) : {};
  const rawSections = Array.isArray(pageRecord.sections) ? pageRecord.sections : [];
  const safeSections = rawSections.map((section, index) => {
    const parsedSection = KnownSectionSchema.safeParse(section);
    if (parsedSection.success) return parsedSection.data;
    const sectionRecord = section && typeof section === "object" ? (section as Record<string, unknown>) : {};
    return {
      id: typeof sectionRecord.id === "string" ? sectionRecord.id : `fallback-${index}`,
      type: typeof sectionRecord.type === "string" ? sectionRecord.type : "unsupported",
      props: sectionRecord.props && typeof sectionRecord.props === "object" ? sectionRecord.props : {},
      style: undefined
    };
  });

  const repaired = TenantConfigSchema.safeParse({
    tenantId: typeof record.tenantId === "string" ? record.tenantId : tenantId,
    name: typeof record.name === "string" ? record.name : "Premium Guest",
    theme: record.theme ?? {},
    enabledModules: record.enabledModules ?? {
      ski: true,
      park: true,
      offers: true,
      events: true,
      commerce: false
    },
    supportedLanguages: record.supportedLanguages ?? ["en"],
    design: record.design ?? {
      stylePreset: "minimal-clean",
      tokens: {},
      homeHeader: {},
      navigationBar: {},
      widgets: {}
    },
    homePage: {
      schemaVersion: 1,
      title: typeof pageRecord.title === "string" ? pageRecord.title : "Home",
      sections: safeSections
    }
  });

  if (repaired.success) return repaired.data;
  return buildEmergencyConfig(tenantId);
}

function getAspenBaseline(tenantId: string): TenantConfig {
  const baseline = normalizeFallbackConfig(mockTenantConfig, tenantId);
  return {
    ...baseline,
    tenantId
  };
}

function mergeWithAspenBaseline(config: TenantConfig, tenantId: string): TenantConfig {
  const baseline = getAspenBaseline(tenantId);
  const hasAspenDashboard = config.homePage.sections.some((section) => section.type === "aspenDashboard");

  return TenantConfigSchema.parse({
    tenantId,
    name: config.name || baseline.name,
    theme: {
      ...baseline.theme,
      ...config.theme
    },
    enabledModules: {
      ...baseline.enabledModules,
      ...config.enabledModules
    },
    supportedLanguages: config.supportedLanguages?.length ? config.supportedLanguages : baseline.supportedLanguages,
    design: {
      stylePreset: config.design?.stylePreset ?? baseline.design.stylePreset,
      tokens: {
        ...baseline.design.tokens,
        ...(config.design?.tokens ?? {})
      },
      homeHeader: {
        ...baseline.design.homeHeader,
        ...(config.design?.homeHeader ?? {})
      },
      navigationBar: {
        ...baseline.design.navigationBar,
        ...(config.design?.navigationBar ?? {})
      },
      widgets: {
        ...baseline.design.widgets,
        ...(config.design?.widgets ?? {})
      }
    },
    homePage: hasAspenDashboard
      ? config.homePage
      : {
          ...baseline.homePage,
          title: config.homePage.title || baseline.homePage.title
        }
  });
}

const buildEmergencyConfig = (tenantId: string): TenantConfig =>
  TenantConfigSchema.parse({
    tenantId,
    name: "Premium Guest",
    theme: {},
    enabledModules: {
      ski: true,
      park: true,
      offers: true,
      events: true,
      commerce: false
    },
    supportedLanguages: ["en"],
    design: {
      stylePreset: "minimal-clean",
      tokens: {},
      homeHeader: {},
      navigationBar: {},
      widgets: {}
    },
    homePage: {
      schemaVersion: 1,
      title: "Home",
      sections: []
    }
  });

const buildOfflineFallbackConfig = (tenantId: string): TenantConfig =>
  TenantConfigSchema.parse({
    tenantId,
    name: "Premium Guest",
    theme: {
      primary: "#111111",
      background: "#F4F4F4",
      surface: "#FFFFFF",
      text: "#111111",
      muted: "#555555",
      border: "#DADADA"
    },
    enabledModules: {
      ski: true,
      park: true,
      offers: true,
      events: true,
      commerce: false
    },
    supportedLanguages: ["en"],
    design: {
      stylePreset: "aspen-editorial",
      tokens: {},
      homeHeader: {
        greeting: "Home",
        useGlassEffect: false
      },
      navigationBar: {
        backgroundColor: "#111111",
        borderTopColor: "#111111",
        activeTintColor: "#FFFFFF",
        inactiveTintColor: "#B8B8B8"
      },
      widgets: {}
    },
    homePage: {
      schemaVersion: 1,
      title: "Home",
      sections: [
        {
          id: "offline-banner",
          type: "infoBanner",
          props: {
            title: "Offline Mode",
            message: "Using local fallback content. Check Supabase/network settings."
          }
        }
      ]
    }
  });

async function readCachedConfig(tenantId: string): Promise<TenantConfig | null> {
  const cached = await AsyncStorage.getItem(getCacheKey(tenantId));
  if (!cached) return null;

  try {
    const parsed = JSON.parse(cached);
    return TenantConfigSchema.parse(parsed);
  } catch {
    return null;
  }
}

async function writeCachedConfig(tenantId: string, config: TenantConfig) {
  await AsyncStorage.setItem(getCacheKey(tenantId), JSON.stringify(config));
}

async function readCachedTenantOptions(): Promise<TenantOption[]> {
  const cached = await AsyncStorage.getItem(TENANT_OPTIONS_CACHE_KEY);
  if (!cached) return [];

  try {
    const parsed = JSON.parse(cached) as TenantOption[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeCachedTenantOptions(options: TenantOption[]) {
  await AsyncStorage.setItem(TENANT_OPTIONS_CACHE_KEY, JSON.stringify(options));
}

async function fetchTenantConfigFromSupabase(tenantId: string) {
  const parseValidated = (row: TenantConfigRow | undefined): TenantConfig => {
    if (!row) throw new Error("Tenant config not found");
    const parsed = TenantConfigSchema.safeParse({
      tenantId: row.tenant_id,
      ...(row.config as Record<string, unknown>)
    });
    if (!parsed.success) {
      throw new Error(`Tenant config schema invalid: ${parsed.error.issues[0]?.message ?? "unknown schema issue"}`);
    }
    return mergeWithAspenBaseline(parsed.data, tenantId);
  };

  const strategyErrors: string[] = [];

  try {
    const { data, error } = await supabaseClient
      .from("tenant_configs")
      .select("tenant_id, config")
      .eq("tenant_id", tenantId)
      .single();
    if (error) throw new Error(error.message);
    const validated = parseValidated(data as TenantConfigRow | undefined);
    await writeCachedConfig(tenantId, validated);
    return validated;
  } catch (error) {
    strategyErrors.push(`supabase-js: ${error instanceof Error ? error.message : "unknown error"}`);
  }

  const baseUrl = env.supabaseUrl.replace(/\/$/, "");
  const url = `${baseUrl}/rest/v1/tenant_configs?tenant_id=eq.${encodeURIComponent(tenantId)}&select=tenant_id,config&limit=1`;

  const tryRest = async (name: string, headers: Record<string, string>): Promise<TenantConfig> => {
    let response: Response | undefined;
    let lastNetworkError: string | undefined;

    for (let attempt = 1; attempt <= 1; attempt += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      try {
        response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...headers
          },
          signal: controller.signal
        });
        clearTimeout(timeout);
        break;
      } catch (error) {
        clearTimeout(timeout);
        lastNetworkError = error instanceof Error ? error.message : "Network request failed";
      }
    }

    if (!response) {
      throw new Error(`${name} network failed after retries: ${lastNetworkError ?? "unknown network error"}`);
    }
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(`${name} HTTP ${response.status}${body ? `: ${body.slice(0, 180)}` : ""}`);
    }

    const rows = (await response.json().catch(() => [])) as TenantConfigRow[];
    const validated = parseValidated(Array.isArray(rows) ? rows[0] : undefined);
    await writeCachedConfig(tenantId, validated);
    return validated;
  };

  try {
    return await tryRest("rest+auth", {
      apikey: env.supabaseAnonKey,
      Authorization: `Bearer ${env.supabaseAnonKey}`
    });
  } catch (error) {
    strategyErrors.push(error instanceof Error ? error.message : "rest+auth unknown error");
  }

  try {
    return await tryRest("rest+apikey", {
      apikey: env.supabaseAnonKey
    });
  } catch (error) {
    strategyErrors.push(error instanceof Error ? error.message : "rest+apikey unknown error");
  }

  throw new Error(`Supabase fetch failed for tenant ${tenantId}: ${strategyErrors.join(" | ")}`);
}

export async function getTenantConfig(tenantId: string): Promise<TenantConfig> {
  const cached = await readCachedConfig(tenantId);

  try {
    const supabaseConfig = await fetchTenantConfigFromSupabase(tenantId);
    setLoadMeta(supabaseConfig, "supabase");
    return supabaseConfig;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown tenant config error";
    if (cached && cached.homePage.sections.length > 0) {
      setLoadMeta(cached, "cache", errorMessage);
      return cached;
    }

    // Local fallback keeps the app runnable before Supabase seed is done.
    const normalizedFallback = normalizeFallbackConfig(mockTenantConfig, tenantId);
    const fallback =
      normalizedFallback.homePage.sections.length > 0 ? normalizedFallback : buildOfflineFallbackConfig(tenantId);
    const fallbackSource: TenantConfigLoadSource = fallback.homePage.sections.length > 0 ? "mock" : "emergency";
    setLoadMeta(fallback, fallbackSource, errorMessage);
    await writeCachedConfig(tenantId, fallback);
    return fallback;
  }
}

export async function getTenantOptions(): Promise<TenantOption[]> {
  const cached = await readCachedTenantOptions();
  const parseRows = (rows: TenantRow[] | null | undefined): TenantOption[] =>
    (rows ?? [])
      .map((row) => ({
        id: row.tenant_id,
        slug: row.slug,
        name: row.name
      }))
      .filter((row) => row.id && row.slug && row.name);

  try {
    const { data, error } = await supabaseClient.from("tenants").select("tenant_id, slug, name").order("name");
    if (error) throw new Error(error.message);
    const options = parseRows(data as TenantRow[] | null);
    if (options.length > 0) {
      await writeCachedTenantOptions(options);
      return options;
    }
  } catch {
    // Fall through to REST strategy.
  }

  const baseUrl = env.supabaseUrl.replace(/\/$/, "");
  const url = `${baseUrl}/rest/v1/tenants?select=tenant_id,slug,name&order=name.asc`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        apikey: env.supabaseAnonKey,
        Authorization: `Bearer ${env.supabaseAnonKey}`
      }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const rows = (await response.json()) as TenantRow[];
    const options = parseRows(rows);
    if (options.length > 0) {
      await writeCachedTenantOptions(options);
      return options;
    }
  } catch {
    // Fall through to local fallback.
  }

  if (cached.length > 0) return cached;
  return [{ id: env.tenantId, slug: "default", name: "Default Tenant" }];
}
