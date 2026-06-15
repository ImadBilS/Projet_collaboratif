import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { EmptyState } from "../../components/EmptyState";
import { ResourceCard } from "../../components/ResourceCard";
import { ScreenView } from "../../components/ScreenView";
import { SectionTitle } from "../../components/SectionTitle";
import { useResources } from "../../features/resources/ResourcesProvider";

export default function ProgressTabScreen() {
  const { collections, summary } = useResources();

  return (
    <ScreenView>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Ma progression</Text>
          <Text style={styles.heroText}>
            Un tableau de bord simple pour retrouver les ressources favorites,
            mises de côté et déjà exploitées.
          </Text>
        </View>

        <View style={styles.statRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{summary.favorites}</Text>
            <Text style={styles.statLabel}>Favoris</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{summary.savedForLater}</Text>
            <Text style={styles.statLabel}>De côté</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{summary.completed}</Text>
            <Text style={styles.statLabel}>Exploitées</Text>
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle
            title="Collections"
            subtitle="Toutes les listes utiles restent dans cet onglet pour éviter les sorties de navigation."
          />
          <View style={styles.rowCard}>
            <Text style={styles.rowTitle}>Mes favoris</Text>
            <Text style={styles.rowHint}>{collections.favorites.length} ressource(s)</Text>
          </View>
          {collections.favorites.length === 0 ? (
            <EmptyState
              title="Aucun favori"
              description="Ajoute une ressource en favori pour la retrouver ici."
            />
          ) : (
            <View style={styles.list}>
              {collections.favorites.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </View>
          )}

          <View style={styles.rowCard}>
            <Text style={styles.rowTitle}>Mises de côté</Text>
            <Text style={styles.rowHint}>
              {collections.savedForLater.length} ressource(s)
            </Text>
          </View>
          {collections.savedForLater.length === 0 ? (
            <EmptyState
              title="Aucune ressource de côté"
              description="Utilise l’action dédiée sur une ressource pour la reprendre plus tard."
            />
          ) : (
            <View style={styles.list}>
              {collections.savedForLater.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </View>
          )}

          <View style={styles.rowCard}>
            <Text style={styles.rowTitle}>Déjà exploitées</Text>
            <Text style={styles.rowHint}>{collections.completed.length} ressource(s)</Text>
          </View>
          {collections.completed.length === 0 ? (
            <EmptyState
              title="Aucune ressource exploitée"
              description="Marque une ressource comme exploitée pour nourrir ton suivi."
            />
          ) : (
            <View style={styles.list}>
              {collections.completed.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <SectionTitle title="Prochaine étape" subtitle="Une recommandation simple pour guider la suite." />
          {collections.savedForLater[0] ? (
            <Pressable
              onPress={() => {
                router.push(`/resources/${collections.savedForLater[0].id}`);
              }}
              style={styles.nextCard}
            >
              <Text style={styles.nextLabel}>À reprendre</Text>
              <Text style={styles.nextTitle}>{collections.savedForLater[0].title}</Text>
              <Text style={styles.nextText}>{collections.savedForLater[0].summary}</Text>
            </Pressable>
          ) : (
            <EmptyState
              title="Aucune ressource mise de côté"
              description="Ajoute une ressource dans ta pile de reprise pour faire vivre le tableau de bord."
            />
          )}
        </View>
      </ScrollView>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 36,
    gap: 18,
  },
  hero: {
    backgroundColor: "#183730",
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
    color: "#d7e5de",
    fontSize: 14,
    lineHeight: 21,
  },
  statRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fffdf8",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5dbc8",
    gap: 6,
  },
  statValue: {
    color: "#183730",
    fontSize: 24,
    fontWeight: "800",
  },
  statLabel: {
    color: "#596660",
    fontSize: 12,
    fontWeight: "600",
  },
  section: {
    gap: 12,
  },
  list: {
    gap: 14,
  },
  rowCard: {
    backgroundColor: "#fffdf8",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e5dbc8",
    gap: 6,
  },
  rowTitle: {
    color: "#1b2422",
    fontSize: 16,
    fontWeight: "800",
  },
  rowHint: {
    color: "#596660",
    fontSize: 13,
  },
  nextCard: {
    backgroundColor: "#fff4e2",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#efd4ac",
    gap: 8,
  },
  nextLabel: {
    color: "#8b5f26",
    fontSize: 12,
    fontWeight: "700",
  },
  nextTitle: {
    color: "#6d471f",
    fontSize: 17,
    fontWeight: "800",
  },
  nextText: {
    color: "#71593d",
    fontSize: 14,
    lineHeight: 21,
  },
});
