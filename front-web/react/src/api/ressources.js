import api from "./axios";

// CREATE
export function createRessource(data) {
  return api.post("/ressources", data);
}

// GET ALL (auth required)
export function getRessources() {
  return api.get("/ressources");
}

// GET PUBLIC (no auth)
export function getPublicRessources() {
  return api.get("/ressources/public");
}

// GET MY RESSOURCES
export function getMyRessources() {
  return api.get("/ressources/me");
}

// GET BY ID
export function getRessourceById(id) {
  return api.get(`/ressources/${id}`);
}

// GET NEARBY FOR ME
export function getNearbyRessourcesForMe() {
  return api.get("/ressources/nearby/me");
}

// DELETE
export function deleteRessource(id) {
  return api.delete(`/ressources/${id}`);
}

// UPDATE
export function updateRessource(id, data) {
  return api.put(`/ressources/${id}`, data);
}

// GET BY CATEGORY
export function getRessourcesByCategory(category) {
  return api.get(`/ressources/category/${category}`);
}
