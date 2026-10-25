import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { MUTED, SURFACE } from "@/pdf/theme";
import type { Grade } from "@/utils/descriptor";

const styles = StyleSheet.create({
  gradeChip: {
    flexDirection: "row",
    alignItems: "baseline",
    backgroundColor: SURFACE,
    paddingVertical: 1,
    paddingHorizontal: 3.5,
    borderRadius: 3,
    marginLeft: 4,
  },
  gradeVal: {
    fontSize: 6.5,
    fontWeight: "semibold",
    color: MUTED,
  },
  gradeOver: {
    fontSize: 5.5,
    color: MUTED,
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
