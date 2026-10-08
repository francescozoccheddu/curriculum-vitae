import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { Chips } from "@/content/components/common/Chips";
import { SectionTitle } from "@/content/components/common/SectionTitle";
import { sharedStyles } from "@/content/theme";
import type { Descriptor, Skill } from "@/utils/descriptor";
import { richText } from "@/utils/richText";

const styles = StyleSheet.create({
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

export function Skills(
  p: Readonly<{ skills: readonly Skill[]; descriptor: Descriptor }>,
) {
  const { skills, descriptor } = p;
  return (
    <View break>
      <SectionTitle>Skills & interests</SectionTitle>
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
