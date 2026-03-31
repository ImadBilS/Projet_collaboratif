import api from "./axios";

export function addComment(resourceId, text) {
  return api.post(`/comments/${resourceId}`, { text });
}
export function getCommentsByResource(resourceId) {
  return api.get(`/comments/${resourceId}/ressource`);
}

export function getCommentById(commentId) {
  return api.get(`/comments/${commentId}`);
}

export function deleteComment(commentId) {
  return api.delete(`/comments/${commentId}`);
}
export function updateComment(commentId, text) {
  return api.put(`/comments/${commentId}`, { text });
}

export function hideComment(commentId) {
  return api.patch(`/comments/${commentId}/hide`);
}
