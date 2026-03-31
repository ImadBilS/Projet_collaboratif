import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { EmptyState } from "../../../components/EmptyState";
import { ScreenView } from "../../../components/ScreenView";
import { useAuth } from "../../../features/auth/AuthProvider";
import { useResources } from "../../../features/resources/ResourcesProvider";

export default function ResourceCommentsScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const { isCitizen } = useAuth();
  const { getResourceById, addComment, replyToComment, refreshComments } = useResources();
  const resource = getResourceById(params.id ?? "");
  const [commentMessage, setCommentMessage] = useState("");
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) {
      return;
    }

    void refreshComments(params.id);
  }, [params.id]);

  if (!resource) {
    return (
      <ScreenView>
        <View style={styles.content}>
          <EmptyState
            title="Commentaires indisponibles"
            description="La ressource associée n’a pas été trouvée."
          />
        </View>
      </ScreenView>
    );
  }

  if (resource.access !== "public") {
    return (
      <ScreenView>
        <View style={styles.content}>
          <EmptyState
            title="Commentaires non disponibles"
            description="Dans ce prototype, seuls les contenus publics ouvrent un espace de commentaires."
          />
        </View>
      </ScreenView>
    );
  }

  return (
    <ScreenView>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Commentaires publics</Text>
          <Text style={styles.headerText}>
            Un espace simple pour commenter une ressource publique et répondre à
            d’autres contributions.
          </Text>
        </View>

        {isCitizen ? (
          <View style={styles.editor}>
            <TextInput
              multiline
              onChangeText={setCommentMessage}
              placeholder="Écrire un commentaire"
              placeholderTextColor="#8b908b"
              style={styles.textArea}
              value={commentMessage}
            />
            <Pressable
              onPress={async () => {
                try {
                  setError(null);
                  await addComment(resource.id, commentMessage);
                  setCommentMessage("");
                } catch (commentError) {
                  setError(
                    commentError instanceof Error
                      ? commentError.message
                      : "Publication impossible."
                  );
                }
              }}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonLabel}>Publier</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.readOnlyNotice}>
            <Text style={styles.readOnlyTitle}>Lecture seule</Text>
            <Text style={styles.readOnlyText}>
              Les échanges sont chargés depuis l’API. La publication et la réponse restent réservées aux comptes connectés.
            </Text>
          </View>
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.commentList}>
          {resource.comments.length === 0 ? (
            <EmptyState
              title="Aucun commentaire"
              description="Ajoute le premier retour pour lancer l’échange autour de cette ressource."
            />
          ) : (
            resource.comments.map((comment) => (
              <View key={comment.id} style={styles.commentCard}>
                <Text style={styles.commentAuthor}>
                  {comment.author} · {comment.createdAt}
                </Text>
                <Text style={styles.commentText}>{comment.message}</Text>

                <View style={styles.replyList}>
                  {comment.replies.map((reply) => (
                    <View key={reply.id} style={styles.replyCard}>
                      <Text style={styles.replyAuthor}>
                        {reply.author} · {reply.createdAt}
                      </Text>
                      <Text style={styles.replyText}>{reply.message}</Text>
                    </View>
                  ))}
                </View>

                {isCitizen ? (
                  <>
                    <TextInput
                      onChangeText={(value) =>
                        setReplyDrafts((current) => ({ ...current, [comment.id]: value }))
                      }
                      placeholder="Répondre à ce commentaire"
                      placeholderTextColor="#8b908b"
                      style={styles.replyInput}
                      value={replyDrafts[comment.id] ?? ""}
                    />
                    <Pressable
                      onPress={async () => {
                        try {
                          setError(null);
                          await replyToComment(
                            resource.id,
                            comment.id,
                            replyDrafts[comment.id] ?? ""
                          );
                          setReplyDrafts((current) => ({
                            ...current,
                            [comment.id]: "",
                          }));
                        } catch (replyError) {
                          setError(
                            replyError instanceof Error
                              ? replyError.message
                              : "Réponse impossible."
                          );
                        }
                      }}
                      style={styles.secondaryButton}
                    >
                      <Text style={styles.secondaryButtonLabel}>Répondre</Text>
                    </Pressable>
                  </>
                ) : null}
              </View>
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
    gap: 16,
  },
  header: {
    backgroundColor: "#183730",
    borderRadius: 24,
    padding: 20,
    gap: 10,
  },
  headerTitle: {
    color: "#fffdf8",
    fontSize: 25,
    fontWeight: "800",
  },
  headerText: {
    color: "#d7e5de",
    fontSize: 14,
    lineHeight: 21,
  },
  editor: {
    backgroundColor: "#fffdf8",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e5dbc8",
    gap: 12,
  },
  readOnlyNotice: {
    backgroundColor: "#fff4e2",
    borderRadius: 22,
    padding: 18,
    gap: 8,
  },
  readOnlyTitle: {
    color: "#6d471f",
    fontSize: 17,
    fontWeight: "800",
  },
  readOnlyText: {
    color: "#6d471f",
    fontSize: 14,
    lineHeight: 21,
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: "top",
    backgroundColor: "#f6f1e8",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd4c5",
    padding: 14,
    color: "#18211f",
    fontSize: 15,
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
  commentList: {
    gap: 14,
  },
  commentCard: {
    backgroundColor: "#fffdf8",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e5dbc8",
    gap: 12,
  },
  commentAuthor: {
    color: "#596660",
    fontSize: 12,
    fontWeight: "700",
  },
  commentText: {
    color: "#44534f",
    fontSize: 14,
    lineHeight: 21,
  },
  replyList: {
    gap: 10,
  },
  replyCard: {
    backgroundColor: "#f6f1e8",
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  replyAuthor: {
    color: "#65716c",
    fontSize: 12,
    fontWeight: "700",
  },
  replyText: {
    color: "#44534f",
    fontSize: 13,
    lineHeight: 19,
  },
  replyInput: {
    backgroundColor: "#f6f1e8",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd4c5",
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#18211f",
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: "#fff4e2",
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButtonLabel: {
    color: "#6d471f",
    fontSize: 14,
    fontWeight: "800",
  },
  errorText: {
    color: "#9b2c2c",
    fontSize: 13,
    lineHeight: 19,
  },
});
