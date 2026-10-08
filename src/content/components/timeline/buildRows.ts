import type { FirstLevelPoint, Point } from "@/utils/descriptor";

export type Row = Readonly<{
  key: string;
  point: Point;
  depth: 0 | 1;
  nextDepth: 0 | 1 | undefined;
  isFirst: boolean;
  isLast: boolean;
  year: number | null;
}>;

export function buildRows(history: readonly FirstLevelPoint[]): Row[] {
  const intermediate: Omit<Row, "isFirst" | "isLast" | "nextDepth" | "year">[] =
    [];
  history.forEach((parent, i) => {
    intermediate.push({
      key: `${i}`,
      point: parent,
      depth: 0,
    });
    const children = parent.children ?? [];
    children.forEach((child, j) => {
      intermediate.push({
        key: `${i}.${j}`,
        point: child,
        depth: 1,
      });
    });
  });
  // The year is shown only when it changes with respect to the previous shown one
  let lastYear: number | null = null;
  return intermediate.map((row, i) => {
    const pointYear = row.depth === 0 ? (row.point.year ?? null) : null;
    const year =
      pointYear !== null && pointYear !== lastYear ? pointYear : null;
    if (pointYear !== null) lastYear = pointYear;
    const nextRow = intermediate[i + 1];
    return {
      ...row,
      year,
      nextDepth: nextRow?.depth,
      isFirst: i === 0,
      isLast: i === intermediate.length - 1,
    };
  });
}
