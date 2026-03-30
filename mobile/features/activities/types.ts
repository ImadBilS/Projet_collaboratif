export type ActivityStatus = "En cours" | "Prête" | "Terminée";

export type ActivityParticipant = {
  id: string;
  name: string;
};

export type ActivityMessage = {
  id: string;
  author: string;
  message: string;
  createdAt: string;
};

export type Activity = {
  id: string;
  title: string;
  description: string;
  status: ActivityStatus;
  resourceId?: string;
  participants: ActivityParticipant[];
  messages: ActivityMessage[];
};
