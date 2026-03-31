import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { Chip } from "../../components/Chip";
import { EmptyState } from "../../components/EmptyState";
import { ScreenView } from "../../components/ScreenView";
import { useAuth } from "../../features/auth/AuthProvider";
import { useResources } from "../../features/resources/ResourcesProvider";
import { ResourceCategory, ResourceFormat, ResourceRelation } from "../../features/resources/types";

export default function CreateResourceScreen() {
  const { user, isCitizen } = useAuth();
  const { createResource } = useResources();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState<ResourceCategory>("Article");
  const [format, setFormat] = useState<ResourceFormat>("Lecture");
  const [relation, setRelation] = useState<ResourceRelation>("Famille");
  const [access, setAccess] = useState<"public" | "restricted">("public");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isCitizen || !user) {
    return (
      <ScreenView>
        <View style={styles.content}>
          <EmptyState
            title="Connexion requise"
            description="La création de ressource est réservée au citoyen connecté. Le mode invité reste en consultation seule."
          />
        </View>
      </ScreenView>
    );
  }

  return (
    <ScreenView>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Créer une ressource</Text>
          <Text style={styles.heroText}>
            Un formulaire volontairement court pour démontrer la création et la
            publication côté citoyen connecté.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Titre</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} />

          <Text style={styles.label}>Résumé</Text>
          <TextInput
            style={styles.input}
            value={summary}
            onChangeText={setSummary}
          />

          <Text style={styles.label}>Contenu</Text>
          <TextInput
            multiline
            style={styles.textArea}
            value={content}
            onChangeText={setContent}
          />

          <Text style={styles.label}>Tags</Text>
          <TextInput
            style={styles.input}
            value={tags}
            onChangeText={setTags}
            placeholder="famille, dialogue, activité"
            placeholderTextColor="#8a908b"
          />

          <Text style={styles.label}>Catégorie</Text>
          <View style={styles.chips}>
            {(["Article", "Guide", "Fiche pratique", "Activité / Jeu"] as const).map((item) => (
              <Chip
                key={item}
                label={item}
                active={category === item}
                onPress={() => setCategory(item)}
              />
            ))}
          </View>

          <Text style={styles.label}>Format</Text>
          <View style={styles.chips}>
            {(["Lecture", "Audio", "Atelier", "Activité"] as const).map((item) => (
              <Chip
                key={item}
                label={item}
                active={format === item}
                onPress={() => setFormat(item)}
              />
            ))}
          </View>

          <Text style={styles.label}>Type de relation</Text>
          <View style={styles.chips}>
            {(["Famille", "Couple", "Amitié", "Travail", "Voisinage"] as const).map((item) => (
              <Chip
                key={item}
                label={item}
                active={relation === item}
                onPress={() => setRelation(item)}
              />
            ))}
          </View>

          <Text style={styles.label}>Accès</Text>
          <View style={styles.chips}>
            <Chip label="Public" active={access === "public"} onPress={() => setAccess("public")} />
            <Chip
              label="Restreint"
              active={access === "restricted"}
              onPress={() => setAccess("restricted")}
            />
          </View>

          <Pressable
            onPress={async () => {
              try {
                setLoading(true);
                setError(null);
                const id = await createResource({
                  title,
                  summary,
                  content,
                  category,
                  format,
                  relation,
                  access,
                  tags,
                });
                router.replace(`/resources/${id}`);
              } catch (creationError) {
                setError(
                  creationError instanceof Error
                    ? creationError.message
                    : "Création impossible."
                );
              } finally {
                setLoading(false);
              }
            }}
            style={[styles.primaryButton, loading && styles.buttonDisabled]}
          >
            <Text style={styles.primaryButtonLabel}>
              {loading ? "Publication..." : "Publier la ressource"}
            </Text>
          </Pressable>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
    borderRadius: 24,
    padding: 20,
    gap: 10,
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
  formCard: {
    backgroundColor: "#fffdf8",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e5dbc8",
    gap: 12,
  },
  label: {
    color: "#183730",
    fontSize: 14,
    fontWeight: "700",
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
  textArea: {
    minHeight: 130,
    textAlignVertical: "top",
    backgroundColor: "#f6f1e8",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd4c5",
    padding: 14,
    fontSize: 15,
    color: "#18211f",
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  primaryButton: {
    backgroundColor: "#183730",
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 4,
  },
  primaryButtonLabel: {
    color: "#fffdf8",
    fontSize: 15,
    fontWeight: "800",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  errorText: {
    color: "#9b2c2c",
    fontSize: 13,
    lineHeight: 19,
  },
});
