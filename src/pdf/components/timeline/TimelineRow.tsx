import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { PointBody } from "@/pdf/components/common/PointBody";
import type { Row } from "@/pdf/components/timeline/buildRows";
import { Gutter } from "@/pdf/components/timeline/Gutter";
import { CHILD_INDENT, ROW_GAP, SUBTLE, YEAR_WIDTH } from "@/pdf/theme";
import type { Descriptor } from "@/utils/descriptor";

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  yearColumn: {
    width: YEAR_WIDTH,
  },
  year: {
    width: YEAR_WIDTH,
    textAlign: "right",
    fontSize: 7.2,
    fontWeight: "bold",
    color: SUBTLE,
    position: "relative",
    top: 1,
  },
  yearEnd: {
    width: YEAR_WIDTH + 12,
    marginLeft: -12,
    marginTop: 2,
    textAlign: "right",
    fontSize: 5,
    color: SUBTLE,
  },
  rowContent: {
    flex: 1,
    paddingBottom: ROW_GAP,
  },
});

export function TimelineRow(p: Readonly<{ row: Row; descriptor: Descriptor }>) {
  const { row, descriptor } = p;
  return (
    <View style={styles.row} wrap={false}>
      <View style={styles.yearColumn}>
        <Text style={styles.year}>
          {row.depth === 0 ? (row.point.year ?? "") : ""}
        </Text>
        {row.depth === 0 &&
        row.point.year != null &&
        row.point.toYear != null ? (
          <Text style={styles.yearEnd}>
            {row.point.toYear === "now"
              ? "ongoing"
              : `until ${row.point.toYear}`}
          </Text>
        ) : null}
      </View>
      <Gutter row={row} />
      <View
        style={[
          styles.rowContent,
          row.depth === 1 ? { paddingLeft: CHILD_INDENT } : {},
        ]}
      >
        <PointBody point={row.point} descriptor={descriptor} />
      </View>
    </View>
  );
}
