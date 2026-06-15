import Constants from "expo-constants";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
  method?: HttpMethod;
  token?: string | null;
  body?: unknown;
};

type ExpoExtra = {
  apiBaseUrl?: string;
};

function getConfiguredBaseUrl() {
  const extra = (Constants.expoConfig?.extra ?? {}) as ExpoExtra;
  const configured = extra.apiBaseUrl?.trim();

  if (configured) {
    return configured.replace(/\/+$/, "");
  }

  const hostUri =
    Constants.expoConfig?.hostUri ??
    Constants.expoGoConfig?.debuggerHost ??
    null;
  const host = hostUri?.split(":")[0];

  if (host) {
    return `http://${host}:3000`;
  }

  return "http://192.168.1.10:3000";
}

export const API_BASE_URL = getConfiguredBaseUrl();

export async function apiRequest<T>(path: string, options: RequestOptions = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const message = await extractErrorMessage(response);
    throw new Error(message);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

async function extractErrorMessage(response: Response) {
  try {
    const data = (await response.json()) as { message?: string };
    return data.message ?? `Erreur API (${response.status})`;
  } catch {
    return `Erreur API (${response.status})`;
  }
}
