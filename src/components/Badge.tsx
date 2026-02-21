import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";

type BadgeProps = {
  label: string;
  backgroundColor?: string;
  textColor?: string;
};

export function Badge({ label, backgroundColor, textColor }: BadgeProps) {
  const { theme } = useTheme();
  return (
    <View className="rounded-full px-3 py-1" style={{ backgroundColor: backgroundColor ?? `${theme.colors.primary}15` }}>
      <Text className="font-inter-medium text-[13px]" style={{ color: textColor ?? theme.colors.primary }}>
        {label}
      </Text>
    </View>
  );
}
