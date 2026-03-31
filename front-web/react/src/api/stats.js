import api from "./axios";

export function getStats() {
  return api.get("/stats");
}