import { Image, Link, StyleSheet, Text, View } from "@react-pdf/renderer";
import linkIcon from "@/assets/icons/link.svg";
import { Chips } from "@/pdf/components/common/Chips";
import { GradeChip } from "@/pdf/components/common/GradeChip";
import { richText } from "@/pdf/richText";
import { SUBTLE, sharedStyles } from "@/pdf/theme";
import type { Descriptor, Point } from "@/utils/descriptor";

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  projectYear: {
    fontSize: 7.2,
    fontWeight: "bold",
    color: SUBTLE,
    marginRight: 4,
  },
  titleLink: {
    marginLeft: 3,
    position: "relative",
    top: -2.5,
  },
  titleLinkIcon: {
    width: 5,
    height: 5,
    objectFit: "contain",
  },
  description: {
    marginTop: 0.5,
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
          <Text style={styles.projectYear}>{point.year}</Text>
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
