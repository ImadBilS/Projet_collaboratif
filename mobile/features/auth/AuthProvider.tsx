import { createContext, ReactNode, useContext, useMemo, useState } from "react";

type Membership = "citizen" | "guest";

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  email: string;
  membership: Membership;
  bio: string;
};

type SignupPayload = {
  firstName: string;
  lastName: string;
  city: string;
  email: string;
  password: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isCitizen: boolean;
  login: (email: string, password: string) => Promise<void>;
  continueAsGuest: () => void;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => void;
  updateProfile: (payload: Partial<Omit<AuthUser, "id" | "membership">>) => void;
};

type StoredUser = AuthUser & { password: string };

const seededUsers: StoredUser[] = [
  {
    id: "u-1",
    firstName: "Léa",
    lastName: "Martin",
    city: "Lille",
    email: "lea.martin@example.com",
    password: "Password123!",
    membership: "citizen",
    bio: "J’explore des ressources sur la communication familiale et les activités à faire à plusieurs.",
  },
];

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<StoredUser[]>(seededUsers);
  const [user, setUser] = useState<AuthUser | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isCitizen: user?.membership === "citizen",
      login: async (email, password) => {
        await waitForPrototype();
        const existingUser = users.find(
          (candidate) =>
            candidate.email.toLowerCase() === email.toLowerCase() &&
            candidate.password === password
        );

        if (!existingUser) {
          throw new Error("Adresse e-mail ou mot de passe incorrect.");
        }

        setUser(stripPassword(existingUser));
      },
      continueAsGuest: () => {
        setUser({
          id: "guest-session",
          firstName: "Visiteur",
          lastName: "Invité",
          city: "",
          email: "",
          membership: "guest",
          bio: "Navigation en mode invité",
        });
      },
      signup: async (payload) => {
        await waitForPrototype();

        if (
          !payload.firstName.trim() ||
          !payload.lastName.trim() ||
          !payload.city.trim() ||
          !payload.email.trim() ||
          payload.password.length < 8
        ) {
          throw new Error("Complète tous les champs avec un mot de passe valide.");
        }

        const alreadyExists = users.some(
          (candidate) =>
            candidate.email.toLowerCase() === payload.email.trim().toLowerCase()
        );

        if (alreadyExists) {
          throw new Error("Un compte existe déjà avec cette adresse e-mail.");
        }

        const newUser: StoredUser = {
          id: `u-${Date.now()}`,
          firstName: payload.firstName.trim(),
          lastName: payload.lastName.trim(),
          city: payload.city.trim(),
          email: payload.email.trim(),
          password: payload.password,
          membership: "citizen",
          bio: "Nouveau compte citoyen",
        };

        setUsers((currentUsers) => [...currentUsers, newUser]);
        setUser(stripPassword(newUser));
      },
      logout: () => setUser(null),
      updateProfile: (payload) => {
        setUser((currentUser) => {
          if (!currentUser || currentUser.membership !== "citizen") {
            return currentUser;
          }

          const nextUser = {
            ...currentUser,
            ...trimProfilePayload(payload),
          };

          setUsers((currentUsers) =>
            currentUsers.map((candidate) =>
              candidate.id === currentUser.id
                ? { ...candidate, ...trimProfilePayload(payload) }
                : candidate
            )
          );

          return nextUser;
        });
      },
    }),
    [user, users]
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

function stripPassword(user: StoredUser): AuthUser {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    city: user.city,
    email: user.email,
    membership: user.membership,
    bio: user.bio,
  };
}

function trimProfilePayload(
  payload: Partial<Omit<AuthUser, "id" | "membership">>
): Partial<Omit<AuthUser, "id" | "membership">> {
  return {
    firstName: payload.firstName?.trim(),
    lastName: payload.lastName?.trim(),
    city: payload.city?.trim(),
    email: payload.email?.trim(),
  };
}

async function waitForPrototype() {
  await new Promise((resolve) => setTimeout(resolve, 300));
}
