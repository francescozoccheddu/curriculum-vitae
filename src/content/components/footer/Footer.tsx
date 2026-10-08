import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { DISCLAIMER, MUTED } from "@/content/theme";

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 14,
    left: 40,
    right: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerSpacer: {
    width: 35,
  },
  pageNumber: {
    width: 35,
    fontSize: 7.5,
    color: MUTED,
    textAlign: "right",
  },
  disclaimer: {
    flex: 1,
    fontSize: 5.5,
    lineHeight: 1.25,
    color: MUTED,
    textAlign: "center",
    paddingHorizontal: 8,
  },
});

export function Footer() {
  return (
    <View style={styles.footer} fixed>
      <View style={styles.footerSpacer} />
      <Text style={styles.disclaimer}>{DISCLAIMER}</Text>
      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
      />
    </View>
  );
}
