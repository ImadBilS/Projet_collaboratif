import type { AuthUser } from "./AuthProvider";

type StoredUser = AuthUser & { password: string };

export function createGuestUser(): AuthUser {
  return {
    id: "guest-session",
    firstName: "Visiteur",
    lastName: "Invité",
    city: "",
    email: "",
    membership: "guest",
    bio: "Navigation en mode invité",
  };
}

export function stripPassword(user: StoredUser): AuthUser {
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

export function trimProfilePayload(
  payload: Partial<Omit<AuthUser, "id" | "membership">>
): Partial<Omit<AuthUser, "id" | "membership">> {
  return {
    firstName: payload.firstName?.trim(),
    lastName: payload.lastName?.trim(),
    city: payload.city?.trim(),
    email: payload.email?.trim(),
    bio: payload.bio?.trim(),
  };
}

export function isValidSignupPayload(payload: {
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
}) {
  return Boolean(
    payload.firstName.trim() &&
      payload.lastName.trim() &&
      payload.birth.trim() &&
      payload.sex.trim() &&
      payload.city.trim() &&
      payload.email.trim() &&
      payload.streetNumber.trim() &&
      payload.streetType.trim() &&
      payload.postalCode.trim() &&
      payload.country.trim() &&
      payload.password.length >= 8
  );
}
