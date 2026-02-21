import type {
  AspenDashboardAppearance,
  CardCarouselAppearance,
  HeroAppearance,
  InfoBannerAppearance,
  ListAppearance,
  QuickActionsAppearance,
  WebcamGridAppearance,
  WebEmbedAppearance,
  WidgetDefaults
} from "@/cms/schema";
import type { TenantConfig } from "@/config/types";

type AppearanceByType = {
  hero: HeroAppearance;
  aspenDashboard: AspenDashboardAppearance;
  quickActions: QuickActionsAppearance;
  cardCarousel: CardCarouselAppearance;
  webcamGrid: WebcamGridAppearance;
  list: ListAppearance;
  infoBanner: InfoBannerAppearance;
  webEmbed: WebEmbedAppearance;
};

export function mergeWidgetAppearance<T extends keyof AppearanceByType>(
  tenant: TenantConfig | undefined,
  type: T,
  sectionAppearance?: Partial<AppearanceByType[T]>
): Partial<AppearanceByType[T]> {
  const defaults = (tenant?.design?.widgets ?? {}) as WidgetDefaults;
  const tenantAppearance = defaults[type] as Partial<AppearanceByType[T]> | undefined;

  return {
    ...(tenantAppearance ?? {}),
    ...(sectionAppearance ?? {})
  };
}
