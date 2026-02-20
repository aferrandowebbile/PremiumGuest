import React from "react";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { Card } from "@/components";
import { useTheme } from "@/theme/ThemeProvider";

export default function PoiDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();

  return (
    <View className="flex-1 px-5 pt-6" style={{ backgroundColor: theme.colors.background }}>
      <Card>
        <Text className="font-inter-semibold text-[24px]" style={{ color: theme.colors.text }}>
          POI {id}
        </Text>
        <Text className="mt-2 font-inter text-[16px]" style={{ color: theme.colors.muted }}>
          Point-of-interest detail modal placeholder.
        </Text>
      </Card>
    </View>
  );
}
