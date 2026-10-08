import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { ACCENT } from "@/content/theme";
import type { Grade } from "@/utils/descriptor";

const styles = StyleSheet.create({
  gradeChip: {
    flexDirection: "row",
    alignItems: "baseline",
    backgroundColor: `${ACCENT}18`,
    paddingVertical: 1.5,
    paddingHorizontal: 4,
    borderRadius: 4,
    marginLeft: 4,
  },
  gradeVal: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: ACCENT,
  },
  gradeOver: {
    fontSize: 6,
    color: ACCENT,
  },
});

export function GradeChip(p: Readonly<{ grade: Grade }>) {
  const { grade } = p;
  return (
    <View style={styles.gradeChip}>
      <Text style={styles.gradeVal}>{grade.value}</Text>
      {grade.over ? (
        <Text style={styles.gradeOver}>{`/${grade.over}`}</Text>
      ) : null}
    </View>
  );
}
