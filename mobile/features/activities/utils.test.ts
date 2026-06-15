import { describe, expect, it } from "vitest";

import type { AuthUser } from "../auth/AuthProvider";
import {
  buildStartedActivity,
  canManageActivities,
  trimMessage,
  trimParticipantName,
} from "./utils";

const citizen: AuthUser = {
  id: "u-1",
  firstName: "Léa",
  lastName: "Martin",
  city: "Lille",
  email: "lea@example.com",
  membership: "citizen",
  bio: "Bio",
};

describe("activities utils", () => {
  it("canManageActivities only allows citizen users", () => {
    expect(canManageActivities(citizen, true)).toBe(true);
    expect(canManageActivities(citizen, false)).toBe(false);
    expect(canManageActivities(null, true)).toBe(false);
  });

  it("buildStartedActivity creates a valid starter activity", () => {
    expect(buildStartedActivity(citizen, 1234)).toEqual({
      id: "act-1234",
      title: "Nouvelle activité citoyenne",
      description:
        "Une activité démarrée depuis le mobile pour favoriser un échange relationnel simple.",
      status: "Prête",
      participants: [{ id: "u-1", name: "Léa Martin" }],
      messages: [],
    });
  });

  it("trimParticipantName removes outer spaces", () => {
    expect(trimParticipantName("  Camille  ")).toBe("Camille");
  });

  it("trimMessage removes outer spaces", () => {
    expect(trimMessage("  Bonjour tout le monde  ")).toBe("Bonjour tout le monde");
  });
});
