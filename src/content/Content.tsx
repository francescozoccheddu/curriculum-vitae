import {
  Document,
  Font,
  Image,
  Link,
  Page,
  Path,
  StyleSheet,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer";
import interBold from "@/assets/fonts/Inter-Bold.ttf";
import interBoldItalic from "@/assets/fonts/Inter-BoldItalic.ttf";
import interItalic from "@/assets/fonts/Inter-Italic.ttf";
import interMedium from "@/assets/fonts/Inter-Medium.ttf";
import interRegular from "@/assets/fonts/Inter-Regular.ttf";
import interSemiBold from "@/assets/fonts/Inter-SemiBold.ttf";
import emailIcon from "@/assets/icons/email.svg";
import githubIcon from "@/assets/icons/github.svg";
import linkIcon from "@/assets/icons/link.svg";
import linkedinIcon from "@/assets/icons/linkedin.svg";
import phoneIcon from "@/assets/icons/phone.svg";
import type {
  Contacts,
  Descriptor,
  FirstLevelPoint,
  Grade,
  Point,
  Profile,
  Skill,
  Tag,
} from "@/utils/descriptor";
import { richText } from "@/utils/richText";

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

const ACCENT = "#e0301e";
const LINE_COLOR = "#a1a1aa";
const TEXT = "#3f3f46";
const MUTED = "#71717a";
const STRONG = "#18181b";
export const DEFAULT_TAG_COLOR = "#52525b";
const LINE = 1.5;
const DOT = 8;
const YEAR_WIDTH = 34;
const GUTTER_WIDTH = 30;
const LANE_0 = 6;
const LANE_1 = 20;
const TRANS_HEIGHT = 14;
// Vertical position of the dot center, aligned with the first text line
const CENTER = 9;
const SEPARATOR = "  ·  ";
const DISCLAIMER =
  "Hereby I authorize the processing of my personal data and particular data included in my CV according to the Legislative Decree 30 June 2003, n. 196 “Rules on the protection of personal data” and the GDPR (UE Regulation 2016/679)";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Inter",
    fontSize: 9.5,
    color: TEXT,
  },
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
  header: {
    marginBottom: 16,
  },
  profileMain: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  photo: {
    width: 76,
    height: 76,
    borderRadius: 38,
    objectFit: "cover",
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    lineHeight: 1.2,
    marginBottom: 3,
    fontWeight: "bold",
    color: STRONG,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 6,
    rowGap: 2,
  },
  metaText: {
    color: MUTED,
    marginRight: 6,
  },
  langChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f5",
    paddingVertical: 1.5,
    paddingHorizontal: 5,
    borderRadius: 6,
    marginRight: 4,
  },
  langCode: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: STRONG,
  },
  langSep: {
    fontSize: 7,
    color: LINE_COLOR,
    marginHorizontal: 3,
  },
  langLevel: {
    fontSize: 7,
    color: MUTED,
  },
  contacts: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 11,
  },
  contact: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 9,
  },
  contactIcon: {
    width: 7.5,
    height: 7.5,
    marginRight: 3.5,
    objectFit: "contain",
    position: "relative",
    top: 0.5,
  },
  link: {
    fontSize: 7.2,
    color: TEXT,
    textDecoration: "none",
  },
  bold: {
    fontWeight: "bold",
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
  row: {
    flexDirection: "row",
  },
  year: {
    width: YEAR_WIDTH,
    textAlign: "right",
    fontWeight: "bold",
    color: ACCENT,
  },
  gutter: {
    width: GUTTER_WIDTH,
    position: "relative",
  },
  dot: {
    position: "absolute",
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    backgroundColor: ACCENT,
  },
  rowContent: {
    flex: 1,
    paddingBottom: 8,
  },
  title: {
    fontWeight: "bold",
    color: STRONG,
  },
  subtitle: {
    marginLeft: 4,
    fontWeight: "normal",
    color: MUTED,
  },
  description: {
    marginTop: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
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
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 3,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 7,
    marginBottom: 2.5,
  },
  chipText: {
    fontSize: 7.5,
    fontWeight: "medium",
  },
  chipLogo: {
    width: 7.5,
    height: 7.5,
    marginRight: 2.5,
    position: "relative",
    top: 0.75,
    objectFit: "contain",
  },
  projects: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginRight: -16,
  },
  project: {
    width: "50%",
    paddingRight: 16,
    paddingBottom: 8,
  },
  projectYear: {
    fontWeight: "bold",
    color: ACCENT,
  },
  skills: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginRight: -16,
  },
  skill: {
    width: "50%",
    paddingRight: 16,
    paddingBottom: 8,
  },
});

type Row = Readonly<{
  key: string;
  point: Point;
  depth: 0 | 1;
  nextDepth: 0 | 1 | undefined;
  isFirst: boolean;
  isLast: boolean;
  year: number | null;
}>;

function buildRows(history: readonly FirstLevelPoint[]): Row[] {
  const intermediate: Omit<Row, "isFirst" | "isLast" | "nextDepth" | "year">[] =
    [];
  history.forEach((parent, i) => {
    intermediate.push({
      key: `${i}`,
      point: parent,
      depth: 0,
    });
    const children = parent.children ?? [];
    children.forEach((child, j) => {
      intermediate.push({
        key: `${i}.${j}`,
        point: child,
        depth: 1,
      });
    });
  });
  // The year is shown only when it changes with respect to the previous shown one
  let lastYear: number | null = null;
  return intermediate.map((row, i) => {
    const pointYear = row.depth === 0 ? (row.point.year ?? null) : null;
    const year =
      pointYear !== null && pointYear !== lastYear ? pointYear : null;
    if (pointYear !== null) lastYear = pointYear;
    const nextRow = intermediate[i + 1];
    return {
      ...row,
      year,
      nextDepth: nextRow?.depth,
      isFirst: i === 0,
      isLast: i === intermediate.length - 1,
    };
  });
}

function computeAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const hadBirthday =
    now.getMonth() > birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate());
  if (!hadBirthday) age--;
  return age;
}

function Header(p: Readonly<{ profile: Profile }>) {
  const { profile } = p;
  const fullName = [profile.firstName, profile.lastName]
    .filter(Boolean)
    .join(" ");
  const meta = [
    profile.birthDate ? `${computeAge(profile.birthDate)} years old` : null,
    profile.contacts?.location,
  ].filter(Boolean);
  return (
    <View style={styles.header}>
      <View style={styles.profileMain}>
        {profile.picture ? (
          <Image src={profile.picture} style={styles.photo} />
        ) : null}
        <View style={styles.info}>
          <Text style={styles.name}>{fullName}</Text>
          <View style={styles.metaRow}>
            {meta.length > 0 ? (
              <Text style={styles.metaText}>{meta.join(SEPARATOR)}</Text>
            ) : null}
            {profile.languages?.map((lang) => (
              <View key={lang.language} style={styles.langChip}>
                <Text style={styles.langCode}>
                  {lang.language.toUpperCase()}
                </Text>
                <Text style={styles.langSep}>|</Text>
                <Text style={styles.langLevel}>{lang.level}</Text>
              </View>
            ))}
          </View>
          {profile.bio ? <Text>{richText(profile.bio)}</Text> : null}
        </View>
      </View>
      {profile.contacts ? <ContactList contacts={profile.contacts} /> : null}
    </View>
  );
}

function ContactList(p: Readonly<{ contacts: Contacts }>) {
  const { email, phone, github, linkedin } = p.contacts;
  const items: [icon: string, value: string, href: string][] = [];
  if (email) items.push([emailIcon, email, `mailto:${email}`]);
  if (phone) {
    const number = `${phone.prefix ? `${phone.prefix} ` : ""}${phone.number}`;
    items.push([phoneIcon, number, `tel:${number.replace(/ /g, "")}`]);
  }
  if (github)
    items.push([
      githubIcon,
      `github.com/${github}`,
      `https://github.com/${github}`,
    ]);
  if (linkedin)
    items.push([
      linkedinIcon,
      `linkedin.com/in/${linkedin}`,
      `https://www.linkedin.com/in/${linkedin}`,
    ]);
  return (
    <View style={styles.contacts}>
      {items.map(([icon, value, href]) => (
        <View key={href} style={styles.contact}>
          <Image src={icon} style={styles.contactIcon} />
          <Link src={href} style={styles.link}>
            {value}
          </Link>
        </View>
      ))}
    </View>
  );
}

function Gutter(p: Readonly<{ row: Row }>) {
  const { row } = p;
  const x = row.depth === 0 ? LANE_0 : LANE_1;
  const nextX = row.nextDepth === 0 ? LANE_0 : LANE_1;
  const hasTransition =
    row.nextDepth !== undefined && row.depth !== row.nextDepth;

  return (
    <View
      style={[
        styles.gutter,
        hasTransition ? { minHeight: CENTER + TRANS_HEIGHT } : {},
      ]}
    >
      {/* Top segment: from y = 0 to CENTER */}
      {!row.isFirst ? (
        <View
          style={{
            position: "absolute",
            left: x - LINE / 2,
            top: 0,
            height: CENTER,
            width: LINE,
            backgroundColor: LINE_COLOR,
          }}
        />
      ) : null}

      {/* Bottom segment: from y = CENTER to bottom */}
      {!row.isLast ? (
        hasTransition ? (
          <>
            <Svg
              style={{
                position: "absolute",
                left: 0,
                top: CENTER,
                width: GUTTER_WIDTH,
                height: TRANS_HEIGHT,
              }}
            >
              <Path
                d={`M ${x} 0 C ${x} ${TRANS_HEIGHT * 0.5}, ${nextX} ${TRANS_HEIGHT * 0.5}, ${nextX} ${TRANS_HEIGHT}`}
                stroke={LINE_COLOR}
                strokeWidth={LINE}
                fill="none"
              />
            </Svg>
            <View
              style={{
                position: "absolute",
                left: nextX - LINE / 2,
                top: CENTER + TRANS_HEIGHT,
                bottom: 0,
                width: LINE,
                backgroundColor: LINE_COLOR,
              }}
            />
          </>
        ) : (
          <View
            style={{
              position: "absolute",
              left: x - LINE / 2,
              top: CENTER,
              bottom: 0,
              width: LINE,
              backgroundColor: LINE_COLOR,
            }}
          />
        )
      ) : null}

      {/* Dot */}
      <View
        style={[
          styles.dot,
          {
            left: x - DOT / 2,
            top: CENTER - DOT / 2,
            ...(row.depth === 1 ? { backgroundColor: LINE_COLOR } : {}),
          },
        ]}
      />
    </View>
  );
}

function Chip(
  p: Readonly<{ id: string; tag: Tag | undefined; color: string }>,
) {
  const { id, tag, color } = p;
  return (
    <View style={styles.chip}>
      {tag?.logo ? <Image src={tag.logo} style={styles.chipLogo} /> : null}
      <Text style={[styles.chipText, { color }]}>{tag?.title ?? id}</Text>
    </View>
  );
}

function Chips(
  p: Readonly<{ ids: readonly string[]; descriptor: Descriptor }>,
) {
  const { ids, descriptor } = p;
  if (ids.length === 0) return null;
  const colors = new Map((descriptor.colors ?? []).map((c) => [c.id, c.color]));
  const tags = new Map((descriptor.tags ?? []).map((t) => [t.id, t]));
  return (
    <View style={styles.chips}>
      {ids.map((id) => {
        const tag = tags.get(id);
        const color =
          (tag?.color ? colors.get(tag.color) : null) ?? DEFAULT_TAG_COLOR;
        return <Chip key={id} id={id} tag={tag} color={color} />;
      })}
    </View>
  );
}

function GradeChip(p: Readonly<{ grade: Grade }>) {
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

/** Title line, followed by the optional description and tags. */
function PointBody(
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
        <Text style={styles.title}>{richText(point.title)}</Text>
        {point.grade ? <GradeChip grade={point.grade} /> : null}
        {point.url ? (
          <Link src={point.url} style={styles.titleLink}>
            <Image src={linkIcon} style={styles.titleLinkIcon} />
          </Link>
        ) : null}
        {point.at ? (
          <Text style={styles.subtitle}>{richText(point.at)}</Text>
        ) : null}
      </View>
      {point.description ? (
        <Text style={styles.description}>{richText(point.description)}</Text>
      ) : null}
      <Chips ids={point.tags ?? []} descriptor={descriptor} />
    </>
  );
}

function TimelineRow(p: Readonly<{ row: Row; descriptor: Descriptor }>) {
  const { row, descriptor } = p;
  return (
    <View style={styles.row} wrap={false}>
      <Text style={styles.year}>{row.year ?? ""}</Text>
      <Gutter row={row} />
      <View
        style={[
          styles.rowContent,
          row.depth === 1 ? { paddingLeft: LANE_1 - LANE_0 } : {},
        ]}
      >
        <PointBody point={row.point} descriptor={descriptor} />
      </View>
    </View>
  );
}

function Projects(
  p: Readonly<{ points: readonly Point[]; descriptor: Descriptor }>,
) {
  const { points, descriptor } = p;
  return (
    <View>
      <Text style={styles.sectionTitle} minPresenceAhead={120}>
        Other projects
      </Text>
      <View style={styles.projects}>
        {points.map((point, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static list
          <View key={i} style={styles.project} wrap={false}>
            <PointBody point={point} descriptor={descriptor} showYear />
          </View>
        ))}
      </View>
    </View>
  );
}

function Skills(
  p: Readonly<{ skills: readonly Skill[]; descriptor: Descriptor }>,
) {
  const { skills, descriptor } = p;
  return (
    <View break>
      <Text style={styles.sectionTitle}>Skills & interests</Text>
      <View style={styles.skills}>
        {skills.map((skill, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static list
          <View key={i} style={styles.skill} wrap={false}>
            {skill.description ? (
              <Text style={styles.title}>{richText(skill.description)}</Text>
            ) : null}
            <Chips ids={skill.tags ?? []} descriptor={descriptor} />
          </View>
        ))}
      </View>
    </View>
  );
}

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
        <View style={styles.footer} fixed>
          <View style={styles.footerSpacer} />
          <Text style={styles.disclaimer}>{DISCLAIMER}</Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
        </View>
        {descriptor.profile ? <Header profile={descriptor.profile} /> : null}
        {rows.map((row) => (
          <TimelineRow key={row.key} row={row} descriptor={descriptor} />
        ))}
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
