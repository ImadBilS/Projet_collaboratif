export function buildMockStats() {
  return {
    totalUsers: 142,
    activeAds: 56,
    pendingReports: 3,
    recentActivity: [
      { id: 1, user: "Jean B.", action: "Inscription", date: "Il y a 5 min" },
      {
        id: 2,
        user: "Marie L.",
        action: "Nouvelle annonce : Jardinage",
        date: "Il y a 12 min",
      },
      { id: 3, user: "Lucas T.", action: "Avis posté", date: "Il y a 1h" },
    ],
  };
}
