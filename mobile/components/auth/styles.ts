import { StyleSheet } from "react-native";

export const authScaffoldStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f4ed",
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 36,
    gap: 20,
  },
  hero: {
    backgroundColor: "#17352f",
    borderRadius: 28,
    padding: 22,
    gap: 10,
  },
  eyebrow: {
    color: "#d8eadf",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    color: "#fffdf8",
    fontSize: 29,
    fontWeight: "800",
  },
  subtitle: {
    color: "#d4e2dc",
    fontSize: 14,
    lineHeight: 21,
  },
  formCard: {
    backgroundColor: "#fffdf9",
    borderRadius: 26,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: "#eadfcb",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    color: "#17352f",
    fontSize: 14,
    fontWeight: "700",
  },
  input: {
    backgroundColor: "#f7f4ed",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd4c5",
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: "#18211f",
    fontSize: 15,
  },
  primaryButton: {
    backgroundColor: "#17352f",
    borderRadius: 18,
    paddingVertical: 15,
    paddingHorizontal: 18,
    alignItems: "center",
  },
  primaryButtonLabel: {
    color: "#fffdf8",
    fontSize: 15,
    fontWeight: "800",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  inlineLink: {
    color: "#8b5c23",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  footerLabel: {
    color: "#59645f",
    fontSize: 14,
  },
  footerAction: {
    color: "#17352f",
    fontSize: 14,
    fontWeight: "800",
  },
  errorText: {
    color: "#a13b2d",
    fontSize: 13,
    lineHeight: 20,
  },
  successText: {
    color: "#215943",
    backgroundColor: "#def2e5",
    borderRadius: 16,
    padding: 14,
    fontSize: 14,
    lineHeight: 21,
  },
});
