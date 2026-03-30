import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { AuthScaffold } from "../../components/auth/AuthScaffold";
import { authScaffoldStyles as styles } from "../../components/auth/styles";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <AuthScaffold
      title="Réinitialiser"
      subtitle="Prototype mobile: saisie de l’e-mail et confirmation locale."
      footerLabel="Finalement, tu te souviens ?"
      footerHref="/(auth)/login"
      footerAction="Retour connexion"
    >
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Adresse e-mail</Text>
        <TextInput
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="vous@example.com"
          placeholderTextColor="#8b918c"
          style={styles.input}
          value={email}
        />
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => setSubmitted(true)}
        style={styles.primaryButton}
      >
        <Text style={styles.primaryButtonLabel}>Envoyer un lien</Text>
      </Pressable>

      {submitted ? (
        <Text style={styles.successText}>
          Si un compte existe pour {email || "cette adresse"}, un lien de
          réinitialisation sera envoyé.
        </Text>
      ) : null}
    </AuthScaffold>
  );
}
