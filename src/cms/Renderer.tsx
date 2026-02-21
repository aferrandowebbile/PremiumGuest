import React, { memo, useMemo } from "react";
import { Text, View } from "react-native";
import { KnownSectionSchema, PageSchema, type PageSchemaType } from "@/cms/schema";
import { Card } from "@/components";
import { resolveSection } from "@/cms/registry";
import type { CMSRenderContext } from "@/cms/types";
import { useTheme } from "@/theme/ThemeProvider";

type CMSRendererProps = {
  page: unknown;
  context: CMSRenderContext;
};

function CMSRendererComponent({ page, context }: CMSRendererProps) {
  const { theme } = useTheme();
  const parsed = useMemo(() => PageSchema.safeParse(page), [page]);

  const data: PageSchemaType | undefined = useMemo(() => {
    if (parsed.success) return parsed.data;

    if (!page || typeof page !== "object") return undefined;
    const record = page as Record<string, unknown>;
    const sections = Array.isArray(record.sections) ? record.sections : [];

    const safeSections = sections.map((rawSection, index) => {
      const known = KnownSectionSchema.safeParse(rawSection);
      if (known.success) return known.data;

      const sectionRecord = rawSection && typeof rawSection === "object" ? (rawSection as Record<string, unknown>) : {};
      const fallbackId = typeof sectionRecord.id === "string" ? sectionRecord.id : `unsupported-${index}`;
      return {
        id: fallbackId,
        type: "unsupported",
        props: {},
        style: undefined
      };
    });

    return {
      schemaVersion: 1 as const,
      title: typeof record.title === "string" ? record.title : "Home",
      sections: safeSections
    };
  }, [page, parsed]);

  if (!data) {
    return (
      <Card>
        <Text className="font-inter text-[15px]" style={{ color: theme.colors.muted }}>
          Home content is unavailable right now. Please refresh or verify tenant CMS config.
        </Text>
      </Card>
    );
  }

  return (
    <View className="gap-5">
      {data.sections.map((section: PageSchemaType["sections"][number]) => {
        const Section = resolveSection(section.type);
        return (
          <View
            key={section.id}
            style={{
              paddingTop: section.style?.paddingTop,
              paddingBottom: section.style?.paddingBottom,
              backgroundColor: section.style?.background,
              borderRadius: section.style?.borderRadius
            }}
          >
            <Section section={section as never} context={context} />
          </View>
        );
      })}
    </View>
  );
}

export const CMSRenderer = memo(CMSRendererComponent);
