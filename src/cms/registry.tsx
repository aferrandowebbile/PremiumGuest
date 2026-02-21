import type { ComponentType } from "react";
import type { KnownSection } from "@/cms/schema";
import type { SectionComponentProps } from "@/cms/types";
import { CardCarouselSection } from "@/cms/sections/CardCarouselSection";
import { AspenDashboardSection } from "@/cms/sections/AspenDashboardSection";
import { HeroSection } from "@/cms/sections/HeroSection";
import { InfoBannerSection } from "@/cms/sections/InfoBannerSection";
import { ListSection } from "@/cms/sections/ListSection";
import { QuickActionsSection } from "@/cms/sections/QuickActionsSection";
import { UnsupportedSection } from "@/cms/sections/UnsupportedSection";
import { WebcamGridSection } from "@/cms/sections/WebcamGridSection";
import { WebEmbedSection } from "@/cms/sections/WebEmbedSection";

type SectionRenderer = ComponentType<SectionComponentProps<KnownSection>>;

const registry: Record<KnownSection["type"], SectionRenderer> = {
  hero: HeroSection as unknown as SectionRenderer,
  aspenDashboard: AspenDashboardSection as unknown as SectionRenderer,
  quickActions: QuickActionsSection as unknown as SectionRenderer,
  cardCarousel: CardCarouselSection as unknown as SectionRenderer,
  webcamGrid: WebcamGridSection as unknown as SectionRenderer,
  list: ListSection as unknown as SectionRenderer,
  infoBanner: InfoBannerSection as unknown as SectionRenderer,
  webEmbed: WebEmbedSection as unknown as SectionRenderer
};

export function resolveSection(type: string): SectionRenderer {
  return (registry as Record<string, SectionRenderer>)[type] ?? UnsupportedSection;
}
