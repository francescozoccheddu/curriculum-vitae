import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import { Footer } from "@/pdf/components/footer/Footer";
import { ProfileHeader } from "@/pdf/components/profile/ProfileHeader";
import { Projects } from "@/pdf/components/projects/Projects";
import { Skills } from "@/pdf/components/skills/Skills";
import { buildRows } from "@/pdf/components/timeline/buildRows";
import { Timeline } from "@/pdf/components/timeline/Timeline";
import {
  DEFAULT_TAG_COLOR,
  FONT_SIZE,
  PAGE_PADDING_H,
  PAGE_PADDING_V,
  TEXT,
} from "@/pdf/theme";
import type { Descriptor } from "@/utils/descriptor";

export { DEFAULT_TAG_COLOR };

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: PAGE_PADDING_H,
    paddingTop: PAGE_PADDING_V,
    paddingBottom: PAGE_PADDING_V + 6,
    fontFamily: "Inter",
    fontSize: FONT_SIZE,
    color: TEXT,
  },
});

export type ContentProps = Readonly<{
  descriptor: Descriptor;
}>;

export function Content(p: ContentProps) {
  const { descriptor } = p;
  const rows = buildRows(descriptor.history ?? []);
  const skills = descriptor.skills ?? [];
  const moreHistory = descriptor.moreHistory ?? [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Footer />
        {descriptor.profile ? (
          <ProfileHeader profile={descriptor.profile} />
        ) : null}
        <Timeline rows={rows} descriptor={descriptor} />
        {moreHistory.length > 0 ? (
          <Projects points={moreHistory} descriptor={descriptor} />
        ) : null}
        {skills.length > 0 ? (
          <Skills skills={skills} descriptor={descriptor} />
        ) : null}
      </Page>
    </Document>
  );
}
