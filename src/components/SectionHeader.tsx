import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  titleColor?: string;
  subtitleColor?: string;
};

export function SectionHeader({ title, subtitle, titleColor, subtitleColor }: SectionHeaderProps) {
  const { theme } = useTheme();

  return (
    <View className="mb-3 flex-row items-end justify-between">
      <View className="flex-1">
        <Text className="font-inter-semibold text-[20px]" style={{ color: titleColor ?? theme.colors.text }}>
          {title}
        </Text>
        {subtitle ? (
          <Text className="mt-1 font-inter text-[14px]" style={{ color: subtitleColor ?? theme.colors.muted }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
