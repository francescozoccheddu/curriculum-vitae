import { Path, StyleSheet, Svg, View } from "@react-pdf/renderer";
import type { Row } from "@/content/components/timeline/buildRows";
import {
  ACCENT,
  CENTER,
  DOT,
  GUTTER_WIDTH,
  LANE_0,
  LANE_1,
  LINE,
  LINE_COLOR,
  TRANS_HEIGHT,
} from "@/content/theme";

const styles = StyleSheet.create({
  gutter: {
    width: GUTTER_WIDTH,
    position: "relative",
  },
  dot: {
    position: "absolute",
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    backgroundColor: ACCENT,
  },
});

export function Gutter(p: Readonly<{ row: Row }>) {
  const { row } = p;
  const x = row.depth === 0 ? LANE_0 : LANE_1;
  const nextX = row.nextDepth === 0 ? LANE_0 : LANE_1;
  const hasTransition =
    row.nextDepth !== undefined && row.depth !== row.nextDepth;

  return (
    <View
      style={[
        styles.gutter,
        hasTransition ? { minHeight: CENTER + TRANS_HEIGHT } : {},
      ]}
    >
      {/* Top segment: from y = 0 to CENTER */}
      {!row.isFirst ? (
        <View
          style={{
            position: "absolute",
            left: x - LINE / 2,
            top: 0,
            height: CENTER,
            width: LINE,
            backgroundColor: LINE_COLOR,
          }}
        />
      ) : null}

      {/* Bottom segment: from y = CENTER to bottom */}
      {!row.isLast ? (
        hasTransition ? (
          <>
            <Svg
              style={{
                position: "absolute",
                left: 0,
                top: CENTER,
                width: GUTTER_WIDTH,
                height: TRANS_HEIGHT,
              }}
            >
              <Path
                d={`M ${x} 0 C ${x} ${TRANS_HEIGHT * 0.5}, ${nextX} ${TRANS_HEIGHT * 0.5}, ${nextX} ${TRANS_HEIGHT}`}
                stroke={LINE_COLOR}
                strokeWidth={LINE}
                fill="none"
              />
            </Svg>
            <View
              style={{
                position: "absolute",
                left: nextX - LINE / 2,
                top: CENTER + TRANS_HEIGHT,
                bottom: 0,
                width: LINE,
                backgroundColor: LINE_COLOR,
              }}
            />
          </>
        ) : (
          <View
            style={{
              position: "absolute",
              left: x - LINE / 2,
              top: CENTER,
              bottom: 0,
              width: LINE,
              backgroundColor: LINE_COLOR,
            }}
          />
        )
      ) : null}

      {/* Dot */}
      <View
        style={[
          styles.dot,
          {
            left: x - DOT / 2,
            top: CENTER - DOT / 2,
            ...(row.depth === 1 ? { backgroundColor: LINE_COLOR } : {}),
          },
        ]}
      />
    </View>
  );
}
