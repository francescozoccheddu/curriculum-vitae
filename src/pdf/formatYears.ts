import type { Point } from "@/utils/descriptor";

export function formatYears(point: Pick<Point, "year" | "toYear">): string {
  const { year, toYear } = point;
  if (year == null) return "";
  if (toYear == null) return String(year);
  if (toYear === "now") return `${year}–…`;
  const end =
    typeof toYear === "number" &&
    Math.floor(year / 100) === Math.floor(toYear / 100)
      ? String(toYear % 100).padStart(2, "0")
      : String(toYear);
  return `${year}–${end}`;
}
