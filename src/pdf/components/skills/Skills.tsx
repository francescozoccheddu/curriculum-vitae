import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { Chips } from "@/pdf/components/common/Chips";
import { SectionTitle } from "@/pdf/components/common/SectionTitle";
import { richText } from "@/pdf/richText";
import { sharedStyles } from "@/pdf/theme";
import type { Descriptor, Skill } from "@/utils/descriptor";

const styles = StyleSheet.create({
  section: {
    marginTop: 8,
  },
  skills: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginRight: -16,
  },
  skill: {
    width: "50%",
    paddingRight: 16,
    paddingBottom: 7,
  },
});

export function Skills(
  p: Readonly<{ skills: readonly Skill[]; descriptor: Descriptor }>,
) {
  const { skills, descriptor } = p;
  return (
    <View style={styles.section}>
      <SectionTitle minPresenceAhead={60}>Skills & interests</SectionTitle>
      <View style={styles.skills}>
        {skills.map((skill, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static list
          <View key={i} style={styles.skill} wrap={false}>
            {skill.description ? (
              <Text style={sharedStyles.title}>
                {richText(skill.description)}
              </Text>
            ) : null}
            <Chips ids={skill.tags ?? []} descriptor={descriptor} />
          </View>
        ))}
      </View>
    </View>
  );
}
