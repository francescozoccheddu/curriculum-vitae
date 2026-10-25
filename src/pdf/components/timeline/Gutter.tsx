import { StyleSheet, View } from "@react-pdf/renderer";
import type { Row } from "@/pdf/components/timeline/buildRows";
import {
  CENTER,
  DOT_0,
  DOT_1,
  GUTTER_WIDTH,
  LINE,
  LINE_COLOR,
  STRONG,
  SUBTLE,
} from "@/pdf/theme";

const X = GUTTER_WIDTH / 2;

const styles = StyleSheet.create({
  gutter: {
    width: GUTTER_WIDTH,
    position: "relative",
  },
  line: {
    position: "absolute",
    left: X - LINE / 2,
    width: LINE,
    backgroundColor: LINE_COLOR,
  },
  dot: {
    position: "absolute",
  },
});

/** A single straight hairline running through all rows, with a dot per row. */
export function Gutter(p: Readonly<{ row: Row }>) {
  const { row } = p;
  const size = row.depth === 0 ? DOT_0 : DOT_1;
  return (
    <View style={styles.gutter}>
      <View
        style={[
          styles.line,
          {
            top: row.isFirst ? CENTER : 0,
            ...(row.isLast ? { height: CENTER } : { bottom: 0 }),
          },
        ]}
      />
      <View
        style={[
          styles.dot,
          {
            left: X - size / 2,
            top: CENTER - size / 2,
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: row.depth === 0 ? STRONG : SUBTLE,
          },
        ]}
      />
    </View>
  );
}
