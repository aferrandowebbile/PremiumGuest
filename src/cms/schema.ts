import { z } from "zod";

export const LocalizedTextSchema = z.union([z.string(), z.record(z.string().min(2), z.string())]);

export const SectionStyleOverridesSchema = z
  .object({
    paddingTop: z.number().min(0).max(96).optional(),
    paddingBottom: z.number().min(0).max(96).optional(),
    background: z.string().optional(),
    borderRadius: z.number().min(0).max(48).optional()
  })
  .optional();

const HeroAppearanceSchema = z
  .object({
    badgeLabel: LocalizedTextSchema.optional(),
    titleColor: z.string().optional(),
    subtitleColor: z.string().optional(),
    ctaBackgroundColor: z.string().optional(),
    ctaTextColor: z.string().optional(),
    overlayColor: z.string().optional(),
    titleSize: z.number().min(20).max(42).optional(),
    subtitleSize: z.number().min(12).max(24).optional(),
    alignment: z.enum(["left", "center"]).optional()
  })
  .default({});

const HeroSectionSchema = z.object({
  id: z.string(),
  type: z.literal("hero"),
  props: z.object({
    title: LocalizedTextSchema,
    subtitle: LocalizedTextSchema,
    ctaLabel: LocalizedTextSchema.optional(),
    ctaRoute: z.string().optional(),
    gradient: z.array(z.string()).min(2).max(4).optional(),
    appearance: HeroAppearanceSchema.optional()
  }),
  style: SectionStyleOverridesSchema
});

const AspenDashboardAppearanceSchema = z
  .object({
    cardRadius: z.number().min(0).max(24).optional(),
    leftCardBackground: z.string().optional(),
    rightCardBackground: z.string().optional(),
    leftNumberColor: z.string().optional(),
    rightTempColor: z.string().optional(),
    rightMetaColor: z.string().optional(),
    labelColor: z.string().optional(),
    borderColor: z.string().optional()
  })
  .default({});

const AspenDashboardSectionSchema = z.object({
  id: z.string(),
  type: z.literal("aspenDashboard"),
  props: z.object({
    leftValue: z.string(),
    leftLabel: LocalizedTextSchema,
    leftCta: LocalizedTextSchema.optional(),
    temperature: z.string(),
    condition: LocalizedTextSchema,
    high: z.string().optional(),
    low: z.string().optional(),
    updatedAt: LocalizedTextSchema.optional(),
    appearance: AspenDashboardAppearanceSchema.optional()
  }),
  style: SectionStyleOverridesSchema
});

const QuickActionItemSchema = z.object({
  id: z.string(),
  label: LocalizedTextSchema,
  icon: z.string(),
  route: z.string().optional(),
  module: z.enum(["ski", "park"]).optional()
});

const QuickActionsAppearanceSchema = z
  .object({
    titleColor: z.string().optional(),
    iconColor: z.string().optional(),
    labelColor: z.string().optional(),
    tileBackground: z.string().optional(),
    tileBorderColor: z.string().optional(),
    columns: z.number().int().min(2).max(5).optional(),
    iconSize: z.number().int().min(16).max(30).optional(),
    tileRadius: z.number().min(4).max(32).optional()
  })
  .default({});

const QuickActionsSectionSchema = z.object({
  id: z.string(),
  type: z.literal("quickActions"),
  props: z.object({
    title: LocalizedTextSchema.optional(),
    actions: z.array(QuickActionItemSchema).min(1),
    appearance: QuickActionsAppearanceSchema.optional()
  }),
  style: SectionStyleOverridesSchema
});

const CarouselItemSchema = z.object({
  id: z.string(),
  title: LocalizedTextSchema,
  subtitle: LocalizedTextSchema.optional(),
  image: z.string().optional(),
  route: z.string()
});

const CardCarouselAppearanceSchema = z
  .object({
    cardWidth: z.number().min(220).max(380).optional(),
    titleColor: z.string().optional(),
    subtitleColor: z.string().optional(),
    cardBackground: z.string().optional(),
    cardBorderColor: z.string().optional(),
    titleSize: z.number().min(16).max(30).optional()
  })
  .default({});

const CardCarouselSectionSchema = z.object({
  id: z.string(),
  type: z.literal("cardCarousel"),
  props: z.object({
    title: LocalizedTextSchema,
    items: z.array(CarouselItemSchema),
    appearance: CardCarouselAppearanceSchema.optional()
  }),
  style: SectionStyleOverridesSchema
});

const WebcamItemSchema = z.object({
  id: z.string(),
  title: LocalizedTextSchema,
  subtitle: LocalizedTextSchema.optional(),
  image: z.string().url(),
  status: z.enum(["live", "offline"]).optional(),
  updatedAt: LocalizedTextSchema.optional(),
  route: z.string().optional()
});

const WebcamGridAppearanceSchema = z
  .object({
    titleColor: z.string().optional(),
    subtitleColor: z.string().optional(),
    cardBackground: z.string().optional(),
    cardBorderColor: z.string().optional(),
    badgeLiveBackground: z.string().optional(),
    badgeOfflineBackground: z.string().optional(),
    badgeTextColor: z.string().optional(),
    cardRadius: z.number().min(4).max(32).optional(),
    imageHeight: z.number().min(120).max(260).optional()
  })
  .default({});

const WebcamGridSectionSchema = z.object({
  id: z.string(),
  type: z.literal("webcamGrid"),
  props: z.object({
    title: LocalizedTextSchema,
    subtitle: LocalizedTextSchema.optional(),
    items: z.array(WebcamItemSchema).min(1),
    appearance: WebcamGridAppearanceSchema.optional()
  }),
  style: SectionStyleOverridesSchema
});

const ListAppearanceSchema = z
  .object({
    titleColor: z.string().optional(),
    rowTitleColor: z.string().optional(),
    rowSubtitleColor: z.string().optional(),
    chevronColor: z.string().optional(),
    dividerColor: z.string().optional(),
    hideDividers: z.boolean().optional()
  })
  .default({});

const ListSectionSchema = z.object({
  id: z.string(),
  type: z.literal("list"),
  props: z.object({
    title: LocalizedTextSchema,
    items: z.array(
      z.object({
        id: z.string(),
        title: LocalizedTextSchema,
        subtitle: LocalizedTextSchema.optional(),
        route: z.string()
      })
    ),
    appearance: ListAppearanceSchema.optional()
  }),
  style: SectionStyleOverridesSchema
});

const InfoBannerAppearanceSchema = z
  .object({
    titleColor: z.string().optional(),
    messageColor: z.string().optional(),
    badgeLabel: LocalizedTextSchema.optional(),
    badgeBackground: z.string().optional(),
    badgeTextColor: z.string().optional()
  })
  .default({});

const InfoBannerSectionSchema = z.object({
  id: z.string(),
  type: z.literal("infoBanner"),
  props: z.object({
    title: LocalizedTextSchema,
    message: LocalizedTextSchema,
    variant: z.enum(["default", "moduleHighlights"]).optional(),
    module: z.enum(["ski", "park"]).optional(),
    appearance: InfoBannerAppearanceSchema.optional()
  }),
  style: SectionStyleOverridesSchema
});

const WebEmbedAppearanceSchema = z
  .object({
    showUrlPreview: z.boolean().optional(),
    buttonVariant: z.enum(["primary", "secondary"]).optional(),
    titleColor: z.string().optional(),
    subtitleColor: z.string().optional()
  })
  .default({});

const WebEmbedSectionSchema = z.object({
  id: z.string(),
  type: z.literal("webEmbed"),
  props: z.object({
    title: LocalizedTextSchema,
    url: z.string().url(),
    buttonLabel: LocalizedTextSchema.optional(),
    appearance: WebEmbedAppearanceSchema.optional()
  }),
  style: SectionStyleOverridesSchema
});

export const KnownSectionSchema = z.discriminatedUnion("type", [
  HeroSectionSchema,
  AspenDashboardSectionSchema,
  QuickActionsSectionSchema,
  CardCarouselSectionSchema,
  WebcamGridSectionSchema,
  ListSectionSchema,
  InfoBannerSectionSchema,
  WebEmbedSectionSchema
]);

const UnsupportedSectionSchema = z.object({
  id: z.string().default("unknown"),
  type: z.string(),
  props: z.record(z.any()).optional(),
  style: SectionStyleOverridesSchema
});

export const PageSchema = z.object({
  schemaVersion: z.literal(1),
  title: LocalizedTextSchema,
  sections: z.array(z.union([KnownSectionSchema, UnsupportedSectionSchema]))
});

export const WidgetDefaultsSchema = z
  .object({
    hero: HeroAppearanceSchema.optional(),
    aspenDashboard: AspenDashboardAppearanceSchema.optional(),
    quickActions: QuickActionsAppearanceSchema.optional(),
    cardCarousel: CardCarouselAppearanceSchema.optional(),
    webcamGrid: WebcamGridAppearanceSchema.optional(),
    list: ListAppearanceSchema.optional(),
    infoBanner: InfoBannerAppearanceSchema.optional(),
    webEmbed: WebEmbedAppearanceSchema.optional()
  })
  .default({});

export type PageSchemaType = z.infer<typeof PageSchema>;
export type KnownSection = z.infer<typeof KnownSectionSchema>;
export type QuickActionItem = z.infer<typeof QuickActionItemSchema>;
export type HeroAppearance = z.infer<typeof HeroAppearanceSchema>;
export type AspenDashboardAppearance = z.infer<typeof AspenDashboardAppearanceSchema>;
export type QuickActionsAppearance = z.infer<typeof QuickActionsAppearanceSchema>;
export type CardCarouselAppearance = z.infer<typeof CardCarouselAppearanceSchema>;
export type WebcamGridAppearance = z.infer<typeof WebcamGridAppearanceSchema>;
export type ListAppearance = z.infer<typeof ListAppearanceSchema>;
export type InfoBannerAppearance = z.infer<typeof InfoBannerAppearanceSchema>;
export type WebEmbedAppearance = z.infer<typeof WebEmbedAppearanceSchema>;
export type WidgetDefaults = z.infer<typeof WidgetDefaultsSchema>;
export type LocalizedText = z.infer<typeof LocalizedTextSchema>;

export type HeroSection = z.infer<typeof HeroSectionSchema>;
export type AspenDashboardSection = z.infer<typeof AspenDashboardSectionSchema>;
export type QuickActionsSection = z.infer<typeof QuickActionsSectionSchema>;
export type CardCarouselSection = z.infer<typeof CardCarouselSectionSchema>;
export type WebcamGridSection = z.infer<typeof WebcamGridSectionSchema>;
export type ListSection = z.infer<typeof ListSectionSchema>;
export type InfoBannerSection = z.infer<typeof InfoBannerSectionSchema>;
export type WebEmbedSection = z.infer<typeof WebEmbedSectionSchema>;
