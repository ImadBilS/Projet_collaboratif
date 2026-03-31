import { authService } from "./authService";
import { apiRequest } from "./apiClient";

export type DashboardStats = {
  totalUsers: number;
  totalResources: number;
  publicResources: number;
  activeAds: number;
  pendingReports: number;
  totalViews: number;
  totalComments: number;
  totalReactions: number;
  recentActivity: Array<{
    id: string;
    user: string;
    action: string;
    date: string;
  }>;
};

export const statsService = {
  getStats: async () => {
    const token = authService.getToken();

    if (!token) {
      throw new Error("Session administrateur absente.");
    }

    return apiRequest<DashboardStats>("/stats", { token });
  },
};
