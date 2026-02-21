import React, { useMemo, useState } from "react";
import { RefreshControl, ScrollView, Text, View, Pressable } from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { CMSRenderer } from "@/cms/Renderer";
import { Avatar, Card, Skeleton } from "@/components";
import { useTenant } from "@/config/TenantProvider";
import { getActiveHighlightModes } from "@/modules/gating";
import { useTheme } from "@/theme/ThemeProvider";
import { resolveLocalizedText } from "@/i18n/localize";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { config, isLoading, error, debug, refetch } = useTenant();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);

  const modes = getActiveHighlightModes(config);
  const [highlightMode, setHighlightMode] = useState<"ski" | "park">(modes.park ? "park" : "ski");

  const page = useMemo(() => config?.homePage, [config]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const debugPanel = (
    <Card>
      <Text className="font-inter-semibold text-[14px]" style={{ color: theme.colors.text }}>
        Debug: Home Config
      </Text>
      <Text className="mt-1 font-inter text-[12px]" style={{ color: theme.colors.muted }}>
        tenantId: {debug.loadMeta.tenantId}
      </Text>
      <Text className="font-inter text-[12px]" style={{ color: theme.colors.muted }}>
        supabase: {debug.supabaseHost}
      </Text>
      <Text className="font-inter text-[12px]" style={{ color: theme.colors.muted }}>
        key: {debug.keyPrefix}...
      </Text>
      <Text className="font-inter text-[12px]" style={{ color: theme.colors.muted }}>
        source: {debug.loadMeta.source}
      </Text>
      <Text className="font-inter text-[12px]" style={{ color: theme.colors.muted }}>
        sections: {debug.loadMeta.sections}
      </Text>
      <Text className="font-inter text-[12px]" style={{ color: theme.colors.muted }}>
        query: {debug.queryStatus} / {debug.fetchStatus} (failures: {debug.failureCount})
      </Text>
      <Text className="font-inter text-[12px]" style={{ color: theme.colors.muted }}>
        loadedAt: {debug.loadMeta.loadedAt}
      </Text>
      {debug.loadMeta.error ? (
        <Text className="mt-1 font-inter text-[12px]" style={{ color: theme.colors.warning }}>
          error: {debug.loadMeta.error}
        </Text>
      ) : null}
    </Card>
  );

  if (isLoading) {
    return (
      <View className="flex-1 px-5" style={{ backgroundColor: theme.colors.background, paddingTop: insets.top + 12 }}>
        {debugPanel}
        <Skeleton height={72} />
        <Skeleton height={220} />
        <Skeleton height={90} />
        <Skeleton height={130} />
      </View>
    );
  }
  if (!config) {
    return (
      <View className="flex-1 px-5" style={{ backgroundColor: theme.colors.background, paddingTop: insets.top + 12 }}>
        {debugPanel}
        <Card>
          <Text className="font-inter-semibold text-[18px]" style={{ color: theme.colors.text }}>
            {t("unableToLoadHome")}
          </Text>
          <Text className="mt-2 font-inter text-[14px]" style={{ color: theme.colors.muted }}>
            {error ?? t("tenantUnavailable")}
          </Text>
          <Pressable
            onPress={() => {
              void refetch();
            }}
            className="mt-4 self-start rounded-xl px-4 py-2"
            style={{ backgroundColor: theme.colors.primary }}
          >
            <Text className="font-inter-semibold text-[14px]" style={{ color: "#fff" }}>
              {t("retry")}
            </Text>
          </Pressable>
        </Card>
      </View>
    );
  }
  const headerStyle = config.design.homeHeader;

  return (
    <View className="flex-1" style={{ backgroundColor: theme.colors.background }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        stickyHeaderIndices={[0]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <BlurView
          intensity={headerStyle.blurIntensity ?? 50}
          tint={headerStyle.useGlassEffect === false ? "light" : "systemMaterial"}
          className="px-5 pb-3"
          style={{ paddingTop: insets.top + 6, backgroundColor: headerStyle.backgroundColor }}
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="font-inter text-[14px]" style={{ color: headerStyle.mutedColor ?? theme.colors.muted }}>
                {resolveLocalizedText(headerStyle.greeting) || t("welcome")}
              </Text>
              <Text className="font-inter-semibold text-[24px]" style={{ color: headerStyle.textColor ?? theme.colors.text }}>
                {config.name}
              </Text>
              {headerStyle.subtitle ? (
                <Text className="mt-1 font-inter text-[13px]" style={{ color: headerStyle.mutedColor ?? theme.colors.muted }}>
                  {resolveLocalizedText(headerStyle.subtitle)}
                </Text>
              ) : null}
            </View>
            <Avatar label={config.name.slice(0, 2)} />
          </View>
        </BlurView>

        <View className="gap-5 px-5 pt-4">
          {debugPanel}
          {modes.both ? (
            <Card>
              <View className="flex-row rounded-2xl p-1" style={{ backgroundColor: `${theme.colors.muted}15` }}>
                {(["ski", "park"] as const).map((mode) => (
                  <Pressable
                    key={mode}
                    className="flex-1 items-center rounded-xl py-2"
                    onPress={() => setHighlightMode(mode)}
                    style={{
                      backgroundColor: highlightMode === mode ? theme.colors.surface : "transparent"
                    }}
                  >
                    <Text className="font-inter-medium text-[14px]" style={{ color: theme.colors.text }}>
                      {mode === "ski" ? t("ski") : t("park")}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Card>
          ) : null}

          <CMSRenderer
            page={page}
            context={{
              tenant: config,
              highlightMode: modes.ski && !modes.park ? "ski" : highlightMode
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}
