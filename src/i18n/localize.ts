import i18n from "@/i18n";
import type { LocalizedText } from "@/cms/schema";

export function resolveLocalizedText(value: LocalizedText | undefined | null): string {
  if (!value) return "";
  if (typeof value === "string") return value;

  const language = i18n.language || "en";
  const baseLanguage = language.split("-")[0];
  const fallbackLanguage = (i18n.options.fallbackLng as string | undefined) ?? "en";

  const candidates = [language, baseLanguage, fallbackLanguage, "en"];

  for (const lang of candidates) {
    const text = value[lang];
    if (typeof text === "string" && text.trim()) return text;
  }

  const first = Object.values(value).find((text) => typeof text === "string" && text.trim());
  return first ?? "";
}
