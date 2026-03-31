import { authService } from "./authService";
import { apiRequest } from "./apiClient";

export type ManagedUser = {
  user_id: number;
  firstname: string;
  lastname: string;
  mail: string;
  role: string;
  city: string;
  country: string;
  bio: string | null;
  is_anonymized: boolean;
  deleted_at: string | null;
};

function requireToken() {
  const token = authService.getToken();

  if (!token) {
    throw new Error("Session administrateur absente.");
  }

  return token;
}

export const usersService = {
  list: async () => {
    const token = requireToken();
    return apiRequest<{ users: ManagedUser[] }>("/api/users", { token });
  },

  getById: async (userId: number) => {
    const token = requireToken();
    return apiRequest<{ user: ManagedUser }>(`/api/users/${userId}`, { token });
  },

  updateRole: async (userId: number, role: string) => {
    const token = requireToken();
    return apiRequest<{ user: ManagedUser }>(`/api/users/${userId}/role`, {
      method: "PUT",
      token,
      body: { role },
    });
  },

  updateProfile: async (
    userId: number,
    payload: { city?: string; bio?: string; avatar?: string }
  ) => {
    const token = requireToken();
    return apiRequest<{ user: ManagedUser }>(`/api/users/${userId}`, {
      method: "PUT",
      token,
      body: payload,
    });
  },

  delete: async (userId: number) => {
    const token = requireToken();
    return apiRequest<{ user: ManagedUser }>(`/api/users/${userId}`, {
      method: "DELETE",
      token,
    });
  },
};
