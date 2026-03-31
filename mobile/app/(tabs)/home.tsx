import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenView } from "../../components/ScreenView";
import { SectionTitle } from "../../components/SectionTitle";
import { useActivities } from "../../features/activities/ActivitiesProvider";
import { useResources } from "../../features/resources/ResourcesProvider";

export default function HomeTabScreen() {
  const { featuredResources, summary } = useResources();
  const { activities } = useActivities();

  return (
    <ScreenView>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Accueil</Text>
          <Text style={styles.title}>Vue d’ensemble mobile</Text>
          <Text style={styles.subtitle}>
            Un parcours court pour retrouver ce qui compte: explorer, sauvegarder,
            commenter, progresser et participer à une activité.
          </Text>
        </View>

        <View style={styles.quickGrid}>
          <Link href="/(tabs)/resources" asChild>
            <Pressable style={styles.quickCard}>
              <Text style={styles.quickValue}>{summary.total}</Text>
              <Text style={styles.quickLabel}>Ressources</Text>
            </Pressable>
          </Link>
          <Link href="/collections/favorites" asChild>
            <Pressable style={styles.quickCard}>
              <Text style={styles.quickValue}>{summary.favorites}</Text>
              <Text style={styles.quickLabel}>Favoris</Text>
            </Pressable>
          </Link>
          <Link href="/collections/later" asChild>
            <Pressable style={styles.quickCard}>
              <Text style={styles.quickValue}>{summary.savedForLater}</Text>
              <Text style={styles.quickLabel}>De côté</Text>
            </Pressable>
          </Link>
          <Link href="/(tabs)/activities" asChild>
            <Pressable style={styles.quickCard}>
              <Text style={styles.quickValue}>{activities.length}</Text>
              <Text style={styles.quickLabel}>Activités</Text>
            </Pressable>
          </Link>
        </View>

        <View style={styles.section}>
          <SectionTitle
            title="À découvrir"
            subtitle="Sélection mise en avant pour démarrer rapidement."
          />
          {featuredResources.map((resource) => (
            <Link key={resource.id} href={`/resources/${resource.id}`} asChild>
              <Pressable style={styles.featuredCard}>
                <Text style={styles.featuredCategory}>
                  {resource.access === "public" ? "Public" : "Restreint"} · {resource.format}
                </Text>
                <Text style={styles.featuredTitle}>{resource.title}</Text>
                <Text style={styles.featuredText}>{resource.summary}</Text>
              </Pressable>
            </Link>
          ))}
        </View>

        <View style={styles.section}>
          <SectionTitle
            title="Actions utiles"
            subtitle="Raccourcis vers les écrans les plus démonstratifs."
          />
          <View style={styles.actionColumn}>
            <Link href="/resources/create" asChild>
              <Pressable style={styles.actionRow}>
                <Text style={styles.actionTitle}>Créer une ressource</Text>
                <Text style={styles.actionHint}>Publier une fiche citoyenne</Text>
              </Pressable>
            </Link>
            <Link href="/(tabs)/progress" asChild>
              <Pressable style={styles.actionRow}>
                <Text style={styles.actionTitle}>Voir ma progression</Text>
                <Text style={styles.actionHint}>Favoris, côté, exploitées</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 36,
    gap: 20,
  },
  hero: {
    backgroundColor: "#183730",
    borderRadius: 28,
    padding: 22,
    gap: 10,
  },
  eyebrow: {
    color: "#dcece3",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    color: "#fffdf8",
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    color: "#d3e3db",
    fontSize: 14,
    lineHeight: 21,
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickCard: {
    width: "47%",
    backgroundColor: "#fffdf8",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e5dbc8",
    gap: 8,
  },
  quickValue: {
    color: "#183730",
    fontSize: 24,
    fontWeight: "800",
  },
  quickLabel: {
    color: "#55655f",
    fontSize: 13,
    fontWeight: "600",
  },
  section: {
    gap: 12,
  },
  featuredCard: {
    backgroundColor: "#fffdf8",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e5dbc8",
    gap: 8,
  },
  featuredCategory: {
    color: "#8a6330",
    fontSize: 12,
    fontWeight: "700",
  },
  featuredTitle: {
    color: "#1b2422",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 24,
  },
  featuredText: {
    color: "#55655f",
    fontSize: 14,
    lineHeight: 21,
  },
  actionColumn: {
    gap: 12,
  },
  actionRow: {
    backgroundColor: "#fff4e2",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#efd4ac",
    gap: 6,
  },
  actionTitle: {
    color: "#6d471f",
    fontSize: 16,
    fontWeight: "800",
  },
  actionHint: {
    color: "#7a6146",
    fontSize: 13,
  },
});
