import { apiRequest } from "../../lib/api";

export type BackendUser = {
  user_id: number;
  firstname: string;
  lastname: string;
  mail: string;
  role: string;
  city: string;
  bio: string | null;
  avatar?: string | null;
  sex?: string;
  birth?: string;
  postal_code?: number;
  country?: string;
};

type AuthResponse = {
  token?: string;
  accessToken?: string;
  user: BackendUser;
};

export type RegisterPayload = {
  firstname: string;
  lastname: string;
  birth: string;
  mail: string;
  password: string;
  role: "Citoyen";
  sex: string;
  street_number: number;
  street_type: string;
  postal_code: number;
  address_complement?: string;
  city: string;
  country: string;
};

export async function loginRequest(mail: string, password: string) {
  return apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: { mail, password },
  });
}

export async function registerRequest(payload: RegisterPayload) {
  return apiRequest<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: payload,
  });
}

export async function meRequest(token: string) {
  return apiRequest<{ user: BackendUser }>("/api/auth/me", { token });
}

export async function logoutRequest(token: string) {
  return apiRequest<{ message: string }>("/api/auth/logout", {
    method: "POST",
    token,
  });
}

export async function updateProfileRequest(
  userId: string,
  token: string,
  payload: { city?: string; bio?: string }
) {
  return apiRequest<{ user: BackendUser }>(`/api/users/${userId}`, {
    method: "PUT",
    token,
    body: payload,
  });
}
