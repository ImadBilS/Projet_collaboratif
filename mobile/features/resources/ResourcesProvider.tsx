import { createContext, ReactNode, useContext, useMemo, useState } from "react";

import { useAuth } from "../auth/AuthProvider";
import { initialResources } from "./data";
import { Resource } from "./types";

type ResourceDraft = {
  title: string;
  summary: string;
  content: string;
  category: Resource["category"];
  format: Resource["format"];
  relation: Resource["relation"];
  access: Resource["access"];
  tags: string;
};

type ResourcesContextValue = {
  resources: Resource[];
  featuredResources: Resource[];
  collections: {
    favorites: Resource[];
    savedForLater: Resource[];
    completed: Resource[];
  };
  summary: {
    total: number;
    favorites: number;
    savedForLater: number;
    completed: number;
  };
  getResourceById: (id: string) => Resource | undefined;
  isFavorite: (id: string) => boolean;
  isSavedForLater: (id: string) => boolean;
  isCompleted: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  toggleSavedForLater: (id: string) => void;
  toggleCompleted: (id: string) => void;
  createResource: (draft: ResourceDraft) => string;
  updateResource: (id: string, draft: ResourceDraft) => void;
  addComment: (resourceId: string, message: string) => void;
  replyToComment: (resourceId: string, commentId: string, message: string) => void;
};

const ResourcesContext = createContext<ResourcesContextValue | undefined>(undefined);

export function ResourcesProvider({ children }: { children: ReactNode }) {
  const { user, isCitizen } = useAuth();
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [favorites, setFavorites] = useState<string[]>(["res-1"]);
  const [savedForLater, setSavedForLater] = useState<string[]>(["res-4"]);
  const [completed, setCompleted] = useState<string[]>(["res-2"]);

  const value = useMemo<ResourcesContextValue>(() => {
    const featuredResources = resources.filter((resource) => resource.featured).slice(0, 3);
    const favoriteResources = resources.filter((resource) => favorites.includes(resource.id));
    const savedResources = resources.filter((resource) => savedForLater.includes(resource.id));
    const completedResources = resources.filter((resource) => completed.includes(resource.id));

    return {
      resources,
      featuredResources,
      collections: {
        favorites: favoriteResources,
        savedForLater: savedResources,
        completed: completedResources,
      },
      summary: {
        total: resources.length,
        favorites: favoriteResources.length,
        savedForLater: savedResources.length,
        completed: completedResources.length,
      },
      getResourceById: (id) => resources.find((resource) => resource.id === id),
      isFavorite: (id) => favorites.includes(id),
      isSavedForLater: (id) => savedForLater.includes(id),
      isCompleted: (id) => completed.includes(id),
      toggleFavorite: (id) => {
        if (!isCitizen) {
          return;
        }

        setFavorites((current) => toggleId(current, id));
      },
      toggleSavedForLater: (id) => {
        if (!isCitizen) {
          return;
        }

        setSavedForLater((current) => toggleId(current, id));
      },
      toggleCompleted: (id) => {
        if (!isCitizen) {
          return;
        }

        setCompleted((current) => toggleId(current, id));
      },
      createResource: (draft) => {
        if (!isCitizen || !user) {
          return "";
        }

        const nextId = `res-${Date.now()}`;

        setResources((current) => [
          {
            id: nextId,
            title: draft.title.trim(),
            summary: draft.summary.trim(),
            content: splitParagraphs(draft.content),
            category: draft.category,
            format: draft.format,
            relation: draft.relation,
            access: draft.access,
            author: `${user.firstName} ${user.lastName}`,
            publishedAt: "Aujourd’hui",
            publishedTimestamp: Number(new Date().toISOString().slice(0, 10).replaceAll("-", "")),
            readingTime: Math.max(3, Math.ceil(draft.content.split(" ").length / 130)),
            likes: 0,
            tags: splitTags(draft.tags),
            ownerId: user.id,
            comments: [],
          },
          ...current,
        ]);

        return nextId;
      },
      updateResource: (id, draft) => {
        if (!isCitizen || !user) {
          return;
        }

        setResources((current) =>
          current.map((resource) =>
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
          )
        );
      },
      addComment: (resourceId, message) => {
        if (!isCitizen || !user || !message.trim()) {
          return;
        }

        setResources((current) =>
          current.map((resource) =>
            resource.id === resourceId
              ? {
                  ...resource,
                  comments: [
                    ...resource.comments,
                    {
                      id: `c-${Date.now()}`,
                      author: `${user.firstName} ${user.lastName}`,
                      message: message.trim(),
                      createdAt: "À l’instant",
                      replies: [],
                    },
                  ],
                }
              : resource
          )
        );
      },
      replyToComment: (resourceId, commentId, message) => {
        if (!isCitizen || !user || !message.trim()) {
          return;
        }

        setResources((current) =>
          current.map((resource) =>
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
                              id: `r-${Date.now()}`,
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
          )
        );
      },
    };
  }, [completed, favorites, isCitizen, resources, savedForLater, user]);

  return <ResourcesContext.Provider value={value}>{children}</ResourcesContext.Provider>;
}

export function useResources() {
  const context = useContext(ResourcesContext);

  if (!context) {
    throw new Error("useResources must be used within ResourcesProvider");
  }

  return context;
}

function toggleId(collection: string[], id: string) {
  return collection.includes(id)
    ? collection.filter((item) => item !== id)
    : [...collection, id];
}

function splitTags(tags: string) {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function splitParagraphs(content: string) {
  return content
    .split("\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
