import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { EmptyState } from "../../../components/EmptyState";
import { ScreenView } from "../../../components/ScreenView";
import { useAuth } from "../../../features/auth/AuthProvider";
import { useActivities } from "../../../features/activities/ActivitiesProvider";

export default function ActivityChatScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const { isCitizen } = useAuth();
  const { getActivityById, sendMessage } = useActivities();
  const activity = getActivityById(params.id ?? "");
  const [message, setMessage] = useState("");

  if (!activity) {
    return (
      <ScreenView>
        <View style={styles.content}>
          <EmptyState
            title="Messagerie indisponible"
            description="L’activité associée est introuvable."
          />
        </View>
      </ScreenView>
    );
  }

  return (
    <ScreenView>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.messages}>
          {activity.messages.length === 0 ? (
            <EmptyState
              title="Aucun message"
              description="Envoie le premier message pour lancer l’échange autour de l’activité."
            />
          ) : (
            activity.messages.map((item) => (
              <View key={item.id} style={styles.messageCard}>
                <Text style={styles.messageAuthor}>
                  {item.author} · {item.createdAt}
                </Text>
                <Text style={styles.messageText}>{item.message}</Text>
              </View>
            ))
          )}
        </ScrollView>

        {isCitizen ? (
          <View style={styles.composer}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Écrire un message"
              placeholderTextColor="#8a908b"
            />
            <Pressable
              onPress={() => {
                sendMessage(activity.id, message);
                setMessage("");
              }}
              style={styles.sendButton}
            >
              <Text style={styles.sendButtonLabel}>Envoyer</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.noticeCard}>
            <Text style={styles.noticeText}>
              Mode invité: lecture seule de la messagerie.
            </Text>
          </View>
        )}
      </View>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
  },
  content: {
    padding: 20,
  },
  messages: {
    gap: 12,
    paddingBottom: 12,
  },
  messageCard: {
    backgroundColor: "#fffdf8",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5dbc8",
    gap: 6,
  },
  messageAuthor: {
    color: "#64706b",
    fontSize: 12,
    fontWeight: "700",
  },
  messageText: {
    color: "#44534f",
    fontSize: 14,
    lineHeight: 20,
  },
  composer: {
    gap: 10,
  },
  noticeCard: {
    backgroundColor: "#fff4e2",
    borderRadius: 18,
    padding: 14,
  },
  noticeText: {
    color: "#6d471f",
    fontSize: 14,
    lineHeight: 20,
  },
  input: {
    backgroundColor: "#fffdf8",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd4c5",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#18211f",
  },
  sendButton: {
    backgroundColor: "#183730",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },
  sendButtonLabel: {
    color: "#fffdf8",
    fontSize: 15,
    fontWeight: "800",
  },
});
