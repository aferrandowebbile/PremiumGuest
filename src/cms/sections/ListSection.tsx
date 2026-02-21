import React from "react";
import { FlatList, View } from "react-native";
import { router } from "expo-router";
import type { ListSection as ListSectionType } from "@/cms/schema";
import type { SectionComponentProps } from "@/cms/types";
import { mergeWidgetAppearance } from "@/cms/appearance";
import { Card, ListRow, SectionHeader } from "@/components";
import { resolveLocalizedText } from "@/i18n/localize";

export function ListSection({ section, context }: SectionComponentProps<ListSectionType>) {
  const appearance = mergeWidgetAppearance(context.tenant, "list", section.props.appearance);

  return (
    <View>
      <SectionHeader title={resolveLocalizedText(section.props.title)} titleColor={appearance.titleColor} />
      <Card>
        <FlatList
          data={section.props.items}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <ListRow
              title={resolveLocalizedText(item.title)}
              subtitle={resolveLocalizedText(item.subtitle) || undefined}
              onPress={() => router.push(item.route as never)}
              titleColor={appearance.rowTitleColor}
              subtitleColor={appearance.rowSubtitleColor}
              chevronColor={appearance.chevronColor}
              dividerColor={appearance.hideDividers ? "transparent" : appearance.dividerColor}
            />
          )}
        />
      </Card>
    </View>
  );
}
