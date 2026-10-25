import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { Chips } from "@/pdf/components/common/Chips";
import { Masonry } from "@/pdf/components/common/Masonry";
import { SectionTitle } from "@/pdf/components/common/SectionTitle";
import { richText } from "@/pdf/richText";
import { sharedStyles } from "@/pdf/theme";
import type { Descriptor, Skill } from "@/utils/descriptor";

const styles = StyleSheet.create({
  section: {
    marginTop: 8,
  },
});

export function Skills(
  p: Readonly<{ skills: readonly Skill[]; descriptor: Descriptor }>,
) {
  const { skills, descriptor } = p;
  return (
    <View style={styles.section}>
      <SectionTitle minPresenceAhead={60}>Skills & interests</SectionTitle>
      <Masonry>
        {skills.map((skill, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static list
          <View key={i}>
            {skill.description ? (
              <Text style={sharedStyles.title}>
                {richText(skill.description)}
              </Text>
            ) : null}
            <Chips ids={skill.tags ?? []} descriptor={descriptor} />
          </View>
        ))}
      </Masonry>
    </View>
  );
}
