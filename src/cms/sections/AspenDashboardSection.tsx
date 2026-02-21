import React from "react";
import { Text, View } from "react-native";
import type { AspenDashboardSection as AspenDashboardSectionType } from "@/cms/schema";
import type { SectionComponentProps } from "@/cms/types";
import { mergeWidgetAppearance } from "@/cms/appearance";
import { resolveLocalizedText } from "@/i18n/localize";
import { useTheme } from "@/theme/ThemeProvider";

export function AspenDashboardSection({ section, context }: SectionComponentProps<AspenDashboardSectionType>) {
  const { theme } = useTheme();
  const appearance = mergeWidgetAppearance(context.tenant, "aspenDashboard", section.props.appearance);

  return (
    <View className="flex-row" style={{ gap: 10 }}>
      <View
        className="flex-1 border p-3"
        style={{
          borderRadius: appearance.cardRadius ?? 4,
          borderColor: appearance.borderColor ?? theme.colors.border,
          backgroundColor: appearance.leftCardBackground ?? theme.colors.surface
        }}
      >
        <Text className="font-inter-semibold" style={{ fontSize: 52, lineHeight: 56, color: appearance.leftNumberColor ?? theme.colors.text }}>
          {section.props.leftValue}
        </Text>
        <Text className="font-inter-medium text-[14px]" style={{ color: appearance.labelColor ?? theme.colors.muted }}>
          {resolveLocalizedText(section.props.leftLabel)}
        </Text>
        {section.props.leftCta ? (
          <Text className="mt-3 font-inter-medium text-[12px]" style={{ color: appearance.labelColor ?? theme.colors.text }}>
            {resolveLocalizedText(section.props.leftCta)}
          </Text>
        ) : null}
      </View>

      <View
        className="flex-[1.15] border p-3"
        style={{
          borderRadius: appearance.cardRadius ?? 4,
          borderColor: appearance.borderColor ?? theme.colors.border,
          backgroundColor: appearance.rightCardBackground ?? "#000"
        }}
      >
        <View className="flex-row items-end">
          <Text className="font-inter-semibold" style={{ fontSize: 48, lineHeight: 52, color: appearance.rightTempColor ?? "#fff" }}>
            {section.props.temperature}
          </Text>
          <Text className="mb-2 ml-2 font-inter-medium text-[13px]" style={{ color: appearance.rightMetaColor ?? "#fff" }}>
            {resolveLocalizedText(section.props.condition)}
          </Text>
        </View>
        <Text className="mt-2 font-inter-medium text-[14px]" style={{ color: appearance.rightMetaColor ?? "#D1D5DB" }}>
          {`↑ ${section.props.high ?? "--"}  ↓ ${section.props.low ?? "--"}`}
        </Text>
        {section.props.updatedAt ? (
          <Text className="mt-3 font-inter text-[11px]" style={{ color: appearance.rightMetaColor ?? "#9CA3AF" }}>
            {resolveLocalizedText(section.props.updatedAt)}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
