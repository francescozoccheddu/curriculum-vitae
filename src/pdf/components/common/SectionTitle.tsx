import { Text } from "@react-pdf/renderer";
import { sharedStyles } from "@/pdf/theme";

export function SectionTitle(
  p: Readonly<{ children: string; minPresenceAhead?: number }>,
) {
  const { children, minPresenceAhead } = p;
  return minPresenceAhead !== undefined ? (
    <Text style={sharedStyles.sectionTitle} minPresenceAhead={minPresenceAhead}>
      {children}
    </Text>
  ) : (
    <Text style={sharedStyles.sectionTitle}>{children}</Text>
  );
}
