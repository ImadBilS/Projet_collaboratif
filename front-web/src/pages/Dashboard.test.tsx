import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Dashboard from "./Dashboard";

const getStatsMock = vi.fn();

vi.mock("../services/statsService", () => ({
  statsService: {
    getStats: () => getStatsMock(),
  },
}));

describe("Dashboard page", () => {
  beforeEach(() => {
    getStatsMock.mockReset();
  });

  it("shows a loading message first", () => {
    getStatsMock.mockReturnValue(new Promise(() => {}));

    render(<Dashboard />);

    expect(screen.getByText(/chargement des données/i)).toBeInTheDocument();
  });

  it("renders KPI cards and recent activity after loading", async () => {
    getStatsMock.mockResolvedValue({
      totalUsers: 142,
      activeAds: 56,
      pendingReports: 3,
      recentActivity: [
        { id: 1, user: "Jean B.", action: "Inscription", date: "Il y a 5 min" },
      ],
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("142")).toBeInTheDocument();
      expect(screen.getByText("56")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("Jean B.")).toBeInTheDocument();
    });
  });
});
