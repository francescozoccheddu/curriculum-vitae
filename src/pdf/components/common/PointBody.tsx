import { Image, Link, StyleSheet, Text, View } from "@react-pdf/renderer";
import linkIcon from "@/assets/icons/link.svg";
import { Chips } from "@/pdf/components/common/Chips";
import { GradeChip } from "@/pdf/components/common/GradeChip";
import { richText } from "@/pdf/richText";
import { ACCENT, sharedStyles } from "@/pdf/theme";
import type { Descriptor, Point } from "@/utils/descriptor";

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  projectYear: {
    fontWeight: "bold",
    color: ACCENT,
  },
  titleLink: {
    marginLeft: 3,
    position: "relative",
    top: -3,
  },
  titleLinkIcon: {
    width: 6,
    height: 6,
    objectFit: "contain",
  },
  description: {
    marginTop: 1,
  },
});

/** Title line, followed by the optional description and tags. */
export function PointBody(
  p: Readonly<{
    point: Point;
    descriptor: Descriptor;
    showYear?: boolean;
  }>,
) {
  const { point, descriptor, showYear } = p;
  return (
    <>
      <View style={styles.titleRow}>
        {showYear && point.year ? (
          <Text style={styles.projectYear}>{`${point.year}  `}</Text>
        ) : null}
        <Text style={sharedStyles.title}>{richText(point.title)}</Text>
        {point.grade ? <GradeChip grade={point.grade} /> : null}
        {point.url ? (
          <Link src={point.url} style={styles.titleLink}>
            <Image src={linkIcon} style={styles.titleLinkIcon} />
          </Link>
        ) : null}
        {point.at ? (
          <Text style={sharedStyles.subtitle}>{richText(point.at)}</Text>
        ) : null}
      </View>
      {point.description ? (
        <Text style={styles.description}>{richText(point.description)}</Text>
      ) : null}
      <Chips ids={point.tags ?? []} descriptor={descriptor} />
    </>
  );
}
