import { createContext, ReactNode, useContext, useMemo, useState } from "react";

import { useAuth } from "../auth/AuthProvider";
import { initialActivities } from "./data";
import { Activity } from "./types";

type ActivitiesContextValue = {
  activities: Activity[];
  getActivityById: (id: string) => Activity | undefined;
  startActivity: () => string;
  inviteParticipant: (activityId: string, name: string) => void;
  sendMessage: (activityId: string, message: string) => void;
};

const ActivitiesContext = createContext<ActivitiesContextValue | undefined>(undefined);

export function ActivitiesProvider({ children }: { children: ReactNode }) {
  const { user, isCitizen } = useAuth();
  const [activities, setActivities] = useState<Activity[]>(initialActivities);

  const value = useMemo<ActivitiesContextValue>(
    () => ({
      activities,
      getActivityById: (id) => activities.find((activity) => activity.id === id),
      startActivity: () => {
        if (!isCitizen || !user) {
          return "";
        }

        const nextId = `act-${Date.now()}`;
        const nextActivity: Activity = {
          id: nextId,
          title: "Nouvelle activité citoyenne",
          description:
            "Une activité démarrée depuis le mobile pour favoriser un échange relationnel simple.",
          status: "Prête",
          participants: [{ id: user.id, name: `${user.firstName} ${user.lastName}` }],
          messages: [],
        };

        setActivities((current) => [nextActivity, ...current]);
        return nextId;
      },
      inviteParticipant: (activityId, name) => {
        if (!isCitizen || !name.trim()) {
          return;
        }

        setActivities((current) =>
          current.map((activity) =>
            activity.id === activityId
              ? {
                  ...activity,
                  participants: [
                    ...activity.participants,
                    { id: `p-${Date.now()}`, name: name.trim() },
                  ],
                }
              : activity
          )
        );
      },
      sendMessage: (activityId, message) => {
        if (!isCitizen || !user || !message.trim()) {
          return;
        }

        setActivities((current) =>
          current.map((activity) =>
            activity.id === activityId
              ? {
                  ...activity,
                  status: "En cours",
                  messages: [
                    ...activity.messages,
                    {
                      id: `m-${Date.now()}`,
                      author: `${user.firstName} ${user.lastName}`,
                      message: message.trim(),
                      createdAt: "À l’instant",
                    },
                  ],
                }
              : activity
          )
        );
      },
    }),
    [activities, isCitizen, user]
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
