import { apiRequest } from "../../lib/api";

export type BackendReply = {
  replie_id: number;
  text: string;
  created_at: string;
  user?: {
    firstname: string;
    lastname: string;
  } | null;
};

export type BackendComment = {
  comment_id: number;
  text: string;
  created_at: string;
  user?: {
    firstname: string;
    lastname: string;
  } | null;
  replies?: BackendReply[];
};

export type BackendResource = {
  ressource_id: number;
  wording: string;
  content?: string | null;
  summary?: string | null;
  visibility: "PUBLIC" | "PRIVATE" | "GROUP";
  user_id: number;
  category: string[] | string;
  format?: string | null;
  relation?: string | null;
  tags?: string[];
  featured?: boolean;
  _count?: {
    reactions?: number;
    comments?: number;
  };
  user?: {
    firstname: string;
    lastname: string;
    city: string;
  };
};

export type BackendCollection = {
  user_id: number;
  ressource_id: number;
  is_favorite: boolean;
  is_saved_for_later: boolean;
  is_completed: boolean;
  updated_at: string;
  resource: BackendResource;
};

export async function fetchPublicResourcesRequest() {
  return apiRequest<BackendResource[]>("/ressources/public");
}

export async function fetchAuthenticatedResourcesRequest(token: string) {
  return apiRequest<BackendResource[]>("/ressources", { token });
}

export async function fetchMyResourcesRequest(token: string) {
  return apiRequest<BackendResource[]>("/ressources/me", { token });
}

export async function createResourceRequest(
  token: string,
  payload: {
    wording: string;
    content: string;
    summary: string;
    visibility: "PUBLIC" | "PRIVATE";
    category: string[];
    format: string;
    relation: string;
    tags: string[];
    featured: boolean;
  }
) {
  return apiRequest<BackendResource>("/ressources", {
    method: "POST",
    token,
    body: payload,
  });
}

export async function updateResourceRequest(
  token: string,
  resourceId: string,
  payload: {
    wording: string;
    content: string;
    summary: string;
    visibility: "PUBLIC" | "PRIVATE";
    category: string[];
    format: string;
    relation: string;
    tags: string[];
    featured: boolean;
  }
) {
  return apiRequest<BackendResource>(`/ressources/${resourceId}`, {
    method: "PUT",
    token,
    body: payload,
  });
}

export async function fetchCommentsRequest(resourceId: string, token?: string | null) {
  const path = token
    ? `/comments/${resourceId}/ressource`
    : `/comments/public/${resourceId}/ressource`;

  return apiRequest<BackendComment[]>(path, { token });
}

export async function addCommentRequest(
  token: string,
  resourceId: string,
  text: string
) {
  return apiRequest<BackendComment>(`/comments/${resourceId}`, {
    method: "POST",
    token,
    body: { text },
  });
}

export async function addReplyRequest(token: string, commentId: string, text: string) {
  return apiRequest<BackendReply>(`/replies/${commentId}/reply`, {
    method: "POST",
    token,
    body: { text },
  });
}

export async function fetchCollectionsRequest(token: string) {
  return apiRequest<{ collections: BackendCollection[] }>("/collections/me", {
    token,
  });
}

export async function updateCollectionRequest(
  token: string,
  resourceId: string,
  payload: {
    isFavorite?: boolean;
    isSavedForLater?: boolean;
    isCompleted?: boolean;
  }
) {
  return apiRequest<{ collection: BackendCollection }>(`/collections/${resourceId}`, {
    method: "PATCH",
    token,
    body: payload,
  });
}
