import { StyleSheet, Text, View } from "react-native";

type SectionTitleProps = {
  title: string;
  subtitle?: string;
};

export function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 4,
  },
  title: {
    color: "#183730",
    fontSize: 20,
    fontWeight: "800",
  },
  subtitle: {
    color: "#64706b",
    fontSize: 13,
    lineHeight: 18,
  },
});
