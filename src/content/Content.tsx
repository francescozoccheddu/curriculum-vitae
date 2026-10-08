import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import { Footer } from "@/content/components/footer/Footer";
import { ProfileHeader } from "@/content/components/profile/ProfileHeader";
import { Projects } from "@/content/components/projects/Projects";
import { Skills } from "@/content/components/skills/Skills";
import { buildRows } from "@/content/components/timeline/buildRows";
import { Timeline } from "@/content/components/timeline/Timeline";
import { DEFAULT_TAG_COLOR, TEXT } from "@/content/theme";
import type { Descriptor } from "@/utils/descriptor";

export { DEFAULT_TAG_COLOR };

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Inter",
    fontSize: 9.5,
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
