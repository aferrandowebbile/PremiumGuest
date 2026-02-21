import React from "react";
import { Text, View } from "react-native";
import { router } from "expo-router";
import type { InfoBannerSection as InfoBannerSectionType } from "@/cms/schema";
import type { SectionComponentProps } from "@/cms/types";
import { mergeWidgetAppearance } from "@/cms/appearance";
import { Badge, Card } from "@/components";
import { resolveLocalizedText } from "@/i18n/localize";
import { useTheme } from "@/theme/ThemeProvider";

export function InfoBannerSection({ section, context }: SectionComponentProps<InfoBannerSectionType>) {
  const { theme } = useTheme();
  const appearance = mergeWidgetAppearance(context.tenant, "infoBanner", section.props.appearance);

  const dynamicMessage =
    section.props.variant === "moduleHighlights"
      ? context.highlightMode === "ski"
        ? "Ski update: 22/24 lifts open, powder depth 38cm, peak wind low."
        : "Park update: Avg wait 14 min, 3 shows running in the next 2 hours."
      : section.props.message;
  const title = resolveLocalizedText(section.props.title);
  const message = resolveLocalizedText(dynamicMessage);
  const badge = resolveLocalizedText(appearance.badgeLabel) || (context.highlightMode === "ski" ? "Ski" : "Park");

  return (
    <Card
      onPress={() =>
        router.push({
          pathname: `/event/${section.id}` as never,
          params: {
            title,
            subtitle: message,
            badge,
            body: `${message} This highlight is configurable from the management console for each tenant.`
          }
        })
      }
    >
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="font-inter-semibold text-[20px]" style={{ color: appearance.titleColor ?? theme.colors.text }}>
          {title}
        </Text>
        <Badge label={badge} backgroundColor={appearance.badgeBackground} textColor={appearance.badgeTextColor} />
      </View>
      <Text className="font-inter text-[16px]" style={{ color: appearance.messageColor ?? theme.colors.muted }}>
        {message}
      </Text>
    </Card>
  );
}
