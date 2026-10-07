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
  Language,
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
    alignItems: "center",
  },
  pageNumber: {
    fontSize: 7.5,
    color: MUTED,
    marginBottom: 3,
  },
  disclaimer: {
    fontSize: 5.5,
    lineHeight: 1.25,
    color: MUTED,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    paddingBottom: 14,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e7",
  },
  photo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    objectFit: "cover",
    marginRight: 16,
  },
  info: {
    flex: 1,
    marginRight: 16,
  },
  name: {
    fontSize: 20,
    lineHeight: 1.2,
    marginBottom: 3,
    fontWeight: "bold",
    color: STRONG,
  },
  meta: {
    color: MUTED,
    marginBottom: 4,
  },
  contacts: {
    width: 165,
    fontSize: 8.5,
  },
  contact: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2.5,
  },
  contactIcon: {
    width: 8,
    height: 8,
    marginRight: 5,
    objectFit: "contain",
  },
  link: {
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
    fontWeight: "normal",
    color: MUTED,
  },
  description: {
    marginTop: 1,
  },
  urlContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 1,
  },
  urlIcon: {
    width: 7,
    height: 7,
    marginRight: 3,
    objectFit: "contain",
  },
  url: {
    fontSize: 8,
    color: ACCENT,
    textDecoration: "none",
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 3,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2.5,
    paddingHorizontal: 6,
    borderRadius: 8,
    marginRight: 3,
    marginBottom: 3,
  },
  chipText: {
    fontSize: 7.5,
    lineHeight: 1,
  },
  chipLogo: {
    width: 7.5,
    height: 7.5,
    marginRight: 3,
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

const languageNames = new Intl.DisplayNames(["en"], { type: "language" });

function formatLanguage(language: Language): string {
  const name = languageNames.of(language.language) ?? language.language;
  return language.level ? `${name} (${language.level})` : name;
}

function formatGrade(grade: Grade): string {
  return grade.over ? `${grade.value}/${grade.over}` : grade.value;
}

/** Strips the protocol and the trailing slash for a compact display. */
function formatUrl(url: string): string {
  return url.replace(/^[a-z]+:\/\//i, "").replace(/\/$/, "");
}

function Header(p: Readonly<{ profile: Profile }>) {
  const { profile } = p;
  const fullName = [profile.firstName, profile.lastName]
    .filter(Boolean)
    .join(" ");
  const meta = [
    profile.birthDate ? `${computeAge(profile.birthDate)} years old` : null,
    profile.contacts?.location,
    profile.drivingLicense ? "Driving license" : null,
    ...(profile.languages ?? []).map(formatLanguage),
  ].filter(Boolean);
  return (
    <View style={styles.header}>
      {profile.picture ? (
        <Image src={profile.picture} style={styles.photo} />
      ) : null}
      <View style={styles.info}>
        <Text style={styles.name}>{fullName}</Text>
        {meta.length > 0 ? (
          <Text style={styles.meta}>{meta.join(SEPARATOR)}</Text>
        ) : null}
        {profile.bio ? <Text>{richText(profile.bio)}</Text> : null}
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
    <View style={[styles.chip, { backgroundColor: `${color}1f` }]}>
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

/** Title line, followed by the optional description, URL and tags. */
function PointBody(
  p: Readonly<{
    point: Point;
    descriptor: Descriptor;
    showYear?: boolean;
  }>,
) {
  const { point, descriptor, showYear } = p;
  const subtitle = [
    point.at ? richText(point.at) : null,
    point.grade ? formatGrade(point.grade) : null,
  ].filter((part) => part !== null);
  return (
    <>
      <Text style={styles.title}>
        {showYear && point.year ? (
          <Text style={styles.projectYear}>{`${point.year}  `}</Text>
        ) : null}
        {richText(point.title)}
        {subtitle.map((part, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static parts
          <Text key={i} style={styles.subtitle}>
            {SEPARATOR}
            {part}
          </Text>
        ))}
      </Text>
      {point.description ? (
        <Text style={styles.description}>{richText(point.description)}</Text>
      ) : null}
      {point.url ? (
        <View style={styles.urlContainer}>
          <Image src={linkIcon} style={styles.urlIcon} />
          <Link src={point.url} style={styles.url}>
            {formatUrl(point.url)}
          </Link>
        </View>
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
    <View break>
      <Text style={styles.sectionTitle}>Other projects</Text>
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
    <View>
      <Text style={styles.sectionTitle} minPresenceAhead={120}>
        Skills & interests
      </Text>
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
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
          <Text style={styles.disclaimer}>{DISCLAIMER}</Text>
        </View>
        {descriptor.profile ? <Header profile={descriptor.profile} /> : null}
        {rows.map((row) => (
          <TimelineRow key={row.key} row={row} descriptor={descriptor} />
        ))}
        {skills.length > 0 ? (
          <Skills skills={skills} descriptor={descriptor} />
        ) : null}
        {moreHistory.length > 0 ? (
          <Projects points={moreHistory} descriptor={descriptor} />
        ) : null}
      </Page>
    </Document>
  );
}
