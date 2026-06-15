import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Layout from "./Layout";

const logoutMock = vi.fn();

vi.mock("../services/authService", () => ({
  authService: {
    logout: () => logoutMock(),
  },
}));

describe("Layout", () => {
  beforeEach(() => {
    logoutMock.mockReset();
  });

  it("renders navigation entries and outlet content", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={<div>Dashboard content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Help's Admin")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /vue d'ensemble/i })).toBeInTheDocument();
    expect(screen.getByText("Dashboard content")).toBeInTheDocument();
  });

  it("calls logout when clicking the button", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={<div>Dashboard content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: /déconnexion/i }));

    expect(logoutMock).toHaveBeenCalled();
  });
});
