import { ScrollView, StyleSheet, View } from "react-native";

import { EmptyState } from "../../components/EmptyState";
import { ResourceCard } from "../../components/ResourceCard";
import { ScreenView } from "../../components/ScreenView";
import { useResources } from "../../features/resources/ResourcesProvider";

export default function CompletedScreen() {
  const { collections } = useResources();

  return (
    <ScreenView>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.list}>
          {collections.completed.length === 0 ? (
            <EmptyState
              title="Aucune ressource exploitée"
              description="Marque une ressource comme exploitée pour nourrir ton suivi."
            />
          ) : (
            collections.completed.map((resource) => (
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
