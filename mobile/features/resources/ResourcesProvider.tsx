import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "../auth/AuthProvider";
import { initialResources } from "./data";
import {
  addCommentRequest,
  addReplyRequest,
  createResourceRequest,
  fetchMyResourcesRequest,
  fetchCommentsRequest,
  fetchPublicResourcesRequest,
  updateResourceRequest,
} from "./api";
import { Resource } from "./types";
import {
  canUseCitizenFeatures,
  mapBackendComments,
  mapBackendResourceToMobileResource,
  mapMobileDraftToApiPayload,
  toggleId,
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
  toggleFavorite: (id: string) => void;
  toggleSavedForLater: (id: string) => void;
  toggleCompleted: (id: string) => void;
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
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [favorites, setFavorites] = useState<string[]>(["res-1"]);
  const [savedForLater, setSavedForLater] = useState<string[]>(["res-4"]);
  const [completed, setCompleted] = useState<string[]>(["res-2"]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadResources() {
      setIsSyncing(true);
      setSyncError(null);

      try {
        const publicResources = await fetchPublicResourcesRequest();
        const ownedResources = accessToken
          ? await fetchMyResourcesRequest(accessToken)
          : [];
        const nextResources = dedupeResourcesById([
          ...ownedResources,
          ...publicResources,
        ]);

        if (!cancelled) {
          setResources(nextResources.map(mapBackendResourceToMobileResource));
        }
      } catch (error) {
        if (!cancelled) {
          setResources(initialResources);
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
    const featuredResources = resources.filter((resource) => resource.featured).slice(0, 3);
    const favoriteResources = resources.filter(
      (resource) => favorites.indexOf(resource.id) >= 0
    );
    const savedResources = resources.filter(
      (resource) => savedForLater.indexOf(resource.id) >= 0
    );
    const completedResources = resources.filter(
      (resource) => completed.indexOf(resource.id) >= 0
    );

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
      isFavorite: (id) => favorites.indexOf(id) >= 0,
      isSavedForLater: (id) => savedForLater.indexOf(id) >= 0,
      isCompleted: (id) => completed.indexOf(id) >= 0,
      isSyncing,
      syncError,
      toggleFavorite: (id) => {
        if (!canUseCitizenFeatures(user, isCitizen)) {
          return;
        }

        setFavorites((current) => toggleId(current, id));
      },
      toggleSavedForLater: (id) => {
        if (!canUseCitizenFeatures(user, isCitizen)) {
          return;
        }

        setSavedForLater((current) => toggleId(current, id));
      },
      toggleCompleted: (id) => {
        if (!canUseCitizenFeatures(user, isCitizen)) {
          return;
        }

        setCompleted((current) => toggleId(current, id));
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
              ? { ...resource, comments: mapBackendComments(comments) }
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
              ? { ...resource, comments: mapBackendComments(comments) }
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
                ? { ...resource, comments: mapBackendComments(comments) }
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
    completed,
    favorites,
    isCitizen,
    isSyncing,
    resources,
    savedForLater,
    syncError,
    user,
  ]);

  return <ResourcesContext.Provider value={value}>{children}</ResourcesContext.Provider>;
}

function dedupeResourcesById(resources: Array<{ ressource_id: number }>) {
  const seen = new Set<number>();

  return resources.filter((resource) => {
    if (seen.has(resource.ressource_id)) {
      return false;
    }

    seen.add(resource.ressource_id);
    return true;
  });
}

export function useResources() {
  const context = useContext(ResourcesContext);

  if (!context) {
    throw new Error("useResources must be used within ResourcesProvider");
  }

  return context;
}
