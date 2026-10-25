import { Image, StyleSheet, Text, View } from "@react-pdf/renderer";
import { DEFAULT_TAG_COLOR, MONOCHROME_TAGS } from "@/pdf/theme";
import type { Descriptor, Tag } from "@/utils/descriptor";

const styles = StyleSheet.create({
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 2.5,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 6,
    marginBottom: 1.5,
  },
  chipText: {
    fontSize: 6.8,
    fontWeight: "medium",
  },
  chipLogo: {
    marginRight: 2,
    position: "relative",
  },
});

export function Chip(
  p: Readonly<{ id: string; tag: Tag | undefined; color: string }>,
) {
  const { id, tag, color } = p;
  return (
    <View style={styles.chip}>
      {tag?.logo ? <Image src={tag.logo} style={styles.chipLogo} /> : null}
      <Text style={[styles.chipText, { color }]}>{tag?.title ?? id}</Text>
    </View>
  );
}

export function Chips(
  p: Readonly<{ ids: readonly string[]; descriptor: Descriptor }>,
) {
  const { ids, descriptor } = p;
  if (ids.length === 0) return null;
  const colors = new Map((descriptor.colors ?? []).map((c) => [c.id, c.color]));
  const tags = new Map((descriptor.tags ?? []).map((t) => [t.id, t]));
  return (
    <View style={styles.chips}>
      {ids.map((id) => {
        const tag = tags.get(id);
        const color =
          (!MONOCHROME_TAGS && tag?.color ? colors.get(tag.color) : null) ??
          DEFAULT_TAG_COLOR;
        return <Chip key={id} id={id} tag={tag} color={color} />;
      })}
    </View>
  );
}
