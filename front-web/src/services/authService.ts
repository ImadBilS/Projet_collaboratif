// src/services/authService.ts

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  login: async (email: string, password: string) => {
    await delay(500); // Simulation attente

    if (email === "admin@gouv.fr" && password === "admin") {
      const fakeResponse = {
        token: "fake-jwt-token-admin",
        user: {
          id: 1,
          email: email,
          pseudo: "Administrateur",
          role: "ADMIN",
        },
      };
      // On sauvegarde la session
      localStorage.setItem("token", fakeResponse.token);
      return fakeResponse;
    } else {
      throw new Error("Identifiants incorrects.");
    }
  },

  // 👇 AJOUTS NÉCESSAIRES POUR LE LAYOUT
  logout: () => {
    localStorage.removeItem("token");
    // On force le rechargement pour rediriger vers login
    window.location.href = "/login";
  },

  isAuthenticated: () => {
    // Si on a un token, on considère qu'on est connecté
    return !!localStorage.getItem("token");
  },
};
