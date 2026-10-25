import { StyleSheet, View } from "@react-pdf/renderer";
import { Children, type ReactNode } from "react";
import { useMeasureScope } from "@/pdf/measure";

const styles = StyleSheet.create({
  columns: {
    flexDirection: "row",
  },
  column: {
    flex: 1,
  },
});

export function Masonry(
  p: Readonly<{
    columns?: number;
    gap?: number;
    itemSpacing?: number;
    children: ReactNode;
  }>,
) {
  const { columns = 2, gap = 16, itemSpacing = 7, children } = p;
  const items = Children.toArray(children);
  const measure = useMeasureScope();

  const cols: { index: number; id: string | undefined; child: ReactNode }[][] =
    Array.from({ length: columns }, () => []);
  const colHeights = new Array<number>(columns).fill(0);

  items.forEach((child, index) => {
    const { id, rect } = measure(index);
    // During the measurement pass (`rect === undefined`), place all items in column 0
    // so each item is laid out at the exact width of a single column.
    let targetCol = 0;
    if (rect !== undefined) {
      for (let c = 1; c < columns; c++) {
        if ((colHeights[c] ?? 0) < (colHeights[targetCol] ?? 0)) {
          targetCol = c;
        }
      }
    }
    cols[targetCol]?.push({ index, id, child });
    colHeights[targetCol] = (colHeights[targetCol] ?? 0) + (rect?.height ?? 0);
  });

  return (
    <View style={[styles.columns, { gap }]}>
      {cols.map((col, colIndex) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: fixed column count
        <View key={colIndex} style={styles.column}>
          {col.map(({ index, id, child }) => {
            const viewProps = id !== undefined ? { id } : {};
            return (
              <View
                key={index}
                {...viewProps}
                style={{ paddingBottom: itemSpacing }}
                wrap={false}
              >
                {child}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}
