import { describe, expect, it } from "vitest";

import type { AuthUser } from "../auth/AuthProvider";
import { initialResources } from "./data";
import {
  addCommentState,
  createResourceState,
  replyToCommentState,
  updateResourceState,
} from "./state";
import type { ResourceDraft } from "./utils";

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

const draft: ResourceDraft = {
  title: "  Nouvelle ressource ",
  summary: "  Résumé propre ",
  content: "Ligne 1\n\nLigne 2",
  category: "Guide",
  format: "Lecture",
  relation: "Famille",
  access: "public",
  tags: "famille, dialogue",
};

describe("resources state", () => {
  it("creates a resource for a citizen", () => {
    const result = createResourceState(initialResources, draft, citizen, true, 1000);

    expect(result.createdId).toBe("res-1000");
    expect(result.nextResources[0]).toMatchObject({
      id: "res-1000",
      ownerId: "u-1",
      title: "Nouvelle ressource",
    });
    expect(result.nextResources).toHaveLength(initialResources.length + 1);
  });

  it("refuses to create a resource for a guest", () => {
    const result = createResourceState(initialResources, draft, guest, false, 1000);

    expect(result.createdId).toBe("");
    expect(result.nextResources).toEqual(initialResources);
  });

  it("updates only the owned resource", () => {
    const owned = [
      { ...initialResources[0], ownerId: "u-1" },
      { ...initialResources[1], ownerId: "u-2" },
    ];

    const next = updateResourceState(owned, "res-1", draft, citizen, true);

    expect(next[0].title).toBe("Nouvelle ressource");
    expect(next[1].title).toBe(initialResources[1].title);
  });

  it("adds a comment only for a citizen", () => {
    const next = addCommentState(initialResources, "res-2", "  Merci pour cette fiche  ", citizen, true, 5000);

    const resource = next.find((item) => item.id === "res-2");
    expect(resource?.comments.at(-1)).toMatchObject({
      id: "c-5000",
      author: "Léa Martin",
      message: "Merci pour cette fiche",
    });
  });

  it("does not add a comment for a guest", () => {
    const next = addCommentState(initialResources, "res-2", "Bonjour", guest, false, 5000);

    expect(next).toEqual(initialResources);
  });

  it("adds a reply to an existing comment", () => {
    const next = replyToCommentState(initialResources, "res-1", "c-1", "  Réponse utile ", citizen, true, 7000);

    const resource = next.find((item) => item.id === "res-1");
    const comment = resource?.comments.find((item) => item.id === "c-1");

    expect(comment?.replies.at(-1)).toMatchObject({
      id: "r-7000",
      author: "Léa Martin",
      message: "Réponse utile",
    });
  });
});
