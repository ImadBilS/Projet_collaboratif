import { Link } from "expo-router";
import { ReactNode } from "react";
import {
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { authScaffoldStyles as styles } from "./styles";

type AuthScaffoldProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerLabel: string;
  footerHref: "/(auth)/login" | "/(auth)/signup" | "/(auth)/forgot-password";
  footerAction: string;
};

export function AuthScaffold({
  title,
  subtitle,
  children,
  footerLabel,
  footerHref,
  footerAction,
}: AuthScaffoldProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>Compte citoyen</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          <View style={styles.formCard}>{children}</View>

          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>{footerLabel}</Text>
            <Link href={footerHref} style={styles.footerAction}>
              {footerAction}
            </Link>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
