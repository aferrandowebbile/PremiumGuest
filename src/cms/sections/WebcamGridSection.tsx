import React from "react";
import { ImageBackground, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import type { WebcamGridSection as WebcamGridSectionType } from "@/cms/schema";
import type { SectionComponentProps } from "@/cms/types";
import { mergeWidgetAppearance } from "@/cms/appearance";
import { Card, SectionHeader } from "@/components";
import { resolveLocalizedText } from "@/i18n/localize";
import { useTheme } from "@/theme/ThemeProvider";

export function WebcamGridSection({ section, context }: SectionComponentProps<WebcamGridSectionType>) {
  const { theme } = useTheme();
  const appearance = mergeWidgetAppearance(context.tenant, "webcamGrid", section.props.appearance);

  return (
    <View>
      <SectionHeader
        title={resolveLocalizedText(section.props.title)}
        subtitle={resolveLocalizedText(section.props.subtitle) || undefined}
        titleColor={appearance.titleColor}
        subtitleColor={appearance.subtitleColor}
      />

      <View style={{ gap: 12 }}>
        {section.props.items.map((item) => {
          const title = resolveLocalizedText(item.title);
          const subtitle = resolveLocalizedText(item.subtitle);
          const updatedAt = resolveLocalizedText(item.updatedAt);
          const isLive = item.status !== "offline";
          const route = item.route ?? `/poi/${item.id}`;

          return (
            <Pressable
              key={item.id}
              onPress={() =>
                router.push({
                  pathname: route as never,
                  params: {
                    title,
                    subtitle: subtitle || updatedAt,
                    image: item.image,
                    badge: "WEBCAM",
                    body: `${title} webcam feed and details for ${context.tenant?.name ?? "your destination"}.`
                  }
                })
              }
            >
              <Card
                style={{
                  padding: 0,
                  overflow: "hidden",
                  backgroundColor: appearance.cardBackground,
                  borderColor: appearance.cardBorderColor,
                  borderRadius: appearance.cardRadius ?? theme.radius.xl
                }}
              >
                <ImageBackground source={{ uri: item.image }} style={{ height: appearance.imageHeight ?? 180 }}>
                  <View className="flex-1 justify-between p-3" style={{ backgroundColor: "#00000035" }}>
                    <View className="self-start rounded-full px-3 py-1" style={{ backgroundColor: isLive ? appearance.badgeLiveBackground ?? "#16A34A" : appearance.badgeOfflineBackground ?? "#6B7280" }}>
                      <Text className="font-inter-semibold text-[11px]" style={{ color: appearance.badgeTextColor ?? "#fff" }}>
                        {isLive ? "LIVE" : "OFFLINE"}
                      </Text>
                    </View>
                    <View>
                      <Text className="font-inter-semibold text-[20px]" style={{ color: "#fff" }}>
                        {title}
                      </Text>
                      {subtitle ? (
                        <Text className="mt-1 font-inter text-[14px]" style={{ color: "#E5E7EB" }}>
                          {subtitle}
                        </Text>
                      ) : null}
                      {updatedAt ? (
                        <Text className="mt-1 font-inter text-[12px]" style={{ color: "#CBD5E1" }}>
                          {updatedAt}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </ImageBackground>
              </Card>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
