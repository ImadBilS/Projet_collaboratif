import { authService } from "./authService";
import { apiRequest } from "./apiClient";

export type ManagedResource = {
  ressource_id: number;
  wording: string;
  content: string | null;
  visibility: "PUBLIC" | "PRIVATE" | "GROUP";
  category: string[];
  user_id: number;
  user?: {
    firstname: string;
    lastname: string;
    city: string;
  };
};

function requireToken() {
  const token = authService.getToken();

  if (!token) {
    throw new Error("Session administrateur absente.");
  }

  return token;
}

export const resourcesService = {
  list: async () => {
    const token = requireToken();
    return apiRequest<ManagedResource[]>("/ressources", { token });
  },

  create: async (payload: {
    wording: string;
    content: string;
    visibility: "PUBLIC" | "PRIVATE";
    category: string[];
  }) => {
    const token = requireToken();
    return apiRequest<ManagedResource>("/ressources", {
      method: "POST",
      token,
      body: payload,
    });
  },

  update: async (
    resourceId: number,
    payload: {
      wording: string;
      content: string;
      visibility: "PUBLIC" | "PRIVATE";
      category: string[];
    }
  ) => {
    const token = requireToken();
    return apiRequest<ManagedResource>(`/ressources/${resourceId}`, {
      method: "PUT",
      token,
      body: payload,
    });
  },

  delete: async (resourceId: number) => {
    const token = requireToken();
    return apiRequest<{ message: string }>(`/ressources/${resourceId}`, {
      method: "DELETE",
      token,
    });
  },
};
