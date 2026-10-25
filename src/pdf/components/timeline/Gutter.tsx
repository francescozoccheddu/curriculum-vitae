import { Path, StyleSheet, Svg, View } from "@react-pdf/renderer";
import type { Row } from "@/pdf/components/timeline/buildRows";
import {
  CENTER,
  DOT_0,
  DOT_1,
  GUTTER_WIDTH,
  LANE_0,
  LANE_1,
  LINE,
  LINE_COLOR,
  ROW_GAP,
} from "@/pdf/theme";

const DOT_LEAD_IN = DOT_0 / 2;
const CURVE_HEIGHT = ROW_GAP + CENTER - DOT_LEAD_IN;

const styles = StyleSheet.create({
  gutter: {
    width: GUTTER_WIDTH,
    position: "relative",
  },
  dot: {
    position: "absolute",
  },
});

export function Gutter(p: Readonly<{ row: Row }>) {
  const { row } = p;
  const x = row.depth === 0 ? LANE_0 : LANE_1;
  const nextX =
    row.nextDepth === undefined ? x : row.nextDepth === 0 ? LANE_0 : LANE_1;
  const hasTransition =
    !row.isLast && row.nextDepth !== undefined && x !== nextX;
  const hadTransition =
    !row.isFirst && row.prevDepth !== undefined && row.prevDepth !== row.depth;
  const dotSize = row.depth === 0 ? DOT_0 : DOT_1;

  return (
    <View style={styles.gutter}>
      {/* Top segment: from y = 0 (or end of previous curve) to CENTER */}
      {!row.isFirst ? (
        <View
          style={{
            position: "absolute",
            left: x - LINE / 2,
            top: hadTransition ? CENTER - DOT_LEAD_IN : 0,
            height: hadTransition ? DOT_LEAD_IN : CENTER,
            width: LINE,
            backgroundColor: LINE_COLOR,
          }}
        />
      ) : null}

      {/* Bottom segment: from y = CENTER to bottom (or into next row when transitioning) */}
      {!row.isLast ? (
        hasTransition ? (
          <>
            <View
              style={{
                position: "absolute",
                left: x - LINE / 2,
                top: CENTER,
                bottom: ROW_GAP,
                width: LINE,
                backgroundColor: LINE_COLOR,
              }}
            />
            <Svg
              style={{
                position: "absolute",
                left: 0,
                bottom: -(CENTER - DOT_LEAD_IN),
                width: GUTTER_WIDTH,
                height: CURVE_HEIGHT,
              }}
            >
              <Path
                d={`M ${x} 0 C ${x} ${CURVE_HEIGHT * 0.5}, ${nextX} ${CURVE_HEIGHT * 0.5}, ${nextX} ${CURVE_HEIGHT}`}
                stroke={LINE_COLOR}
                strokeWidth={LINE}
                fill="none"
              />
            </Svg>
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

      {/* Dot at (x, CENTER) */}
      <View
        style={[
          styles.dot,
          {
            left: x - dotSize / 2,
            top: CENTER - dotSize / 2,
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: LINE_COLOR,
          },
        ]}
      />
    </View>
  );
}
