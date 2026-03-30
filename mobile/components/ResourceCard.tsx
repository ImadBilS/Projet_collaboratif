import { Link } from "expo-router";
import { Pressable, Share, StyleSheet, Text, View } from "react-native";

import { useAuth } from "../features/auth/AuthProvider";
import { useResources } from "../features/resources/ResourcesProvider";
import { Resource } from "../features/resources/types";

type ResourceCardProps = {
  resource: Resource;
};

export function ResourceCard({ resource }: ResourceCardProps) {
  const { user, isCitizen } = useAuth();
  const {
    isFavorite,
    isSavedForLater,
    isCompleted,
    toggleFavorite,
    toggleSavedForLater,
    toggleCompleted,
  } = useResources();

  const locked = resource.access === "restricted" && !isCitizen;

  return (
    <Link href={`/resources/${resource.id}`} asChild>
      <Pressable style={styles.card}>
        <View style={styles.header}>
          <Text style={[styles.badge, resource.access === "restricted" && styles.badgeRestricted]}>
            {resource.access === "public" ? "Public" : "Restreint"}
          </Text>
          <Text style={styles.meta}>
            {resource.readingTime} min · {resource.relation}
          </Text>
        </View>

        <Text style={styles.title}>{resource.title}</Text>
        <Text style={styles.text}>{resource.summary}</Text>

        <View style={styles.tagRow}>
          {resource.tags.slice(0, 3).map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagLabel}>#{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actionWrap}>
          <View style={styles.actionRow}>
            <Pressable
              onPress={(event) => {
                event.stopPropagation();
                if (!isCitizen) {
                  return;
                }
                toggleFavorite(resource.id);
              }}
              style={[styles.smallButton, !isCitizen && styles.smallButtonDisabled]}
            >
              <Text style={styles.smallButtonLabel}>
                {isFavorite(resource.id) ? "Favori" : "Favori +"}
              </Text>
            </Pressable>
            <Pressable
              onPress={(event) => {
                event.stopPropagation();
                if (!isCitizen) {
                  return;
                }
                toggleSavedForLater(resource.id);
              }}
              style={[styles.smallButton, !isCitizen && styles.smallButtonDisabled]}
            >
              <Text style={styles.smallButtonLabel}>
                {isSavedForLater(resource.id) ? "De côté" : "Mettre de côté"}
              </Text>
            </Pressable>
          </View>
          <View style={styles.actionRow}>
            <Pressable
              onPress={(event) => {
                event.stopPropagation();
                if (!isCitizen) {
                  return;
                }
                toggleCompleted(resource.id);
              }}
              style={[styles.smallButton, !isCitizen && styles.smallButtonDisabled]}
            >
              <Text style={styles.smallButtonLabel}>
                {isCompleted(resource.id) ? "Exploitée" : "Marquer exploitée"}
              </Text>
            </Pressable>
            <Pressable
              onPress={(event) => {
                event.stopPropagation();
                void Share.share({
                  message: `Découvre cette ressource : ${resource.title}`,
                });
              }}
              style={styles.smallButton}
            >
              <Text style={styles.smallButtonLabel}>Partager</Text>
            </Pressable>
          </View>
        </View>

        {!isCitizen && user ? (
          <Text style={styles.lockedText}>
            Mode invité: consultation et partage uniquement.
          </Text>
        ) : null}
        {locked ? (
          <Text style={styles.lockedText}>
            Connecte-toi pour voir le contenu complet.
          </Text>
        ) : null}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fffdf8",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#e5dbc8",
    padding: 18,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  badge: {
    color: "#1d5a46",
    backgroundColor: "#dff1e8",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: "hidden",
    fontSize: 12,
    fontWeight: "700",
  },
  badgeRestricted: {
    color: "#7c5726",
    backgroundColor: "#fff0d8",
  },
  meta: {
    color: "#68716d",
    fontSize: 12,
    fontWeight: "600",
  },
  title: {
    color: "#1b2422",
    fontSize: 19,
    lineHeight: 25,
    fontWeight: "800",
  },
  text: {
    color: "#55655f",
    fontSize: 14,
    lineHeight: 21,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#f6f1e7",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagLabel: {
    color: "#53605a",
    fontSize: 12,
    fontWeight: "600",
  },
  actionWrap: {
    gap: 8,
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  smallButton: {
    backgroundColor: "#f6f1e8",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  smallButtonDisabled: {
    opacity: 0.45,
  },
  smallButtonLabel: {
    color: "#183730",
    fontSize: 12,
    fontWeight: "800",
  },
  lockedText: {
    color: "#8a5e26",
    fontSize: 12,
    fontWeight: "600",
  },
});
