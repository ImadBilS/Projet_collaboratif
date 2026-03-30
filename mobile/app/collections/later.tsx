import { ScrollView, StyleSheet, View } from "react-native";

import { EmptyState } from "../../components/EmptyState";
import { ResourceCard } from "../../components/ResourceCard";
import { ScreenView } from "../../components/ScreenView";
import { useResources } from "../../features/resources/ResourcesProvider";

export default function LaterScreen() {
  const { collections } = useResources();

  return (
    <ScreenView>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.list}>
          {collections.savedForLater.length === 0 ? (
            <EmptyState
              title="Aucune ressource de côté"
              description="Utilise l’action dédiée sur une ressource pour la reprendre plus tard."
            />
          ) : (
            collections.savedForLater.map((resource) => (
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
