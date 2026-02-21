import React, { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import { buildTheme, type AppTheme, type ThemeOverrides, type ThemeTokenInput } from "@/theme/tokens";

type ThemeContextValue = {
  isDark: boolean;
  theme: AppTheme;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

type ThemeProviderProps = {
  children: React.ReactNode;
  tokenOverrides?: Partial<ThemeTokenInput>;
  designOverrides?: Omit<ThemeOverrides, "colors">;
};

export function ThemeProvider({ children, tokenOverrides, designOverrides }: ThemeProviderProps) {
  const system = useColorScheme();
  const isDark = system === "dark";

  const value = useMemo(
    () => ({
      isDark,
      theme: buildTheme(isDark, {
        colors: tokenOverrides,
        radius: designOverrides?.radius,
        spacing: designOverrides?.spacing,
        typeScale: designOverrides?.typeScale
      })
    }),
    [isDark, tokenOverrides, designOverrides]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
