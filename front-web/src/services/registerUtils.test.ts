import { describe, expect, it } from "vitest";

import {
  buildRegisterPayload,
  normalizeRegisterField,
  passwordsMatch,
  type RegisterFormPayload,
} from "./registerUtils";

const form: RegisterFormPayload = {
  firstname: "Nadia",
  lastname: "Leroy",
  birth: "1995-04-12",
  mail: "nadia@example.com",
  password: "Password123!",
  confirmPassword: "Password123!",
  role: "Citoyen",
  sex: "Femme",
  street_number: "12",
  street_type: "Rue",
  postal_code: "59000",
  address_complement: "Bat B",
  city: "Lille",
  country: "France",
};

describe("register utils", () => {
  it("turns an empty address complement into null", () => {
    expect(normalizeRegisterField("address_complement", "")).toBeNull();
  });

  it("keeps other field values unchanged", () => {
    expect(normalizeRegisterField("firstname", "Nadia")).toBe("Nadia");
  });

  it("validates matching passwords", () => {
    expect(passwordsMatch("abc", "abc")).toBe(true);
    expect(passwordsMatch("abc", "xyz")).toBe(false);
  });

  it("builds the API payload with numeric address fields", () => {
    expect(buildRegisterPayload(form)).toEqual({
      firstname: "Nadia",
      lastname: "Leroy",
      birth: "1995-04-12",
      mail: "nadia@example.com",
      password: "Password123!",
      role: "Citoyen",
      sex: "Femme",
      street_number: 12,
      street_type: "Rue",
      postal_code: 59000,
      address_complement: "Bat B",
      city: "Lille",
      country: "France",
    });
  });
});
