import React from "react";
import { Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import type { HeroSection as HeroSectionType } from "@/cms/schema";
import type { SectionComponentProps } from "@/cms/types";
import { mergeWidgetAppearance } from "@/cms/appearance";
import { Badge } from "@/components/Badge";
import { resolveLocalizedText } from "@/i18n/localize";

export function HeroSection({ section, context }: SectionComponentProps<HeroSectionType>) {
  const gradient = section.props.gradient;
  const colors: [string, string, ...string[]] =
    gradient && gradient.length >= 2 ? [gradient[0], gradient[1], ...gradient.slice(2)] : ["#1D4ED8", "#0EA5E9"];
  const appearance = mergeWidgetAppearance(context.tenant, "hero", section.props.appearance);

  return (
    <LinearGradient
      colors={colors}
      className="overflow-hidden rounded-3xl px-5 py-6"
      style={{ alignItems: appearance.alignment === "center" ? "center" : "flex-start" }}
    >
      <Badge
        label={resolveLocalizedText(appearance.badgeLabel) || "Today"}
        backgroundColor={appearance.overlayColor ?? "#ffffff26"}
        textColor="#fff"
      />
      <Text
        className="mt-4 font-inter-semibold text-white"
        style={{
          fontSize: appearance.titleSize ?? 30,
          color: appearance.titleColor ?? "#ffffff",
          textAlign: appearance.alignment === "center" ? "center" : "left"
        }}
      >
        {resolveLocalizedText(section.props.title)}
      </Text>
      <Text
        className="mt-2 font-inter"
        style={{
          fontSize: appearance.subtitleSize ?? 16,
          color: appearance.subtitleColor ?? "#F5F8FF",
          textAlign: appearance.alignment === "center" ? "center" : "left"
        }}
      >
        {resolveLocalizedText(section.props.subtitle)}
      </Text>
      {section.props.ctaLabel && section.props.ctaRoute ? (
        <Pressable
          onPress={() => router.push(section.props.ctaRoute as never)}
          className="mt-5 rounded-2xl px-4 py-3"
          style={{
            alignSelf: appearance.alignment === "center" ? "center" : "flex-start",
            backgroundColor: appearance.ctaBackgroundColor ?? "#ffffff"
          }}
        >
          <Text className="font-inter-semibold text-[16px]" style={{ color: appearance.ctaTextColor ?? "#0F172A" }}>
            {resolveLocalizedText(section.props.ctaLabel)}
          </Text>
        </Pressable>
      ) : null}
      <View className="absolute -right-10 -top-10 h-40 w-40 rounded-full" style={{ backgroundColor: appearance.overlayColor ?? "#ffffff1a" }} />
    </LinearGradient>
  );
}
