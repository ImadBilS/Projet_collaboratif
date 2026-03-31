import { ScrollView, StyleSheet, View } from "react-native";

import { EmptyState } from "../../components/EmptyState";
import { ResourceCard } from "../../components/ResourceCard";
import { ScreenView } from "../../components/ScreenView";
import { useResources } from "../../features/resources/ResourcesProvider";

export default function FavoritesScreen() {
  const { collections } = useResources();

  return (
    <ScreenView>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.list}>
          {collections.favorites.length === 0 ? (
            <EmptyState
              title="Aucun favori"
              description="Ajoute une ressource en favori pour la retrouver ici."
            />
          ) : (
            collections.favorites.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))
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
  },
  list: {
    gap: 14,
  },
});
