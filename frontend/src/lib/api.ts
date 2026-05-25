import { WorkerPublic } from "@/types/worker_types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiService {
  private get token(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  }

  private set token(value: string | null) {
    if (typeof window !== "undefined") {
      if (value) {
        localStorage.setItem("token", value);
      } else {
        localStorage.removeItem("token");
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = new Headers(options.headers);
    if (this.token) {
      headers.set("Authorization", `Bearer ${this.token}`);
    }
    if (!(options.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      this.token = null;
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Something went wrong");
    }

    return response.json();
  }

  async login(email: string, password: string): Promise<{ access_token: string; token_type: string }> {
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    const data = await this.request<{ access_token: string; token_type: string }>("/api/v1/login/access-token", {
      method: "POST",
      body: formData,
    });

    this.token = data.access_token;
    return data;
  }

  async logout() {
    this.token = null;
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  async register(name: string, email: string, password: string): Promise<WorkerPublic> {
    return this.request<WorkerPublic>("/api/v1/login/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  }

  async getCurrentUser(): Promise<WorkerPublic> {
    return this.request<WorkerPublic>("/api/v1/login/users/me");
  }

  async getVehicles(): Promise<any> {
    return this.request("/api/v1/vehicle/");
  }

  async createReservation(reservation: any): Promise<any> {
    return this.request("/api/v1/reservation/", {
      method: "POST",
      body: JSON.stringify(reservation),
    });
  }
}

export const api = new ApiService();
