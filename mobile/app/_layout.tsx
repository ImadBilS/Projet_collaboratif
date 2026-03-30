import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "../features/auth/AuthProvider";
import { ActivitiesProvider } from "../features/activities/ActivitiesProvider";
import { ResourcesProvider } from "../features/resources/ResourcesProvider";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ResourcesProvider>
          <ActivitiesProvider>
            <StatusBar style="dark" />
            <Stack
              screenOptions={{
                headerShadowVisible: false,
                headerStyle: { backgroundColor: "#f6f1e8" },
                headerTintColor: "#183730",
                headerTitleStyle: {
                  fontSize: 18,
                  fontWeight: "700",
                },
                contentStyle: { backgroundColor: "#f6f1e8" },
              }}
            >
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="resources/[id]" options={{ title: "Ressource" }} />
              <Stack.Screen name="resources/create" options={{ title: "Créer une ressource" }} />
              <Stack.Screen name="resources/edit/[id]" options={{ title: "Modifier la ressource" }} />
              <Stack.Screen
                name="resources/[id]/comments"
                options={{ title: "Commentaires" }}
              />
              <Stack.Screen
                name="collections/favorites"
                options={{ title: "Mes favoris" }}
              />
              <Stack.Screen
                name="collections/later"
                options={{ title: "Mises de côté" }}
              />
              <Stack.Screen
                name="collections/completed"
                options={{ title: "Déjà exploitées" }}
              />
              <Stack.Screen name="activities/[id]" options={{ title: "Activité" }} />
              <Stack.Screen
                name="activities/[id]/chat"
                options={{ title: "Messagerie" }}
              />
            </Stack>
          </ActivitiesProvider>
        </ResourcesProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
