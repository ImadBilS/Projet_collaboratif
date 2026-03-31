import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "../auth/AuthProvider";
import {
  addCommentRequest,
  addReplyRequest,
  createResourceRequest,
  fetchCollectionsRequest,
  fetchCommentsRequest,
  fetchMyResourcesRequest,
  fetchPublicResourcesRequest,
  updateCollectionRequest,
  updateResourceRequest,
  type BackendCollection,
} from "./api";
import { Resource } from "./types";
import {
  canUseCitizenFeatures,
  mapBackendComments,
  mapBackendResourceToMobileResource,
  mapMobileDraftToApiPayload,
  type ResourceDraft,
} from "./utils";

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
  toggleFavorite: (id: string) => Promise<void>;
  toggleSavedForLater: (id: string) => Promise<void>;
  toggleCompleted: (id: string) => Promise<void>;
  createResource: (draft: ResourceDraft) => Promise<string>;
  updateResource: (id: string, draft: ResourceDraft) => Promise<void>;
  addComment: (resourceId: string, message: string) => Promise<void>;
  replyToComment: (
    resourceId: string,
    commentId: string,
    message: string
  ) => Promise<void>;
  refreshComments: (resourceId: string) => Promise<void>;
  isSyncing: boolean;
  syncError: string | null;
};

const ResourcesContext = createContext<ResourcesContextValue | undefined>(undefined);

export function ResourcesProvider({ children }: { children: ReactNode }) {
  const { user, isCitizen, accessToken } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [savedForLaterIds, setSavedForLaterIds] = useState<string[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadResources() {
      setIsSyncing(true);
      setSyncError(null);

      try {
        const [publicResources, ownedResources, collectionsResponse] = await Promise.all([
          fetchPublicResourcesRequest(),
          accessToken ? fetchMyResourcesRequest(accessToken) : Promise.resolve([]),
          accessToken ? fetchCollectionsRequest(accessToken) : Promise.resolve({ collections: [] }),
        ]);
        const collectionEntries = collectionsResponse.collections;
        const collectionResources = collectionEntries.map((entry) => entry.resource);
        const nextResources = dedupeResourcesById([
          ...ownedResources,
          ...publicResources,
          ...collectionResources,
        ]);

        if (cancelled) {
          return;
        }

        setResources(nextResources.map(mapBackendResourceToMobileResource));
        setCollectionsFromEntries(collectionEntries, {
          setFavoriteIds,
          setSavedForLaterIds,
          setCompletedIds,
        });
      } catch (error) {
        if (!cancelled) {
          setResources([]);
          setFavoriteIds([]);
          setSavedForLaterIds([]);
          setCompletedIds([]);
          setSyncError(
            error instanceof Error
              ? error.message
              : "Synchronisation API impossible."
          );
        }
      } finally {
        if (!cancelled) {
          setIsSyncing(false);
        }
      }
    }

    void loadResources();

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  const value = useMemo<ResourcesContextValue>(() => {
    const featuredResources = (
      resources.some((resource) => resource.featured)
        ? resources.filter((resource) => resource.featured)
        : resources
    ).slice(0, 3);
    const favoriteResources = resources.filter(
      (resource) => favoriteIds.indexOf(resource.id) >= 0
    );
    const savedResources = resources.filter(
      (resource) => savedForLaterIds.indexOf(resource.id) >= 0
    );
    const completedResources = resources.filter(
      (resource) => completedIds.indexOf(resource.id) >= 0
    );

    async function updateCollection(
      id: string,
      payload: {
        isFavorite?: boolean;
        isSavedForLater?: boolean;
        isCompleted?: boolean;
      }
    ) {
      if (!canUseCitizenFeatures(user, isCitizen) || !accessToken) {
        return;
      }

      const response = await updateCollectionRequest(accessToken, id, payload);
      applyCollectionEntry(response.collection, {
        setFavoriteIds,
        setSavedForLaterIds,
        setCompletedIds,
      });
      mergeResourceFromCollection(response.collection, setResources);
    }

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
      isFavorite: (id) => favoriteIds.indexOf(id) >= 0,
      isSavedForLater: (id) => savedForLaterIds.indexOf(id) >= 0,
      isCompleted: (id) => completedIds.indexOf(id) >= 0,
      isSyncing,
      syncError,
      toggleFavorite: async (id) => {
        await updateCollection(id, { isFavorite: favoriteIds.indexOf(id) < 0 });
      },
      toggleSavedForLater: async (id) => {
        await updateCollection(id, {
          isSavedForLater: savedForLaterIds.indexOf(id) < 0,
        });
      },
      toggleCompleted: async (id) => {
        await updateCollection(id, { isCompleted: completedIds.indexOf(id) < 0 });
      },
      createResource: async (draft) => {
        if (!user || !isCitizen || !accessToken) {
          throw new Error("Connexion requise pour créer une ressource.");
        }

        const created = await createResourceRequest(
          accessToken,
          mapMobileDraftToApiPayload(draft)
        );
        const nextResource = mapBackendResourceToMobileResource(created);

        setResources((current) => [nextResource, ...current]);
        return nextResource.id;
      },
      updateResource: async (id, draft) => {
        if (!user || !isCitizen || !accessToken) {
          throw new Error("Connexion requise pour modifier une ressource.");
        }

        const updated = await updateResourceRequest(
          accessToken,
          id,
          mapMobileDraftToApiPayload(draft)
        );
        const nextResource = mapBackendResourceToMobileResource(updated);

        setResources((current) =>
          current.map((resource) => (resource.id === id ? nextResource : resource))
        );
      },
      addComment: async (resourceId, message) => {
        if (!user || !isCitizen || !accessToken) {
          throw new Error("Connexion requise pour commenter.");
        }

        await addCommentRequest(accessToken, resourceId, message.trim());
        const comments = await fetchCommentsRequest(resourceId, accessToken);

        setResources((current) =>
          current.map((resource) =>
            resource.id === resourceId
              ? {
                  ...resource,
                  comments: mapBackendComments(comments),
                  commentCount: comments.length,
                }
              : resource
          )
        );
      },
      replyToComment: async (resourceId, commentId, message) => {
        if (!user || !isCitizen || !accessToken) {
          throw new Error("Connexion requise pour répondre.");
        }

        await addReplyRequest(accessToken, commentId, message.trim());
        const comments = await fetchCommentsRequest(resourceId, accessToken);

        setResources((current) =>
          current.map((resource) =>
            resource.id === resourceId
              ? {
                  ...resource,
                  comments: mapBackendComments(comments),
                  commentCount: comments.length,
                }
              : resource
          )
        );
      },
      refreshComments: async (resourceId) => {
        try {
          const comments = await fetchCommentsRequest(resourceId, accessToken);
          setResources((current) =>
            current.map((resource) =>
              resource.id === resourceId
                ? {
                    ...resource,
                    comments: mapBackendComments(comments),
                    commentCount: comments.length,
                  }
                : resource
            )
          );
        } catch (error) {
          setSyncError(
            error instanceof Error
              ? error.message
              : "Chargement des commentaires impossible."
          );
        }
      },
    };
  }, [
    accessToken,
    completedIds,
    favoriteIds,
    isCitizen,
    isSyncing,
    resources,
    savedForLaterIds,
    syncError,
    user,
  ]);

  return <ResourcesContext.Provider value={value}>{children}</ResourcesContext.Provider>;
}

function dedupeResourcesById<T extends { ressource_id: number }>(resources: T[]) {
  const seen = new Set<number>();

  return resources.filter((resource) => {
    if (seen.has(resource.ressource_id)) {
      return false;
    }

    seen.add(resource.ressource_id);
    return true;
  });
}

function setCollectionsFromEntries(
  entries: BackendCollection[],
  setters: {
    setFavoriteIds: (value: string[]) => void;
    setSavedForLaterIds: (value: string[]) => void;
    setCompletedIds: (value: string[]) => void;
  }
) {
  setters.setFavoriteIds(
    entries.filter((entry) => entry.is_favorite).map((entry) => String(entry.ressource_id))
  );
  setters.setSavedForLaterIds(
    entries
      .filter((entry) => entry.is_saved_for_later)
      .map((entry) => String(entry.ressource_id))
  );
  setters.setCompletedIds(
    entries.filter((entry) => entry.is_completed).map((entry) => String(entry.ressource_id))
  );
}

function applyCollectionEntry(
  entry: BackendCollection,
  setters: {
    setFavoriteIds: Dispatch<SetStateAction<string[]>>;
    setSavedForLaterIds: Dispatch<SetStateAction<string[]>>;
    setCompletedIds: Dispatch<SetStateAction<string[]>>;
  }
) {
  const resourceId = String(entry.ressource_id);

  setters.setFavoriteIds((current) =>
    entry.is_favorite ? ensureId(current, resourceId) : current.filter((id) => id !== resourceId)
  );
  setters.setSavedForLaterIds((current) =>
    entry.is_saved_for_later
      ? ensureId(current, resourceId)
      : current.filter((id) => id !== resourceId)
  );
  setters.setCompletedIds((current) =>
    entry.is_completed ? ensureId(current, resourceId) : current.filter((id) => id !== resourceId)
  );
}

function ensureId(collection: string[], id: string) {
  return collection.indexOf(id) >= 0 ? collection : [...collection, id];
}

function mergeResourceFromCollection(
  entry: BackendCollection,
  setResources: Dispatch<SetStateAction<Resource[]>>
) {
  const nextResource = mapBackendResourceToMobileResource(entry.resource);

  setResources((current) => {
    const exists = current.some((resource) => resource.id === nextResource.id);

    if (!exists) {
      return [nextResource, ...current];
    }

    return current.map((resource) =>
      resource.id === nextResource.id ? { ...resource, ...nextResource } : resource
    );
  });
}

export function useResources() {
  const context = useContext(ResourcesContext);

  if (!context) {
    throw new Error("useResources must be used within ResourcesProvider");
  }

  return context;
}
