import { Pressable, StyleSheet, Text } from "react-native";

type ChipProps = {
  label: string;
  active?: boolean;
  onPress: () => void;
};

export function Chip({ label, active = false, onPress }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.base, active && styles.active]}
    >
      <Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: "#fffdf8",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e4dbcc",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  active: {
    backgroundColor: "#183730",
    borderColor: "#183730",
  },
  label: {
    color: "#4a5954",
    fontSize: 13,
    fontWeight: "700",
  },
  activeLabel: {
    color: "#fffdf8",
  },
});
