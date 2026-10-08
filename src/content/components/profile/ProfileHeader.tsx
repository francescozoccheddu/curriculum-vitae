import { Image, StyleSheet, Text, View } from "@react-pdf/renderer";
import { Contacts } from "@/content/components/profile/Contacts";
import { LINE_COLOR, MUTED, SEPARATOR, STRONG } from "@/content/theme";
import type { Profile } from "@/utils/descriptor";
import { richText } from "@/utils/richText";

const styles = StyleSheet.create({
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
});

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

export function ProfileHeader(p: Readonly<{ profile: Profile }>) {
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
      {profile.contacts ? <Contacts contacts={profile.contacts} /> : null}
    </View>
  );
}
