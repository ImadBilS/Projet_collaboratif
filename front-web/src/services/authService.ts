// L'adresse du Back-End (
const API_URL = "http://localhost:3000";

export const authService = {
  register: async (payload: {
    firstname: string;
    lastname: string;
    birth: string;
    mail: string;
    password: string;
    role: string;
    sex: string;
    street_number: number;
    street_type: string;
    postal_code: number;
    address_complement: string | null;
    city: string;
    country: string;
  }) => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur lors de l'inscription");
    }

    return response.json();
  },

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
