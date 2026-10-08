import { Image, StyleSheet, Text, View } from "@react-pdf/renderer";
import { DEFAULT_TAG_COLOR } from "@/content/theme";
import type { Descriptor, Tag } from "@/utils/descriptor";

const styles = StyleSheet.create({
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 3,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 7,
    marginBottom: 2.5,
  },
  chipText: {
    fontSize: 7.5,
    fontWeight: "medium",
  },
  chipLogo: {
    width: 7.5,
    height: 7.5,
    marginRight: 2.5,
    position: "relative",
    objectFit: "contain",
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
          (tag?.color ? colors.get(tag.color) : null) ?? DEFAULT_TAG_COLOR;
        return <Chip key={id} id={id} tag={tag} color={color} />;
      })}
    </View>
  );
}
