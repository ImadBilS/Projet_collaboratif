import { createContext, ReactNode, useContext, useMemo, useState } from "react";

import { useAuth } from "../auth/AuthProvider";
import { initialActivities } from "./data";
import {
  inviteParticipantState,
  sendMessageState,
  startActivityState,
} from "./state";
import { Activity } from "./types";
import {
  canManageActivities,
} from "./utils";

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
        const result = startActivityState(activities, user, isCitizen, Date.now());
        setActivities(result.nextActivities);
        return result.createdId;
      },
      inviteParticipant: (activityId, name) => {
        setActivities((current) =>
          inviteParticipantState(current, activityId, name, user, isCitizen, Date.now())
        );
      },
      sendMessage: (activityId, message) => {
        setActivities((current) =>
          sendMessageState(current, activityId, message, user, isCitizen, Date.now())
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
