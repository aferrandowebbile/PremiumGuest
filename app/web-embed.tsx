import React from "react";
import { useLocalSearchParams } from "expo-router";
import { WebView } from "react-native-webview";

export default function WebEmbedScreen() {
  const { url } = useLocalSearchParams<{ url: string }>();

  if (!url) return null;

  return <WebView source={{ uri: url }} style={{ flex: 1 }} />;
}
