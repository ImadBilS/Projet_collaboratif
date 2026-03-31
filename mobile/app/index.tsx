import { Link, router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../features/auth/AuthProvider";

export default function HomeScreen() {
  const { continueAsGuest } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Version mobile</Text>
          <Text style={styles.title}>(RE)Sources Relationnelles</Text>
          <Text style={styles.description}>
            Trouver une ressource utile, la garder de côté, suivre sa progression
            et participer à une activité collective depuis un smartphone.
          </Text>
        </View>

        <View style={styles.ctaBlock}>
          <Link href="/(tabs)/resources" asChild>
            <Pressable style={[styles.primaryAction, styles.actionShadow]}>
              <Text style={styles.primaryActionLabel}>Explorer les ressources</Text>
              <Text style={styles.primaryActionHint}>
                Accéder directement au catalogue mobile.
              </Text>
            </Pressable>
          </Link>

          <View style={styles.secondaryRow}>
            <Link href="/(auth)/signup" asChild>
              <Pressable style={styles.secondaryAction}>
                <Text style={styles.secondaryActionLabel}>Créer un compte</Text>
                <Text style={styles.secondaryActionHint}>Compte citoyen</Text>
              </Pressable>
            </Link>

            <Link href="/(auth)/login" asChild>
              <Pressable style={styles.secondaryAction}>
                <Text style={styles.secondaryActionLabel}>Se connecter</Text>
                <Text style={styles.secondaryActionHint}>Retrouver son suivi</Text>
              </Pressable>
            </Link>
          </View>

          <Pressable
            onPress={() => {
              continueAsGuest();
              router.push("/(tabs)/resources");
            }}
            style={styles.guestAction}
          >
            <Text style={styles.guestActionLabel}>Continuer sans compte</Text>
            <Text style={styles.guestActionHint}>
              Consultation libre, mais sans favoris, commentaires ni création.
            </Text>
          </Pressable>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Parcours principaux</Text>
          <View style={styles.flowList}>
            <View style={styles.flowCard}>
              <Text style={styles.flowTitle}>Découvrir</Text>
              <Text style={styles.flowText}>
                Recherche, filtres et tri pour trouver vite une ressource adaptée.
              </Text>
            </View>
            <View style={styles.flowCard}>
              <Text style={styles.flowTitle}>Suivre</Text>
              <Text style={styles.flowText}>
                Favoris, ressources mises de côté et déjà exploitées.
              </Text>
            </View>
            <View style={styles.flowCard}>
              <Text style={styles.flowTitle}>Échanger</Text>
              <Text style={styles.flowText}>
                Commentaires publics, réponses et messagerie simple dans les activités.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f4ed",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 24,
  },
  hero: {
    backgroundColor: "#17352f",
    borderRadius: 28,
    padding: 24,
    gap: 12,
  },
  eyebrow: {
    color: "#d8eadf",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: {
    color: "#fffdf8",
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 38,
  },
  description: {
    color: "#dce9e2",
    fontSize: 15,
    lineHeight: 22,
  },
  panel: {
    backgroundColor: "#fffdf9",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e4dccf",
    gap: 14,
  },
  panelTitle: {
    color: "#17352f",
    fontSize: 18,
    fontWeight: "800",
  },
  bulletList: {
    gap: 10,
  },
  bulletItem: {
    color: "#4d5752",
    fontSize: 14,
    lineHeight: 21,
  },
  ctaBlock: {
    gap: 12,
  },
  primaryAction: {
    backgroundColor: "#f1b76a",
    borderRadius: 24,
    padding: 20,
    gap: 8,
  },
  actionShadow: {
    shadowColor: "#17352f",
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  primaryActionLabel: {
    color: "#1d1d1b",
    fontSize: 19,
    fontWeight: "800",
  },
  primaryActionHint: {
    color: "#47331b",
    fontSize: 14,
    lineHeight: 20,
  },
  secondaryRow: {
    flexDirection: "row",
    gap: 12,
  },
  secondaryAction: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e3ddd1",
    gap: 6,
  },
  secondaryActionLabel: {
    color: "#17352f",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryActionHint: {
    color: "#5c655f",
    fontSize: 13,
  },
  guestAction: {
    backgroundColor: "#efe7d9",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#ddd1bc",
    gap: 6,
  },
  guestActionLabel: {
    color: "#17352f",
    fontSize: 16,
    fontWeight: "800",
  },
  guestActionHint: {
    color: "#5c655f",
    fontSize: 13,
    lineHeight: 19,
  },
  flowList: {
    gap: 12,
  },
  flowCard: {
    backgroundColor: "#f8f4ec",
    borderRadius: 18,
    padding: 18,
    gap: 8,
  },
  flowTitle: {
    color: "#17352f",
    fontSize: 16,
    fontWeight: "800",
  },
  flowText: {
    color: "#4d5752",
    fontSize: 14,
    lineHeight: 21,
  },
});
