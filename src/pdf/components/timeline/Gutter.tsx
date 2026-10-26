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
// Segments extending above ongoing first row: progressively shorter dashes with round caps
const ONGOING_DASHES = [
  { length: 3.2, gap: 1.5 },
  { length: 2.0, gap: 1.5 },
  { length: 1.0, gap: 1.5 },
] as const;
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

  // Precompute absolute y positions of ongoing dashes (extending upwards from CENTER)
  let currentBottom = CENTER;
  const ongoingDashesPos = ONGOING_DASHES.map((d) => {
    const top = currentBottom - d.gap - d.length;
    currentBottom = top;
    return { top, length: d.length };
  });

  return (
    <View style={styles.gutter}>
      {/* Extension above ongoing first row: progressively shorter dashes with round caps */}
      {row.isFirst && row.ongoing
        ? ongoingDashesPos.map((dash, i) => (
            <View
              // biome-ignore lint/suspicious/noArrayIndexKey: static 3-element list
              key={i}
              style={{
                position: "absolute",
                left: x - LINE / 2,
                top: dash.top,
                height: dash.length,
                width: LINE,
                borderRadius: LINE / 2,
                backgroundColor: LINE_COLOR,
              }}
            />
          ))
        : null}

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
