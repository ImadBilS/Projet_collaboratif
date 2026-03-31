import { describe, expect, it } from "vitest";

import type { AuthUser } from "../auth/AuthProvider";
import {
  buildResourceFromDraft,
  canUseCitizenFeatures,
  splitParagraphs,
  splitTags,
  toggleId,
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

describe("resources utils", () => {
  it("toggleId adds an id that is not present", () => {
    expect(toggleId(["res-1"], "res-2")).toEqual(["res-1", "res-2"]);
  });

  it("toggleId removes an id that is already present", () => {
    expect(toggleId(["res-1", "res-2"], "res-2")).toEqual(["res-1"]);
  });

  it("splitTags trims and removes empty tags", () => {
    expect(splitTags("famille, dialogue, , activité ")).toEqual([
      "famille",
      "dialogue",
      "activité",
    ]);
  });

  it("splitParagraphs trims and removes blank lines", () => {
    expect(splitParagraphs("Premier bloc\n\n Deuxième bloc \n")).toEqual([
      "Premier bloc",
      "Deuxième bloc",
    ]);
  });

  it("canUseCitizenFeatures only allows citizen users", () => {
    expect(canUseCitizenFeatures(citizen, true)).toBe(true);
    expect(canUseCitizenFeatures(citizen, false)).toBe(false);
    expect(canUseCitizenFeatures(null, true)).toBe(false);
  });

  it("buildResourceFromDraft creates a normalized resource", () => {
    const resource = buildResourceFromDraft(
      {
        title: "  Rituel du dimanche ",
        summary: "  Un résumé court ",
        content: "Premier point\n\nDeuxième point",
        category: "Guide",
        format: "Lecture",
        relation: "Famille",
        access: "public",
        tags: "famille, dialogue, rituel ",
      },
      citizen,
      1711843200000
    );

    expect(resource).toMatchObject({
      id: "res-1711843200000",
      title: "Rituel du dimanche",
      summary: "Un résumé court",
      author: "Léa Martin",
      ownerId: "u-1",
      access: "public",
      relation: "Famille",
      tags: ["famille", "dialogue", "rituel"],
      content: ["Premier point", "Deuxième point"],
      likes: 0,
      comments: [],
    });
    expect(resource.readingTime).toBeGreaterThanOrEqual(3);
  });
});
