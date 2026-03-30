import { Link, router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { EmptyState } from "../../components/EmptyState";
import { ScreenView } from "../../components/ScreenView";
import { SectionTitle } from "../../components/SectionTitle";
import { useAuth } from "../../features/auth/AuthProvider";
import { useActivities } from "../../features/activities/ActivitiesProvider";

export default function ActivitiesTabScreen() {
  const { isCitizen } = useAuth();
  const { activities, startActivity } = useActivities();

  return (
    <ScreenView>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Activités sociales</Text>
          <Text style={styles.heroText}>
            Des activités et jeux relationnels avec participants et messagerie
            simple pour animer l’échange.
          </Text>
        </View>

        <Pressable
          onPress={() => {
            if (!isCitizen) {
              return;
            }

            const nextId = startActivity();

            if (nextId) {
              router.push(`/activities/${nextId}`);
            }
          }}
          style={[styles.primaryAction, !isCitizen && styles.primaryActionDisabled]}
        >
          <Text style={styles.primaryActionLabel}>
            {isCitizen ? "Démarrer une nouvelle activité" : "Réservé au compte citoyen"}
          </Text>
        </Pressable>

        <View style={styles.section}>
          <SectionTitle title="En cours" subtitle="Accès direct aux sessions actives." />
          {activities.length === 0 ? (
            <EmptyState
              title="Aucune activité"
              description="Lance une activité pour voir apparaître participants, état et messagerie."
            />
          ) : (
            activities.map((activity) => (
              <Link key={activity.id} href={`/activities/${activity.id}`} asChild>
                <Pressable style={styles.activityCard}>
                  <View style={styles.activityHeader}>
                    <Text style={styles.activityStatus}>{activity.status}</Text>
                    <Text style={styles.activityMeta}>
                      {activity.participants.length} participant(s)
                    </Text>
                  </View>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityText}>{activity.description}</Text>
                </Pressable>
              </Link>
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
  primaryAction: {
    backgroundColor: "#183730",
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
  },
  primaryActionDisabled: {
    opacity: 0.45,
  },
  primaryActionLabel: {
    color: "#fffdf8",
    fontSize: 15,
    fontWeight: "800",
  },
  section: {
    gap: 12,
  },
  activityCard: {
    backgroundColor: "#fffdf8",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e5dbc8",
    gap: 8,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  activityStatus: {
    color: "#1a5b47",
    fontSize: 12,
    fontWeight: "700",
    backgroundColor: "#dff1e8",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: "hidden",
  },
  activityMeta: {
    color: "#596660",
    fontSize: 12,
    fontWeight: "600",
  },
  activityTitle: {
    color: "#1b2422",
    fontSize: 18,
    fontWeight: "800",
  },
  activityText: {
    color: "#55655f",
    fontSize: 14,
    lineHeight: 21,
  },
});
