import { describe, expect, it } from "vitest";

import { buildMockStats } from "./statsUtils";

describe("stats utils", () => {
  it("builds the expected dashboard KPI payload", () => {
    const stats = buildMockStats();

    expect(stats.totalUsers).toBe(142);
    expect(stats.activeAds).toBe(56);
    expect(stats.pendingReports).toBe(3);
  });

  it("provides three recent activities", () => {
    const stats = buildMockStats();

    expect(stats.recentActivity).toHaveLength(3);
    expect(stats.recentActivity[0]).toMatchObject({
      user: "Jean B.",
      action: "Inscription",
    });
  });

  it("returns serializable dashboard data", () => {
    expect(() => JSON.stringify(buildMockStats())).not.toThrow();
  });
});
