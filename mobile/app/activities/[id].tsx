import { Link, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { EmptyState } from "../../components/EmptyState";
import { ScreenView } from "../../components/ScreenView";
import { useAuth } from "../../features/auth/AuthProvider";
import { useActivities } from "../../features/activities/ActivitiesProvider";

export default function ActivityDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const { isCitizen } = useAuth();
  const { getActivityById, inviteParticipant } = useActivities();
  const activity = getActivityById(params.id ?? "");
  const [participantName, setParticipantName] = useState("");

  if (!activity) {
    return (
      <ScreenView>
        <View style={styles.content}>
          <EmptyState
            title="Activité introuvable"
            description="Cette activité n’est plus disponible dans le prototype."
          />
        </View>
      </ScreenView>
    );
  }

  return (
    <ScreenView>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.heroStatus}>{activity.status}</Text>
          <Text style={styles.heroTitle}>{activity.title}</Text>
          <Text style={styles.heroText}>{activity.description}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Inviter des participants</Text>
          {isCitizen ? (
            <>
              <TextInput
                style={styles.input}
                value={participantName}
                onChangeText={setParticipantName}
                placeholder="Prénom ou nom"
                placeholderTextColor="#8a908b"
              />
              <Pressable
                onPress={() => {
                  inviteParticipant(activity.id, participantName);
                  setParticipantName("");
                }}
                style={styles.primaryButton}
              >
                <Text style={styles.primaryButtonLabel}>Inviter</Text>
              </Pressable>
            </>
          ) : (
            <Text style={styles.noticeText}>
              Mode invité: consultation seule, sans invitation ni participation active.
            </Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Participants</Text>
          <View style={styles.participantList}>
            {activity.participants.map((participant) => (
              <View key={participant.id} style={styles.participantChip}>
                <Text style={styles.participantLabel}>{participant.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <Link href={`/activities/${activity.id}/chat`} asChild>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonLabel}>
              Ouvrir la messagerie ({activity.messages.length})
            </Text>
          </Pressable>
        </Link>
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
    borderRadius: 24,
    padding: 20,
    gap: 10,
  },
  heroStatus: {
    color: "#d7e5de",
    fontSize: 12,
    fontWeight: "700",
  },
  heroTitle: {
    color: "#fffdf8",
    fontSize: 26,
    fontWeight: "800",
  },
  heroText: {
    color: "#d7e5de",
    fontSize: 14,
    lineHeight: 21,
  },
  card: {
    backgroundColor: "#fffdf8",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e5dbc8",
    gap: 12,
  },
  cardTitle: {
    color: "#1b2422",
    fontSize: 17,
    fontWeight: "800",
  },
  input: {
    backgroundColor: "#f6f1e8",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd4c5",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#18211f",
  },
  primaryButton: {
    backgroundColor: "#183730",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonLabel: {
    color: "#fffdf8",
    fontSize: 15,
    fontWeight: "800",
  },
  participantList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  participantChip: {
    backgroundColor: "#f6f1e8",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  participantLabel: {
    color: "#475652",
    fontSize: 13,
    fontWeight: "700",
  },
  noticeText: {
    color: "#6d471f",
    fontSize: 14,
    lineHeight: 21,
  },
  secondaryButton: {
    backgroundColor: "#fff4e2",
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
  },
  secondaryButtonLabel: {
    color: "#6d471f",
    fontSize: 15,
    fontWeight: "800",
  },
});
