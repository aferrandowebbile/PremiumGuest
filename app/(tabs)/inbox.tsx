import React from "react";
import { FlatList, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Bell } from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import { Card, ListRow, SectionHeader } from "@/components";
import { getNotifications } from "@/config/notifications";
import { useTenant } from "@/config/TenantProvider";
import { useTheme } from "@/theme/ThemeProvider";

export default function InboxScreen() {
  const { theme } = useTheme();
  const { tenantId } = useTenant();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const { data } = useQuery({
    queryKey: ["notifications", tenantId],
    queryFn: () => getNotifications(tenantId)
  });

  return (
    <View
      className="flex-1 px-5"
      style={{
        backgroundColor: theme.colors.background,
        paddingTop: insets.top + 8,
        paddingBottom: insets.bottom + 8
      }}
    >
      <SectionHeader title={t("inbox")} subtitle={t("inboxSubtitle")} />
      {!data?.length ? (
        <Card>
          <View className="items-center py-10">
            <View className="mb-3 rounded-full p-4" style={{ backgroundColor: `${theme.colors.primary}15` }}>
              <Bell color={theme.colors.primary} size={26} />
            </View>
            <Text className="font-inter-semibold text-[20px]" style={{ color: theme.colors.text }}>
              {t("allCaughtUp")}
            </Text>
            <Text className="mt-2 text-center font-inter text-[14px]" style={{ color: theme.colors.muted }}>
              {t("noNotificationsDetail")}
            </Text>
          </View>
        </Card>
      ) : (
        <Card>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: insets.bottom + 4 }}
            renderItem={({ item }: { item: any }) => <ListRow title={item.title} subtitle={item.body} />}
          />
        </Card>
      )}
    </View>
  );
}
