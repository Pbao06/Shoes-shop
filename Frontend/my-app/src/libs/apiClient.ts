/**
 * Lightweight, reusable API client for the entire frontend.
 *
 * - Reads the API base URL from `NEXT_PUBLIC_API_URL` (never hard-coded).
 * - Wraps the native `fetch` API — no external HTTP library.
 * - Supports GET, POST, PUT, PATCH, and DELETE.
 * - Automatically sets `Content-Type: application/json` when a JSON body is sent.
 * - Attaches `Authorization: Bearer <token>` for authenticated requests.
 *
 * Token retrieval is isolated behind a provider so authentication storage
 * (cookies, localStorage, React context, ...) can be implemented later without
 * touching this module. Login, register, and refresh-token logic are out of
 * scope here.
 */

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/** Options shared by every HTTP verb. */
export interface RequestOptions {
  /** Query parameters appended to the requested URL. */
  params?: Record<string, string | number | boolean | null | undefined>;
  /** Extra headers merged with the default ones. */
  headers?: HeadersInit;
  /** Enables request cancellation. */
  signal?: AbortSignal;
}

/** Thrown for any non-2xx HTTP response. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly data: unknown = null,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Extracts a human-readable message from a failed API response.
 *
 * The backend can return either its own envelope:
 *   { success: false, message: "Họ và tên là bắt buộc.", statusCode: 400 }
 *
 * or ASP.NET's automatic `ValidationProblemDetails` (returned BEFORE our
 * ExceptionMiddleware runs, when [ApiController] model validation fails):
 *   { title: "One or more validation errors occurred.",
 *     errors: { "Password": ["The field Password must be ... length of '6'."] } }
 */
function getErrorMessage(data: unknown, fallback: string): string {
  if (typeof data === "object" && data !== null) {
    const obj = data as Record<string, unknown>;

    if (typeof obj.message === "string" && obj.message.length > 0) {
      return obj.message;
    }

    const errors = obj.errors;
    if (errors !== null && typeof errors === "object") {
      const errorMessages = Object.values(errors)
        .flatMap((fieldErrors) =>
          Array.isArray(fieldErrors)
            ? fieldErrors.filter(
                (e): e is string => typeof e === "string",
              )
            : typeof fieldErrors === "string"
              ? [fieldErrors]
              : [],
        )
        .filter((e) => e.length > 0);

      if (errorMessages.length > 0) {
        return errorMessages.join("; ");
      }
    }

    if (typeof obj.title === "string" && obj.title.length > 0) {
      return obj.title;
    }
  }

  return fallback;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

let tokenProvider: (() => string | null) | null = null;

/**
 * Registers the function that resolves the current access token.
 *
 * Authentication storage is not implemented yet; call this once real auth
 * state exists. Until then, requests are sent without an Authorization header.
 */
export function setAccessTokenProvider(provider: () => string | null): void {
  tokenProvider = provider;
}

function getAccessToken(): string | null {
  return tokenProvider ? tokenProvider() : null;
}

function buildUrl(
  path: string,
  params?: RequestOptions["params"],
): string {
  const base = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;

  if (!params) return `${base}${path}`;

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  }

  const queryString = searchParams.toString();
  if (!queryString) return `${base}${path}`;

  const separator = path.includes("?") ? "&" : "?";
  return `${base}${path}${separator}${queryString}`;
}

async function request<T>(
  path: string,
  method: HttpMethod,
  options: RequestOptions = {},
  body?: unknown,
): Promise<T> {
  const headers = new Headers(options.headers);

  let payload: BodyInit | undefined;
  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
    payload = JSON.stringify(body);
  }

  const token = getAccessToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(path, options.params), {
    method,
    headers,
    body: payload,
    signal: options.signal,
  });

  if (!response.ok) {
    let data: unknown = null;
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      data = await response.json();
    }

    // Log the original response body so the exact server-side failure is
    // visible in the browser console during development.
    if (process.env.NODE_ENV !== "production") {
      console.error("[apiClient] Request failed:", {
        status: response.status,
        url: buildUrl(path, options.params),
        errorData: data,
      });
    }

    const message = getErrorMessage(
      data,
      `Request failed with status ${response.status}`,
    );

    throw new ApiError(response.status, message, data);
  }

  // No-content response (e.g. successful DELETE).
  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return (await response.json()) as T;
  }

  return (await response.text()) as T;
}

/** Typed HTTP client for the whole application. */
export const apiClient = {
  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>(path, "GET", options);
  },

  post<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return request<T>(path, "POST", options, body);
  },

  put<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return request<T>(path, "PUT", options, body);
  },

  patch<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return request<T>(path, "PATCH", options, body);
  },

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>(path, "DELETE", options);
  },
};

export default apiClient;