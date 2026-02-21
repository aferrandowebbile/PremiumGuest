import React from "react";
import { router } from "expo-router";
import type { WebEmbedSection as WebEmbedSectionType } from "@/cms/schema";
import type { SectionComponentProps } from "@/cms/types";
import { mergeWidgetAppearance } from "@/cms/appearance";
import { Button, Card, SectionHeader } from "@/components";
import { resolveLocalizedText } from "@/i18n/localize";

export function WebEmbedSection({ section, context }: SectionComponentProps<WebEmbedSectionType>) {
  const appearance = mergeWidgetAppearance(context.tenant, "webEmbed", section.props.appearance);

  return (
    <Card>
      <SectionHeader
        title={resolveLocalizedText(section.props.title)}
        subtitle={appearance.showUrlPreview === false ? undefined : section.props.url}
        titleColor={appearance.titleColor}
        subtitleColor={appearance.subtitleColor}
      />
      <Button
        label={resolveLocalizedText(section.props.buttonLabel) || "Open"}
        variant={appearance.buttonVariant ?? "primary"}
        onPress={() =>
          router.push({
            pathname: "/web-embed",
            params: { title: resolveLocalizedText(section.props.title), url: section.props.url }
          })
        }
      />
    </Card>
  );
}
