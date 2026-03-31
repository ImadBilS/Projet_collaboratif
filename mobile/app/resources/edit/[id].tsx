import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { Chip } from "../../../components/Chip";
import { EmptyState } from "../../../components/EmptyState";
import { ScreenView } from "../../../components/ScreenView";
import { useAuth } from "../../../features/auth/AuthProvider";
import { useResources } from "../../../features/resources/ResourcesProvider";
import { ResourceCategory, ResourceFormat, ResourceRelation } from "../../../features/resources/types";

export default function EditResourceScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const { user, isCitizen } = useAuth();
  const { getResourceById, updateResource } = useResources();
  const resource = getResourceById(params.id ?? "");

  const [title, setTitle] = useState(resource?.title ?? "");
  const [summary, setSummary] = useState(resource?.summary ?? "");
  const [content, setContent] = useState(resource?.content.join("\n\n") ?? "");
  const [tags, setTags] = useState(resource?.tags.join(", ") ?? "");
  const [category, setCategory] = useState<ResourceCategory>(resource?.category ?? "Article");
  const [format, setFormat] = useState<ResourceFormat>(resource?.format ?? "Lecture");
  const [relation, setRelation] = useState<ResourceRelation>(resource?.relation ?? "Famille");
  const [access, setAccess] = useState<"public" | "restricted">(resource?.access ?? "public");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!resource) {
    return (
      <ScreenView>
        <View style={styles.content}>
          <EmptyState
            title="Modification impossible"
            description="Cette ressource n’existe plus dans le prototype."
          />
        </View>
      </ScreenView>
    );
  }

  if (!isCitizen || !user || resource.ownerId !== user.id) {
    return (
      <ScreenView>
        <View style={styles.content}>
          <EmptyState
            title="Modification non autorisée"
            description="Seul le citoyen ayant créé cette ressource peut la modifier. Le mode invité ne peut pas éditer."
          />
        </View>
      </ScreenView>
    );
  }

  return (
    <ScreenView>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.formCard}>
          <Text style={styles.label}>Titre</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} />

          <Text style={styles.label}>Résumé</Text>
          <TextInput style={styles.input} value={summary} onChangeText={setSummary} />

          <Text style={styles.label}>Contenu</Text>
          <TextInput multiline style={styles.textArea} value={content} onChangeText={setContent} />

          <Text style={styles.label}>Tags</Text>
          <TextInput style={styles.input} value={tags} onChangeText={setTags} />

          <Text style={styles.label}>Catégorie</Text>
          <View style={styles.chips}>
            {(["Article", "Guide", "Fiche pratique", "Activité / Jeu"] as const).map((item) => (
              <Chip key={item} label={item} active={category === item} onPress={() => setCategory(item)} />
            ))}
          </View>

          <Text style={styles.label}>Format</Text>
          <View style={styles.chips}>
            {(["Lecture", "Audio", "Atelier", "Activité"] as const).map((item) => (
              <Chip key={item} label={item} active={format === item} onPress={() => setFormat(item)} />
            ))}
          </View>

          <Text style={styles.label}>Type de relation</Text>
          <View style={styles.chips}>
            {(["Famille", "Couple", "Amitié", "Travail", "Voisinage"] as const).map((item) => (
              <Chip key={item} label={item} active={relation === item} onPress={() => setRelation(item)} />
            ))}
          </View>

          <Text style={styles.label}>Accès</Text>
          <View style={styles.chips}>
            <Chip label="Public" active={access === "public"} onPress={() => setAccess("public")} />
            <Chip label="Restreint" active={access === "restricted"} onPress={() => setAccess("restricted")} />
          </View>

          <Pressable
            onPress={async () => {
              try {
                setLoading(true);
                setError(null);
                await updateResource(resource.id, {
                  title,
                  summary,
                  content,
                  category,
                  format,
                  relation,
                  access,
                  tags,
                });
                router.replace(`/resources/${resource.id}`);
              } catch (updateError) {
                setError(
                  updateError instanceof Error
                    ? updateError.message
                    : "Mise à jour impossible."
                );
              } finally {
                setLoading(false);
              }
            }}
            style={[styles.primaryButton, loading && styles.buttonDisabled]}
          >
            <Text style={styles.primaryButtonLabel}>
              {loading ? "Enregistrement..." : "Enregistrer"}
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
