import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { PointBody } from "@/content/components/common/PointBody";
import type { Row } from "@/content/components/timeline/buildRows";
import { Gutter } from "@/content/components/timeline/Gutter";
import { ACCENT, LANE_0, LANE_1, YEAR_WIDTH } from "@/content/theme";
import type { Descriptor } from "@/utils/descriptor";

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  year: {
    width: YEAR_WIDTH,
    textAlign: "right",
    fontWeight: "bold",
    color: ACCENT,
  },
  rowContent: {
    flex: 1,
    paddingBottom: 8,
  },
});

export function TimelineRow(p: Readonly<{ row: Row; descriptor: Descriptor }>) {
  const { row, descriptor } = p;
  return (
    <View style={styles.row} wrap={false}>
      <Text style={styles.year}>{row.year ?? ""}</Text>
      <Gutter row={row} />
      <View
        style={[
          styles.rowContent,
          row.depth === 1 ? { paddingLeft: LANE_1 - LANE_0 } : {},
        ]}
      >
        <PointBody point={row.point} descriptor={descriptor} />
      </View>
    </View>
  );
}
