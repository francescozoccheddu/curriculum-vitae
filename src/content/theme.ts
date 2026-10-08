import { Font, StyleSheet } from "@react-pdf/renderer";
import interBold from "@/assets/fonts/Inter-Bold.ttf";
import interBoldItalic from "@/assets/fonts/Inter-BoldItalic.ttf";
import interItalic from "@/assets/fonts/Inter-Italic.ttf";
import interMedium from "@/assets/fonts/Inter-Medium.ttf";
import interRegular from "@/assets/fonts/Inter-Regular.ttf";
import interSemiBold from "@/assets/fonts/Inter-SemiBold.ttf";

Font.register({
  family: "Inter",
  fonts: [
    { src: interRegular, fontWeight: "normal" },
    { src: interMedium, fontWeight: "medium" },
    { src: interSemiBold, fontWeight: "semibold" },
    { src: interBold, fontWeight: "bold" },
    { src: interItalic, fontStyle: "italic" },
    { src: interBoldItalic, fontWeight: "bold", fontStyle: "italic" },
  ],
});

export const ACCENT = "#e0301e";
export const LINE_COLOR = "#a1a1aa";
export const TEXT = "#3f3f46";
export const MUTED = "#71717a";
export const STRONG = "#18181b";
export const DEFAULT_TAG_COLOR = "#52525b";

export const LINE = 1.5;
export const DOT = 8;
export const YEAR_WIDTH = 34;
export const GUTTER_WIDTH = 30;
export const LANE_0 = 6;
export const LANE_1 = 20;
export const TRANS_HEIGHT = 14;
export const CENTER = 9;

export const SEPARATOR = "  ·  ";
export const DISCLAIMER =
  "Hereby I authorize the processing of my personal data and particular data included in my CV according to the Legislative Decree 30 June 2003, n. 196 “Rules on the protection of personal data” and the GDPR (UE Regulation 2016/679)";

export const sharedStyles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    color: STRONG,
  },
  subtitle: {
    marginLeft: 4,
    fontWeight: "normal",
    color: MUTED,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: STRONG,
    marginTop: 6,
    marginBottom: 10,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e7",
  },
  link: {
    color: TEXT,
    textDecoration: "none",
  },
});
