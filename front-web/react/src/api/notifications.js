import api from "./axios";

// Récupérer les notifications de l'utilisateur connecté
export function getNotifications() {
  return api.get("/notifications");
}

// Marquer une notification comme lue
export function markNotificationRead(notificationId) {
  return api.patch(`/notifications/${notificationId}/read`);
}
