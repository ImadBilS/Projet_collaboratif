import { describe, expect, it } from "vitest";

import type { AuthUser } from "../auth/AuthProvider";
import { initialActivities } from "./data";
import {
  inviteParticipantState,
  sendMessageState,
  startActivityState,
} from "./state";

const citizen: AuthUser = {
  id: "u-1",
  firstName: "Léa",
  lastName: "Martin",
  city: "Lille",
  email: "lea@example.com",
  membership: "citizen",
  bio: "Bio",
};

const guest: AuthUser = {
  id: "guest-session",
  firstName: "Visiteur",
  lastName: "Invité",
  city: "",
  email: "",
  membership: "guest",
  bio: "Navigation en mode invité",
};

describe("activities state", () => {
  it("starts an activity for a citizen", () => {
    const result = startActivityState(initialActivities, citizen, true, 1000);

    expect(result.createdId).toBe("act-1000");
    expect(result.nextActivities[0]).toMatchObject({
      id: "act-1000",
      participants: [{ id: "u-1", name: "Léa Martin" }],
    });
  });

  it("refuses to start an activity for a guest", () => {
    const result = startActivityState(initialActivities, guest, false, 1000);

    expect(result.createdId).toBe("");
    expect(result.nextActivities).toEqual(initialActivities);
  });

  it("invites a participant when allowed", () => {
    const next = inviteParticipantState(initialActivities, "act-1", "  Camille 2 ", citizen, true, 3000);
    const activity = next.find((item) => item.id === "act-1");

    expect(activity?.participants.at(-1)).toEqual({
      id: "p-3000",
      name: "Camille 2",
    });
  });

  it("sends a message and switches status to En cours", () => {
    const next = sendMessageState(initialActivities, "act-1", "  Nouveau message ", citizen, true, 4000);
    const activity = next.find((item) => item.id === "act-1");

    expect(activity?.status).toBe("En cours");
    expect(activity?.messages.at(-1)).toMatchObject({
      id: "m-4000",
      author: "Léa Martin",
      message: "Nouveau message",
    });
  });

  it("refuses message sending for a guest", () => {
    const next = sendMessageState(initialActivities, "act-1", "Bonjour", guest, false, 4000);

    expect(next).toEqual(initialActivities);
  });
});
