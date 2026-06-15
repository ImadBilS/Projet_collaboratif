import {
  clearSession,
  getStoredToken,
  getStoredUser,
  hasStoredSession,
  isAllowedAdminRole,
  persistSession,
} from "./authUtils";
import { apiRequest } from "./apiClient";

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
    return apiRequest("/api/auth/register", {
      method: "POST",
      body: payload,
    });
  },

  login: async (mail: string, password: string) => {
    try {
      const data = await apiRequest<{
        token: string;
        user: {
          role: string;
          [key: string]: unknown;
        };
      }>("/api/auth/login", {
        method: "POST",
        body: { mail, password },
      });

      // On vérifie que c'est bien un ADMIN (Sécurité Front)
      // Adapte 'role' selon ce que Matthieu renvoie (ex: "ADMIN" ou "admin")
      if (!isAllowedAdminRole(data.user.role)) {
        throw new Error("Accès refusé. Vous n'êtes pas administrateur.");
      }

      persistSession(data.token, data.user, localStorage);

      return data;
    } catch (error) {
      console.error("Erreur Login:", error);
      throw error;
    }
  },

  logout: () => {
    clearSession(localStorage);
    window.location.href = "/login";
  },

  isAuthenticated: () => {
    return hasStoredSession(localStorage);
  },

  getToken: () => getStoredToken(localStorage),

  getCurrentUser: () => getStoredUser(localStorage),
};
