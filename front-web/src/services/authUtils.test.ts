import { describe, expect, it } from "vitest";

import {
  clearSession,
  hasStoredSession,
  isAllowedAdminRole,
  persistSession,
} from "./authUtils";

function createStorageMock(): Storage {
  const store = new Map<string, string>();

  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
  };
}

describe("auth utils", () => {
  it("accepts allowed admin roles", () => {
    expect(isAllowedAdminRole("Administrateur")).toBe(true);
    expect(isAllowedAdminRole("Modérateur")).toBe(true);
  });

  it("rejects non-admin roles", () => {
    expect(isAllowedAdminRole("Citoyen")).toBe(false);
    expect(isAllowedAdminRole("")).toBe(false);
  });

  it("persists token and user in storage", () => {
    const storage = createStorageMock();

    persistSession("token-123", { role: "Administrateur", name: "Admin" }, storage);

    expect(storage.getItem("token")).toBe("token-123");
    expect(storage.getItem("user")).toBe(
      JSON.stringify({ role: "Administrateur", name: "Admin" })
    );
  });

  it("detects whether a session exists", () => {
    const storage = createStorageMock();

    expect(hasStoredSession(storage)).toBe(false);
    storage.setItem("token", "abc");
    expect(hasStoredSession(storage)).toBe(true);
  });

  it("clears the session from storage", () => {
    const storage = createStorageMock();
    storage.setItem("token", "abc");
    storage.setItem("user", "{\"role\":\"Administrateur\"}");

    clearSession(storage);

    expect(storage.getItem("token")).toBeNull();
    expect(storage.getItem("user")).toBeNull();
  });
});
