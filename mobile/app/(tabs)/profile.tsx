import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../../features/auth/AuthProvider";
import { useResources } from "../../features/resources/ResourcesProvider";

export default function ProfileScreen() {
  const { user, isCitizen, logout, updateProfile } = useAuth();
  const { summary } = useResources();
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [city, setCity] = useState(user?.city ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setFirstName(user?.firstName ?? "");
    setLastName(user?.lastName ?? "");
    setCity(user?.city ?? "");
    setEmail(user?.email ?? "");
    setBio(user?.bio ?? "");
  }, [user]);

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.hero}>
            <Text style={styles.heroTitle}>Mon profil</Text>
            <Text style={styles.heroText}>
              Connecte-toi pour gérer ton compte citoyen, accéder aux contenus
              restreints et retrouver tes ressources enregistrées.
            </Text>
          </View>

          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Compte non connecté</Text>
            <Text style={styles.emptyText}>
              Tu peux consulter les ressources publiques, mais le profil et les
              contenus réservés nécessitent une connexion.
            </Text>
            <Link href="/(auth)/login" asChild>
              <Pressable style={styles.primaryButton}>
                <Text style={styles.primaryButtonLabel}>Se connecter</Text>
              </Pressable>
            </Link>
            <Link href="/(auth)/signup" asChild>
              <Pressable style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonLabel}>Créer un compte</Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!isCitizen) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.hero}>
            <Text style={styles.heroTitle}>Mode invité</Text>
            <Text style={styles.heroText}>
              Tu consultes l’application sans compte. La navigation reste ouverte,
              mais les actions personnelles sont verrouillées.
            </Text>
          </View>

          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Ce qui reste disponible</Text>
            <Text style={styles.emptyText}>
              Consultation des ressources publiques, lecture des commentaires et
              partage simple.
            </Text>
          </View>

          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Ce qui demande un compte citoyen</Text>
            <Text style={styles.emptyText}>
              Favoris, mise de côté, progression, commentaires, création de
              ressource, activités et accès aux contenus restreints.
            </Text>
            <Link href="/(auth)/login" asChild>
              <Pressable style={styles.primaryButton}>
                <Text style={styles.primaryButtonLabel}>Se connecter</Text>
              </Pressable>
            </Link>
            <Link href="/(auth)/signup" asChild>
              <Pressable style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonLabel}>Créer un compte</Text>
              </Pressable>
            </Link>
          </View>

          <Pressable
            onPress={() => {
              void logout();
            }}
            style={[styles.secondaryButton, styles.logoutButton]}
          >
            <Text style={styles.secondaryButtonLabel}>Quitter le mode invité</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Bonjour {user.firstName}</Text>
          <Text style={styles.heroText}>
            Profil simple, pensé pour le mobile: modification rapide et accès
            direct à l’essentiel.
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{summary.favorites}</Text>
            <Text style={styles.statLabel}>Ressources favorites</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {user.membership === "citizen" ? "Citoyen" : "Invité"}
            </Text>
            <Text style={styles.statLabel}>Type de compte</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{summary.savedForLater}</Text>
            <Text style={styles.statLabel}>Mises de côté</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{summary.completed}</Text>
            <Text style={styles.statLabel}>Déjà exploitées</Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <View style={styles.row}>
            <View style={[styles.fieldGroup, styles.flex]}>
              <Text style={styles.label}>Prénom</Text>
              <TextInput
                editable={false}
                style={[styles.input, styles.inputDisabled]}
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            <View style={[styles.fieldGroup, styles.flex]}>
              <Text style={styles.label}>Nom</Text>
              <TextInput
                editable={false}
                style={[styles.input, styles.inputDisabled]}
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Ville</Text>
            <TextInput style={styles.input} value={city} onChangeText={setCity} />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Adresse e-mail</Text>
            <TextInput
              editable={false}
              autoCapitalize="none"
              keyboardType="email-address"
              style={[styles.input, styles.inputDisabled]}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              multiline
              style={[styles.input, styles.textArea]}
              value={bio}
              onChangeText={setBio}
            />
          </View>

          <Text style={styles.helperText}>
            L’API mobile met à jour la ville et la bio. Le prénom, le nom et
            l’e-mail restent en lecture seule avec le back actuel.
          </Text>

          <Pressable
            onPress={async () => {
              try {
                setMessage("");
                setError("");
                await updateProfile({ city, bio });
                setMessage("Profil synchronisé avec l’API.");
              } catch (updateError) {
                setError(
                  updateError instanceof Error
                    ? updateError.message
                    : "Mise à jour impossible."
                );
              }
            }}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonLabel}>Enregistrer</Text>
          </Pressable>

          {message ? <Text style={styles.successText}>{message}</Text> : null}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <Pressable
          onPress={() => {
            void logout();
          }}
          style={[styles.secondaryButton, styles.logoutButton]}
        >
          <Text style={styles.secondaryButtonLabel}>Se déconnecter</Text>
        </Pressable>
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
    paddingBottom: 32,
    gap: 18,
  },
  hero: {
    backgroundColor: "#17352f",
    borderRadius: 26,
    padding: 20,
    gap: 10,
  },
  heroTitle: {
    color: "#fffdf8",
    fontSize: 27,
    fontWeight: "800",
  },
  heroText: {
    color: "#d7e4de",
    fontSize: 14,
    lineHeight: 21,
  },
  emptyCard: {
    backgroundColor: "#fffdf9",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#eadfcb",
    padding: 20,
    gap: 14,
  },
  emptyTitle: {
    color: "#17352f",
    fontSize: 20,
    fontWeight: "800",
  },
  emptyText: {
    color: "#52605a",
    fontSize: 14,
    lineHeight: 21,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fffdf9",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#eadfcb",
    padding: 18,
    gap: 8,
  },
  statValue: {
    color: "#17352f",
    fontSize: 22,
    fontWeight: "800",
  },
  statLabel: {
    color: "#5a6460",
    fontSize: 13,
    lineHeight: 19,
  },
  formCard: {
    backgroundColor: "#fffdf9",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#eadfcb",
    padding: 20,
    gap: 16,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  flex: {
    flex: 1,
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
  inputDisabled: {
    opacity: 0.7,
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: "top",
  },
  helperText: {
    color: "#5a6460",
    fontSize: 13,
    lineHeight: 19,
  },
  primaryButton: {
    backgroundColor: "#17352f",
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
  },
  primaryButtonLabel: {
    color: "#fffdf8",
    fontSize: 15,
    fontWeight: "800",
  },
  secondaryButton: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd4c5",
  },
  secondaryButtonLabel: {
    color: "#17352f",
    fontSize: 15,
    fontWeight: "800",
  },
  logoutButton: {
    marginTop: 2,
  },
  successText: {
    color: "#215943",
    backgroundColor: "#def2e5",
    borderRadius: 16,
    padding: 14,
    fontSize: 14,
    lineHeight: 21,
  },
  errorText: {
    color: "#9b2c2c",
    backgroundColor: "#fbe9e9",
    borderRadius: 16,
    padding: 14,
    fontSize: 14,
    lineHeight: 21,
  },
});
