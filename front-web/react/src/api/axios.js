import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/",
});

// Ajouter automatiquement le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur de réponse : renvoie directement response.data
api.interceptors.response.use(
  (response) => response.data,

  (error) => {
    // Si le token est expiré ou invalide
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");

      // Redirection propre
      if (!globalThis.location.pathname.includes("/login")) {
        globalThis.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
