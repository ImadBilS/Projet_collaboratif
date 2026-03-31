import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { AuthScaffold } from "../../components/auth/AuthScaffold";
import { authScaffoldStyles as styles } from "../../components/auth/styles";
import { useAuth } from "../../features/auth/AuthProvider";

export default function SignupScreen() {
  const { signup } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birth, setBirth] = useState("");
  const [sex, setSex] = useState("");
  const [city, setCity] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [streetType, setStreetType] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("France");
  const [addressComplement, setAddressComplement] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    try {
      setLoading(true);
      setError(null);
      await signup({
        firstName,
        lastName,
        birth,
        sex,
        city,
        streetNumber,
        streetType,
        postalCode,
        country,
        addressComplement,
        email,
        password,
      });
      router.replace("/(tabs)/profile");
    } catch (signupError) {
      setError(
        signupError instanceof Error
          ? signupError.message
          : "Inscription impossible."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScaffold
      title="Créer un compte"
      subtitle="Un parcours court pour accéder à tes favoris et aux contenus restreints."
      footerLabel="Déjà inscrit ?"
      footerHref="/(auth)/login"
      footerAction="Se connecter"
    >
      <View style={styles.row}>
        <View style={[styles.fieldGroup, styles.flex]}>
          <Text style={styles.label}>Prénom</Text>
          <TextInput
            onChangeText={setFirstName}
            placeholder="Léa"
            placeholderTextColor="#8b918c"
            style={styles.input}
            value={firstName}
          />
        </View>
        <View style={[styles.fieldGroup, styles.flex]}>
          <Text style={styles.label}>Nom</Text>
          <TextInput
            onChangeText={setLastName}
            placeholder="Martin"
            placeholderTextColor="#8b918c"
            style={styles.input}
            value={lastName}
          />
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Date de naissance</Text>
        <TextInput
          onChangeText={setBirth}
          placeholder="2000-05-24"
          placeholderTextColor="#8b918c"
          style={styles.input}
          value={birth}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Sexe</Text>
        <TextInput
          onChangeText={setSex}
          placeholder="Femme, Homme, Autre..."
          placeholderTextColor="#8b918c"
          style={styles.input}
          value={sex}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Ville</Text>
        <TextInput
          onChangeText={setCity}
          placeholder="Lille"
          placeholderTextColor="#8b918c"
          style={styles.input}
          value={city}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Numéro de rue</Text>
        <TextInput
          keyboardType="number-pad"
          onChangeText={setStreetNumber}
          placeholder="12"
          placeholderTextColor="#8b918c"
          style={styles.input}
          value={streetNumber}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Type de voie</Text>
        <TextInput
          onChangeText={setStreetType}
          placeholder="rue, avenue, place..."
          placeholderTextColor="#8b918c"
          style={styles.input}
          value={streetType}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Code postal</Text>
        <TextInput
          keyboardType="number-pad"
          onChangeText={setPostalCode}
          placeholder="59000"
          placeholderTextColor="#8b918c"
          style={styles.input}
          value={postalCode}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Complément d’adresse</Text>
        <TextInput
          onChangeText={setAddressComplement}
          placeholder="Bâtiment, étage..."
          placeholderTextColor="#8b918c"
          style={styles.input}
          value={addressComplement}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Pays</Text>
        <TextInput
          onChangeText={setCountry}
          placeholder="France"
          placeholderTextColor="#8b918c"
          style={styles.input}
          value={country}
        />
      </View>

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
          placeholder="8 caractères minimum"
          placeholderTextColor="#8b918c"
          secureTextEntry
          style={styles.input}
          value={password}
        />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Pressable
        accessibilityRole="button"
        onPress={handleSignup}
        style={[styles.primaryButton, loading && styles.buttonDisabled]}
      >
        <Text style={styles.primaryButtonLabel}>
          {loading ? "Création..." : "Créer mon compte"}
        </Text>
      </Pressable>
    </AuthScaffold>
  );
}
