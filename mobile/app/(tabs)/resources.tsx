import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { Chip } from "../../components/Chip";
import { ScreenView } from "../../components/ScreenView";
import { SectionTitle } from "../../components/SectionTitle";
import { ResourceCard } from "../../components/ResourceCard";
import { useResources } from "../../features/resources/ResourcesProvider";
import { ResourceAccess, ResourceCategory, ResourceRelation } from "../../features/resources/types";

type AccessFilter = "all" | ResourceAccess;
type SortMode = "latest" | "popular" | "quick";

export default function ResourcesTabScreen() {
  const { resources } = useResources();
  const [query, setQuery] = useState("");
  const [access, setAccess] = useState<AccessFilter>("all");
  const [relation, setRelation] = useState<"all" | ResourceRelation>("all");
  const [category, setCategory] = useState<"all" | ResourceCategory>("all");
  const [sortMode, setSortMode] = useState<SortMode>("latest");

  const filteredResources = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return [...resources]
      .filter((resource) => {
        const matchesQuery =
          !normalizedQuery ||
          resource.title.toLowerCase().includes(normalizedQuery) ||
          resource.summary.toLowerCase().includes(normalizedQuery) ||
          resource.tags.join(" ").toLowerCase().includes(normalizedQuery);

        const matchesAccess = access === "all" || resource.access === access;
        const matchesRelation =
          relation === "all" || resource.relation === relation;
        const matchesCategory =
          category === "all" || resource.category === category;

        return matchesQuery && matchesAccess && matchesRelation && matchesCategory;
      })
      .sort((first, second) => {
        if (sortMode === "popular") {
          return second.likes - first.likes;
        }

        if (sortMode === "quick") {
          return first.readingTime - second.readingTime;
        }

        return second.publishedTimestamp - first.publishedTimestamp;
      });
  }, [access, category, query, relation, resources, sortMode]);

  return (
    <ScreenView>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Ressources relationnelles</Text>
          <Text style={styles.heroText}>
            Recherche, filtres et tri mobile-first pour trouver rapidement une
            ressource utile selon le contexte relationnel.
          </Text>
        </View>

        <TextInput
          accessibilityLabel="Rechercher une ressource"
          onChangeText={setQuery}
          placeholder="Rechercher par titre ou mot-clé"
          placeholderTextColor="#8a908b"
          style={styles.input}
          value={query}
        />

        <View style={styles.section}>
          <SectionTitle title="Accès" subtitle="Public ou réservé aux comptes connectés." />
          <View style={styles.chips}>
            <Chip label="Tout" active={access === "all"} onPress={() => setAccess("all")} />
            <Chip label="Public" active={access === "public"} onPress={() => setAccess("public")} />
            <Chip
              label="Restreint"
              active={access === "restricted"}
              onPress={() => setAccess("restricted")}
            />
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle title="Relation" subtitle="Filtrer selon le type de lien humain." />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chips}>
              {(
                ["all", "Famille", "Couple", "Amitié", "Travail", "Voisinage"] as const
              ).map((item) => (
                <Chip
                  key={item}
                  label={item === "all" ? "Tous" : item}
                  active={relation === item}
                  onPress={() => setRelation(item)}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <SectionTitle title="Format" subtitle="Article, activité, guide ou fiche pratique." />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chips}>
              {(
                ["all", "Article", "Guide", "Fiche pratique", "Activité / Jeu"] as const
              ).map((item) => (
                <Chip
                  key={item}
                  label={item === "all" ? "Tous" : item}
                  active={category === item}
                  onPress={() => setCategory(item)}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <SectionTitle title="Tri" subtitle="Ordonner la liste selon l’objectif du moment." />
          <View style={styles.chips}>
            <Chip label="Plus récents" active={sortMode === "latest"} onPress={() => setSortMode("latest")} />
            <Chip label="Populaires" active={sortMode === "popular"} onPress={() => setSortMode("popular")} />
            <Chip label="Lecture rapide" active={sortMode === "quick"} onPress={() => setSortMode("quick")} />
          </View>
        </View>

        <Text style={styles.resultText}>
          {filteredResources.length} ressource{filteredResources.length > 1 ? "s" : ""}
        </Text>

        <View style={styles.list}>
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
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
    color: "#d6e6de",
    fontSize: 14,
    lineHeight: 21,
  },
  input: {
    backgroundColor: "#fffdf8",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ddd4c5",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#18211f",
  },
  section: {
    gap: 10,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  resultText: {
    color: "#596660",
    fontSize: 13,
    fontWeight: "600",
  },
  list: {
    gap: 14,
  },
});
