import React, { useMemo } from "react";
import { ImageBackground, ScrollView, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { Card } from "@/components";
import { useTenant } from "@/config/TenantProvider";
import { resolveLocalizedText } from "@/i18n/localize";
import { useTheme } from "@/theme/ThemeProvider";

type EntityType = "offer" | "event" | "poi";

type DetailParams = {
  id?: string | string[];
  title?: string | string[];
  subtitle?: string | string[];
  image?: string | string[];
  body?: string | string[];
  badge?: string | string[];
};

type EntityDetailTemplateProps = {
  entity: EntityType;
};

function firstParam(value: string | string[] | undefined): string | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

function humanizeId(id: string): string {
  return id
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

const FALLBACK_IMAGES: Record<EntityType, string> = {
  offer: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=60",
  event: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=60",
  poi: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1400&q=60"
};

export function EntityDetailTemplate({ entity }: EntityDetailTemplateProps) {
  const params = useLocalSearchParams<DetailParams>();
  const insets = useSafeAreaInsets();
  const { config } = useTenant();
  const { theme } = useTheme();

  const id = firstParam(params.id) ?? "detail";
  const route = `/${entity}/${id}`;

  const lookup = useMemo(() => {
    const sections = config?.homePage.sections ?? [];
    for (const section of sections) {
      if (section.type === "cardCarousel") {
        const props = section.props as {
          items?: Array<{ route?: string; title?: unknown; subtitle?: unknown; image?: string }>;
        };
        const found = props.items?.find((item) => item.route === route);
        if (found) {
          return {
            title: resolveLocalizedText(found.title as never),
            subtitle: resolveLocalizedText(found.subtitle as never),
            image: found.image
          };
        }
      }
      if (section.type === "list") {
        const props = section.props as {
          items?: Array<{ route?: string; title?: unknown; subtitle?: unknown }>;
        };
        const found = props.items?.find((item) => item.route === route);
        if (found) {
          return {
            title: resolveLocalizedText(found.title as never),
            subtitle: resolveLocalizedText(found.subtitle as never)
          };
        }
      }
      if (section.type === "quickActions") {
        const props = section.props as {
          actions?: Array<{ route?: string; label?: unknown }>;
        };
        const found = props.actions?.find((item) => item.route === route);
        if (found) {
          return {
            title: resolveLocalizedText(found.label as never),
            subtitle: `${config?.name ?? "Destination"} quick action`
          };
        }
      }
    }
    return undefined;
  }, [config, route]);

  const title = firstParam(params.title) ?? lookup?.title ?? humanizeId(id);
  const subtitle =
    firstParam(params.subtitle) ??
    lookup?.subtitle ??
    `${config?.name ?? "Destination"} ${entity === "poi" ? "guide" : "story"} details`;
  const image = firstParam(params.image) ?? lookup?.image ?? FALLBACK_IMAGES[entity];
  const badge = firstParam(params.badge) ?? entity.toUpperCase();
  const body =
    firstParam(params.body) ??
    `Discover ${title} at ${config?.name ?? "this destination"}. This editorial view is fully white-label and can be driven by your management console configuration.`;

  return (
    <View className="flex-1" style={{ backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
        <ImageBackground source={{ uri: image }} style={{ height: 320 }}>
          <LinearGradient
            colors={["#0000000f", "#00000080", "#000000d9"]}
            style={{
              flex: 1,
              justifyContent: "flex-end",
              paddingHorizontal: 20,
              paddingTop: insets.top + 8,
              paddingBottom: 20
            }}
          >
            <Text className="font-inter-medium text-[12px] tracking-[1px]" style={{ color: "#F8FAFC" }}>
              {badge}
            </Text>
            <Text className="mt-2 font-inter-semibold text-[30px]" style={{ color: "#FFFFFF", lineHeight: 36 }}>
              {title}
            </Text>
            <Text className="mt-2 font-inter text-[15px]" style={{ color: "#E5E7EB" }}>
              {subtitle}
            </Text>
          </LinearGradient>
        </ImageBackground>

        <View className="px-5 pt-5" style={{ gap: 14 }}>
          <Card>
            <Text className="font-inter-semibold text-[20px]" style={{ color: theme.colors.text }}>
              Editorial Detail
            </Text>
            <Text className="mt-3 font-inter text-[16px]" style={{ color: theme.colors.muted, lineHeight: 24 }}>
              {body}
            </Text>
          </Card>

          <Card>
            <Text className="font-inter-semibold text-[18px]" style={{ color: theme.colors.text }}>
              Highlights
            </Text>
            <Text className="mt-2 font-inter text-[15px]" style={{ color: theme.colors.muted, lineHeight: 22 }}>
              Curated for {config?.name ?? "your destination"} with brand tokens, multilingual copy, and widget-specific
              styling from Supabase.
            </Text>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}
