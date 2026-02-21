import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import { env } from "@/config/env";
import {
  getTenantConfig,
  getTenantConfigLoadMeta,
  getTenantOptions,
  type TenantConfigLoadMeta,
  type TenantOption
} from "@/config/tenantConfig";
import type { TenantConfig } from "@/config/types";

const DEFAULT_TENANT_ID = env.tenantId;
const SELECTED_TENANT_KEY = "selected-tenant-id";

type TenantContextValue = {
  tenantId: string;
  availableTenants: TenantOption[];
  isTenantsLoading: boolean;
  config?: TenantConfig;
  isLoading: boolean;
  error?: string;
  debug: {
    queryStatus: string;
    fetchStatus: string;
    failureCount: number;
    supabaseHost: string;
    keyPrefix: string;
    loadMeta: TenantConfigLoadMeta;
  };
  refetch: () => Promise<void>;
  setTenantId: (tenantId: string) => Promise<void>;
};

const TenantContext = createContext<TenantContextValue | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [selectedTenantId, setSelectedTenantId] = useState(DEFAULT_TENANT_ID);
  const [tenantReady, setTenantReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      try {
        const stored = await AsyncStorage.getItem(SELECTED_TENANT_KEY);
        if (mounted && stored?.trim()) setSelectedTenantId(stored.trim());
      } finally {
        if (mounted) setTenantReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const updateTenantId = useCallback(async (tenantId: string) => {
    const normalized = tenantId.trim() || DEFAULT_TENANT_ID;
    setSelectedTenantId(normalized);
    await AsyncStorage.setItem(SELECTED_TENANT_KEY, normalized);
  }, []);

  const query = useQuery({
    queryKey: ["tenant-config", selectedTenantId],
    queryFn: () => getTenantConfig(selectedTenantId),
    enabled: tenantReady,
    retry: false
  });
  const tenantsQuery = useQuery({
    queryKey: ["tenant-options"],
    queryFn: getTenantOptions,
    retry: false
  });
  const loadMeta = getTenantConfigLoadMeta();
  const effectiveTenantId = loadMeta.tenantId === "unknown" ? selectedTenantId : loadMeta.tenantId;
  const effectiveSections = query.data?.homePage.sections.length ?? loadMeta.sections;

  const value = useMemo<TenantContextValue>(
    () => ({
      tenantId: selectedTenantId,
      availableTenants: tenantsQuery.data ?? [],
      isTenantsLoading: tenantsQuery.isLoading,
      config: query.data,
      isLoading: !tenantReady || query.isLoading,
      error: query.error instanceof Error ? query.error.message : undefined,
      debug: {
        queryStatus: query.status,
        fetchStatus: query.fetchStatus,
        failureCount: query.failureCount,
        supabaseHost: env.supabaseUrl,
        keyPrefix: env.supabaseAnonKey.slice(0, 16),
        loadMeta: {
          ...loadMeta,
          tenantId: effectiveTenantId,
          sections: effectiveSections
        }
      },
      refetch: async () => {
        await query.refetch();
      },
      setTenantId: updateTenantId
    }),
    [
      query.data,
      query.isLoading,
      query.error,
      query.status,
      query.fetchStatus,
      query.failureCount,
      query,
      selectedTenantId,
      tenantsQuery.data,
      tenantsQuery.isLoading,
      tenantReady,
      loadMeta,
      effectiveTenantId,
      effectiveSections,
      updateTenantId
    ]
  );

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) throw new Error("useTenant must be used within TenantProvider");
  return context;
}
