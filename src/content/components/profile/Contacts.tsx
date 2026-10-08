import { Image, Link, StyleSheet, View } from "@react-pdf/renderer";
import emailIcon from "@/assets/icons/email.svg";
import githubIcon from "@/assets/icons/github.svg";
import linkedinIcon from "@/assets/icons/linkedin.svg";
import phoneIcon from "@/assets/icons/phone.svg";
import { TEXT } from "@/content/theme";
import type { Contacts as ContactsData } from "@/utils/descriptor";

const styles = StyleSheet.create({
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
});

export function Contacts(p: Readonly<{ contacts: ContactsData }>) {
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
