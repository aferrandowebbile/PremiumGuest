import React from "react";
import { Pressable, Text, View, type ViewStyle } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";

type CardProps = {
  children?: React.ReactNode;
  style?: ViewStyle;
  title?: string;
  subtitle?: string;
  onPress?: () => void;
};

export function Card({ children, style, title, subtitle, onPress }: CardProps) {
  const { theme } = useTheme();

  const content = children ?? (
    <>
      {title ? (
        <Text className="font-inter-semibold text-[20px]" style={{ color: theme.colors.text }}>
          {title}
        </Text>
      ) : null}
      {subtitle ? (
        <Text className="mt-2 font-inter text-[14px]" style={{ color: theme.colors.muted }}>
          {subtitle}
        </Text>
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className="rounded-3xl border px-4 py-4 shadow-card"
        style={[
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border
          },
          style
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View
      className="rounded-3xl border px-4 py-4 shadow-card"
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border
        },
        style
      ]}
    >
      {content}
    </View>
  );
}
