import React, { useMemo } from "react";
import { NativeModules, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { MapPinned } from "lucide-react-native";
import { Card, SectionHeader } from "@/components";
import { env } from "@/config/env";
import { useTenant } from "@/config/TenantProvider";
import { resolveDestinationPreset } from "@/maps/locations";
import { useTheme } from "@/theme/ThemeProvider";

function getMapboxNative() {
  if (!NativeModules.RNMBXModule) {
    return null;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const module = require("@rnmapbox/maps");
    return module?.default ?? module;
  } catch {
    return null;
  }
}

export default function MapScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { config, tenantId } = useTenant();
  const token = env.mapboxToken;
  const Mapbox = useMemo(() => getMapboxNative(), []);

  const preset = useMemo(() => resolveDestinationPreset(tenantId, config?.name), [tenantId, config?.name]);

  if (Mapbox && token) {
    void Mapbox.setAccessToken(token);
  }

  return (
    <View
      className="flex-1 px-5"
      style={{
        backgroundColor: theme.colors.background,
        paddingTop: insets.top + 8,
        paddingBottom: insets.bottom + 8
      }}
    >
      <SectionHeader title={t("map")} subtitle={t("mapSubtitle")} />
      {token && Mapbox ? (
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <View style={{ height: 520 }}>
            <Mapbox.MapView
              style={{ flex: 1 }}
              styleURL={Mapbox.StyleURL.Outdoors}
              compassEnabled
              logoEnabled={false}
              attributionEnabled
              scaleBarEnabled
              pitchEnabled
            >
              <Mapbox.Camera
                centerCoordinate={preset.center}
                zoomLevel={preset.zoom}
                pitch={preset.pitch}
                heading={preset.bearing}
                animationMode="easeTo"
                animationDuration={500}
              />

              <Mapbox.RasterDemSource id="mapbox-dem" url="mapbox://mapbox.mapbox-terrain-dem-v1" tileSize={512}>
                <Mapbox.Terrain sourceID="mapbox-dem" style={{ exaggeration: 1.3 }} />
              </Mapbox.RasterDemSource>

              <Mapbox.FillExtrusionLayer
                id="3d-buildings"
                sourceID="composite"
                sourceLayerID="building"
                minZoomLevel={13}
                maxZoomLevel={22}
                style={{
                  fillExtrusionColor: "#D1D5DB",
                  fillExtrusionOpacity: 0.45,
                  fillExtrusionHeight: ["get", "height"] as never,
                  fillExtrusionBase: ["get", "min_height"] as never
                }}
              />

              <Mapbox.PointAnnotation id="destination-pin" coordinate={preset.center}>
                <View
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 999,
                    backgroundColor: "#EF4444",
                    borderWidth: 2,
                    borderColor: "#fff"
                  }}
                />
              </Mapbox.PointAnnotation>
            </Mapbox.MapView>
          </View>
        </Card>
      ) : token && !Mapbox ? (
        <Card>
          <View className="items-center py-14">
            <MapPinned size={28} color={theme.colors.primary} />
            <Text className="mt-3 text-center font-inter-semibold text-[20px]" style={{ color: theme.colors.text }}>
              Native Mapbox not in this build
            </Text>
            <Text className="mt-2 text-center font-inter text-[14px]" style={{ color: theme.colors.muted }}>
              This usually means Expo Go or an old binary. Build and run a dev client again: expo prebuild + expo run:ios.
            </Text>
          </View>
        </Card>
      ) : (
        <Card>
          <View className="items-center py-14">
            <MapPinned size={28} color={theme.colors.primary} />
            <Text className="mt-3 font-inter-semibold text-[20px]" style={{ color: theme.colors.text }}>
              Mapbox token required
            </Text>
            <Text className="mt-2 text-center font-inter text-[14px]" style={{ color: theme.colors.muted }}>
              Set EXPO_PUBLIC_MAPBOX_TOKEN in your .env to render the 3D map.
            </Text>
          </View>
        </Card>
      )}
    </View>
  );
}
