import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { useAuth } from "../auth/AuthProvider";
import {
  addActivityMessageRequest,
  addParticipantRequest,
  createActivityRequest,
  fetchActivitiesRequest,
  type BackendActivity,
} from "./api";
import { Activity } from "./types";

type ActivitiesContextValue = {
  activities: Activity[];
  getActivityById: (id: string) => Activity | undefined;
  startActivity: () => Promise<string>;
  inviteParticipant: (activityId: string, name: string) => Promise<void>;
  sendMessage: (activityId: string, message: string) => Promise<void>;
};

const ActivitiesContext = createContext<ActivitiesContextValue | undefined>(undefined);

export function ActivitiesProvider({ children }: { children: ReactNode }) {
  const { isCitizen, accessToken } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadActivities() {
      if (!isCitizen || !accessToken) {
        if (!cancelled) {
          setActivities([]);
        }
        return;
      }

      try {
        const response = await fetchActivitiesRequest(accessToken);

        if (!cancelled) {
          setActivities(response.activities.map(mapBackendActivity));
        }
      } catch {
        if (!cancelled) {
          setActivities([]);
        }
      }
    }

    void loadActivities();

    return () => {
      cancelled = true;
    };
  }, [accessToken, isCitizen]);

  const value = useMemo<ActivitiesContextValue>(
    () => ({
      activities,
      getActivityById: (id) => activities.find((activity) => activity.id === id),
      startActivity: async () => {
        if (!isCitizen || !accessToken) {
          return "";
        }

        const response = await createActivityRequest(accessToken);
        const nextActivity = mapBackendActivity(response.activity);

        setActivities((current) => [nextActivity, ...current]);
        return nextActivity.id;
      },
      inviteParticipant: async (activityId, name) => {
        if (!isCitizen || !accessToken) {
          return;
        }

        const response = await addParticipantRequest(accessToken, activityId, name.trim());
        const nextActivity = mapBackendActivity(response.activity);

        setActivities((current) =>
          current.map((activity) =>
            activity.id === activityId ? nextActivity : activity
          )
        );
      },
      sendMessage: async (activityId, message) => {
        if (!isCitizen || !accessToken) {
          return;
        }

        const response = await addActivityMessageRequest(
          accessToken,
          activityId,
          message.trim()
        );
        const nextActivity = mapBackendActivity(response.activity);

        setActivities((current) =>
          current.map((activity) =>
            activity.id === activityId ? nextActivity : activity
          )
        );
      },
    }),
    [accessToken, activities, isCitizen]
  );

  return <ActivitiesContext.Provider value={value}>{children}</ActivitiesContext.Provider>;
}

export function useActivities() {
  const context = useContext(ActivitiesContext);

  if (!context) {
    throw new Error("useActivities must be used within ActivitiesProvider");
  }

  return context;
}

function mapBackendActivity(activity: BackendActivity): Activity {
  return {
    id: String(activity.activity_id),
    title: activity.title,
    description: activity.description,
    status: normalizeStatus(activity.status),
    resourceId: activity.ressource_id ? String(activity.ressource_id) : undefined,
    participants: activity.participants.map((participant) => ({
      id: String(participant.participant_id),
      name: participant.name,
    })),
    messages: activity.messages.map((message) => ({
      id: String(message.message_id),
      author: message.author_name,
      message: message.message,
      createdAt: formatDate(message.created_at),
    })),
  };
}

function normalizeStatus(status: string): Activity["status"] {
  if (status === "En cours" || status === "Prête" || status === "Terminée") {
    return status;
  }

  return "Prête";
}

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "À l’instant";
  }
}
