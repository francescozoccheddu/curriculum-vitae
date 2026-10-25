import { StyleSheet, Text, View } from "@react-pdf/renderer";
import {
  DISCLAIMER,
  PAGE_PADDING_H,
  PAGE_PADDING_V,
  SUBTLE,
} from "@/pdf/theme";

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: PAGE_PADDING_V,
    left: PAGE_PADDING_H,
    right: PAGE_PADDING_H,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerSpacer: {
    width: 35,
  },
  pageNumber: {
    width: 35,
    fontSize: 6.5,
    color: SUBTLE,
    textAlign: "right",
  },
  disclaimer: {
    flex: 1,
    fontSize: 5,
    lineHeight: 1.25,
    color: SUBTLE,
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
