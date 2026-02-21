import React from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { Card, SectionHeader } from "@/components";
import { useTenant } from "@/config/TenantProvider";
import { useTheme } from "@/theme/ThemeProvider";

const TEST_LANGUAGES = ["zh", "ja", "ru", "ar"];

export default function AccountScreen() {
  const { config, tenantId, availableTenants, isTenantsLoading, setTenantId } = useTenant();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const configured = config?.supportedLanguages ?? ["en"];
  const languages = Array.from(new Set([...configured, ...TEST_LANGUAGES]));
  const tenantOptions =
    availableTenants.length > 0
      ? availableTenants
      : [{ id: tenantId, slug: "current", name: config?.name ?? `Tenant ${tenantId}` }];

  return (
    <View
      className="flex-1 px-5"
      style={{
        backgroundColor: theme.colors.background,
        paddingTop: insets.top + 8,
        paddingBottom: insets.bottom + 8
      }}
    >
      <SectionHeader title={t("account")} subtitle={t("accountSubtitle")} />

      <Card>
        <Text className="font-inter-semibold text-[20px]" style={{ color: theme.colors.text }}>
          {t("destination")}
        </Text>
        <View className="mt-4 flex-row flex-wrap gap-2">
          {tenantOptions.map((tenant) => {
            const selected = tenant.id === tenantId;
            return (
              <Pressable
                key={tenant.id}
                onPress={() => void setTenantId(tenant.id)}
                className="rounded-full border px-4 py-2"
                style={{
                  borderColor: selected ? theme.colors.primary : theme.colors.border,
                  backgroundColor: selected ? `${theme.colors.primary}20` : theme.colors.surface
                }}
              >
                <Text className="font-inter-medium text-[14px]" style={{ color: selected ? theme.colors.primary : theme.colors.text }}>
                  {tenant.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text className="mt-3 font-inter text-[13px]" style={{ color: theme.colors.muted }}>
          {isTenantsLoading ? t("loadingDestinations") : t("destinationHint")}
        </Text>
      </Card>

      <Card>
        <Text className="font-inter-semibold text-[20px]" style={{ color: theme.colors.text }}>
          {t("language")}
        </Text>
        <View className="mt-4 flex-row flex-wrap gap-2">
          {languages.map((languageCode: string) => {
            const selected = i18n.language === languageCode;
            return (
              <Pressable
                key={languageCode}
                onPress={() => void i18n.changeLanguage(languageCode)}
                className="rounded-full border px-4 py-2"
                style={{
                  borderColor: selected ? theme.colors.primary : theme.colors.border,
                  backgroundColor: selected ? `${theme.colors.primary}20` : theme.colors.surface
                }}
              >
                <Text className="font-inter-medium text-[14px]" style={{ color: selected ? theme.colors.primary : theme.colors.text }}>
                  {languageCode.toUpperCase()}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text className="mt-4 font-inter text-[13px]" style={{ color: theme.colors.muted }}>
          {t("rtlHint")}
        </Text>
      </Card>
    </View>
  );
}
