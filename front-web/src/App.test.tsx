import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import App from "./App";

const isAuthenticatedMock = vi.fn();

vi.mock("./services/authService", () => ({
  authService: {
    isAuthenticated: () => isAuthenticatedMock(),
  },
}));

describe("App routing", () => {
  beforeEach(() => {
    isAuthenticatedMock.mockReset();
    window.history.replaceState({}, "", "/");
  });

  afterEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it("renders the login page on /login", async () => {
    isAuthenticatedMock.mockReturnValue(false);
    window.history.replaceState({}, "", "/login");

    render(<App />);

    expect(await screen.findByText("(RE)Sources Relationnelles")).toBeInTheDocument();
  });

  it("redirects unauthenticated users away from /dashboard", async () => {
    isAuthenticatedMock.mockReturnValue(false);
    window.history.replaceState({}, "", "/dashboard");

    render(<App />);

    expect(await screen.findByText("(RE)Sources Relationnelles")).toBeInTheDocument();
  });
});
