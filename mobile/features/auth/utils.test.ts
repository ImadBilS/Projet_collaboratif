import { describe, expect, it } from "vitest";

import type { AuthUser } from "./AuthProvider";
import {
  createGuestUser,
  isValidSignupPayload,
  stripPassword,
  trimProfilePayload,
} from "./utils";

describe("auth utils", () => {
  it("createGuestUser returns a guest profile", () => {
    expect(createGuestUser()).toEqual<AuthUser>({
      id: "guest-session",
      firstName: "Visiteur",
      lastName: "Invité",
      city: "",
      email: "",
      membership: "guest",
      bio: "Navigation en mode invité",
    });
  });

  it("stripPassword removes password from a stored user", () => {
    expect(
      stripPassword({
        id: "u-1",
        firstName: "Léa",
        lastName: "Martin",
        city: "Lille",
        email: "lea@example.com",
        membership: "citizen",
        bio: "Bio",
        password: "secret",
      })
    ).toEqual({
      id: "u-1",
      firstName: "Léa",
      lastName: "Martin",
      city: "Lille",
      email: "lea@example.com",
      membership: "citizen",
      bio: "Bio",
    });
  });

  it("trimProfilePayload trims editable fields", () => {
    expect(
      trimProfilePayload({
        firstName: "  Nina ",
        lastName: " Bernard  ",
        city: " Paris ",
        email: " nina@example.com ",
      })
    ).toEqual({
      firstName: "Nina",
      lastName: "Bernard",
      city: "Paris",
      email: "nina@example.com",
    });
  });

  it("isValidSignupPayload accepts a complete payload", () => {
    expect(
      isValidSignupPayload({
        firstName: "Nina",
        lastName: "Bernard",
        birth: "2000-01-01",
        sex: "Femme",
        city: "Paris",
        streetNumber: "12",
        streetType: "rue",
        postalCode: "75000",
        country: "France",
        email: "nina@example.com",
        password: "Password123!",
      })
    ).toBe(true);
  });

  it("isValidSignupPayload rejects empty or short values", () => {
    expect(
      isValidSignupPayload({
        firstName: " ",
        lastName: "Bernard",
        birth: "2000-01-01",
        sex: "Femme",
        city: "Paris",
        streetNumber: "12",
        streetType: "rue",
        postalCode: "75000",
        country: "France",
        email: "nina@example.com",
        password: "short",
      })
    ).toBe(false);
  });
});
