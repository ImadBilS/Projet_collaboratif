import api from "./axios";

// GET ALL USERS (ADMIN ONLY)
export function getAllUsers() {
  return api.get("/api/users");
}

// CREATE USER PROFILE
export function createUserProfile(data) {
  return api.post("/api/users", data);
}

// GET USER BY ID
export function getUserById(userId) {
  return api.get(`/api/users/${userId}`);
}

// UPDATE USER PROFILE
export function updateUserProfile(userId, data) {
  return api.put(`/api/users/${userId}`, data);
}

// DELETE / ANONYMIZE USER
export function deleteUserProfile(userId) {
  return api.delete(`/api/users/${userId}`);
}

// UPDATE USER ROLE (ADMIN ONLY)
export function updateUserRole(userId, role) {
  return api.put(`/api/users/${userId}/role`, { role });
}
