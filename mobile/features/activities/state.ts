import type { AuthUser } from "../auth/AuthProvider";
import type { Activity } from "./types";
import {
  buildStartedActivity,
  canManageActivities,
  trimMessage,
  trimParticipantName,
} from "./utils";

export function startActivityState(
  current: Activity[],
  user: AuthUser | null,
  isCitizen: boolean,
  now = Date.now()
) {
  if (!canManageActivities(user, isCitizen) || !user) {
    return { nextActivities: current, createdId: "" };
  }

  const nextActivity = buildStartedActivity(user, now);

  return {
    nextActivities: [nextActivity, ...current],
    createdId: nextActivity.id,
  };
}

export function inviteParticipantState(
  current: Activity[],
  activityId: string,
  name: string,
  user: AuthUser | null,
  isCitizen: boolean,
  now = Date.now()
) {
  const participantName = trimParticipantName(name);

  if (!canManageActivities(user, isCitizen) || !participantName) {
    return current;
  }

  return current.map((activity) =>
    activity.id === activityId
      ? {
          ...activity,
          participants: [
            ...activity.participants,
            { id: `p-${now}`, name: participantName },
          ],
        }
      : activity
  );
}

export function sendMessageState(
  current: Activity[],
  activityId: string,
  message: string,
  user: AuthUser | null,
  isCitizen: boolean,
  now = Date.now()
) {
  const nextMessage = trimMessage(message);

  if (!canManageActivities(user, isCitizen) || !user || !nextMessage) {
    return current;
  }

  return current.map((activity) =>
    activity.id === activityId
      ? {
          ...activity,
          status: "En cours",
          messages: [
            ...activity.messages,
            {
              id: `m-${now}`,
              author: `${user.firstName} ${user.lastName}`,
              message: nextMessage,
              createdAt: "À l’instant",
            },
          ],
        }
      : activity
  );
}
