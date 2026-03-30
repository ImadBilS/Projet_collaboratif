import { Link, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AppButton } from "../../components/AppButton";
import { EmptyState } from "../../components/EmptyState";
import { ScreenView } from "../../components/ScreenView";
import { useAuth } from "../../features/auth/AuthProvider";
import { useResources } from "../../features/resources/ResourcesProvider";

export default function ResourceDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const { user, isCitizen } = useAuth();
  const {
    getResourceById,
    isFavorite,
    isSavedForLater,
    isCompleted,
    toggleFavorite,
    toggleSavedForLater,
    toggleCompleted,
  } = useResources();

  const resource = getResourceById(params.id ?? "");

  if (!resource) {
    return (
      <ScreenView>
        <View style={styles.content}>
          <EmptyState
            title="Ressource introuvable"
            description="Cette ressource n’est plus disponible dans le prototype."
          />
        </View>
      </ScreenView>
    );
  }

  const locked = resource.access === "restricted" && !isCitizen;
  const canEdit = isCitizen && user && resource.ownerId === user.id;

  return (
    <ScreenView>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.heroMeta}>
            {resource.access === "public" ? "Public" : "Restreint"} · {resource.category}
          </Text>
          <Text style={styles.heroTitle}>{resource.title}</Text>
          <Text style={styles.heroText}>{resource.summary}</Text>
          <Text style={styles.heroMeta}>
            {resource.author} · {resource.publishedAt} · {resource.readingTime} min
          </Text>
        </View>

        <View style={styles.buttonColumn}>
          <AppButton
            label={isFavorite(resource.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
            onPress={() => {
              if (!isCitizen) {
                return;
              }

              toggleFavorite(resource.id);
            }}
            variant={isFavorite(resource.id) ? "secondary" : "primary"}
          />
          <AppButton
            label={isSavedForLater(resource.id) ? "Annuler mise de côté" : "Mettre de côté"}
            onPress={() => {
              if (!isCitizen) {
                return;
              }

              toggleSavedForLater(resource.id);
            }}
            variant="secondary"
          />
          <AppButton
            label={isCompleted(resource.id) ? "Marquer non exploitée" : "Marquer exploitée"}
            onPress={() => {
              if (!isCitizen) {
                return;
              }

              toggleCompleted(resource.id);
            }}
            variant="secondary"
          />
        </View>

        {user?.membership === "guest" ? (
          <View style={styles.guestNotice}>
            <Text style={styles.guestNoticeTitle}>Mode invité</Text>
            <Text style={styles.bodyText}>
              Tu peux consulter et partager, mais les favoris, commentaires,
              créations et contenus restreints restent réservés au compte citoyen.
            </Text>
          </View>
        ) : null}

        <View style={styles.bodyCard}>
          {locked ? (
            <>
              <Text style={styles.lockedTitle}>Contenu réservé</Text>
              <Text style={styles.bodyText}>
                Connecte-toi pour consulter cette ressource complète et retrouver
                ses outils associés.
              </Text>
              <Link href="/(auth)/login" asChild>
                <Pressable style={styles.inlineButton}>
                  <Text style={styles.inlineButtonLabel}>Se connecter</Text>
                </Pressable>
              </Link>
            </>
          ) : (
            resource.content.map((paragraph, index) => (
              <Text key={`${resource.id}-${index}`} style={styles.bodyText}>
                {paragraph}
              </Text>
            ))
          )}
        </View>

        <View style={styles.rowActions}>
          <Link href={`/resources/${resource.id}/comments`} asChild>
            <Pressable style={styles.inlineButtonAlt}>
              <Text style={styles.inlineButtonAltLabel}>
                Commentaires ({resource.comments.length})
              </Text>
            </Pressable>
          </Link>
          {resource.category === "Activité / Jeu" ? (
            <Link href="/(tabs)/activities" asChild>
              <Pressable style={styles.inlineButtonAlt}>
                <Text style={styles.inlineButtonAltLabel}>Voir les activités</Text>
              </Pressable>
            </Link>
          ) : null}
          {canEdit ? (
            <Link href={`/resources/edit/${resource.id}`} asChild>
              <Pressable style={styles.inlineButtonAlt}>
                <Text style={styles.inlineButtonAltLabel}>Modifier</Text>
              </Pressable>
            </Link>
          ) : null}
        </View>
      </ScrollView>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 36,
    gap: 16,
  },
  hero: {
    backgroundColor: "#183730",
    borderRadius: 26,
    padding: 22,
    gap: 10,
  },
  heroMeta: {
    color: "#d4e4dc",
    fontSize: 12,
    fontWeight: "700",
  },
  heroTitle: {
    color: "#fffdf8",
    fontSize: 29,
    lineHeight: 35,
    fontWeight: "800",
  },
  heroText: {
    color: "#d3e3db",
    fontSize: 14,
    lineHeight: 21,
  },
  buttonColumn: {
    gap: 10,
  },
  bodyCard: {
    backgroundColor: "#fffdf8",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e5dbc8",
    gap: 14,
  },
  guestNotice: {
    backgroundColor: "#fff4e2",
    borderRadius: 20,
    padding: 18,
    gap: 8,
  },
  guestNoticeTitle: {
    color: "#6d471f",
    fontSize: 17,
    fontWeight: "800",
  },
  bodyText: {
    color: "#44534f",
    fontSize: 15,
    lineHeight: 24,
  },
  lockedTitle: {
    color: "#6d471f",
    fontSize: 18,
    fontWeight: "800",
  },
  rowActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  inlineButton: {
    backgroundColor: "#183730",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  inlineButtonLabel: {
    color: "#fffdf8",
    fontSize: 14,
    fontWeight: "800",
  },
  inlineButtonAlt: {
    backgroundColor: "#fffdf8",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#ddd4c5",
  },
  inlineButtonAltLabel: {
    color: "#183730",
    fontSize: 14,
    fontWeight: "800",
  },
});
