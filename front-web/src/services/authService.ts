// L'adresse du Back-End (Demande à Matthieu si c'est bien le port 3000)
const API_URL = "http://localhost:3000";

export const authService = {
  login: async (mail: string, password: string) => {
    try {
      // 1. On envoie la requête POST au vrai back-end
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ mail, password }),
      });

      // 2. Si le Back renvoie une erreur (401, 403, 500...)
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur de connexion");
      }

      // 3. Si c'est bon, on récupère le Token
      const data = await response.json();

      // On vérifie que c'est bien un ADMIN (Sécurité Front)
      // Adapte 'role' selon ce que Matthieu renvoie (ex: "ADMIN" ou "admin")
      if (
        data.user.role !== "Administrateur" &&
        data.user.role !== "Modérateur"
      ) {
        throw new Error("Accès refusé. Vous n'êtes pas administrateur.");
      }

      // 4. On sauvegarde dans le navigateur
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      return data;
    } catch (error: any) {
      console.error("Erreur Login:", error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};
