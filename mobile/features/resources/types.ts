export type ResourceAccess = "public" | "restricted";
export type ResourceRelation =
  | "Famille"
  | "Couple"
  | "Amitié"
  | "Travail"
  | "Voisinage";
export type ResourceCategory =
  | "Article"
  | "Guide"
  | "Fiche pratique"
  | "Activité / Jeu";

export type ResourceFormat = "Lecture" | "Audio" | "Atelier" | "Activité";

export type CommentReply = {
  id: string;
  author: string;
  message: string;
  createdAt: string;
};

export type ResourceComment = {
  id: string;
  author: string;
  message: string;
  createdAt: string;
  replies: CommentReply[];
};

export type Resource = {
  id: string;
  title: string;
  summary: string;
  content: string[];
  category: ResourceCategory;
  format: ResourceFormat;
  relation: ResourceRelation;
  access: ResourceAccess;
  author: string;
  publishedAt: string;
  publishedTimestamp: number;
  readingTime: number;
  likes: number;
  tags: string[];
  featured?: boolean;
  ownerId?: string;
  comments: ResourceComment[];
};
