import { StyleSheet, View } from "@react-pdf/renderer";
import { PointBody } from "@/content/components/common/PointBody";
import { SectionTitle } from "@/content/components/common/SectionTitle";
import type { Descriptor, Point } from "@/utils/descriptor";

const styles = StyleSheet.create({
  projects: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginRight: -16,
  },
  project: {
    width: "50%",
    paddingRight: 16,
    paddingBottom: 8,
  },
});

export function Projects(
  p: Readonly<{ points: readonly Point[]; descriptor: Descriptor }>,
) {
  const { points, descriptor } = p;
  return (
    <View>
      <SectionTitle minPresenceAhead={120}>Other projects</SectionTitle>
      <View style={styles.projects}>
        {points.map((point, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static list
          <View key={i} style={styles.project} wrap={false}>
            <PointBody point={point} descriptor={descriptor} showYear />
          </View>
        ))}
      </View>
    </View>
  );
}
