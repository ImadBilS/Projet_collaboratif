import { StyleSheet, Text, View } from "react-native";

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fffdf8",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e5dbc8",
    gap: 8,
  },
  title: {
    color: "#1b2422",
    fontSize: 17,
    fontWeight: "800",
  },
  text: {
    color: "#596660",
    fontSize: 14,
    lineHeight: 21,
  },
});
