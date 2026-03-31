import { Pressable, StyleSheet, Text } from "react-native";

type AppButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
};

export function AppButton({
  label,
  onPress,
  variant = "primary",
}: AppButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.base,
        variant === "primary" ? styles.primary : styles.secondary,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === "primary" ? styles.primaryLabel : styles.secondaryLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: "center",
  },
  primary: {
    backgroundColor: "#183730",
  },
  secondary: {
    backgroundColor: "#fffdf8",
    borderWidth: 1,
    borderColor: "#ddd4c5",
  },
  label: {
    fontSize: 15,
    fontWeight: "800",
  },
  primaryLabel: {
    color: "#fffdf8",
  },
  secondaryLabel: {
    color: "#183730",
  },
});
