import { apiRequest } from "../../lib/api";

export type BackendActivity = {
  activity_id: number;
  title: string;
  description: string;
  status: string;
  ressource_id?: number | null;
  participants: Array<{
    participant_id: number;
    name: string;
  }>;
  messages: Array<{
    message_id: number;
    author_name: string;
    message: string;
    created_at: string;
  }>;
};

export async function fetchActivitiesRequest(token: string) {
  return apiRequest<{ activities: BackendActivity[] }>("/activities", { token });
}

export async function createActivityRequest(
  token: string,
  payload?: { title?: string; description?: string; resourceId?: string }
) {
  return apiRequest<{ activity: BackendActivity }>("/activities", {
    method: "POST",
    token,
    body: payload,
  });
}

export async function addParticipantRequest(
  token: string,
  activityId: string,
  name: string
) {
  return apiRequest<{ activity: BackendActivity }>(`/activities/${activityId}/participants`, {
    method: "POST",
    token,
    body: { name },
  });
}

export async function addActivityMessageRequest(
  token: string,
  activityId: string,
  message: string
) {
  return apiRequest<{ activity: BackendActivity }>(`/activities/${activityId}/messages`, {
    method: "POST",
    token,
    body: { message },
  });
}
