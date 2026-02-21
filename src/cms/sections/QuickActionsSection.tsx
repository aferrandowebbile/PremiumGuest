import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Flag, Mountain, Ticket, Timer, type LucideIcon } from "lucide-react-native";
import type { QuickActionItem, QuickActionsSection as QuickActionsSectionType } from "@/cms/schema";
import type { SectionComponentProps } from "@/cms/types";
import { mergeWidgetAppearance } from "@/cms/appearance";
import { resolveLocalizedText } from "@/i18n/localize";
import { useTheme } from "@/theme/ThemeProvider";

const iconMap: Record<string, LucideIcon> = {
  mountain: Mountain,
  flag: Flag,
  timer: Timer,
  ticket: Ticket
};

export function QuickActionsSection({ section, context }: SectionComponentProps<QuickActionsSectionType>) {
  const { theme } = useTheme();
  const appearance = mergeWidgetAppearance(context.tenant, "quickActions", section.props.appearance);
  const columns = appearance.columns ?? 4;
  const widthPercent: `${number}%` = `${Math.max(18, Math.floor(100 / columns) - 2)}%`;

  const actions = useMemo(() => {
    return section.props.actions.filter((action: QuickActionItem) => {
      if (!action.module) return true;
      return Boolean(context.tenant?.enabledModules[action.module]);
    });
  }, [section.props.actions, context.tenant]);

  return (
    <View>
      {section.props.title ? (
        <Text className="mb-3 font-inter-semibold text-[20px]" style={{ color: appearance.titleColor ?? theme.colors.text }}>
          {resolveLocalizedText(section.props.title)}
        </Text>
      ) : null}
      <View className="flex-row flex-wrap justify-between gap-y-3">
        {actions.map((action: QuickActionItem) => {
          const Icon = iconMap[action.icon] ?? Mountain;
          return (
            <Pressable
              key={action.id}
              onPress={() => (action.route ? router.push(action.route as never) : undefined)}
              style={{ width: widthPercent, alignItems: "center" }}
            >
              <View
                className="items-center justify-center border"
                style={{
                  height: 56,
                  width: 56,
                  borderRadius: appearance.tileRadius ?? theme.radius.xl,
                  backgroundColor: appearance.tileBackground ?? theme.colors.surface,
                  borderColor: appearance.tileBorderColor ?? theme.colors.border
                }}
              >
                <Icon size={appearance.iconSize ?? 20} color={appearance.iconColor ?? theme.colors.text} />
              </View>
              <Text className="mt-2 text-center font-inter text-[13px]" style={{ color: appearance.labelColor ?? theme.colors.text }}>
                {resolveLocalizedText(action.label)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
