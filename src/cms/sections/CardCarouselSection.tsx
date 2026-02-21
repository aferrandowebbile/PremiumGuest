import React from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import type { CardCarouselSection as CardCarouselSectionType } from "@/cms/schema";
import type { SectionComponentProps } from "@/cms/types";
import { mergeWidgetAppearance } from "@/cms/appearance";
import { Card, SectionHeader } from "@/components";
import { resolveLocalizedText } from "@/i18n/localize";
import { useTheme } from "@/theme/ThemeProvider";

export function CardCarouselSection({ section, context }: SectionComponentProps<CardCarouselSectionType>) {
  const { theme } = useTheme();
  const appearance = mergeWidgetAppearance(context.tenant, "cardCarousel", section.props.appearance);

  return (
    <View>
      <SectionHeader title={resolveLocalizedText(section.props.title)} titleColor={appearance.titleColor} />
      <FlatList
        data={section.props.items}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToAlignment="start"
        decelerationRate="fast"
        contentContainerStyle={{ gap: 12, paddingRight: 16 }}
        renderItem={({ item }) => {
          const title = resolveLocalizedText(item.title);
          const subtitle = resolveLocalizedText(item.subtitle);
          return (
          <Pressable
            onPress={() =>
              router.push({
                pathname: item.route as never,
                params: {
                  title,
                  subtitle,
                  image: item.image
                }
              })
            }
            style={{ width: appearance.cardWidth ?? 280 }}
          >
            <Card
              style={{
                backgroundColor: appearance.cardBackground,
                borderColor: appearance.cardBorderColor
              }}
            >
              {item.image ? (
                <Image
                  source={{ uri: item.image }}
                  resizeMode="cover"
                  style={{ width: "100%", height: 120, borderRadius: 8, marginBottom: 10 }}
                />
              ) : null}
              <Text
                className="font-inter-semibold"
                style={{
                  fontSize: appearance.titleSize ?? theme.typeScale.h2,
                  color: appearance.titleColor ?? theme.colors.text
                }}
              >
                {title}
              </Text>
              {item.subtitle ? (
                <Text className="mt-2 font-inter text-[14px]" style={{ color: appearance.subtitleColor ?? theme.colors.muted }}>
                  {subtitle}
                </Text>
              ) : null}
            </Card>
          </Pressable>
        );
      }}
      />
    </View>
  );
}
