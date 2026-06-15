import type { AuthUser } from "../auth/AuthProvider";
import type { Activity } from "./types";

export function canManageActivities(user: AuthUser | null, isCitizen: boolean) {
  return Boolean(user && isCitizen && user.membership === "citizen");
}

export function buildStartedActivity(user: AuthUser, now = Date.now()): Activity {
  return {
    id: `act-${now}`,
    title: "Nouvelle activité citoyenne",
    description:
      "Une activité démarrée depuis le mobile pour favoriser un échange relationnel simple.",
    status: "Prête",
    participants: [{ id: user.id, name: `${user.firstName} ${user.lastName}` }],
    messages: [],
  };
}

export function trimParticipantName(name: string) {
  return name.trim();
}

export function trimMessage(message: string) {
  return message.trim();
}
