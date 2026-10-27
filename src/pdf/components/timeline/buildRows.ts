import { formatYears } from "@/pdf/formatYears";
import type { FirstLevelPoint, Point } from "@/utils/descriptor";

export type Row = Readonly<{
  key: string;
  point: Point;
  depth: 0 | 1;
  prevDepth: 0 | 1 | undefined;
  nextDepth: 0 | 1 | undefined;
  isFirst: boolean;
  isLast: boolean;
  year: string | null;
  /** Whether the first row's line is extended upwards to signal it is still ongoing. */
  ongoing: boolean;
}>;

export function buildRows(history: readonly FirstLevelPoint[]): Row[] {
  const intermediate: Pick<Row, "key" | "point" | "depth" | "ongoing">[] = [];
  history.forEach((parent, i) => {
    intermediate.push({
      key: `${i}`,
      point: parent,
      depth: 0,
      ongoing: parent.ongoing ?? parent.toYear === "now",
    });
    const children = parent.children ?? [];
    children.forEach((child, j) => {
      intermediate.push({
        key: `${i}.${j}`,
        point: child,
        depth: 1,
        ongoing: false,
      });
    });
  });
  return intermediate.map((row, i) => {
    const year = row.depth === 0 ? formatYears(row.point) : null;
    const prevRow = intermediate[i - 1];
    const nextRow = intermediate[i + 1];
    return {
      ...row,
      year,
      prevDepth: prevRow?.depth,
      nextDepth: nextRow?.depth,
      isFirst: i === 0,
      isLast: i === intermediate.length - 1,
    };
  });
}
