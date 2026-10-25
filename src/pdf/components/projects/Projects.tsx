import { View } from "@react-pdf/renderer";
import { Masonry } from "@/pdf/components/common/Masonry";
import { PointBody } from "@/pdf/components/common/PointBody";
import { SectionTitle } from "@/pdf/components/common/SectionTitle";
import type { Descriptor, Point } from "@/utils/descriptor";

export function Projects(
  p: Readonly<{ points: readonly Point[]; descriptor: Descriptor }>,
) {
  const { points, descriptor } = p;
  return (
    <View break>
      <SectionTitle>Other projects</SectionTitle>
      <Masonry>
        {points.map((point, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static list
          <PointBody key={i} point={point} descriptor={descriptor} showYear />
        ))}
      </Masonry>
    </View>
  );
}
