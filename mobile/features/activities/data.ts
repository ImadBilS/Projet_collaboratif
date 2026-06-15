import { Activity } from "./types";

export const initialActivities: Activity[] = [
  {
    id: "act-1",
    title: "Jeu de cartes relationnel du samedi",
    description:
      "Une activité courte pour faire circuler la parole autour d’une journée difficile.",
    status: "En cours",
    resourceId: "res-4",
    participants: [
      { id: "p-1", name: "Léa" },
      { id: "p-2", name: "Camille" },
    ],
    messages: [
      {
        id: "m-1",
        author: "Léa",
        message: "On lance la première série de cartes à 19h ?",
        createdAt: "Aujourd’hui",
      },
      {
        id: "m-2",
        author: "Camille",
        message: "Oui, je prends les questions gratitude.",
        createdAt: "Aujourd’hui",
      },
    ],
  },
];
