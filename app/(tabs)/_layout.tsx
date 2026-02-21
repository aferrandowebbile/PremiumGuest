import React from "react";
import { Text } from "react-native";
import { Tabs } from "expo-router";
import { House, Map, Bell, UserRound } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useTenant } from "@/config/TenantProvider";
import { useTheme } from "@/theme/ThemeProvider";

export default function TabLayout() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { config } = useTenant();
  const nav = config?.design.navigationBar;
  const shortenLabel = (value: string) => (value.length > 10 ? `${value.slice(0, 9)}…` : value);
  const renderTabLabel = (label: string, color: string) => (
    <Text
      numberOfLines={1}
      ellipsizeMode="tail"
      style={{
        color: nav?.labelColor ?? color,
        fontFamily: "Inter_500Medium",
        fontSize: 11,
        maxWidth: 72,
        textAlign: "center"
      }}
    >
      {shortenLabel(label)}
    </Text>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: nav?.activeTintColor ?? theme.colors.primary,
        tabBarInactiveTintColor: nav?.inactiveTintColor ?? theme.colors.muted,
        tabBarStyle: {
          borderTopColor: nav?.borderTopColor ?? theme.colors.border,
          backgroundColor: nav?.backgroundColor ?? theme.colors.surface,
          height: nav?.height ?? 84,
          paddingTop: 8
        },
        tabBarItemStyle: {
          flex: 1,
          minWidth: 0
        },
        tabBarLabelStyle: {
          fontFamily: "Inter_500Medium",
          fontSize: 11,
          color: nav?.labelColor,
          maxWidth: 72
        }
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t("home"),
          tabBarLabel: ({ color }) => renderTabLabel(t("home"), color),
          tabBarIcon: ({ color, size }) => <House size={size} color={color} />
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: t("map"),
          tabBarLabel: ({ color }) => renderTabLabel(t("map"), color),
          tabBarIcon: ({ color, size }) => <Map size={size} color={color} />
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: t("inbox"),
          tabBarLabel: ({ color }) => renderTabLabel(t("inbox"), color),
          tabBarIcon: ({ color, size }) => <Bell size={size} color={color} />
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: t("account"),
          tabBarLabel: ({ color }) => renderTabLabel(t("account"), color),
          tabBarIcon: ({ color, size }) => <UserRound size={size} color={color} />
        }}
      />
      <Tabs.Screen name="orders" options={{ href: null }} />
      <Tabs.Screen name="assistant" options={{ href: null }} />
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen name="commerce" options={{ href: null }} />
    </Tabs>
  );
}
