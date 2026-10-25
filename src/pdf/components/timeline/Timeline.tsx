import { View } from "@react-pdf/renderer";
import type { Row } from "@/pdf/components/timeline/buildRows";
import { TimelineRow } from "@/pdf/components/timeline/TimelineRow";
import type { Descriptor } from "@/utils/descriptor";

export function Timeline(
  p: Readonly<{ rows: readonly Row[]; descriptor: Descriptor }>,
) {
  const { rows, descriptor } = p;
  return (
    <View>
      {rows.map((row) => (
        <TimelineRow key={row.key} row={row} descriptor={descriptor} />
      ))}
    </View>
  );
}
