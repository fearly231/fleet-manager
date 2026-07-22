const isClient = typeof window !== "undefined";
const rawApiUrl = isClient
  ? (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000")
      : (process.env.NEXT_PUBLIC_API_URL || ""))
  : (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000");

export const API_URL = rawApiUrl.endsWith('/api/v1') 
  ? rawApiUrl 
  : rawApiUrl.replace(/\/+$/, '') + (rawApiUrl.endsWith('/api') ? "/v1" : "/api/v1");
