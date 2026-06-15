import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Login from "./Login";

const mockNavigate = vi.fn();
const loginMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../services/authService", () => ({
  authService: {
    login: (...args: unknown[]) => loginMock(...args),
  },
}));

describe("Login page", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    loginMock.mockReset();
  });

  it("renders the login form", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText("(RE)Sources Relationnelles")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("admin@gouv.fr")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
  });

  it("submits credentials and redirects on success", async () => {
    const user = userEvent.setup();
    loginMock.mockResolvedValue({ token: "abc" });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText("admin@gouv.fr"), "admin@gouv.fr");
    await user.type(screen.getByPlaceholderText("••••••••"), "Password123!");
    await user.click(screen.getByRole("button", { name: /accéder au portail/i }));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith("admin@gouv.fr", "Password123!");
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows an error returned by the auth service", async () => {
    const user = userEvent.setup();
    loginMock.mockRejectedValue(new Error("Erreur de connexion"));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText("admin@gouv.fr"), "admin@gouv.fr");
    await user.type(screen.getByPlaceholderText("••••••••"), "wrong");
    await user.click(screen.getByRole("button", { name: /accéder au portail/i }));

    expect(await screen.findByText("Erreur de connexion")).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
