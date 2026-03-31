export type AdminUser = {
  role: string;
  [key: string]: unknown;
};

export function isAllowedAdminRole(role: string) {
  return role === "Administrateur" || role === "Modérateur";
}

export function persistSession(token: string, user: AdminUser, storage: Storage) {
  storage.setItem("token", token);
  storage.setItem("user", JSON.stringify(user));
}

export function clearSession(storage: Storage) {
  storage.removeItem("token");
  storage.removeItem("user");
}

export function hasStoredSession(storage: Storage) {
  return Boolean(storage.getItem("token"));
}

export function getStoredToken(storage: Storage) {
  return storage.getItem("token");
}

export function getStoredUser(storage: Storage) {
  const raw = storage.getItem("user");

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}
