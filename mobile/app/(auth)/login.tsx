import { Link, router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { AuthScaffold } from "../../components/auth/AuthScaffold";
import { authScaffoldStyles as styles } from "../../components/auth/styles";
import { useAuth } from "../../features/auth/AuthProvider";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("lea.martin@example.com");
  const [password, setPassword] = useState("Password123!");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await login(email.trim(), password);
      router.replace("/(tabs)/profile");
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Connexion impossible."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScaffold
      title="Se connecter"
      subtitle="Retrouve tes ressources enregistrées et les contenus réservés."
      footerLabel="Pas encore de compte ?"
      footerHref="/(auth)/signup"
      footerAction="Créer un compte"
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

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Mot de passe</Text>
        <TextInput
          autoCapitalize="none"
          onChangeText={setPassword}
          placeholder="Votre mot de passe"
          placeholderTextColor="#8b918c"
          secureTextEntry
          style={styles.input}
          value={password}
        />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Pressable
        accessibilityRole="button"
        onPress={handleLogin}
        style={[styles.primaryButton, loading && styles.buttonDisabled]}
      >
        <Text style={styles.primaryButtonLabel}>
          {loading ? "Connexion..." : "Se connecter"}
        </Text>
      </Pressable>

      <Link href="/(auth)/forgot-password" style={styles.inlineLink}>
        Mot de passe oublié ?
      </Link>
    </AuthScaffold>
  );
}
