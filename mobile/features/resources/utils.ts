import type { AuthUser } from "../auth/AuthProvider";
import type {
  BackendComment,
  BackendReply,
  BackendResource,
} from "./api";
import type { Resource } from "./types";

export type ResourceDraft = {
  title: string;
  summary: string;
  content: string;
  category: Resource["category"];
  format: Resource["format"];
  relation: Resource["relation"];
  access: Resource["access"];
  tags: string;
};

export function toggleId(collection: string[], id: string) {
  return collection.indexOf(id) >= 0
    ? collection.filter((item) => item !== id)
    : [...collection, id];
}

export function splitTags(tags: string) {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function splitParagraphs(content: string) {
  return content
    .split("\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function canUseCitizenFeatures(user: AuthUser | null, isCitizen: boolean) {
  return Boolean(user && isCitizen && user.membership === "citizen");
}

export function buildResourceFromDraft(
  draft: ResourceDraft,
  user: AuthUser,
  now = Date.now()
): Resource {
  return {
    id: `res-${now}`,
    title: draft.title.trim(),
    summary: draft.summary.trim(),
    content: splitParagraphs(draft.content),
    category: draft.category,
    format: draft.format,
    relation: draft.relation,
    access: draft.access,
    author: `${user.firstName} ${user.lastName}`,
    publishedAt: "Aujourd’hui",
    publishedTimestamp: Number(new Date(now).toISOString().slice(0, 10).replaceAll("-", "")),
    readingTime: Math.max(3, Math.ceil(draft.content.split(" ").length / 130)),
    likes: 0,
    tags: splitTags(draft.tags),
    commentCount: 0,
    ownerId: user.id,
    comments: [],
  };
}

export function mapBackendResourceToMobileResource(
  resource: BackendResource
): Resource {
  const categoryToken = Array.isArray(resource.category)
    ? resource.category[0]
    : resource.category;
  const category = mapBackendCategoryToMobileCategory(categoryToken, resource.format);
  const access = resource.visibility === "PUBLIC" ? "public" : "restricted";
  const format = mapBackendFormatToMobileFormat(resource.format, category);
  const relation = mapBackendRelationToMobileRelation(resource.relation, categoryToken);
  const publishedTimestamp = Date.now();
  const summary = resource.summary?.trim() || buildSummary(resource, category, access);
  const tags = Array.isArray(resource.tags) ? resource.tags.filter(Boolean) : [];

  return {
    id: String(resource.ressource_id),
    title: resource.wording,
    summary,
    content: splitApiContent(resource.content),
    category,
    format,
    relation,
    access,
    author: resource.user
      ? `${resource.user.firstname} ${resource.user.lastname}`.trim()
      : "Contribution citoyenne",
    publishedAt: "Synchronisé depuis l’API",
    publishedTimestamp,
    readingTime: Math.max(2, Math.ceil(resource.wording.split(/\s+/).length / 40)),
    likes: resource._count?.reactions ?? 0,
    tags,
    commentCount: resource._count?.comments ?? 0,
    ownerId: String(resource.user_id),
    featured: Boolean(resource.featured),
    comments: [],
  };
}

export function mapBackendComments(comments: BackendComment[]) {
  return comments.map((comment) => ({
    id: String(comment.comment_id),
    author: buildAuthorLabel(comment.user),
    message: comment.text,
    createdAt: formatApiDate(comment.created_at),
    replies: (comment.replies ?? []).map(mapBackendReply),
  }));
}

export function mapMobileDraftToApiPayload(draft: ResourceDraft) {
  return {
    wording: draft.title.trim(),
    content: draft.content.trim() || draft.summary.trim(),
    summary: draft.summary.trim(),
    visibility: (draft.access === "public" ? "PUBLIC" : "PRIVATE") as
      | "PUBLIC"
      | "PRIVATE",
    category: [mapMobileCategoryToBackendCategory(draft.category)],
    format: draft.format,
    relation: draft.relation,
    tags: splitTags(draft.tags),
    featured: false,
  };
}

function mapBackendReply(reply: BackendReply) {
  return {
    id: String(reply.replie_id),
    author: buildAuthorLabel(reply.user),
    message: reply.text,
    createdAt: formatApiDate(reply.created_at),
  };
}

function buildAuthorLabel(
  user?: { firstname: string; lastname: string } | null
) {
  if (!user) {
    return "Utilisateur";
  }

  return `${user.firstname} ${user.lastname}`.trim();
}

function formatApiDate(value?: string) {
  if (!value) {
    return "À l’instant";
  }

  try {
    return new Date(value).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "À l’instant";
  }
}

function buildSummary(
  resource: BackendResource,
  category: Resource["category"],
  access: Resource["access"]
) {
  const excerpt = resource.content?.trim();
  if (excerpt) {
    return excerpt.slice(0, 140) + (excerpt.length > 140 ? "..." : "");
  }

  const scope = access === "public" ? "publique" : "restreinte";
  return `Ressource ${scope.toLowerCase()} synchronisée depuis l’API dans la catégorie ${category.toLowerCase()}.`;
}

function splitApiContent(content?: string | null) {
  const paragraphs = splitParagraphs(content ?? "");

  if (paragraphs.length > 0) {
    return paragraphs;
  }

  return [
    "Cette ressource est chargée depuis l’API, mais aucun contenu détaillé n’a encore été renseigné.",
  ];
}

function mapBackendCategoryToMobileCategory(
  category?: string,
  format?: string | null
): Resource["category"] {
  if (format === "Activité" || format === "Atelier") {
    return "Activité / Jeu";
  }

  switch (category) {
    case "EVENTS":
    case "COMMUNITY":
    case "SPORT":
    case "CULTURE":
      return "Activité / Jeu";
    case "EDUCATION":
    case "SERVICES":
    case "JOB_HELP":
      return "Guide";
    case "SOCIAL_SUPPORT":
    case "HEALTH":
      return "Fiche pratique";
    default:
      return "Article";
  }
}

function mapBackendFormatToMobileFormat(
  format: string | null | undefined,
  category: Resource["category"]
): Resource["format"] {
  if (format === "Lecture" || format === "Audio" || format === "Atelier" || format === "Activité") {
    return format;
  }

  return category === "Activité / Jeu" ? "Activité" : "Lecture";
}

function mapBackendRelationToMobileRelation(
  relation: string | null | undefined,
  category?: string
): Resource["relation"] {
  if (
    relation === "Famille" ||
    relation === "Couple" ||
    relation === "Amitié" ||
    relation === "Travail" ||
    relation === "Voisinage"
  ) {
    return relation;
  }

  switch (category) {
    case "CHILDCARE":
    case "ELDERLY_HELP":
      return "Famille";
    case "SOCIAL_SUPPORT":
    case "COMMUNITY":
    case "EVENTS":
      return "Amitié";
    case "JOB_HELP":
      return "Travail";
    default:
      return "Famille";
  }
}

function mapMobileCategoryToBackendCategory(category: Resource["category"]) {
  switch (category) {
    case "Guide":
      return "EDUCATION";
    case "Fiche pratique":
      return "SOCIAL_SUPPORT";
    case "Activité / Jeu":
      return "EVENTS";
    default:
      return "OTHER";
  }
}
