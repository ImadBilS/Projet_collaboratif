// src/services/authService.ts

// On simule une petite attente réseau (500ms) pour voir le loader
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  login: async (email: string, password: string) => {
    await delay(800);

    // Simulation : Seul l'admin a le droit de passer
    if (email === "admin@gouv.fr" && password === "admin") {
      return {
        token: "fake-jwt-token-admin",
        user: {
          id: 1,
          email: email,
          pseudo: "Administrateur",
          role: "ADMIN",
        },
      };
    } else {
      throw new Error("Identifiants incorrects. Veuillez vérifier vos accès.");
    }
  },
};
