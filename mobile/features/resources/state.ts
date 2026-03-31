import type { AuthUser } from "../auth/AuthProvider";
import type { Resource } from "./types";
import {
  buildResourceFromDraft,
  canUseCitizenFeatures,
  splitParagraphs,
  splitTags,
  type ResourceDraft,
} from "./utils";

export function createResourceState(
  current: Resource[],
  draft: ResourceDraft,
  user: AuthUser | null,
  isCitizen: boolean,
  now = Date.now()
) {
  if (!canUseCitizenFeatures(user, isCitizen) || !user) {
    return { nextResources: current, createdId: "" };
  }

  const nextResource = buildResourceFromDraft(draft, user, now);

  return {
    nextResources: [nextResource, ...current],
    createdId: nextResource.id,
  };
}

export function updateResourceState(
  current: Resource[],
  id: string,
  draft: ResourceDraft,
  user: AuthUser | null,
  isCitizen: boolean
) {
  if (!canUseCitizenFeatures(user, isCitizen) || !user) {
    return current;
  }

  return current.map((resource) =>
    resource.id === id && resource.ownerId === user.id
      ? {
          ...resource,
          title: draft.title.trim(),
          summary: draft.summary.trim(),
          content: splitParagraphs(draft.content),
          category: draft.category,
          format: draft.format,
          relation: draft.relation,
          access: draft.access,
          tags: splitTags(draft.tags),
        }
      : resource
  );
}

export function addCommentState(
  current: Resource[],
  resourceId: string,
  message: string,
  user: AuthUser | null,
  isCitizen: boolean,
  now = Date.now()
) {
  if (!canUseCitizenFeatures(user, isCitizen) || !user || !message.trim()) {
    return current;
  }

  return current.map((resource) =>
    resource.id === resourceId
      ? {
          ...resource,
          comments: [
            ...resource.comments,
            {
              id: `c-${now}`,
              author: `${user.firstName} ${user.lastName}`,
              message: message.trim(),
              createdAt: "À l’instant",
              replies: [],
            },
          ],
        }
      : resource
  );
}

export function replyToCommentState(
  current: Resource[],
  resourceId: string,
  commentId: string,
  message: string,
  user: AuthUser | null,
  isCitizen: boolean,
  now = Date.now()
) {
  if (!canUseCitizenFeatures(user, isCitizen) || !user || !message.trim()) {
    return current;
  }

  return current.map((resource) =>
    resource.id === resourceId
      ? {
          ...resource,
          comments: resource.comments.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  replies: [
                    ...comment.replies,
                    {
                      id: `r-${now}`,
                      author: `${user.firstName} ${user.lastName}`,
                      message: message.trim(),
                      createdAt: "À l’instant",
                    },
                  ],
                }
              : comment
          ),
        }
      : resource
  );
}
