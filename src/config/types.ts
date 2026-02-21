import { z } from "zod";
import { LocalizedTextSchema, PageSchema, WidgetDefaultsSchema } from "@/cms/schema";

export const EnabledModulesSchema = z.object({
  ski: z.boolean().default(false),
  park: z.boolean().default(false),
  offers: z.boolean().default(true),
  events: z.boolean().default(true),
  commerce: z.boolean().default(false)
});

const ThemeColorOverridesSchema = z
  .object({
    primary: z.string().optional(),
    secondary: z.string().optional(),
    background: z.string().optional(),
    surface: z.string().optional(),
    text: z.string().optional(),
    muted: z.string().optional(),
    border: z.string().optional(),
    success: z.string().optional(),
    warning: z.string().optional(),
    danger: z.string().optional()
  })
  .default({});

const ThemeScaleOverridesSchema = z
  .object({
    radius: z
      .object({
        lg: z.number().min(0).max(48).optional(),
        xl: z.number().min(0).max(48).optional(),
        xxl: z.number().min(0).max(48).optional()
      })
      .optional(),
    spacing: z
      .object({
        xs: z.number().min(0).max(64).optional(),
        sm: z.number().min(0).max(64).optional(),
        md: z.number().min(0).max(64).optional(),
        lg: z.number().min(0).max(64).optional(),
        xl: z.number().min(0).max(64).optional()
      })
      .optional(),
    typeScale: z
      .object({
        display: z.number().min(14).max(64).optional(),
        h1: z.number().min(14).max(48).optional(),
        h2: z.number().min(12).max(40).optional(),
        body: z.number().min(10).max(28).optional(),
        small: z.number().min(10).max(24).optional()
      })
      .optional()
  })
  .default({});

const HomeHeaderSchema = z
  .object({
    greeting: LocalizedTextSchema.optional(),
    subtitle: LocalizedTextSchema.optional(),
    blurIntensity: z.number().min(0).max(100).optional(),
    useGlassEffect: z.boolean().optional(),
    backgroundColor: z.string().optional(),
    textColor: z.string().optional(),
    mutedColor: z.string().optional(),
    avatarStyle: z.enum(["filled", "outline"]).optional()
  })
  .default({});

const NavigationBarSchema = z
  .object({
    backgroundColor: z.string().optional(),
    borderTopColor: z.string().optional(),
    activeTintColor: z.string().optional(),
    inactiveTintColor: z.string().optional(),
    labelColor: z.string().optional(),
    height: z.number().min(64).max(110).optional()
  })
  .default({});

const DesignConfigSchema = z
  .object({
    stylePreset: z.enum(["mountain-luxury", "park-energy", "minimal-clean", "aspen-editorial"]).default("mountain-luxury"),
    tokens: ThemeScaleOverridesSchema,
    homeHeader: HomeHeaderSchema,
    navigationBar: NavigationBarSchema,
    widgets: WidgetDefaultsSchema
  })
  .default({
    stylePreset: "mountain-luxury",
    tokens: {},
    homeHeader: {},
    navigationBar: {},
    widgets: {}
  });

export const TenantConfigSchema = z.object({
  tenantId: z.string(),
  name: z.string(),
  theme: ThemeColorOverridesSchema,
  enabledModules: EnabledModulesSchema,
  supportedLanguages: z.array(z.string()).default(["en"]),
  design: DesignConfigSchema,
  homePage: PageSchema
});

export type TenantConfig = z.infer<typeof TenantConfigSchema>;
