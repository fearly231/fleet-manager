const isClient = typeof window !== "undefined";
export const API_URL =
  (isClient
    ? (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000")
        : (process.env.NEXT_PUBLIC_API_URL || ""))
    : (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000")) + "/api/v1";
