import api from "./axios";

// Inscription
export function register(data) {
  return api.post("/api/auth/admin-register", data);
}

// Connexion
export function loginApi(mail, password) {
  return api.post("/api/auth/login", { mail, password });
}

// Récupérer le profil de l'utilisateur connecté
export function getMe() {
  return api.get("/api/auth/me");
}

// Rafraîchir le token d'accès
export function refreshToken() {
  return api.post("/api/auth/refresh");
}

// Déconnexion
export function logout() {
  return api.post("/api/auth/logout");
}
