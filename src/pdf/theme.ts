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

export const ACCENT = "#18181b";
export const LINE_COLOR = "#d4d4d8";
export const TEXT = "#3f3f46";
export const MUTED = "#71717a";
export const SUBTLE = "#a1a1aa";
export const STRONG = "#18181b";
export const SURFACE = "#f4f4f5";
export const DEFAULT_TAG_COLOR = "#71717a";
/** When true, tags ignore the descriptor colors and use DEFAULT_TAG_COLOR. */
export const MONOCHROME_TAGS = true;
export const LOGO_HEIGHT = 6.5;

export const PAGE_PADDING_H = 30;
export const PAGE_PADDING_V = 28;
export const FONT_SIZE = 8.5;

export const LINE = 0.6;
export const DOT_0 = 4.4;
export const DOT_1 = 2.8;
export const YEAR_WIDTH = 20;
export const GUTTER_WIDTH = 15;
export const LANE_0 = 5.5;
export const LANE_1 = 9.5;
export const ROW_GAP = 6;
export const CHILD_INDENT = 4;
/** Vertical offset of the dot center from the top of a row (title midline). */
export const CENTER = 5.8;

export const SEPARATOR = "  ·  ";
export const DISCLAIMER =
  "Hereby I authorize the processing of my personal data and particular data included in my CV according to the Legislative Decree 30 June 2003, n. 196 “Rules on the protection of personal data” and the GDPR (UE Regulation 2016/679)";

export const sharedStyles = StyleSheet.create({
  title: {
    fontWeight: "semibold",
    color: STRONG,
  },
  subtitle: {
    marginLeft: 5,
    fontWeight: "normal",
    color: MUTED,
  },
  sectionTitle: {
    fontSize: 7.5,
    fontWeight: "semibold",
    color: MUTED,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginTop: 4,
    marginBottom: 8,
    paddingBottom: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: LINE_COLOR,
  },
  link: {
    color: TEXT,
    textDecoration: "none",
  },
});
