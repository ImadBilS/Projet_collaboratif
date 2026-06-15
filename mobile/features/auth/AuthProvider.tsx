import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import {
  loginRequest,
  meRequest,
  registerRequest,
  updateProfileRequest,
  logoutRequest,
  type BackendUser,
} from "./api";
import {
  createGuestUser,
  isValidSignupPayload,
  trimProfilePayload as sanitizeProfilePayload,
} from "./utils";

type Membership = "citizen" | "guest";

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  email: string;
  membership: Membership;
  bio: string;
  role?: string;
};

type SignupPayload = {
  firstName: string;
  lastName: string;
  birth: string;
  sex: string;
  city: string;
  email: string;
  password: string;
  streetNumber: string;
  streetType: string;
  postalCode: string;
  country: string;
  addressComplement?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  isCitizen: boolean;
  login: (email: string, password: string) => Promise<void>;
  continueAsGuest: () => void;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (
    payload: Partial<Omit<AuthUser, "id" | "membership">>
  ) => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isCitizen: user?.membership === "citizen",
      login: async (email, password) => {
        const response = await loginRequest(email, password);
        const token = response.accessToken ?? response.token ?? null;

        if (!token) {
          throw new Error("Jeton d’accès manquant dans la réponse API.");
        }

        setAccessToken(token);
        setUser(toAuthUser(response.user));
      },
      continueAsGuest: () => {
        setAccessToken(null);
        setUser(createGuestUser());
      },
      signup: async (payload) => {
        if (!isValidSignupPayload(payload)) {
          throw new Error("Complète tous les champs avec un mot de passe valide.");
        }

        const response = await registerRequest({
          firstname: payload.firstName.trim(),
          lastname: payload.lastName.trim(),
          birth: payload.birth.trim(),
          mail: payload.email.trim().toLowerCase(),
          password: payload.password,
          role: "Citoyen",
          sex: payload.sex.trim(),
          street_number: Number.parseInt(payload.streetNumber, 10),
          street_type: payload.streetType.trim(),
          postal_code: Number.parseInt(payload.postalCode, 10),
          address_complement: payload.addressComplement?.trim() || undefined,
          city: payload.city.trim(),
          country: payload.country.trim(),
        });

        const token = response.accessToken ?? response.token ?? null;

        if (!token) {
          throw new Error("Jeton d’accès manquant dans la réponse API.");
        }

        setAccessToken(token);
        setUser(toAuthUser(response.user));
      },
      logout: async () => {
        if (accessToken) {
          try {
            await logoutRequest(accessToken);
          } catch {
            // La session mobile est pilotée par le bearer token; l'échec de logout
            // ne doit pas empêcher la déconnexion locale.
          }
        }

        setAccessToken(null);
        setUser(null);
      },
      updateProfile: async (payload) => {
        if (!user || user.membership !== "citizen" || !accessToken) {
          return;
        }

        const sanitizedPayload = sanitizeProfilePayload(payload);
        const response = await updateProfileRequest(user.id, accessToken, {
          city: sanitizedPayload.city,
          bio: sanitizedPayload.bio,
        });

        setUser(toAuthUser(response.user));
      },
      refreshProfile: async () => {
        if (!accessToken) {
          return;
        }

        const response = await meRequest(accessToken);
        setUser(toAuthUser(response.user));
      },
    }),
    [accessToken, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

function toAuthUser(user: BackendUser): AuthUser {
  return {
    id: String(user.user_id),
    firstName: user.firstname,
    lastName: user.lastname,
    city: user.city ?? "",
    email: user.mail,
    membership: "citizen",
    bio: user.bio ?? "",
    role: user.role,
  };
}
