const { getDefaultConfig } = require("expo/metro-config");
const config = getDefaultConfig(__dirname);
let withNativeWind;

try {
  ({ withNativeWind } = require("nativewind/metro"));
} catch {
  withNativeWind = null;
}

module.exports = withNativeWind ? withNativeWind(config, { input: "./global.css" }) : config;
